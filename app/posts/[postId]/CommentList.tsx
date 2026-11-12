import { AuthExpiredError, AuthRefreshRequiredError, publicErrorMessage } from "@/lib/apiError";
import { requireCurrentUser } from "@/lib/currentUser";
import { formatDateTime } from "@/lib/date";
import { getComments } from "@/service/spring/commentService";
import type { CommentItem } from "@/types/response/commentResponse";
import CommentDeleteButton from "./CommentDeleteButton";
import CommentForm from "./CommentForm";
import CommentLikeButton from "./CommentLikeButton";
import CommentMentionButton from "./CommentMentionButton";

// 본문의 @이름을 굵게 칠한다. 이메일(a@b.com)은 @ 앞이 공백이 아니라서 칠하지 않는다.
// 글자를 그대로 넣으므로(dangerouslySetInnerHTML 안 씀) 스크립트를 넣어도 글자로만 보인다.
function withMentions(content: string) {
  return content.split(/((?<=^|\s)@[^\s@]+)/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-semibold text-blue-600">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

type CommentListProps = {
  postId: number;
};

export default async function CommentList({ postId }: CommentListProps) {
  let comments: CommentItem[] = [];
  let myUserId: number | null = null;
  let errorMessage: string | null = null;
  try {
    comments = await getComments(postId);
    myUserId = (await requireCurrentUser()).userId;
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
        <ul className="mt-4 space-y-3">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              {/* 글 작성자와 같은 이니셜 원형 (작게) */}
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800"
              >
                {comment.author.name.trim().slice(0, 1) || "?"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{comment.author.name}</span>
                  <time dateTime={comment.createdAt} className="text-gray-500">
                    {formatDateTime(comment.createdAt)}
                  </time>
                  {comment.author.id === myUserId ? (
                    <CommentDeleteButton postId={postId} commentId={comment.id} />
                  ) : (
                    <CommentMentionButton name={comment.author.name} />
                  )}
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words">{withMentions(comment.content)}</p>
                <div className="mt-1">
                  <CommentLikeButton
                    postId={postId}
                    commentId={comment.id}
                    likeCount={comment.likeCount}
                    likedByMe={comment.likedByMe}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 목록 조회가 로그인한 사람만 되므로, 여기까지 왔으면 로그인 상태다 */}
      <CommentForm postId={postId} />
    </section>
  );
}
