// 회원가입 화면 구성
'use client';
import { SignupForm } from '@/components/templates/signup-form';
import { useSignupForm } from '@/hooks/useSignupForm';

export function SignupSection() {
  const { formAction, handleSubmit, pending, message } = useSignupForm();
  return (
    <SignupForm
      formAction={formAction}
      onSubmit={handleSubmit}
      pending={pending}
      message={message}
    />
  );
}
