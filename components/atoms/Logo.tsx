import Link from "next/link";

interface LogoProps {
  onClick?: () => void;
}

// AM Inspire Camp 7기 03조 로고
export default function Logo({ onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="AM Inspire Camp 7기 03조 홈으로"
      className="flex items-center gap-1.5 min-[1024px]:gap-2"
    >
      {/* 심볼: 7시 3분 시계 (7기 03조) */}
      <svg
        viewBox="0 0 28 28"
        aria-hidden="true"
        className="h-7 w-7 min-[1024px]:h-8 min-[1024px]:w-8 shrink-0"
      >
        <rect width="28" height="28" rx="7" fill="#111827" />

        {/* 시계 테두리 */}
        <circle cx="14" cy="14" r="10" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />

        {/* 12·3·6·9시 눈금 */}
        <g stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round">
          <line x1="14" y1="5.8" x2="14" y2="7.2" />
          <line x1="22.2" y1="14" x2="20.8" y2="14" />
          <line x1="14" y1="22.2" x2="14" y2="20.8" />
          <line x1="5.8" y1="14" x2="7.2" y2="14" />
        </g>

        {/* 시침: 7시 (3분만큼 살짝 지남) */}
        <line x1="14" y1="14" x2="10.87" y2="19.12" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />

        {/* 분침: 3분 */}
        <line x1="14" y1="14" x2="16.78" y2="5.44" stroke="#6366F1" strokeWidth="1.6" strokeLinecap="round" />

        {/* 중심점 */}
        <circle cx="14" cy="14" r="1.4" fill="#6366F1" />
      </svg>

      {/* 글자 */}
      <span className="whitespace-nowrap text-[13px] min-[1024px]:text-[16px] font-extrabold tracking-tight text-gray-900">
        07:03 AM
      </span>
    </Link>
  );
}