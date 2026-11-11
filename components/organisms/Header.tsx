"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

interface HeaderProps {
  onMenuClick: () => void;
  onLogout: () => Promise<void>;
  user: Session["user"] | null;
}

export default function Header({
  onMenuClick,
  onLogout,
  user,
}: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const pathname = usePathname();

  const pageTitles: Record<string, string> = {
    "/": "HOME",
    "/posts": "POSTS",
    "/profile": "MY PAGE",
    "/settings": "SETTINGS",
  };

  const pageTitle = pageTitles[pathname] ?? "";

  // 실제 로그인 상태 확인
  const isLoggedIn = !!user?.profile;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">

      {/* 왼쪽 영역 */}
      <div className="flex items-center gap-3">
        {/* menu bar 버튼: 1024px 미만에서만 표시 */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-gray-100 min-[1024px]:hidden"
          aria-label="메뉴 열기"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-lg font-semibold text-gray-900">
          {pageTitle}
        </h1>
      </div>

      {/* 오른쪽 영역 */}
      <div className="flex items-center gap-3">

        {/* 알림 버튼 */}
        <button
          type="button"
          className="relative rounded-full p-2 hover:bg-gray-100"
          aria-label="알림"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>

          {/* 읽지 않은 알림 표시 */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* 프로필 버튼 및 드롭다운 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100"
            aria-expanded={isProfileOpen}
            aria-label="프로필 메뉴"
          >
            {isLoggedIn && user?.image ? (
              <img
                src={user.image}
                alt="프로필 이미지"
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                {isLoggedIn ? user?.name?.[0] ?? "U" : "U"}
              </div>
            )}

            <span className="hidden text-sm font-medium text-gray-700 sm:block">
              {isLoggedIn ? user?.name ?? "사용자" : "로그인"}
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">

              {isLoggedIn ? (
                <>
                   {/* 사용자 정보 */}
                  <div className="border-b border-gray-100 px-3 py-3">
                    <p className="font-semibold text-gray-900">
                      {user?.name ?? "사용자"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {user?.email ?? ""}
                    </p>
                  </div>

                  {/* 프로필 메뉴 */}
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    마이페이지
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    계정 설정
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      setIsProfileOpen(false);
                      await onLogout();
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    로그인
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setIsProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}