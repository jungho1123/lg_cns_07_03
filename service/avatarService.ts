//업로드·삭제 API 요청
import 'server-only';
import { matchApiUrl } from '@/config/apiuri';
import { authenticatedRequest } from '@/lib/auth/authenticatedRequest';
import { readApiData } from '@/lib/fetchClients';
import {
  parseUploadedAvatar,
  parseDeletedAvatar,
  type UploadedAvatar,
  type DeletedAvatar,
} from '@/service/spring/contracts/avatarContract';
import {
  parseAvatarImageResponse,
  type AvatarImage,
} from '@/service/spring/contracts/avatarImageContract';

//server action or route handler에서 호출하는 함수
export async function uploadAvatar(file: File): Promise<UploadedAvatar> {
  const body = new FormData();
  body.set('file', file);
  const response = await authenticatedRequest(matchApiUrl.user.avatar.me, {
    method: 'POST',
    body,
  });
  return readApiData(response, parseUploadedAvatar);
}

export async function deleteAvatar(): Promise<DeletedAvatar> {
  const response = await authenticatedRequest(matchApiUrl.user.avatar.me, {
    method: 'DELETE',
  });
  return readApiData(response, parseDeletedAvatar);
}
export async function getAvatarImage(userId: number): Promise<AvatarImage> {
  const response = await authenticatedRequest(
    matchApiUrl.user.avatar.detail(userId),
    {
      method: 'GET',
      headers: {
        Accept: 'image/*',
      },
    },
  );
  return parseAvatarImageResponse(response);
}

// 1. 전송할 본문을 만든다.
// 2. 정해진 API를 호출한다.
// 3. 응답을 검증해서 반환한다.
