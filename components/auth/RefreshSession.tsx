'use client';

import { useEffect, useRef, useState } from 'react';
import type { Session } from 'next-auth';
import { getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function RefreshSession() {
  const router = useRouter();
  const work = useRef<Promise<Session | null> | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    // 개발 Strict Mode의 effect 재실행은 같은 Promise를 사용한다.
    work.current ??= getSession();
    work.current
      .then(async (session) => {
        if (!active) return;
        if (!session || session.authError || !session.user.profile) {
          await signOut({ callbackUrl: '/login' });
          return;
        }
        router.refresh();
      })
      .catch(() => {
        if (active)
          setMessage('세션을 확인하지 못했습니다. 다시 시도해 주세요.');
      });
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div role="status">
      <p>{message || '로그인 상태를 갱신하고 있습니다…'}</p>
      {message && (
        <button type="button" onClick={() => window.location.reload()}>
          다시 시도
        </button>
      )}
    </div>
  );
}
