import { z } from 'zod';
import { signupSchema } from '@/lib/auth/validation';

export type Role =
  | 'STUDENT'
  | 'MENTOR'
  | 'INSTRUCTOR'
  | 'OPERATOR'
  | 'PROJECT_MANAGER'
  | 'PROJECT_LEADER'
  | 'PLANNER'
  | 'DESIGNER'
  | 'DEVELOPER';
export type PlatformRole = 'USER' | 'COMPANY_ADMIN' | 'PLATFORM_ADMIN';
export type PresenceStatus = 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE';
export type AccountStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED';

export interface AuthUser {
  userId: number;
  email: string;
  name: string;
  role: Role;
  platformRole: PlatformRole;
  avatarUrl: string | null;
  presenceStatus: PresenceStatus;
  statusMessage: string | null;
  accountStatus: AccountStatus;
  companyId: number | null;
}

export interface AuthData extends AuthUser {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}
export interface LoginInput {
  email: string;
  password: string;
}

// export interface SignupInput {
//   email: string;
//   name: string;
//   password: string;
//   role: Role;
// }

export type SignupInput = z.infer<typeof signupSchema>;
