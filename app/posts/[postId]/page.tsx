import Link from 'next/link';
import { Suspense } from 'react';
import { getPost } from '@/service/spring/postReadService';
import CommentList from './CommentList';

// 댓글과 동일하게 한국 시간, 24시간제로 날짜와 시간을 표시합니다.
function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    dateStyle: 'short',
    timeStyle: 'short',
    hourCycle: 'h23',
  });
}
type Params = Promise<{ postId: string }>;
async function PostDetail({ params }: { params: Params }) {
  const result = await getPost((await params).postId);
  if (!result.ok) return (
    <div role="status" className="space-y-3 rounded-2xl border bg-white p-6">
      <p>{result.message}</p>
      {result.status === 401 && <Link href="/login" className="text-blue-700 underline">로그인하기</Link>}
    </div>
  );
  const post = result.data;
  const title = post.title?.trim(); // 제목이 없는 글(텍스트박스로 쓴 글)은 제목 줄을 그리지 않는다
  return (
    <article className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <header className="space-y-4">
        {title && <h2 className="break-words text-2xl font-bold">{title}</h2>}
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-800">{post.author.name.trim().slice(0, 1) || '?'}</span>
          <div><p className="font-semibold">{post.author.name}</p>
            <p className="text-sm text-gray-500">작성 <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time></p>
            {post.updatedAt && post.updatedAt !== post.createdAt && <p className="text-sm text-gray-500">수정 <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time></p>}
          </div>
        </div>
      </header>
      <div className={`whitespace-pre-wrap break-words border-t border-gray-100 pt-5 ${title ? 'leading-7' : 'text-lg leading-8'}`}>{post.content}</div>
      <div className="[&>section>ul]:space-y-2 [&>section>ul>li]:rounded-xl [&>section>ul>li]:bg-slate-50 [&>section>ul>li]:p-4 [&>section>p:not([role])]:rounded-xl [&>section>p:not([role])]:bg-slate-50 [&>section>p:not([role])]:p-4">
        <Suspense fallback={<p role="status">댓글을 불러오는 중...</p>}>
          <CommentList postId={post.id} />
        </Suspense>
      </div>
      {/* 게시글 수정·삭제·좋아요는 각 담당자의 구현 후 연결합니다. */}
    </article>
  );
}
export default function PostDetailPage({ params }: { params: Params }) {
  return (
    <main className="min-h-dvh px-4 py-10 text-gray-900" style={{ backgroundColor: '#ffffff' }}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex items-end justify-between gap-4">
          <div className="space-y-2"><h1 className="text-3xl font-bold">게시글 상세</h1><p className="text-sm text-gray-600">글 내용을 확인해 보세요.</p></div>
          <Link href="/posts" className="shrink-0 text-sm font-semibold text-blue-700 hover:underline">목록으로</Link>
        </header>
        <Suspense fallback={<p role="status">글을 불러오는 중...</p>}><PostDetail params={params} /></Suspense>
      </div>
    </main>
  );
}
