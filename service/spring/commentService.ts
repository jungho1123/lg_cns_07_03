import 'server-only';
import { z } from 'zod';
import { matchApiUrl } from '@/config/apiuri';
import { ApiError, AuthRefreshRequiredError } from '@/lib/apiError';
import { authenticatedRequest } from '@/lib/auth/authenticatedRequest';
import { isAccessTokenExpired } from '@/lib/auth/token';
import { requireAuthToken } from '@/lib/currentUser';
import { readApiData, springFetch } from '@/lib/fetchClients';
import type { CommentItem, CommentLikedMeResponse } from '@/types/response/commentResponse';

// 서버가 실제로 보내는 댓글 모양. likedByMe는 서버가 안 보내므로 여기서 뺀다.
type CommentFromServer = Omit<CommentItem, 'likedByMe'>;

const likedMeSchema: z.ZodType<CommentLikedMeResponse> = z.object({
  likedCommentIds: z.array(z.number()),
});

const commentSchema: z.ZodType<CommentFromServer> = z.object({
  id: z.number(),
  postId: z.number(),
  content: z.string(),
  author: z.object({
    id: z.number(),
    name: z.string(),
    avatarUrl: z.string().nullable(),
  }),
  createdAt: z.string(),
  likeCount: z.number(),
});

function parseWith<T>(schema: z.ZodType<T>) {
  return (value: unknown): T => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) throw new ApiError(502, '댓글 응답 형식이 올바르지 않습니다.');
    return parsed.data;
  };
}

// 화면(서버 컴포넌트)에서 부르므로 authenticatedRequest 대신 토큰을 직접 붙인다 (postReadService와 같은 방식)
export async function getComments(postId: number): Promise<CommentItem[]> {
  const token = await requireAuthToken();
  if (isAccessTokenExpired(token, Date.now())) throw new AuthRefreshRequiredError();
  const headers = { Authorization: `Bearer ${token.accessToken}` };
  // 댓글 목록과 "내가 좋아요한 댓글 ID"를 동시에 부른다(순서대로 부르면 그만큼 느려진다)
  const [comments, likedMe] = await Promise.all([
    springFetch(matchApiUrl.comment.list(postId), { headers }).then((response) =>
      readApiData(response, parseWith(z.array(commentSchema))),
    ),
    springFetch(matchApiUrl.comment.likedByMe(postId), { headers }).then((response) =>
      readApiData(response, parseWith(likedMeSchema)),
    ),
  ]);
  const likedIds = new Set(likedMe.likedCommentIds);
  return comments.map((comment) => ({ ...comment, likedByMe: likedIds.has(comment.id) }));
}

// authenticatedRequest는 서버 액션에서만 쓸 수 있다
export async function createComment(postId: number, content: string): Promise<CommentFromServer> {
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

// 응답(바뀐 좋아요 수)은 쓰지 않는다. 액션이 refresh()로 목록을 다시 받아 오면 새 숫자가 함께 온다.
export async function toggleCommentLike(postId: number, commentId: number): Promise<void> {
  const response = await authenticatedRequest(matchApiUrl.comment.like(postId, commentId), {
    method: 'POST',
  });
  await readApiData(response, () => undefined);
}
