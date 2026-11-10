import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-6 px-6 py-24 text-center sm:py-32">
      <span className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        팀 프로젝트 게시판
      </span>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
        생각을 남기고, 서로 이야기해 보세요
      </h1>
      <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        글을 쓰고, 댓글로 이야기하고, 좋아요와 알림으로 소통하는 공간입니다.
      </p>
      <Link
        href="/posts"
        className="rounded-full bg-zinc-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        글 보러 가기
      </Link>
    </section>
  );
}
