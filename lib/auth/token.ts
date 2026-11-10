import 'server-only';
import type { AuthData, AuthUser } from '@/types/response/authResponse';

export type AuthFailure = 'RefreshTokenError' | 'SESSION_EXPIRED';

export interface SpringTokenState {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: number;
  profile: AuthUser;
}

export interface SpringJwtState {
  accessToken?: string;
  refreshToken?: string;
  accessExpiresAt?: number;
  profile?: AuthUser;
  sessionExpiresAt?: number;
  authError?: AuthFailure;
}

export const REFRESH_SKEW_MS = 30_000;

export function isAccessTokenExpired(
  token: SpringJwtState,
  now: number,
): boolean {
  return (
    token.accessExpiresAt === undefined ||
    now >= token.accessExpiresAt - REFRESH_SKEW_MS
  );
}

export function toTokenState(
  data: AuthData,
  issuedAt: number,
): SpringTokenState {
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    accessExpiresAt: issuedAt + data.expiresIn * 1000,
    profile: {
      userId: data.userId,
      email: data.email,
      name: data.name,
      role: data.role,
      platformRole: data.platformRole,
      avatarUrl: data.avatarUrl,
      presenceStatus: data.presenceStatus,
      statusMessage: data.statusMessage,
      accountStatus: data.accountStatus,
      companyId: data.companyId,
    },
  };
}

export async function refreshJwt(
  token: SpringJwtState,
  deps: {
    refreshTokens: (refreshToken: string) => Promise<AuthData>;
    now: () => number;
  },
): Promise<SpringJwtState> {
  if (token.authError) return { authError: token.authError };
  if (
    !token.accessToken ||
    !token.refreshToken ||
    !token.profile ||
    !token.sessionExpiresAt ||
    deps.now() >= token.sessionExpiresAt
  ) {
    return { authError: 'SESSION_EXPIRED' };
  }
  if (!isAccessTokenExpired(token, deps.now())) return token;

  try {
    const issuedAt = deps.now();
    const data = await deps.refreshTokens(token.refreshToken);
    if (deps.now() >= token.sessionExpiresAt) {
      return { authError: 'SESSION_EXPIRED' };
    }
    return {
      ...toTokenState(data, issuedAt),
      sessionExpiresAt: token.sessionExpiresAt,
    };
  } catch {
    return { authError: 'RefreshTokenError' };
  }
}
