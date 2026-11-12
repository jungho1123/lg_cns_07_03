import Link from 'next/link';
import { Suspense } from 'react';
import { getBannerImages } from '@/lib/bannerImages';
import { listPosts, listMyPosts } from '@/service/spring/postReadService';
import PostComposer from './PostComposer';
import PostFeed from './PostFeed';
import PostsBanner from './PostsBanner';
import PostListFallback from "@/components/loader/PostListFallback";

type Value = string | string[] | undefined;
type Query = { page?: Value; view?: Value };
function readPage(value: Value) {
  const raw = (Array.isArray(value) ? value[0] : value) ?? '0';
  const page = Number(raw);
  return /^\d+$/.test(raw) && Number.isSafeInteger(page) && page <= 2147483647 ? page : 0;
}
async function PostsContent({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const view = Array.isArray(query.view) ? query.view[0] : query.view;
  const mine = view === 'mine';
  const options = { page: readPage(query.page), size: 20 };
  const result = mine ? await listMyPosts(options) : await listPosts(options);
  return <>
    {/* 목록을 불러온 경우(= 로그인 상태)에만 글쓰기 상자를 보여 준다 */}
    {result.ok && <PostComposer currentPage={options.page} resetHref={mine ? '/posts?view=mine' : '/posts'} />}
    <nav aria-label="게시글 조회 범위" className="flex flex-wrap gap-4 text-sm">
      <Link href="/posts" aria-current={!mine ? 'page' : undefined} className="border-b-2 border-transparent py-2 text-[#6b7280] no-underline hover:text-[#111827] aria-[current=page]:border-[#111827] aria-[current=page]:font-semibold aria-[current=page]:text-[#111827] focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-4">전체 게시글</Link>
      <Link href="/posts?view=mine" aria-current={mine ? 'page' : undefined} className="border-b-2 border-transparent py-2 text-[#6b7280] no-underline hover:text-[#111827] aria-[current=page]:border-[#111827] aria-[current=page]:font-semibold aria-[current=page]:text-[#111827] focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-4">내가 쓴 글</Link>
    </nav>
    <PostFeed key={mine ? 'mine' : 'all'} result={result} mine={mine} />
  </>;
}
export default function PostsPage({ searchParams }: { searchParams: Promise<Query> }) {
  const bannerImages = getBannerImages(); // public/ads의 이미지 (없으면 기본 안내 배너가 보인다)
  return (
    <main className="box-border min-h-dvh w-full bg-white px-4 py-10 text-base leading-normal text-[#111827] [font-family:Arial,Helvetica,sans-serif] [&_*]:box-border [&_*::before]:box-border [&_*::after]:box-border [&_h1]:m-0 [&_h2]:m-0 [&_p]:m-0 max-[480px]:px-3 max-[480px]:py-6">
      {/* 작은 화면: 배너가 글쓰기 상자 위에 한 줄로 쌓인다. 큰 화면(xl): 배너는 오른쪽 열에 고정되고 글 목록은 왼쪽 열로 간다.
          배너를 한 번만 그리고 그리드 위치만 바꾼다 (두 개를 만들어 숨기면 타이머가 두 개 돈다). */}
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 xl:max-w-[70rem] xl:grid-cols-[minmax(0,48rem)_20rem] xl:items-start xl:gap-8">
        <aside aria-label="서비스 안내 배너" className="xl:sticky xl:top-24 xl:col-start-2 xl:row-start-1">
          <PostsBanner images={bannerImages} />
        </aside>
        <div className="flex min-w-0 flex-col gap-6 xl:col-start-1 xl:row-start-1">
          <Suspense fallback={<PostListFallback />}>
            <PostsContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
