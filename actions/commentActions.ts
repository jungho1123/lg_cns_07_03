'use server';

import { refresh } from 'next/cache';
import { z } from 'zod';
import { ApiError, AuthExpiredError, publicErrorMessage } from '@/lib/apiError';
import { createComment, deleteComment, toggleCommentLike } from '@/service/spring/commentService';

export type CommentFormState = { message: string; content: string };

const contentSchema = z
  .string({ error: '댓글 내용을 입력해 주세요.' })
  .trim()
  .min(1, '댓글 내용을 입력해 주세요.')
  .max(2000, '댓글은 2000자까지 쓸 수 있습니다.');

// postId는 화면에서 bind로 넘어오므로 브라우저가 바꿔 보낼 수 있다. 숫자인지 다시 확인한다.
export async function createCommentAction(
  postId: number,
  _previous: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const raw = formData.get('content');
  const content = typeof raw === 'string' ? raw : '';
  if (!Number.isSafeInteger(postId) || postId < 1) {
    return { message: '게시글 번호가 올바르지 않습니다.', content };
  }
  const parsed = contentSchema.safeParse(content);
  if (!parsed.success) return { message: parsed.error.issues[0].message, content };

  try {
    await createComment(postId, parsed.data);
  } catch (error) {
    const message =
      error instanceof AuthExpiredError ? error.message : publicErrorMessage(error);
    return { message, content };
  }
  refresh();
  return { message: '', content: '' };
}

export type CommentDeleteState = { message: string };

// 삭제 버튼은 내 댓글에만 보이지만, 최종 판단은 서버가 토큰으로 한다(남의 댓글이면 403).
export async function deleteCommentAction(
  postId: number,
  commentId: number,
): Promise<CommentDeleteState> {
  if (![postId, commentId].every((id) => Number.isSafeInteger(id) && id > 0)) {
    return { message: '댓글 번호가 올바르지 않습니다.' };
  }
  try {
    await deleteComment(postId, commentId);
  } catch (error) {
    if (error instanceof AuthExpiredError) return { message: error.message };
    if (error instanceof ApiError && error.status === 403) {
      return { message: '내가 쓴 댓글만 삭제할 수 있습니다.' };
    }
    return { message: publicErrorMessage(error) };
  }
  refresh();
  return { message: '' };
}

export type CommentLikeState = { message: string };

// 누르기와 취소를 서버가 알아서 번갈아 처리하므로, 화면은 "눌렀다"만 알리면 된다.
export async function toggleCommentLikeAction(
  postId: number,
  commentId: number,
): Promise<CommentLikeState> {
  if (![postId, commentId].every((id) => Number.isSafeInteger(id) && id > 0)) {
    return { message: '댓글 번호가 올바르지 않습니다.' };
  }
  try {
    await toggleCommentLike(postId, commentId);
  } catch (error) {
    if (error instanceof AuthExpiredError) return { message: error.message };
    return { message: publicErrorMessage(error) };
  }
  refresh();
  return { message: '' };
}
