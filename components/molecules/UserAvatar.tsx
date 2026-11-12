"use client";

import type { ComponentProps } from "react";
import ProfileAvatar from "@/components/atoms/ProfileAvatar";
import { useAvatar } from "@/components/providers/AvatarProvider";

type Props = Omit<ComponentProps<typeof ProfileAvatar>, "src"> & {
  userId: string | number;
};

export default function UserAvatar({ userId, ...props }: Props) {
  const { getAvatarSrc } = useAvatar();
  return <ProfileAvatar {...props} src={getAvatarSrc(userId)} />;
}
