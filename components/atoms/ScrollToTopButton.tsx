
"use client";

import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 화면을 300px 이상 내리면 버튼 표시
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="맨 위로 이동"
      className="fixed bottom-5 right-5 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-lg text-white shadow-md transition hover:bg-gray-700"
    >
      ↑
    </button>
  );
}
