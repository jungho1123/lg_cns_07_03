import Link from 'next/link';
import { SocialMock } from './SocialMock';

const chips = ['✍️ 글쓰기', '💬 댓글', '♡ 좋아요', '🔔 알림'];

// 메인 첫 화면. 왼쪽에는 소개 문구와 버튼, 오른쪽에는 SNS 앱 화면 모음을 두어 한 화면에서 SNS처럼 보이게 한다.
// 헤더(64px)를 뺀 화면 높이를 채우고, 작은 화면에서는 문구 아래로 카드가 쌓인다.
export function HeroSection() {
  return (
    <section className="flex min-h-[calc(100dvh-4rem)] items-center bg-gradient-to-br from-blue-50 via-white to-fuchsia-50 px-6 py-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <span className="rounded-full border border-blue-200 bg-white/70 px-3 py-1 text-sm font-medium text-blue-700">
            팀 프로젝트 게시판
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            생각을 남기고,
            <span className="block bg-gradient-to-r from-blue-600 to-fuchsia-600 bg-clip-text text-transparent">
              서로 이야기해 보세요
            </span>
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600">
            글을 쓰고, 댓글로 이야기하고, 좋아요와 알림으로 소통하는 공간입니다.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="/posts"
              className="rounded-full bg-zinc-900 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-zinc-900/20 transition-colors hover:bg-zinc-700"
            >
              글 보러 가기
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-zinc-300 bg-white/70 px-7 py-3 text-base font-semibold text-zinc-800 transition-colors hover:bg-white"
            >
              회원가입
            </Link>
          </div>

          <ul className="flex flex-wrap justify-center gap-2 lg:justify-start" aria-label="주요 기능">
            {chips.map((chip) => (
              <li key={chip} className="rounded-full bg-white px-3 py-1.5 text-sm text-zinc-700 shadow-sm ring-1 ring-black/5">
                {chip}
              </li>
            ))}
          </ul>
        </div>

        <SocialMock />
      </div>
    </section>
  );
}
