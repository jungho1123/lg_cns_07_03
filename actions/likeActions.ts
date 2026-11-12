'use server';

import { refresh } from 'next/cache';
import { ApiError, AuthExpiredError, publicErrorMessage } from '@/lib/apiError';
import { togglePostLike } from '@/service/spring/likeService';

export type PostLikeResult =
  | { ok: true; liked: boolean; likeCount: number }
  | { ok: false; message: string };

// 글 번호는 브라우저가 바꿔 보낼 수 있으므로 숫자인지 다시 확인한다.
// 성공하면 서버가 알려 준 최종 상태(눌렀는지, 좋아요 수)를 돌려주고, 화면 데이터는 refresh()로 새로 받는다.
export async function togglePostLikeAction(postId: number): Promise<PostLikeResult> {
  if (!Number.isSafeInteger(postId) || postId < 1) {
    return { ok: false, message: '게시글 번호가 올바르지 않습니다.' };
  }
  let data;
  try {
    data = await togglePostLike(postId);
  } catch (error) {
    if (error instanceof AuthExpiredError) return { ok: false, message: error.message };
    if (error instanceof ApiError && error.status === 404) {
      return { ok: false, message: '게시글을 찾을 수 없습니다.' };
    }
    return { ok: false, message: publicErrorMessage(error) };
  }
  refresh();
  return { ok: true, liked: data.liked, likeCount: data.likeCount };
}
