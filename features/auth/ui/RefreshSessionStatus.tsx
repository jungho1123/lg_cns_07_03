import { Button } from '@/components/atoms/Button';

type RefreshSessionStatusProps = {
  message: string;
  onRetry: () => void;
};

export function RefreshSessionStatus({
  message,
  onRetry,
}: RefreshSessionStatusProps) {
  return (
    <div role="status">
      <p>{message || '로그인 상태를 갱신하고 있습니다…'}</p>
      {message && <Button onClick={onRetry}>다시 시도</Button>}
    </div>
  );
}
