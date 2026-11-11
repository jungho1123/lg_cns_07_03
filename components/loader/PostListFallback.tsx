export default function PostListFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border bg-white p-5 space-y-3"
        >
          {/* 제목 */}
          <div className="h-5 w-1/3 rounded bg-gray-200" />

          {/* 본문 */}
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />

          {/* 작성자 및 날짜 */}
          <div className="flex gap-3 pt-2">
            <div className="h-3 w-20 rounded bg-gray-200" />
            <div className="h-3 w-24 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}