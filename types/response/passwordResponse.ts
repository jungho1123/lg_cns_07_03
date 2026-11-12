export type PasswordChangeInput = {
  currentPassword: string;
  newPassword: string;
};

export type PasswordChangeState = {
  status: 'idle' | 'error' | 'success';
  message: string;
};
