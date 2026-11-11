import { connection } from "next/server";
import { auth } from "@/auth";
import MainLayoutClient from "./MainLayoutClient";

interface MainLayoutProps {
  children: React.ReactNode;
  barePaths: string[];
}

export default async function MainLayout({
  children,
  barePaths,
}: MainLayoutProps) {

  // 요청이 들어올 때까지 기다림
  await connection();

  // 요청 시점에 로그인 정보 가져오기
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <MainLayoutClient
      user={user}
      barePaths={barePaths}
    >
      {children}
    </MainLayoutClient>
  );
}
