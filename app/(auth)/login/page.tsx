import { Suspense } from 'react';
import { LoginSection } from '@/features/auth/containers/LoginSection';

type LoginPageProps = {
  searchParams: Promise<{ logout?: string }>;
};

async function LogoutNotice({ searchParams }: LoginPageProps) {
  const { logout } = await searchParams;
  if (logout !== 'server-error') return null;

  return (
    <p role="status" className="mb-4 text-sm text-amber-700">
      현재 기기에서는 로그아웃되었습니다. 서버 세션 종료는 확인하지 못했습니다.
    </p>
  );
}

export default function Page({ searchParams }: LoginPageProps) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={null}>
          <LogoutNotice searchParams={searchParams} />
        </Suspense>
        <LoginSection />
      </div>
    </div>
  );
}
