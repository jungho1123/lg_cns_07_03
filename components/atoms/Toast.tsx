// 화면 아래쪽에 잠깐 떴다 사라지는 알림(토스트).
// 클릭을 가로채지 않고(pointer-events-none), 헤더/사이드바(z-50)보다 위에 보이도록 z-[60]을 쓴다.
// 알림 칸(role=status)은 항상 존재해야 스크린리더가 내용 변화를 읽어 준다. message가 비면 아무것도 그리지 않는다.
export function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
    >
      {message && (
        <p className="animate-in fade-in slide-in-from-bottom-2 rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white shadow-lg duration-200">
          {message}
        </p>
      )}
    </div>
  );
}
