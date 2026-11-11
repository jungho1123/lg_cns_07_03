import type { Metadata } from 'next';
import { FeatureSection } from './_home/FeatureSection';
import { HeroSection } from './_home/HeroSection';

// layout.tsx를 수정하지 않고 이 페이지의 탭 제목과 설명만 지정한다.
export const metadata: Metadata = {
  title: '팀 프로젝트 게시판',
  description: '글을 쓰고, 댓글로 이야기하고, 좋아요와 알림으로 소통하는 게시판',
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-black">
      <HeroSection />
      <FeatureSection />
    </main>
  );
}
