# CHECKPOINT — 알려진 버그 / 재발 방지 가이드

> **작업 시작 전 반드시 이 파일을 먼저 읽을 것.**
> 이 파일은 이전 세션에서 발생했던 버그와 그 근본 원인을 기록한다. 같은 실수를 반복하면 사용자가 작업 흐름을 중단하고 다시 핫픽스를 요청해야 한다.

---

## 🔴 CRITICAL — 즉시 앱이 죽거나 화면이 빈다

### CKPT-001. `data.js` template literal 내부의 unescaped backtick
**증상**: `Uncaught ReferenceError: CHIP_SUGGESTIONS is not defined` 가 ChatTab 등 임의 컴포넌트에서 발생 → ErrorBoundary 발동 → 앱 전체 죽음.
**원인**: `data.js` 의 `buildAiPrompt` / `buildAiEditPrompt` 는 거대한 백틱 template literal 이다. 그 안에 escape 되지 않은 `` ` `` 가 하나라도 들어가면 첫 backtick 이 template 을 조기 종료시켜 나머지가 JS 문법 오류로 파싱되고, `data.js` 전체가 실행 실패한다. 결과적으로 `Object.assign(window, { CHIP_SUGGESTIONS, uid, fileToDataUrl, ... })` 가 호출되지 않아 모든 cross-file 글로벌이 미설정.
**재발 방지**:
- `data.js` 의 template literal 안에서 식별자를 인용하려면 항상 `\`name\`` 으로 escape.
- 코드 펜스(```` ``` ````) 같은 markdown 표기는 template literal 안에 그대로 넣지 말 것. JSON 객체 + 들여쓰기로 대체.
- `data.js` 를 수정한 직후 반드시 다음 명령을 실행:
  ```bash
  node --check data.js
  ```
  syntax error 가 나오면 즉시 수정.
- 모든 loose `.js` 파일(`storage.js`, `usage.js`, `validators.js`, `export-formats.js`, `consistency-check.js`, `stats.js`, `gemini-adapter.js`, `data.js`) 에 동일.

### CKPT-002. blob URL 영속화로 인한 `ERR_FILE_NOT_FOUND` 폭발
**증상**: 페이지 새로고침 후 콘솔에 다수의 `GET blob:https://.../<uuid> net::ERR_FILE_NOT_FOUND` 가 쏟아짐. 이미지가 깨져 보임.
**원인**: `storage.js` 의 `restoreImageRefs` 가 IndexedDB ref(`idb-image://<uuid>`) 를 `URL.createObjectURL` 로 만든 blob URL 로 치환한 다음, 그 state 가 자동 저장 디바운스에 의해 다시 디스크로 영속화됨. blob URL 은 페이지 세션 한정이라 다음 새로고침 시 모두 무효.
**재발 방지**:
- `restoreImageRefs` 가 만든 모든 blob URL 은 양방향 맵(`_urlToUuid`) 에 등록.
- `extractAndStoreImages` (저장 단계) 에서 `blob:` URL 발견 시 역맵에서 원래 ref 로 복원하거나 그것도 없으면 `null` 로 정리.
- `loadState` 단계에 `stripStaleBlobUrls` 가 있어 과거 잔재도 1차 청소.
- 새로 blob URL 을 만드는 코드 추가 시 반드시 역맵에 등록할 것.

### CKPT-003. AI 응답의 무검증 필드 머지 (XSS 우려)
**증상**: AI 가 patch op 의 `op.fields.imageSrc` 에 `javascript:alert(1)` 같은 위험 스킴을 넣을 수 있다 (이론적). 브라우저가 차단하긴 하지만 방어 가능.
**원인**: `aiEditGdd` 의 patch/replace 가 LLM 응답의 임의 필드를 `slide.data` 에 그대로 머지.
**재발 방지**:
- `sanitizeSlideData` 헬퍼가 `imageSrc` 필드를 `data:image/(png|jpeg|jpg|webp|gif|svg+xml);base64,` allowlist 로만 통과시킴.
- `gemini-adapter.js` `generateImage` 도 응답 MIME 을 `ALLOWED_IMAGE_MIME` 화이트리스트로 검증.
- AI 응답을 직접 React 에 렌더할 때는 절대 `dangerouslySetInnerHTML` 사용 금지. 항상 `textContent` 또는 React node tree 로 변환.

---

## 🟠 HIGH — 가시적 깨짐 / 데이터 손실 위험

### CKPT-004. `.section-card { overflow: hidden }` + 자식의 음수 offset 절대 배치 → 클리핑
**증상**: Core Loop 의 `.coreloop-del` 버튼 (top: -8px), flow-node-controls (right: -68px), diagram/seq/cls 컨트롤 (top: -28px) 이 부모의 `overflow: hidden` 에 잘려 안 보임.
**재발 방지**:
- absolute 자식의 offset 을 음수로 두지 말 것. 부모 `overflow: hidden` 보다 안쪽에 배치.
- 컨트롤 바는 노드 위/옆이 아니라 내부 코너 또는 `bottom: -28px` (하단 overflow 가 있는 경우만) 에 배치.
- 호버 시에만 보이는 컨트롤이라도 클리핑은 처음부터 회피.

### CKPT-005. flex 컨테이너에 `flex-shrink: 0` 자식이 컨테이너 폭을 초과
**증상**: 컨셉 페이지 Core Loop 노드 5개 이상에서 좌우 노드가 잘려 보임.
**재발 방지**:
- 가로 한 줄 flex 컨테이너에 고정 폭 자식이 들어가면 `overflow-x: auto` + 커스텀 스크롤바를 항상 동시에 설정.
- 자식 폭의 합이 컨테이너 폭을 넘을 가능성이 있는 모든 곳에 적용.

### CKPT-006. TopBar 가로 항목 8개 이상 + 좁은 창 폭에서 오버플로
**증상**: 상단 툴바에 항목이 많을 때 좁은 화면에서 오른쪽 항목이 시야 밖.
**재발 방지**:
- `.topbar` 자체에 `overflow-x: auto`.
- 자식들은 `flex-shrink: 0`, crumb 류는 `min-width: 0` + `white-space: nowrap` + `text-overflow: ellipsis`.

### CKPT-007. 슬라이드 표 (history-table / terms-table) 가 `.slide-frame { overflow: hidden }` 에 클리핑
**증상**: 행이 많거나 컬럼이 길면 슬라이드 영역 밖에서 잘림.
**재발 방지**: 모든 표를 `<div className="data-wrap" style={{ flex:1, minHeight:0, overflow:'auto' }}>` 로 감쌀 것 (DataTableSlide 패턴).

### CKPT-008. 텍스트 마크다운(`**bold**`, `` `code` ``) 이 리터럴로 노출
**증상**: rules/intent/terms/resources 슬라이드의 텍스트에 AI 가 markdown 을 작성했지만 화면에는 `**우선순위**` 가 그대로 보임.
**원인**: `Editable` 이 `textContent` 만 렌더링하기 때문.
**재발 방지**:
- `Editable` 컴포넌트는 `markdown` prop 을 지원. 모든 descriptive 텍스트 필드(`multiline` 인 곳)에는 `markdown` 함께 전달.
- 새 슬라이드 타입 추가 시 잊지 말고 `markdown` 활성.
- 마크다운 파서는 `dangerouslySetInnerHTML` 미사용 → XSS 안전.

---

## 🟡 MEDIUM — 품질 / UX 저하

### CKPT-009. AI 가 imagePrompt 를 빼먹어 image-embed/ui-design/section-divider 이미지 누락
**증상**: 슬라이드에 placeholder 만 보이고 실제 이미지가 없음.
**재발 방지**:
- `synthesizeImagePrompt(slide, parsedRoot)` 가 fallback 으로 영문 프롬프트 자동 합성 (cover/section-divider/ui-design/image-embed).
- `aiGenerateGdd` 와 `aiEditGdd` 모두 동일 폴백 호출.
- 사용자가 직접 트리거할 때를 위해 명령 팔레트의 `🍌 누락된 이미지 모두 생성` 액션이 현재 GDD 의 모든 누락 슬라이드를 일괄 재생성.
- ui-design / image-embed 슬라이드의 빈 placeholder 안에 인라인 prompt 입력 + `🍌 AI 생성` 버튼.

### CKPT-010. 순서·절차 로직이 rules 슬라이드의 텍스트로 들어감
**증상**: `[조건] → [동작] → [예외]` 패턴이 텍스트로만 나열되어 가독성 떨어짐.
**재발 방지**:
- `buildAiPrompt` 의 "슬라이드 선택 규칙" 매핑 테이블이 절차/조건 분기는 반드시 `flow` 또는 `sequence-diagram` 으로 가도록 강제.
- 기존 rules 슬라이드는 "⇄ 플로우 차트로 변환" 버튼으로 1-클릭 변환.

### CKPT-011. Flow 차트가 세로 한 줄만 그려져 노드 9개 이상이면 글씨 깨알
**재발 방지**:
- `data.direction` (vertical|horizontal|grid) + `data.lines` (1|2) 필드 둘 다 지원.
- 노드 수 기반 자동 선택: ≤5 vertical/1, 6~8 horizontal/1, 9+ horizontal/2 또는 grid.
- AI 프롬프트가 이 두 필드를 채우도록 명시.

### CKPT-012. 클래스 다이어그램 누락 또는 형식 부정확
**재발 방지**:
- AI 프롬프트에 "캐릭터/유닛/카드/아이템/스킬 등 OOP 모델이 등장하면 반드시 1장 이상 class-diagram 포함" 명시.
- attrs/methods 는 반드시 가시성 prefix(`+`/`-`/`#`) + name + ":" + 타입.
- relations 의 kind 는 inherit/implement/compose/aggregate/assoc/depend 중 선택, label 에 multiplicity 명시.

---

## 🟢 LOW — 폴리시

### CKPT-013. `console.log/error` 가 프로덕션 코드에 남음
**재발 방지**:
- 사용자에게 보여야 할 에러는 `window.gddToast(msg, 'err')`.
- 디버그 로그가 필요하면 `if (window.__DEBUG__)` 로 감쌀 것.

### CKPT-014. `setProject(p => ...)` updater 밖에서 closure 캡처
**증상**: stale data 로 잘못된 업데이트.
**재발 방지**: 함수형 updater 안에서 `p.slides` 를 직접 참조해 derive.

### CKPT-015. `useEffect` deps 에 미포함된 외부 의존성
**재발 방지**: ESLint 의 react-hooks/exhaustive-deps 룰이 없으므로 수동 점검. 특히 `ref.current` 사용 시 ref 자체는 deps 에 넣을 필요 없지만 외부 prop/state 는 반드시 포함.

---

## 🛠 작업 시 체크리스트

매번 변경 후:
- [ ] `node --check data.js storage.js validators.js export-formats.js gemini-adapter.js consistency-check.js stats.js usage.js` — 모두 통과
- [ ] `node build.js` — bundle 생성 성공
- [ ] 새 슬라이드 타입 추가 시: `SLIDE_RENDERERS` + `SLIDE_LABELS` + `addSlide` 템플릿 + `AddSlideMenu` + `validators.js` + `export-formats.js`(markdown) + `doc-export.jsx`(pptx) 모두 업데이트
- [ ] 새 글로벌(`window.X`) 추가 시: data.js 또는 해당 .js 파일에서 `Object.assign(window, { X })` 명시
- [ ] CSS 의 `overflow: hidden` 부모 + 자식의 음수 offset 조합 없는지 확인
- [ ] flex 컨테이너에 고정 폭 자식이 컨테이너 폭을 넘을 위험이 있으면 `overflow-x: auto`
- [ ] 새 이미지 슬라이드 타입은 `synthesizeImagePrompt` 헬퍼에 분기 추가
- [ ] AI 프롬프트 수정 후 `data.js` template literal 의 backtick 모두 escape 확인

---

## 📜 변경 시 참조해야 할 핵심 파일

| 파일 | 역할 |
|---|---|
| `data.js` | AI 프롬프트(`buildAiPrompt`, `buildAiEditPrompt`), 페르소나, seed 데이터, 분류 |
| `storage.js` | IndexedDB 직렬화, blob URL 양방향 매핑, 백업 폴더 |
| `validators.js` | 모든 슬라이드 타입의 schema 디폴트 + 자동 보정 |
| `export-formats.js` | Markdown / PDF / PNG / SVG 출력 |
| `doc-export.jsx` | PPTX 출력 + Document 뷰 |
| `slides.jsx` | 슬라이드 렌더러 + `Editable`/`MarkdownText` |
| `diagram.jsx` | flow / diagram / sequence-diagram / class-diagram 렌더 + AI |
| `app.jsx` | App root, `aiGenerateGdd`, `aiEditGdd`, `synthesizeImagePrompt`, 키보드 핸들러, 명령 팔레트 |
| `gemini-adapter.js` | Gemini 텍스트 + 이미지 호출 + MIME 검증 |
| `chat.jsx` | RightPanel / ChatTab — 채팅이 신규/수정 모드 자동 분기 |
| `concept.jsx` | 1-Page 컨셉 페이지 |
| `command-palette.jsx` | Cmd+K UI |
| `brief.jsx` | 기획서/컨셉 브리프 작성 모달 |
| `tweaks-panel.jsx` | 우하단 설정 패널 |

**bundle.jsx 는 자동 생성물**. 직접 수정 금지. 항상 `node build.js` 로 재생성.
