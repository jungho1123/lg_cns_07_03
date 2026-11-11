
"use client";

import Link from "next/link";

interface FooterProps {
  isLoggedIn: boolean;
  onLogout: () => Promise<void>;
}

export default function Footer({
  isLoggedIn,
  onLogout,
}: FooterProps) {
  return (
    <footer className="w-full border-t border-gray-200 bg-white px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* 상단 영역 */}
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-gray-800">
              LG CNS Project
            </h2>
            <p className="text-sm text-gray-500">
              더 나은 업무 환경을 위한 통합 서비스
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/posts"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              게시글
            </Link>

            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => void onLogout()}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                로그아웃
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                로그인
              </Link>
            )}
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* 하단 영역 */}
        <div className="flex flex-col justify-between gap-3 text-xs text-gray-400 md:flex-row md:items-center">
          <p>© 2026 LG CNS AM INSPIRE CAMP 07 FE Project. All rights reserved.</p>

          <div className="flex flex-wrap gap-4">
            <span>이용약관</span>
            <span>개인정보처리방침</span>
            <span>고객센터</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
