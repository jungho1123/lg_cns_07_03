import type { DefaultSession } from 'next-auth';
import type { AuthUser } from '@/types/response/authResponse';
import type {
  AuthFailure,
  SpringJwtState,
  SpringTokenState,
} from '@/lib/auth/token';

declare module 'next-auth' {
  interface User {
    spring?: SpringTokenState;
    authSessionExpiresAt?: number;
  }
  interface Session {
    authError?: AuthFailure;
    user: DefaultSession['user'] & {
      id: string;
      profile?: AuthUser;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: SpringJwtState['accessToken'];
    refreshToken?: SpringJwtState['refreshToken'];
    accessExpiresAt?: SpringJwtState['accessExpiresAt'];
    profile?: SpringJwtState['profile'];
    sessionExpiresAt?: SpringJwtState['sessionExpiresAt'];
    authError?: SpringJwtState['authError'];
  }
}
