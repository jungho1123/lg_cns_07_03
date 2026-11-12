"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type UserId = string | number;

type AvatarUpdate = {
  userId: UserId;
  avatarUrl: string | null;
  version: number;
};

type AvatarContextValue = {
  getAvatarSrc: (userId: UserId) => string | null;
  updateAvatar: (avatar: AvatarUpdate) => void;
};

const AvatarContext = createContext<AvatarContextValue | null>(null);

function avatarPath(userId: UserId) {
  return `/api/avatars/${encodeURIComponent(String(userId))}`;
}

export default function AvatarProvider({ children }: { children: ReactNode }) {
  const [sources, setSources] = useState(() => new Map<string, string | null>());

  function getAvatarSrc(userId: UserId) {
    const source = sources.get(String(userId));
    // null은 삭제된 사진이다. 아직 변경 이력이 없을 때만 API를 조회한다.
    return source === undefined ? avatarPath(userId) : source;
  }

  function updateAvatar({ userId, avatarUrl, version }: AvatarUpdate) {
    const source = avatarUrl === null ? null : `${avatarPath(userId)}?v=${version}`;
    setSources(previous => new Map(previous).set(String(userId), source));
  }

  return (
    <AvatarContext.Provider value={{ getAvatarSrc, updateAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const context = useContext(AvatarContext);
  if (!context) throw new Error("useAvatar는 AvatarProvider 안에서 사용해야 합니다.");
  return context;
}
