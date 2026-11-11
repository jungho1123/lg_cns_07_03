import 'server-only';
import { ApiError } from '@/lib/apiError';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function springFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const base = process.env.SPRING_API_BASE_URL;
  if (!base) throw new Error('SPRING_API_BASE_URL 설정이 필요합니다.');
  const baseUrl = new URL(base);
  if (!['http:', 'https:'].includes(baseUrl.protocol)) {
    throw new Error('SPRING_API_BASE_URL 프로토콜이 잘못되었습니다.');
  }
  const target = new URL(path, baseUrl);
  if (target.origin !== baseUrl.origin) {
    throw new Error('허용되지 않은 API 주소입니다.');
  }
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body !== undefined && init.body !== null) {
    headers.set('Content-Type', 'application/json');
  }
  try {
    return await fetch(target, {
      ...init,
      headers,
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    throw new ApiError(timedOut ? 504 : 503, 'API 연결에 실패했습니다.');
  }
}

export async function readApiData<T>(
  response: Response,
  parseData: (data: unknown) => T,
): Promise<T> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(
      response.ok ? 502 : response.status,
      '서버 응답 형식이 올바르지 않습니다.',
    );
  }
  if (!response.ok) {
    const message =
      isRecord(body) && typeof body.message === 'string'
        ? body.message
        : '요청에 실패했습니다.';
    const code =
      isRecord(body) && typeof body.code === 'string' ? body.code : undefined;
    throw new ApiError(response.status, message, code);
  }
  if (
    !isRecord(body) ||
    body.success !== true ||
    typeof body.message !== 'string'
  ) {
    throw new ApiError(502, '서버 응답 형식이 올바르지 않습니다.');
  }
  // Void 응답은 data를 생략할 수 있다. 필요한 데이터는 각 파서가 검증한다.
  return parseData(body.data);
}
