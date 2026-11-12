import { Skeleton } from "@/components/ui/skeleton";

// 마이페이지 프로필 영역 로딩 화면
export default function MyPageFallback() {
  return (
    <section aria-busy="true" className="bg-white px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* "프로필" 제목 */}
        <Skeleton className="h-7 w-16" />

        <div className="mt-6 grid items-start gap-8 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-12">
          {/* 프로필 사진 */}
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="size-40 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>

          {/* 사용자 이름 / 이메일 / 비밀번호 변경 버튼 */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="ml-[6px] h-4 w-32" />
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-5 w-14" />
              <Skeleton className="ml-[6px] h-4 w-52" />
            </div>
            <Skeleton className="mt-2 h-10 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}