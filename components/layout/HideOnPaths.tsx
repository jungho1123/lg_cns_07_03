'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type HideOnPathsProps = {
  // 이 경로(와 그 하위 경로)에서는 children을 그리지 않는다. 예: ['/login']
  paths: string[];
  children: ReactNode;
};

// 현재 주소를 읽는 일만 이 작은 컴포넌트가 맡는다.
// children은 서버 컴포넌트(Header, Footer)를 그대로 받아서, 숨길 때만 그리지 않는다.
export function HideOnPaths({ paths, children }: HideOnPathsProps) {
  const pathname = usePathname();
  const hidden = paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (hidden) return null;
  return <>{children}</>;
}
