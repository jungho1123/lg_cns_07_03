import 'server-only';
import { unstable_update } from '@/auth';
import { AuthExpiredError } from '@/lib/apiError';
import { requireAuthToken } from '@/lib/currentUser';
import { springFetch } from '@/lib/fetchClients';
import { isAccessTokenExpired } from '@/lib/auth/token';

// 쿠키를 쓸 수 있는 Server Action 또는 Route Handler에서만 호출한다.
export async function authenticatedRequest(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const session = await unstable_update({});
  if (!session || session.authError) throw new AuthExpiredError();

  // update가 반영한 쿠키를 다시 읽어 새 토큰을 사용한다.
  const token = await requireAuthToken();
  if (isAccessTokenExpired(token, Date.now())) throw new AuthExpiredError();
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token.accessToken}`);
  const response = await springFetch(path, { ...init, headers });
  if (response.status === 401) {
    await response.body?.cancel();
    throw new AuthExpiredError();
  }
  return response;
}
