// 알림을 화면에 보여 줄 때 쓰는 규칙. 서버/브라우저 어디서든 쓸 수 있게 서버 전용 코드는 넣지 않는다.
import type { NotificationItem } from '@/types/response/notificationResponse';

// 우리 앱에서 열 수 있는 알림은 "게시글로 가는 알림"(/posts/숫자)뿐이다.
// 채팅(/dm?...) 같은 다른 종류는 우리 앱에 해당 페이지가 없어서 목록에서 제외한다.
const POST_LINK = /^\/posts\/\d+$/;

export function isPostNotification(item: Pick<NotificationItem, 'linkPath'>): boolean {
  return POST_LINK.test(item.linkPath);
}

// 알림 한 줄 문장. 아는 종류는 직접 문장을 만들고, 모르는 종류는 서버가 만든 제목을 그대로 쓴다.
export function notificationMessage(item: NotificationItem): string {
  const name = item.actorName.trim() || '누군가';
  switch (item.type) {
    case 'COMMENT_CREATED':
      return `${name}님이 나의 글에 댓글을 작성했습니다`;
    case 'POST_LIKED': // 2026-11-12 실제 응답 확인: resourceType FEED_POST, body는 null
      return `${name}님이 나의 글에 좋아요를 눌렀습니다`;
    default:
      return item.title;
  }
}
