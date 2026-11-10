import 'server-only';
import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { AuthExpiredError, AuthRefreshRequiredError } from '@/lib/apiError';
import { getAuthCookieSettings } from '@/lib/auth/settings';
import { isAccessTokenExpired } from '@/lib/auth/token';

export async function requireAuthToken() {
  const { secret, secureCookie, authUrl } = getAuthCookieSettings();
  const jar = await cookies();
  const token = await getToken({
    req: new Request(authUrl, { headers: { cookie: jar.toString() } }),
    secret,
    secureCookie,
  });
  if (
    !token ||
    token.authError ||
    !token.accessToken ||
    !token.refreshToken ||
    token.accessExpiresAt === undefined ||
    !token.profile ||
    !token.sessionExpiresAt ||
    Date.now() >= token.sessionExpiresAt
  ) {
    throw new AuthExpiredError();
  }
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    accessExpiresAt: token.accessExpiresAt,
    profile: token.profile,
    sessionExpiresAt: token.sessionExpiresAt,
  };
}

export async function requireCurrentUser() {
  const token = await requireAuthToken();
  if (isAccessTokenExpired(token, Date.now())) {
    throw new AuthRefreshRequiredError();
  }
  return token.profile;
}
