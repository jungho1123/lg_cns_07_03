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
    const parsed = validateSignup({
      email: data.get('email'),
      name: data.get('name'),
      password: data.get('password'),
      role: data.get('role'),
    });

    if (!parsed.ok) {
      setClientMessage(parsed.message);
      event.preventDefault();
      return;
    }

    if (parsed.value.password !== data.get('confirm-password')) {
      setClientMessage('비밀번호가 일치하지 않습니다.');
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
    message: clientMessage || state.message,
  };
}
