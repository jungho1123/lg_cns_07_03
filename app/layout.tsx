import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { HideOnPaths } from "@/components/layout/HideOnPaths";
import MainLayout from "@/components/templates/MainLayout";
import "./globals.css";

// 헤더/푸터를 보이지 않을 경로 (로그인 화면 등)
const BARE_PATHS = ["/login", "/signup"];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LG CNS",
  description: "LG CNS Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      // lang = "en"  영어 글씨체
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <MainLayout
            barePaths={BARE_PATHS}
          >
            {children}
          </MainLayout>
        </Suspense>
      </body>
    </html>
  );
}