/* === Document view (Word-style flow) + PPTX export === */

function DocumentView({ project, patchSlide, onPatchProject }) {
  if (!project) return null;
  const slides = project.slides || [];

  return (
    <div className="doc-view">
      <div className="doc-page">
        <Editable
          tag="h1" className="doc-h1"
          value={project.title}
          onChange={(v) => onPatchProject && onPatchProject({ title: v })}
        />
        <div className="doc-meta">
          {project.team} · {project.author} · {project.version} · {project.updatedAt}
        </div>

        {slides.map((s, i) => (
          <DocSection key={s.id} slide={s} index={i} patch={(u) => patchSlide(s.id, u)} />
        ))}
      </div>
    </div>
  );
}

function DocSection({ slide, index, patch }) {
  const d = slide.data || {};
  const sectionTag = (d.section ? d.section + ' · ' : '') + (d.sectionName || SLIDE_LABELS[slide.type] || '');

  const patchData = (u) => patch({ data: { ...d, ...u } });

  if (slide.type === 'cover') {
    return null; // cover shown via doc-h1 above
  }

  if (slide.type === 'history') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title || '문서 이력'}</h2>
        <table>
          <thead><tr><th>버전</th><th>변경일자</th><th>page</th><th>내용</th><th>작성자</th></tr></thead>
          <tbody>
            {(d.rows || []).map((r, i) => (
              <tr key={i}>
                <td><code style={{color:'var(--accent)'}}>{r.ver}</code></td>
                <td>{r.date}</td>
                <td>{r.page}</td>
                <td>{r.content}</td>
                <td>{r.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (slide.type === 'toc') {
    const hasParts = Array.isArray(d.parts) && d.parts.length > 0;
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.titleKo || '목차'}</h2>
        {hasParts ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px 40px' }}>
            {d.parts.map((p, i) => (
              <div key={i}>
                <div style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.2em', marginBottom: 4 }}>
                  PART · {String(i + 1).padStart(2, '0')} · {p.sub || ''}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{p.roman} · {p.label}</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {(p.entries || []).map((e, j) => (
                    <li key={j}><strong>{e.num}</strong> {e.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <ul>
            {(d.entries || []).map((e, i) => (
              <li key={i}><strong>{e.num}. {e.name}</strong> <span style={{color:'#7d8590'}}>— {e.sub}</span></li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (slide.type === 'section-divider') {
    return (
      <div className="doc-section" style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 22, borderTop: '3px solid var(--accent)', paddingTop: 16 }}>
          <span className="idx" style={{ fontSize: 18 }}>{d.num}</span>
          {d.title}{d.sub ? <span style={{ fontSize: 14, color: 'var(--accent)', marginLeft: 10, fontStyle: 'italic' }}>— {d.sub}</span> : null}
        </h2>
        <p style={{ color: '#7d8590', whiteSpace: 'pre-line' }}>{d.subtitle}</p>
      </div>
    );
  }

  if (slide.type === 'intent') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        <p>{d.tagline}</p>
        {(d.cards || []).map((c, i) => (
          <div key={i} style={{ margin: '10px 0', paddingLeft: 12, borderLeft: '2px solid var(--accent)' }}>
            <h3 style={{ margin: '0 0 4px' }}>{c.idx}. {c.head}</h3>
            <p style={{ margin: 0 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    );
  }

  if (slide.type === 'terms') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        <table>
          <thead><tr><th>용어</th><th>정의</th><th>비고</th></tr></thead>
          <tbody>{(d.rows || []).map((r, i) => <tr key={i}><td><strong>{r.term}</strong></td><td>{r.def}</td><td style={{color:'#7d8590'}}>{r.note}</td></tr>)}</tbody>
        </table>
      </div>
    );
  }

  if (slide.type === 'rules') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        {(d.blocks || []).map((b, i) => (
          <div key={i}>
            <h3>{b.head}</h3>
            <ul>{(b.items || []).map((it, ii) => <li key={ii}>{it}</li>)}</ul>
          </div>
        ))}
      </div>
    );
  }

  if (slide.type === 'data-table') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        <table>
          <thead><tr>{(d.columns || []).map((c, i) => <th key={i}>{c.label}</th>)}</tr></thead>
          <tbody>{(d.rows || []).map((r, i) => <tr key={i}>{(d.columns || []).map((c, ci) => <td key={ci}>{r[c.key]}</td>)}</tr>)}</tbody>
        </table>
      </div>
    );
  }

  if (slide.type === 'flow') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        <ol>{(d.nodes || []).map((n, i) => <li key={i}><strong>[{n.kind}]</strong> {n.label}</li>)}</ol>
      </div>
    );
  }

  if (slide.type === 'ui-design') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        <p style={{color:'#7d8590', fontStyle:'italic'}}>[UI 목업 placeholder]</p>
        <ol>{(d.callouts || []).map((c, i) => <li key={i}><strong>{c.name}</strong> — {c.desc}</li>)}</ol>
      </div>
    );
  }

  if (slide.type === 'image-embed') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        {d.caption && <p style={{ fontStyle: 'italic', color: 'var(--text-2)' }}>{d.caption}</p>}
        {d.imageSrc ? (
          <img src={d.imageSrc} alt={d.title || 'reference'} style={{ maxWidth: '100%', borderRadius: 8, display: 'block', margin: '12px 0' }} />
        ) : (
          <p style={{ color: '#7d8590', fontStyle: 'italic' }}>[참고 이미지 placeholder]</p>
        )}
        {d.imagePrompt && (
          <pre style={{ fontSize: 11, background: 'rgba(76,194,255,0.06)', padding: 8, borderLeft: '3px solid var(--accent)', borderRadius: 4, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{d.imagePrompt}</pre>
        )}
      </div>
    );
  }

  if (slide.type === 'diagram' || slide.type === 'sequence-diagram' || slide.type === 'class-diagram') {
    const nodeKey = slide.type === 'sequence-diagram' ? 'participants' : (slide.type === 'class-diagram' ? 'classes' : 'nodes');
    const items = d[nodeKey] || d.nodes || [];
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        {items.length > 0 && (
          <ul>{items.map((n, i) => (
            <li key={i}>
              <strong>{n.label || n.name || n.id}</strong>
              {n.sub ? <span style={{ color: '#7d8590', marginLeft: 6 }}>{n.sub}</span> : null}
              {n.kind ? <code style={{ marginLeft: 6, color: 'var(--accent)' }}>[{n.kind}]</code> : null}
            </li>
          ))}</ul>
        )}
        {Array.isArray(d.messages) && d.messages.length > 0 && (
          <>
            <h3>메시지</h3>
            <ol>{d.messages.map((m, i) => (
              <li key={i}><code>{m.from} → {m.to}</code>: {m.label}</li>
            ))}</ol>
          </>
        )}
        {Array.isArray(d.relations) && d.relations.length > 0 && (
          <>
            <h3>관계</h3>
            <ol>{d.relations.map((r, i) => (
              <li key={i}><code>{r.from} {r.type || '→'} {r.to}</code>{r.label ? ' : ' + r.label : ''}</li>
            ))}</ol>
          </>
        )}
      </div>
    );
  }

  if (slide.type === 'balance-table') {
    const vars = d.vars || [];
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        {d.formula && <p><code style={{ background: 'rgba(76,194,255,0.08)', padding: '2px 6px', borderRadius: 3 }}>{d.formula}</code></p>}
        {vars.length > 0 && (
          <table>
            <thead><tr><th>변수</th><th>기본값</th><th>최소~최대</th><th>설명</th></tr></thead>
            <tbody>{vars.map((v, i) => (
              <tr key={i}>
                <td><code>{v.name}</code></td>
                <td>{v.default ?? v.value ?? ''}</td>
                <td>{v.min != null && v.max != null ? `${v.min} ~ ${v.max}` : ''}</td>
                <td>{v.desc || v.description || ''}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {d.curve && <p style={{ color: '#7d8590', fontStyle: 'italic' }}>커브: {d.curve}</p>}
      </div>
    );
  }

  if (slide.type === 'state-machine') {
    const states = d.states || [];
    const transitions = d.transitions || [];
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        {states.length > 0 && (
          <>
            <h3>상태</h3>
            <ul>{states.map((s, i) => (
              <li key={i}><strong>{s.id || s.name}</strong>{s.desc ? ' — ' + s.desc : ''}</li>
            ))}</ul>
          </>
        )}
        {transitions.length > 0 && (
          <>
            <h3>전이</h3>
            <ol>{transitions.map((t, i) => (
              <li key={i}><code>{t.from} → {t.to}</code>{t.on ? ` (on: ${t.on})` : ''}{t.guard ? ` [guard: ${t.guard}]` : ''}</li>
            ))}</ol>
          </>
        )}
      </div>
    );
  }

  if (slide.type === 'api-contract') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        <p>
          <code style={{ background: 'var(--accent)', color: '#061018', padding: '2px 8px', borderRadius: 3, fontWeight: 700 }}>
            {d.method || 'GET'}
          </code>
          <code style={{ marginLeft: 8 }}>{d.endpoint || ''}</code>
        </p>
        {d.auth && <p>인증: <code>{d.auth}</code></p>}
        {d.slaMs != null && <p>SLA: <code>{d.slaMs}ms</code></p>}
        {d.request && <><h3>Request</h3><pre style={{ background: '#f3f5f7', padding: 8, borderRadius: 4, overflowX: 'auto' }}>{d.request}</pre></>}
        {d.response && <><h3>Response</h3><pre style={{ background: '#f3f5f7', padding: 8, borderRadius: 4, overflowX: 'auto' }}>{d.response}</pre></>}
        {Array.isArray(d.errors) && d.errors.length > 0 && (
          <>
            <h3>에러</h3>
            <ul>{d.errors.map((e, i) => (
              <li key={i}><code>{e.code}</code> {e.desc || e.description || ''}</li>
            ))}</ul>
          </>
        )}
        {d.idempotencyKey && <p>Idempotency-Key: <code>{d.idempotencyKey}</code></p>}
        {d.notes && <p style={{ color: '#7d8590' }}>{d.notes}</p>}
      </div>
    );
  }

  if (slide.type === 'acceptance-criteria') {
    const criteria = d.criteria || [];
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        {d.userStory && (
          <blockquote style={{ borderLeft: '3px solid var(--accent)', paddingLeft: 12, color: 'var(--text-2)', fontStyle: 'italic' }}>
            {d.userStory}
          </blockquote>
        )}
        {criteria.map((c, i) => (
          <div key={i} style={{ margin: '10px 0', padding: '8px 12px', background: 'rgba(76,194,255,0.04)', borderLeft: '2px solid var(--accent)', borderRadius: 3 }}>
            <p style={{ margin: '0 0 4px', fontWeight: 700 }}>{i + 1}. {c.scenario || c.title || ''}</p>
            {c.given && <p style={{ margin: '2px 0' }}><strong>Given</strong> {c.given}</p>}
            {c.when && <p style={{ margin: '2px 0' }}><strong>When</strong> {c.when}</p>}
            {c.then && <p style={{ margin: '2px 0' }}><strong>Then</strong> {c.then}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (slide.type === 'telemetry') {
    const events = d.events || [];
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        {events.length > 0 && (
          <table>
            <thead><tr><th>이벤트</th><th>트리거</th><th>속성</th></tr></thead>
            <tbody>{events.map((e, i) => (
              <tr key={i}>
                <td><code>{e.name}</code></td>
                <td>{e.trigger || ''}</td>
                <td>{Array.isArray(e.properties) ? e.properties.join(', ') : (e.properties || '')}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {Array.isArray(d.funnels) && d.funnels.length > 0 && (
          <>
            <h3>퍼널</h3>
            <ol>{d.funnels.map((f, i) => (
              <li key={i}><strong>{f.name}</strong>{f.steps ? ` — ${(f.steps || []).join(' → ')}` : ''}</li>
            ))}</ol>
          </>
        )}
      </div>
    );
  }

  if (slide.type === 'risk-register') {
    const risks = d.risks || [];
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        <table>
          <thead><tr><th>위험</th><th>영향</th><th>발생률</th><th>완화</th></tr></thead>
          <tbody>{risks.map((r, i) => (
            <tr key={i}>
              <td><strong>{r.name || r.title}</strong>{r.desc ? <><br /><span style={{ color: '#7d8590', fontSize: 12 }}>{r.desc}</span></> : null}</td>
              <td>{r.impact || ''}</td>
              <td>{r.likelihood || r.probability || ''}</td>
              <td>{r.mitigation || ''}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    );
  }

  if (slide.type === 'roadmap') {
    const phases = d.phases || [];
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        {phases.map((p, i) => (
          <div key={i} style={{ margin: '12px 0', padding: '10px 14px', borderLeft: '3px solid var(--accent)', background: 'rgba(76,194,255,0.04)' }}>
            <h3 style={{ margin: '0 0 6px' }}>
              {p.name}
              <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
                {p.start || ''} ~ {p.end || ''}
              </span>
            </h3>
            {Array.isArray(p.deliverables) && p.deliverables.length > 0 && (
              <ul style={{ margin: '4px 0' }}>{p.deliverables.map((d2, j) => <li key={j}>{d2}</li>)}</ul>
            )}
            {p.note && <p style={{ margin: '4px 0', color: '#7d8590', fontStyle: 'italic' }}>{p.note}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (slide.type === 'resources') {
    /* items 는 두 가지 형태 모두 지원:
     *  - string: 그대로 표시
     *  - { name, spec?, example? }: name 굵게 + spec/example 인라인 */
    const renderResourceItem = (it, ii) => {
      if (typeof it === 'string') return <li key={ii}>{it}</li>;
      if (it && typeof it === 'object') {
        const parts = [];
        if (it.name) parts.push(<strong key="n">{it.name}</strong>);
        if (it.spec) parts.push(<span key="s" style={{ color: 'var(--text-3)', fontFamily: 'JetBrains Mono', fontSize: 12, marginLeft: 6 }}>{it.spec}</span>);
        if (it.example) parts.push(<span key="e" style={{ color: 'var(--text-4)', marginLeft: 8 }}>예: {it.example}</span>);
        return <li key={ii}>{parts.length ? parts : <em style={{ color: 'var(--text-4)' }}>(빈 항목)</em>}</li>;
      }
      return <li key={ii}>{String(it ?? '')}</li>;
    };
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        {(d.categories || []).map((c, i) => (
          <div key={i}>
            <h3>{c.name} <span style={{color:'var(--accent)', fontFamily:'JetBrains Mono'}}>{c.count}</span></h3>
            {c.guideline && <p style={{ color: 'var(--text-3)', fontSize: 13 }}>{c.guideline}</p>}
            <ul>{(c.items || []).map(renderResourceItem)}</ul>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

/* === PPTX export ===
   Uses PptxGenJS loaded from CDN.
   We render slides as native shapes/text (editable in PowerPoint). */

/** 사용자가 슬라이드에서 한 pan/zoom 상태가 출력물에 그대로 박히지 않도록 export 직전 normalize. */
function sanitizeProjectForExport(project) {
  if (!project) return project;
  return {
    ...project,
    slides: (project.slides || []).map(s => {
      if (!s?.data?._viewTransform) return s;
      const { _viewTransform, ...restData } = s.data;
      return { ...s, data: restData };
    }),
  };
}

/**
 * exportPptx(project, opts?)
 *
 * opts.returnBlob === true → Blob 반환 (자동 다운로드 X). 일괄 다운로드/ZIP 패키징용.
 *                            그 외 → 기존 동작 (writeFile 로 자동 다운로드).
 */
async function exportPptx(project, opts) {
  if (!window.PptxGenJS) throw new Error('PptxGenJS not loaded');
  opts = opts || {};
  // pan/zoom 상태 제거 — 사용자가 줌-인 한 채로 두면 캡처 결과에 그대로 박힘
  project = sanitizeProjectForExport(project);
  const pptx = new window.PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches (16:9)
  pptx.title = project.title;
  pptx.author = project.author || '';
  pptx.company = project.team || '';

  // Korean-friendly font fallback. PowerPoint will substitute if not installed.
  const FONT = '맑은 고딕';
  const MONO = 'Consolas';
  const ACCENT = '4CC2FF';
  const TEXT = '1C222B';
  const TEXT2 = '7D8590';
  const BG = 'FFFFFF';

  const slides = project.slides || [];
  const totalPages = slides.length;

  // Slide W=13.33", H=7.5"
  const W = 13.33;
  const H = 7.5;
  const PAD_X = 0.75;
  const PAD_Y = 0.6;

  const addFooter = (slide, section, sectionName, page) => {
    const leftParts = [];
    if (section) leftParts.push(section);
    if (sectionName) leftParts.push(sectionName);
    if (leftParts.length) {
      slide.addText(leftParts.join('  —  '), {
        x: PAD_X, y: H - 0.3, w: 6, h: 0.25,
        fontSize: 9, fontFace: MONO, color: TEXT2,
      });
    }
    slide.addText(`${String(page).padStart(2,'0')} / ${String(totalPages).padStart(2,'0')}`, {
      x: W - PAD_X - 2, y: H - 0.3, w: 2, h: 0.25,
      fontSize: 9, fontFace: MONO, color: '303A45', align: 'right', bold: true,
    });
  };

  const addTopTag = (slide, section, sectionName) => {
    if (!section && !sectionName) return;
    const parts = [];
    if (section) parts.push({ text: section, options: { color: ACCENT, bold: true } });
    if (sectionName) parts.push({ text: '  ' + sectionName, options: { color: '303A45' } });
    slide.addText(parts, {
      x: PAD_X, y: 0.3, w: 8, h: 0.25,
      fontSize: 10, fontFace: MONO, charSpacing: 1.6,
    });
  };

  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const d = s.data || {};
    const page = i + 1;
    const slide = pptx.addSlide();
    slide.background = { color: BG };

    if (s.type === 'cover') {
      slide.background = { color: '0A0D12' };
      // 배경 이미지 + 어두운 오버레이 (AI 생성된 표지 이미지)
      if (d.imageSrc && typeof d.imageSrc === 'string' && d.imageSrc.startsWith('data:image/')) {
        slide.addImage({ data: d.imageSrc, x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H } });
        slide.addShape('rect', { x: 0, y: 0, w: W, h: H, fill: { color: '0A0D12', transparency: 35 }, line: { color: '0A0D12', width: 0 } });
      }
      // accent bar
      slide.addShape('rect', { x: PAD_X, y: 0.55, w: 0.3, h: 0.04, fill: { color: ACCENT } });
      slide.addText(d.product || '', { x: PAD_X + 0.4, y: 0.45, w: 5, h: 0.3, fontSize: 12, fontFace: MONO, color: ACCENT, charSpacing: 1.6 });
      slide.addText(d.team || '', { x: W - PAD_X - 4, y: 0.45, w: 4, h: 0.3, fontSize: 11, fontFace: MONO, color: 'B1BAC4', align: 'right' });
      slide.addText(d.title || '', { x: PAD_X, y: 2.6, w: W - 2 * PAD_X, h: 1.8, fontSize: 56, bold: true, fontFace: FONT, color: 'E6EDF3', valign: 'top' });
      slide.addText(d.subtitle || '', { x: PAD_X, y: 4.4, w: W - 2 * PAD_X, h: 0.6, fontSize: 20, fontFace: FONT, color: 'B1BAC4' });
      slide.addText(d.author || '', { x: PAD_X, y: H - 0.9, w: 4, h: 0.3, fontSize: 14, fontFace: FONT, color: 'E6EDF3', bold: true });
      slide.addText(d.date || '', { x: W - PAD_X - 4, y: H - 0.9, w: 4, h: 0.3, fontSize: 11, fontFace: MONO, color: '7D8590', align: 'right' });
      slide.addShape('rect', { x: 0, y: H - 0.06, w: W * 0.35, h: 0.06, fill: { color: ACCENT } });
      continue;
    }

    if (s.type === 'section-divider') {
      slide.background = { color: '0A0D12' };
      // 배경 컨셉 아트 (AI 생성)
      if (d.imageSrc && typeof d.imageSrc === 'string' && d.imageSrc.startsWith('data:image/')) {
        slide.addImage({ data: d.imageSrc, x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H } });
        slide.addShape('rect', { x: 0, y: 0, w: W, h: H, fill: { color: '0A0D12', transparency: 25 }, line: { color: '0A0D12', width: 0 } });
      }
      slide.addText(d.num || '', { x: W - PAD_X - 6, y: 1.0, w: 6, h: 5.5, fontSize: 220, fontFace: MONO, color: 'FFFFFF22', align: 'right', valign: 'middle', bold: true });
      slide.addShape('rect', { x: PAD_X, y: 0.55, w: 0.25, h: 0.04, fill: { color: ACCENT } });
      slide.addText(`CHAPTER ${d.num || ''}`, { x: PAD_X + 0.35, y: 0.45, w: 5, h: 0.3, fontSize: 12, fontFace: MONO, color: ACCENT, charSpacing: 1.6 });
      slide.addText(d.title || '', { x: PAD_X, y: H - 2.2, w: W - 2 * PAD_X, h: 1.2, fontSize: 64, bold: true, fontFace: FONT, color: 'E6EDF3' });
      slide.addText(d.subtitle || '', { x: PAD_X, y: H - 1.0, w: W - 2 * PAD_X - 1, h: 0.7, fontSize: 16, fontFace: FONT, color: 'B1BAC4' });
      continue;
    }

    addTopTag(slide, d.section, d.sectionName);
    if (d.title || s.type === 'toc') {
      const titleText = s.type === 'toc' ? (d.title || 'CONTENTS') : (d.title || '');
      if (s.type === 'toc') {
        slide.addText('— TABLE OF CONTENTS', { x: PAD_X, y: 0.7, w: 6, h: 0.25, fontSize: 11, fontFace: MONO, color: ACCENT, charSpacing: 1.4 });
        slide.addText(titleText, { x: PAD_X, y: 1.0, w: W - 2 * PAD_X, h: 1.2, fontSize: 48, bold: true, fontFace: FONT, color: TEXT });
      } else {
        slide.addText(titleText, { x: PAD_X, y: 0.7, w: W - 2 * PAD_X, h: 0.7, fontSize: 26, bold: true, fontFace: FONT, color: TEXT });
      }
    }

    if (s.type === 'history') {
      const rows = [
        [
          { text: '버전', options: { bold: true, fill: { color: 'F3F5F7' } } },
          { text: '변경일자', options: { bold: true, fill: { color: 'F3F5F7' } } },
          { text: 'page', options: { bold: true, fill: { color: 'F3F5F7' } } },
          { text: '내용', options: { bold: true, fill: { color: 'F3F5F7' } } },
          { text: '작성자', options: { bold: true, fill: { color: 'F3F5F7' } } },
        ],
        ...(d.rows || []).map(r => [
          { text: r.ver || '', options: { color: ACCENT, bold: true, fontFace: MONO } },
          { text: r.date || '' },
          { text: r.page || '' },
          { text: r.content || '' },
          { text: r.author || '' },
        ])
      ];
      slide.addTable(rows, {
        x: PAD_X, y: 1.7, w: W - 2 * PAD_X,
        colW: [1.5, 1.8, 1.5, W - 2 * PAD_X - 1.5 - 1.8 - 1.5 - 1.8, 1.8],
        fontSize: 11, fontFace: FONT, color: TEXT,
        border: { type: 'solid', color: 'E3E7EB', pt: 0.5 },
        rowH: 0.4,
      });
    } else if (s.type === 'toc') {
      // parts 가 있으면 entries 가 빈 배열이어도 펼쳐서 사용
      let entries = d.entries || [];
      if ((!entries || entries.length === 0) && Array.isArray(d.parts)) {
        entries = d.parts.flatMap(p => (p.entries || []).map(e => ({ ...e, sub: p.label || p.sub || '' })));
      }
      const colW = (W - 2 * PAD_X - 0.5) / 2;
      entries.forEach((e, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = PAD_X + col * (colW + 0.5);
        const y = 2.6 + row * 0.85;
        slide.addText(e.num || '', { x, y, w: 0.5, h: 0.4, fontSize: 13, bold: true, fontFace: MONO, color: ACCENT });
        slide.addText(e.name || '', { x: x + 0.55, y, w: colW - 0.55, h: 0.35, fontSize: 15, bold: true, fontFace: FONT, color: TEXT });
        slide.addText(e.sub || '', { x: x + 0.55, y: y + 0.3, w: colW - 0.55, h: 0.4, fontSize: 11, fontFace: FONT, color: TEXT2 });
        slide.addShape('line', { x, y: y + 0.7, w: colW, h: 0, line: { color: 'E3E7EB', width: 0.5 } });
      });
    } else if (s.type === 'intent') {
      slide.addText(d.tagline || '', { x: PAD_X, y: 1.5, w: W - 2 * PAD_X - 1, h: 0.6, fontSize: 13, fontFace: FONT, color: '303A45' });
      const cards = d.cards || [];
      const cardW = (W - 2 * PAD_X - 0.3) / 2;
      const cardH = 1.7;
      cards.forEach((c, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = PAD_X + col * (cardW + 0.3);
        const y = 2.4 + row * (cardH + 0.25);
        slide.addShape('roundRect', { x, y, w: cardW, h: cardH, fill: { color: 'FAFBFC' }, line: { color: 'D0D7DE', width: 0.5 }, rectRadius: 0.1 });
        slide.addText(c.idx || '', { x: x + 0.25, y: y + 0.2, w: 1, h: 0.3, fontSize: 11, bold: true, fontFace: MONO, color: ACCENT });
        slide.addText(c.head || '', { x: x + 0.25, y: y + 0.5, w: cardW - 0.5, h: 0.6, fontSize: 16, bold: true, fontFace: FONT, color: TEXT });
        slide.addText(c.desc || '', { x: x + 0.25, y: y + 1.05, w: cardW - 0.5, h: cardH - 1.1, fontSize: 12, fontFace: FONT, color: '424A55' });
      });
    } else if (s.type === 'terms') {
      const rows = [
        [
          { text: '용어', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
          { text: '정의', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
          { text: '비고', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        ],
        ...(d.rows || []).map(r => [
          { text: r.term || '', options: { bold: true } },
          { text: r.def || '' },
          { text: r.note || '', options: { color: TEXT2 } },
        ])
      ];
      slide.addTable(rows, {
        x: PAD_X, y: 1.7, w: W - 2 * PAD_X,
        colW: [2.5, (W - 2 * PAD_X - 2.5 - 3), 3],
        fontSize: 11, fontFace: FONT, color: TEXT,
        border: { type: 'solid', color: 'E3E7EB', pt: 0.5 },
        rowH: 0.45,
      });
    } else if (s.type === 'rules') {
      const blocks = d.blocks || [];
      const useGrid = blocks.length > 2;
      if (useGrid) {
        const bw = (W - 2 * PAD_X - 0.3) / 2;
        const bh = 2.0;
        blocks.forEach((b, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const x = PAD_X + col * (bw + 0.3);
          const y = 1.7 + row * (bh + 0.2);
          slide.addShape('rect', { x, y, w: 0.04, h: bh, fill: { color: ACCENT } });
          slide.addShape('rect', { x: x + 0.04, y, w: bw - 0.04, h: bh, fill: { color: 'F8F9FA' } });
          slide.addText(b.head || '', { x: x + 0.25, y: y + 0.15, w: bw - 0.3, h: 0.35, fontSize: 14, bold: true, fontFace: FONT, color: TEXT });
          const itemsText = (b.items || []).map(it => ({ text: it, options: { bullet: { code: '2022' } } }));
          slide.addText(itemsText, { x: x + 0.35, y: y + 0.5, w: bw - 0.5, h: bh - 0.55, fontSize: 11, fontFace: FONT, color: '424A55', paraSpaceAfter: 4 });
        });
      } else {
        const bw = W - 2 * PAD_X;
        let y = 1.7;
        blocks.forEach(b => {
          const bh = 0.5 + 0.28 * Math.max(1, (b.items || []).length);
          slide.addShape('rect', { x: PAD_X, y, w: 0.04, h: bh, fill: { color: ACCENT } });
          slide.addShape('rect', { x: PAD_X + 0.04, y, w: bw - 0.04, h: bh, fill: { color: 'F8F9FA' } });
          slide.addText(b.head || '', { x: PAD_X + 0.25, y: y + 0.1, w: bw - 0.3, h: 0.3, fontSize: 14, bold: true, fontFace: FONT, color: TEXT });
          const itemsText = (b.items || []).map(it => ({ text: it, options: { bullet: { code: '2022' } } }));
          slide.addText(itemsText, { x: PAD_X + 0.35, y: y + 0.4, w: bw - 0.5, h: bh - 0.45, fontSize: 12, fontFace: FONT, color: '424A55', paraSpaceAfter: 4 });
          y += bh + 0.15;
        });
      }
    } else if (s.type === 'data-table') {
      const cols = d.columns || [];
      const rowsData = d.rows || [];
      const header = cols.map(c => ({ text: c.label, options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } }));
      const body = rowsData.map(r => cols.map(c => ({ text: String(r[c.key] || '') })));
      slide.addTable([header, ...body], {
        x: PAD_X, y: 1.7, w: W - 2 * PAD_X,
        fontSize: 10, fontFace: FONT, color: TEXT,
        border: { type: 'solid', color: 'E3E7EB', pt: 0.5 },
        rowH: 0.32,
      });
    } else if (s.type === 'flow') {
      const nodes = d.nodes || [];
      const n = nodes.length;
      const autoDir = n <= 5 ? 'vertical' : n <= 8 ? 'horizontal' : 'grid';
      const dir = d.direction || autoDir;
      const lines = (dir === 'grid') ? 1 : Math.max(1, Math.min(2, parseInt(d.lines, 10) || (n >= 10 ? 2 : 1)));
      const drawNode = (node, x, y, w, h) => {
        let fill = 'FFFFFF', col = TEXT, bd = '303A45';
        if (node.kind === 'start') { fill = ACCENT; col = '061018'; bd = ACCENT; }
        else if (node.kind === 'end') { fill = '1C222B'; col = 'E6EDF3'; bd = '1C222B'; }
        else if (node.kind === 'decision') { fill = 'FFF8DC'; bd = 'D29922'; }
        slide.addShape('roundRect', { x, y, w, h, fill: { color: fill }, line: { color: bd, width: 1.5 }, rectRadius: 0.05 });
        slide.addText(node.label || '', { x, y, w, h, fontSize: 11, bold: true, fontFace: FONT, color: col, align: 'center', valign: 'middle' });
      };
      if (dir === 'horizontal') {
        const frameY = 1.7, frameH = H - 2.8;
        const perLine = Math.ceil(n / lines);
        const gap = 0.2;
        const usableW = W - 2 * PAD_X;
        const arrowW = 0.3;
        const nodeW = (usableW - (perLine - 1) * (arrowW + gap)) / perLine;
        const nodeH = Math.min(1.0, (frameH - (lines - 1) * 0.4) / lines - 0.2);
        const lineSpacing = (frameH - lines * nodeH) / (lines + 1);
        nodes.forEach((node, idx) => {
          const line = Math.floor(idx / perLine);
          const col = idx % perLine;
          const x = PAD_X + col * (nodeW + arrowW + gap);
          const y = frameY + lineSpacing + line * (nodeH + lineSpacing);
          drawNode(node, x, y, nodeW, nodeH);
          if (col < perLine - 1 && idx < n - 1) {
            const ax = x + nodeW;
            const ay = y + nodeH / 2;
            slide.addShape('line', { x: ax, y: ay, w: arrowW + gap - 0.05, h: 0, line: { color: '303A45', width: 1.5, endArrowType: 'triangle' } });
          }
        });
      } else if (dir === 'grid') {
        const frameY = 1.7, frameH = H - 2.8;
        const cols = Math.ceil(Math.sqrt(n));
        const rows = Math.ceil(n / cols);
        const usableW = W - 2 * PAD_X;
        const cellW = (usableW - (cols - 1) * 0.25) / cols;
        const cellH = Math.min(0.9, (frameH - (rows - 1) * 0.25) / rows);
        nodes.forEach((node, idx) => {
          const col = idx % cols, row = Math.floor(idx / cols);
          const x = PAD_X + col * (cellW + 0.25);
          const y = frameY + row * (cellH + 0.25);
          drawNode(node, x, y, cellW, cellH);
          slide.addShape('ellipse', { x: x - 0.12, y: y - 0.12, w: 0.28, h: 0.28, fill: { color: '303A45' }, line: { color: '303A45' } });
          slide.addText(String(idx + 1).padStart(2, '0'), { x: x - 0.12, y: y - 0.12, w: 0.28, h: 0.28, fontSize: 9, bold: true, fontFace: MONO, color: 'FFFFFF', align: 'center', valign: 'middle' });
        });
      } else {
        // vertical with optional 2 columns
        const frameY = 1.6, frameH = H - 2.4;
        const perLine = Math.ceil(n / lines);
        const nodeH = 0.5;
        const nodeW = lines === 1 ? 3.0 : 2.4;
        const gap = 0.25;
        const totalH = perLine * nodeH + (perLine - 1) * gap;
        const startY = frameY + ((frameH - totalH) / 2);
        const usableW = W - 2 * PAD_X;
        const colSpacing = lines === 1 ? 0 : (usableW - lines * nodeW) / (lines + 1);
        nodes.forEach((node, idx) => {
          const col = Math.floor(idx / perLine);
          const row = idx % perLine;
          const x = lines === 1
            ? (W / 2 - nodeW / 2)
            : (PAD_X + colSpacing + col * (nodeW + colSpacing));
          const y = startY + row * (nodeH + gap);
          drawNode(node, x, y, nodeW, nodeH);
          if (row < perLine - 1 && idx < n - 1 && (idx + 1) % perLine !== 0) {
            const cx = x + nodeW / 2;
            slide.addShape('line', { x: cx, y: y + nodeH, w: 0, h: gap, line: { color: '303A45', width: 1.5, endArrowType: 'triangle' } });
          }
        });
      }
    } else if (s.type === 'ui-design') {
      slide.addShape('roundRect', { x: PAD_X, y: 1.6, w: 6.5, h: 4.6, fill: { color: '0A0D12' }, line: { color: '0A0D12' }, rectRadius: 0.1 });
      slide.addText('UI MOCKUP', { x: PAD_X + 1, y: 3.5, w: 4.5, h: 0.4, fontSize: 14, fontFace: MONO, color: ACCENT, align: 'center', charSpacing: 1.6 });
      slide.addText('화면 시안 placeholder', { x: PAD_X + 1, y: 3.9, w: 4.5, h: 0.4, fontSize: 12, fontFace: FONT, color: 'B1BAC4', align: 'center' });
      // 화면 표시와 동일하게 (y, x) 시각 읽기 순서로 정렬 — 배지·리스트 번호 일치
      const callouts = [...(d.callouts || [])]
        .map((c) => ({ c, x: typeof c.x === 'number' ? c.x : 50, y: typeof c.y === 'number' ? c.y : 50 }))
        .sort((a, b) => Math.abs(a.y - b.y) > 8 ? a.y - b.y : a.x - b.x)
        .map(s => s.c);
      const coX = PAD_X + 7.0;
      const coW = W - PAD_X - coX;
      callouts.forEach((c, idx) => {
        const y = 1.7 + idx * 0.95;
        slide.addShape('ellipse', { x: coX, y, w: 0.35, h: 0.35, fill: { color: ACCENT }, line: { color: ACCENT } });
        slide.addText(String(idx + 1), { x: coX, y, w: 0.35, h: 0.35, fontSize: 10, bold: true, fontFace: MONO, color: '061018', align: 'center', valign: 'middle' });
        slide.addText(c.name || '', { x: coX + 0.5, y, w: coW - 0.5, h: 0.3, fontSize: 13, bold: true, fontFace: FONT, color: TEXT });
        slide.addText(c.desc || '', { x: coX + 0.5, y: y + 0.32, w: coW - 0.5, h: 0.55, fontSize: 11, fontFace: FONT, color: '424A55' });
      });
    } else if (s.type === 'resources') {
      const cats = d.categories || [];
      const colN = Math.min(4, Math.max(2, cats.length));
      const catW = (W - 2 * PAD_X - 0.2 * (colN - 1)) / colN;
      const catH = H - 2.5;
      cats.forEach((c, idx) => {
        const col = idx % colN;
        const row = Math.floor(idx / colN);
        const x = PAD_X + col * (catW + 0.2);
        const y = 1.7 + row * (catH + 0.2);
        slide.addShape('roundRect', { x, y, w: catW, h: catH, fill: { color: 'F8F9FA' }, line: { color: 'F8F9FA' }, rectRadius: 0.1 });
        slide.addText(c.name || '', { x: x + 0.3, y: y + 0.25, w: catW - 1.2, h: 0.4, fontSize: 14, bold: true, fontFace: FONT, color: TEXT });
        slide.addText(c.count || '', { x: x + catW - 1.0, y: y + 0.25, w: 0.8, h: 0.4, fontSize: 11, fontFace: MONO, color: ACCENT, bold: true, align: 'right' });
        // 가이드라인 박스
        let yCursor = y + 0.75;
        if (c.guideline) {
          const gh = 0.95;
          slide.addShape('rect', { x: x + 0.3, y: yCursor, w: catW - 0.6, h: gh, fill: { color: 'E8F4FF' }, line: { color: 'B8DCFF', width: 0.5 } });
          slide.addText(c.guideline.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1'), { x: x + 0.4, y: yCursor + 0.05, w: catW - 0.8, h: gh - 0.1, fontSize: 9.5, fontFace: FONT, color: '1C4D70', italic: true });
          yCursor += gh + 0.1;
        }
        // 아이템들 — 새 형식(object)과 구 형식(string) 모두 지원
        const items = c.items || [];
        const itemBlocks = items.map((it, i) => {
          if (typeof it === 'string') return { text: '• ' + it, options: { fontSize: 10.5, color: '424A55' } };
          const lines = [];
          if (it.name) lines.push({ text: '• ' + it.name, options: { bold: true, fontSize: 10.5, color: '1C222B' } });
          if (it.spec) lines.push({ text: '\n    ' + it.spec, options: { fontSize: 9, fontFace: MONO, color: '586A75' } });
          if (it.example) lines.push({ text: '\n    예) ' + it.example, options: { fontSize: 9, italic: true, color: '7D8590' } });
          return lines;
        }).flat();
        if (itemBlocks.length) {
          slide.addText(itemBlocks, { x: x + 0.3, y: yCursor, w: catW - 0.6, h: y + catH - yCursor - 0.2, fontSize: 10.5, fontFace: FONT, color: '424A55', paraSpaceAfter: 4, valign: 'top' });
        }
      });
    } else if (s.type === 'balance-table') {
      const vars = d.vars || [];
      if (d.formula) {
        slide.addText(d.formula.replace(/`/g, ''), { x: PAD_X, y: 1.6, w: W - 2 * PAD_X, h: 0.45, fontSize: 13, fontFace: MONO, color: '1C4D70', fill: { color: 'F0F4F8' }, italic: true, valign: 'middle' });
      }
      const tableY = d.formula ? 2.15 : 1.7;
      const header = [
        { text: '변수', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '공식/정의', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '범위', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '기본값', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '민감도', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
      ];
      const body = vars.map(v => [
        { text: v.name || '', options: { fontFace: MONO, color: ACCENT, bold: true } },
        { text: (v.formula || '').replace(/`/g, ''), options: { fontFace: MONO } },
        { text: v.range || '' },
        { text: v.defaultValue || '' },
        { text: (v.sensitivity || v.notes || '').replace(/`/g, '') },
      ]);
      slide.addTable([header, ...body], { x: PAD_X, y: tableY, w: W - 2 * PAD_X, fontSize: 10, fontFace: FONT, color: TEXT, border: { type: 'solid', color: 'E3E7EB', pt: 0.5 }, rowH: 0.32 });
    } else if (s.type === 'state-machine') {
      const states = d.states || [];
      const transitions = d.transitions || [];
      const colW = (W - 2 * PAD_X - 0.3) / 2;
      // states 좌측
      slide.addText('STATES', { x: PAD_X, y: 1.6, w: colW, h: 0.3, fontSize: 11, fontFace: MONO, color: '7D8590', charSpacing: 1.6 });
      let y = 1.95;
      for (const st of states) {
        const fill = st.kind === 'initial' ? 'F4FAFF' : st.kind === 'final' ? 'F4FAF6' : st.kind === 'error' ? 'FDF5F5' : 'FFFFFF';
        const bd = st.kind === 'initial' ? ACCENT : st.kind === 'final' ? '3FB950' : st.kind === 'error' ? 'F85149' : '303A45';
        const h = 0.55;
        slide.addShape('roundRect', { x: PAD_X, y, w: colW, h, fill: { color: fill }, line: { color: bd, width: 1.5 }, rectRadius: 0.04 });
        slide.addText(`${st.id} · ${st.name} (${st.kind})`, { x: PAD_X + 0.15, y, w: colW - 0.3, h, fontSize: 11, bold: true, fontFace: MONO, color: '1C222B', valign: 'middle' });
        y += h + 0.06;
        if (y > H - 1.0) break;
      }
      // transitions 우측 — 표
      const trHeader = [
        { text: 'from', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: 'event', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: 'guard', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: 'to', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
      ];
      const trBody = transitions.map(t => [
        { text: t.from || '', options: { fontFace: MONO, color: ACCENT } },
        { text: t.event || '', options: { fontFace: MONO } },
        { text: (t.guard || '').replace(/`/g, '') },
        { text: t.to || '', options: { fontFace: MONO, color: ACCENT } },
      ]);
      slide.addText('TRANSITIONS', { x: PAD_X + colW + 0.3, y: 1.6, w: colW, h: 0.3, fontSize: 11, fontFace: MONO, color: '7D8590', charSpacing: 1.6 });
      slide.addTable([trHeader, ...trBody], { x: PAD_X + colW + 0.3, y: 1.95, w: colW, fontSize: 9, fontFace: FONT, color: TEXT, border: { type: 'solid', color: 'E3E7EB', pt: 0.5 }, rowH: 0.3 });
    } else if (s.type === 'api-contract') {
      slide.addShape('rect', { x: PAD_X, y: 1.6, w: W - 2 * PAD_X, h: 0.6, fill: { color: '1C222B' } });
      slide.addText(`${d.method || 'POST'}  ${d.endpoint || ''}`, { x: PAD_X + 0.2, y: 1.6, w: W - 2 * PAD_X - 2.5, h: 0.6, fontSize: 16, bold: true, fontFace: MONO, color: 'E6EDF3', valign: 'middle' });
      slide.addText(`auth: ${d.auth || 'bearer'}  ·  SLA ${d.slaMs || 200}ms`, { x: W - PAD_X - 2.3, y: 1.6, w: 2.1, h: 0.6, fontSize: 11, fontFace: MONO, color: ACCENT, align: 'right', valign: 'middle' });
      const colW = (W - 2 * PAD_X - 0.2) / 2;
      slide.addText('REQUEST', { x: PAD_X, y: 2.35, w: colW, h: 0.25, fontSize: 10, fontFace: MONO, color: '7D8590', charSpacing: 1.4 });
      slide.addText(d.request || '{}', { x: PAD_X, y: 2.6, w: colW, h: 1.6, fontSize: 10, fontFace: MONO, color: 'E6EDF3', fill: { color: '1C222B' } });
      slide.addText('RESPONSE', { x: PAD_X + colW + 0.2, y: 2.35, w: colW, h: 0.25, fontSize: 10, fontFace: MONO, color: '7D8590', charSpacing: 1.4 });
      slide.addText(d.response || '{}', { x: PAD_X + colW + 0.2, y: 2.6, w: colW, h: 1.6, fontSize: 10, fontFace: MONO, color: 'E6EDF3', fill: { color: '1C222B' } });
      // errors
      const errH = [
        { text: 'code', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: 'message', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: 'when', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
      ];
      const errB = (d.errors || []).map(e => [
        { text: e.code || '', options: { fontFace: MONO, color: 'F85149', bold: true } },
        { text: e.message || '', options: { fontFace: MONO } },
        { text: e.when || '' },
      ]);
      slide.addTable([errH, ...errB], { x: PAD_X, y: 4.35, w: W - 2 * PAD_X, fontSize: 10, fontFace: FONT, color: TEXT, border: { type: 'solid', color: 'E3E7EB', pt: 0.5 }, rowH: 0.3 });
    } else if (s.type === 'acceptance-criteria') {
      const story = d.userStory || {};
      slide.addShape('rect', { x: PAD_X, y: 1.6, w: W - 2 * PAD_X, h: 0.8, fill: { color: 'F8F9FA' }, line: { color: ACCENT, width: 0 } });
      slide.addShape('rect', { x: PAD_X, y: 1.6, w: 0.05, h: 0.8, fill: { color: ACCENT } });
      slide.addText(`AS A ${story.as || ''}  ·  I WANT ${story.want || ''}  ·  SO THAT ${story.soThat || ''}`, { x: PAD_X + 0.2, y: 1.6, w: W - 2 * PAD_X - 0.4, h: 0.8, fontSize: 12, fontFace: FONT, color: '1C222B', valign: 'middle' });
      let y = 2.6;
      for (const c of (d.criteria || [])) {
        const h = 1.4;
        slide.addShape('roundRect', { x: PAD_X, y, w: W - 2 * PAD_X, h, fill: { color: 'FFFFFF' }, line: { color: 'D0D7DE', width: 0.5 }, rectRadius: 0.05 });
        slide.addText(c.id || '', { x: PAD_X + 0.15, y: y + 0.1, w: 0.8, h: 0.25, fontSize: 11, fontFace: MONO, color: ACCENT, bold: true });
        slide.addText([
          { text: 'GIVEN ', options: { bold: true, color: '1C4D70', fontFace: MONO } }, { text: (c.given || '') + '\n', options: {} },
          { text: 'WHEN ', options: { bold: true, color: '9C6F00', fontFace: MONO } }, { text: (c.when || '').replace(/`/g, '') + '\n', options: {} },
          { text: 'THEN ', options: { bold: true, color: '166534', fontFace: MONO } }, { text: c.then || '', options: {} },
        ], { x: PAD_X + 0.15, y: y + 0.4, w: W - 2 * PAD_X - 0.3, h: h - 0.5, fontSize: 10.5, fontFace: FONT, color: '424A55' });
        y += h + 0.15;
        if (y > H - 1.0) break;
      }
    } else if (s.type === 'telemetry') {
      let y = 1.7;
      for (const e of (d.events || [])) {
        const propsCount = (e.props || []).length;
        const h = 0.5 + propsCount * 0.22 + 0.2;
        slide.addShape('roundRect', { x: PAD_X, y, w: W - 2 * PAD_X, h, fill: { color: 'FAFBFC' }, line: { color: 'D0D7DE', width: 0.5 }, rectRadius: 0.04 });
        slide.addText(e.name || '', { x: PAD_X + 0.15, y: y + 0.06, w: 4, h: 0.3, fontSize: 13, bold: true, fontFace: MONO, color: ACCENT });
        if (e.kpi) slide.addText(`KPI: ${e.kpi}`, { x: W - PAD_X - 3, y: y + 0.08, w: 2.8, h: 0.25, fontSize: 10, fontFace: MONO, color: '88DFB0', align: 'right' });
        if (e.when) slide.addText(e.when, { x: PAD_X + 0.15, y: y + 0.35, w: W - 2 * PAD_X - 0.3, h: 0.22, fontSize: 10, fontFace: FONT, italic: true, color: '586A75' });
        let py = y + 0.6;
        for (const p of (e.props || [])) {
          slide.addText(`  ${p.key} : ${p.type}${p.required ? ' *' : ''}${p.note ? ' — ' + p.note : ''}`, { x: PAD_X + 0.15, y: py, w: W - 2 * PAD_X - 0.3, h: 0.2, fontSize: 9.5, fontFace: MONO, color: '424A55' });
          py += 0.22;
        }
        y += h + 0.12;
        if (y > H - 0.8) break;
      }
    } else if (s.type === 'risk-register') {
      const risks = [...(d.risks || [])].sort((a, b) => ((b.impact || 0) * (b.likelihood || 0)) - ((a.impact || 0) * (a.likelihood || 0)));
      const header = [
        { text: 'ID', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '위험', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: 'I', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: 'L', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '점수', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '완화책', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '담당', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '상태', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
      ];
      const body = risks.map(r => {
        const sc = (r.impact || 0) * (r.likelihood || 0);
        const sevFill = sc >= 16 ? '8B0000' : sc >= 9 ? 'F85149' : sc >= 4 ? 'FFC107' : '3FB950';
        return [
          { text: r.id || '', options: { fontFace: MONO, color: 'FFFFFF', fill: { color: sevFill }, bold: true } },
          { text: r.title || '' },
          { text: String(r.impact || 0), options: { align: 'center', fontFace: MONO } },
          { text: String(r.likelihood || 0), options: { align: 'center', fontFace: MONO } },
          { text: String(sc), options: { bold: true, fontFace: MONO, align: 'center', color: sevFill } },
          { text: r.mitigation || '' },
          { text: r.owner || '', options: { fontFace: MONO } },
          { text: r.status || 'open', options: { fontFace: MONO, fontSize: 9 } },
        ];
      });
      slide.addTable([header, ...body], { x: PAD_X, y: 1.7, w: W - 2 * PAD_X, colW: [0.5, 2.6, 0.4, 0.4, 0.6, 3.0, 0.8, 0.8], fontSize: 9.5, fontFace: FONT, color: TEXT, border: { type: 'solid', color: 'E3E7EB', pt: 0.5 }, rowH: 0.3 });
    } else if (s.type === 'roadmap') {
      const phases = d.phases || [];
      const toMonth = (str) => {
        const m = /(\d{4})\D+(\d{1,2})/.exec(String(str || ''));
        return m ? parseInt(m[1], 10) * 12 + parseInt(m[2], 10) : 0;
      };
      const allMonths = phases.flatMap(p => [toMonth(p.start), toMonth(p.end)]).filter(n => n > 0);
      const minM = allMonths.length ? Math.min(...allMonths) : 0;
      const maxM = allMonths.length ? Math.max(...allMonths) : 0;
      const range = (maxM - minM) || 1;
      const trackX = PAD_X + 1.4, trackW = W - 2 * PAD_X - 1.4;
      // 간트
      let y = 1.8;
      for (const p of phases) {
        const start = toMonth(p.start), end = toMonth(p.end);
        const left = trackX + ((start - minM) / range) * trackW;
        const w = Math.max(0.3, ((end - start) / range) * trackW);
        slide.addText(p.name || '', { x: PAD_X, y: y - 0.05, w: 1.3, h: 0.3, fontSize: 11, fontFace: FONT, bold: true, color: TEXT, align: 'right' });
        slide.addShape('roundRect', { x: trackX, y, w: trackW, h: 0.25, fill: { color: 'F0F4F8' }, line: { color: 'F0F4F8' }, rectRadius: 0.12 });
        slide.addShape('roundRect', { x: left, y, w, h: 0.25, fill: { color: ACCENT }, line: { color: '2B88C4' }, rectRadius: 0.12 });
        slide.addText(`${p.start || ''} – ${p.end || ''}`, { x: left + 0.1, y, w: w - 0.2, h: 0.25, fontSize: 8.5, fontFace: MONO, color: '061018', valign: 'middle', bold: true });
        y += 0.4;
        if (y > 4.5) break;
      }
      // 산출물 리스트
      let pY = y + 0.2;
      for (const p of phases) {
        if (pY > H - 0.6) break;
        const text = (p.deliverables || []).map(dl => '▸ ' + dl).join('  ');
        if (text) {
          slide.addText(`${p.name}: ${text}`, { x: PAD_X, y: pY, w: W - 2 * PAD_X, h: 0.28, fontSize: 10, fontFace: FONT, color: '424A55' });
          pY += 0.3;
        }
      }
    } else if (s.type === 'image-embed') {
      // 캡션 + 중앙 정렬된 참고 이미지
      const cap = d.caption || '';
      if (cap) {
        slide.addText(cap, { x: PAD_X, y: 1.5, w: W - 2 * PAD_X, h: 0.4, fontSize: 12, fontFace: FONT, color: TEXT2, italic: true });
      }
      const imgY = cap ? 2.0 : 1.7;
      const imgH = H - imgY - 0.7;
      if (d.imageSrc && typeof d.imageSrc === 'string' && d.imageSrc.startsWith('data:image/')) {
        slide.addImage({ data: d.imageSrc, x: PAD_X, y: imgY, w: W - 2 * PAD_X, h: imgH, sizing: { type: 'contain', w: W - 2 * PAD_X, h: imgH } });
      } else {
        slide.addShape('rect', { x: PAD_X, y: imgY, w: W - 2 * PAD_X, h: imgH, fill: { color: 'F3F5F7' }, line: { color: 'E3E7EB', width: 0.5 } });
        slide.addText('REFERENCE IMAGE\n(이미지 미생성)', { x: PAD_X, y: imgY, w: W - 2 * PAD_X, h: imgH, fontSize: 12, fontFace: MONO, color: '7D8590', align: 'center', valign: 'middle' });
        if (d.imagePrompt) {
          slide.addText(`prompt: ${d.imagePrompt}`, { x: PAD_X + 0.5, y: imgY + imgH - 0.45, w: W - 2 * PAD_X - 1, h: 0.35, fontSize: 9, fontFace: MONO, color: '7D8590', italic: true });
        }
      }
    } else if (s.type === 'sequence-diagram') {
      // 참여자 가로 배치 + 세로 lifeline + 메시지 화살표
      const parts = d.participants || [];
      const msgs = d.messages || [];
      const frameX = PAD_X, frameY = 1.6, frameW = W - 2 * PAD_X, frameH = H - 2.6;
      slide.addShape('roundRect', { x: frameX, y: frameY, w: frameW, h: frameH, fill: { color: 'FCFDFE' }, line: { color: 'E3E7EB', width: 0.5 }, rectRadius: 0.08 });
      if (parts.length === 0) {
        slide.addText('(참여자 없음)', { x: frameX, y: frameY + frameH / 2 - 0.2, w: frameW, h: 0.4, fontSize: 12, fontFace: FONT, color: '7D8590', align: 'center' });
      } else {
        const colW = (frameW - 0.6) / parts.length;
        const headY = frameY + 0.25;
        const headH = 0.55;
        const lifeTop = headY + headH + 0.1;
        const lifeBottom = frameY + frameH - 0.3;
        const partX = (i) => frameX + 0.3 + i * colW + colW / 2;
        // 참여자 박스 + lifeline
        parts.forEach((p, i) => {
          const cx = partX(i);
          let fill = 'FFFFFF', bd = '303A45', col = TEXT;
          if (p.kind === 'actor') { fill = ACCENT; col = '061018'; bd = ACCENT; }
          else if (p.kind === 'service') { fill = 'ECF3FF'; bd = '58A6FF'; }
          else if (p.kind === 'data') { fill = 'F0F9EB'; bd = '3FB950'; }
          slide.addShape('roundRect', { x: cx - colW / 2 + 0.15, y: headY, w: colW - 0.3, h: headH, fill: { color: fill }, line: { color: bd, width: 1.5 }, rectRadius: 0.06 });
          slide.addText(p.name || p.id || '', { x: cx - colW / 2 + 0.15, y: headY, w: colW - 0.3, h: headH, fontSize: 12, bold: true, fontFace: FONT, color: col, align: 'center', valign: 'middle' });
          // lifeline (dashed)
          slide.addShape('line', { x: cx, y: lifeTop, w: 0, h: lifeBottom - lifeTop, line: { color: 'A0A8B2', width: 0.8, dashType: 'dash' } });
        });
        // 메시지: 위에서 아래로 배치, 가로 화살표
        const msgGap = msgs.length > 0 ? Math.min(0.45, (lifeBottom - lifeTop - 0.3) / msgs.length) : 0;
        msgs.forEach((m, i) => {
          const fromI = parts.findIndex(p => p.id === m.from);
          const toI = parts.findIndex(p => p.id === m.to);
          if (fromI < 0 || toI < 0) return;
          const y = lifeTop + 0.2 + i * msgGap;
          const x1 = partX(fromI);
          const x2 = partX(toI);
          const dashed = (m.kind === 'async' || m.kind === 'return');
          slide.addShape('line', { x: Math.min(x1, x2), y, w: Math.abs(x2 - x1), h: 0, line: { color: '303A45', width: 1.2, dashType: dashed ? 'dash' : undefined, endArrowType: x2 > x1 ? 'triangle' : undefined, beginArrowType: x2 < x1 ? 'triangle' : undefined } });
          if (m.label) {
            slide.addText(m.label, { x: Math.min(x1, x2), y: y - 0.22, w: Math.abs(x2 - x1) || 1.5, h: 0.22, fontSize: 9, fontFace: MONO, color: '303A45', align: 'center' });
          }
        });
      }
    } else if (s.type === 'class-diagram') {
      // 클래스 박스(col/row) + 관계선
      const classes = d.classes || [];
      const relations = d.relations || [];
      const frameX = PAD_X, frameY = 1.6, frameW = W - 2 * PAD_X, frameH = H - 2.6;
      slide.addShape('roundRect', { x: frameX, y: frameY, w: frameW, h: frameH, fill: { color: 'FCFDFE' }, line: { color: 'E3E7EB', width: 0.5 }, rectRadius: 0.08 });
      const cols = Math.max(2, Math.min(4, Math.max(0, ...classes.map(c => c.col ?? 0)) + 1));
      const rows = Math.max(1, Math.max(0, ...classes.map(c => c.row ?? 0)) + 1);
      const px = 0.3, py = 0.25;
      const cw = (frameW - 2 * px - (cols - 1) * 0.4) / cols;
      const baseH = Math.max(1.2, (frameH - 2 * py - (rows - 1) * 0.4) / rows);
      const layouts = {};
      classes.forEach(c => {
        const col = Math.min(cols - 1, Math.max(0, c.col ?? 0));
        const row = Math.min(rows - 1, Math.max(0, c.row ?? 0));
        const x = frameX + px + col * (cw + 0.4);
        const y = frameY + py + row * (baseH + 0.4);
        layouts[c.id] = { x, y, w: cw, h: baseH };
      });
      // 관계선 (단순 직선 + 라벨)
      const RELATION_DASH = { inherit: undefined, implement: 'dash', compose: undefined, aggregate: undefined, assoc: undefined, depend: 'dash' };
      relations.forEach(r => {
        const a = layouts[r.from], b = layouts[r.to];
        if (!a || !b) return;
        const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
        const bx = b.x + b.w / 2, by = b.y + b.h / 2;
        slide.addShape('line', { x: Math.min(ax, bx), y: Math.min(ay, by), w: Math.abs(bx - ax), h: Math.abs(by - ay), line: { color: '303A45', width: 1.2, dashType: RELATION_DASH[r.kind], endArrowType: 'triangle' } });
        if (r.label) {
          const lx = (ax + bx) / 2, ly = (ay + by) / 2;
          slide.addText(r.label, { x: lx - 0.5, y: ly - 0.12, w: 1, h: 0.24, fontSize: 9, fontFace: MONO, color: '303A45', align: 'center', fill: { color: 'FFFFFF' } });
        }
      });
      // 클래스 박스
      classes.forEach(c => {
        const l = layouts[c.id];
        if (!l) return;
        slide.addShape('roundRect', { x: l.x, y: l.y, w: l.w, h: l.h, fill: { color: 'FFFFFF' }, line: { color: '303A45', width: 1.5 }, rectRadius: 0.04 });
        // header
        slide.addShape('rect', { x: l.x, y: l.y, w: l.w, h: 0.55, fill: { color: 'F0F4F8' }, line: { color: '303A45', width: 0 } });
        if (c.stereotype) {
          slide.addText(c.stereotype, { x: l.x, y: l.y + 0.05, w: l.w, h: 0.2, fontSize: 8, fontFace: MONO, color: '586A75', italic: true, align: 'center' });
        }
        slide.addText(c.name || c.id || '', { x: l.x, y: l.y + (c.stereotype ? 0.22 : 0.1), w: l.w, h: 0.35, fontSize: 13, bold: true, fontFace: FONT, color: TEXT, align: 'center' });
        // attrs
        const attrs = c.attrs || [];
        if (attrs.length) {
          const attrText = attrs.map(a => ({ text: a, options: {} }));
          slide.addText(attrText, { x: l.x + 0.1, y: l.y + 0.6, w: l.w - 0.2, h: Math.min(0.7, attrs.length * 0.2), fontSize: 9, fontFace: MONO, color: TEXT, paraSpaceAfter: 1 });
        }
        // methods
        const methods = c.methods || [];
        if (methods.length) {
          const methStart = l.y + 0.6 + Math.min(0.7, attrs.length * 0.2) + 0.05;
          const methText = methods.map(m => ({ text: m, options: {} }));
          slide.addText(methText, { x: l.x + 0.1, y: methStart, w: l.w - 0.2, h: l.h - (methStart - l.y) - 0.05, fontSize: 9, fontFace: MONO, color: TEXT, paraSpaceAfter: 1 });
        }
      });
    } else if (s.type === 'diagram') {
      // Render diagram nodes laid out by col/row, with edges
      const nodes = d.nodes || [];
      const edges = d.edges || [];
      // Frame
      const frameX = PAD_X, frameY = 1.6, frameW = W - 2 * PAD_X, frameH = H - 2.6;
      slide.addShape('roundRect', { x: frameX, y: frameY, w: frameW, h: frameH, fill: { color: 'FCFDFE' }, line: { color: 'E3E7EB', width: 0.5 }, rectRadius: 0.08 });
      // Compute layout
      const cols = Math.max(2, Math.min(4, Math.max(...nodes.map(n => n.col ?? 0)) + 1));
      const rows = Math.max(1, Math.max(...nodes.map(n => n.row ?? 0)) + 1);
      const px = 0.3, py = 0.25;
      const nodeW = (frameW - 2 * px - (cols - 1) * 0.35) / cols;
      const nodeH = 0.7;
      const rowSpace = rows > 1 ? (frameH - 2 * py - nodeH) / (rows - 1) : 0;
      const layouts = {};
      nodes.forEach(n => {
        const c = Math.min(cols - 1, Math.max(0, n.col ?? 0));
        const r = Math.min(rows - 1, Math.max(0, n.row ?? 0));
        const x = frameX + px + c * (nodeW + 0.35);
        const y = frameY + py + r * Math.max(rowSpace, nodeH + 0.4);
        layouts[n.id] = { x, y, w: nodeW, h: nodeH };
      });
      // Draw edges first (so they go under nodes)
      edges.forEach(e => {
        const a = layouts[e.from], b = layouts[e.to];
        if (!a || !b) return;
        const ax = a.x + a.w / 2, ay = a.y + a.h;
        const bx = b.x + b.w / 2, by = b.y;
        const lineOpts = { color: '303A45', width: e.kind === 'thin' ? 0.8 : 1.5, endArrowType: 'triangle' };
        if (e.kind === 'dashed') lineOpts.dashType = 'dash';
        if (Math.abs(ax - bx) < 0.05) {
          slide.addShape('line', { x: ax, y: ay, w: 0, h: by - ay - 0.05, line: lineOpts });
        } else {
          const midY = (ay + by) / 2;
          slide.addShape('line', { x: ax, y: ay, w: 0, h: midY - ay, line: { color: '303A45', width: e.kind === 'thin' ? 0.8 : 1.5, dashType: e.kind === 'dashed' ? 'dash' : undefined } });
          slide.addShape('line', { x: Math.min(ax, bx), y: midY, w: Math.abs(bx - ax), h: 0, line: { color: '303A45', width: e.kind === 'thin' ? 0.8 : 1.5, dashType: e.kind === 'dashed' ? 'dash' : undefined } });
          slide.addShape('line', { x: bx, y: midY, w: 0, h: by - midY - 0.05, line: lineOpts });
        }
        if (e.label) {
          const lx = (ax + bx) / 2, ly = (ay + by) / 2;
          slide.addText(e.label, { x: lx - 0.7, y: ly - 0.13, w: 1.4, h: 0.26, fontSize: 10, fontFace: MONO, color: '303A45', align: 'center', fill: { color: 'FFFFFF' }, bold: true });
        }
      });
      // Draw nodes
      nodes.forEach(n => {
        const l = layouts[n.id];
        if (!l) return;
        let fill = 'FFFFFF', col = TEXT, bd = '303A45';
        if (n.kind === 'start') { fill = ACCENT; col = '061018'; bd = ACCENT; }
        else if (n.kind === 'end') { fill = '1C222B'; col = 'E6EDF3'; bd = '1C222B'; }
        else if (n.kind === 'decision') { fill = 'FFF8DC'; bd = 'D29922'; }
        else if (n.kind === 'service') { fill = 'ECF3FF'; bd = '58A6FF'; }
        else if (n.kind === 'data') { fill = 'F0F9EB'; bd = '3FB950'; }
        slide.addShape('roundRect', { x: l.x, y: l.y, w: l.w, h: l.h, fill: { color: fill }, line: { color: bd, width: 1.5 }, rectRadius: 0.06 });
        slide.addText(n.label || '', { x: l.x, y: l.y + (n.sub ? 0.05 : 0.05), w: l.w, h: n.sub ? 0.4 : l.h, fontSize: 13, bold: true, fontFace: FONT, color: col, align: 'center', valign: 'middle' });
        if (n.sub) {
          slide.addText(n.sub, { x: l.x, y: l.y + 0.42, w: l.w, h: 0.25, fontSize: 9, fontFace: MONO, color: col, align: 'center', charSpacing: 1.2 });
        }
      });
    }

    addFooter(slide, d.section || '', d.sectionName || SLIDE_LABELS[s.type] || '', page);
  }

  // returnBlob 옵션 ON → Blob 반환 (호출자가 ZIP 패키징/대기열 처리 가능)
  if (opts.returnBlob) {
    return await pptx.write({ outputType: 'blob' });
  }
  await pptx.writeFile({ fileName: `${project.title || 'GDD'}.pptx` });
}

/**
 * 여러 GDD 를 ZIP 한 개로 묶어 일괄 다운로드.
 *
 * @param projects  Array<Project>  — 다운로드 대상
 * @param opts.zipName  string      — 결과 ZIP 파일 이름 (확장자 포함)
 * @param opts.onProgress fn        — ({done, total, currentTitle}) 진행 콜백
 * @param opts.format  'pptx'|'md'  — 어떤 포맷으로 묶을지 (기본 pptx)
 *
 * JSZip 이 로드되지 않은 경우 sequential 개별 다운로드로 폴백.
 */
async function bulkDownloadProjects(projects, opts) {
  opts = opts || {};
  const onProgress = typeof opts.onProgress === 'function' ? opts.onProgress : () => {};
  const format = opts.format || 'pptx';
  const total = projects.length;
  if (!total) throw new Error('다운로드할 기획서가 없습니다.');

  // 안전한 파일명 (운영체제 호환)
  const safeName = (s, fallback) => {
    const base = String(s || fallback || 'GDD')
      .replace(/[\\/:*?"<>|]+/g, '_')
      .replace(/\s+/g, ' ')
      .trim();
    return base || fallback || 'GDD';
  };
  // 중복 파일명 처리 — Set 으로 추적하면서 (2), (3) 접미사 부여
  const usedNames = new Set();
  const uniqueName = (base, ext) => {
    let candidate = `${base}.${ext}`;
    let i = 2;
    while (usedNames.has(candidate)) {
      candidate = `${base} (${i}).${ext}`;
      i++;
    }
    usedNames.add(candidate);
    return candidate;
  };

  // 각 project 의 blob 생성
  const blobs = [];
  for (let i = 0; i < total; i++) {
    const p = projects[i];
    onProgress({ done: i, total, currentTitle: p.title || `(no title ${i + 1})` });
    let blob, fileName;
    try {
      if (format === 'md') {
        const md = window.exportMarkdown ? window.exportMarkdown(p, { returnText: true }) : null;
        if (md == null) throw new Error('Markdown export 모듈이 returnText 모드를 지원하지 않습니다.');
        blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
        fileName = uniqueName(safeName(p.title, 'GDD'), 'md');
      } else {
        blob = await exportPptx(p, { returnBlob: true });
        fileName = uniqueName(safeName(p.title, 'GDD'), 'pptx');
      }
    } catch (e) {
      // 한 GDD 실패해도 나머지는 진행 — error.txt 로 기록
      const errBlob = new Blob([`Failed to export ${p.title}: ${e.message || e}`], { type: 'text/plain' });
      blobs.push({ blob: errBlob, fileName: uniqueName(safeName(p.title, 'GDD') + '_ERROR', 'txt') });
      continue;
    }
    blobs.push({ blob, fileName });
  }
  onProgress({ done: total, total, currentTitle: null });

  // JSZip 사용 가능하면 한 ZIP 으로 묶기, 아니면 순차 개별 다운로드
  const Zip = window.JSZip;
  const zipName = opts.zipName || `GDDs_${new Date().toISOString().slice(0, 10)}.zip`;
  if (Zip) {
    const zip = new Zip();
    for (const { blob, fileName } of blobs) {
      zip.file(fileName, blob);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
    triggerDownload(zipBlob, zipName);
    return { count: blobs.length, asZip: true };
  }
  // 폴백: 순차 다운로드 (브라우저가 여러 파일을 동시 받게 함)
  for (const { blob, fileName } of blobs) {
    triggerDownload(blob, fileName);
    // 브라우저 동시 다운로드 제한 회피를 위해 약간 지연
    await new Promise(r => setTimeout(r, 250));
  }
  return { count: blobs.length, asZip: false };
}

function triggerDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

Object.assign(window, { DocumentView, exportPptx, bulkDownloadProjects });
