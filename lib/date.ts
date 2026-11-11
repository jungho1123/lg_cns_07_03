// 한국 시간, 24시간제로 YYYY-MM-DD HH:mm 형식을 표시한다.
// 목록, 상세, 댓글이 같은 형식을 쓰도록 한곳에 둔다.
// 서버가 UTC로 돌아도(Vercel) 한국 시간으로 보이게 timeZone을 고정하고,
// 서버마다 오전/AM 표기가 달라지지 않게 24시간제(h23)로 고정한다.
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')} ${value('hour')}:${value('minute')}`;
}
