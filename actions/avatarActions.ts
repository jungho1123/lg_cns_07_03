//파일 입력 검사, 서비스 호출, 화면에 전달할 결과 구성
// - FormData의 file이 실제 파일인지 검사
// - 백엔드 기준으로 정한 파일 형식·최대 크기 검사
// - uploadMyAvatar(file) 호출
// - 예외를 사용자에게 보여줄 결과로 변환
// - 성공 시 변경된 아바타 정보와 이미지 갱신용 version 반환

'use server';

import { AuthExpiredError, publicErrorMessage } from '@/lib/apiError';
import { uploadAvatar, deleteAvatar } from '@/service/avatarService';
export type AvatarActionResult =
  | {
      ok: true;
      avatar: {
        userId: number;
        avatarUrl: string | null;
      };
      version: number;
    }
  | {
      ok: false;
      message: string;
    };

function failure(error: unknown): AvatarActionResult {
  return {
    ok: false,
    message:
      error instanceof AuthExpiredError
        ? error.message
        : publicErrorMessage(error),
  };
}

export async function uploadAvatarAction(
  formData: FormData,
): Promise<AvatarActionResult> {
  if (!(formData instanceof FormData)) {
    return {
      ok: false,
      message: '잘못된 요청입니다.',
    };
  }
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return {
      ok: false,
      message: '업로드할 이미지 파일을 선택해 주세요.',
    };
  }
  try {
    const avatar = await uploadAvatar(file);
    return {
      ok: true,
      avatar,
      version: Date.now(),
    };
  } catch (error) {
    return failure(error);
  }
}

export async function deleteAvatarAction(): Promise<AvatarActionResult> {
  try {
    const avatar = await deleteAvatar();
    return {
      ok: true,
      avatar,
      version: Date.now(),
    };
  } catch (error) {
    return failure(error);
  }
}
