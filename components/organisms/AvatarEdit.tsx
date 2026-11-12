"use client";

import { useActionState, useId, useState } from "react";
import { Plus } from "lucide-react";
import { deleteAvatarAction, uploadAvatarAction } from "@/actions/avatarActions";
import UserAvatar from "@/components/molecules/UserAvatar";
import { useAvatar } from "@/components/providers/AvatarProvider";

type Props = { userId: string; name: string };

type AvatarEditState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialState: AvatarEditState = { status: "idle", message: "" };

export default function AvatarEdit({ userId, name }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const { getAvatarSrc, updateAvatar } = useAvatar();

  async function editAvatar(
    _previous: AvatarEditState,
    formData: FormData,
  ): Promise<AvatarEditState> {
    const deleting = formData.get("intent") === "delete";

    try {
      const result = deleting
        ? await deleteAvatarAction()
        : await uploadAvatarAction(formData);

      if (!result.ok) {
        return { status: "error", message: result.message };
      }

      updateAvatar({ ...result.avatar, version: result.version });
      return {
        status: "success",
        message: deleting ? "기본 프로필 이미지로 변경했습니다." : "프로필 사진을 변경했습니다.",
      };
    } catch {
      return {
        status: "error",
        message: "프로필 사진을 변경하지 못했습니다. 파일 크기와 네트워크 연결을 확인한 뒤 다시 시도해 주세요.",
      };
    }
  }

  const [state, action, pending] = useActionState(editAvatar, initialState);

  return (
    <div className="min-w-0 space-y-4">
      <div className="relative w-fit">
        <UserAvatar userId={userId} name={name} className="size-36 text-5xl sm:size-40" sizes="160px" />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          disabled={pending}
          aria-label="프로필 사진 수정"
          aria-expanded={open}
          aria-controls={`${id}-form`}
          className="absolute right-0 bottom-0 flex size-11 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-gray-950 text-white shadow-sm transition-colors hover:bg-gray-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-50"
        >
          <Plus aria-hidden="true" size={24} strokeWidth={3} />
        </button>
      </div>
      {open && (
        <form id={`${id}-form`} action={action} aria-busy={pending} className="rounded-xl border border-gray-200 bg-white p-4">
          <fieldset disabled={pending} className="m-0 min-w-0 space-y-3 border-0 p-0">
            <legend className="sr-only">프로필 사진 수정</legend>
            <label htmlFor={`${id}-file`} className="block text-sm font-medium text-gray-700">새 프로필 사진</label>
            <input
              id={`${id}-file`}
              type="file"
              name="file"
              accept="image/*"
              required
              aria-describedby={state.message ? `${id}-message` : undefined}
              className="block w-full min-w-0 text-sm text-gray-600 file:mr-2 file:cursor-pointer file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:text-gray-700"
            />
            <button type="submit" name="intent" value="upload" className="w-full cursor-pointer rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-wait disabled:opacity-50">
              {pending ? "처리 중..." : "사진 변경"}
            </button>
            <button type="submit" name="intent" value="delete" formNoValidate disabled={getAvatarSrc(userId) === null} className="w-full cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
              기본 이미지로 변경
            </button>
          </fieldset>
        </form>
      )}
      {state.message && (
        <p id={`${id}-message`} role={state.status === "error" ? "alert" : "status"} className={`text-sm ${state.status === "error" ? "text-red-700" : "text-green-800"}`}>
          {state.message}
        </p>
      )}
    </div>
  );
}
