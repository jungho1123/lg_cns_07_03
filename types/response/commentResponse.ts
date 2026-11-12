// 기준: api-by-role.md 7번 (명세 기준, 실제 호출로는 아직 확인 전)
export interface CommentAuthor {
  id: number;
  name: string;
  avatarUrl: string | null; // 명세는 string이지만 null이 올 수 있다고 적혀 있음
}

// 댓글 하나 (CommentResponse). 목록 응답의 data는 이것의 배열
export interface CommentItem {
  id: number;
  postId: number;
  content: string;
  author: CommentAuthor;
  createdAt: string; // ISO 8601
  likeCount: number; // 2026-11-12 실제 응답 확인
  // 내가 좋아요를 눌렀는지. 명세엔 있지만 실제 응답엔 없어서(2026-11-12 확인)
  // commentService가 likes/me API로 따로 받아 와 채운다.
  likedByMe: boolean;
}

// 이 글에서 내가 좋아요한 댓글 ID 목록 (GET .../comments/likes/me)
export interface CommentLikedMeResponse {
  likedCommentIds: number[];
}

// 댓글 작성 요청 본문. 작성자는 보내지 않는다(서버가 토큰으로 판단)
export interface CreateCommentRequest {
  content: string;
}
