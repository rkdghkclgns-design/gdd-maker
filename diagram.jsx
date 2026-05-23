/* === Diagram slide (2D node graph) + AI helpers for diagrams/flows === */

/* Diagram data shape:
   {
     section, sectionName, title,
     nodes: [{ id, label, sub?, kind: 'start'|'process'|'decision'|'end'|'service'|'data',
               col: 0..3, row: 0..N }],
     edges: [{ from, to, label?, kind?: 'solid'|'dashed'|'thin' }]
   }
*/

/* Grid-based positioning: convert col/row to absolute px within slide viewport.
   Slide content area (after 56px padding + ~120px header/footer) is roughly 1136x520.
   We give 4 columns × N rows. */

function computeDiagramLayout(nodes, viewW, viewH, padX = 24, padY = 16) {
  if (!nodes || !nodes.length) return [];
  const cols = Math.max(2, Math.min(4, Math.max(...nodes.map(n => (n.col ?? 0))) + 1));
  const rows = Math.max(1, Math.max(...nodes.map(n => (n.row ?? 0))) + 1);
  const w = (viewW - padX * 2 - (cols - 1) * 36) / cols; // node width
  const h = 64;
  // Always fit within container: divide available height by (rows - 1) spans.
  const ySpace = rows > 1 ? (viewH - padY * 2 - h) / (rows - 1) : 0;
  return nodes.map(n => {
    const col = Math.min(cols - 1, Math.max(0, n.col ?? 0));
    const row = Math.min(rows - 1, Math.max(0, n.row ?? 0));
    const x = padX + col * (w + 36);
    const y = padY + row * ySpace;
    return { ...n, _x: x, _y: y, _w: w, _h: h };
  });
}

