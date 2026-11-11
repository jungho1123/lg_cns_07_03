'use client';

import { useCallback, useRef, useState } from 'react';

// 잠깐 보였다가 저절로 사라지는 알림 문구를 다룬다. (Toast 컴포넌트와 함께 쓴다)
// show()를 연달아 부르면 이전 타이머를 취소하고 새로 시작한다.
export function useNotice(duration = 2500) {
  const [notice, setNotice] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setNotice('');
  }, []);

  const show = useCallback(
    (message: string) => {
      if (timer.current) clearTimeout(timer.current);
      setNotice(message);
      timer.current = setTimeout(() => setNotice(''), duration);
    },
    [duration],
  );

  return { notice, show, clear };
}
