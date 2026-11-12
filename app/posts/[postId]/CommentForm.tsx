'use client';

import { useEffect, useRef, useState, useTransition, type KeyboardEvent } from 'react';
import { createCommentAction } from '@/actions/commentActions';
import { Toast } from '@/components/atoms/Toast';
import { useNotice } from '@/hooks/useNotice';
import { MENTION_EVENT } from './CommentMentionButton';

const MAX_LENGTH = 2000; // 서버 액션(commentActions)의 댓글 최대 길이와 같게 맞춘다

export default function CommentForm({ postId }: { postId: number }) {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();
  const { notice, show, clear } = useNotice();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const empty = text.trim().length === 0;

  // "답글" 버튼 신호를 받으면 맨 앞에 @이름을 넣는다. 이미 다른 @이름이 맨 앞에 있으면 바꿔 끼운다.
  useEffect(() => {
    function onMention(event: Event) {
      const name = (event as CustomEvent<string>).detail;
      setText((prev) => `@${name} ${prev.replace(/^@\S+\s*/, '')}`.slice(0, MAX_LENGTH));
      textareaRef.current?.focus();
    }
    window.addEventListener(MENTION_EVENT, onMention);
    return () => window.removeEventListener(MENTION_EVENT, onMention); // 화면을 떠나면 듣기를 멈춘다
  }, []);

  function submit() {
    if (pending || empty) return;
    clear();
    startTransition(async () => {
      // 서버 액션은 폼 데이터(FormData)를 받는 형태라 그대로 맞춰서 부른다. 성공하면 서버가 목록을 새로 가져온다(refresh).
      const formData = new FormData();
      formData.set('content', text);
      const result = await createCommentAction(postId, { message: '', content: '' }, formData);
      if (result.message) {
        setMessage(result.message); // 실패하면 쓴 댓글은 그대로 남겨 둔다
        return;
      }
      setMessage('');
      setText('');
      show('댓글이 등록되었습니다');
      textareaRef.current?.focus();
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
      className="mt-6 space-y-3"
    >
      <label htmlFor="comment-content" className="text-sm font-medium">
        댓글 쓰기
      </label>
      <textarea
        id="comment-content"
        ref={textareaRef}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          if (message) setMessage(''); // 다시 입력을 시작하면 이전 오류는 지운다
        }}
        onKeyDown={onKeyDown}
        rows={3}
        maxLength={MAX_LENGTH}
        placeholder="댓글을 입력하세요"
        className="w-full resize-none rounded-2xl border border-[#e5e7eb] bg-white p-3 text-base leading-7 outline-none placeholder:text-[#9ca3af] focus-visible:border-[#111827]"
      />
      {message && (
        <p role="alert" className="text-sm text-red-600">
          {message}
        </p>
      )}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-gray-500" aria-live="off">
          {text.length}/{MAX_LENGTH} · Ctrl+Enter로 등록
        </span>
        <button
          type="submit"
          disabled={pending || empty}
          aria-busy={pending}
          className="rounded-full bg-[#111827] px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? '등록 중...' : '등록'}
        </button>
      </div>
      <Toast message={notice} />
    </form>
  );
}
