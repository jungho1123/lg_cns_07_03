"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import Footer from "@/components/organisms/Footer";
import ScrollToTopButton from "@/components/atoms/ScrollToTopButton";

interface MainLayoutClientProps {
  children: React.ReactNode;
  user: Session["user"] | null;
  barePaths: string[];
}

export default function MainLayoutClient({
  children,
  user,
  barePaths,
}: MainLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isBarePath = barePaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // 로그인 페이지 등 별도 레이아웃이 필요한 페이지
  if (isBarePath) {
    return (
      <main className="min-h-screen w-full">
        {children}
      </main>
    );
  }

  // 일반 페이지
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 min-[1024px]:hidden"
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen min-[1024px]:ml-36 flex flex-col">
        <main className="flex-1 w-full min-w-0">
          {children}
        </main>

        <Footer
          isLoggedIn={!!user?.id}
        />
      </div>
       <ScrollToTopButton />
    </div>
  );
}
