'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent } from 'react';

type Slide = {
  key: string;
  title: string; // 점 버튼의 이름과 이미지 설명(alt)으로 쓴다
  description?: string;
  gradient?: string;
  href?: string | null;
  image?: string; // 이미지 배너일 때 public 아래 주소 (예: /ads/a.jpg)
};

// public/ads에 이미지가 하나도 없을 때 보여 주는 기본 서비스 안내 배너
const DEFAULT_SLIDES: Slide[] = [
  {
    key: 'default-notification',
    title: '좋아요와 알림',
    description: '내 글에 달린 좋아요와 댓글을 알림 종에서 확인해 보세요.',
    gradient: 'from-blue-600 to-indigo-500',
    href: null,
  },
  {
    key: 'default-mine',
    title: '내가 쓴 글 모아보기',
    description: '지금까지 쓴 글을 한눈에 모아 볼 수 있어요.',
    gradient: 'from-emerald-600 to-teal-500',
    href: '/posts?view=mine',
  },
  {
    key: 'default-mypage',
    title: '마이페이지',
    description: '프로필과 비밀번호를 관리해 보세요.',
    gradient: 'from-violet-600 to-fuchsia-500',
    href: '/mypage',
  },
];

const INTERVAL = 5000; // 자동으로 넘어가는 간격 (5초)
const SWIPE_DISTANCE = 40; // 이만큼 이상 밀어야 넘어간 것으로 본다 (px)
const SLIDE_SIZE = 'h-32 sm:h-36 xl:h-80'; // 기본 안내 배너의 높이: 작은 화면은 얇게, 큰 화면(오른쪽 열)은 정사각형에 가깝게
// 이미지 배너가 큰 화면(xl, 오른쪽 열) 아래에서 가로로 꽉 찰 때 차지하는 높이의 최대치 (px).
// 이미지 비율은 그대로라서, 높이를 이만큼으로 제한하면 너비도 따라 줄고 가운데에 놓인다. 더 작게/크게 하려면 이 숫자를 바꾼다.
const MAX_HEIGHT_BELOW_XL = 300;

