import Link from 'next/link';
import { getPost } from '@/service/spring/postReadService';
import PostEditForm from './PostEditForm';

type PageProps = {
  params: Promise<{ postId: string }>;
};

export default async function EditPostPage({ params }: PageProps) {
  const { postId } = await params;
  const result = await getPost(postId);

  if (!result.ok) {
    return (
      <main className="min-h-dvh px-4 py-10">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-3xl font-bold">게시글 수정</h1>
          <p role="status" className="rounded-xl border p-5">
            {result.message}
          </p>
          {result.status === 401 && (
            <Link href="/login" className="text-blue-700 underline">
              로그인하기
            </Link>
          )}
          <Link href="/posts" className="block text-blue-700 underline">
            목록으로
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold">게시글 수정</h1>
        <PostEditForm
          postId={postId}
          title={result.data.title ?? ''}
          content={result.data.content}
        />
      </div>
    </main>
  );
}