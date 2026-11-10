import { z } from 'zod';
import type { LoginInput } from '@/types/response/authResponse';

export const loginSchema = z.object({
  email: z
    .string({ error: ' 공백일 수 없습니다.' })
    .trim()
    .min(1, { error: ' 공백일 수 없습니다.' })
    .pipe(z.email({ error: ' 이메일 형식이 올바르지 않습니다.' })),
  password: z
    .string({ error: ' 공백일 수 없습니다.' })
    .refine((value) => value.trim().length > 0, {
      error: ' 공백일 수 없습니다.',
    }),
});

export function validateLogin(input: {
  email: unknown;
  password: unknown;
}): { ok: true; value: LoginInput } | { ok: false; message: string } {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0].message ?? ' 입력값을 확인해 주세요 ',
    };
  }
  return {
    ok: true,
    value: parsed.data,
  };
}
