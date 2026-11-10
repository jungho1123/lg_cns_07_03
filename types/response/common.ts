export type ApiResponse<T> =
  | { success: true; message: string; data: T; code?: string }
  | { success: false; message: string; code?: string };
