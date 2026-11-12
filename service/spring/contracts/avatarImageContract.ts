import 'server-only';

import { ApiError } from '@/lib/apiError';

export type AvatarImage = {
  body: ReadableStream<Uint8Array>;
  contentType: string;
};

export async function parseAvatarImageResponse(
  response: Response,
): Promise<AvatarImage> {
  if (!response.ok) {
    await response.body?.cancel();
    throw new ApiError(response.status, '아바타 이미지를 가져오지 못했습니다.');
  }

  const contentType = response.headers.get('content-type');
  if (!response.body || !contentType?.toLowerCase().startsWith('image/')) {
    await response.body?.cancel();
    throw new ApiError(502, '아바타 이미지 응답 형식이 올바르지 않습니다.');
  }

  return {
    body: response.body,
    contentType,
  };
}
