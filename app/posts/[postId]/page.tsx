import Link from 'next/link';
import { Suspense } from 'react';
import { getPost } from '@/service/spring/postReadService';

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
  return (
    <article className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <header className="space-y-4">
        <h2 className="break-words text-2xl font-bold">{post.title?.trim() || '게시글 보기'}</h2>
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-800">{post.author.name.trim().slice(0, 1) || '?'}</span>
          <div><p className="font-semibold">{post.author.name}</p>
            <p className="text-sm text-gray-500">작성 <time dateTime={post.createdAt}>{post.createdAt.slice(0, 10)}</time></p>
            {post.updatedAt && post.updatedAt !== post.createdAt && <p className="text-sm text-gray-500">수정 <time dateTime={post.updatedAt}>{post.updatedAt.slice(0, 10)}</time></p>}
          </div>
        </div>
      </header>
      <div className="whitespace-pre-wrap break-words border-t border-gray-100 pt-5 leading-7">{post.content}</div>
      {/* 댓글·수정·삭제·좋아요 컴포넌트는 각 담당자의 구현 후 협의하여 연결합니다. */}
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
