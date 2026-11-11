'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition, type KeyboardEvent } from 'react';
import { createPostInlineAction } from '@/actions/postActions';

const MAX_LENGTH = 10000;
const NOTICE_MS = 2500; // "게시되었습니다"를 보여 주는 시간

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
  const [notice, setNotice] = useState('');
  const [pending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const empty = text.trim().length === 0;

  function showNotice() {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    setNotice('게시되었습니다');
    noticeTimer.current = setTimeout(() => setNotice(''), NOTICE_MS);
  }

  function submit() {
    if (pending || empty) return;
    setNotice('');
    startTransition(async () => {
      const result = await createPostInlineAction(text);
      if (result.message) {
        setMessage(result.message); // 실패하면 쓴 글은 그대로 남겨 둔다
        return;
      }
      setMessage('');
      setText('');
      showNotice();
      textareaRef.current?.focus(); // 버튼에 남은 포커스를 입력창으로 돌려 연달아 쓸 수 있게 한다
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
        ref={textareaRef}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          if (message) setMessage(''); // 다시 입력을 시작하면 이전 오류는 지운다
        }}
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
      {/* 화면 아래쪽에 잠깐 떴다 사라지는 알림(토스트). 클릭을 가로채지 않고(pointer-events-none),
          헤더/사이드바(z-50)보다 위에 보이도록 z-[60]을 쓴다.
          알림 칸(role=status)은 항상 존재해야 스크린리더가 내용 변화를 읽어 준다. */}
      <div
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
      >
        {notice && (
          <p className="animate-in fade-in slide-in-from-bottom-2 rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white shadow-lg duration-200">
            {notice}
          </p>
        )}
      </div>
    </form>
  );
}
