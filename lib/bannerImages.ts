import 'server-only';
import { readdirSync } from 'node:fs';
import path from 'node:path';

// public/ads 폴더의 이미지 파일을 읽어서 배너에 쓸 주소 목록을 돌려준다.
// - 파일 이름순(숫자는 1, 2, 10 순서)으로 정렬한다.
// - 폴더가 없거나 이미지가 없으면 빈 목록을 돌려주고, 이때 배너는 기본 안내 배너를 보여 준다.
// 동기 파일 읽기는 빌드할 때 미리 실행되어 결과가 정적 화면에 들어간다. 배포한 뒤에 파일을 넣어도 반영되지 않으니,
// 이미지를 바꾸면 커밋하고 다시 배포해야 한다. (개발 중에는 새로고침하면 바로 보인다)
const ADS_DIR = path.join(process.cwd(), 'public', 'ads');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

export function getBannerImages(): string[] {
  try {
    return readdirSync(ADS_DIR)
      .filter((name) => !name.startsWith('.') && IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, 'ko', { numeric: true }))
      .map((name) => `/ads/${encodeURIComponent(name)}`);
  } catch {
    return []; // 폴더가 없으면 이미지 배너를 쓰지 않는다
  }
}
