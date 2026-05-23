/* === Additional export formats (PDF / Markdown) ===
 * - PDF: jsPDF + html2canvas (이미 html2canvas는 CDN으로 로드됨, jsPDF는 별도)
 * - Markdown: 슬라이드 타입별 자체 직렬화
 *
 * 노출: window.exportPdf(project, slideEls), window.exportMarkdown(project)
 */
(function () {

  /* ===== PDF export =====
   * 슬라이드 frame을 html2canvas로 캡처 → 가로 A4 페이지에 한 장씩.
   * 호출 측은 슬라이드 요소(.slide-frame 같은) 배열을 넘겨도 되고, 본 함수가 임시 렌더를 통해 만들 수도 있음.
   */
  async function exportPdf(project) {
    if (!window.jspdf) {
      throw new Error('jsPDF 미로드 — index.html에 jsPDF CDN을 포함해주세요.');
    }
    if (!window.html2canvas) {
      throw new Error('html2canvas 미로드.');
    }
    const { jsPDF } = window.jspdf;

    // 슬라이드 1280x720 비율을 A4 가로(297x210mm)에 맞춰 렌더
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    // 임시 컨테이너 (화면 밖, scale=1로 렌더)
    const sandbox = document.createElement('div');
    sandbox.style.cssText = `
      position: fixed; left: -99999px; top: 0;
      width: 1280px; height: 720px; background: white;
      font-family: 'Pretendard', sans-serif;
    `;
    document.body.appendChild(sandbox);

    const slides = project.slides || [];
    const total = slides.length;
    try {
      for (let i = 0; i < total; i++) {
        const slide = slides[i];
        // React로 슬라이드를 1280x720에 렌더
        const root = window.ReactDOM.createRoot(sandbox);
        await new Promise(resolve => {
          root.render(
            window.React.createElement(window.SlideRenderer, {
              slide,
              patch: () => {},
              page: i + 1,
              totalPages: total,
            })
          );
          // 다음 페인트까지 대기
          requestAnimationFrame(() => setTimeout(resolve, 80));
        });
        const canvas = await window.html2canvas(sandbox.querySelector('.slide') || sandbox, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          width: 1280,
          height: 720,
          windowWidth: 1280,
          windowHeight: 720,
        });
        const img = canvas.toDataURL('image/jpeg', 0.92);
        if (i > 0) pdf.addPage();
        // 비율 유지하여 페이지 가운데 정렬
        const ratio = Math.min(pageW / 1280, pageH / 720);
        const drawW = 1280 * ratio;
        const drawH = 720 * ratio;
        const offX = (pageW - drawW) / 2;
        const offY = (pageH - drawH) / 2;
        pdf.addImage(img, 'JPEG', offX, offY, drawW, drawH);
        root.unmount();
      }
    } finally {
      document.body.removeChild(sandbox);
    }
    pdf.save(`${(project.title || 'gdd')}.pdf`);
  }

  /* ===== Markdown export ===== */
  function slideToMarkdown(slide, idx, total) {
    const d = slide.data || {};
    const T = slide.type;
    const sectionLabel = (d.section || '') + (d.sectionName ? ` ${d.sectionName}` : '');
    const header = (level, text) => '#'.repeat(level) + ' ' + text;

    if (T === 'cover') {
      return [
        header(1, d.title || '제목 없음'),
        d.subtitle ? `> ${d.subtitle}` : '',
        '',
        `**${d.product || ''}** · ${d.team || ''} · ${d.author || ''} · ${d.date || ''}`,
        '',
      ].filter(Boolean).join('\n');
    }
    if (T === 'history') {
      const head = '| 버전 | 변경일 | page | 내용 | 작성자 |\n|---|---|---|---|---|';
      const rows = (d.rows || []).map(r => `| ${r.ver || ''} | ${r.date || ''} | ${r.page || ''} | ${(r.content || '').replace(/\n/g, ' ')} | ${r.author || ''} |`);
      return [header(2, d.title || '문서 이력'), '', head, ...rows, ''].join('\n');
    }
    if (T === 'toc') {
      return [
        header(2, d.title || 'CONTENTS'),
        '',
        ...(d.entries || []).map(e => `- **${e.num || ''} ${e.name || ''}** — ${e.sub || ''}`),
        '',
      ].join('\n');
    }
    if (T === 'section-divider') {
      return [
        '---',
        header(2, `${d.num || ''}. ${d.title || ''}`),
        d.subtitle ? `> ${d.subtitle}` : '',
        d.imageSrc ? `\n![${d.title || 'section'}](${d.imageSrc})\n` : '',
        '',
      ].filter(Boolean).join('\n');
    }
    if (T === 'image-embed') {
      return [
        header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '참고 이미지'}`),
        d.caption ? `*${d.caption}*` : '',
        '',
        d.imageSrc ? `![${d.title || 'reference'}](${d.imageSrc})` : (d.imagePrompt ? `*(이미지 미생성 — 프롬프트: ${d.imagePrompt})*` : '*(이미지 없음)*'),
        '',
      ].filter(Boolean).join('\n');
    }
    if (T === 'intent') {
      return [
        header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '기획 의도'}`),
        d.tagline ? `> ${d.tagline}` : '',
        '',
        ...((d.cards || []).map(c => `- **${c.idx || ''} ${c.head || ''}** — ${c.desc || ''}`)),
        '',
      ].filter(Boolean).join('\n');
    }
    if (T === 'terms') {
      return [
        header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '용어 정의'}`),
        '',
        '| 용어 | 정의 | 비고 |\n|---|---|---|',
        ...((d.rows || []).map(r => `| **${r.term || ''}** | ${(r.def || '').replace(/\n/g, ' ')} | ${(r.note || '').replace(/\n/g, ' ')} |`)),
        '',
      ].join('\n');
    }
    if (T === 'rules') {
      const parts = [header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '규칙'}`), ''];
      for (const b of (d.blocks || [])) {
        parts.push(`**${b.head || ''}**`);
        for (const it of (b.items || [])) parts.push(`- ${it}`);
        parts.push('');
      }
      return parts.join('\n');
    }
    if (T === 'data-table') {
      const cols = d.columns || [];
      if (!cols.length) return header(3, d.title || '데이터 테이블');
      const head = '| ' + cols.map(c => c.label || c.key).join(' | ') + ' |';
      const sep = '|' + cols.map(() => '---').join('|') + '|';
      const rows = (d.rows || []).map(r => '| ' + cols.map(c => (r[c.key] ?? '') + '').join(' | ') + ' |');
      return [
        header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '데이터 테이블'}`),
        '', head, sep, ...rows, '',
      ].join('\n');
    }
    if (T === 'flow') {
      return [
        header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '플로우 차트'}`),
        '',
        '```mermaid',
        'flowchart TD',
        ...((d.nodes || []).map((n, i) => {
          const id = 'N' + i;
          const k = n.kind || 'process';
          const label = (n.label || '').replace(/"/g, '\\"');
          const shape = k === 'decision' ? `${id}{"${label}"}` : (k === 'start' || k === 'end' ? `${id}(("${label}"))` : `${id}["${label}"]`);
          return '  ' + shape;
        })),
        ...((d.nodes || []).slice(0, -1).map((_, i) => `  N${i} --> N${i + 1}`)),
        '```',
        '',
      ].join('\n');
    }
    if (T === 'diagram') {
      const nodeLines = (d.nodes || []).map(n => {
        const label = (n.label || '').replace(/"/g, '\\"');
        const sub = n.sub ? `\\n${n.sub}` : '';
        return `  ${n.id}["${label}${sub}"]`;
      });
      const edgeLines = (d.edges || []).map(e => {
        const arrow = e.kind === 'dashed' ? '-.->' : '-->';
        const lbl = e.label ? `|${e.label}|` : '';
        return `  ${e.from} ${arrow}${lbl} ${e.to}`;
      });
      return [
        header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '다이어그램'}`),
        '',
        '```mermaid',
        'flowchart LR',
        ...nodeLines,
        ...edgeLines,
        '```',
        '',
      ].join('\n');
    }
    if (T === 'sequence-diagram') {
      const partLines = (d.participants || []).map(p => {
        const role = p.kind === 'actor' ? 'actor' : 'participant';
        const name = (p.name || p.id || '').replace(/"/g, '\\"');
        return `  ${role} ${p.id} as ${name}`;
      });
      const msgLines = (d.messages || []).map(m => {
        const label = (m.label || '').replace(/\n/g, ' ');
        // Mermaid sequence syntax:
        //  ->>  solid head    (sync)
        //  -->> dashed head   (async / return)
        const arrow = (m.kind === 'async' || m.kind === 'return') ? '-->>' : '->>';
        return `  ${m.from}${arrow}${m.to}: ${label}`;
      });
      return [
        header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '시퀀스 다이어그램'}`),
        '',
        '```mermaid',
        'sequenceDiagram',
        ...partLines,
        ...msgLines,
        '```',
        '',
      ].join('\n');
    }
    if (T === 'class-diagram') {
      const classLines = [];
      (d.classes || []).forEach(c => {
        const safeName = (c.name || c.id || 'Class').replace(/\s+/g, '_');
        const lines = [`  class ${safeName} {`];
        if (c.stereotype) {
          const st = (c.stereotype || '').trim().replace(/^<+|>+$/g, '');
          if (st) lines.push(`    <<${st}>>`);
        }
        (c.attrs || []).forEach(a => lines.push(`    ${a}`));
        (c.methods || []).forEach(m => lines.push(`    ${m}`));
        lines.push('  }');
        classLines.push(lines.join('\n'));
      });
      const nameOf = (id) => {
        const c = (d.classes || []).find(x => x.id === id);
        return (c?.name || id || '').replace(/\s+/g, '_');
      };
      const relMap = {
        inherit:   '--|>',
        implement: '..|>',
        compose:   '*--',
        aggregate: 'o--',
        assoc:     '-->',
        depend:    '..>',
      };
      const relLines = (d.relations || []).map(r => {
        const op = relMap[r.kind] || '-->';
        const lbl = r.label ? ` : ${r.label}` : '';
        return `  ${nameOf(r.from)} ${op} ${nameOf(r.to)}${lbl}`;
      });
      return [
        header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '클래스 다이어그램'}`),
        '',
        '```mermaid',
        'classDiagram',
        ...classLines,
        ...relLines,
        '```',
        '',
      ].join('\n');
    }
    if (T === 'ui-design') {
      return [
        header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || 'UI/UX'}`),
        '',
        ...((d.callouts || []).map((c, i) => `${i + 1}. **${c.name || ''}** — ${c.desc || ''}`)),
        '',
      ].join('\n');
    }
    if (T === 'balance-table') {
      const parts = [header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '수치 밸런싱'}`), ''];
      if (d.formula) parts.push(`**공식**: ${d.formula}`, '');
      if ((d.vars || []).length) {
        parts.push('| 변수 | 공식/정의 | 범위 | 기본값 | 민감도/메모 |', '|---|---|---|---|---|');
        for (const v of d.vars) {
          parts.push(`| \`${v.name || ''}\` | ${(v.formula || '').replace(/\n/g, ' ')} | ${v.range || ''} | ${v.defaultValue || ''} | ${(v.sensitivity || v.notes || '').replace(/\n/g, ' ')} |`);
        }
        parts.push('');
      }
      if (d.curve && Array.isArray(d.curve.x)) {
        parts.push(`**커브** (${d.curve.xLabel || 'x'} → ${d.curve.yLabel || 'y'}): ${d.curve.x.map((x, i) => `${x}=${d.curve.y[i]}`).join(' / ')}`, '');
      }
      return parts.join('\n');
    }
    if (T === 'state-machine') {
      const parts = [header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '상태 머신'}`), ''];
      parts.push('#### 상태');
      for (const s of (d.states || [])) {
        parts.push(`- **\`${s.id}\` ${s.name}** *(${s.kind || 'normal'})*`);
        if (s.onEnter) parts.push(`  - onEnter: ${s.onEnter}`);
        if (s.onExit) parts.push(`  - onExit: ${s.onExit}`);
        if ((s.invariants || []).length) parts.push(`  - invariants: ${s.invariants.map(i => `\`${i}\``).join(', ')}`);
      }
      parts.push('', '#### 전이 (state × event → state)');
      if ((d.transitions || []).length) {
        parts.push('| from | event | guard | → to | action |', '|---|---|---|---|---|');
        for (const t of d.transitions) {
          parts.push(`| \`${t.from}\` | \`${t.event}\` | ${t.guard ? '`' + t.guard + '`' : '-'} | \`${t.to}\` | ${(t.action || '').replace(/\n/g, ' ')} |`);
        }
      }
      return parts.join('\n');
    }
    if (T === 'api-contract') {
      const parts = [
        header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}\`${d.method || 'POST'} ${d.endpoint || ''}\``),
        '',
        `**Auth**: ${d.auth || 'bearer'} · **SLA**: ${d.slaMs || 200}ms`,
        '',
        '#### Request', '```json', d.request || '{}', '```', '',
        '#### Response', '```json', d.response || '{}', '```', '',
      ];
      if ((d.errors || []).length) {
        parts.push('#### Errors', '| code | message | when |', '|---|---|---|');
        for (const e of d.errors) parts.push(`| \`${e.code}\` | ${e.message || ''} | ${e.when || ''} |`);
        parts.push('');
      }
      if (d.idempotencyKey) parts.push(`**Idempotency**: ${d.idempotencyKey}`, '');
      if (d.notes) parts.push(`**Notes**: ${d.notes}`, '');
      return parts.join('\n');
    }
    if (T === 'acceptance-criteria') {
      const s = d.userStory || {};
      const parts = [
        header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '수락 기준'}`),
        '',
        `> **As a** ${s.as || ''}, **I want** ${s.want || ''}, **so that** ${s.soThat || ''}`,
        '',
      ];
      for (const c of (d.criteria || [])) {
        parts.push(`#### ${c.id || ''}`);
        parts.push(`- **GIVEN** ${c.given || ''}`);
        parts.push(`- **WHEN** ${c.when || ''}`);
        parts.push(`- **THEN** ${c.then || ''}`);
        if ((c.edgeCases || []).length) {
          parts.push('- **Edge cases**:');
          for (const e of c.edgeCases) parts.push(`  - ${e}`);
        }
        parts.push('');
      }
      return parts.join('\n');
    }
    if (T === 'telemetry') {
      const parts = [header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '텔레메트리'}`), ''];
      for (const e of (d.events || [])) {
        parts.push(`#### \`${e.name || ''}\``);
        if (e.kpi) parts.push(`> KPI: **${e.kpi}**`);
        if (e.when) parts.push(`*발생 시점*: ${e.when}`);
        if ((e.props || []).length) {
          parts.push('', '| key | type | req | 설명 |', '|---|---|---|---|');
          for (const p of e.props) parts.push(`| \`${p.key}\` | \`${p.type}\` | ${p.required ? 'Y' : 'N'} | ${p.note || ''} |`);
        }
        parts.push('');
      }
      if ((d.funnels || []).length) {
        parts.push('#### Funnels');
        for (const f of d.funnels) {
          parts.push(`- **${f.name}**: ${(f.steps || []).join(' → ')} *(${f.goal || ''})*`);
        }
      }
      return parts.join('\n');
    }
    if (T === 'risk-register') {
      const parts = [
        header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '위험 등기부'}`),
        '',
        '| ID | 위험 | 영향 | 빈도 | 점수 | 완화책 | 담당 | 상태 |',
        '|---|---|---|---|---|---|---|---|',
      ];
      const risks = [...(d.risks || [])].sort((a, b) => ((b.impact || 0) * (b.likelihood || 0)) - ((a.impact || 0) * (a.likelihood || 0)));
      for (const r of risks) {
        const sc = (r.impact || 0) * (r.likelihood || 0);
        parts.push(`| ${r.id || ''} | ${r.title || ''} | ${r.impact || 0} | ${r.likelihood || 0} | **${sc}** | ${r.mitigation || ''} | ${r.owner || ''} | \`${r.status || 'open'}\` |`);
      }
      return parts.join('\n');
    }
    if (T === 'roadmap') {
      const parts = [header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '로드맵'}`), ''];
      for (const p of (d.phases || [])) {
        parts.push(`### ${p.name} — \`${p.start} → ${p.end}\``);
        if ((p.dependsOn || []).length) parts.push(`*의존*: ${p.dependsOn.join(', ')}`);
        for (const dv of (p.deliverables || [])) parts.push(`- ${dv}`);
        parts.push('');
      }
      return parts.join('\n');
    }
    if (T === 'resources') {
      const parts = [header(3, `${sectionLabel ? '[' + sectionLabel + '] ' : ''}${d.title || '필요 리소스'}`), ''];
      for (const c of (d.categories || [])) {
        parts.push(`#### ${c.name || ''} ${c.count ? '`' + c.count + '`' : ''}`);
        if (c.guideline) {
          parts.push('');
          parts.push(`> **가이드라인** — ${c.guideline.replace(/\n/g, '  \n> ')}`);
        }
        parts.push('');
        for (const it of (c.items || [])) {
          if (typeof it === 'string') {
            parts.push(`- ${it}`);
          } else {
            const name = it.name || '';
            const lines = [`- **${name}**`];
            if (it.spec) lines.push(`  - 사양: \`${it.spec}\``);
            if (it.example) lines.push(`  - 예시: *${it.example}*`);
            parts.push(lines.join('\n'));
          }
        }
        parts.push('');
      }
      return parts.join('\n');
    }
    return `### [${T}] ${d.title || ''}\n\n*(이 슬라이드 타입은 마크다운 변환 미지원)*\n`;
  }

  function exportMarkdown(project) {
    if (!project) throw new Error('내보낼 기획서가 없습니다.');
    const slides = project.slides || [];
    const md = [
      `# ${project.title || '기획서'}`,
      project.subtitle ? `> ${project.subtitle}` : '',
      '',
      `**${project.team || ''}** · ${project.author || ''} · ${project.version || ''} · ${project.updatedAt || ''}`,
      '',
      '---',
      '',
      ...slides.map((s, i) => slideToMarkdown(s, i, slides.length)),
      '',
    ].filter(x => x !== null && x !== undefined).join('\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title || 'gdd'}.md`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ===== Slide PNG export (단일 슬라이드) ===== */
  async function exportSlidePng(slide, page, totalPages) {
    if (!window.html2canvas) throw new Error('html2canvas 미로드.');
    const sandbox = document.createElement('div');
    sandbox.style.cssText = `
      position: fixed; left: -99999px; top: 0;
      width: 1280px; height: 720px; background: white;
      font-family: 'Pretendard', sans-serif;
    `;
    document.body.appendChild(sandbox);
    try {
      const root = window.ReactDOM.createRoot(sandbox);
      await new Promise(resolve => {
        root.render(window.React.createElement(window.SlideRenderer, {
          slide, patch: () => {}, page: page || 1, totalPages: totalPages || 1,
        }));
        requestAnimationFrame(() => setTimeout(resolve, 80));
      });
      const canvas = await window.html2canvas(sandbox.querySelector('.slide') || sandbox, {
        backgroundColor: '#ffffff', scale: 2, useCORS: true,
        width: 1280, height: 720, windowWidth: 1280, windowHeight: 720,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      const title = slide?.data?.title || `slide-${page || 1}`;
      a.href = dataUrl;
      a.download = `${title.replace(/[\/\\?%*:|"<>]/g, '_')}.png`;
      a.click();
      root.unmount();
    } finally {
      document.body.removeChild(sandbox);
    }
  }

  /* ===== Diagram/Flow → SVG export =====
   * diagram 슬라이드는 이미 SVG로 렌더. flow는 별도 SVG 생성.
   */
  function diagramToSvg(slide) {
    const d = slide.data || {};
    const nodes = d.nodes || [];
    const edges = d.edges || [];
    if (!nodes.length) return null;

    const W = 1280, H = 720;
    const padX = 80, padY = 100;
    const cols = Math.max(2, Math.min(4, Math.max(...nodes.map(n => (n.col ?? 0))) + 1));
    const rows = Math.max(1, Math.max(...nodes.map(n => (n.row ?? 0))) + 1);
    const nodeW = (W - padX * 2 - (cols - 1) * 36) / cols;
    const nodeH = 80;
    const ySpace = rows > 1 ? (H - padY * 2 - nodeH) / (rows - 1) : 0;
    const KIND_FILL = {
      start: '#4cc2ff', end: '#1c222b', decision: '#fff8dc', service: '#ecf3ff', data: '#f0f9eb', process: '#ffffff',
    };
    const KIND_STROKE = {
      start: '#2b88c4', end: '#000000', decision: '#d29922', service: '#58a6ff', data: '#3fb950', process: '#303a45',
    };

    const placed = nodes.map(n => {
      const col = Math.min(cols - 1, Math.max(0, n.col ?? 0));
      const row = Math.min(rows - 1, Math.max(0, n.row ?? 0));
      return {
        ...n,
        x: padX + col * (nodeW + 36),
        y: padY + row * ySpace,
        w: nodeW,
        h: nodeH,
      };
    });
    const byId = Object.fromEntries(placed.map(n => [n.id, n]));

    const esc = (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const edgeSvg = edges.map(e => {
      const a = byId[e.from], b = byId[e.to];
      if (!a || !b) return '';
      const ax = a.x + a.w / 2, ay = a.y + a.h;
      const bx = b.x + b.w / 2, by = b.y;
      const midY = (ay + by) / 2;
      const path = Math.abs(ax - bx) < 4
        ? `M ${ax} ${ay} L ${bx} ${by - 6}`
        : `M ${ax} ${ay} L ${ax} ${midY} L ${bx} ${midY} L ${bx} ${by - 6}`;
      const dash = e.kind === 'dashed' ? 'stroke-dasharray="6 4"' : '';
      const width = e.kind === 'thin' ? '1' : '2';
      const label = e.label
        ? `<text x="${(ax + bx) / 2}" y="${midY - 6}" font-family="JetBrains Mono, monospace" font-size="11" fill="#4cc2ff" text-anchor="middle" font-weight="700">${esc(e.label)}</text>`
        : '';
      return `<path d="${path}" stroke="#303a45" stroke-width="${width}" fill="none" ${dash} marker-end="url(#arr)"/>${label}`;
    }).join('\n');

    const nodeSvg = placed.map(n => {
      const fill = KIND_FILL[n.kind] || KIND_FILL.process;
      const stroke = KIND_STROKE[n.kind] || KIND_STROKE.process;
      const textColor = (n.kind === 'end') ? '#e6edf3' : '#1c222b';
      const sub = n.sub ? `<text x="${n.x + n.w / 2}" y="${n.y + n.h - 12}" font-family="JetBrains Mono, monospace" font-size="10" fill="${textColor}" text-anchor="middle" opacity="0.65">${esc(n.sub.toUpperCase())}</text>` : '';
      return `<g>
        <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
        <text x="${n.x + n.w / 2}" y="${n.y + n.h / 2 + 4}" font-family="Pretendard, sans-serif" font-size="14" font-weight="700" fill="${textColor}" text-anchor="middle">${esc(n.label)}</text>
        ${sub}
      </g>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#303a45"/>
    </marker>
  </defs>
  <rect width="${W}" height="${H}" fill="white"/>
  <text x="80" y="50" font-family="Pretendard, sans-serif" font-size="28" font-weight="800" fill="#1c222b">${esc(d.title || '')}</text>
  ${edgeSvg}
  ${nodeSvg}
</svg>`;
  }

  function flowToSvg(slide) {
    const d = slide.data || {};
    const nodes = d.nodes || [];
    if (!nodes.length) return null;
    const W = 1280, H = 720;
    const cx = W / 2;
    const nodeH = 56;
    const gap = 18;
    const totalH = nodes.length * nodeH + (nodes.length - 1) * gap;
    const topY = (H - totalH) / 2 + 30;
    const nodeW = 320;
    const KIND_FILL = { start: '#4cc2ff', end: '#1c222b', decision: '#fff8dc', process: '#ffffff' };
    const KIND_STROKE = { start: '#2b88c4', end: '#000000', decision: '#d29922', process: '#303a45' };
    const KIND_TEXT = { end: '#e6edf3' };
    const esc = (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const nodeSvg = nodes.map((n, i) => {
      const y = topY + i * (nodeH + gap);
      const fill = KIND_FILL[n.kind] || KIND_FILL.process;
      const stroke = KIND_STROKE[n.kind] || KIND_STROKE.process;
      const tc = KIND_TEXT[n.kind] || '#1c222b';
      const arrow = (i < nodes.length - 1)
        ? `<line x1="${cx}" y1="${y + nodeH + 2}" x2="${cx}" y2="${y + nodeH + gap - 4}" stroke="#303a45" stroke-width="2" marker-end="url(#arr)"/>`
        : '';
      return `<rect x="${cx - nodeW / 2}" y="${y}" width="${nodeW}" height="${nodeH}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
      <text x="${cx}" y="${y + nodeH / 2 + 5}" font-family="Pretendard, sans-serif" font-size="14" font-weight="700" fill="${tc}" text-anchor="middle">${esc(n.label)}</text>
      ${arrow}`;
    }).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#303a45"/></marker></defs>
  <rect width="${W}" height="${H}" fill="white"/>
  <text x="${cx}" y="55" font-family="Pretendard, sans-serif" font-size="28" font-weight="800" fill="#1c222b" text-anchor="middle">${esc(d.title || '')}</text>
  ${nodeSvg}
</svg>`;
  }

  function exportSlideSvg(slide) {
    let svg = null;
    if (slide.type === 'diagram') svg = diagramToSvg(slide);
    else if (slide.type === 'flow') svg = flowToSvg(slide);
    if (!svg) throw new Error('이 슬라이드 타입은 SVG 출력을 지원하지 않습니다 (diagram, flow만 지원). PNG를 사용하세요.');
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(slide.data?.title || 'slide').replace(/[\/\\?%*:|"<>]/g, '_')}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  window.exportPdf = exportPdf;
  window.exportMarkdown = exportMarkdown;
  window.exportSlidePng = exportSlidePng;
  window.exportSlideSvg = exportSlideSvg;
})();
