// 글 상세의 "수정", "삭제" 버튼 (모양만 있고 아직 동작은 연결하지 않았다).
// 내 글일 때만 상세 화면이 이 컴포넌트를 그린다. 기능을 연결할 때 onClick/폼 동작을 여기에 붙인다.
export default function PostActions() {
  return (
    <div className="flex shrink-0 items-center gap-1 text-sm">
      <button
        type="button"
        aria-label="글 수정"
        className="rounded-full px-3 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      >
        수정
      </button>
      <button
        type="button"
        aria-label="글 삭제"
        className="rounded-full px-3 py-1.5 text-gray-600 hover:bg-red-50 hover:text-red-600"
      >
        삭제
      </button>
    </div>
  );
}
