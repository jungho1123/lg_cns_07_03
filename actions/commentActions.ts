'use server';

import { refresh } from 'next/cache';
import { z } from 'zod';
import { AuthExpiredError, publicErrorMessage } from '@/lib/apiError';
import { createComment } from '@/service/spring/commentService';

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
