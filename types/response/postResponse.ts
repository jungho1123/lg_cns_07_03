import type { ApiResponse } from '@/types/response/common';

// Swagger에서 직접 실행한 목록·상세 성공 응답 기준입니다.
export type PostResponse = {
  id: number;
  title?: string | null;
  content: string;
  author: { id: number; name: string; avatarUrl: string | null };
  createdAt: string;
  updatedAt: string | null;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};
// items 내부는 실응답 확인 완료. page/size/hasNext는 목록 응답 하단 추가 확인이 필요합니다.
export type PostPageResponse = {
  items: PostResponse[];
  page: number;
  size: number;
  hasNext: boolean;
};
export type PostListQuery = { page?: number; size?: number };
export type PostListApiResponse = ApiResponse<PostPageResponse>;
export type PostDetailApiResponse = ApiResponse<PostResponse>;
export type PostReadResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

// /api/v1/posts/me의 응답은 전체 게시글 목록과 동일합니다.
export type MyPostPageResponse = PostPageResponse;
