// 회원가입 화면 구성
'use client';
import { useRouter } from 'next/navigation';
import { SignupSuccessDialog } from '@/components/organisms/SignupSuccessDialog';
import { SignupForm } from '@/components/templates/signup-form';
import { useSignupForm } from '@/hooks/useSignupForm';

export function SignupSection() {
  const router = useRouter();
  const { formAction, handleSubmit, pending, success, message } = useSignupForm();
  return (
    <>
      <SignupForm
        formAction={formAction}
        onSubmit={handleSubmit}
        pending={pending}
        message={message}
      />
      <SignupSuccessDialog
        open={success}
        onConfirm={() => router.replace('/')}
      />
    </>
  );
}
