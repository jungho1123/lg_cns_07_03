import { AuthExpiredError, AuthRefreshRequiredError, publicErrorMessage } from "@/lib/apiError";
import { getComments } from "@/service/spring/commentService";
import type { CommentItem } from "@/types/response/commentResponse";

// 서버가 UTC로 돌아도(Vercel) 한국 시간으로 보이게 timeZone을 고정
function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "short",
    timeStyle: "short",
    hourCycle: "h23", // 서버마다 오전/AM 표기가 달라 24시간제로 고정
  });
}

type CommentListProps = {
  postId: number;
};

export default async function CommentList({ postId }: CommentListProps) {
  let comments: CommentItem[] = [];
  let errorMessage: string | null = null;
  try {
    comments = await getComments(postId);
  } catch (error) {
    const needLogin = error instanceof AuthExpiredError || error instanceof AuthRefreshRequiredError;
    errorMessage = needLogin ? "로그인 후 댓글을 볼 수 있습니다." : publicErrorMessage(error);
  }

  if (errorMessage) {
    return (
      <section className="mt-8 border-t pt-6">
        <h2 className="text-lg font-semibold">댓글</h2>
        <p role="status" className="mt-4 text-sm text-gray-500">{errorMessage}</p>
      </section>
    );
  }

  return (
    <section className="mt-8 border-t pt-6">
      <h2 className="text-lg font-semibold">댓글 {comments.length}개</h2>

      {comments.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">첫 댓글을 남겨 보세요.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {comments.map((comment) => (
            <li key={comment.id}>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{comment.author.name}</span>
                <time dateTime={comment.createdAt} className="text-gray-500">
                  {formatDate(comment.createdAt)}
                </time>
              </div>
              <p className="mt-1 whitespace-pre-wrap break-words">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
