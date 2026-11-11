import Link from 'next/link';

// 임시 헤더입니다. 신예진 님의 헤더가 나오면 이 파일은 삭제하고 교체합니다.
export function TempHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          팀 프로젝트 게시판
        </Link>
        <nav className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="hover:underline">
            홈
          </Link>
          <Link href="/posts" className="hover:underline">
            글 목록
          </Link>
        </nav>
      </div>
    </header>
  );
}
