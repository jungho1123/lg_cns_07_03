"use client";

import { useActionState, useId, useState, type ReactNode } from "react";
import { changePasswordAction } from "@/actions/passwordActions";
import type { PasswordChangeState } from "@/types/response/passwordResponse";

const initialState: PasswordChangeState = { status: 'idle', message: '' };

function PasswordForm({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState(changePasswordAction, initialState);
  const id = useId();
  if (state.status === 'success') {
    return (
      <div className="w-full rounded-xl border border-green-200 bg-green-50 p-4">
        <p role="status" className="text-sm text-green-800">{state.message}</p>
        <button type="button" onClick={onClose} className="mt-3 cursor-pointer text-sm font-medium text-green-800 underline">닫기</button>
      </div>
    );
  }
  return (
    <form id="password-change-form" action={action} className="w-full rounded-xl border border-gray-200 bg-white p-4" aria-busy={pending}>
      <fieldset disabled={pending} className="m-0 min-w-0 space-y-4 border-0 p-0">
        <legend className="sr-only">비밀번호 변경</legend>
        {[
          { name: 'currentPassword', label: '현재 비밀번호', autoComplete: 'current-password' },
          { name: 'newPassword', label: '새 비밀번호', autoComplete: 'new-password' },
          { name: 'confirmPassword', label: '새 비밀번호 확인', autoComplete: 'new-password' },
        ].map(field => (
          <div key={field.name}>
            <label htmlFor={`${id}-${field.name}`} className="mb-1.5 block text-sm font-medium text-gray-700">{field.label}</label>
            <input id={`${id}-${field.name}`} name={field.name} type="password" autoComplete={field.autoComplete} required aria-describedby={state.message ? `${id}-message` : undefined} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-blue-600 disabled:bg-gray-50" />
          </div>
        ))}
        <div className="flex gap-2">
          <button type="submit" className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-wait disabled:opacity-50">{pending ? '변경 중...' : '변경하기'}</button>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-wait">취소</button>
        </div>
      </fieldset>
      {state.message && <p id={`${id}-message`} role="alert" className="mt-3 text-sm text-red-700">{state.message}</p>}
    </form>
  );
}

export default function PasswordEditButton({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,384px)] xl:gap-8">
      <div className="min-w-0">
        {children}
        <button type="button" onClick={() => setOpen(true)} aria-expanded={open} className="mt-5 cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">비밀번호 수정</button>
      </div>
      {open && <PasswordForm onClose={() => setOpen(false)} />}
    </div>
  );
}