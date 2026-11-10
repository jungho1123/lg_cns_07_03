'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { loginAction } from '@/actions/authActions';
import { validateLogin } from '@/lib/auth/validation';

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, { message: '' });
  const [clientMessage, setClientMessage] = useState('');
  const submitting = useRef(false);

  useEffect(() => {
    if (!pending) submitting.current = false;
  }, [pending, state]);

  return (
    <main>
      <h1>로그인</h1>
      <form
        noValidate
        action={action}
        onSubmit={(event) => {
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
        }}
      >
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
        />
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <button type="submit" disabled={pending} aria-busy={pending}>
          {pending ? '로그인 중…' : '로그인'}
        </button>
        <p role="alert">{clientMessage || state.message}</p>
      </form>
    </main>
  );
}
