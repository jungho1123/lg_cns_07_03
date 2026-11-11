import { Skeleton } from "@/components/ui/skeleton";

export default function PostDetailFallback() {
  return (
    <main
      className="mx-auto w-full max-w-5xl px-6 py-8"
      aria-busy="true"
    >
      {/* 게시글 제목 */}
      <div className="mb-6 space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* 작성자 정보 */}
      <div className="flex items-center gap-3 border-b py-5">
        <Skeleton className="h-10 w-10 rounded-full" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* 게시글 본문 */}
      <div className="space-y-3 py-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-40 w-full mt-6" />
      </div>

      {/* 댓글 영역 */}
      <div className="border-t pt-6 space-y-4">
        <Skeleton className="h-6 w-24" />

        {[1, 2, 3].map((item) => (
          <div key={item} className="flex gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}