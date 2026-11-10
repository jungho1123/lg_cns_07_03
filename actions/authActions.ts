'use server';

import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { signIn, signOut } from '@/auth';
import { LoginRejected } from '@/lib/auth/loginError';
import { validateLogin } from '@/lib/auth/validation';

export async function loginAction(
  _previous: { message: string },
  formData: FormData,
): Promise<{ message: string }> {
  const parsed = validateLogin({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.ok) return { message: parsed.message };
  try {
    await signIn('credentials', { ...parsed.value, redirect: false });
  } catch (error) {
    if (error instanceof LoginRejected) return { message: error.publicMessage };
    if (error instanceof AuthError) {
      return {
        message: '로그인 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      };
    }
    throw error;
  }
  // redirect는 흐름 제어 예외를 던지므로 위 catch 바깥에 둔다.
  // /posts는 현재 비어 있으므로 먼저 실제 목적지 페이지를 구현한다.
  redirect('/posts');
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: '/login' });
}
