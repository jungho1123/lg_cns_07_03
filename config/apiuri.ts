export const matchApiUrl = {
  auth: {
    login: '/api/v1/auth/login',
    signup: '/api/v1/auth/register',
    getUserData: '/api/v1/auth/me',
    refresh: '/api/v1/auth/refresh',
  },
  postRead: {
    list: '/api/v1/posts',
    mine: '/api/v1/me/posts',
    detail: (postId: string) => `/api/v1/posts/${encodeURIComponent(postId)}`,
  },
};
