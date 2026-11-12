'use server';

import { refresh } from 'next/cache';
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

export type InlinePostResult = { message: string };

// 목록 위 텍스트박스용: 이동하지 않고 저장만 한 뒤 목록을 새로 가져온다.
// 제목 없이 내용만 받는다. 실패하면 메시지를 돌려주고, 성공하면 빈 메시지를 돌려준다.
export async function createPostInlineAction(content: string): Promise<InlinePostResult> {
  const parsed = postSchema.shape.content.safeParse(typeof content === 'string' ? content : '');
  if (!parsed.success) return { message: parsed.error.issues[0].message };

  try {
    await createPost({ content: parsed.data });
  } catch (error) {
    const message =
      error instanceof AuthExpiredError ? error.message : publicErrorMessage(error);
    return { message };
  }

  refresh(); // 서버가 목록을 다시 가져와서 새 글이 맨 위에 나타난다
  return { message: '' };
}

const updatePostActionSchema = z.object({
  postId: z.string().regex(/^\d+$/, '게시글 번호가 올바르지 않습니다.'),
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해 주세요.')
    .max(200, '제목은 200자까지 쓸 수 있습니다.'),
  content: z
    .string()
    .trim()
    .min(1, '내용을 입력해 주세요.')
    .max(10000, '내용은 10000자까지 쓸 수 있습니다.'),
});

// 수정 폼에서 호출하는 서버 액션
export async function updatePostAction(
  _previous: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const rawPostId = formData.get('postId');
  const rawTitle = formData.get('title');
  const rawContent = formData.get('content');

  const postId = typeof rawPostId === 'string' ? rawPostId : '';
  const title = typeof rawTitle === 'string' ? rawTitle : '';
  const content = typeof rawContent === 'string' ? rawContent : '';

  const parsed = updatePostActionSchema.safeParse({ postId, title, content });
  if (!parsed.success) {
    return {
      message: parsed.error.issues[0].message,
      title,
      content,
    };
  }

  const { updatePost } = await import('@/service/spring/postWriteService');
  const result = await updatePost(parsed.data.postId, {
    title: parsed.data.title,
    content: parsed.data.content,
  });

  if (!result.ok) {
    return { message: result.message, title, content };
  }

  // 기존 작성 화면과 수정 폼의 취소 주소에 맞춰 상세 화면으로 이동한다.
  redirect(`/posts/${parsed.data.postId}`);
}

// 삭제 버튼에서 호출한다. 성공 시 빈 메시지를 반환해 버튼이 목록으로 이동하게 한다.
export async function deletePostAction(
  postId: string,
): Promise<{ message: string }> {
  const parsedPostId = z
    .string()
    .regex(/^\d+$/, '게시글 번호가 올바르지 않습니다.')
    .safeParse(postId);

  if (!parsedPostId.success) {
    return { message: parsedPostId.error.issues[0].message };
  }

  const { deletePost } = await import('@/service/spring/postWriteService');
  const result = await deletePost(parsedPostId.data);
  if (!result.ok) {
    return { message: result.message };
  }

  refresh();
  return { message: '' };
}