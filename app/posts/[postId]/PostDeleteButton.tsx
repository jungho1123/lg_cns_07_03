'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deletePostAction } from '@/actions/postActions';

type Props = {
  postId: string;
};

export default function PostDeleteButton({ postId }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm('이 게시글을 삭제할까요?')) return;

    setMessage('');

    startTransition(async () => {
      const result = await deletePostAction(postId);

      if (result.message) {
        setMessage(result.message);
        return;
      }

      router.push('/posts');
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="rounded-full px-3 py-1.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      > 
        {pending ? '삭제 중...' : '삭제'}
      </button>
      {message && (
        <p role="alert" className="text-sm text-red-700">{message}</p>
      )}
    </div>
  );
}