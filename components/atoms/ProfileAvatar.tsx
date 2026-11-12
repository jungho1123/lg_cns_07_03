"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string | null;
  name: string;
  className?: string;
  sizes?: string;
};

export default function ProfileAvatar({ src, name, className = "size-10 text-base", sizes = "40px" }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return (
    <div className={`relative shrink-0 ${className}`}>
      <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-blue-50 font-semibold text-blue-600">
        {src && src !== failedSrc ? (
          <Image src={src} alt={`${name}님의 프로필 사진`} fill sizes={sizes} unoptimized className="object-cover" onError={() => setFailedSrc(src)} />
        ) : <span role="img" aria-label={`${name}님의 기본 프로필`}>{name.trim().slice(0, 1) || '?'}</span>}
      </div>
    </div>
  );
}
