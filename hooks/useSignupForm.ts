'use client';

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from 'react';
import { signupAction } from '@/actions/signupActions';
import { validateSignup } from '@/lib/auth/validation';

export function useSignupForm() {
  const [state, formAction, pending] = useActionState(signupAction, {
    success: false,
    message: '',
  });
  const [clientMessage, setClientMessage] = useState('');
  const submitting = useRef(false);

  useEffect(() => {
    if (!pending) submitting.current = false;
  }, [pending, state]);

  const handleSubmit: ComponentProps<'form'>['onSubmit'] = (event) => {
    if (pending || submitting.current || state.success) {
      event.preventDefault();
      return;
    }

    const data = new FormData(event.currentTarget);
    const parsed = validateSignup({
      email: data.get('email'),
      name: data.get('name'),
      password: data.get('password'),
      confirmPassword: data.get('confirm-password'),
      role: data.get('role'),
    });

    if (!parsed.ok) {
      setClientMessage(parsed.message);
      event.preventDefault();
      return;
    }

    setClientMessage('');
    submitting.current = true;
  };

  return {
    formAction,
    handleSubmit,
    pending,
    success: state.success,
    message: clientMessage || state.message,
  };
}
