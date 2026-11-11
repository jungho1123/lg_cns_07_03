import 'server-only';
import { z } from 'zod';
import { matchApiUrl } from '@/config/apiuri';
import { ApiError } from '@/lib/apiError';
import { readApiData, springFetch } from '@/lib/fetchClients';
import type {
  AuthData,
  LoginInput,
  SignupInput,
} from '@/types/response/authResponse';

// 검사만 하고 토큰 원문을 trim하거나 변환하지 않는다.
const nonemptyText = z.string().refine((value) => value.trim().length > 0);

const authDataSchema: z.ZodType<AuthData> = z.object({
  accessToken: nonemptyText,
  refreshToken: nonemptyText,
  expiresIn: z.number().positive(),
  tokenType: z.string().refine((value) => value.toLowerCase() === 'bearer'),
  userId: z.number(),
  email: z.string(),
  name: z.string(),
  role: z.enum(['STUDENT', 'MENTOR', 'INSTRUCTOR', 'OPERATOR']),
  platformRole: z.enum(['USER', 'COMPANY_ADMIN', 'PLATFORM_ADMIN']),
  avatarUrl: z.string().nullable(),
  presenceStatus: z.enum(['ONLINE', 'AWAY', 'BUSY', 'OFFLINE']),
  statusMessage: z.string().nullable(),
  accountStatus: z.enum(['PENDING_APPROVAL', 'ACTIVE', 'REJECTED']),
  companyId: z.number().nullable(),
});

export function parseAuthData(value: unknown): AuthData {
  const parsed = authDataSchema.safeParse(value);
  if (!parsed.success) {
    // Zod 오류 원문에는 인증 응답 정보를 포함할 수 있어 외부로 전달하지 않는다.
    throw new ApiError(502, '인증 응답 형식이 올바르지 않습니다.');
  }
  return parsed.data;
}

export async function login(input: LoginInput): Promise<AuthData> {
  const response = await springFetch(matchApiUrl.auth.login, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return readApiData(response, parseAuthData);
}

export async function refresh(refreshToken: string): Promise<AuthData> {
  const response = await springFetch(matchApiUrl.auth.refresh, {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
  return readApiData(response, parseAuthData);
}
export async function logout(accessToken: string): Promise<void> {
  const response = await springFetch(matchApiUrl.auth.logout, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  await readApiData(response, () => undefined);
}

export async function signup(input: SignupInput): Promise<AuthData> {
  const response = await springFetch(matchApiUrl.auth.signup, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return readApiData(response, parseAuthData);
}