// 움직임을 줄이도록 설정한 사용자인지 (운영체제의 "동작 줄이기" 설정)
function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
const getReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 글 목록 옆(큰 화면) 또는 글 작성창 위(작은 화면)에 보이는 슬라이드 배너.
// images(public/ads의 이미지)가 있으면 그 이미지들을, 없으면 기본 안내 배너를 보여 준다.
// 5초마다 옆으로 넘어가고, 화살표/점/스와이프로 직접 넘길 수 있다. 마우스를 올리거나 포커스가 있으면 멈춘다.
export default function PostsBanner({ images = [] }: { images?: string[] }) {
  const slides: Slide[] =
    images.length > 0
      ? images.map((src, position) => ({ key: src, title: `배너 ${position + 1}`, image: src }))
      : DEFAULT_SLIDES;

  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  // 이미지 배너의 가로/세로 비율. 첫 번째 이미지에서 읽어 오고, 읽기 전에는 2:1로 둔다.
  // 모든 화면에서 칸의 높이가 이 비율을 따라가므로 이미지가 잘리지 않는다. (다른 비율의 이미지는 이 비율에 맞춰 잘린다)
  const [ratio, setRatio] = useState(2);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const paused = hovering || userPaused || reducedMotion;
  const count = slides.length;
  const imageMode = images.length > 0;
  const current = Math.min(index, count - 1); // 이미지 수가 줄어도 없는 배너를 가리키지 않게 한다

  // 다음 배너로 자동 전환. 직접 넘기면 index가 바뀌어 타이머가 다시 시작된다. (배너가 하나면 넘길 필요 없다)
  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setTimeout(() => setIndex((value) => (value + 1) % count), INTERVAL);
    return () => clearTimeout(timer);
  }, [index, paused, count]);

  // 양옆 화살표와 스와이프가 같이 쓴다. 끝에서 더 넘기면 반대쪽 끝으로 돌아간다.
  function move(step: 1 | -1) {
    setIndex((value) => (value + step + count) % count);
  }

  // 스와이프: 누른 위치와 뗀 위치의 차이로 방향을 정한다. 밀었다면 링크가 눌리지 않게 막는다.
  const startX = useRef<number | null>(null);
  const swiped = useRef(false);
  function onPointerDown(event: PointerEvent) {
    startX.current = event.clientX;
    swiped.current = false;
  }
  function onPointerUp(event: PointerEvent) {
    if (startX.current === null) return;
    const distance = event.clientX - startX.current;
    startX.current = null;
    if (Math.abs(distance) < SWIPE_DISTANCE || count <= 1) return;
    swiped.current = true;
    move(distance < 0 ? 1 : -1);
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="서비스 안내"
      // 이미지 배너: xl 미만에서는 높이가 MAX_HEIGHT_BELOW_XL을 넘지 않게 최대 너비를 (높이 × 비율)로 제한하고 가운데에 둔다
      className={`relative mx-auto w-full overflow-hidden rounded-3xl bg-gray-100 text-white shadow-[0_1px_3px_rgb(0_0_0_/_0.1)] ${
        imageMode ? 'max-w-[var(--banner-max-width)] xl:max-w-none' : ''
      }`}
      style={imageMode ? ({ '--banner-max-width': `${MAX_HEIGHT_BELOW_XL * ratio}px` } as CSSProperties) : undefined}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <div
        className="flex touch-pan-y transition-transform duration-500 ease-in-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {slides.map((slide, position) => {
          const active = position === current;
          let body;
          if (slide.image) {
            // 이미지 배너: 너비는 화면에 맞추고 높이는 이미지 비율을 따른다. 글자는 이미지 안에 넣어서 만든다.
            // 첫 번째 이미지가 로드되면 그 비율을 읽어 온다 (이미 로드된 뒤에 연결되는 경우를 위해 ref에서도 확인한다)
            const readRatio = (img: HTMLImageElement | null) => {
              if (position === 0 && img && img.naturalWidth > 0 && img.naturalHeight > 0) {
                const next = img.naturalWidth / img.naturalHeight;
                setRatio((previous) => (previous === next ? previous : next)); // 같으면 다시 그리지 않는다
              }
            };
            body = (
              <div className="relative w-full" style={{ aspectRatio: ratio }}>
                <Image
                  ref={(img) => {
                    if (img?.complete) readRatio(img);
                  }}
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="(min-width: 1280px) 320px, 100vw"
                  className="object-cover"
                  priority={position === 0}
                  loading="eager"
                  draggable={false}
                  onLoad={(event) => readRatio(event.currentTarget)}
                />
              </div>
            );
          } else {
            const content = (
              <>
                <strong className="text-lg font-bold leading-tight xl:text-xl">{slide.title}</strong>
                <span className="text-sm leading-snug text-white/90">{slide.description}</span>
                {slide.href && <span className="mt-1 text-xs font-semibold text-white/90">바로가기 →</span>}
              </>
            );
            const className = `flex ${SLIDE_SIZE} w-full flex-col justify-center gap-1 bg-gradient-to-br px-6 pb-8 xl:gap-2 xl:px-7 ${slide.gradient}`;
            body = slide.href ? (
              <Link
                href={slide.href}
                className={`${className} no-underline outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white`}
                onClick={(event) => {
                  if (swiped.current) event.preventDefault(); // 밀어서 넘긴 경우에는 이동하지 않는다
                }}
                draggable={false}
              >
                {content}
              </Link>
            ) : (
              <div className={className}>{content}</div>
            );
          }
          return (
            <div
              key={slide.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${position + 1} / ${count}`}
              aria-hidden={!active}
              // 안 보이는 배너의 링크는 Tab으로 선택되지 않게 한다
              inert={!active}
              className="w-full shrink-0"
            >
              {body}
            </div>
          );
        })}
      </div>

      {/* 이미지 위에서도 점과 버튼이 보이도록 아래쪽을 살짝 어둡게 한다 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent" />

      {/* 양옆 화살표: 눌러서 이전/다음 배너로 넘긴다 (배너가 하나뿐이면 필요 없어서 그리지 않는다) */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="이전 배너"
            className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-lg leading-none text-white hover:bg-black/40 focus-visible:outline-2 focus-visible:outline-white"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="다음 배너"
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-lg leading-none text-white hover:bg-black/40 focus-visible:outline-2 focus-visible:outline-white"
          >
            <span aria-hidden="true">›</span>
          </button>
        </>
      )}

      {/* 아래쪽: 점(이동)과 일시정지/재생 */}
      {count > 1 && (
        <div className="absolute inset-x-0 bottom-1 flex items-center justify-between px-3">
          <div className="flex items-center">
            {slides.map((slide, position) => (
              <button
                key={slide.key}
                type="button"
                onClick={() => setIndex(position)}
                aria-label={`${position + 1}번 배너 보기: ${slide.title}`}
                aria-current={position === current}
                className="group p-2"
              >
                <span
                  className={`block h-2 rounded-full bg-white transition-all ${
                    position === current ? 'w-5 opacity-100' : 'w-2 opacity-50 group-hover:opacity-80'
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setUserPaused((value) => !value)}
            aria-label={userPaused ? '배너 자동 전환 재생' : '배너 자동 전환 일시정지'}
            className="rounded-full px-2 py-1 text-xs font-semibold text-white/90 hover:bg-white/20"
          >
            <span aria-hidden="true">{userPaused ? '▶ 재생' : '❚❚ 정지'}</span>
          </button>
        </div>
      )}
    </section>
  );
}
