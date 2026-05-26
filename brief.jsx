/* === Brief Composer + Paste utilities === */

/* Multi-paste helper: extract images + text blocks from a ClipboardEvent.
   Returns { images: [{src, name}], texts: [{value}] } */
function readClipboard(event) {
  const out = { images: [], texts: [] };
  const items = event.clipboardData?.items || [];
  const files = event.clipboardData?.files || [];

  // Files (when user pastes file from explorer)
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    if (f.type.startsWith('image/')) {
      out.images.push({ file: f, name: f.name || `image-${i}.png` });
    }
  }
  // Items (when user pastes raw image data)
  for (const item of items) {
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      const f = item.getAsFile();
      if (f && !out.images.some(x => x.file === f)) {
        out.images.push({ file: f, name: f.name || 'pasted-image.png' });
      }
    } else if (item.kind === 'string' && (item.type === 'text/plain' || item.type === 'text/html')) {
      // text path handled via the textarea natively unless we want to intercept block
    }
  }
  return out;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/* Brief Composer modal */
function BriefComposer({ onClose, onSubmit, isGenerating, initialMode = 'ai', mode = 'gdd', prefill }) {
  const [title, setTitle] = React.useState(prefill?.title || '');
  const [brief, setBrief] = React.useState(prefill?.brief || '');
  const [attachments, setAttachments] = React.useState([]);
  const [submissionMode, setSubmissionMode] = React.useState(initialMode);
  const [dragging, setDragging] = React.useState(false);
  const taRef = React.useRef(null);
  const dragCounterRef = React.useRef(0);
  const fileInputRef = React.useRef(null); // 숨겨진 file input — 버튼 클릭으로 트리거

  const isConcept = mode === 'concept';
  const isLinked = mode === 'gdd-linked';

  const addImage = async (file) => {
    const src = await fileToDataUrl(file);
    setAttachments(a => [...a, { id: uid(), kind: 'image', src, name: file.name || 'image.png' }]);
  };
  const addTextBlock = (value, name) => {
    setAttachments(a => [...a, { id: uid(), kind: 'text', value, name: name || `텍스트 ${a.filter(x=>x.kind==='text').length + 1}` }]);
  };

  const onPaste = async (e) => {
    const { images } = readClipboard(e);
    // If clipboard has images, intercept paste and add them as attachments
    if (images.length) {
      e.preventDefault();
      for (const im of images) await addImage(im.file);
      return;
    }
    // Check for large text — if pasting > 200 chars AND user already has content, ask to attach
    const text = e.clipboardData?.getData('text/plain') || '';
    if (text.length > 400 && brief.trim().length > 30) {
      // Heuristic: attach as block rather than concat
      e.preventDefault();
      addTextBlock(text, '붙여넣은 텍스트');
    }
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    dragCounterRef.current = 0;
    const files = Array.from(e.dataTransfer?.files || []);
    for (const f of files) {
      if (f.type.startsWith('image/')) await addImage(f);
      else if (f.type.startsWith('text/')) {
        const text = await f.text();
        addTextBlock(text, f.name);
      }
    }
  };
  const onDragEnter = (e) => { e.preventDefault(); dragCounterRef.current++; setDragging(true); };
  const onDragLeave = (e) => { dragCounterRef.current--; if (dragCounterRef.current <= 0) setDragging(false); };
  const onDragOver = (e) => { e.preventDefault(); };

  const removeAttachment = (id) => setAttachments(a => a.filter(x => x.id !== id));

  // 명시적 파일 선택 — 모바일/터치 환경에서도 첨부 가능. paste/drag 보조.
  const onPickFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      if (f.type.startsWith('image/')) await addImage(f);
      else if (f.type.startsWith('text/')) {
        const text = await f.text();
        addTextBlock(text, f.name);
      }
    }
    // 같은 파일을 다시 선택할 수 있도록 input 값 리셋
    if (e.target) e.target.value = '';
  };
  const triggerFilePicker = () => fileInputRef.current && fileInputRef.current.click();

  const submit = () => {
    const text = (title.trim() ? title.trim() + ' — ' : '') + brief.trim();
    if (!text && attachments.length === 0) return;
    onSubmit({ title: title.trim(), brief: brief.trim(), attachments, mode: submissionMode });
  };

  const imgCount = attachments.filter(a => a.kind === 'image').length;
  const txtCount = attachments.filter(a => a.kind === 'text').length;

  const headerCopy = isConcept
    ? { h: '새 게임 컨셉 만들기', sub: '게임의 한 줄 컨셉을 입력하세요. 참고 이미지(레퍼런스 게임 스크린샷·아트워크·UI 시안)를 첨부하면 AI 가 시각적 스타일과 시스템 구조를 참조합니다.' }
    : isLinked
    ? { h: '컨셉 기반 세부 기획서 생성', sub: '컨셉의 추천 기획서에서 시작합니다. 추가 설명이나 참고 자료를 더하세요.' }
    : { h: '새 기획서 만들기', sub: '어떤 기획을 작성할지 명령하세요. 이미지·텍스트는 붙여넣기 또는 드래그로 첨부할 수 있습니다.' };

  const submitLabel = isConcept ? '컨셉 생성 ↵' : '기획서 생성 ↵';

  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="brief-composer" onClick={e => e.stopPropagation()}>
        <header>
          <div className="head-l">
            <h2><span className="accent-dot"></span>{headerCopy.h}</h2>
            <div className="sub">{headerCopy.sub}</div>
          </div>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>

        <div className="brief-body">
          <input
            className="brief-title-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={isConcept ? '게임 제목 (선택사항)' : '기획서 제목 (선택사항)'}
            autoFocus
          />

          <div
            className={'brief-prompt-wrap ' + (dragging ? 'dragging' : '')}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <textarea
              ref={taRef}
              value={brief}
              onChange={e => setBrief(e.target.value)}
              onPaste={onPaste}
              placeholder={isConcept
                ? "예) 고양이들이 우주선을 타고 탐험하는 픽셀아트 게임. 친구 4명과 협동, 행성마다 다른 미니게임. 라이트 캐주얼 타겟. 모바일 우선.\n\n이미지를 ⌘V로 붙여넣거나 끌어다 놓으세요."
                : "예) 슈퍼럼블 모드 기획서 만들어줘. 4vs4 팀전이고, 5분 제한, 마지막 30초 럼블 페이즈에서 모든 차량 스피드 +30%.\n\n이미지를 ⌘V 로 붙여넣거나, 텍스트 블록을 끌어다 놓으세요."
              }
              rows={5}
            />
            <div className="brief-prompt-meta">
              <button
                type="button"
                className="pill pill-btn"
                onClick={triggerFilePicker}
                title="이미지·텍스트 파일을 첨부 (PNG/JPG/GIF/WEBP/TXT/MD)"
                style={{ cursor: 'pointer', border: 'none', font: 'inherit' }}
              >
                📎 <span className="kbd">파일 선택</span>
              </button>
              <span className="pill">⌘V <span className="kbd">붙여넣기</span></span>
              <span className="pill">⇧ Drop <span className="kbd">드래그</span></span>
              {isConcept && (
                <span className="pill" style={{ background: 'rgba(76,194,255,0.12)', borderColor: 'rgba(76,194,255,0.35)', color: 'var(--accent)' }}>
                  🎮 <span className="kbd">참고 이미지를 첨부하면 AI 가 분석합니다</span>
                </span>
              )}
              <span style={{ marginLeft: 'auto', color: 'var(--text-4)' }}>{brief.length} chars</span>
              {/* hidden file input — 명시적 첨부 트리거. 단일/다중 선택 모두 허용. */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,text/plain,text/markdown,.md,.txt"
                style={{ display: 'none' }}
                onChange={onPickFiles}
              />
            </div>
          </div>

          {attachments.length > 0 && (
            <>
              <div className="brief-section-label">
                <span>첨부 자료</span>
                <span className="count">{imgCount > 0 && `이미지 ${imgCount}`}{imgCount > 0 && txtCount > 0 && ' · '}{txtCount > 0 && `텍스트 ${txtCount}`}</span>
              </div>
              <div className="brief-attach-grid">
                {attachments.map(a => (
                  a.kind === 'image' ? (
                    <div className="attach-tile" key={a.id}>
                      <img src={a.src} alt={a.name} />
                      <span className="label">{a.name.slice(0, 24)}</span>
                      <button className="del" onClick={() => removeAttachment(a.id)}>✕</button>
                    </div>
                  ) : (
                    <div className="attach-tile text-tile" key={a.id}>
                      <div className="t-head">
                        <span>📋 {a.name}</span>
                        <span>{a.value.length}자</span>
                      </div>
                      <div className="t-body">{a.value.slice(0, 200)}</div>
                      <button className="del" onClick={() => removeAttachment(a.id)}>✕</button>
                    </div>
                  )
                ))}
              </div>
            </>
          )}
        </div>

        <footer>
          <div className="mode-tabs">
            <button className={submissionMode === 'ai' ? 'active' : ''} onClick={() => setSubmissionMode('ai')}>AI 생성</button>
            <button className={submissionMode === 'demo' ? 'active' : ''} onClick={() => setSubmissionMode('demo')}>빠른 데모</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn ghost" onClick={onClose}>취소</button>
            <button
              className="btn primary"
              onClick={submit}
              disabled={isGenerating || (!brief.trim() && !title.trim() && attachments.length === 0)}
            >
              {isGenerating ? '생성 중…' : submitLabel}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* Chat input paste hook */
function useChatPaste(setAttachments) {
  return async (e) => {
    const { images } = readClipboard(e);
    if (images.length) {
      e.preventDefault();
      for (const im of images) {
        const src = await fileToDataUrl(im.file);
        setAttachments(a => [...a, { id: uid(), kind: 'image', src, name: im.name }]);
      }
    }
  };
}

Object.assign(window, { BriefComposer, useChatPaste, readClipboard, fileToDataUrl });
