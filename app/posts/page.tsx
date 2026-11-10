import Link from 'next/link';
import { Suspense } from 'react';
import { listPosts, listMyPosts } from '@/service/spring/postReadService';
import PostFeed from './PostFeed';

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
    <nav aria-label="게시글 조회 범위" className="flex gap-4 text-sm">
      <Link href="/posts" aria-current={!mine ? 'page' : undefined} className="underline">전체 게시글</Link>
      <Link href="/posts?view=mine" aria-current={mine ? 'page' : undefined} className="underline">내가 쓴 글</Link>
    </nav>
    <PostFeed key={mine ? 'mine' : 'all'} result={result} mine={mine} />
  </>;
}
export default function PostsPage({ searchParams }: { searchParams: Promise<Query> }) {
  return (
    <main className="min-h-dvh bg-gray-100 px-4 py-10 text-gray-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">게시글</h1>
          <p className="text-sm text-gray-600">게시글을 확인하세요.</p>
        </header>
        <Suspense fallback={<p role="status">글 목록을 불러오는 중...</p>}>
          <PostsContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
