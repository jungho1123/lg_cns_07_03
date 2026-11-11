'use server';

import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { signIn, signOut, unstable_update } from '@/auth';
import { LoginRejected } from '@/lib/auth/loginError';
import { validateLogin } from '@/lib/auth/validation';
import { requireAuthToken } from '@/lib/currentUser';
import { logout as springLogout } from '@/service/spring/authService';

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

export async function logoutAction(_previous: {
  message: string;
}): Promise<{ message: string }> {
  try {
    const session = await unstable_update({});
    if (session?.authError) {
      return {
        message:
          '인증이 만료되어 서버 로그아웃을 수행 할 수 없습니다. 다시 로그인후 로그아웃을 시도해 주세요.',
      };
    }
    if (session) {
      const { accessToken } = await requireAuthToken();
      await springLogout(accessToken);
    }
  } catch {
    return {
      message: '서버 로그아웃 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.',
    };
  }
  return signOut({ redirectTo: '/login' });
}
