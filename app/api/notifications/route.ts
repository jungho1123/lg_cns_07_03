import { NextResponse } from 'next/server';
import { ApiError, AuthExpiredError, publicErrorMessage } from '@/lib/apiError';
import { isPostNotification } from '@/lib/notificationText';
import { getNotifications } from '@/service/spring/notificationService';

// 헤더의 알림 종이 주기적으로 부르는 조회 전용 API.
// 서버 액션은 한 번에 하나씩만 실행되어 글 등록 등을 늦출 수 있어서, 읽기는 route handler로 둔다.
// 브라우저는 Spring을 직접 부르지 않고 이 주소만 부른다 (토큰은 서버에서만 다룬다).
export async function GET() {
  try {
    const all = await getNotifications(50);
    // 우리 앱에서 열 수 있는 알림(게시글)만 내려 준다. 안 읽은 수도 이 목록 기준으로 센다.
    const items = all.filter(isPostNotification);
    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof AuthExpiredError) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json({ message: publicErrorMessage(error) }, { status });
  }
}
