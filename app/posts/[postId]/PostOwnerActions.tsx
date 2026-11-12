import Link from 'next/link';
import PostDeleteButton from './PostDeleteButton';

type Props = {
  postId: string;
};

export default function PostOwnerActions({ postId }: Props) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Link
        href={`/posts/${encodeURIComponent(postId)}/edit`}
        className="rounded-full px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      >
        수정
      </Link>

      <PostDeleteButton postId={postId} />
    </div>
  );
}