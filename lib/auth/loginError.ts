import { CredentialsSignin } from 'next-auth';
export class LoginRejected extends CredentialsSignin {
  code = 'login_rejected';
  constructor(public readonly publicMessage: string) {
    super('Login rejected');
  }
}
