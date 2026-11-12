import { ApiError, AuthExpiredError } from '@/lib/apiError';
import { getAvatarImage } from '@/service/avatarService';

export const runtime = 'nodejs';

const imageHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; sandbox",
};

type Context = {
  params: Promise<{ userId: string }>;
};

function parseUserId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) ? id : null;
}

function errorResponse(error: unknown): Response {
  const status =
    error instanceof AuthExpiredError
      ? 401
      : error instanceof ApiError
        ? error.status
        : 500;

  return new Response(null, {
    status,
    headers: imageHeaders,
  });
}

export async function GET(
  _request: Request,
  { params }: Context,
): Promise<Response> {
  try {
    const { userId } = await params;
    const id = parseUserId(userId);

    if (id === null) {
      return new Response(null, {
        status: 400,
        headers: imageHeaders,
      });
    }

    const image = await getAvatarImage(id);

    return new Response(image.body, {
      status: 200,
      headers: {
        ...imageHeaders,
        'Content-Type': image.contentType,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
