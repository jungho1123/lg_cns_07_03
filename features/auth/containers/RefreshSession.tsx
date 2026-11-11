'use client';

import { RefreshSessionStatus } from '@/features/auth/ui/RefreshSessionStatus';
import { useRefreshSession } from '@/hooks/useRefreshSession';

export function RefreshSession() {
  const { message } = useRefreshSession();

  return (
    <RefreshSessionStatus
      message={message}
      onRetry={() => window.location.reload()}
    />
  );
}
