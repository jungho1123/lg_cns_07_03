// formdata 해석 &서비스 호출 & 결과 반환
'use server';

import { validateSignup } from '@/lib/auth/validation';
import { ApiError, publicErrorMessage } from '@/lib/apiError';
import { signup } from '@/service/spring/authService';

type SignupActionState = {
  success: boolean;
  message: string;
};

export async function signupAction(
  _previous: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  const parsed = validateSignup({
    email: formData.get('email'),
    name: formData.get('name'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
    role: formData.get('role'),
  });
  if (!parsed.ok) return { success: false, message: parsed.message };
  try {
    await signup(parsed.value);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError && error.status === 409
          ? error.message
          : publicErrorMessage(error),
    };
  }
  return { success: true, message: '' };
}
