import { z } from 'zod';
import type { LoginInput } from '@/types/response/authResponse';
import type { SignupInput } from '@/types/response/authResponse';
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
export const RoleSchema = z.enum(
  [
    'STUDENT',
    'MENTOR',
    'INSTRUCTOR',
    'OPERATOR',
    'PROJECT_MANAGER',
    'PROJECT_LEADER',
    'PLANNER',
    'DESIGNER',
    'DEVELOPER',
  ],
  { error: ' 역할이 올바르지 않습니다. ' },
);

export const signupSchema = z.object({
  email: z
    .string({ error: ' 이메일 형식이 올바르지 않습니다.' })
    .trim()
    .min(1, { error: ' 공백일 수 없습니다.' })
    .pipe(z.email({ error: ' 이메일 형식이 올바르지 않습니다.' })),
  name: z
    .string({ error: ' 공백일 수 없습니다.' })
    .trim()
    .min(1, { error: ' 공백일 수 없습니다.' })
    .max(80, { error: ' 이름은 2에서 80자 사이여야 합니다.' }),
  password: z
    .string({ error: ' 공백일 수 없습니다.' })
    .refine((value) => value.trim().length > 0, {
      error: ' 공백일 수 없습니다.',
    })
    .min(8, { error: '크기가 8에서 72 사이여야 합니다' })
    .max(72, { error: '크기가 8에서 72 사이여야 합니다' }),
  role: RoleSchema,
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

export function validateSignup(input: {
  email: unknown;
  name: unknown;
  password: unknown;
  confirmPassword: unknown;
  role: unknown;
}): { ok: true; value: SignupInput } | { ok: false; message: string } {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0].message ?? ' 입력값을 확인해 주세요 ',
    };
  }
  if (parsed.data.password !== input.confirmPassword) {
    return { ok: false, message: '비밀번호가 일치하지 않습니다.' };
  }
  return {
    ok: true,
    value: parsed.data,
  };
}
