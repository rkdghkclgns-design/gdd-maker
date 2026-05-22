# GDD 메이커 — 데스크톱 앱 빌드 가이드 (Tauri)

브라우저 없이 더블클릭으로 실행되는 네이티브 데스크톱 앱으로 빌드합니다.

## 장점

- **OS 키체인급 보안**: Gemini API 키가 앱 데이터 폴더에 저장 (브라우저 localStorage보다 격리됨)
- **번들 크기 5~10MB** (Electron 대비 1/20)
- **시스템 트레이/단축키** 확장 여지
- **File System Access API 권한 모달 불필요**
- **네이티브 메모리/CPU 효율**

## 사전 준비

### 1) Rust 설치
```bash
# Windows: https://www.rust-lang.org/tools/install 에서 rustup-init.exe 실행
# macOS/Linux:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2) Node.js 설치 (이미 있을 수 있음)
- https://nodejs.org/ (LTS 권장)

### 3) Windows 추가 의존성
- Visual Studio Build Tools (C++ 빌드 도구) — Rust 설치 시 자동 안내
- WebView2 (Windows 11은 기본 포함, Win10은 https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

### 4) macOS 추가 의존성
```bash
xcode-select --install
```

### 5) Linux 추가 의존성 (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev build-essential curl wget file libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

## 빌드

프로젝트 루트에서:

```bash
npm install              # Tauri CLI 설치
npm run dev              # 개발 모드 (창 즉시 띄움, 핫리로드)
npm run build            # 배포용 빌드 — src-tauri/target/release/bundle/ 에 산출물
```

## 산출물 위치

- **Windows**: `src-tauri/target/release/bundle/msi/GDD 메이커_0.3.0_x64_en-US.msi`
- **macOS**: `src-tauri/target/release/bundle/dmg/GDD 메이커_0.3.0_aarch64.dmg`
- **Linux**: `src-tauri/target/release/bundle/appimage/gdd-maker_0.3.0_amd64.AppImage` 또는 `.deb`

설치 후 시작 메뉴/Applications에서 "GDD 메이커" 검색하여 실행.

## 아이콘 추가 (선택)

`src-tauri/icons/` 에 다음 파일들을 넣어 빌드하면 앱 아이콘이 적용됩니다:
- `32x32.png`, `128x128.png`, `128x128@2x.png`
- `icon.icns` (macOS), `icon.ico` (Windows)

빠르게 생성: https://tauri.app/v1/guides/features/icons/ 의 `tauri icon` 명령 사용
```bash
npx @tauri-apps/cli icon path/to/source.png
```

## 트러블슈팅

- **빌드 매우 느림 (첫 빌드)**: Rust 의존성 컴파일에 5~15분. 두 번째부터는 빠름.
- **WebView2 누락 에러 (Windows)**: 위 4) 링크에서 설치
- **권한 거부 (macOS Gatekeeper)**: 시스템 환경설정 → 보안 → "확인되지 않은 개발자" 허용

## 동작 차이

- 브라우저 모드와 동일하게 작동. 차이점:
  - URL이 `tauri://localhost`
  - `window.__TAURI__` 객체가 존재 → 향후 네이티브 파일 시스템/키체인 통합 가능
  - 백엔드 호출 예시는 `src-tauri/src/main.rs` 참고 (`save_api_key` / `load_api_key` 등)

## 향후 확장 아이디어

- OS 키체인 (Windows Credential Manager / macOS Keychain) 통합 → `tauri-plugin-stronghold` 또는 `keyring` crate
- 글로벌 단축키 (앱 비활성 상태에서도)
- 시스템 트레이 + 빠른 노트 위젯
- 자동 업데이트 (Tauri Updater)
