'use client';

import { useActionState } from 'react';
import { createCommentAction, type CommentFormState } from '@/actions/commentActions';

const initialState: CommentFormState = { message: '', content: '' };

export default function CommentForm({ postId }: { postId: number }) {
  const [state, formAction, pending] = useActionState(
    createCommentAction.bind(null, postId),
    initialState,
  );

  return (
    <form action={formAction} className="mt-6 space-y-2">
      <label htmlFor="comment-content" className="text-sm font-medium">
        댓글 쓰기
      </label>
      {/* 제출 후 React가 입력칸을 비우므로, 실패하면 쓴 내용을 defaultValue로 되살린다 */}
      <textarea
        id="comment-content"
        name="content"
        rows={3}
        maxLength={2000}
        required
        defaultValue={state.content}
        placeholder="댓글을 입력하세요"
        className="w-full rounded border p-2"
      />
      {state.message && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {pending ? '등록 중...' : '등록'}
      </button>
    </form>
  );
}
