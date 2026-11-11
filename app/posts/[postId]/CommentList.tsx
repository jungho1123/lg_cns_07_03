import type { CommentItem } from "@/types/response/commentResponse";

// 임시 데이터. 공통 호출(springFetch)이 올라오면 commentService의 getComments(postId)로 바꾼다.
function getMockComments(postId: number): CommentItem[] {
  return [
    { id: 1, postId, content: "좋은 글이네요!", author: { id: 1, name: "김유빈", avatarUrl: null }, createdAt: "2026-11-10T09:30:00Z" },
    { id: 2, postId, content: "저도 같은 생각입니다.\n줄바꿈도 보이는지 확인", author: { id: 2, name: "정민철", avatarUrl: null }, createdAt: "2026-11-10T10:05:00Z" },
    { id: 3, postId, content: "<script>alert(1)</script> 는 글자로만 보여야 함", author: { id: 3, name: "박세진", avatarUrl: null }, createdAt: "2026-11-10T11:20:00Z" },
  ];
}

// 서버가 UTC로 돌아도(Vercel) 한국 시간으로 보이게 timeZone을 고정
function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "short",
    timeStyle: "short",
  });
}

type CommentListProps = {
  postId: number;
};

export default function CommentList({ postId }: CommentListProps) {
  const comments = getMockComments(postId);

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
