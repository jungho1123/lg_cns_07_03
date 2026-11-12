"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useState } from "react";

type Props = { src: string | null; name: string };

export default function ProfileAvatar({ src, name }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return (
    <div className="relative size-36 shrink-0 sm:size-40">
      <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-blue-50 text-5xl font-semibold text-blue-600">
        {src && src !== failedSrc ? (
          <Image src={src} alt={`${name}님의 프로필 사진`} fill sizes="160px" unoptimized className="object-cover" onError={() => setFailedSrc(src)} />
        ) : <span role="img" aria-label={`${name}님의 기본 프로필`}>{name.trim().slice(0, 1) || '?'}</span>}
      </div>
      <button
        type="button"
        onClick={() => window.alert("준비 중인 기능입니다.")}
        aria-label="프로필 사진 수정 (준비 중)"
        title="프로필 사진 수정 · 준비 중인 기능입니다."
        className="absolute right-0 bottom-0 flex size-11 items-center justify-center rounded-full border-4 border-white bg-gray-950 text-white shadow-sm cursor-pointer transition-colors hover:bg-gray-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <Plus aria-hidden="true" size={24} strokeWidth={3} />
      </button>
    </div>
  );
}
