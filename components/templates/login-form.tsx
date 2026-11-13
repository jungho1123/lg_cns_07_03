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
type LoginFormProps = Omit<React.ComponentProps<'div'>, 'onSubmit'> & {
  formAction: (formData: FormData) => void;
  onSubmit: React.ComponentProps<'form'>['onSubmit'];
  pending: boolean;
  message: string;
};

export function LoginForm({
  className,
  formAction,
  onSubmit,
  pending,
  message,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>이메일과 비밀번호를 입력해 주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form noValidate action={formAction} onSubmit={onSubmit}>
            <FieldGroup>
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
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input id="password" name="password" type="password" required />
              </Field>
              <Field>
                <FieldError> {message} </FieldError>
                <Button type="submit" disabled={pending} aria-busy={pending}>
                  {pending ? '로그인 중...' : '로그인'}
                </Button>
                <FieldDescription className="text-center">
                  아직 계정이 없으신가요?<a href="/signup">회원가입</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
