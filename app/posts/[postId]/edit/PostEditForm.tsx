'use client';

import Link from 'next/link';
import { useActionState, useState, type KeyboardEvent } from 'react';
import { updatePostAction, type PostFormState } from '@/actions/postActions';

const TITLE_MAX = 200;
const CONTENT_MAX = 10000; // 서버 액션(postActions)의 최대 길이와 같게 맞춘다

type Props = {
  postId: string;
  title: string; // 제목이 없는 글이면 빈 문자열
  content: string;
};

export default function PostEditForm({ postId, title, content }: Props) {
  const initialState: PostFormState = { message: '', title, content };
  const [state, formAction, pending] = useActionState(updatePostAction, initialState);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentContent, setCurrentContent] = useState(content);

  // 제목이 있던 글만 제목 칸을 보여 준다. 제목 없는 글(작성창으로 쓴 글)은 본문만 고친다.
  const hasTitle = title.length > 0;
  const empty = currentContent.trim().length === 0 || (hasTitle && currentTitle.trim().length === 0);
  const unchanged = currentContent === content && currentTitle === title;

  // Ctrl+Enter(Mac은 Cmd+Enter)로 저장한다
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      if (!pending && !empty && !unchanged) event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form action={formAction} className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="postId" value={postId} />

      {hasTitle && (
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            제목
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={TITLE_MAX}
            value={currentTitle}
            onChange={(event) => setCurrentTitle(event.target.value)}
            className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-base outline-none focus-visible:border-[#111827]"
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          {hasTitle ? '본문' : '내용'}
        </label>
        <textarea
          id="content"
          name="content"
          required
          maxLength={CONTENT_MAX}
          rows={8}
          value={currentContent}
          onChange={(event) => setCurrentContent(event.target.value)}
          onKeyDown={onKeyDown}
          className="w-full resize-none rounded-2xl border border-[#e5e7eb] bg-white p-4 text-base leading-7 outline-none focus-visible:border-[#111827]"
        />
      </div>

      {state.message && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-gray-500" aria-live="off">
          {currentContent.length}/{CONTENT_MAX} · Ctrl+Enter로 저장
        </span>
        <div className="flex items-center gap-2">
          <Link
            href={`/posts/${postId}`}
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={pending || empty || unchanged}
            aria-busy={pending}
            className="rounded-full bg-[#111827] px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </form>
  );
}
