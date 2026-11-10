import 'server-only';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { publicErrorMessage } from '@/lib/apiError';
import { LoginRejected } from '@/lib/auth/loginError';
import {
  getAuthCookieSettings,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/auth/settings';
import { refreshJwt, toTokenState } from '@/lib/auth/token';
import { validateLogin } from '@/lib/auth/validation';
import { login, refresh } from '@/service/spring/authService';

const cookieSettings = getAuthCookieSettings();

export const authOptions = {
  secret: cookieSettings.secret,
  useSecureCookies: cookieSettings.secureCookie,
  session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE_SECONDS },
  pages: { signIn: '/login' },
  debug: false,
  providers: [
    Credentials({
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = validateLogin({
          email: credentials.email,
          password: credentials.password,
        });
        if (!parsed.ok) throw new LoginRejected(parsed.message);
        try {
          const issuedAt = Date.now();
          const data = await login(parsed.value);
          return {
            id: String(data.userId),
            name: data.name,
            email: data.email,
            image: data.avatarUrl,
            spring: toTokenState(data, issuedAt),
            authSessionExpiresAt: issuedAt + SESSION_MAX_AGE_SECONDS * 1000,
          };
        } catch (error) {
          throw new LoginRejected(publicErrorMessage(error));
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          sub: user.id,
          ...user.spring,
          sessionExpiresAt: user.authSessionExpiresAt,
        };
      }
      // update()로 브라우저가 보낸 session 값은 채택하지 않는다.
      // 갱신은 검증된 기존 JWT와 Spring 응답만 사용한다.
      const state = await refreshJwt(token, {
        refreshTokens: refresh,
        now: Date.now,
      });
      return { sub: token.sub, ...state };
    },
    async session({ session, token }) {
      const profile = token.authError ? undefined : token.profile;
      return {
        expires: session.expires,
        authError: token.authError,
        user: profile
          ? {
              id: String(profile.userId),
              name: profile.name,
              email: profile.email,
              image: profile.avatarUrl,
              profile,
            }
          : { id: '' },
      };
    },
  },
} satisfies NextAuthConfig;
