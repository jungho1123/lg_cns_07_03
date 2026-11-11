'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { AuthExpiredError, publicErrorMessage } from '@/lib/apiError';
import { createPost } from '@/service/spring/postWriteService';

export type PostFormState = { message: string; title: string; content: string };

const postSchema = z.object({
  title: z.string().trim().max(200, '제목은 200자까지 쓸 수 있습니다.'),
  content: z
    .string()
    .trim()
    .min(1, '내용을 입력해 주세요.')
    .max(10000, '내용은 10000자까지 쓸 수 있습니다.'),
});

export async function createPostAction(
  _previous: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const rawTitle = formData.get('title');
  const rawContent = formData.get('content');
  const title = typeof rawTitle === 'string' ? rawTitle : '';
  const content = typeof rawContent === 'string' ? rawContent : '';

  const parsed = postSchema.safeParse({ title, content });
  if (!parsed.success) return { message: parsed.error.issues[0].message, title, content };

  let id: number;
  try {
    const created = await createPost({
      title: parsed.data.title || undefined, // 비어 있으면 제목을 아예 보내지 않는다(제목은 선택)
      content: parsed.data.content,
    });
    id = created.id;
  } catch (error) {
    const message =
      error instanceof AuthExpiredError ? error.message : publicErrorMessage(error);
    return { message, title, content };
  }

  // redirect는 이동 신호를 예외로 던지므로 try/catch 밖에 둔다.
  redirect(`/posts/${id}`);
}
