"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/actions/notificationActions";
import { formatDateTime, formatRelative } from "@/lib/date";
import { notificationMessage } from "@/lib/notificationText";
import type { NotificationItem } from "@/types/response/notificationResponse";

const POLL_INTERVAL = 30_000; // 새 알림을 확인하는 간격 (30초)

// 헤더 오른쪽 위의 알림 종. 안 읽은 알림이 있으면 빨간 숫자가 뜨고, 누르면 아래에 작은 목록이 열린다.
// 목록은 /api/notifications(조회 전용)에서 가져오고, 읽음 처리는 서버 액션으로 한다.
export default function NotificationBell() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const unreadCount = items.filter((item) => item.unread).length;

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));
      const data = (await response.json()) as { items: NotificationItem[] };
      setItems(data.items);
      setStatus("ready");
    } catch {
      // 이미 보이던 목록은 그대로 두고, 처음부터 실패했을 때만 오류를 보여 준다.
      setStatus((previous) => (previous === "ready" ? previous : "error"));
    }
  }, []);

  // 처음 한 번, 이후 30초마다, 탭으로 돌아왔을 때 새로 가져온다. 탭이 숨겨져 있으면 쉰다.
  useEffect(() => {
    const first = setTimeout(() => void load(), 0);
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, POLL_INTERVAL);
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  // 바깥을 누르거나 Esc를 누르면 닫는다.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) void load(); // 열 때마다 최신 목록으로 갱신
  }

  // 화면을 먼저 바꾸고(읽음 표시) 서버에 알린다. 실패하면 서버 기준으로 다시 맞춘다.
  async function openItem(item: NotificationItem) {
    setOpen(false);
    if (item.unread) {
      setItems((previous) =>
        previous.map((it) => (it.id === item.id ? { ...it, unread: false } : it)),
      );
      void markNotificationReadAction(item.id).then((result) => {
        if (!result.ok) void load();
      });
    }
    router.push(item.linkPath);
  }

  async function readAll() {
    setItems((previous) => previous.map((item) => ({ ...item, unread: false })));
    const result = await markAllNotificationsReadAction();
    if (!result.ok) void load();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        className="relative rounded-full p-2 hover:bg-gray-100"
        aria-label={unreadCount > 0 ? `알림, 안 읽은 알림 ${unreadCount}개` : "알림"}
        aria-haspopup="true"
        aria-expanded={open}
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
          aria-hidden="true"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>

        {/* 안 읽은 알림이 있을 때만 빨간 숫자 */}
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="region"
          aria-label="알림 목록"
          className="fixed inset-x-3 top-16 z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">알림</h2>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={readAll}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                모두 읽음
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {status === "loading" && (
              <p role="status" className="px-4 py-8 text-center text-sm text-gray-500">
                알림을 불러오는 중...
              </p>
            )}
            {status === "error" && (
              <p role="status" className="px-4 py-8 text-center text-sm text-gray-500">
                알림을 불러오지 못했습니다.
              </p>
            )}
            {status === "ready" && items.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-gray-500">
                새로운 알림이 없습니다.
              </p>
            )}
            {status === "ready" && items.length > 0 && (
              <ul>
                {items.map((item) => (
                  <li key={item.id} className="border-b border-gray-50 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => openItem(item)}
                      className={`flex w-full gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                        item.unread ? "bg-blue-50/60" : ""
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800"
                      >
                        {item.actorName.trim().slice(0, 1) || "?"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-sm text-gray-900 ${item.unread ? "font-semibold" : ""}`}
                        >
                          {notificationMessage(item)}
                        </span>
                        {item.body && (
                          <span className="mt-0.5 block truncate text-sm text-gray-500">
                            {item.body}
                          </span>
                        )}
                        <time
                          dateTime={item.createdAt}
                          title={formatDateTime(item.createdAt)}
                          suppressHydrationWarning
                          className="mt-1 block text-xs text-gray-400"
                        >
                          {formatRelative(item.createdAt)}
                        </time>
                      </span>
                      {item.unread && (
                        <span
                          aria-label="안 읽음"
                          className="mt-2 size-2 shrink-0 rounded-full bg-blue-600"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
