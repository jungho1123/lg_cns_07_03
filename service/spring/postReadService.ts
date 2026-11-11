import 'server-only';
import { z } from 'zod';
import { matchApiUrl } from '@/config/apiuri';
import { ApiError, AuthExpiredError, AuthRefreshRequiredError } from '@/lib/apiError';
import { requireAuthToken } from '@/lib/currentUser';
import { isAccessTokenExpired } from '@/lib/auth/token';
import { readApiData, springFetch } from '@/lib/fetchClients';
import type { MyPostPageResponse, PostListQuery, PostPageResponse, PostReadResult, PostResponse } from '@/types/response/postResponse';

const id = z.number().int().safe().nonnegative();
const isoDate = z.string().refine(value => Number.isFinite(Date.parse(value)));
// 2026-11-10 Swagger 목록·상세 실응답의 필드 이름을 그대로 검사합니다.
const postSchema: z.ZodType<PostResponse> = z.object({
  id,
  title: z.string().nullable().optional(),
  content: z.string(),
  author: z.object({ id, name: z.string(), avatarUrl: z.string().nullable() }),
  createdAt: isoDate,
  updatedAt: isoDate.nullable(),
  likeCount: z.number().int().safe().nonnegative(),
  commentCount: z.number().int().safe().nonnegative(),
  likedByMe: z.boolean(),
});
const postPageSchema: z.ZodType<PostPageResponse> = z.object({
  items: z.array(postSchema),
  page: z.number().int().nonnegative(),
  size: z.number().int().positive(),
  hasNext: z.boolean(),
});
export function parsePostData(value: unknown): PostResponse {
  const parsed = postSchema.safeParse(value);
  if (!parsed.success) throw new ApiError(502, '게시글 응답 형식이 올바르지 않습니다.');
  return parsed.data;
}
export function parsePostPageData(value: unknown): PostPageResponse {
  const parsed = postPageSchema.safeParse(value);
  if (!parsed.success) throw new ApiError(502, '게시글 목록 응답 형식이 올바르지 않습니다.');
  return parsed.data;
}
async function read<T>(path: string, parse: (value: unknown) => T): Promise<PostReadResult<T>> {
  try {
    const token = await requireAuthToken();
    if (isAccessTokenExpired(token, Date.now())) throw new AuthRefreshRequiredError();
    const response = await springFetch(path, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token.accessToken}` },
    });
    return { ok: true, data: await readApiData(response, parse) };
  } catch (error) {
    if (error instanceof AuthExpiredError || error instanceof AuthRefreshRequiredError) {
      return { ok: false, status: 401, message: '로그인이 만료되었습니다. 다시 로그인해 주세요.' };
    }
    if (error instanceof ApiError) {
      const message = error.status === 401 ? '로그인이 필요합니다.' :
        error.status === 403 ? '게시글을 조회할 권한이 없습니다.' :
        error.status === 404 ? '게시글 또는 요청한 API를 찾을 수 없습니다.' :
        error.status === 502 ? '게시글 응답 형식이 올바르지 않습니다.' :
        '게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
      return { ok: false, status: error.status, message };
    }
    return { ok: false, status: 500, message: '게시글 조회 설정 또는 서버 상태를 확인해 주세요.' };
  }
}
export async function listPosts(query: PostListQuery = {}): Promise<PostReadResult<PostPageResponse>> {
  const { page = 0, size = 20 } = query;
  if (!Number.isSafeInteger(page) || page < 0 || page > 2147483647 ||
      !Number.isSafeInteger(size) || size < 1 || size > 2147483647) {
    return { ok: false, status: 400, message: '목록 조회 조건이 올바르지 않습니다.' };
  }
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return read(`${matchApiUrl.postRead.list}?${params}`, parsePostPageData);
}
export async function getPost(postId: string): Promise<PostReadResult<PostResponse>> {
  if (!/^\d+$/.test(postId)) {
    return { ok: false, status: 400, message: '게시글 번호가 올바르지 않습니다.' };
  }
  return read(matchApiUrl.postRead.detail(postId), parsePostData);
}

const myPostPageSchema: z.ZodType<MyPostPageResponse> = z.object({
  items: z.array(z.unknown()),
  page: z.number().int().nonnegative(),
  size: z.number().int().positive(),
  totalElements: z.number().int().safe().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export function parseMyPostPageData(value: unknown): PostPageResponse {
  const parsed = myPostPageSchema.safeParse(value);
  if (!parsed.success) throw new ApiError(502, '내 글 목록 응답 형식이 올바르지 않습니다.');
  // 아직 비어 있지 않은 응답은 미확인입니다. 피드 형식과 일치하는 경우에만 표시합니다.
  // 다른 형식이면 실패시키며, 실제 항목 확인 후 전용 타입/변환 함수를 추가해야 합니다.
  const posts = z.array(postSchema).safeParse(parsed.data.items);
  if (!posts.success) throw new ApiError(502, '내 글 항목의 실제 응답 형식을 확인해야 합니다.');
  return {
    items: posts.data,
    page: parsed.data.page,
    size: parsed.data.size,
    hasNext: parsed.data.page + 1 < parsed.data.totalPages,
  };
}

export async function listMyPosts(query: PostListQuery = {}): Promise<PostReadResult<PostPageResponse>> {
  const { page = 0, size = 20 } = query;
  if (!Number.isSafeInteger(page) || page < 0 || page > 2147483647 ||
      !Number.isSafeInteger(size) || size < 1 || size > 2147483647) {
    return { ok: false, status: 400, message: '목록 조회 조건이 올바르지 않습니다.' };
  }
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return read(`${matchApiUrl.postRead.mine}?${params}`, parseMyPostPageData);
}
