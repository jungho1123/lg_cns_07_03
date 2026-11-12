"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "홈", href: "/" },
  { name: "게시글", href: "/posts" },
  { name: "마이페이지", href: "/profile" },
  { name: "설정", href: "/settings" },
];

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        min-[1024px]:translate-x-0
      `}
    >
      {/* 로고 영역 */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
        <Link
          href="/"
          onClick={onClose}
          className="text-xl font-bold text-gray-900"
        >
          LG CNS Project
        </Link>

        {/* 모바일 닫기 버튼 */}
        <button
          onClick={onClose}
          className="min-[1024px]:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
          aria-label="사이드바 닫기"
        >
          <X size={22} />
        </button>
      </div>

      {/* 메뉴 영역 */}
      <nav className="p-4">
        <p className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-black">
         MENU
        </p>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="
                  block rounded-lg px-4 py-3
                  text-gray-700
                  hover:bg-gray-100 hover:text-black
                  transition-colors
                "
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}