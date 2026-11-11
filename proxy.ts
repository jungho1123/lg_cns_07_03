import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';
import { getAuthCookieSettings } from '@/lib/auth/settings';

export async function proxy(request: NextRequest) {
  // 보호 경로 설정에 로그인 페이지가 포함되어도 리다이렉트가 반복되지 않게 한다.
  if (request.nextUrl.pathname === '/login') return NextResponse.next();

  const { secret, secureCookie } = getAuthCookieSettings();
  // 쿠키의 세션만 검사하고 액세스 토큰 갱신은 기존 인증 흐름에 맡긴다.
  const token = await getToken({
    req: { headers: { cookie: request.headers.get('cookie') ?? '' } },
    secret,
    secureCookie,
  });

  if (
    !token ||
    token.authError ||
    !token.accessToken ||
    !token.refreshToken ||
    token.accessExpiresAt === undefined ||
    !token.profile ||
    !token.sessionExpiresAt ||
    Date.now() >= token.sessionExpiresAt
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // 로그인 필수 경로만 추가한다. 빈 배열이면 인증 프록시를 적용하지 않는다.
  // Next.js가 정적으로 분석하므로 경로는 이 파일에 직접 작성한다.
  matcher: [
    '/posts/:path*', // 게시글 전체
    // '/posts/new', // 게시글 작성
    // '/posts/:postId/edit', // 게시글 수정
  ],
};
