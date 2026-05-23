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
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>목차</h2>
        <ul>
          {(d.entries || []).map((e, i) => (
            <li key={i}><strong>{e.num}. {e.name}</strong> <span style={{color:'#7d8590'}}>— {e.sub}</span></li>
          ))}
        </ul>
      </div>
    );
  }

  if (slide.type === 'section-divider') {
    return (
      <div className="doc-section" style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 22, borderTop: '3px solid var(--accent)', paddingTop: 16 }}>
          <span className="idx" style={{ fontSize: 18 }}>{d.num}</span>
          {d.title}
        </h2>
        <p style={{ color: '#7d8590' }}>{d.subtitle}</p>
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

  if (slide.type === 'resources') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        {(d.categories || []).map((c, i) => (
          <div key={i}>
            <h3>{c.name} <span style={{color:'var(--accent)', fontFamily:'JetBrains Mono'}}>{c.count}</span></h3>
            <ul>{(c.items || []).map((it, ii) => <li key={ii}>{it}</li>)}</ul>
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

async function exportPptx(project) {
  if (!window.PptxGenJS) throw new Error('PptxGenJS not loaded');
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
      const entries = d.entries || [];
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
      const nodeH = 0.5;
      const nodeW = 3.0;
      const gap = 0.25;
      const totalH = nodes.length * nodeH + (nodes.length - 1) * gap;
      const startY = 1.6 + ((H - 2.4 - totalH) / 2);
      const cx = W / 2;
      nodes.forEach((n, idx) => {
        const x = cx - nodeW / 2;
        const y = startY + idx * (nodeH + gap);
        let fill = 'FFFFFF', col = TEXT, bd = '303A45';
        if (n.kind === 'start') { fill = ACCENT; col = '061018'; bd = ACCENT; }
        if (n.kind === 'end') { fill = '1C222B'; col = 'E6EDF3'; bd = '1C222B'; }
        if (n.kind === 'decision') { fill = 'FFF8DC'; bd = 'D29922'; }
        slide.addShape('roundRect', { x, y, w: nodeW, h: nodeH, fill: { color: fill }, line: { color: bd, width: 1.5 }, rectRadius: 0.05 });
        slide.addText(n.label || '', { x, y, w: nodeW, h: nodeH, fontSize: 12, bold: true, fontFace: FONT, color: col, align: 'center', valign: 'middle' });
        if (idx < nodes.length - 1) {
          slide.addShape('line', { x: cx, y: y + nodeH, w: 0, h: gap, line: { color: '303A45', width: 1.5, endArrowType: 'triangle' } });
        }
      });
    } else if (s.type === 'ui-design') {
      slide.addShape('roundRect', { x: PAD_X, y: 1.6, w: 6.5, h: 4.6, fill: { color: '0A0D12' }, line: { color: '0A0D12' }, rectRadius: 0.1 });
      slide.addText('UI MOCKUP', { x: PAD_X + 1, y: 3.5, w: 4.5, h: 0.4, fontSize: 14, fontFace: MONO, color: ACCENT, align: 'center', charSpacing: 1.6 });
      slide.addText('화면 시안 placeholder', { x: PAD_X + 1, y: 3.9, w: 4.5, h: 0.4, fontSize: 12, fontFace: FONT, color: 'B1BAC4', align: 'center' });
      const callouts = d.callouts || [];
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
      const catW = (W - 2 * PAD_X - 0.4) / 3;
      const catH = 4.5;
      cats.forEach((c, idx) => {
        const x = PAD_X + idx * (catW + 0.2);
        const y = 1.7;
        slide.addShape('roundRect', { x, y, w: catW, h: catH, fill: { color: 'F8F9FA' }, line: { color: 'F8F9FA' }, rectRadius: 0.1 });
        slide.addText(c.name || '', { x: x + 0.3, y: y + 0.3, w: catW - 1.2, h: 0.4, fontSize: 14, bold: true, fontFace: FONT, color: TEXT });
        slide.addText(c.count || '', { x: x + catW - 1.0, y: y + 0.3, w: 0.8, h: 0.4, fontSize: 11, fontFace: MONO, color: ACCENT, bold: true, align: 'right' });
        const itemsText = (c.items || []).map(it => ({ text: it, options: { bullet: { code: '2022' } } }));
        slide.addText(itemsText, { x: x + 0.4, y: y + 0.85, w: catW - 0.6, h: catH - 0.95, fontSize: 11, fontFace: FONT, color: '424A55', paraSpaceAfter: 5 });
      });
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

  await pptx.writeFile({ fileName: `${project.title || 'GDD'}.pptx` });
}

Object.assign(window, { DocumentView, exportPptx });
