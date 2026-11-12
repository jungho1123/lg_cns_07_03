import Link from 'next/link';
import { Suspense } from 'react';
import { requireCurrentUser } from '@/lib/currentUser';
import { formatDateTime } from '@/lib/date';
import UserAvatar from '@/components/molecules/UserAvatar';
import { getPost } from '@/service/spring/postReadService';
import PostLikeButton from '../PostLikeButton';
import CommentList from './CommentList';
import PostOwnerActions from './PostOwnerActions';
import PostDetailFallback from "@/components/loader/PostDetailFallback";


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
  const edited = Boolean(post.updatedAt && post.updatedAt !== post.createdAt);
  // 내 글인지: 글 작성자 id와 로그인한 사용자 id를 비교한다. 로그인 정보를 못 읽으면 "내 글 아님"으로 둔다.
  // (버튼을 숨기는 것은 편의일 뿐이고, 실제 권한 판단은 서버가 한다.)
  let isMine = false;
  try {
    isMine = (await requireCurrentUser()).userId === post.author.id;
  } catch {
    isMine = false;
  }
  return (
    <article className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <header className="space-y-4">
        {title && <h2 className="break-words text-2xl font-bold">{title}</h2>}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar userId={post.author.id} name={post.author.name} />
            <div className="min-w-0"><p className="font-semibold">{post.author.name}</p>
              {/* 작성 시각 한 줄. 수정된 글이면 "· 수정됨"을 붙이고, 마우스를 올리면 수정 시각이 보인다 */}
              <p className="text-sm text-gray-500">
                <time dateTime={post.createdAt}>{formatDateTime(post.createdAt)}</time>
                {edited && post.updatedAt && <span title={`수정 ${formatDateTime(post.updatedAt)}`}> · 수정됨</span>}
              </p>
            </div>
          </div>
          {/* 내 글일 때만 오른쪽에 수정/삭제 버튼 (아직 모양만 있고 동작은 연결 전) */}
          {isMine && <PostOwnerActions postId={String(post.id)} />}
        </div>
      </header>
      <div className={`whitespace-pre-wrap break-words border-t border-gray-100 pt-5 ${title ? 'leading-7' : 'text-lg leading-8'}`}>{post.content}</div>
      {/* 좋아요 버튼과 댓글 수 (목록 카드와 같은 모양) */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <PostLikeButton postId={post.id} likeCount={post.likeCount} likedByMe={post.likedByMe} />
        <span className="sr-only">댓글 {post.commentCount}개</span>
        <span aria-hidden="true">💬 {post.commentCount}</span>
      </div>
      <div className="[&>section>ul]:space-y-3 [&>section>ul>li]:rounded-xl [&>section>ul>li]:bg-slate-50 [&>section>ul>li]:p-4 [&>section>p:not([role])]:rounded-xl [&>section>p:not([role])]:bg-slate-50 [&>section>p:not([role])]:p-4">
        <Suspense fallback={<p role="status">댓글을 불러오는 중...</p>}>
          <CommentList postId={post.id} />
        </Suspense>
      </div>
    </article>
  );
}
export default function PostDetailPage({ params }: { params: Params }) {
  return (
    <main className="min-h-dvh px-4 py-10 text-gray-900" style={{ backgroundColor: '#ffffff' }}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* 화면에는 보이지 않지만 스크린리더가 화면 제목을 읽을 수 있게 둔다 */}
        <h1 className="sr-only">게시글 상세</h1>
        <Link href="/posts" className="w-fit text-sm font-semibold text-blue-700 hover:underline">← 목록으로</Link>
        <Suspense fallback={<PostDetailFallback />}><PostDetail params={params} /></Suspense>
      </div>
    </main>
  );
}
