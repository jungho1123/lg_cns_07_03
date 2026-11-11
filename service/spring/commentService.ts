import 'server-only';
import { z } from 'zod';
import { matchApiUrl } from '@/config/apiuri';
import { ApiError } from '@/lib/apiError';
import { authenticatedRequest } from '@/lib/auth/authenticatedRequest';
import { readApiData, springFetch } from '@/lib/fetchClients';
import type { CommentItem } from '@/types/response/commentResponse';

const commentSchema: z.ZodType<CommentItem> = z.object({
  id: z.number(),
  postId: z.number(),
  content: z.string(),
  author: z.object({
    id: z.number(),
    name: z.string(),
    avatarUrl: z.string().nullable(),
  }),
  createdAt: z.string(),
});

function parseWith<T>(schema: z.ZodType<T>) {
  return (value: unknown): T => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) throw new ApiError(502, '댓글 응답 형식이 올바르지 않습니다.');
    return parsed.data;
  };
}

// 확인 필요: 로그인 없이 목록 조회가 되는지. 401이 오면 서버 컴포넌트용 인증 호출 방법을 1번과 정한다.
export async function getComments(postId: number): Promise<CommentItem[]> {
  const response = await springFetch(matchApiUrl.comment.list(postId));
  return readApiData(response, parseWith(z.array(commentSchema)));
}

// authenticatedRequest는 서버 액션에서만 쓸 수 있다
export async function createComment(postId: number, content: string): Promise<CommentItem> {
  const response = await authenticatedRequest(matchApiUrl.comment.list(postId), {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  return readApiData(response, parseWith(commentSchema));
}

export async function deleteComment(postId: number, commentId: number): Promise<void> {
  const response = await authenticatedRequest(matchApiUrl.comment.detail(postId, commentId), {
    method: 'DELETE',
  });
  await readApiData(response, () => undefined);
}
