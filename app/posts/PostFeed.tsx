'use client';

import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { PostPageResponse, PostReadResult, PostResponse } from '@/types/response/postResponse';

type Props = { result: PostReadResult<PostPageResponse>; mine?: boolean };
type Snapshot = { source: Props['result']; pages: Map<number, PostPageResponse> };

// 서버 컴포넌트가 조회한 데이터만 전달받습니다. 브라우저에서 Spring을 호출하지 않습니다.
export default function PostFeed({ result, mine = false }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [snapshot, setSnapshot] = useState<Snapshot>(() => ({
    source: result,
    pages: result.ok ? new Map([[result.data.page, result.data]]) : new Map(),
  }));
  if (snapshot.source !== result) {
    let pages = snapshot.pages;
    if (result.ok) {
      const last = Math.max(-1, ...pages.keys());
      pages = result.data.page === last + 1 || result.data.page === last
        ? new Map(pages) : new Map();
      pages.set(result.data.page, result.data);
    } else if (result.status === 401 || result.status === 403) {
      pages = new Map();
    }
    setSnapshot({ source: result, pages });
  }
  const batches = [...snapshot.pages.values()].sort((a, b) => a.page - b.page);
  const latest = batches.at(-1);
  const unique = new Map<number, PostResponse>();
  for (const batch of batches) for (const post of batch.items) unique.set(post.id, post);
  const posts = [...unique.values()];

  return (
    <section aria-label="게시글 목록" aria-busy={pending} className="posts-feed">
      {!result.ok && <div role="status" className="posts-notice">
        <p>{result.message}</p>
        {result.status === 401 ? <Link className="posts-action" href="/login">로그인하기</Link> :
          <button type="button" disabled={pending} onClick={() => startTransition(() => router.refresh())} className="posts-action">다시 시도</button>}
      </div>}
      {latest && posts.length === 0 && <p className="posts-empty">{mine ? '아직 작성한 게시글이 없습니다.' : '표시할 게시글이 없습니다.'}</p>}
      {posts.length > 0 && <ul className="posts-list">{posts.map(post => (
        <li key={post.id}>
          <article className="posts-card">
            <header className="posts-author">
              <span aria-hidden="true" className="posts-avatar">{post.author.name.trim().slice(0, 1) || '?'}</span>
              <div><p className="posts-authorName">{post.author.name}</p><time className="posts-date" dateTime={post.createdAt}>{post.createdAt.slice(0, 10)}</time></div>
            </header>
            <h2 className="posts-postTitle"><Link className="posts-postLink" href={`/posts/${encodeURIComponent(String(post.id))}`}>{post.title?.trim() || '게시글 보기'}</Link></h2>
            <p className="posts-body">{post.content}</p>
          </article>
        </li>
      ))}</ul>}
      {result.ok && latest && (latest.hasNext ? (
        <button type="button" disabled={pending}
          onClick={() => startTransition(() => router.replace(`/posts?page=${latest.page + 1}${mine ? '&view=mine' : ''}`, { scroll: false }))}
          className="posts-more">
          {pending ? '불러오는 중...' : '더보기'}
        </button>
      ) : posts.length > 0 ? <p role="status" className="posts-end">모든 게시글을 확인했습니다.</p> : null)}
    </section>
  );
}
