import 'server-only';
import { z } from 'zod';
import { matchApiUrl } from '@/config/apiuri';
import { ApiError } from '@/lib/apiError';
import { authenticatedRequest } from '@/lib/auth/authenticatedRequest';
import { readApiData } from '@/lib/fetchClients';

export type PostLikeData = { liked: boolean; likeCount: number };

// 2026-11-12 Swagger 실응답 기준: { liked: true, likeCount: 1 }
const postLikeSchema: z.ZodType<PostLikeData> = z.object({
  liked: z.boolean(),
  likeCount: z.number().int().safe().nonnegative(),
});

function parsePostLike(value: unknown): PostLikeData {
  const parsed = postLikeSchema.safeParse(value);
  if (!parsed.success) throw new ApiError(502, '좋아요 응답 형식이 올바르지 않습니다.');
  return parsed.data;
}

// 좋아요 토글: 안 눌렀으면 누르고, 눌렀으면 취소한다. 바뀐 뒤의 최종 상태를 돌려준다.
// authenticatedRequest는 서버 액션에서만 쓸 수 있다.
export async function togglePostLike(postId: number): Promise<PostLikeData> {
  const response = await authenticatedRequest(matchApiUrl.postRead.like(postId), {
    method: 'POST',
  });
  return readApiData(response, parsePostLike);
}
