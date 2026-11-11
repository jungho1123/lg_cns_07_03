import Link from 'next/link';
import PostForm from './PostForm';

export default function NewPostPage() {
  return (
    <main className="min-h-dvh bg-white px-4 py-10 text-gray-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">글쓰기</h1>
            <p className="text-sm text-gray-600">생각을 글로 남겨 보세요.</p>
          </div>
          <Link
            href="/posts"
            className="shrink-0 text-sm font-semibold text-blue-700 hover:underline"
          >
            목록으로
          </Link>
        </header>
        <PostForm />
      </div>
    </main>
  );
}
