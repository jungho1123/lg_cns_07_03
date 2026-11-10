export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class AuthExpiredError extends Error {
  constructor() {
    super('로그인이 만료되었습니다. 다시 로그인해 주세요.');
    this.name = 'AuthExpiredError';
  }
}

export function publicErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400 || error.status === 401) return error.message;
    if (error.status === 503 || error.status === 504) {
      return '서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.';
    }
  }
  return '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
}

export class AuthRefreshRequiredError extends Error {
  constructor() {
    super('인증 토큰 갱신이 필요합니다.');
    this.name = 'AuthRefreshRequiredError';
  }
}
