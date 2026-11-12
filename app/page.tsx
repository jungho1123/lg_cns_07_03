import type { Metadata } from 'next';
import { HeroSection } from './_home/HeroSection';

// layout.tsx를 수정하지 않고 이 페이지의 탭 제목과 설명만 지정한다.
export const metadata: Metadata = {
  title: '팀 프로젝트 게시판',
  description: '글을 쓰고, 댓글로 이야기하고, 좋아요와 알림으로 소통하는 게시판',
};

// 한 화면에서 SNS처럼 보이도록 첫 화면(HeroSection) 하나로 구성한다.
// (공통 레이아웃이 이미 <main>을 감싸고 있어서 여기서는 main을 다시 쓰지 않는다)
export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />
    </div>
  );
}
