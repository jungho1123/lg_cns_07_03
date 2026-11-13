'use client';
 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';

// 모양 선택
type PupilShape = 'circle' | 'eye' | 'square' | 'diamond' | 'star' | 'heart';
const PUPIL_SHAPE: PupilShape = 'eye';
/* 색상 후보:
 *   '#1f1f1d' 먹색(기본)   '#a9c41f' 진한 라임   '#ff6b4a' 코랄
 *   '#3b5bff' 블루         '#ff4f8b' 핑크       '#7a5cff' 바이올렛
 */
const PUPIL_COLOR = '#1f1f1d';
 
export default function NotFound() {
  const router = useRouter();
  const zeroRef = useRef<HTMLSpanElement>(null);
  const pupilRef = useRef<HTMLSpanElement>(null);
 
  // 마우스 / 터치 위치를 따라 눈동자 이동
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const zero = zeroRef.current;
      const pupil = pupilRef.current;
      if (!zero || !pupil) return;
 
      const rect = zero.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const strength = Math.min(dist / 250, 1); // 가까우면 살짝, 멀면 끝까지
 
      pupil.dataset.active = 'true';
      pupil.style.setProperty('--x', String((dx / dist) * strength));
      pupil.style.setProperty('--y', String((dy / dist) * strength));
    };
 
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
 
  return (
    <div className="flex min-h-screen flex-col bg-[#fafaf6] text-[#1f1f1d]">
      <style>{`
        /* ── 눈 (0의 구멍 위에 얹는 영역) ── */
        .nf-eye {
          --ew: 0.30em; /* 눈 영역 너비 (0의 구멍보다 살짝 크게) */
          --eh: 0.61em;  /* 눈 영역 높이 */
          --cx: 0.03em; /* 구멍 가로 중심 보정 (letter-spacing 때문에 생기는 쏠림 보정) */
          --cy: 0.05em;    /* 구멍 세로 중심 보정 */
          position: absolute;
          left: calc(50% + var(--cx));
          top: calc(50% + var(--cy));
          width: var(--ew);
          height: var(--eh);
          margin: calc(var(--eh) / -2) 0 0 calc(var(--ew) / -2);
          border-radius: 50%;
          overflow: hidden;
          pointer-events: none;
        }
 
        /* ── 눈꺼풀: 숫자와 같은 색이라 0과 자연스럽게 이어져요 ── */
        .nf-lid {
          position: absolute;
          left: -6%;
          width: 112%;
          height: 58%;
          background: #1f1f1d;
        }
        .nf-lid-top {
          top: 0;
          border-radius: 0 0 50% 50% / 0 0 22% 22%;
          transform: translateY(-86%); /* 평소엔 윗눈꺼풀이 살짝 내려와 있어요 */
          animation: nf-lid-top 5s ease-in-out infinite;
        }
        .nf-lid-bottom {
          bottom: 0;
          border-radius: 50% 50% 0 0 / 22% 22% 0 0;
          transform: translateY(104%);
          animation: nf-lid-bottom 5s ease-in-out infinite;
        }
        @keyframes nf-lid-top {
          0%, 88%, 100% { transform: translateY(-86%); }
          91%, 93% { transform: translateY(6%); }
        }
        @keyframes nf-lid-bottom {
          0%, 88%, 100% { transform: translateY(104%); }
          91%, 93% { transform: translateY(-6%); }
        }
 
        /* ── 눈동자 ── */
        .nf-pupil {
          --x: 0;
          --y: 0;
          --s: 0.1em; /* 눈동자 크기 */
          position: absolute;
          left: 50%;
          top: 50%;
          width: var(--s);
          height: var(--s);
          margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);
          transform: translate(calc(var(--x) * 0.03em), calc(var(--y) * 0.13em));
          transition: transform 120ms ease-out;
        }
        .nf-pupil[data-shape='eye'],
        .nf-pupil[data-shape='circle'] { border-radius: 9999px; }
        .nf-pupil[data-shape='square'] { border-radius: 0.015em; }
        .nf-pupil[data-shape='diamond'] {
          --s: 0.13em;
          clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
        }
        .nf-pupil[data-shape='star'] {
          --s: 0.14em;
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }
        .nf-pupil[data-shape='heart'] {
          --s: 0.14em;
          -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>") center / contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>") center / contain no-repeat;
        }
        .nf-pupil[data-shape='eye']::after {
          content: '';
          position: absolute;
          top: 18%;
          left: 22%;
          width: 28%;
          height: 28%;
          border-radius: 9999px;
          background: #fafaf6;
        }
        /* 마우스가 움직이기 전에는 두리번거림 */
        .nf-pupil[data-active='false'] {
          animation: nf-look 5s ease-in-out infinite;
        }
        @keyframes nf-look {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-0.03em, -0.12em); }
          45% { transform: translate(0.03em, 0.12em); }
          70% { transform: translate(0.03em, -0.06em); }
        }
        @media (prefers-reduced-motion: reduce) {
          .nf-pupil[data-active='false'] { animation: none; }
          .nf-pupil { transition: none; }
          .nf-lid-top, .nf-lid-bottom { animation: none; }
        }
      `}</style>
 
      {/* 상단 구분선 */}
      <div className="mx-6 border-b border-[#e4e4de] py-6 sm:mx-10" />
 
      <main className="flex flex-1 flex-col items-center px-6 pb-16 pt-7">
        {/* 상단 배지 */}
        <span className="rounded-full bg-[#dcea8c] px-3.5 py-1.5 text-[10px] font-semibold tracking-tight">
          ERROR 404 / NOT FOUND
        </span>
 
        {/* 404 */}
        <h1
          aria-label="404"
          className="mt-2 select-none font-[family-name:var(--font-geist-sans)] text-[clamp(9rem,30vw,20rem)] font-extrabold leading-[1] tracking-[-0.06em]"
  >
          <span aria-hidden="true">4</span>
          <span ref={zeroRef} aria-hidden="true" className="relative inline-block">
            0
            {/* 0 안에서 길을 찾는 눈: 눈동자 + 눈꺼풀 */}
            <span className="nf-eye" aria-hidden="true">
              <span
                ref={pupilRef}
                data-active="false"
                data-shape={PUPIL_SHAPE}
                style={{ backgroundColor: PUPIL_COLOR }}
                className="nf-pupil"
              />
              <span className="nf-lid nf-lid-top" />
              <span className="nf-lid nf-lid-bottom" />
            </span>
          </span>
          <span aria-hidden="true">4</span>
        </h1>
 
        {/* 안내 문구 */}
        <h2 className="mt-8 text-center text-2xl font-bold tracking-tight sm:text-[26px]">
          앗, 길을 조금 벗어났네요.
        </h2>
        <p className="mt-5 text-center text-[13px] leading-[1.6] text-[#5f5f5a]">
          찾으시는 페이지가 이동되었거나 더 이상 존재하지 않아요.
          <br />
          주소를 다시 확인하거나 홈에서 새로운 이야기를 만나보세요.
        </p>
 
        {/* 버튼 */}
        <div className="mt-8 flex items-center gap-2">
         <Link href="/" className={buttonVariants({ className: 'px-6 text-xs' })}>
            홈으로 돌아가기
         </Link>
          <Button variant="outline" className="px-6 text-xs" onClick={() => router.back()}>
            이전 페이지
          </Button>
        </div>
 
        {/* 고객센터 안내 */}
        <p className="mt-9 text-[11px] text-[#74746f]">
          문제가 계속된다면 고객센터로 문의해 주세요.
        </p>
      </main>
 
      {/* 하단 구분선 */}
      <div className="mx-6 border-t border-[#e4e4de] py-6 sm:mx-10" />
    </div>
  );
}