function DiagramSlide({ data, patch, page, totalPages }) {
  const wrapRef = React.useRef(null);
  const [size, setSize] = React.useState({ w: 1136, h: 520 });
  const [aiOpen, setAiOpen] = React.useState(false);

  React.useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => {
      if (wrapRef.current) setSize({ w: wrapRef.current.clientWidth, h: wrapRef.current.clientHeight });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const laidOut = React.useMemo(() => computeDiagramLayout(data.nodes || [], size.w, size.h), [data.nodes, size]);

  const nodesById = {};
  laidOut.forEach(n => { nodesById[n.id] = n; });

  /* Edge path: simple step-routing.
     If same column: vertical line.
     Otherwise: out from bottom of A → horizontal → into top of B (or side). */
  const renderEdge = (e, i) => {
    const a = nodesById[e.from];
    const b = nodesById[e.to];
    if (!a || !b) return null;
    const ax = a._x + a._w / 2, ay = a._y + a._h;
    const bx = b._x + b._w / 2, by = b._y;
    let d;
    let labelX, labelY;
    if (Math.abs(ax - bx) < 4) {
      d = `M ${ax} ${ay} L ${bx} ${by - 6}`;
      labelX = ax + 8; labelY = (ay + by) / 2;
    } else {
      const midY = (ay + by) / 2;
      d = `M ${ax} ${ay} L ${ax} ${midY} L ${bx} ${midY} L ${bx} ${by - 6}`;
      labelX = (ax + bx) / 2; labelY = midY - 6;
    }
    const cls = 'diagram-edge ' + (e.kind === 'dashed' ? 'dashed' : e.kind === 'thin' ? 'thin' : '');
    return (
      <g key={i}>
        <path d={d} className={cls} markerEnd="url(#arrow)" />
        {e.label && <text x={labelX} y={labelY} className="diagram-edge-label" textAnchor="middle">{e.label}</text>}
      </g>
    );
  };

  const updateNode = (idx, field, value) => {
    const nodes = [...(data.nodes || [])];
    nodes[idx] = { ...nodes[idx], [field]: value };
    patch({ nodes });
  };
  const deleteNode = (id) => {
    const nodes = (data.nodes || []).filter(n => n.id !== id);
    const edges = (data.edges || []).filter(e => e.from !== id && e.to !== id);
    patch({ nodes, edges });
  };
  const cycleKind = (idx) => {
    const order = ['process', 'start', 'decision', 'service', 'data', 'end'];
    const cur = data.nodes[idx].kind || 'process';
    const next = order[(order.indexOf(cur) + 1) % order.length];
    updateNode(idx, 'kind', next);
  };
  const addNode = () => {
    const maxRow = Math.max(0, ...(data.nodes || []).map(n => n.row ?? 0)) + 1;
    const newNode = { id: 'n' + uid().slice(0, 4), label: '새 노드', kind: 'process', col: 1, row: maxRow };
    patch({ nodes: [...(data.nodes || []), newNode] });
  };

  const runAi = async (prompt) => {
    const result = await aiGenerateDiagram(prompt);
    if (result) patch(result);
    setAiOpen(false);
  };

  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />

      <div className="flow-edit-bar">
        <button className="mini-btn" onClick={addNode}>+ 노드</button>
        <button className="mini-btn ai" onClick={() => setAiOpen(true)}>✦ AI로 그리기</button>
      </div>

      <div className="diagram-wrap" ref={wrapRef}>
        <svg className="diagram-svg" viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#303a45" />
            </marker>
          </defs>
          {(data.edges || []).map(renderEdge)}
        </svg>
        {laidOut.map((n, idx) => (
          <div
            key={n.id}
            className={'diagram-node ' + (n.kind || 'process')}
            style={{ left: n._x, top: n._y, width: n._w, height: n._h }}
          >
            <div style={{ width: '100%' }}>
              <Editable
                value={n.label}
                onChange={(v) => updateNode(idx, 'label', v)}
                multiline
                tag="div"
              />
              {n.sub && (
                <Editable
                  tag="div"
                  className="sub"
                  value={n.sub}
                  onChange={(v) => updateNode(idx, 'sub', v)}
                />
              )}
            </div>
            <div className="diagram-node-controls">
              <button title="유형 변경" onClick={() => cycleKind(idx)}>⇄</button>
              <button title="왼쪽" disabled={(n.col ?? 0) <= 0} onClick={() => updateNode(idx, 'col', Math.max(0, (n.col ?? 0) - 1))}>◀</button>
              <button title="오른쪽" disabled={(n.col ?? 0) >= 3} onClick={() => updateNode(idx, 'col', Math.min(3, (n.col ?? 0) + 1))}>▶</button>
              <button title="위로" disabled={(n.row ?? 0) <= 0} onClick={() => updateNode(idx, 'row', Math.max(0, (n.row ?? 0) - 1))}>▲</button>
              <button title="아래로" onClick={() => updateNode(idx, 'row', (n.row ?? 0) + 1)}>▼</button>
              <button title="삭제" className="del" onClick={() => deleteNode(n.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {aiOpen && <AiDrawModal onClose={() => setAiOpen(false)} onRun={runAi} placeholder="예: 매칭 → 로딩 → 카운트다운 → 데스매치 → 결과 화면 의 흐름. 데스매치 단계는 사망 분기와 시간 종료 분기를 가짐." />}

      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ====== Inline AI prompt modal (floats on slide) ====== */
function AiDrawModal({ onClose, onRun, placeholder, running }) {
  const [text, setText] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const run = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try { await onRun(text); } finally { setBusy(false); }
  };
  return (
    <div className="ai-draw-modal" onClick={e => e.stopPropagation()}>
      <div className="h">
        <span>✦ AI로 다이어그램 그리기</span>
        <button style={{ background: 'transparent', color: 'var(--text-3)', border: 0, cursor: 'pointer' }} onClick={onClose}>✕</button>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={placeholder}
        autoFocus
        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) run(); }}
      />
      <div className="row">
        <button className="btn ghost" onClick={onClose} disabled={busy}>취소</button>
        <button className="btn primary" onClick={run} disabled={busy || !text.trim()}>
          {busy ? '생성 중…' : '그리기  ⌘↵'}
        </button>
      </div>
    </div>
  );
}

/* ====== Enhanced Flow slide (with edit controls and AI) ======
 *
 * direction: 'vertical' | 'horizontal' | 'grid'
 *   - vertical  → 위에서 아래 (전통적)
 *   - horizontal → 좌에서 우 (가로 흐름, 가독성 ↑)
 *   - grid      → 자동 wrap (노드 7개 이상에서 가장 가독성 좋음)
 * direction 이 비어있으면 노드 수에 따라 자동 선택.
 */
function EnhancedFlowSlide({ data, patch, page, totalPages }) {
  const [aiOpen, setAiOpen] = React.useState(false);
  const wrapRef = React.useRef(null);
  const chartRef = React.useRef(null);

  const nodeCount = (data.nodes || []).length;
  // direction 미지정 시 노드 수 기반 자동 선택
  const autoDir = nodeCount <= 5 ? 'vertical' : nodeCount <= 8 ? 'horizontal' : 'grid';
  const direction = data.direction || autoDir;

  /* 폴백 스케일 — 측정 실패 시에도 노드 수·방향 기반으로 보수적 스케일을 적용해 footer 침범 방지 */
  const fallbackScale = React.useMemo(() => {
    const nodes = data.nodes || [];
    const n = nodes.length;
    const avgLen = n ? nodes.reduce((s, x) => s + ((x.label || '').length), 0) / n : 0;
    const hasLongLabels = avgLen > 14;
    // 가로/그리드는 폭이 넉넉해서 vertical 보다 큰 스케일 허용
    if (direction === 'horizontal') {
      if (n <= 4) return 1;
      if (n <= 6) return 0.9;
      if (n <= 8) return 0.78;
      if (n <= 10) return 0.68;
      return hasLongLabels ? 0.55 : 0.6;
    }
    if (direction === 'grid') {
      if (n <= 6) return 1;
      if (n <= 9) return 0.9;
      if (n <= 12) return 0.78;
      return hasLongLabels ? 0.62 : 0.7;
    }
    // vertical
    if (n <= 5) return hasLongLabels ? 0.9 : 1;
    if (n <= 6) return hasLongLabels ? 0.75 : 0.85;
    if (n <= 7) return hasLongLabels ? 0.66 : 0.76;
    if (n <= 8) return hasLongLabels ? 0.58 : 0.66;
    if (n <= 9) return hasLongLabels ? 0.5 : 0.58;
    if (n <= 10) return hasLongLabels ? 0.44 : 0.5;
    if (n <= 12) return hasLongLabels ? 0.38 : 0.44;
    return hasLongLabels ? 0.32 : 0.38;
  }, [data.nodes, direction]);
  const [chartScale, setChartScale] = React.useState(fallbackScale);
  React.useEffect(() => { setChartScale(fallbackScale); }, [fallbackScale]);

  const updateNode = (i, key, val) => {
    const nodes = [...(data.nodes || [])];
    nodes[i] = { ...nodes[i], [key]: val };
    patch({ nodes });
  };
  const insertNodeAt = (i) => {
    const nodes = [...(data.nodes || [])];
    nodes.splice(i, 0, { kind: 'process', label: '새 단계' });
    patch({ nodes });
  };
  const removeNode = (i) => {
    const nodes = (data.nodes || []).filter((_, idx) => idx !== i);
    patch({ nodes });
  };
  const moveNode = (i, delta) => {
    const nodes = [...(data.nodes || [])];
    const j = i + delta;
    if (j < 0 || j >= nodes.length) return;
    [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
    patch({ nodes });
  };

  const runAi = async (prompt) => {
    const result = await aiGenerateFlow(prompt);
    if (result) patch(result);
    setAiOpen(false);
  };

  /* Auto-fit chart inside wrap.
   * - 자식 노드들의 offsetHeight 합산으로 자연 높이 측정 (transform 영향 없음, 항상 정확)
   * - wrap만 observe → ResizeObserver 자기-트리거 루프 방지
   * - useLayoutEffect + rAF → 레이아웃 안정 후 측정 + 페인트 전 적용 (깜박임 방지)
   * - transform-origin: center center → 좌우 양쪽 패딩이 균형있게 확보
   */
  React.useLayoutEffect(() => {
    if (!wrapRef.current || !chartRef.current) return;
    let raf = 0;
    const recompute = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!wrapRef.current || !chartRef.current) return;
        const wh = wrapRef.current.clientHeight;
        const ww = wrapRef.current.clientWidth;
        if (wh <= 0 || ww <= 0) return;
        // 자연 높이 = 자식 노드/화살표의 offsetHeight 합 + flex gap
        let naturalH = 0;
        let naturalW = 0;
        const kids = chartRef.current.children;
        for (const k of kids) {
          naturalH += k.offsetHeight;
          naturalW = Math.max(naturalW, k.offsetWidth);
        }
        if (naturalH <= 0 || naturalW <= 0) return;
        // flex gap 보정
        const cs = window.getComputedStyle(chartRef.current);
        const gap = parseFloat(cs.rowGap) || parseFloat(cs.gap) || 0;
        if (gap > 0 && kids.length > 1) {
          naturalH += (kids.length - 1) * gap;
        }
        // safety margin 16px
        const sH = (wh - 16) / naturalH;
        const sW = (ww - 16) / naturalW;
        const measured = Math.min(sH, sW, 1);
        // 측정값과 폴백 중 더 작은(=안전한) 값 사용. 측정이 부정확하게 1.0을 주더라도 폴백이 살림.
        setChartScale(Math.max(0.28, Math.min(measured, fallbackScale)));
      });
    };
    // 첫 측정 - layout 안정화를 위해 2번 시도
    recompute();
    const t1 = setTimeout(recompute, 50);
    const t2 = setTimeout(recompute, 200);
    const ro = new ResizeObserver(recompute);
    ro.observe(wrapRef.current);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [(data.nodes || []).length, (data.nodes || []).map(n => (n.label || '') + ':' + (n.kind || '')).join('|'), fallbackScale]);

  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />

      <div className="flow-edit-bar">
        <button className="mini-btn" onClick={() => insertNodeAt((data.nodes || []).length)}>+ 단계</button>
        <button className="mini-btn ai" onClick={() => setAiOpen(true)}>✦ AI로 그리기</button>
        {/* 레이아웃 방향 토글 */}
        <div className="flow-dir-toggle" title="배치 방향">
          {[
            { v: 'vertical',   label: '↓ 세로', t: '세로 한 줄' },
            { v: 'horizontal', label: '→ 가로', t: '가로 한 줄' },
            { v: 'grid',       label: '▦ 그리드', t: '자동 wrap 그리드' },
          ].map(opt => (
            <button
              key={opt.v}
              className={'mini-btn dir ' + (direction === opt.v ? 'on' : '')}
              onClick={() => patch({ direction: opt.v })}
              title={opt.t}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="flow-wrap" ref={wrapRef} style={{ overflow: 'hidden' }}>
        <div
          className={'flow-chart flow-chart-edit flow-dir-' + direction}
          ref={chartRef}
          style={{ transform: `scale(${chartScale})`, transformOrigin: 'center center' }}
        >
          {(data.nodes || []).map((n, i, arr) => (
            <React.Fragment key={i}>
              <div className="flow-node-wrap" data-idx={String(i + 1).padStart(2, '0')}>
                <div className={'flow-node ' + (n.kind || 'process')}>
                  <Editable value={n.label} onChange={(v) => updateNode(i, 'label', v)} multiline />
                </div>
                <div className="flow-node-controls">
                  <button title="이전" disabled={i === 0} onClick={() => moveNode(i, -1)}>{direction === 'horizontal' ? '←' : '↑'}</button>
                  <button title="다음" disabled={i === arr.length - 1} onClick={() => moveNode(i, +1)}>{direction === 'horizontal' ? '→' : '↓'}</button>
                  <select value={n.kind || 'process'} onChange={e => updateNode(i, 'kind', e.target.value)}>
                    <option value="start">start</option>
                    <option value="process">process</option>
                    <option value="decision">decision</option>
                    <option value="end">end</option>
                  </select>
                  <button className="del" onClick={() => removeNode(i)} title="삭제">✕</button>
                </div>
              </div>
              {i < arr.length - 1 && direction !== 'grid' && (
                <div className={'flow-arrow-wrap flow-arrow-' + direction}>
                  <div className="flow-arrow"></div>
                  <div className="flow-arrow-add">
                    <button onClick={() => insertNodeAt(i + 1)} title="중간에 단계 추가">+</button>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {aiOpen && <AiDrawModal
        onClose={() => setAiOpen(false)}
        onRun={runAi}
        placeholder="예: 플레이어 사망 처리 FLOW. HP가 0 이하가 되면 사망 판정, 입력 차단, 카메라 전환, 매치 종료 시 결과 패널 출력."
      />}

      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ===== AI helpers for diagrams and flows ===== */
async function aiGenerateFlow(prompt) {
  const persona = window.SENIOR_PERSONA || '';
  const ai = `${persona}

# 임무
30년차 시니어 게임 메이커로서, 아래 설명에 맞는 게임 시스템 플로우 차트를 노드 배열로 작성하라.

설명: "${prompt}"

# 출력 형식 (JSON만, 코드블록 금지)
{
  "nodes": [
    { "kind": "start|process|decision|end", "label": "노드 라벨" }
  ]
}

# 시니어 표준 작성 기준
- 노드 6~10개. 첫 노드 kind="start", 마지막 kind="end".
- 정상 흐름만 늘어놓지 말고, decision 노드를 1~2개 포함해 분기(실패/예외/취소)를 표현.
- decision 라벨은 조건을 직접 명시 ("HP ≤ 0 ?", "타이머 = 300s ?", "재시도 가능 ?" 처럼).
- process 라벨은 "동사+목적어" 형태로 구체적 ("입력 차단·충돌 비활성화", "사망 카메라 전환" 등).
- 라벨은 18자 이내, 약어 활용 가능.
- 시스템 간 책임 경계가 있으면 라벨에 표기 (예: "클라:애니재생", "서버:HP갱신").`;

  try {
    const raw = await window.gemini.complete(ai);
    const parsed = window.parseAiJson(raw);
    if (parsed.nodes && Array.isArray(parsed.nodes)) return parsed;
  } catch (e) {
    if (window.gddToast) try { window.gddToast('AI 플로우 생성 실패: ' + (e?.message || e), 'err'); } catch {}
  }
  return null;
}

async function aiGenerateDiagram(prompt) {
  const persona = window.SENIOR_PERSONA || '';
  const ai = `${persona}

# 임무
30년차 시니어 게임 메이커로서, 아래 설명에 맞는 2D 시스템 다이어그램(노드와 화살표)을 작성하라. 클라/서버/외부서비스/데이터 저장소의 역할이 분명히 드러나야 한다.

설명: "${prompt}"

# 출력 형식 (JSON만, 코드블록 금지)
{
  "nodes": [
    { "id": "n1", "label": "노드 라벨", "sub": "영문 약어/Tech 식별자", "kind": "start|process|decision|end|service|data", "col": 0..3, "row": 0..N }
  ],
  "edges": [
    { "from": "n1", "to": "n2", "label": "호출/이벤트 이름", "kind": "solid|dashed|thin" }
  ]
}

# 시니어 표준 작성 기준
- **노드 5~9개**. id는 n1, n2... 형식.
- col은 0~3 사이 정수(왼→오), row는 0부터 시작(위→아래). 같은 row에 병렬 컴포넌트 배치 가능.
- **kind 의미**: start(진입점), end(종착점), decision(분기), service(서비스/마이크로서비스), data(DB/캐시/저장소), process(일반 컴포넌트).
- **sub 필드**: 시스템의 정체를 영문 약어로 표기. 예: 클라이언트→"CLIENT", 게임서버→"GAME_SERVER", DB→"POSTGRES"/"REDIS", 외부 서비스→"AUTH_SVC"/"PAYMENT" 등. 시니어가 보면 한눈에 스택을 알 수 있어야 한다.
- **edges 라벨**: 실제 호출명·이벤트명에 가깝게. "session.create", "match.end", "payment.callback", "auth.refresh" 같은 패턴. 단순 화살표만 그리지 말 것.
- 비동기/이벤트성 통신은 kind="dashed", 보조적·낮은 빈도 호출은 "thin"으로 구분.
- 라벨은 한국어, sub와 edges 라벨은 영문 식별자 권장.`;

  try {
    const raw = await window.gemini.complete(ai);
    const parsed = window.parseAiJson(raw);
    if (parsed.nodes && parsed.edges) return parsed;
  } catch (e) {
    if (window.gddToast) try { window.gddToast('AI 다이어그램 생성 실패: ' + (e?.message || e), 'err'); } catch {}
  }
  return null;
}

function stripJson(raw) {
  raw = (raw || '').trim();
  if (raw.startsWith('```')) raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const f = raw.indexOf('{'), l = raw.lastIndexOf('}');
  if (f >= 0 && l >= 0) raw = raw.slice(f, l + 1);
  return raw;
}

/* ====== 12. Sequence diagram (시퀀스 다이어그램) ====== */
function SequenceDiagramSlide({ data, patch, page, totalPages }) {
  const wrapRef = React.useRef(null);
  const [size, setSize] = React.useState({ w: 760, h: 480 });
  const [aiOpen, setAiOpen] = React.useState(false);

  React.useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => {
      if (wrapRef.current) setSize({ w: wrapRef.current.clientWidth, h: wrapRef.current.clientHeight });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const participants = data.participants || [];
  const messages = data.messages || [];

  const TOP_PAD = 14;
  const PART_H = 44;
  const MSG_GAP = 36;
  const PART_W = 124;
  const sideMargin = 28;
  const lifelineCount = Math.max(1, participants.length);
  const innerW = Math.max(220, size.w - sideMargin * 2);
  const colWidth = lifelineCount > 1 ? innerW / (lifelineCount - 1) : 0;
  const partXs = participants.map((_, i) => {
    if (lifelineCount === 1) return size.w / 2;
    return sideMargin + i * colWidth;
  });
  const partById = {};
  participants.forEach((p, i) => { partById[p.id] = { x: partXs[i], idx: i, ...p }; });
  const contentH = Math.max(size.h, TOP_PAD + PART_H + 16 + MSG_GAP * (messages.length + 1));

  const updatePart = (i, k, v) => {
    const ps = [...participants];
    ps[i] = { ...ps[i], [k]: v };
    patch({ participants: ps });
  };
  const updateMsg = (i, k, v) => {
    const ms = [...messages];
    ms[i] = { ...ms[i], [k]: v };
    patch({ messages: ms });
  };
  const removePart = (id) => {
    if (participants.length <= 1) return;
    patch({
      participants: participants.filter(p => p.id !== id),
      messages: messages.filter(m => m.from !== id && m.to !== id),
    });
  };
  const removeMsg = (i) => {
    patch({ messages: messages.filter((_, idx) => idx !== i) });
  };
  const addPart = () => {
    const id = 'p' + uid().slice(0, 4);
    patch({ participants: [...participants, { id, name: '참여자', kind: 'system' }] });
  };
  const addMsg = () => {
    if (!participants.length) return;
    const from = participants[0].id;
    const to = (participants[1] || participants[0]).id;
    patch({ messages: [...messages, { from, to, label: '메시지', kind: 'sync' }] });
  };
  const cycleMsgKind = (i) => {
    const order = ['sync', 'async', 'return'];
    const cur = messages[i]?.kind || 'sync';
    updateMsg(i, 'kind', order[(order.indexOf(cur) + 1) % order.length]);
  };
  const cyclePartKind = (i) => {
    const order = ['actor', 'system', 'service', 'data'];
    const cur = participants[i]?.kind || 'system';
    updatePart(i, 'kind', order[(order.indexOf(cur) + 1) % order.length]);
  };
  const movePart = (i, delta) => {
    const j = i + delta;
    if (j < 0 || j >= participants.length) return;
    const ps = [...participants];
    [ps[i], ps[j]] = [ps[j], ps[i]];
    patch({ participants: ps });
  };
  const moveMsg = (i, delta) => {
    const j = i + delta;
    if (j < 0 || j >= messages.length) return;
    const ms = [...messages];
    [ms[i], ms[j]] = [ms[j], ms[i]];
    patch({ messages: ms });
  };

  const runAi = async (prompt) => {
    const result = await aiGenerateSequence(prompt);
    if (result) patch(result);
    setAiOpen(false);
  };

  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />

      <div className="flow-edit-bar">
        <button className="mini-btn" onClick={addPart}>+ 참여자</button>
        <button className="mini-btn" onClick={addMsg} disabled={!participants.length}>+ 메시지</button>
        <button className="mini-btn ai" onClick={() => setAiOpen(true)}>✦ AI로 그리기</button>
      </div>

      <div className="seq-layout">
        <div className="seq-canvas" ref={wrapRef}>
          <svg className="seq-svg" viewBox={`0 0 ${size.w} ${contentH}`}
               width={size.w} height={contentH} preserveAspectRatio="xMidYMin meet">
            <defs>
              <marker id="seq-arrow-fill" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#303a45" />
              </marker>
              <marker id="seq-arrow-open" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9" fill="none" stroke="#303a45" strokeWidth="1.5" strokeLinejoin="round" />
              </marker>
            </defs>
            {participants.map((p, i) => (
              <line key={'ll' + p.id}
                    x1={partXs[i]} y1={TOP_PAD + PART_H}
                    x2={partXs[i]} y2={contentH - 12}
                    stroke="#a3afbb" strokeDasharray="4 5" strokeWidth="1.2" />
            ))}
            {messages.map((m, i) => {
              const a = partById[m.from], b = partById[m.to];
              if (!a || !b) return null;
              const y = TOP_PAD + PART_H + 16 + MSG_GAP * i + MSG_GAP / 2;
              const dashed = m.kind === 'async' || m.kind === 'return';
              const markerEnd = m.kind === 'return' ? 'url(#seq-arrow-open)' : 'url(#seq-arrow-fill)';
              if (a.x === b.x) {
                const off = 32;
                const d = `M ${a.x + 6} ${y - 6} L ${a.x + off} ${y - 6} L ${a.x + off} ${y + 14} L ${a.x + 8} ${y + 14}`;
                return (
                  <g key={'m' + i}>
                    <path d={d} stroke="#303a45" strokeWidth="1.6" fill="none"
                          markerEnd={markerEnd} strokeDasharray={dashed ? '5 4' : undefined} />
                    <text x={a.x + off + 8} y={y + 4} fontSize="11"
                          fontFamily="JetBrains Mono, monospace" fill="#303a45" fontWeight="600">
                      {m.label || ''}
                    </text>
                  </g>
                );
              }
              const labelX = (a.x + b.x) / 2;
              return (
                <g key={'m' + i}>
                  <line x1={a.x} y1={y} x2={b.x} y2={y} stroke="#303a45" strokeWidth="1.6"
                        markerEnd={markerEnd} strokeDasharray={dashed ? '5 4' : undefined} />
                  <text x={labelX} y={y - 6} fontSize="11"
                        fontFamily="JetBrains Mono, monospace" fill="#303a45"
                        textAnchor="middle" fontWeight="600">
                    {m.label || ''}
                  </text>
                </g>
              );
            })}
          </svg>
          {participants.map((p, i) => (
            <div key={'pt' + p.id}
                 className={'seq-participant ' + (p.kind || 'system')}
                 style={{ left: partXs[i] - PART_W / 2, top: TOP_PAD, width: PART_W, height: PART_H }}>
              <Editable value={p.name} onChange={(v) => updatePart(i, 'name', v)} />
              <div className="seq-participant-controls">
                <button onClick={() => cyclePartKind(i)} title="유형">⇄</button>
                <button onClick={() => movePart(i, -1)} disabled={i === 0} title="왼쪽">◀</button>
                <button onClick={() => movePart(i, 1)} disabled={i === participants.length - 1} title="오른쪽">▶</button>
                <button onClick={() => removePart(p.id)} className="del" title="삭제">✕</button>
              </div>
            </div>
          ))}
        </div>
        <div className="seq-editor">
          <div className="seq-editor-head">메시지 편집</div>
          <div className="seq-editor-list">
            {messages.map((m, i) => (
              <div key={'me' + i} className="seq-msg-row">
                <span className="seq-msg-idx">{i + 1}</span>
                <select value={m.from || ''} onChange={(e) => updateMsg(i, 'from', e.target.value)}>
                  {participants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <span style={{ color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>→</span>
                <select value={m.to || ''} onChange={(e) => updateMsg(i, 'to', e.target.value)}>
                  {participants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input type="text" value={m.label || ''} placeholder="메시지"
                       onChange={(e) => updateMsg(i, 'label', e.target.value)}
                       className="seq-msg-label" />
                <button onClick={() => cycleMsgKind(i)} title={m.kind || 'sync'}>
                  {m.kind === 'async' ? '⇢' : m.kind === 'return' ? '↩' : '→'}
                </button>
                <button onClick={() => moveMsg(i, -1)} disabled={i === 0} title="위로">↑</button>
                <button onClick={() => moveMsg(i, 1)} disabled={i === messages.length - 1} title="아래로">↓</button>
                <button onClick={() => removeMsg(i)} className="del" title="삭제">✕</button>
              </div>
            ))}
            {!messages.length && <div className="seq-empty">아직 메시지가 없습니다. "+ 메시지"로 추가하세요.</div>}
          </div>
        </div>
      </div>

      {aiOpen && <AiDrawModal onClose={() => setAiOpen(false)} onRun={runAi}
        placeholder="예: 로그인 시퀀스. 클라이언트 → 게이트웨이 → 인증서버 → DB. JWT 발급 후 응답 흐름." />}

      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ====== 13. Class diagram (클래스 다이어그램) ====== */
function computeClassLayout(classes, viewW, viewH, padX = 18, padY = 10) {
  if (!classes || !classes.length) return [];
  const cols = Math.max(2, Math.min(4, Math.max(...classes.map(n => (n.col ?? 0))) + 1));
  const rows = Math.max(1, Math.max(...classes.map(n => (n.row ?? 0))) + 1);
  const w = (viewW - padX * 2 - (cols - 1) * 28) / cols;
  const h = Math.max(120, Math.min(180, (viewH - padY * 2 - (rows - 1) * 24) / rows));
  const ySpace = rows > 1 ? (viewH - padY * 2 - h) / (rows - 1) : 0;
  return classes.map(c => {
    const col = Math.min(cols - 1, Math.max(0, c.col ?? 0));
    const row = Math.min(rows - 1, Math.max(0, c.row ?? 0));
    return {
      ...c,
      _x: padX + col * (w + 28),
      _y: padY + row * ySpace,
      _w: w,
      _h: h,
    };
  });
}

function ClassDiagramSlide({ data, patch, page, totalPages }) {
  const wrapRef = React.useRef(null);
  const [size, setSize] = React.useState({ w: 760, h: 480 });
  const [aiOpen, setAiOpen] = React.useState(false);

  React.useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => {
      if (wrapRef.current) setSize({ w: wrapRef.current.clientWidth, h: wrapRef.current.clientHeight });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const classes = data.classes || [];
  const relations = data.relations || [];
  const layout = React.useMemo(() => computeClassLayout(classes, size.w, size.h), [classes, size]);
  const byId = {};
  layout.forEach(c => { byId[c.id] = c; });

  const updateClass = (i, k, v) => {
    const cs = [...classes];
    cs[i] = { ...cs[i], [k]: v };
    patch({ classes: cs });
  };
  const updateAttr = (ci, ai, v) => {
    const cs = [...classes];
    const attrs = [...(cs[ci].attrs || [])];
    attrs[ai] = v;
    cs[ci] = { ...cs[ci], attrs };
    patch({ classes: cs });
  };
  const updateMethod = (ci, mi, v) => {
    const cs = [...classes];
    const methods = [...(cs[ci].methods || [])];
    methods[mi] = v;
    cs[ci] = { ...cs[ci], methods };
    patch({ classes: cs });
  };
  const addAttr = (ci) => {
    const cs = [...classes];
    cs[ci] = { ...cs[ci], attrs: [...(cs[ci].attrs || []), '+attr: Type'] };
    patch({ classes: cs });
  };
  const addMethod = (ci) => {
    const cs = [...classes];
    cs[ci] = { ...cs[ci], methods: [...(cs[ci].methods || []), '+method(): void'] };
    patch({ classes: cs });
  };
  const removeAttr = (ci, ai) => {
    const cs = [...classes];
    cs[ci] = { ...cs[ci], attrs: (cs[ci].attrs || []).filter((_, idx) => idx !== ai) };
    patch({ classes: cs });
  };
  const removeMethod = (ci, mi) => {
    const cs = [...classes];
    cs[ci] = { ...cs[ci], methods: (cs[ci].methods || []).filter((_, idx) => idx !== mi) };
    patch({ classes: cs });
  };
  const addClass = () => {
    const id = 'c' + uid().slice(0, 4);
    const maxRow = Math.max(-1, ...classes.map(c => c.row ?? 0)) + 1;
    patch({ classes: [...classes, { id, name: '새 클래스', stereotype: '', attrs: ['+attr: Type'], methods: ['+method(): void'], col: 0, row: maxRow }] });
  };
  const removeClass = (id) => {
    patch({
      classes: classes.filter(c => c.id !== id),
      relations: relations.filter(r => r.from !== id && r.to !== id),
    });
  };
  const addRelation = () => {
    if (classes.length < 2) return;
    patch({ relations: [...relations, { from: classes[0].id, to: classes[1].id, kind: 'assoc', label: '' }] });
  };
  const updateRelation = (i, k, v) => {
    const rs = [...relations];
    rs[i] = { ...rs[i], [k]: v };
    patch({ relations: rs });
  };
  const removeRelation = (i) => {
    patch({ relations: relations.filter((_, idx) => idx !== i) });
  };

  const runAi = async (prompt) => {
    const result = await aiGenerateClass(prompt);
    if (result) patch(result);
    setAiOpen(false);
  };

  const renderRelation = (r, i) => {
    const a = byId[r.from], b = byId[r.to];
    if (!a || !b) return null;
    const ax = a._x + a._w / 2, ay = a._y + a._h / 2;
    const bx = b._x + b._w / 2, by = b._y + b._h / 2;
    const dx = bx - ax, dy = by - ay;
    const ang = Math.atan2(dy, dx);
    const inset = 60;
    const x1 = ax + Math.cos(ang) * inset;
    const y1 = ay + Math.sin(ang) * inset;
    const x2 = bx - Math.cos(ang) * inset;
    const y2 = by - Math.sin(ang) * inset;
    const labelX = (x1 + x2) / 2, labelY = (y1 + y2) / 2;
    const markerStart = r.kind === 'compose' ? 'url(#cls-diamond-fill)'
                     : r.kind === 'aggregate' ? 'url(#cls-diamond-open)' : undefined;
    const markerEnd = r.kind === 'inherit' ? 'url(#cls-triangle)'
                    : r.kind === 'implement' ? 'url(#cls-triangle)'
                    : 'url(#cls-arrow)';
    const dashed = r.kind === 'depend' || r.kind === 'implement';
    return (
      <g key={'r' + i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#303a45" strokeWidth="1.6" fill="none"
              markerStart={markerStart} markerEnd={markerEnd}
              strokeDasharray={dashed ? '6 5' : undefined} />
        {r.label && (
          <text x={labelX} y={labelY - 6} fontSize="11" fontFamily="JetBrains Mono, monospace"
                fill="#303a45" textAnchor="middle" fontWeight="600"
                paintOrder="stroke" stroke="white" strokeWidth="4" strokeLinejoin="round">{r.label}</text>
        )}
      </g>
    );
  };

  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />

      <div className="flow-edit-bar">
        <button className="mini-btn" onClick={addClass}>+ 클래스</button>
        <button className="mini-btn" onClick={addRelation} disabled={classes.length < 2}>+ 관계</button>
        <button className="mini-btn ai" onClick={() => setAiOpen(true)}>✦ AI로 그리기</button>
      </div>

      <div className="cls-layout">
        <div className="cls-canvas" ref={wrapRef}>
          <svg className="cls-svg" viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none">
            <defs>
              <marker id="cls-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9" fill="none" stroke="#303a45" strokeWidth="1.5" />
              </marker>
              <marker id="cls-triangle" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
                <path d="M 0 0 L 12 6 L 0 12 z" fill="white" stroke="#303a45" strokeWidth="1.4" />
              </marker>
              <marker id="cls-diamond-fill" viewBox="0 0 14 12" refX="0" refY="6" markerWidth="14" markerHeight="12" orient="auto">
                <path d="M 0 6 L 7 0 L 14 6 L 7 12 z" fill="#303a45" />
              </marker>
              <marker id="cls-diamond-open" viewBox="0 0 14 12" refX="0" refY="6" markerWidth="14" markerHeight="12" orient="auto">
                <path d="M 0 6 L 7 0 L 14 6 L 7 12 z" fill="white" stroke="#303a45" strokeWidth="1.4" />
              </marker>
            </defs>
            {relations.map(renderRelation)}
          </svg>
          {layout.map((c, ci) => (
            <div key={c.id} className="cls-box"
                 style={{ left: c._x, top: c._y, width: c._w, minHeight: c._h }}>
              <div className="cls-header">
                <Editable className="cls-stereotype" value={c.stereotype || ''}
                          placeholder="<<stereotype>>"
                          onChange={(v) => updateClass(ci, 'stereotype', v)} />
                <Editable className="cls-name" value={c.name}
                          onChange={(v) => updateClass(ci, 'name', v)} />
              </div>
              <div className="cls-section attrs">
                {(c.attrs || []).map((a, ai) => (
                  <div key={ai} className="cls-line">
                    <Editable value={a} onChange={(v) => updateAttr(ci, ai, v)} />
                    <button className="cls-line-del" onClick={() => removeAttr(ci, ai)} title="삭제">✕</button>
                  </div>
                ))}
                <button className="cls-add-btn" onClick={() => addAttr(ci)}>+ attr</button>
              </div>
              <div className="cls-section methods">
                {(c.methods || []).map((m, mi) => (
                  <div key={mi} className="cls-line">
                    <Editable value={m} onChange={(v) => updateMethod(ci, mi, v)} />
                    <button className="cls-line-del" onClick={() => removeMethod(ci, mi)} title="삭제">✕</button>
                  </div>
                ))}
                <button className="cls-add-btn" onClick={() => addMethod(ci)}>+ method</button>
              </div>
              <div className="cls-box-controls">
                <button title="왼쪽" disabled={(c.col ?? 0) <= 0} onClick={() => updateClass(ci, 'col', Math.max(0, (c.col ?? 0) - 1))}>◀</button>
                <button title="오른쪽" disabled={(c.col ?? 0) >= 3} onClick={() => updateClass(ci, 'col', Math.min(3, (c.col ?? 0) + 1))}>▶</button>
                <button title="위" disabled={(c.row ?? 0) <= 0} onClick={() => updateClass(ci, 'row', Math.max(0, (c.row ?? 0) - 1))}>▲</button>
                <button title="아래" onClick={() => updateClass(ci, 'row', (c.row ?? 0) + 1)}>▼</button>
                <button title="삭제" className="del" onClick={() => removeClass(c.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cls-editor">
          <div className="cls-editor-head">관계 편집</div>
          <div className="cls-editor-list">
            {relations.map((r, i) => (
              <div key={'r' + i} className="cls-rel-row">
                <select value={r.from} onChange={(e) => updateRelation(i, 'from', e.target.value)}>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={r.kind || 'assoc'} onChange={(e) => updateRelation(i, 'kind', e.target.value)}>
                  <option value="assoc">→ 연관</option>
                  <option value="inherit">▷ 상속</option>
                  <option value="implement">▷ 구현(점선)</option>
                  <option value="compose">◆ 컴포지션</option>
                  <option value="aggregate">◇ 집합</option>
                  <option value="depend">⇢ 의존(점선)</option>
                </select>
                <select value={r.to} onChange={(e) => updateRelation(i, 'to', e.target.value)}>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="text" value={r.label || ''} placeholder="라벨 (1..*)"
                       onChange={(e) => updateRelation(i, 'label', e.target.value)}
                       className="cls-rel-label" />
                <button onClick={() => removeRelation(i)} className="del" title="삭제">✕</button>
              </div>
            ))}
            {!relations.length && <div className="cls-empty">아직 관계가 없습니다. "+ 관계"로 추가하세요.</div>}
          </div>
        </div>
      </div>

      {aiOpen && <AiDrawModal onClose={() => setAiOpen(false)} onRun={runAi}
        placeholder="예: 인벤토리 시스템의 클래스 구조. Item, Inventory, Stack, Player, Equipment, Slot 의 상속/컴포지션 관계." />}

      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

async function aiGenerateSequence(prompt) {
  const persona = window.SENIOR_PERSONA || '';
  const ai = `${persona}

# 임무
30년차 시니어 게임 메이커로서, 아래 설명에 맞는 시퀀스 다이어그램을 작성하라.

설명: "${prompt}"

# 출력 형식 (JSON만, 코드블록 금지)
{
  "participants": [
    { "id": "p1", "name": "클라이언트", "kind": "actor|system|service|data" }
  ],
  "messages": [
    { "from": "p1", "to": "p2", "label": "auth.login(id, pw)", "kind": "sync|async|return" }
  ]
}

# 시니어 표준 작성 기준
- 참여자 3~6개. id는 p1, p2... 형식. 왼쪽일수록 외부/사용자에 가깝게 배치.
- kind 의미: actor(사용자/외부), system(컴포넌트), service(서비스/마이크로서비스), data(DB/캐시/큐).
- 메시지 6~12개. 실제 호출명·이벤트명으로 라벨 (예: "auth.login(id, pw)", "match.create", "session.persist").
- kind 의미: sync(동기 호출), async(비동기/이벤트), return(응답·콜백).
- 최소 1개의 return 메시지 포함. 비동기성 통신은 async 사용.
- 라벨은 영문 식별자(snake_case 또는 camelCase) 권장.`;

  try {
    const raw = await window.gemini.complete(ai);
    const parsed = window.parseAiJson(raw);
    if (parsed.participants && parsed.messages) return parsed;
  } catch (e) {
    if (window.gddToast) try { window.gddToast('AI 시퀀스 다이어그램 생성 실패: ' + (e?.message || e), 'err'); } catch {}
  }
  return null;
}

async function aiGenerateClass(prompt) {
  const persona = window.SENIOR_PERSONA || '';
  const ai = `${persona}

# 임무
30년차 시니어 게임 메이커로서, 아래 설명에 맞는 UML 클래스 다이어그램을 작성하라.

설명: "${prompt}"

# 출력 형식 (JSON만, 코드블록 금지)
{
  "classes": [
    {
      "id": "c1",
      "name": "Player",
      "stereotype": "<<entity>>|<<interface>>|<<service>>|<<value>>|",
      "attrs": ["+id: UUID", "-hp: int", "-mp: int"],
      "methods": ["+takeDamage(amount: int): void", "+heal(amount: int): void"],
      "col": 0, "row": 0
    }
  ],
  "relations": [
    { "from": "c1", "to": "c2", "kind": "inherit|implement|compose|aggregate|assoc|depend", "label": "1..*" }
  ]
}

# 시니어 표준 작성 기준
- 클래스 4~7개. id는 c1, c2... col은 0~3, row는 0부터 시작.
- 가시성 prefix: + public, - private, # protected, ~ package.
- attrs: 필드 3~5개. methods: 핵심 메서드 2~4개. 시그니처는 (param: Type, ...): ReturnType.
- 관계 종류:
  - inherit (상속): 일반화/extends 관계. 자식 → 부모.
  - implement (구현): 인터페이스 구현. 클래스 → 인터페이스(<<interface>>). 점선.
  - compose (컴포지션): 강한 소유. 부분의 생명주기가 전체에 종속.
  - aggregate (집합): 약한 소유. 부분이 전체 없이도 존재 가능.
  - assoc (연관): 일반 양방향/단방향 참조.
  - depend (의존): 일시적 사용. 점선.
- 라벨: 다중도(1..*, 0..1, *) 또는 역할명.`;

  try {
    const raw = await window.gemini.complete(ai);
    const parsed = window.parseAiJson(raw);
    if (parsed.classes) return parsed;
  } catch (e) {
    if (window.gddToast) try { window.gddToast('AI 클래스 다이어그램 생성 실패: ' + (e?.message || e), 'err'); } catch {}
  }
  return null;
}

Object.assign(window, {
  DiagramSlide, EnhancedFlowSlide, AiDrawModal,
  SequenceDiagramSlide, ClassDiagramSlide,
  aiGenerateFlow, aiGenerateDiagram, aiGenerateSequence, aiGenerateClass,
  stripJson,
});
