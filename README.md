# GDD 메이커 — 게임 기획서 빌더

AI(Google Gemini) 기반 로컬 게임 기획서 빌더. 컨셉 1-Page GDD부터 세부 기획서(전투, 시스템, BM, 사운드, UI/UX 등)까지 정합성 있게 자동 생성합니다.

## 라이브 데모

GitHub Pages: **https://<your-username>.github.io/gdd-maker/**
(아래 배포 안내에 따라 활성화)

## 핵심 기능

- ✦ **AI 컨셉 자동 생성** — 한 줄 아이디어 → 1-Page GDD + 컨셉 아트(nano-banana)
- ✦ **필요 기획서 일괄 생성** — 시니어 페르소나 + 8개 도메인 마스터 (코어/시스템/컨텐츠/BM/사운드/UI-UX/튜토리얼/아트)
- 🧐 **컨셉 일관성 점검** — 용어/필드/USP/누락 자동 분석
- 📸 **GDD 스냅샷** + Undo/Redo (50단계)
- 📊 **AI 비용 추적기** + 일/월 한도
- 💾 **IndexedDB + 이미지 Blob 분리** — 5MB localStorage 한계 해소
- 📁 **자동 백업 폴더** (File System Access API)
- 🛡 **ErrorBoundary + 비상 백업** — 작업 분실 방지
- ⌨ **Cmd+K 명령 팔레트** + 단축키 시스템
- 📤 **다중 출력**: PPTX / PDF / Markdown / JSON / 슬라이드별 PNG·SVG
- 🖥 **Tauri 데스크톱 빌드** 지원

## 빠른 시작 (로컬)

### Python으로 정적 서빙
```bash
git clone https://github.com/<your-username>/gdd-maker.git
cd gdd-maker
node build.js                          # bundle.jsx 생성
python -m http.server 8000             # 또는 npx serve
# http://localhost:8000 접속
```

### Gemini API 키 설정
1. https://aistudio.google.com/apikey 에서 무료 키 발급
2. 앱 우상단 `Gemini 키 설정` 버튼 → 키 붙여넣기
3. 모델 선택 (기본 `gemini-2.5-flash`)

## 빌드

```bash
node build.js
# → bundle.jsx (모든 .jsx를 단일 파일로 concat)
```

Babel-standalone이 브라우저에서 JSX를 컴파일하므로 별도 트랜스파일 불필요.

## GitHub Pages 배포

이 repo는 main 브랜치 push 시 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)이 자동으로:
1. `node build.js` 실행 → bundle.jsx 갱신
2. 정적 파일을 GitHub Pages에 배포

설정:
1. GitHub repo의 **Settings → Pages → Source = GitHub Actions**
2. main 브랜치에 push → Actions 탭에서 빌드 진행 확인
3. 배포 완료 후 `https://<username>.github.io/<repo>/`에서 접속

## 데스크톱 앱 (Tauri)

[DESKTOP_BUILD.md](DESKTOP_BUILD.md) 참고. Rust + Tauri CLI 설치 후:
```bash
npm install
npm run build  # .msi / .dmg / .AppImage 산출
```

## 프로젝트 구조

```
.
├── index.html              # 앱 진입점 (bundle.jsx 로드)
├── styles.css              # 전체 스타일
├── build.js                # .jsx → bundle.jsx 빌드 스크립트
├── bundle.jsx              # ← 빌드 산출물 (커밋됨)
│
├── *.jsx                   # React 컴포넌트 소스 (9개)
│   ├── tweaks-panel.jsx
│   ├── slides.jsx
│   ├── diagram.jsx
│   ├── brief.jsx
│   ├── concept.jsx
│   ├── chat.jsx
│   ├── doc-export.jsx
│   ├── command-palette.jsx
│   └── app.jsx
│
├── *.js                    # 헬퍼 모듈 (IIFE)
│   ├── storage.js          # IndexedDB + 이미지 Blob 분리
│   ├── usage.js            # AI 비용 추적
│   ├── gemini-adapter.js   # Gemini API 클라이언트
│   ├── data.js             # 시드 데이터 + 페르소나 + 프롬프트 빌더
│   ├── validators.js       # AI 응답 schema 검증
│   ├── export-formats.js   # PDF/Markdown/PNG/SVG 출력
│   ├── consistency-check.js # 정합성 검증
│   └── stats.js            # 활동 통계
│
├── .github/workflows/      # GitHub Actions
├── src-tauri/              # Tauri 데스크톱 패키징
└── DESKTOP_BUILD.md        # 데스크톱 빌드 가이드
```

## 기술 스택

- React 18 (UMD)
- Babel Standalone (브라우저에서 JSX 컴파일)
- IndexedDB (영속 저장)
- Google Gemini API (텍스트 + nano-banana 이미지)
- PptxGenJS, jsPDF, html2canvas

## 라이선스

MIT — [LICENSE](LICENSE)
