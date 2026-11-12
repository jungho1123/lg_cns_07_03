import 'server-only';
import { z } from 'zod';
import { matchApiUrl } from '@/config/apiuri';
import { ApiError, AuthExpiredError } from '@/lib/apiError';
import { authenticatedRequest } from '@/lib/auth/authenticatedRequest';
import { readApiData } from '@/lib/fetchClients';
import { parsePostData } from '@/service/spring/postReadService';
import type {
  PostReadResult,
  PostResponse,
} from '@/types/response/postResponse';

export type CreatePostInput = { title?: string; content: string };

// 작성 후에는 "방금 만든 글로 이동"만 하면 되므로 응답에서 id만 검사한다.
// 글은 이미 저장된 뒤라서, 다른 필드 모양 때문에 실패로 보이게 하지 않으려는 이유도 있다.
const createdSchema = z.object({ id: z.number().int().positive() });

function parseCreated(value: unknown): { id: number } {
  const parsed = createdSchema.safeParse(value);
  if (!parsed.success) throw new ApiError(502, '글 작성 응답 형식이 올바르지 않습니다.');
  return { id: parsed.data.id };
}

// authenticatedRequest는 서버 액션에서만 쓸 수 있다 (토큰 만료 시 갱신 + Bearer 헤더 첨부)
export async function createPost(input: CreatePostInput): Promise<{ id: number }> {
  const response = await authenticatedRequest(matchApiUrl.postRead.list, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return readApiData(response, parseCreated);
}

// updatePost와 deletePost는 서버 액션에서만 쓸 수 있다 (토큰 만료 시 갱신 + Bearer 헤더 첨부)
export const updatePostInputSchema = z.object({
  title: z.string().trim().min(1, '제목을 입력해 주세요.'),
  content: z.string().trim().min(1, '본문을 입력해 주세요.'),
});

export type UpdatePostInput = z.infer<typeof updatePostInputSchema>;

function mutationError<T>(
  error: unknown,
  action: '수정' | '삭제',
): PostReadResult<T> {
  if (error instanceof AuthExpiredError) {
    return {
      ok: false,
      status: 401,
      message: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
    };
  }

  if (error instanceof ApiError) {
    if (error.status === 401) {
      return { ok: false, status: 401, message: '로그인이 필요합니다.' };
    }

    if (error.status === 403) {
      return {
        ok: false,
        status: 403,
        message: `내가 작성한 글만 ${action}할 수 있습니다.`,
      };
    }

    if (error.status === 404) {
      return { ok: false, status: 404, message: '게시글을 찾을 수 없습니다.' };
    }

    return {
      ok: false,
      status: error.status,
      message: `게시글 ${action}에 실패했습니다. 잠시 후 다시 시도해 주세요.`,
    };
  }

  return {
    ok: false,
    status: 500,
    message: `게시글 ${action} 설정이나 서버 상태를 확인해 주세요.`,
  };
}

export async function updatePost(
  postId: string,
  input: UpdatePostInput,
): Promise<PostReadResult<PostResponse>> {
  if (!/^\d+$/.test(postId)) {
    return { ok: false, status: 400, message: '게시글 번호가 올바르지 않습니다.' };
  }

  const parsedInput = updatePostInputSchema.safeParse(input);
  if (!parsedInput.success) {
    return { ok: false, status: 400, message: '제목과 본문을 확인해 주세요.' };
  }

  try {
    const response = await authenticatedRequest(
      matchApiUrl.postRead.detail(postId),
      {
        method: 'PUT',
        body: JSON.stringify(parsedInput.data),
      },
    );

    const data = await readApiData(response, parsePostData);
    return { ok: true, data };
  } catch (error) {
    return mutationError(error, '수정');
  }
}

const deletedSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export async function deletePost(
  postId: string,
): Promise<PostReadResult<{ message: string }>> {
  if (!/^\d+$/.test(postId)) {
    return { ok: false, status: 400, message: '게시글 번호가 올바르지 않습니다.' };
  }

  try {
    const response = await authenticatedRequest(
      matchApiUrl.postRead.detail(postId),
      { method: 'DELETE' },
    );

    if (!response.ok) {
      // 오류 응답은 공통 응답 처리 함수가 ApiError로 변환합니다.
      await readApiData(response, () => null);
      return {
        ok: false,
        status: 502,
        message: '삭제 응답을 확인하지 못했습니다.',
      };
    }

    const body: unknown = await response.json();
    const parsed = deletedSchema.safeParse(body);

    if (!parsed.success) {
      return {
        ok: false,
        status: 502,
        message: '게시글 삭제 응답 형식이 올바르지 않습니다.',
      };
    }

    return { ok: true, data: { message: parsed.data.message } };
  } catch (error) {
    return mutationError(error, '삭제');
  }
}