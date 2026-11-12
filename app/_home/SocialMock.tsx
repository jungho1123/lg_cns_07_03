import styles from './home.module.css';

// 메인 화면 오른쪽의 "SNS 앱 화면 모음". 글 카드, 댓글 말풍선, 알림이 겹쳐 떠 있는 모양을 보여 준다.
// 실제 데이터가 아니라 꾸미기용 샘플이라서(가상의 이름과 글) 스크린리더는 읽지 않게 숨긴다.

type PostCardProps = {
  initial: string;
  avatarClass: string;
  name: string;
  time: string;
  text: string;
  likes: number;
  comments: number;
  liked?: boolean;
};

function PostCard({ initial, avatarClass, name, time, text, likes, comments, liked = false }: PostCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl shadow-slate-300/40 ring-1 ring-black/5">
      <div className="flex items-center gap-3">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full font-semibold ${avatarClass}`}>
          {initial}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="font-semibold text-zinc-900">{name}</p>
          <p className="text-xs text-zinc-500">{time}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-800">{text}</p>
      <div className="mt-3 flex items-center gap-4 text-sm text-zinc-500">
        <span className={liked ? 'text-red-500' : ''}>
          {liked ? '♥' : '♡'} {likes}
        </span>
        <span>💬 {comments}</span>
      </div>
    </div>
  );
}

export function SocialMock() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-[26rem] w-full max-w-md lg:h-[30rem]">
      {/* 떠 있는 하트 */}
      <div className={`${styles.floatFast} absolute -top-1 right-2 z-10`}>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-red-500 shadow-lg ring-1 ring-black/5">
          ♥ 24
        </span>
      </div>

      {/* 글 카드 1 */}
      <div className="absolute left-0 top-4 w-[82%] -rotate-2">
        <div className={styles.float}>
          <PostCard
            initial="하"
            avatarClass="bg-blue-100 text-blue-700"
            name="하늘"
            time="방금 전"
            text="오늘 점심 뭐 먹지? 추천 받아요 🍜"
            likes={12}
            comments={3}
          />
        </div>
      </div>

      {/* 글 카드 2 */}
      <div className="absolute right-0 top-[9.5rem] w-[82%] rotate-2 lg:top-[10.5rem]">
        <div className={styles.floatSlow}>
          <PostCard
            initial="민"
            avatarClass="bg-fuchsia-100 text-fuchsia-700"
            name="민수"
            time="5분 전"
            text="새로 만든 화면 어때요? 의견 남겨 주세요!"
            likes={8}
            comments={5}
            liked
          />
        </div>
      </div>

      {/* 댓글 말풍선 */}
      <div className="absolute bottom-10 left-2 w-[70%] lg:bottom-12">
        <div className={styles.floatFast}>
          <div className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-xl shadow-slate-300/40 ring-1 ring-black/5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              지
            </span>
            <div className="min-w-0 leading-tight">
              <p className="text-sm font-semibold text-zinc-900">
                지아 <span className="text-xs font-normal text-zinc-500">· 방금 전</span>
              </p>
              <p className="mt-1 text-sm text-zinc-700">좋은 글이네요! 👍</p>
            </div>
          </div>
        </div>
      </div>

      {/* 알림 */}
      <div className="absolute bottom-0 right-0 z-10 w-[76%]">
        <div className={styles.float}>
          <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 p-3 text-white shadow-xl shadow-slate-400/40">
            <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15">
              🔔
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
                1
              </span>
            </span>
            <p className="text-sm leading-snug">민수님이 나의 글에 좋아요를 눌렀습니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}
