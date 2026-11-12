'use client';

// 목록(CommentList)은 서버 컴포넌트라 입력칸(CommentForm)의 상태를 직접 바꿀 수 없다.
// 그래서 브라우저 이벤트로 "이 이름을 넣어 줘"라는 신호만 보내고, 입력칸이 받아서 처리한다.
export const MENTION_EVENT = 'comment-mention';

export default function CommentMentionButton({ name }: { name: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(MENTION_EVENT, { detail: name }))}
      className="text-xs text-gray-500 hover:text-[#111827]"
    >
      답글
    </button>
  );
}
