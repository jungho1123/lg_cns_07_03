// formdata 해석 &서비스 호출 & 결과 반환
'use server';

import { validateSignup } from '@/lib/auth/validation';
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
    role: formData.get('role'),
  });
  if (!parsed.ok) return { message: parsed.message };
  try {
    await signup(parsed.value);
  } catch {
    return { message: '회원가입 처리에 실패했습니다.' };
  }
  redirect('/login');
}
