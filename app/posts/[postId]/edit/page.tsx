import Link from 'next/link';
import { Suspense } from 'react';
import { requireCurrentUser } from '@/lib/currentUser';
import { getPost } from '@/service/spring/postReadService';
import PostEditForm from './PostEditForm';

type Params = Promise<{ postId: string }>;

function Notice({ message, loginLink = false }: { message: string; loginLink?: boolean }) {
  return (
    <div role="status" className="space-y-3 rounded-2xl border bg-white p-6">
      <p>{message}</p>
      {loginLink && (
        <Link href="/login" className="text-blue-700 underline">
          로그인하기
        </Link>
      )}
    </div>
  );
}

async function EditContent({ params }: { params: Params }) {
  const { postId } = await params;
  const result = await getPost(postId);
  if (!result.ok) return <Notice message={result.message} loginLink={result.status === 401} />;

  // 내 글인지 확인한다. 남의 글 주소로 직접 들어와도 폼을 열지 않는다.
  // (이것은 편의일 뿐이고, 실제 권한 판단은 저장할 때 서버가 한다.)
  let isMine = false;
  try {
    isMine = (await requireCurrentUser()).userId === result.data.author.id;
  } catch {
    isMine = false;
  }
  if (!isMine) return <Notice message="내가 쓴 글만 수정할 수 있습니다." />;

  return (
    <PostEditForm
      postId={postId}
      title={result.data.title ?? ''}
      content={result.data.content}
    />
  );
}

export default function EditPostPage({ params }: { params: Params }) {
  return (
    <main className="min-h-dvh px-4 py-10 text-gray-900" style={{ backgroundColor: '#ffffff' }}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <h1 className="text-2xl font-bold">글 수정</h1>
        <Suspense fallback={<p role="status">글을 불러오는 중...</p>}>
          <EditContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
