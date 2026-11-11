// formdata 해석 &서비스 호출 & 결과 반환
'use server';

import { validateSignup } from '@/lib/auth/validation';
import { ApiError, publicErrorMessage } from '@/lib/apiError';
import { signup } from '@/service/spring/authService';
import { redirect } from 'next/navigation';
export async function signupAction(
  _previous: { message: string },
  formData: FormData,
): Promise<{ message: string }> {
  const parsed = validateSignup({
    email: formData.get('email'),
    name: formData.get('name'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
    role: formData.get('role'),
  });
  if (!parsed.ok) return { message: parsed.message };
  try {
    await signup(parsed.value);
  } catch (error) {
    return {
      message:
        error instanceof ApiError && error.status === 409
          ? error.message
          : publicErrorMessage(error),
    };
  }
  redirect('/login');
}
