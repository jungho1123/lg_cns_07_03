import { Skeleton } from "@/components/ui/skeleton";

export default function PostDetailFallback() {
   return (
    <div className="mx-auto w-full max-w-[660px]">
      {/* 목록으로 돌아가기 */}
      <Skeleton className="mb-5 h-4 w-20" />

      {/* 게시글 카드 */}
      <div className="rounded-[20px] border border-gray-200 bg-white p-6 shadow-sm">
        {/* 작성자 정보 */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        <div className="my-5 border-t border-gray-100" />

        {/* 게시글 내용 */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-3/4" />
        </div>

        {/* 좋아요 / 댓글 */}
        <div className="mt-6 flex gap-4">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
        </div>

        <div className="my-6 border-t border-gray-100" />

        {/* 댓글 영역 */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-20" />

          {/* 댓글 목록 */}
          <Skeleton className="h-11 w-full rounded-xl" />

          {/* 댓글 작성 */}
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>

          {/* 글자 수 / 등록 버튼 */}
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-14 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
