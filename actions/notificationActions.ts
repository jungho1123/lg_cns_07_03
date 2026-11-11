'use server';

import { ApiError, AuthExpiredError, publicErrorMessage } from '@/lib/apiError';
import { markAllNotificationsRead, markNotificationRead } from '@/service/spring/notificationService';

export type NotificationActionState = { ok: boolean; message: string };

function failure(error: unknown): NotificationActionState {
  if (error instanceof AuthExpiredError) return { ok: false, message: error.message };
  if (error instanceof ApiError && error.status === 403) {
    return { ok: false, message: '내 알림만 읽음 처리할 수 있습니다.' };
  }
  return { ok: false, message: publicErrorMessage(error) };
}

// 알림 id는 브라우저가 바꿔 보낼 수 있으므로 숫자인지 다시 확인한다. 남의 알림이면 서버가 403으로 막는다.
export async function markNotificationReadAction(notificationId: number): Promise<NotificationActionState> {
  if (!Number.isSafeInteger(notificationId) || notificationId < 1) {
    return { ok: false, message: '알림 번호가 올바르지 않습니다.' };
  }
  try {
    await markNotificationRead(notificationId);
  } catch (error) {
    return failure(error);
  }
  return { ok: true, message: '' };
}

// 서버의 read-all은 채팅 등 다른 종류의 알림도 함께 읽음 처리한다. 우리 앱은 게시글 알림만 보여 주므로 그대로 쓴다.
export async function markAllNotificationsReadAction(): Promise<NotificationActionState> {
  try {
    await markAllNotificationsRead();
  } catch (error) {
    return failure(error);
  }
  return { ok: true, message: '' };
}
