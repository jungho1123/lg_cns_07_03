export const matchApiUrl = {
  auth: {
    login: '/api/v1/auth/login',
    signup: '/api/v1/auth/register',
    getUserData: '/api/v1/auth/me',
    refresh: '/api/v1/auth/refresh',
    logout: '/api/v1/auth/logout',
  },
  postRead: {
    list: '/api/v1/posts',
    mine: '/api/v1/me/posts',
    detail: (postId: string) => `/api/v1/posts/${encodeURIComponent(postId)}`,
  },
  // [4번 박세진] 목록(GET)과 작성(POST)은 같은 주소, 삭제(DELETE)는 detail
  comment: {
    list: (postId: number) => `/api/v1/posts/${postId}/comments`,
    detail: (postId: number, commentId: number) =>
      `/api/v1/posts/${postId}/comments/${commentId}`,
  },
  // 알림: 목록은 ?limit=50 처럼 개수를 붙여서 부른다
  notification: {
    list: '/api/v1/notifications',
    read: (notificationId: number) => `/api/v1/notifications/${notificationId}/read`,
    readAll: '/api/v1/notifications/read-all',
  },
};
