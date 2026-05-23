# Claude 작업 가이드

이 저장소에서 작업하는 Claude (또는 다른 AI 코더) 는 **반드시 작업 시작 전에 [CHECKPOINT.md](./CHECKPOINT.md) 를 먼저 읽고 진행할 것.**

CHECKPOINT.md 는 이전 세션에서 발생한 모든 버그·실수·재발 위험을 기록한다. 같은 실수를 반복하면 사용자가 작업 흐름을 중단해야 한다.

## 빠른 참조

- **저장소 구조**: `*.jsx` 는 `node build.js` 로 `bundle.jsx` 에 concat. `*.js` 는 `<script src>` 로 별도 로드.
- **AI 프롬프트**: `data.js` 의 `buildAiPrompt` / `buildAiEditPrompt`.
- **저장**: `storage.js` (IndexedDB + blob URL 양방향 맵).
- **슬라이드 타입 추가** 시 업데이트해야 할 곳: `slides.jsx` 또는 `diagram.jsx`, `validators.js`, `export-formats.js`, `doc-export.jsx`, `app.jsx` (`addSlide` 템플릿 + `AddSlideMenu` 목록).
- **새 글로벌** 추가 시: 정의된 `.js` 파일의 `Object.assign(window, { ... })` 에 명시.

## 변경 후 필수 검증

```bash
# 1) 모든 loose .js 파일 syntax 검증
node --check data.js
node --check storage.js
node --check validators.js
node --check export-formats.js
node --check gemini-adapter.js
node --check consistency-check.js
node --check stats.js
node --check usage.js

# 2) 번들 재빌드
node build.js

# 3) Git diff 확인 후 커밋
git add <changed files>
git commit -m "..."
git push origin main
```

GitHub Pages 가 자동 배포 (`.github/workflows/deploy.yml`).

## 작업 우선순위

1. **재발 방지 우선** — CHECKPOINT.md 의 모든 가이드라인을 우선 적용.
2. **사용자 흐름 보호** — 사용자가 작성한 데이터(슬라이드, 컨셉, 스냅샷) 를 잃지 않게.
3. **AI 비용 통제** — `gddUsage` 로 비용 추적. 사용자 확인 없이 N>5 의 nano-banana 호출은 confirm 필수.
4. **UX 일관성** — 토스트는 `window.gddToast`, 모달은 `.form-panel-overlay` 패턴.

## 절대 금지

- `dangerouslySetInnerHTML` 사용 (AI 응답이 들어가는 모든 경로).
- `console.log` / `console.error` 프로덕션 코드에 남기기.
- `bundle.jsx` 직접 수정.
- 새 commit 에 `node --check` 를 통과하지 못한 코드 포함.
- AI 응답을 `window.eval` 이나 `new Function()` 으로 실행.
