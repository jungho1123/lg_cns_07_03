import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ArrowRight, FileText } from "lucide-react";
import { auth } from "@/auth";
import AvatarEdit from "@/components/organisms/AvatarEdit";
import PasswordEditButton from "@/components/organisms/PasswordEditButton";
import { countMyPosts, listMyPosts } from "@/service/spring/postReadService";
import MyPageFallback from "@/components/loader/MyPageFallback";
import PostListFallback from "@/components/loader/PostListFallback";

// 내가 쓴 글 로딩 화면 (글 목록 / 페이지 전체 로딩에서 같이 씀)
const myPostsFallback = (
  <div className="flex-1 border-t border-gray-200 bg-gray-50 px-5 py-10 sm:px-8 lg:px-12">
    <div className="mx-auto mt-16 max-w-5xl">
      <PostListFallback />
    </div>
  </div>
);

async function MyPostCount() {
  const count = await countMyPosts();
  return <span role="status" className="text-sm font-semibold text-blue-700">{count === null ? '글 개수를 불러오지 못했어요.' : `총 ${count}개`}</span>;
}

async function MyPosts() {
  const result = await listMyPosts({ page: 0, size: 5 });

  return (
    <section aria-labelledby="my-posts-heading" className="flex-1 border-t border-gray-200 bg-gray-50 px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 id="my-posts-heading" className="text-xl font-bold text-gray-900">내가 쓴 글 모아보기</h2>
              <Suspense fallback={<span role="status" className="text-sm text-gray-500">글 개수 확인 중...</span>}><MyPostCount /></Suspense>
            </div>
            <p className="text-sm text-gray-500">최신 글 5개만 표시합니다.</p>
          </div>
          <Link href="/posts?view=mine" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600">
            전체 보기 <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        {!result.ok ? (
          <div role="status" className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-600">{result.message}</p>
            <Link href={result.status === 401 ? '/login' : '/posts?view=mine'} className="mt-3 inline-block text-sm text-blue-700 underline">
              {result.status === 401 ? '로그인하기' : '내 글 목록에서 다시 확인하기'}
            </Link>
          </div>
        ) : result.data.items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
            <FileText aria-hidden="true" className="mx-auto mb-3 text-gray-400" size={28} />
            <p className="text-gray-600">아직 작성한 글이 없어요.</p>
            <Link href="/posts" className="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline">첫 글 작성하러 가기</Link>
          </div>
        ) : (
          <ul className="mt-6 grid list-none gap-4 p-0">
            {result.data.items.map(post => (
              <li key={post.id}>
                <Link href={`/posts/${post.id}`} className="block rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                  <h3 className="line-clamp-2 font-semibold break-words text-gray-900">{post.title?.trim() || post.content}</h3>
                  {post.title?.trim() && <p className="mt-2 line-clamp-2 text-sm whitespace-pre-wrap break-words text-gray-500">{post.content}</p>}
                  <time dateTime={post.createdAt} className="mt-3 block text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

async function MyPageContent() {
  await connection();
  const session = await auth();
  if (!session?.user || session.authError) redirect('/login');
  const user = session.user.profile;
  const name = user?.name || session.user.name || '사용자';
  const email = user?.email || session.user.email || '이메일 정보가 없습니다.';

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
      <section aria-labelledby="profile-heading" className="bg-white px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h1 id="profile-heading" className="text-xl font-bold text-gray-900">프로필</h1>
          <div className="mt-6 grid items-start gap-8 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-12">
            <AvatarEdit key={session.user.id} userId={session.user.id} name={name} />
            <div className="min-w-0">
              <dl className="m-0 grid gap-4 text-left">
                <div className="grid gap-1">
                  <dt className="m-0 text-base leading-6 text-gray-500">사용자 이름</dt>
                  <dd className="m-0 pl-[6px] text-sm leading-6 font-medium break-words text-gray-900">{name}</dd>
                </div>
                <div className="grid gap-1">
                  <dt className="m-0 text-base leading-6 text-gray-500">이메일</dt>
                  <dd className="m-0 pl-[6px] text-sm leading-6 font-medium break-all text-gray-900">{email}</dd>
                </div>
              </dl>
              <PasswordEditButton />
            </div>
          </div>

        </div>
      </section>
      <Suspense fallback={myPostsFallback}>
        <MyPosts />
      </Suspense>
    </div>
  );
}

export default function MyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
          <MyPageFallback />
          {myPostsFallback}
        </div>
      }
    >
      <MyPageContent />
    </Suspense>
  );
}
