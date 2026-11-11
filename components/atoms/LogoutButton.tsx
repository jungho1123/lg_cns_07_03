'use client';

import { useActionState, type ComponentProps } from 'react';
import { logoutAction } from '@/actions/authActions';
import { Button } from '@/components/ui/button';

type LogoutButtonProps = Pick<
  ComponentProps<typeof Button>,
  'className' | 'variant'
>;

export function LogoutButton({ className, variant }: LogoutButtonProps) {
  const [state, formAction, pending] = useActionState(logoutAction, {
    message: '',
  });
  return (
    <form action={formAction}>
      <Button
        type="submit"
        className={className}
        variant={variant}
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? '로그아웃 중...' : '로그아웃'}
      </Button>
      {state.message && (
        <p role="alert" className="mt-2 max-w-sm text-sm text-red-600">
          {state.message}
        </p>
      )}
    </form>
  );
}
