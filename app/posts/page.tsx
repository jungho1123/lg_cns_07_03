import Link from 'next/link';
import { Suspense } from 'react';
import { listPosts, listMyPosts } from '@/service/spring/postReadService';
import PostFeed from './PostFeed';
import './posts.css';

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
    <nav aria-label="게시글 조회 범위" className="posts-tabs">
      <Link href="/posts" aria-current={!mine ? 'page' : undefined} className="posts-tab">전체 게시글</Link>
      <Link href="/posts?view=mine" aria-current={mine ? 'page' : undefined} className="posts-tab">내가 쓴 글</Link>
    </nav>
    <PostFeed key={mine ? 'mine' : 'all'} result={result} mine={mine} />
  </>;
}
export default function PostsPage({ searchParams }: { searchParams: Promise<Query> }) {
  return (
    <main className="posts-page">
      <div className="posts-container">
        <header className="posts-heading">
          <h1 className="posts-headingTitle">게시글</h1>
          <p className="posts-description">함께 나누는 이야기, 여기서 만나보세요.</p>
        </header>
        <Suspense fallback={<p role="status">글 목록을 불러오는 중...</p>}>
          <PostsContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
