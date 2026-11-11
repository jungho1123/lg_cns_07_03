'use client';

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from 'react';
import { loginAction } from '@/actions/authActions';
import { validateLogin } from '@/lib/auth/validation';

export function useLoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {
    message: '',
  });
  const [clientMessage, setClientMessage] = useState('');
  const submitting = useRef(false);

  useEffect(() => {
    if (!pending) submitting.current = false;
  }, [pending, state]);

  const handleSubmit: ComponentProps<'form'>['onSubmit'] = (event) => {
    if (pending || submitting.current) {
      event.preventDefault();
      return;
    }

    const data = new FormData(event.currentTarget);
    const parsed = validateLogin({
      email: data.get('email'),
      password: data.get('password'),
    });

    setClientMessage(parsed.ok ? '' : parsed.message);

    if (!parsed.ok) {
      event.preventDefault();
      return;
    }

    submitting.current = true;
  };

  return {
    formAction,
    handleSubmit,
    pending,
    message: clientMessage || state.message,
  };
}
