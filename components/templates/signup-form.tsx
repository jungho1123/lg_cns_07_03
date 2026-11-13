import { cn } from 'cn';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RoleSchema } from '@/lib/auth/validation';
type SignupFormProps = Omit<React.ComponentProps<'div'>, 'onSubmit'> & {
  formAction: (formData: FormData) => void;
  onSubmit: React.ComponentProps<'form'>['onSubmit'];
  pending: boolean;
  message: string;
};

export function SignupForm({
  className,
  formAction,
  onSubmit,
  pending,
  message,
  ...props
}: SignupFormProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">회원가입</CardTitle>
          <CardDescription>이메일과 비밀번호를 입력해 주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form noValidate action={formAction} onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">이름</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="홍길동"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">이메일</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="role">역할</FieldLabel>
                <select
                  id="role"
                  name="role"
                  defaultValue=""
                  required
                  disabled={pending}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm capitalize disabled:opacity-50"
                >
                  <option value="" disabled>
                    역할을 선택해 주세요
                  </option>
                  {RoleSchema.options.map((role) => (
                    <option key={role} value={role}>
                      {role.toLowerCase().replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      비밀번호 확인
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  비밀번호는 최소 8자 이상이어야 합니다.
                </FieldDescription>
              </Field>
              <Field>
                <FieldError>{message}</FieldError>
                <Button type="submit" disabled={pending} aria-busy={pending}>
                  {pending ? '회원가입 중...' : '회원가입'}
                </Button>
                <FieldDescription className="text-center">
                  이미 계정이 있으신가요? <a href="/login">로그인</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        회원가입을 진행하면 <a href="#">이용약관</a> 및{' '}
        <a href="#">개인정보처리방침</a>에 동의하게 됩니다.
      </FieldDescription>
    </div>
  );
}
