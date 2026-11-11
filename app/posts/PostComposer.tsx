'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition, type KeyboardEvent } from 'react';
import { createPostInlineAction } from '@/actions/postActions';

const MAX_LENGTH = 10000;

type Props = {
  // 지금 보고 있는 목록 페이지(0부터). "더보기"로 2페이지 이상을 보는 중이면 게시 후 첫 페이지로 돌아간다.
  currentPage: number;
  // 첫 페이지 주소 (전체 / 내가 쓴 글 탭을 유지한다)
  resetHref: string;
};

export default function PostComposer({ currentPage, resetHref }: Props) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();
  const empty = text.trim().length === 0;

  function submit() {
    if (pending || empty) return;
    startTransition(async () => {
      const result = await createPostInlineAction(text);
      if (result.message) {
        setMessage(result.message); // 실패하면 쓴 글은 그대로 남겨 둔다
        return;
      }
      setMessage('');
      setText('');
      if (currentPage > 0) router.replace(resetHref, { scroll: false });
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      aria-label="새 글 쓰기"
      className="flex flex-col gap-3 rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_3px_rgb(0_0_0_/_0.05)]"
    >
      <label htmlFor="post-composer" className="sr-only">
        새 글 내용
      </label>
      <textarea
        id="post-composer"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={onKeyDown}
        rows={3}
        maxLength={MAX_LENGTH}
        placeholder="지금 무슨 생각을 하고 계신가요?"
        className="w-full resize-none border-0 bg-transparent p-0 text-base leading-7 outline-none placeholder:text-[#9ca3af]"
      />
      <div className="flex items-center justify-between gap-3 border-t border-[#f3f4f6] pt-3">
        <span className="text-xs text-[#6b7280]" aria-live="off">
          {text.length}/{MAX_LENGTH} · Ctrl+Enter로 게시
        </span>
        <button
          type="submit"
          disabled={pending || empty}
          aria-busy={pending}
          className="rounded-full bg-[#111827] px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? '게시 중...' : '게시하기'}
        </button>
      </div>
      {message && (
        <p role="alert" className="text-sm text-red-600">
          {message}
        </p>
      )}
    </form>
  );
}
