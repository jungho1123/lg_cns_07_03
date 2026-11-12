'use client';

import { useActionState } from 'react';
import { toggleCommentLikeAction, type CommentLikeState } from '@/actions/commentActions';

type Props = { postId: number; commentId: number; likeCount: number; likedByMe: boolean };

// 삭제 버튼(CommentDeleteButton)과 같은 구조: 누르면 서버 액션 → 성공하면 서버가 목록을 다시 그린다.
export default function CommentLikeButton({ postId, commentId, likeCount, likedByMe }: Props) {
  const [state, formAction, pending] = useActionState<CommentLikeState>(
    () => toggleCommentLikeAction(postId, commentId),
    { message: '' },
  );

  return (
    <form action={formAction} className="inline">
      <button
        type="submit"
        disabled={pending}
        aria-pressed={likedByMe}
        aria-label={`좋아요 ${likeCount}개${likedByMe ? ', 내가 누름' : ''}`}
        className={`text-xs disabled:opacity-50 ${likedByMe ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
      >
        {likedByMe ? '♥' : '♡'} {likeCount}
      </button>
      {state.message && (
        <span role="alert" className="ml-2 text-xs text-red-600">
          {state.message}
        </span>
      )}
    </form>
  );
}
