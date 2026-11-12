'use server';

import { z } from 'zod';
import { ApiError, AuthExpiredError, AuthRefreshRequiredError } from '@/lib/apiError';
import { changePassword } from '@/service/spring/passwordService';
import type { PasswordChangeState } from '@/types/response/passwordResponse';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해 주세요.'),
  newPassword: z.string().min(1, '새 비밀번호를 입력해 주세요.'),
  confirmPassword: z.string().min(1, '새 비밀번호 확인을 입력해 주세요.'),
}).refine(value => value.newPassword === value.confirmPassword, {
  message: '새 비밀번호와 확인 값이 일치하지 않습니다.',
}).refine(value => value.currentPassword !== value.newPassword, {
  message: '현재 비밀번호와 다른 새 비밀번호를 입력해 주세요.',
});

export async function changePasswordAction(
  _previous: PasswordChangeState,
  formData: FormData,
): Promise<PasswordChangeState> {
  // 비밀번호를 trim하거나 상태/로그로 반환하지 않습니다.
  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });
  if (!parsed.success) return { status: 'error', message: parsed.error.issues[0].message };
  try {
    await changePassword({ currentPassword: parsed.data.currentPassword, newPassword: parsed.data.newPassword });
    return { status: 'success', message: '비밀번호가 변경되었습니다.' };
  } catch (error) {
    if (error instanceof AuthExpiredError || error instanceof AuthRefreshRequiredError || (error instanceof ApiError && error.status === 401)) {
      return { status: 'error', message: '로그인이 만료되었습니다. 다시 로그인한 뒤 시도해 주세요.' };
    }
    if (error instanceof ApiError && error.status === 400) {
      return { status: 'error', message: '현재 비밀번호 또는 새 비밀번호 조건을 확인해 주세요.' };
    }
    if (error instanceof ApiError && error.status === 403) {
      return { status: 'error', message: '현재 비밀번호 또는 변경 권한을 확인해 주세요.' };
    }
    return { status: 'error', message: '비밀번호를 변경하지 못했습니다. 잠시 후 다시 시도해 주세요.' };
  }
}
