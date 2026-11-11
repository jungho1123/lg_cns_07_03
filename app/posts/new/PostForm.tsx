'use client';

import { useActionState } from 'react';
import { createPostAction, type PostFormState } from '@/actions/postActions';

const initialState: PostFormState = { message: '', title: '', content: '' };

export default function PostForm() {
  const [state, formAction, pending] = useActionState(createPostAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="post-title" className="text-sm font-medium">
          제목 <span className="text-gray-500">(선택)</span>
        </label>
        {/* 제출 후 React가 입력칸을 비우므로, 실패하면 쓴 내용을 defaultValue로 되살린다 */}
        <input
          id="post-title"
          name="title"
          type="text"
          maxLength={200}
          defaultValue={state.title}
          placeholder="제목을 입력하세요"
          className="w-full rounded border p-2"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="post-content" className="text-sm font-medium">
          내용
        </label>
        <textarea
          id="post-content"
          name="content"
          rows={10}
          maxLength={10000}
          required
          defaultValue={state.content}
          placeholder="내용을 입력하세요"
          className="w-full rounded border p-2"
        />
      </div>
      {state.message && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {pending ? '등록 중...' : '등록'}
      </button>
    </form>
  );
}
