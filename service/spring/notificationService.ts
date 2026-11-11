import 'server-only';
import { z } from 'zod';
import { matchApiUrl } from '@/config/apiuri';
import { ApiError } from '@/lib/apiError';
import { authenticatedRequest } from '@/lib/auth/authenticatedRequest';
import { readApiData } from '@/lib/fetchClients';
import type { NotificationItem, ReadAllData } from '@/types/response/notificationResponse';

// 2026-11-11 Swagger 실응답 기준 (projectId는 게시판 알림에서 null)
const notificationSchema: z.ZodType<NotificationItem> = z.object({
  id: z.number(),
  recipientId: z.number(),
  actorId: z.number(),
  actorName: z.string(),
  projectId: z.number().nullable(),
  type: z.string(),
  resourceType: z.string(),
  resourceId: z.string(),
  title: z.string(),
  body: z.string(),
  linkPath: z.string(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
  unread: z.boolean(),
});

const readAllSchema: z.ZodType<ReadAllData> = z.object({ updated: z.number() });

function parseWith<T>(schema: z.ZodType<T>) {
  return (value: unknown): T => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) throw new ApiError(502, '알림 응답 형식이 올바르지 않습니다.');
    return parsed.data;
  };
}

// authenticatedRequest는 서버 액션 또는 route handler에서만 쓸 수 있다.
export async function getNotifications(limit = 50): Promise<NotificationItem[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  const response = await authenticatedRequest(`${matchApiUrl.notification.list}?${params}`);
  return readApiData(response, parseWith(z.array(notificationSchema)));
}

export async function markNotificationRead(notificationId: number): Promise<void> {
  const response = await authenticatedRequest(matchApiUrl.notification.read(notificationId), {
    method: 'POST',
  });
  await readApiData(response, () => undefined);
}

export async function markAllNotificationsRead(): Promise<number> {
  const response = await authenticatedRequest(matchApiUrl.notification.readAll, {
    method: 'POST',
  });
  return (await readApiData(response, parseWith(readAllSchema))).updated;
}
