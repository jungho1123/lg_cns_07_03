'use client';

import { useActionState } from 'react';
import { logoutAction } from '@/actions/authActions';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const [state, formAction, pending] = useActionState(logoutAction, {
    message: '',
  });
  return (
    <form action={formAction}>
      <Button type="submit" disabled={pending} aria-busy={pending}>
        {pending ? 'Logging out...' : 'Logout'}
      </Button>
    </form>
  );
}
