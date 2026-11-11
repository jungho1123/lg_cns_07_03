'use client';

import { useActionState } from 'react';
import { deleteCommentAction, type CommentDeleteState } from '@/actions/commentActions';

type Props = { postId: number; commentId: number };

export default function CommentDeleteButton({ postId, commentId }: Props) {
  const [state, formAction, pending] = useActionState<CommentDeleteState>(
    () => deleteCommentAction(postId, commentId),
    { message: '' },
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm('이 댓글을 삭제할까요?')) event.preventDefault();
      }}
      className="inline"
    >
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-gray-500 hover:text-red-600 disabled:opacity-50"
      >
        {pending ? '삭제 중...' : '삭제'}
      </button>
      {state.message && (
        <span role="alert" className="ml-2 text-xs text-red-600">
          {state.message}
        </span>
      )}
    </form>
  );
}
