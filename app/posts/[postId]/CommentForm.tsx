// 뼈대: 아직 서버 액션(commentActions)과 연결 전. 등록해도 아무 일도 일어나지 않는다.
export default function CommentForm() {
  return (
    <form className="mt-6 space-y-2">
      <label htmlFor="comment-content" className="text-sm font-medium">
        댓글 쓰기
      </label>
      <textarea
        id="comment-content"
        name="content"
        rows={3}
        maxLength={2000}
        required
        placeholder="댓글을 입력하세요"
        className="w-full rounded border p-2"
      />
      <button type="submit" className="rounded bg-black px-4 py-2 text-sm text-white">
        등록
      </button>
    </form>
  );
}
