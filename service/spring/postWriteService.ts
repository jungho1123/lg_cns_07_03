import 'server-only';
import { z } from 'zod';
import { matchApiUrl } from '@/config/apiuri';
import { ApiError } from '@/lib/apiError';
import { authenticatedRequest } from '@/lib/auth/authenticatedRequest';
import { readApiData } from '@/lib/fetchClients';

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
