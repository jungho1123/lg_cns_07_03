import 'server-only';
import { z } from 'zod';
import { matchApiUrl } from '@/config/apiuri';
import { ApiError } from '@/lib/apiError';
import { authenticatedRequest } from '@/lib/auth/authenticatedRequest';
import { readApiData } from '@/lib/fetchClients';
import type { NotificationItem, ReadAllData } from '@/types/response/notificationResponse';

// 2026-11-11 Swagger 실응답 기준 (projectId는 게시판 알림에서 null).
// 알림 종류마다 비어 있는 필드가 다를 수 있다(예: 좋아요 알림은 body가 없을 수 있음).
// 그래서 화면에 꼭 필요한 것(id, type, createdAt, unread)만 엄격하게 보고, 나머지는 비어 있어도 받아 준다.
const text = z.string().nullish().transform((value) => value ?? '');
const notificationSchema = z.object({
  id: z.number(),
  recipientId: z.number().nullish().transform((value) => value ?? 0),
  actorId: z.number().nullish().transform((value) => value ?? 0),
  actorName: text,
  projectId: z.number().nullish().transform((value) => value ?? null),
  type: z.string(),
  resourceType: text,
  resourceId: z.union([z.string(), z.number()]).nullish().transform((value) => String(value ?? '')),
  title: text,
  body: text,
  linkPath: text,
  readAt: z.string().nullish().transform((value) => value ?? null),
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
  const rawItems = await readApiData(response, parseWith(z.array(z.unknown())));
  // 형식이 다른 알림 한 건 때문에 목록 전체가 실패하지 않도록, 건별로 검사하고 맞지 않는 건은 건너뛴다.
  const items: NotificationItem[] = [];
  const skippedFields = new Set<string>();
  for (const raw of rawItems) {
    const parsed = notificationSchema.safeParse(raw);
    if (parsed.success) items.push(parsed.data);
    else parsed.error.issues.forEach((issue) => skippedFields.add(issue.path.join('.') || '(root)'));
  }
  if (skippedFields.size > 0) {
    // 값은 남기지 않고 어느 필드가 문제인지만 기록한다 (Vercel 로그에서 원인을 찾기 위함)
    console.error('[notifications] 형식이 다른 알림을 건너뜀:', [...skippedFields].join(', '));
  }
  // 하나도 못 읽었는데 원본에는 있었다면, 서버 응답 형식이 바뀐 것이므로 오류로 알린다.
  if (rawItems.length > 0 && items.length === 0) {
    throw new ApiError(502, '알림 응답 형식이 올바르지 않습니다.');
  }
  return items;
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
