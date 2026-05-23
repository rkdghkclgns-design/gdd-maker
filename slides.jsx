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

/* ------ 4b. Image embed (참고 이미지) ------ */
function ImageEmbedSlide({ data, patch, page, totalPages }) {
  const fileRef = React.useRef(null);
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
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <Editable tag="div" className="image-embed-caption" value={data.caption} onChange={(v) => patch({ caption: v })} multiline placeholder="이미지가 보여주는 핵심 시각 요소·참조 의도를 한 줄로" />
      <div className="image-embed-wrap"
           onDragOver={(e) => e.preventDefault()}
           onDrop={onDrop}
           onClick={() => !data.imageSrc && fileRef.current?.click()}>
        <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={onPick} />
        {data.imageSrc ? (
          <>
            <img src={data.imageSrc} alt="reference" />
            <button className="image-embed-replace" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }} title="이미지 교체">↻ 교체</button>
          </>
        ) : (
          <div className="empty">
            <div className="lbl">REFERENCE IMAGE</div>
            <div className="desc">클릭 또는 드래그하여 이미지 첨부<br />또는 AI 프롬프트로 자동 생성</div>
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
  const updateCallout = (i, key, val) => {
    const cs = [...(data.callouts || [])];
    cs[i] = { ...cs[i], [key]: val };
    patch({ callouts: cs });
  };

  /** 자동 배치 폴백: callout에 x/y가 없을 때 균등 배치(가장자리 우선).
   *  배지가 28px + 2px 흰 테두리 + translate(-50%, -50%) 이므로 절반(~16px)이
   *  컨테이너 밖으로 나가지 않도록 safe area [4, 96] 으로 clamp. */
  const callouts = data.callouts || [];
  const positions = callouts.map((c, i) => {
    if (typeof c.x === 'number' && typeof c.y === 'number') {
      return { x: Math.max(4, Math.min(96, c.x)), y: Math.max(4, Math.min(96, c.y)) };
    }
    // 가장자리 시계방향 자동 배치
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
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="ui-design-wrap">
        <div className="ui-mockup">
          <div className="mock-bar"><span></span><span></span><span></span></div>
          <div className="mock-canvas">
            {data.imageSrc ? (
              <img src={data.imageSrc} alt="UI mockup" className="ui-mockup-img" />
            ) : (
              <>
                <div className="ui-mockup-grid"></div>
                <div className="placeholder">
                  <div className="lbl">UI MOCKUP</div>
                  <div className="desc">화면 시안 placeholder<br />드래그하여 이미지 첨부</div>
                </div>
              </>
            )}
            {/* 콜아웃 넘버링 배지 오버레이 */}
            {callouts.map((c, i) => (
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
                <Editable tag="div" className="name" value={c.name} onChange={(v) => updateCallout(i, 'name', v)} />
                <Editable tag="div" className="desc" value={c.desc} onChange={(v) => updateCallout(i, 'desc', v)} multiline />
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
