// 응답 스키마 타입 검증
import 'server-only';
import { z } from 'zod';
import { ApiError } from '@/lib/apiError';

const uploadAvatarSchema = z.object({
  userId: z.number(),
  avatarUrl: z.string(),
});

const deleteAvatarSchema = z.object({
  userId: z.number(),
  avatarUrl: z.null(),
});

export type UploadedAvatar = z.infer<typeof uploadAvatarSchema>;

export type DeletedAvatar = z.infer<typeof deleteAvatarSchema>;

export function parseUploadedAvatar(value: unknown): UploadedAvatar {
  const result = uploadAvatarSchema.safeParse(value);
  if (!result.success) {
    throw new ApiError(502, '아바타 업로드 응답 형식이 올바르지 않습니다.');
  }
  return result.data;
}

export function parseDeletedAvatar(value: unknown): DeletedAvatar {
  const result = deleteAvatarSchema.safeParse(value);
  if (!result.success) {
    throw new ApiError(502, '아바타 삭제 응답 형식이 올바르지 않습니다.');
  }
  return result.data;
}
