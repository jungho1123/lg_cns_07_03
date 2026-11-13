'use client';

import { Heart } from 'lucide-react';
import { startTransition, useOptimistic, useState, useTransition } from 'react';
import { togglePostLikeAction } from '@/actions/likeActions';

type Props = { postId: number; likeCount: number; likedByMe: boolean };
type LikeState = { liked: boolean; count: number };

// 글 좋아요 버튼 (목록 카드와 상세 화면에서 같이 쓴다).
// 누르면 하트와 숫자를 먼저 바꾸고(낙관적 업데이트), 서버 응답의 값으로 확정한다. 실패하면 원래대로 돌아간다.
export default function PostLikeButton({ postId, likeCount, likedByMe }: Props) {
  const [pending, startLikeTransition] = useTransition();
  const [message, setMessage] = useState('');

  // 서버가 확정해 준 값. 화면이 새 데이터를 받으면(props가 바뀌면) 그 값으로 맞춘다.
  // "더보기"로 불러온 이전 페이지 글은 props가 갱신되지 않아서, 서버 응답을 직접 보관해 두어야 한다.
  const [confirmed, setConfirmed] = useState<LikeState>({ liked: likedByMe, count: likeCount });
  const [seen, setSeen] = useState({ likedByMe, likeCount });
  if (seen.likedByMe !== likedByMe || seen.likeCount !== likeCount) {
    setSeen({ likedByMe, likeCount });
    setConfirmed({ liked: likedByMe, count: likeCount });
  }

  const [shown, applyToggle] = useOptimistic(confirmed, (current: LikeState) => ({
    liked: !current.liked,
    count: Math.max(0, current.count + (current.liked ? -1 : 1)),
  }));

  function toggle() {
    if (pending) return; // 요청 중에는 연타를 막는다
    setMessage('');
    startLikeTransition(async () => {
      applyToggle(undefined);
      const result = await togglePostLikeAction(postId);
      if (!result.ok) {
        setMessage(result.message); // 실패하면 낙관적으로 바꾼 화면은 저절로 원래대로 돌아간다
        return;
      }
      // await 뒤의 상태 변경은 다시 transition으로 감싸야 하트가 깜빡이지 않는다
      startTransition(() => setConfirmed({ liked: result.liked, count: result.likeCount }));
    });
  }

  return (
    <>
      {/* relative z-10: 목록 카드는 카드 전체가 상세 링크(after로 덮음)라서, 버튼이 그 위에 와야 눌러도 상세로 이동하지 않는다 */}
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={shown.liked}
        aria-label={`좋아요 ${shown.count}개${shown.liked ? ', 내가 누름' : ''}`}
        className={`relative z-10 -ml-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm transition-colors disabled:cursor-wait ${
          shown.liked ? 'text-red-500' : 'text-gray-500 hover:bg-red-50 hover:text-red-500'
        }`}
      >
        {/* 같은 하트 그림 하나로, 안 눌렀을 때는 속을 비우고(빈 하트) 눌렀을 때는 속을 채운다(꽉 찬 하트).
            글자 ♡/♥는 크기와 모양이 서로 달라서 아이콘을 쓴다. 색은 위의 text-red-500이 바꾼다. */}
        <Heart aria-hidden="true" className="size-4" fill={shown.liked ? 'currentColor' : 'none'} />
        <span aria-hidden="true">{shown.count}</span>
      </button>
      {message && (
        <span role="alert" className="relative z-10 text-xs text-red-600">
          {message}
        </span>
      )}
    </>
  );
}
