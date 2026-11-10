import 'server-only';

export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

export function getAuthCookieSettings() {
  const secret = process.env.AUTH_SECRET;
  const authUrl = process.env.AUTH_URL;
  if (!secret || !authUrl) {
    throw new Error('AUTH_SECRET과 AUTH_URL 설정이 필요합니다.');
  }
  const url = new URL(authUrl);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('AUTH_URL 프로토콜이 잘못되었습니다.');
  }
  return { secret, secureCookie: url.protocol === 'https:', authUrl };
}
