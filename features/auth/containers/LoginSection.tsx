'use client';
import { LoginForm } from '@/components/templates/login-form';
import { useLoginForm } from '@/hooks/useLoginForm';

export function LoginSection() {
  const { formAction, handleSubmit, pending, message } = useLoginForm();
  return (
    <LoginForm
      formAction={formAction}
      onSubmit={handleSubmit}
      pending={pending}
      message={message}
    />
  );
}
