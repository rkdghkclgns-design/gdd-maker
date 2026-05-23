/* === Slide renderers for each type ===
   All slides render into a 1280x720 frame and are inline-editable via contentEditable.
   onChange(updaterFn) lets edits patch the slide.data tree. */

const E = (tag, props, ...children) => React.createElement(tag, props, ...children);

/* ====== Inline Markdown 파서 ======
 * 지원: **bold**, *italic*, _italic_, `code`, ~~strike~~, [text](url)
 * 한 줄 단위로 토큰화 후 React node 트리로 변환. 중첩은 미지원(단순/안전).
 * dangerouslySetInnerHTML 미사용 → contentEditable XSS 위험 없음.
 */
function parseInlineMd(line) {
  if (!line) return [];
  const out = [];
  const RE = /(\*\*([^*\n]+?)\*\*)|(`([^`\n]+?)`)|(~~([^~\n]+?)~~)|(\[([^\]\n]+?)\]\(([^)\n]+?)\))|(\*([^*\s][^*\n]*?)\*)|(\b_([^_\s][^_\n]*?)_\b)/g;
  let last = 0;
  let m;
  let key = 0;
  while ((m = RE.exec(line)) !== null) {
    if (m.index > last) out.push(line.slice(last, m.index));
    if (m[1]) out.push(React.createElement('strong', { key: key++, className: 'md-strong' }, m[2]));
    else if (m[3]) out.push(React.createElement('code', { key: key++, className: 'md-code' }, m[4]));
    else if (m[5]) out.push(React.createElement('span', { key: key++, className: 'md-strike' }, m[6]));
    else if (m[7]) out.push(React.createElement('a', { key: key++, className: 'md-link', href: m[9], target: '_blank', rel: 'noopener noreferrer', onClick: (e) => e.stopPropagation() }, m[8]));
    else if (m[10]) out.push(React.createElement('em', { key: key++, className: 'md-em' }, m[11]));
    else if (m[12]) out.push(React.createElement('em', { key: key++, className: 'md-em' }, m[13]));
    last = RE.lastIndex;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

function MarkdownText({ text }) {
  if (!text) return null;
  const lines = String(text).split('\n');
  const nodes = [];
  lines.forEach((line, i) => {
    // 줄머리의 "- " / "* " / "1. " / "2. " 같은 리스트 마커는 시각화
    const bulletMatch = /^(\s*)([-*•])\s+(.*)$/.exec(line);
    const numMatch = /^(\s*)(\d+\.)\s+(.*)$/.exec(line);
    if (bulletMatch) {
      const indent = bulletMatch[1].length;
      nodes.push(React.createElement('span', { key: `b-${i}`, className: 'md-bullet', style: { paddingLeft: 8 + indent * 12 } },
        React.createElement('span', { className: 'md-bullet-marker' }, '•'),
        ...parseInlineMd(bulletMatch[3])
      ));
    } else if (numMatch) {
      const indent = numMatch[1].length;
      nodes.push(React.createElement('span', { key: `n-${i}`, className: 'md-bullet', style: { paddingLeft: 8 + indent * 12 } },
        React.createElement('span', { className: 'md-bullet-marker md-num' }, numMatch[2]),
        ...parseInlineMd(numMatch[3])
      ));
    } else {
      nodes.push(React.createElement(React.Fragment, { key: `l-${i}` }, ...parseInlineMd(line)));
    }
    if (i < lines.length - 1) nodes.push(React.createElement('br', { key: `br-${i}` }));
  });
  return React.createElement(React.Fragment, null, ...nodes);
}

/* ------ tiny helpers ------ */
function Editable({ value, onChange, tag = 'span', placeholder = '...', className, style, multiline = false, readOnly = false, markdown = false }) {
  const ref = React.useRef(null);
  const [editing, setEditing] = React.useState(false);

  // 일반 모드: 기존과 동일하게 항상 contentEditable
  React.useEffect(() => {
    if (markdown && !editing) return; // markdown 표시 모드에서는 React 노드가 직접 렌더링됨
    if (ref.current && ref.current.textContent !== (value || '')) {
      ref.current.textContent = value || '';
    }
  }, [value, editing, markdown]);

  // markdown 편집 모드 진입 시 텍스트와 포커스 설정
  React.useEffect(() => {
    if (!markdown || !editing || !ref.current) return;
    ref.current.textContent = value || '';
    ref.current.focus();
    // 캐럿을 끝으로
    try {
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch {}
  }, [editing, markdown]);

  const handleInput = (e) => onChange && onChange(e.currentTarget.textContent);
  const handleKey = (e) => {
    if (!multiline && e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
  };

  // markdown 옵션이 꺼져 있거나 readOnly + markdown 인 경우 (편집 비활성) — 기존 동작 유지
  if (!markdown) {
    return React.createElement(tag, {
      ref,
      className,
      style,
      contentEditable: !readOnly,
      suppressContentEditableWarning: true,
      onInput: handleInput,
      onKeyDown: handleKey,
      'data-placeholder': placeholder,
      spellCheck: false,
    });
  }

  // markdown ON + 편집 중: 원본 텍스트 그대로 contentEditable
  if (editing && !readOnly) {
    return React.createElement(tag, {
      ref,
      className: (className || '') + ' md-editing',
      style,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onInput: handleInput,
      onBlur: () => setEditing(false),
      onKeyDown: handleKey,
      'data-placeholder': placeholder,
      spellCheck: false,
    });
  }

  // markdown ON + 표시 모드: 파싱된 React 노드 렌더링. 클릭하면 편집 모드 진입.
  return React.createElement(tag, {
    className: (className || '') + ' md-rendered' + (!value ? ' md-empty' : ''),
    style: { cursor: readOnly ? 'default' : 'text', ...(style || {}) },
    onClick: readOnly ? undefined : () => setEditing(true),
    'data-placeholder': placeholder,
  }, value ? React.createElement(MarkdownText, { text: value }) : null);
}

function SlideFooter({ section, sectionName, page, totalPages }) {
  return (
    <div className="footer">
      <div className="left">
        {section && <span>{section}</span>}
        {sectionName && <><span className="dash"></span><span>{sectionName}</span></>}
      </div>
      <div className="page">{String(page).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}</div>
    </div>
  );
}

function TopTag({ section, sectionName, title }) {
  if (!section && !title) return null;
  return (
    <div className="top-tag">
      {section && <span className="num">{section}</span>}
      {sectionName && <span className="sect-title">{sectionName}</span>}
      {title && <span style={{color:'#7d8590'}}>{title}</span>}
    </div>
  );
}

/* ------ 1. Cover ------ */
function CoverSlide({ data, patch, page, totalPages }) {
  return (
    <div className="slide cover">
      {data.imageSrc ? (
        <div className="cover-bg-img" style={{ backgroundImage: `url(${data.imageSrc})` }}></div>
      ) : (
        <div className="bg-grid"></div>
      )}
      <div className="cover-shade"></div>
      <div className="cover-mark">
        <span className="bar"></span>
        <Editable tag="span" value={data.product} onChange={(v) => patch({ product: v })} />
      </div>
      <div className="cover-team">
        <Editable tag="span" value={data.team} onChange={(v) => patch({ team: v })} />
      </div>
      <div className="cover-center">
        <Editable tag="div" className="cover-title" value={data.title} onChange={(v) => patch({ title: v })} />
        <Editable tag="div" className="cover-subtitle" value={data.subtitle} onChange={(v) => patch({ subtitle: v })} />
      </div>
      <div className="cover-meta">
        <Editable tag="div" className="author" value={data.author} onChange={(v) => patch({ author: v })} />
        <Editable tag="div" value={data.date} onChange={(v) => patch({ date: v })} />
      </div>
      <div className="accent-line"></div>
    </div>
  );
}

/* ------ 2. History (version table) ------ */
function HistorySlide({ data, patch, page, totalPages }) {
  const updateRow = (i, key, val) => {
    const rows = [...(data.rows || [])];
    rows[i] = { ...rows[i], [key]: val };
    patch({ rows });
  };
  return (
    <div className="slide">
      <TopTag />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="data-wrap" style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <table className="history-table">
          <thead>
            <tr>
              <th style={{ width: '12%' }}>버전</th>
              <th style={{ width: '16%' }}>변경일자</th>
              <th style={{ width: '14%' }}>page</th>
              <th>내용</th>
              <th style={{ width: '16%' }}>작성자</th>
            </tr>
          </thead>
          <tbody>
            {(data.rows || []).map((r, i) => (
              <tr key={i}>
                <td className="ver"><Editable value={r.ver} onChange={(v) => updateRow(i, 'ver', v)} /></td>
                <td><Editable value={r.date} onChange={(v) => updateRow(i, 'date', v)} /></td>
                <td><Editable value={r.page} onChange={(v) => updateRow(i, 'page', v)} /></td>
                <td><Editable value={r.content} onChange={(v) => updateRow(i, 'content', v)} multiline /></td>
                <td><Editable value={r.author} onChange={(v) => updateRow(i, 'author', v)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SlideFooter sectionName="문서 이력" page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 3. TOC ------ */
function TocSlide({ data, patch, page, totalPages }) {
  const updateEntry = (i, key, val) => {
    const entries = [...(data.entries || [])];
    entries[i] = { ...entries[i], [key]: val };
    patch({ entries });
  };
  return (
    <div className="slide toc">
      <div className="toc-label">— TABLE OF CONTENTS</div>
      <Editable tag="div" className="toc-heading" value={data.title || 'CONTENTS'} onChange={(v) => patch({ title: v })} />
      <div className="toc-grid">
        {(data.entries || []).map((e, i) => (
          <div className="toc-entry" key={i}>
            <Editable className="num" value={e.num} onChange={(v) => updateEntry(i, 'num', v)} />
            <div style={{ flex: 1 }}>
              <Editable className="name" tag="div" value={e.name} onChange={(v) => updateEntry(i, 'name', v)} />
              <Editable className="sub" tag="div" value={e.sub} onChange={(v) => updateEntry(i, 'sub', v)} multiline />
            </div>
          </div>
        ))}
      </div>
      <SlideFooter sectionName="목차" page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 4. Section divider ------ */
function SectionDividerSlide({ data, patch, page, totalPages }) {
  return (
    <div className={'slide section-divider ' + (data.imageSrc ? 'has-bg' : '')}>
      {data.imageSrc && (
        <div className="sd-bg-img" style={{ backgroundImage: `url(${data.imageSrc})` }}></div>
      )}
      <div className="sd-shade"></div>
      <div className="sd-num">{data.num}</div>
      <div className="sd-tag">
        <span className="bar"></span>
        <span>CHAPTER {data.num}</span>
      </div>
      <Editable tag="div" className="sd-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <Editable tag="div" className="sd-subtitle" value={data.subtitle} onChange={(v) => patch({ subtitle: v })} multiline />
    </div>
  );
}

/* ------ 4b. Image embed (참고 이미지) ------
 * 인라인 AI 생성 지원: imagePrompt 필드 편집 + ✦ AI 생성 버튼.
 * 비어 있는 placeholder 상태에서도 바로 prompt 입력 + 생성 가능.
 * 이미지 pan/zoom: 마우스 드래그로 위치 이동, 휠로 확대/축소.
 */
function ImageEmbedSlide({ data, patch, page, totalPages }) {
  const fileRef = React.useRef(null);
  const wrapRef = React.useRef(null);
  const [generating, setGenerating] = React.useState(false);
  const [promptDraft, setPromptDraft] = React.useState('');
  const [dragging, setDragging] = React.useState(false);
  const transform = data.imageTransform || { scale: 1, x: 0, y: 0 };

  // 마우스 휠로 zoom — passive 리스너 회피를 위해 useEffect 로 직접 부착
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el || !data.imageSrc) return;
    const onWheel = (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      const cur = data.imageTransform || { scale: 1, x: 0, y: 0 };
      const newScale = Math.max(0.2, Math.min(8, cur.scale * factor));
      patch({ imageTransform: { ...cur, scale: newScale } });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [data.imageSrc, data.imageTransform, patch]);

  // 마우스 드래그 (pan) — window 단위 리스너로 cursor 가 영역을 벗어나도 추적
  const startDrag = (e) => {
    if (!data.imageSrc) return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const start = { ...transform };
    const onMove = (ev) => {
      patch({ imageTransform: { scale: start.scale, x: start.x + (ev.clientX - startX), y: start.y + (ev.clientY - startY) } });
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const resetTransform = (e) => {
    e.stopPropagation();
    patch({ imageTransform: { scale: 1, x: 0, y: 0 } });
  };
  const fitTransform = (e) => {
    // 컨테이너 전체에 맞추기 — scale 1, position 중앙
    e.stopPropagation();
    patch({ imageTransform: { scale: 1, x: 0, y: 0 } });
  };
  const zoomBtn = (factor) => (e) => {
    e.stopPropagation();
    const cur = data.imageTransform || { scale: 1, x: 0, y: 0 };
    patch({ imageTransform: { ...cur, scale: Math.max(0.2, Math.min(8, cur.scale * factor)) } });
  };

  const onPick = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => patch({ imageSrc: reader.result });
    reader.readAsDataURL(f);
  };
  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f || !f.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => patch({ imageSrc: reader.result });
    reader.readAsDataURL(f);
  };

  const generate = async (promptText) => {
    const p = (promptText || data.imagePrompt || '').trim();
    if (!p) {
      if (window.gddToast) window.gddToast('영문 이미지 프롬프트를 입력하세요', 'err');
      return;
    }
    if (!window.gemini || !window.gemini.generateImage) {
      if (window.gddToast) window.gddToast('Gemini API 키를 먼저 설정하세요', 'err');
      return;
    }
    setGenerating(true);
    try {
      const src = await window.gemini.generateImage(p);
      patch({ imageSrc: src, imagePrompt: p });
      setPromptDraft('');
      if (window.gddToast) window.gddToast('🍌 참고 이미지 생성 완료', 'ok');
    } catch (e) {
      if (window.gddToast) window.gddToast('이미지 생성 실패: ' + (e?.message || e), 'err');
    } finally {
      setGenerating(false);
    }
  };

  const hasPrompt = !!(data.imagePrompt && data.imagePrompt.trim());

  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <div className="image-embed-headline">
        <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
        <div className="image-embed-actions">
          <button
            className="mini-btn ai"
            onClick={() => generate()}
            disabled={generating || !hasPrompt}
            title={hasPrompt ? '아래 imagePrompt 로 이미지 생성' : '먼저 imagePrompt 를 입력하세요'}
          >{generating ? '생성 중…' : '🍌 AI 이미지 생성'}</button>
          <button className="mini-btn" onClick={() => fileRef.current?.click()} title="파일 첨부">📎 파일</button>
        </div>
      </div>
      <Editable tag="div" className="image-embed-caption" value={data.caption} onChange={(v) => patch({ caption: v })} multiline markdown placeholder="이미지가 보여주는 핵심 시각 요소·참조 의도를 한 줄로" />
      {/* imagePrompt 편집 — 영문 프롬프트 */}
      <Editable
        tag="div"
        className="image-embed-prompt"
        value={data.imagePrompt}
        onChange={(v) => patch({ imagePrompt: v })}
        multiline
        placeholder="🍌 영문 이미지 프롬프트 (예: A frozen-in-time street scene with floating debris, cyan glow, cinematic lighting, ultra-detailed concept art)"
      />
      <div
        ref={wrapRef}
        className={'image-embed-wrap' + (dragging ? ' dragging' : '') + (data.imageSrc ? ' has-image' : '')}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => !data.imageSrc && !generating && fileRef.current?.click()}
      >
        <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={onPick} />
        {generating ? (
          <div className="empty image-embed-loading">
            <div className="banana-spin">🍌</div>
            <div className="desc">nano-banana 로 이미지 생성 중…</div>
          </div>
        ) : data.imageSrc ? (
          <>
            <img
              src={data.imageSrc}
              alt="reference"
              draggable={false}
              onMouseDown={startDrag}
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transformOrigin: 'center center',
                cursor: dragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                transition: dragging ? 'none' : 'transform 0.12s ease-out',
              }}
            />
            <div className="image-embed-transform-bar">
              <button onClick={zoomBtn(0.85)} title="축소 (휠 ↓)">−</button>
              <span className="zoom-label">{Math.round(transform.scale * 100)}%</span>
              <button onClick={zoomBtn(1.15)} title="확대 (휠 ↑)">+</button>
              <span className="sep"></span>
              <button onClick={fitTransform} title="전체에 맞추기">⤢ 맞춤</button>
              <button onClick={resetTransform} title="위치·크기 초기화">↻ 초기화</button>
            </div>
            <div className="image-embed-overlay-actions">
              <button onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }} title="파일 교체">↻ 파일</button>
              {hasPrompt && (
                <button onClick={(e) => { e.stopPropagation(); generate(); }} title="AI 재생성">🍌 재생성</button>
              )}
            </div>
          </>
        ) : (
          <div className="empty image-embed-empty" onClick={(e) => e.stopPropagation()}>
            <div className="lbl">REFERENCE IMAGE</div>
            <div className="desc">클릭하여 이미지 첨부 · 드래그 가능</div>
            <div className="image-embed-inline-gen">
              <textarea
                value={promptDraft || data.imagePrompt || ''}
                onChange={(e) => setPromptDraft(e.target.value)}
                placeholder="또는 영문 프롬프트로 자동 생성 (예: A cyan-glowing stopwatch frozen in time, cinematic)…"
                rows={2}
                spellCheck={false}
              />
              <button
                className="btn primary"
                onClick={() => generate(promptDraft || data.imagePrompt)}
                disabled={generating || !((promptDraft || data.imagePrompt || '').trim())}
              >🍌 AI 생성</button>
            </div>
          </div>
        )}
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 5. Intent (4 cards) ------ */
function IntentSlide({ data, patch, page, totalPages }) {
  const updateCard = (i, key, val) => {
    const cards = [...(data.cards || [])];
    cards[i] = { ...cards[i], [key]: val };
    patch({ cards });
  };
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="intent-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <Editable tag="div" className="intent-tagline" value={data.tagline} onChange={(v) => patch({ tagline: v })} multiline />
      <div className="intent-grid">
        {(data.cards || []).map((c, i) => (
          <div className="intent-card" key={i}>
            <Editable className="idx" value={c.idx} onChange={(v) => updateCard(i, 'idx', v)} />
            <Editable tag="div" className="head" value={c.head} onChange={(v) => updateCard(i, 'head', v)} multiline markdown />
            <Editable tag="div" className="desc" value={c.desc} onChange={(v) => updateCard(i, 'desc', v)} multiline markdown />
          </div>
        ))}
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 6. Terms (definition table) ------ */
function TermsSlide({ data, patch, page, totalPages }) {
  const updateRow = (i, key, val) => {
    const rows = [...(data.rows || [])];
    rows[i] = { ...rows[i], [key]: val };
    patch({ rows });
  };
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="data-wrap" style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <table className="terms-table">
          <thead>
            <tr>
              <th>용어</th>
              <th>정의</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {(data.rows || []).map((r, i) => (
              <tr key={i}>
                <td className="term"><Editable tag="div" value={r.term} onChange={(v) => updateRow(i, 'term', v)} markdown /></td>
                <td className="def"><Editable tag="div" value={r.def} onChange={(v) => updateRow(i, 'def', v)} multiline markdown /></td>
                <td className="note"><Editable tag="div" value={r.note} onChange={(v) => updateRow(i, 'note', v)} multiline markdown /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 7. Rules (block list) ------ */
function RulesSlide({ data, patch, replace, page, totalPages }) {
  const [converting, setConverting] = React.useState(false);
  const updateBlock = (i, key, val) => {
    const blocks = [...(data.blocks || [])];
    blocks[i] = { ...blocks[i], [key]: val };
    patch({ blocks });
  };
  const updateItem = (bi, ii, val) => {
    const blocks = [...(data.blocks || [])];
    const items = [...(blocks[bi].items || [])];
    items[ii] = val;
    blocks[bi] = { ...blocks[bi], items };
    patch({ blocks });
  };

  // 현재 rules 슬라이드의 텍스트 내용을 모아 AI에 보내고, flow 슬라이드로 변환
  const convertToFlow = async () => {
    if (!replace) return;
    const rulesText = [
      `규칙 제목: ${data.title || ''}`,
      ...(data.blocks || []).map(b => {
        return `[${b.head || '블록'}]\n` + (b.items || []).map(i => '- ' + i).join('\n');
      }),
    ].join('\n\n') + '\n\n위 규칙들에 포함된 조건/동작/분기/엣지케이스를 절차적 흐름(flow chart)으로 시각화하라. 정적 상수만 있는 규칙은 무시하고, [조건]→[동작] 패턴을 decision/process/end 노드로 표현한다.';

    setConverting(true);
    try {
      const result = await (window.aiGenerateFlow ? window.aiGenerateFlow(rulesText) : null);
      if (result && Array.isArray(result.nodes) && result.nodes.length) {
        replace({
          type: 'flow',
          data: {
            section: data.section || '02',
            sectionName: data.sectionName || '플로우 차트',
            title: data.title || '플로우 차트',
            nodes: result.nodes,
          },
        });
      } else if (window.gddToast) {
        window.gddToast('변환 실패 — AI 응답을 파싱하지 못했습니다.', 'err');
      }
    } catch (e) {
      if (window.gddToast) window.gddToast('변환 실패: ' + (e.message || e), 'err');
    } finally {
      setConverting(false);
    }
  };

  const useGrid = (data.blocks || []).length > 2;
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      {replace && (
        <div className="flow-edit-bar">
          <button className="mini-btn ai" onClick={convertToFlow} disabled={converting}
                  title="이 규칙들의 절차적 분기를 flow chart로 변환합니다. 원래 슬라이드는 대체됩니다.">
            {converting ? '변환 중…' : '⇄ 플로우 차트로 변환'}
          </button>
        </div>
      )}
      <div className={useGrid ? 'rules-grid' : 'rules-wrap'} style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {(data.blocks || []).map((b, i) => (
          <div className="rule-block" key={i}>
            <Editable tag="div" className="head" value={b.head} onChange={(v) => updateBlock(i, 'head', v)} markdown />
            <ul>
              {(b.items || []).map((it, ii) => (
                <li key={ii}><Editable tag="div" value={it} onChange={(v) => updateItem(i, ii, v)} multiline markdown /></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 8. Data table ------ */
function DataTableSlide({ data, patch, page, totalPages }) {
  const updateCell = (i, key, val) => {
    const rows = [...(data.rows || [])];
    rows[i] = { ...rows[i], [key]: val };
    patch({ rows });
  };
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="data-wrap" style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              {(data.columns || []).map((c, i) => (
                <th key={i} style={c.width ? { width: c.width } : undefined}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data.rows || []).map((r, i) => (
              <tr key={i}>
                {(data.columns || []).map((c, ci) => (
                  <td key={ci} className={c.key === 'field' || c.key === 'table' ? 'tag' : ''}>
                    <Editable tag="div" value={r[c.key] || ''} onChange={(v) => updateCell(i, c.key, v)} multiline markdown />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 9. Flow chart ------ */
function FlowSlide({ data, patch, page, totalPages }) {
  const updateNode = (i, val) => {
    const nodes = [...(data.nodes || [])];
    nodes[i] = { ...nodes[i], label: val };
    patch({ nodes });
  };
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="flow-wrap">
        <div className="flow-chart">
          {(data.nodes || []).map((n, i) => (
            <React.Fragment key={i}>
              <div className={'flow-node ' + (n.kind || 'process')}>
                <Editable value={n.label} onChange={(v) => updateNode(i, v)} multiline />
              </div>
              {i < (data.nodes || []).length - 1 && <div className="flow-arrow"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 10. UI design ------ */
function UiDesignSlide({ data, patch, page, totalPages }) {
  const fileRef = React.useRef(null);
  const [generating, setGenerating] = React.useState(false);
  const [promptDraft, setPromptDraft] = React.useState('');

  const updateCallout = (i, key, val) => {
    const cs = [...(data.callouts || [])];
    cs[i] = { ...cs[i], [key]: val };
    patch({ callouts: cs });
  };

  const onPick = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => patch({ imageSrc: reader.result });
    reader.readAsDataURL(f);
  };
  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f || !f.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => patch({ imageSrc: reader.result });
    reader.readAsDataURL(f);
  };

  const generate = async (promptText) => {
    const p = (promptText || data.imagePrompt || '').trim();
    if (!p) {
      if (window.gddToast) window.gddToast('영문 imagePrompt 를 입력하세요', 'err');
      return;
    }
    if (!window.gemini || !window.gemini.generateImage) {
      if (window.gddToast) window.gddToast('Gemini API 키를 먼저 설정하세요', 'err');
      return;
    }
    setGenerating(true);
    try {
      const src = await window.gemini.generateImage(p);
      patch({ imageSrc: src, imagePrompt: p });
      setPromptDraft('');
      if (window.gddToast) window.gddToast('🍌 UI 목업 생성 완료', 'ok');
    } catch (e) {
      if (window.gddToast) window.gddToast('이미지 생성 실패: ' + (e?.message || e), 'err');
    } finally {
      setGenerating(false);
    }
  };
  const hasPrompt = !!(data.imagePrompt && data.imagePrompt.trim());

  /** 자동 배치 폴백: callout에 x/y가 없을 때 균등 배치(가장자리 우선). [4,96] clamp. */
  const callouts = data.callouts || [];
  const positions = callouts.map((c, i) => {
    if (typeof c.x === 'number' && typeof c.y === 'number') {
      return { x: Math.max(4, Math.min(96, c.x)), y: Math.max(4, Math.min(96, c.y)) };
    }
    const fallbacks = [
      { x: 12, y: 15 }, { x: 88, y: 15 }, { x: 88, y: 50 },
      { x: 88, y: 85 }, { x: 12, y: 85 }, { x: 12, y: 50 },
      { x: 50, y: 15 }, { x: 50, y: 85 },
    ];
    return fallbacks[i % fallbacks.length];
  });

  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <div className="ui-design-headline">
        <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
        <div className="image-embed-actions">
          <button
            className="mini-btn ai"
            onClick={() => generate()}
            disabled={generating || !hasPrompt}
            title={hasPrompt ? 'imagePrompt 로 UI 목업 생성' : '먼저 imagePrompt 를 입력하세요'}
          >{generating ? '생성 중…' : '🍌 AI 목업 생성'}</button>
          <button className="mini-btn" onClick={() => fileRef.current?.click()} title="파일 첨부">📎 파일</button>
        </div>
      </div>
      {/* imagePrompt 편집 — 영문 프롬프트 */}
      <Editable
        tag="div"
        className="image-embed-prompt ui-design-prompt"
        value={data.imagePrompt}
        onChange={(v) => patch({ imagePrompt: v })}
        multiline
        placeholder="🍌 영문 UI 목업 프롬프트 (예: A clean dark sci-fi game HUD with HP bar top-left, minimap top-right, action bar bottom, 16:9)"
      />
      <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={onPick} />
      <div className="ui-design-wrap">
        <div className="ui-mockup"
             onDragOver={(e) => e.preventDefault()}
             onDrop={onDrop}>
          <div className="mock-bar"><span></span><span></span><span></span></div>
          <div className="mock-canvas">
            {generating ? (
              <div className="placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div className="banana-spin">🍌</div>
                <div className="lbl">GENERATING…</div>
                <div className="desc">nano-banana 로 UI 목업 생성 중</div>
              </div>
            ) : data.imageSrc ? (
              <img src={data.imageSrc} alt="UI mockup" className="ui-mockup-img" />
            ) : (
              <>
                <div className="ui-mockup-grid"></div>
                <div className="placeholder">
                  <div className="lbl">UI MOCKUP</div>
                  <div className="desc">클릭하여 첨부 · 드래그 · AI 생성 모두 가능</div>
                  <div className="image-embed-inline-gen" style={{ marginTop: 14, width: 'min(80%, 480px)' }}>
                    <textarea
                      value={promptDraft || data.imagePrompt || ''}
                      onChange={(e) => setPromptDraft(e.target.value)}
                      placeholder="또는 영문 프롬프트로 UI 목업 생성 (예: A dark sci-fi game HUD…)"
                      rows={2}
                      spellCheck={false}
                    />
                    <button
                      className="btn primary"
                      onClick={(e) => { e.stopPropagation(); generate(promptDraft || data.imagePrompt); }}
                      disabled={generating || !((promptDraft || data.imagePrompt || '').trim())}
                    >🍌 AI 생성</button>
                  </div>
                </div>
              </>
            )}
            {/* 콜아웃 넘버링 배지 오버레이 */}
            {!generating && callouts.map((c, i) => (
              <div
                key={i}
                className="ui-callout-badge"
                style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%` }}
                title={c.name}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        <div className="ui-callouts">
          {callouts.map((c, i) => (
            <div className="ui-callout" key={i}>
              <div className="num">{i + 1}</div>
              <div className="text" style={{ flex: 1 }}>
                <Editable tag="div" className="name" value={c.name} onChange={(v) => updateCallout(i, 'name', v)} markdown />
                <Editable tag="div" className="desc" value={c.desc} onChange={(v) => updateCallout(i, 'desc', v)} multiline markdown />
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 11. Resources ------
 * category 구조:
 *   { name, count, guideline?, items: [{ name, spec?, example? } | "string"] }
 * 하위호환: items 가 문자열 배열이어도 그대로 표시.
 */
function ResourcesSlide({ data, patch, page, totalPages }) {
  const updateCat = (i, key, val) => {
    const cats = [...(data.categories || [])];
    cats[i] = { ...cats[i], [key]: val };
    patch({ categories: cats });
  };
  const updateItem = (ci, ii, key, val) => {
    const cats = [...(data.categories || [])];
    const items = [...(cats[ci].items || [])];
    const cur = items[ii];
    if (typeof cur === 'string') {
      // 문자열 → 객체로 마이그레이션
      items[ii] = { name: cur, spec: '', example: '' };
    } else {
      items[ii] = { ...(cur || {}), [key]: val };
    }
    if (key === 'name' || key === 'spec' || key === 'example') {
      items[ii] = { ...items[ii], [key]: val };
    }
    cats[ci] = { ...cats[ci], items };
    patch({ categories: cats });
  };
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="resources-grid">
        {(data.categories || []).map((c, i) => (
          <div className="resource-cat" key={i}>
            <div className="cat-head">
              <Editable className="cat-name" value={c.name} onChange={(v) => updateCat(i, 'name', v)} />
              <Editable className="cat-count" value={c.count} onChange={(v) => updateCat(i, 'count', v)} />
            </div>
            {/* 카테고리별 가이드라인 — 해상도·포맷·네이밍 규칙·톤앤매너 */}
            <Editable
              tag="div"
              className="cat-guideline"
              value={c.guideline}
              onChange={(v) => updateCat(i, 'guideline', v)}
              multiline
              markdown
              placeholder="가이드라인 (해상도·포맷·네이밍·톤앤매너 등) — 마크다운 지원"
            />
            <ul className="resource-items">
              {(c.items || []).map((it, ii) => {
                const obj = typeof it === 'string' ? { name: it, spec: '', example: '' } : (it || {});
                return (
                  <li key={ii} className="resource-item">
                    <Editable tag="div" className="ri-name"
                      value={obj.name}
                      onChange={(v) => updateItem(i, ii, 'name', v)}
                      multiline markdown
                      placeholder="에셋 이름" />
                    {(obj.spec || obj.spec === '') && (
                      <Editable tag="div" className="ri-spec"
                        value={obj.spec}
                        onChange={(v) => updateItem(i, ii, 'spec', v)}
                        multiline markdown
                        placeholder="사양 (해상도·tris·포맷·길이 등)" />
                    )}
                    {(obj.example || obj.example === '') && (
                      <Editable tag="div" className="ri-example"
                        value={obj.example}
                        onChange={(v) => updateItem(i, ii, 'example', v)}
                        multiline markdown
                        placeholder="예시 / 참고 (파일명·레퍼런스 링크 등)" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ====== Phase 1 신규 슬라이드 — 개발 가능 수준 보장용 ====== */

/* ------ 12. Balance Table (수치 밸런싱 + 공식) ------ */
function BalanceTableSlide({ data, patch, page, totalPages }) {
  const vars = data.vars || [];
  const updateVar = (i, key, v) => {
    const next = [...vars];
    next[i] = { ...next[i], [key]: v };
    patch({ vars: next });
  };
  const addVar = () => patch({ vars: [...vars, { name: '새 변수', formula: '', range: '', defaultValue: '', sensitivity: '', notes: '' }] });
  const removeVar = (i) => patch({ vars: vars.filter((_, j) => j !== i) });
  // 미니 라인 차트 — curve.x, curve.y 가 있을 때만
  const curve = data.curve;
  const renderCurve = () => {
    if (!curve || !Array.isArray(curve.x) || !Array.isArray(curve.y) || curve.x.length < 2) return null;
    const xs = curve.x, ys = curve.y;
    const w = 1080, h = 140, padX = 36, padY = 12;
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const yMin = Math.min(...ys), yMax = Math.max(...ys);
    const xRange = (xMax - xMin) || 1;
    const yRange = (yMax - yMin) || 1;
    const pts = xs.map((x, i) => {
      const px = padX + ((x - xMin) / xRange) * (w - padX * 2);
      const py = h - padY - ((ys[i] - yMin) / yRange) * (h - padY * 2);
      return `${px},${py}`;
    }).join(' ');
    return (
      <div className="balance-curve">
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <polyline points={pts} fill="none" stroke="var(--accent, #4cc2ff)" strokeWidth="2" />
          {xs.map((x, i) => {
            const px = padX + ((x - xMin) / xRange) * (w - padX * 2);
            const py = h - padY - ((ys[i] - yMin) / yRange) * (h - padY * 2);
            return <circle key={i} cx={px} cy={py} r="3" fill="var(--accent, #4cc2ff)" />;
          })}
        </svg>
        <div className="curve-axes">
          <span className="x-label">{curve.xLabel || 'x'}</span>
          <span className="y-label">{curve.yLabel || 'y'}</span>
        </div>
      </div>
    );
  };
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      {(data.formula || data.formula === '') && (
        <Editable tag="div" className="balance-formula"
          value={data.formula}
          onChange={(v) => patch({ formula: v })}
          markdown multiline
          placeholder="핵심 공식 (예: `dmg = base × (1 + str/100) × elem_mod`)" />
      )}
      <div className="data-wrap" style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <table className="balance-table">
          <thead>
            <tr>
              <th style={{ width: '18%' }}>변수</th>
              <th style={{ width: '26%' }}>공식 / 정의</th>
              <th style={{ width: '14%' }}>범위</th>
              <th style={{ width: '12%' }}>기본값</th>
              <th>민감도 / 메모</th>
              <th style={{ width: '4%' }}></th>
            </tr>
          </thead>
          <tbody>
            {vars.map((v, i) => (
              <tr key={i}>
                <td className="tag"><Editable tag="div" value={v.name} onChange={(val) => updateVar(i, 'name', val)} multiline markdown /></td>
                <td><Editable tag="div" value={v.formula} onChange={(val) => updateVar(i, 'formula', val)} multiline markdown /></td>
                <td><Editable tag="div" value={v.range} onChange={(val) => updateVar(i, 'range', val)} multiline markdown placeholder="0~100" /></td>
                <td><Editable tag="div" value={v.defaultValue} onChange={(val) => updateVar(i, 'defaultValue', val)} multiline markdown /></td>
                <td><Editable tag="div" value={v.sensitivity || v.notes} onChange={(val) => updateVar(i, 'sensitivity', val)} multiline markdown placeholder="±10% 변경 시 영향" /></td>
                <td><button className="sc-del" onClick={() => removeVar(i)} title="삭제">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="sc-add" onClick={addVar} style={{ marginTop: 8 }}>+ 변수 추가</button>
        {renderCurve()}
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 13. State Machine (상태 + 전이 매트릭스) ------ */
function StateMachineSlide({ data, patch, page, totalPages }) {
  const states = data.states || [];
  const transitions = data.transitions || [];
  const updateState = (i, key, v) => {
    const next = [...states];
    next[i] = { ...next[i], [key]: v };
    patch({ states: next });
  };
  const updateTrans = (i, key, v) => {
    const next = [...transitions];
    next[i] = { ...next[i], [key]: v };
    patch({ transitions: next });
  };
  const updateInvariant = (si, ii, v) => {
    const next = [...states];
    const inv = [...(next[si].invariants || [])];
    inv[ii] = v;
    next[si] = { ...next[si], invariants: inv };
    patch({ states: next });
  };
  const addState = () => patch({ states: [...states, { id: 's' + (states.length + 1), name: 'STATE', kind: 'normal', onEnter: '', onExit: '', invariants: [] }] });
  const addInvariant = (si) => {
    const next = [...states];
    next[si] = { ...next[si], invariants: [...(next[si].invariants || []), '불변 조건'] };
    patch({ states: next });
  };
  const addTrans = () => patch({ transitions: [...transitions, { from: states[0]?.id || '', to: states[0]?.id || '', event: 'EVENT', guard: '', action: '' }] });
  const removeState = (i) => patch({ states: states.filter((_, j) => j !== i) });
  const removeTrans = (i) => patch({ transitions: transitions.filter((_, j) => j !== i) });
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="state-machine-wrap" style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', gap: 16 }}>
        <div className="sm-states-col">
          <div className="sm-section-head">STATES <button className="sc-add inline" onClick={addState}>+</button></div>
          {states.map((s, i) => (
            <div className={'sm-state sm-kind-' + (s.kind || 'normal')} key={i}>
              <div className="sm-state-head">
                <Editable tag="span" className="sm-state-id" value={s.id} onChange={(v) => updateState(i, 'id', v)} placeholder="id" />
                <Editable tag="span" className="sm-state-name" value={s.name} onChange={(v) => updateState(i, 'name', v)} placeholder="STATE_NAME" />
                <select value={s.kind || 'normal'} onChange={(e) => updateState(i, 'kind', e.target.value)}>
                  <option value="initial">initial</option>
                  <option value="normal">normal</option>
                  <option value="final">final</option>
                  <option value="error">error</option>
                </select>
                <button className="sc-del" onClick={() => removeState(i)} title="삭제">✕</button>
              </div>
              <div className="sm-state-body">
                <label>onEnter</label>
                <Editable tag="div" className="sm-action" value={s.onEnter} onChange={(v) => updateState(i, 'onEnter', v)} multiline markdown placeholder="진입 시 동작 — `disableInput()`, `playEnterAnim()`" />
                <label>onExit</label>
                <Editable tag="div" className="sm-action" value={s.onExit} onChange={(v) => updateState(i, 'onExit', v)} multiline markdown placeholder="이탈 시 동작" />
                <label>invariants</label>
                <ul className="sm-invariants">
                  {(s.invariants || []).map((inv, ii) => (
                    <li key={ii}><Editable tag="div" value={inv} onChange={(v) => updateInvariant(i, ii, v)} multiline markdown placeholder="`input_locked == true`" /></li>
                  ))}
                  <button className="sc-add inline" onClick={() => addInvariant(i)}>+ 불변 조건</button>
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="sm-trans-col">
          <div className="sm-section-head">TRANSITIONS <button className="sc-add inline" onClick={addTrans}>+</button></div>
          <table className="sm-trans-table">
            <thead><tr><th>from</th><th>event</th><th>guard</th><th>to</th><th>action</th><th></th></tr></thead>
            <tbody>
              {transitions.map((t, i) => (
                <tr key={i}>
                  <td>
                    <select value={t.from} onChange={(e) => updateTrans(i, 'from', e.target.value)}>
                      <option value="">-</option>
                      {states.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                    </select>
                  </td>
                  <td><Editable tag="div" value={t.event} onChange={(v) => updateTrans(i, 'event', v)} markdown placeholder="EVENT" /></td>
                  <td><Editable tag="div" value={t.guard} onChange={(v) => updateTrans(i, 'guard', v)} markdown placeholder="`hp > 0`" /></td>
                  <td>
                    <select value={t.to} onChange={(e) => updateTrans(i, 'to', e.target.value)}>
                      <option value="">-</option>
                      {states.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                    </select>
                  </td>
                  <td><Editable tag="div" value={t.action} onChange={(v) => updateTrans(i, 'action', v)} markdown multiline placeholder="동작" /></td>
                  <td><button className="sc-del" onClick={() => removeTrans(i)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 14. API Contract (엔드포인트 + 스키마 + 에러) ------ */
function ApiContractSlide({ data, patch, page, totalPages }) {
  const errors = data.errors || [];
  const updateError = (i, key, v) => {
    const next = [...errors];
    next[i] = { ...next[i], [key]: v };
    patch({ errors: next });
  };
  const addError = () => patch({ errors: [...errors, { code: '400', message: '에러 메시지', when: '발생 조건' }] });
  const removeError = (i) => patch({ errors: errors.filter((_, j) => j !== i) });
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="api-contract-head">
        <select className="api-method" value={data.method || 'POST'} onChange={(e) => patch({ method: e.target.value })}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
        <Editable tag="div" className="api-endpoint" value={data.endpoint} onChange={(v) => patch({ endpoint: v })} placeholder="/api/match/create" />
        <select className="api-auth" value={data.auth || 'bearer'} onChange={(e) => patch({ auth: e.target.value })}>
          <option value="none">no auth</option>
          <option value="bearer">Bearer</option>
          <option value="session">Session</option>
          <option value="signature">HMAC sig</option>
        </select>
        <Editable tag="div" className="api-sla" value={String(data.slaMs || '')} onChange={(v) => patch({ slaMs: parseInt(v, 10) || 200 })} placeholder="200ms" />
      </div>
      <div className="data-wrap" style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="api-pane">
          <div className="api-pane-label">REQUEST 스키마</div>
          <Editable tag="pre" className="api-schema" value={data.request} onChange={(v) => patch({ request: v })} multiline placeholder='{"matchId":"uuid","userId":"uuid","mode":"casual|ranked"}' />
        </div>
        <div className="api-pane">
          <div className="api-pane-label">RESPONSE 스키마</div>
          <Editable tag="pre" className="api-schema" value={data.response} onChange={(v) => patch({ response: v })} multiline placeholder='{"sessionId":"uuid","gameServer":"host:port","token":"jwt"}' />
        </div>
        <div className="api-pane" style={{ gridColumn: '1 / -1' }}>
          <div className="api-pane-label">ERRORS <button className="sc-add inline" onClick={addError}>+</button></div>
          <table className="api-errors-table">
            <thead><tr><th style={{ width: '14%' }}>code</th><th style={{ width: '28%' }}>message</th><th>when</th><th style={{ width: '4%' }}></th></tr></thead>
            <tbody>
              {errors.map((e, i) => (
                <tr key={i}>
                  <td className="tag"><Editable tag="div" value={e.code} onChange={(v) => updateError(i, 'code', v)} /></td>
                  <td><Editable tag="div" value={e.message} onChange={(v) => updateError(i, 'message', v)} multiline markdown /></td>
                  <td><Editable tag="div" value={e.when} onChange={(v) => updateError(i, 'when', v)} multiline markdown /></td>
                  <td><button className="sc-del" onClick={() => removeError(i)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(data.idempotencyKey || data.notes) && (
          <div className="api-pane" style={{ gridColumn: '1 / -1' }}>
            <div className="api-pane-label">메모</div>
            <Editable tag="div" className="api-notes" value={data.idempotencyKey} onChange={(v) => patch({ idempotencyKey: v })} markdown multiline placeholder="idempotency key 정책 — `X-Idempotency-Key` 헤더, 24h TTL 등" />
            <Editable tag="div" className="api-notes" value={data.notes} onChange={(v) => patch({ notes: v })} markdown multiline placeholder="기타 메모" />
          </div>
        )}
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 15. Acceptance Criteria (Given/When/Then + edge cases) ------ */
function AcceptanceCriteriaSlide({ data, patch, page, totalPages }) {
  const criteria = data.criteria || [];
  const story = data.userStory || { as: '', want: '', soThat: '' };
  const updateStory = (key, v) => patch({ userStory: { ...story, [key]: v } });
  const updateCriterion = (i, key, v) => {
    const next = [...criteria];
    next[i] = { ...next[i], [key]: v };
    patch({ criteria: next });
  };
  const updateEdge = (ci, ei, v) => {
    const next = [...criteria];
    const edges = [...(next[ci].edgeCases || [])];
    edges[ei] = v;
    next[ci] = { ...next[ci], edgeCases: edges };
    patch({ criteria: next });
  };
  const addCriterion = () => patch({ criteria: [...criteria, { id: `AC-${criteria.length + 1}`, given: '', when: '', then: '', edgeCases: [] }] });
  const addEdge = (ci) => {
    const next = [...criteria];
    next[ci] = { ...next[ci], edgeCases: [...(next[ci].edgeCases || []), '엣지 케이스'] };
    patch({ criteria: next });
  };
  const removeCriterion = (i) => patch({ criteria: criteria.filter((_, j) => j !== i) });
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="ac-story">
        <span className="ac-label">AS A</span>
        <Editable tag="div" className="ac-story-field" value={story.as} onChange={(v) => updateStory('as', v)} markdown placeholder="신규 유저" />
        <span className="ac-label">I WANT</span>
        <Editable tag="div" className="ac-story-field" value={story.want} onChange={(v) => updateStory('want', v)} markdown placeholder="첫 매치를 빠르게 시작하길" />
        <span className="ac-label">SO THAT</span>
        <Editable tag="div" className="ac-story-field" value={story.soThat} onChange={(v) => updateStory('soThat', v)} markdown placeholder="D1 리텐션이 60%↑ 유지된다" />
      </div>
      <div className="ac-list" style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {criteria.map((c, i) => (
          <div className="ac-card" key={i}>
            <div className="ac-card-head">
              <Editable tag="span" className="ac-id" value={c.id} onChange={(v) => updateCriterion(i, 'id', v)} />
              <button className="sc-del" onClick={() => removeCriterion(i)}>✕</button>
            </div>
            <div className="ac-gwt">
              <div className="ac-row"><span className="kw given">GIVEN</span><Editable tag="div" className="ac-text" value={c.given} onChange={(v) => updateCriterion(i, 'given', v)} markdown multiline placeholder="유저가 로그인 직후 메인 로비에 있다" /></div>
              <div className="ac-row"><span className="kw when">WHEN</span><Editable tag="div" className="ac-text" value={c.when} onChange={(v) => updateCriterion(i, 'when', v)} markdown multiline placeholder="`매칭` 버튼을 탭한다" /></div>
              <div className="ac-row"><span className="kw then">THEN</span><Editable tag="div" className="ac-text" value={c.then} onChange={(v) => updateCriterion(i, 'then', v)} markdown multiline placeholder="3초 이내에 매칭 진행 모달이 표시된다" /></div>
            </div>
            <div className="ac-edges">
              <div className="ac-edges-label">엣지 케이스</div>
              <ul>
                {(c.edgeCases || []).map((e, ei) => (
                  <li key={ei}><Editable tag="div" value={e} onChange={(v) => updateEdge(i, ei, v)} markdown multiline /></li>
                ))}
                <button className="sc-add inline" onClick={() => addEdge(i)}>+</button>
              </ul>
            </div>
          </div>
        ))}
        <button className="sc-add" onClick={addCriterion} style={{ marginTop: 8 }}>+ 수락 기준 추가</button>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 16. Telemetry (이벤트 카탈로그 + 펀넬) ------ */
function TelemetrySlide({ data, patch, page, totalPages }) {
  const events = data.events || [];
  const funnels = data.funnels || [];
  const updateEvent = (i, key, v) => {
    const next = [...events];
    next[i] = { ...next[i], [key]: v };
    patch({ events: next });
  };
  const updateProp = (ei, pi, key, v) => {
    const next = [...events];
    const props = [...(next[ei].props || [])];
    props[pi] = { ...props[pi], [key]: v };
    next[ei] = { ...next[ei], props };
    patch({ events: next });
  };
  const addEvent = () => patch({ events: [...events, { name: 'new_event', when: '', props: [], kpi: '' }] });
  const addProp = (ei) => {
    const next = [...events];
    next[ei] = { ...next[ei], props: [...(next[ei].props || []), { key: 'prop_key', type: 'string', required: true, note: '' }] };
    patch({ events: next });
  };
  const removeEvent = (i) => patch({ events: events.filter((_, j) => j !== i) });
  const removeProp = (ei, pi) => {
    const next = [...events];
    next[ei] = { ...next[ei], props: (next[ei].props || []).filter((_, j) => j !== pi) };
    patch({ events: next });
  };
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="data-wrap" style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {events.map((e, ei) => (
          <div className="telemetry-event" key={ei}>
            <div className="te-head">
              <Editable tag="span" className="te-name" value={e.name} onChange={(v) => updateEvent(ei, 'name', v)} placeholder="event_name" />
              <Editable tag="span" className="te-kpi" value={e.kpi} onChange={(v) => updateEvent(ei, 'kpi', v)} markdown placeholder="KPI: D1 retention" />
              <button className="sc-del" onClick={() => removeEvent(ei)}>✕</button>
            </div>
            <Editable tag="div" className="te-when" value={e.when} onChange={(v) => updateEvent(ei, 'when', v)} markdown multiline placeholder="발생 시점 — `매칭 시작 버튼 탭` 또는 `세션 생성 완료`" />
            <table className="te-props">
              <thead><tr><th>key</th><th>type</th><th>req</th><th>설명</th><th></th></tr></thead>
              <tbody>
                {(e.props || []).map((p, pi) => (
                  <tr key={pi}>
                    <td className="tag"><Editable tag="div" value={p.key} onChange={(v) => updateProp(ei, pi, 'key', v)} /></td>
                    <td>
                      <select value={p.type || 'string'} onChange={(ev) => updateProp(ei, pi, 'type', ev.target.value)}>
                        <option value="string">string</option>
                        <option value="number">number</option>
                        <option value="boolean">boolean</option>
                        <option value="enum">enum</option>
                        <option value="uuid">uuid</option>
                        <option value="datetime">datetime</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input type="checkbox" checked={!!p.required} onChange={(ev) => updateProp(ei, pi, 'required', ev.target.checked)} />
                    </td>
                    <td><Editable tag="div" value={p.note} onChange={(v) => updateProp(ei, pi, 'note', v)} markdown multiline /></td>
                    <td><button className="sc-del" onClick={() => removeProp(ei, pi)}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="sc-add inline" onClick={() => addProp(ei)}>+ prop</button>
          </div>
        ))}
        <button className="sc-add" onClick={addEvent} style={{ marginTop: 8 }}>+ 이벤트 추가</button>
        {funnels.length > 0 && (
          <div className="telemetry-funnels">
            <div className="te-section-label">FUNNELS</div>
            {funnels.map((f, fi) => (
              <div className="te-funnel" key={fi}>
                <Editable tag="div" className="te-funnel-name" value={f.name} onChange={(v) => {
                  const next = [...funnels]; next[fi] = { ...next[fi], name: v }; patch({ funnels: next });
                }} placeholder="펀넬명" />
                <div className="te-funnel-steps">
                  {(f.steps || []).map((s, si) => (
                    <span key={si} className="te-funnel-step">
                      {s}{si < (f.steps || []).length - 1 ? ' → ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 17. Risk Register (위험 × 영향 × 빈도) ------ */
function RiskRegisterSlide({ data, patch, page, totalPages }) {
  const risks = data.risks || [];
  const updateRisk = (i, key, v) => {
    const next = [...risks];
    next[i] = { ...next[i], [key]: v };
    patch({ risks: next });
  };
  const addRisk = () => patch({ risks: [...risks, { id: `R-${risks.length + 1}`, title: '새 위험', impact: 3, likelihood: 3, mitigation: '', owner: '', status: 'open' }] });
  const removeRisk = (i) => patch({ risks: risks.filter((_, j) => j !== i) });
  const score = (r) => (r.impact || 0) * (r.likelihood || 0);
  const sorted = [...risks].sort((a, b) => score(b) - score(a));
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="risk-wrap" style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>
        <div className="risk-heatmap">
          <div className="rh-label">HEAT MAP</div>
          <div className="rh-grid">
            {[5, 4, 3, 2, 1].map(impact => (
              <React.Fragment key={impact}>
                <div className="rh-axis-y">{impact}</div>
                {[1, 2, 3, 4, 5].map(likelihood => {
                  const inCell = risks.filter(r => r.impact === impact && r.likelihood === likelihood);
                  const score = impact * likelihood;
                  const cls = score >= 16 ? 'critical' : score >= 9 ? 'high' : score >= 4 ? 'medium' : 'low';
                  return (
                    <div key={`${impact}-${likelihood}`} className={'rh-cell ' + cls} title={`I${impact} × L${likelihood} = ${score}`}>
                      {inCell.length > 0 && <span className="rh-count">{inCell.length}</span>}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
            <div className="rh-axis-y"></div>
            {[1, 2, 3, 4, 5].map(l => <div key={l} className="rh-axis-x">{l}</div>)}
          </div>
          <div className="rh-legend">
            <span>Impact ↑</span><span>Likelihood →</span>
          </div>
        </div>
        <div className="risk-list">
          <table className="risk-table">
            <thead><tr><th style={{ width: '10%' }}>ID</th><th>위험</th><th style={{ width: '8%' }}>영향</th><th style={{ width: '8%' }}>빈도</th><th style={{ width: '8%' }}>점수</th><th>완화책</th><th style={{ width: '10%' }}>담당</th><th style={{ width: '10%' }}>상태</th><th style={{ width: '4%' }}></th></tr></thead>
            <tbody>
              {sorted.map((r, i) => {
                const idx = risks.indexOf(r);
                const s = score(r);
                const sevCls = s >= 16 ? 'critical' : s >= 9 ? 'high' : s >= 4 ? 'medium' : 'low';
                return (
                  <tr key={i} className={'risk-row sev-' + sevCls}>
                    <td className="tag"><Editable tag="div" value={r.id} onChange={(v) => updateRisk(idx, 'id', v)} /></td>
                    <td><Editable tag="div" value={r.title} onChange={(v) => updateRisk(idx, 'title', v)} markdown multiline /></td>
                    <td><select value={r.impact || 3} onChange={(e) => updateRisk(idx, 'impact', parseInt(e.target.value, 10))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select></td>
                    <td><select value={r.likelihood || 3} onChange={(e) => updateRisk(idx, 'likelihood', parseInt(e.target.value, 10))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select></td>
                    <td className={'risk-score ' + sevCls}>{s}</td>
                    <td><Editable tag="div" value={r.mitigation} onChange={(v) => updateRisk(idx, 'mitigation', v)} markdown multiline placeholder="완화 방안" /></td>
                    <td><Editable tag="div" value={r.owner} onChange={(v) => updateRisk(idx, 'owner', v)} placeholder="담당자" /></td>
                    <td>
                      <select value={r.status || 'open'} onChange={(e) => updateRisk(idx, 'status', e.target.value)}>
                        <option value="open">open</option>
                        <option value="mitigated">mitigated</option>
                        <option value="accepted">accepted</option>
                        <option value="closed">closed</option>
                      </select>
                    </td>
                    <td><button className="sc-del" onClick={() => removeRisk(idx)}>✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button className="sc-add" onClick={addRisk} style={{ marginTop: 8 }}>+ 위험 추가</button>
        </div>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 18. Roadmap (마일스톤 간트) ------ */
function RoadmapSlide({ data, patch, page, totalPages }) {
  const phases = data.phases || [];
  const updatePhase = (i, key, v) => {
    const next = [...phases];
    next[i] = { ...next[i], [key]: v };
    patch({ phases: next });
  };
  const updateDeliverable = (pi, di, v) => {
    const next = [...phases];
    const d = [...(next[pi].deliverables || [])];
    d[di] = v;
    next[pi] = { ...next[pi], deliverables: d };
    patch({ phases: next });
  };
  const addPhase = () => patch({ phases: [...phases, { name: `Phase ${phases.length + 1}`, start: '2026.01', end: '2026.03', deliverables: [], dependsOn: [] }] });
  const addDeliverable = (pi) => {
    const next = [...phases];
    next[pi] = { ...next[pi], deliverables: [...(next[pi].deliverables || []), '산출물'] };
    patch({ phases: next });
  };
  const removePhase = (i) => patch({ phases: phases.filter((_, j) => j !== i) });
  // 간트 — 모든 phase 의 start/end 를 YYYY.MM 으로 가정. 가장 빠른 start 와 가장 늦은 end 로 정규화.
  const toMonth = (s) => {
    if (!s) return 0;
    const m = /(\d{4})\D+(\d{1,2})/.exec(String(s));
    if (m) return parseInt(m[1], 10) * 12 + parseInt(m[2], 10);
    return 0;
  };
  const allMonths = phases.flatMap(p => [toMonth(p.start), toMonth(p.end)]).filter(n => n > 0);
  const minM = allMonths.length ? Math.min(...allMonths) : 0;
  const maxM = allMonths.length ? Math.max(...allMonths) : 0;
  const range = maxM - minM || 1;
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="roadmap-wrap" style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {phases.length > 0 && (
          <div className="roadmap-gantt">
            {phases.map((p, i) => {
              const start = toMonth(p.start), end = toMonth(p.end);
              const left = ((start - minM) / range) * 100;
              const width = Math.max(4, ((end - start) / range) * 100);
              return (
                <div className="rm-row" key={i}>
                  <div className="rm-row-label">{p.name}</div>
                  <div className="rm-row-track">
                    <div className="rm-row-bar" style={{ left: `${left}%`, width: `${width}%` }}>
                      <span className="rm-bar-text">{p.start} – {p.end}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="roadmap-phases">
          {phases.map((p, i) => (
            <div className="rm-phase" key={i}>
              <div className="rm-phase-head">
                <Editable tag="span" className="rm-phase-name" value={p.name} onChange={(v) => updatePhase(i, 'name', v)} />
                <Editable tag="span" className="rm-phase-date" value={p.start} onChange={(v) => updatePhase(i, 'start', v)} placeholder="2026.01" />
                <span style={{ color: 'var(--text-3, #7d8590)' }}>→</span>
                <Editable tag="span" className="rm-phase-date" value={p.end} onChange={(v) => updatePhase(i, 'end', v)} placeholder="2026.03" />
                <button className="sc-del" onClick={() => removePhase(i)}>✕</button>
              </div>
              <ul className="rm-deliverables">
                {(p.deliverables || []).map((d, di) => (
                  <li key={di}><Editable tag="div" value={d} onChange={(v) => updateDeliverable(i, di, v)} markdown multiline placeholder="산출물 (예: MVP 빌드, 알파 데모)" /></li>
                ))}
                <button className="sc-add inline" onClick={() => addDeliverable(i)}>+ 산출물</button>
              </ul>
            </div>
          ))}
          <button className="sc-add" onClick={addPhase} style={{ marginTop: 8 }}>+ Phase 추가</button>
        </div>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ Type registry ------ */
const SLIDE_RENDERERS = {
  'cover': CoverSlide,
  'history': HistorySlide,
  'toc': TocSlide,
  'section-divider': SectionDividerSlide,
  'image-embed': ImageEmbedSlide,
  'intent': IntentSlide,
  'terms': TermsSlide,
  'rules': RulesSlide,
  'data-table': DataTableSlide,
  'flow': FlowSlide,
  'ui-design': UiDesignSlide,
  'resources': ResourcesSlide,
  // Phase 1 신규 7종 (engineer-ready)
  'balance-table': BalanceTableSlide,
  'state-machine': StateMachineSlide,
  'api-contract': ApiContractSlide,
  'acceptance-criteria': AcceptanceCriteriaSlide,
  'telemetry': TelemetrySlide,
  'risk-register': RiskRegisterSlide,
  'roadmap': RoadmapSlide,
};

const SLIDE_LABELS = {
  'cover': '표지',
  'history': '문서 이력',
  'toc': '목차',
  'section-divider': '섹션 구분',
  'image-embed': '참고 이미지',
  'intent': '기획 의도',
  'terms': '용어 정의',
  'rules': '규칙',
  'data-table': '데이터 테이블',
  'flow': '플로우 차트',
  'ui-design': 'UI/UX',
  'resources': '필요 리소스',
  'diagram': '다이어그램',
  'sequence-diagram': '시퀀스 다이어그램',
  'class-diagram': '클래스 다이어그램',
  // Phase 1 신규 7종
  'balance-table': '수치 밸런싱',
  'state-machine': '상태 머신',
  'api-contract': 'API 계약',
  'acceptance-criteria': '수락 기준',
  'telemetry': '텔레메트리',
  'risk-register': '위험 등기부',
  'roadmap': '로드맵',
};

function SlideRenderer({ slide, patch, replace, page, totalPages }) {
  const R = SLIDE_RENDERERS[slide.type] || (() => <div className="slide"><div>Unknown type: {slide.type}</div></div>);
  return <R data={slide.data || {}} patch={patch} replace={replace} page={page} totalPages={totalPages} />;
}

Object.assign(window, {
  SlideRenderer, SLIDE_RENDERERS, SLIDE_LABELS,
  Editable, SlideFooter, TopTag,
  ImageEmbedSlide,
});
