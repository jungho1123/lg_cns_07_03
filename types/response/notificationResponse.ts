// 알림(Notification) API 응답 타입
// [확인됨] = 실제 서버 호출로 확인

// 알림 종류. 서버가 나중에 종류를 추가할 수 있으니 화면에서는 모르는 값도 처리해야 한다.
export type NotificationType =
  | "CHAT_MESSAGE"
  | "POST_CREATED"
  | "COMMENT_CREATED"
  | "COUNSELING_REQUESTED"
  | "COUNSELING_ACCEPTED"
  | "COUNSELING_REJECTED"
  | "MEETING_INVITED"
  | "PROJECT_INVITED"
  | "PROJECT_MEMBER_JOINED"
  | "ROLE_CHANGE_REQUESTED"
  | "ROLE_CHANGE_APPROVED"
  | "ROLE_CHANGE_REJECTED";

// 알림 항목 1개 [문서]
export type NotificationItem = {
  id: number;
  recipientId: number; // 알림을 받는 사람
  actorId: number; // 행동한 사람
  actorName: string;
  projectId: number;
  type: NotificationType;
  resourceType: string; // 대상 종류 (확인 필요: 어떤 값들이 오는지)
  resourceId: string; // 대상 ID
  title: string; // 서버가 만든 제목 (그대로 표시)
  body: string; // 서버가 만든 내용 (그대로 표시)
  linkPath: string; // 클릭 시 이동할 경로 (확인 필요: 우리 앱 경로와 맞는지)
  readAt: string | null; // 읽은 시각 (확인 필요: 안 읽음일 때 null인지)
  createdAt: string; // ISO 8601 날짜 문자열
  unread: boolean;
};

// 목록 조회: GET /api/v1/notifications?limit=50
// data가 알림 배열 [문서]
export type NotificationListData = NotificationItem[];

// 안 읽은 수: GET /api/v1/notifications/unread-count
// data: { count: number } [확인됨]
export type UnreadCountData = {
  count: number;
};

// 읽음 처리: POST /api/v1/notifications/{notificationId}/read
// data: 읽음 처리된 알림 1개 [문서]
export type MarkReadData = NotificationItem;

// 모두 읽음: POST /api/v1/notifications/read-all
// data: { updated: number } (읽음 처리된 개수) [확인됨]
export type ReadAllData = {
  updated: number;
};
