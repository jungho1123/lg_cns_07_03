import 'server-only';
import { matchApiUrl } from '@/config/apiuri';
import { AuthRefreshRequiredError } from '@/lib/apiError';
import { requireAuthToken } from '@/lib/currentUser';
import { isAccessTokenExpired } from '@/lib/auth/token';
import { readApiData, springFetch } from '@/lib/fetchClients';
import type { PasswordChangeInput } from '@/types/response/passwordResponse';

export async function changePassword(input: PasswordChangeInput): Promise<void> {
  const token = await requireAuthToken();
  if (isAccessTokenExpired(token, Date.now())) throw new AuthRefreshRequiredError();
  const response = await springFetch(matchApiUrl.user.password, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token.accessToken}` },
    body: JSON.stringify(input),
  });
  // Swagger 실응답: { success: true, message: 'OK' }, data 없음.
  await readApiData(response, () => undefined);
}
