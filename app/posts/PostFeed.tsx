'use client';

import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { formatDateTime, formatRelative } from '@/lib/date';
import PostLikeButton from './PostLikeButton';
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
    <section aria-label="게시글 목록" aria-busy={pending} className="flex min-w-0 flex-col gap-5">
      {!result.ok && <div role="status" className="flex flex-col items-start gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-6 [overflow-wrap:anywhere]">
        <p>{result.message}</p>
        {result.status === 401 ? <Link className="cursor-pointer border-0 bg-transparent p-0 text-[#1d4ed8] underline [font:inherit] disabled:cursor-wait disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-4" href="/login">로그인하기</Link> :
          <button type="button" disabled={pending} onClick={() => startTransition(() => router.refresh())} className="cursor-pointer border-0 bg-transparent p-0 text-[#1d4ed8] underline [font:inherit] disabled:cursor-wait disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-4">다시 시도</button>}
      </div>}
      {latest && posts.length === 0 && <p className="rounded-2xl border border-[#e5e7eb] bg-white p-6 [overflow-wrap:anywhere]">{mine ? '아직 쓴 글이 없어요. 위 상자에서 첫 글을 남겨 보세요.' : '아직 올라온 글이 없어요. 위 상자에 첫 글을 남겨 보세요.'}</p>}
      {posts.length > 0 && <ul className="m-0 flex list-none flex-col gap-4 p-0">{posts.map(post => (
        <li key={post.id}>
          {/* 카드 전체가 클릭되도록 relative로 두고, 아래 상세 링크가 after로 카드 전체를 덮는다(링크는 하나라서 중첩되지 않는다) */}
          <article className="relative flex flex-col gap-3 rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_3px_rgb(0_0_0_/_0.05)] transition-colors hover:bg-[#f9fafb] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-[#2563eb] max-[480px]:rounded-[20px] max-[480px]:p-5">
            <header className="flex min-w-0 items-center gap-3 [&>div]:min-w-0 [&>div]:[overflow-wrap:anywhere]">
              <span aria-hidden="true" className="flex size-10 flex-[0_0_40px] items-center justify-center rounded-full bg-[#dbeafe] font-semibold text-[#1e40af]">{post.author.name.trim().slice(0, 1) || '?'}</span>
              <div><p className="font-semibold">{post.author.name}</p>{/* 상대 시간은 서버와 브라우저가 그리는 시각이 달라질 수 있어 suppressHydrationWarning을 쓴다. 마우스를 올리면 정확한 시각이 보인다 */}<time className="text-sm text-[#6b7280]" dateTime={post.createdAt} title={formatDateTime(post.createdAt)} suppressHydrationWarning>{formatRelative(post.createdAt)}</time></div>
            </header>
            {post.title?.trim() ? <>
              <h2 className="text-xl leading-[1.4] font-bold [overflow-wrap:anywhere]"><Link className="text-inherit no-underline outline-none after:absolute after:inset-0 after:content-[''] hover:underline" href={`/posts/${encodeURIComponent(String(post.id))}`}>{post.title?.trim()}</Link></h2>
              <p className="line-clamp-3 text-sm leading-7 whitespace-pre-wrap text-[#4b5563] [overflow-wrap:anywhere]">{post.content}</p>
            </> : (
              // 제목이 없는 글(텍스트박스로 쓴 글): 내용이 곧 본문이라 제목 줄 없이 내용 자체를 상세 링크로 보여 준다
              <p className="line-clamp-3 text-base leading-7 whitespace-pre-wrap text-[#111827] [overflow-wrap:anywhere]"><Link className="text-inherit no-underline outline-none after:absolute after:inset-0 after:content-[''] hover:underline" href={`/posts/${encodeURIComponent(String(post.id))}`}>{post.content}</Link></p>
            )}
            {/* 좋아요 버튼과 댓글 수 (0이어도 표시). 좋아요 버튼은 카드 링크 위에 떠서 눌러도 상세로 이동하지 않는다 */}
            <div className="flex items-center gap-4 text-sm text-[#6b7280]">
              <PostLikeButton postId={post.id} likeCount={post.likeCount} likedByMe={post.likedByMe} />
              <span className="sr-only">댓글 {post.commentCount}개</span>
              <span aria-hidden="true">💬 {post.commentCount}</span>
            </div>
          </article>
        </li>
      ))}</ul>}
      {result.ok && latest && (latest.hasNext ? (
        <button type="button" disabled={pending}
          onClick={() => startTransition(() => router.replace(`/posts?page=${latest.page + 1}${mine ? '&view=mine' : ''}`, { scroll: false }))}
          className="w-full cursor-pointer rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-[#111827] [font:inherit] font-semibold hover:bg-[#f9fafb] disabled:cursor-wait disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-4">
          {pending ? '불러오는 중...' : '더보기'}
        </button>
      ) : posts.length > 0 ? <p role="status" className="text-center text-sm text-[#6b7280]">모든 게시글을 확인했습니다.</p> : null)}
    </section>
  );
}
