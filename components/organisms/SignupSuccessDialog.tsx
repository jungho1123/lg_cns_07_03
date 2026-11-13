'use client';

import { AlertDialog } from '@base-ui/react/alert-dialog';
import { Button } from '@/components/ui/button';

type SignupSuccessDialogProps = {
  open: boolean;
  onConfirm: () => void;
};

export function SignupSuccessDialog({
  open,
  onConfirm,
}: SignupSuccessDialogProps) {
  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onConfirm();
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-[60] bg-black/50" />
        <AlertDialog.Popup className="fixed top-1/2 left-1/2 z-[70] w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-6 text-foreground shadow-lg outline-none">
          <AlertDialog.Title className="text-lg font-semibold">
            회원가입이 완료되었습니다.
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
            로그인 후 이용해 주세요.
          </AlertDialog.Description>
          <AlertDialog.Close
            render={<Button type="button" className="mt-6 w-full" />}
          >
            홈으로 이동
          </AlertDialog.Close>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
