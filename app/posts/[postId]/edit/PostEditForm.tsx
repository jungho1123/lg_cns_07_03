'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import {
  updatePostAction,
  type PostFormState,
} from '@/actions/postActions';

type Props = {
  postId: string;
  title: string;
  content: string;
};

export default function PostEditForm({ postId, title, content }: Props) {
  const initialState: PostFormState = {
    message: '',
    title,
    content,
  };

  const [state, formAction, pending] = useActionState(
    updatePostAction,
    initialState,
  );
  const [currentContent, setCurrentContent] = useState(content);

  return (
    <form action={formAction} className="space-y-5 rounded-3xl border bg-white p-6">
      <input type="hidden" name="postId" value={postId} />
      {/* 수정 API가 제목과 본문을 함께 받으므로 기존 제목을 화면에 표시하지 않고 전송한다. */}
      <input type="hidden" name="title" value={title} />

      <div className="space-y-2">
        <label htmlFor="content" className="block font-semibold">본문</label>
        <textarea
          id="content"
          name="content"
          required
          maxLength={10000}
          rows={12}
          value={currentContent}
          onChange={event => setCurrentContent(event.target.value)}
          className="w-full rounded-xl border px-4 py-3 leading-7"
        />
      </div>

      {state.message && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700">
          {state.message}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          {pending ? '저장 중...' : '수정 저장'}
        </button>
        <Link
          href={`/posts/${postId}`}
          className="rounded-xl border px-5 py-3 font-semibold"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
