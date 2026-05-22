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

/* ====== Enhanced Flow slide (with edit controls and AI) ====== */
function EnhancedFlowSlide({ data, patch, page, totalPages }) {
  const [aiOpen, setAiOpen] = React.useState(false);
  const wrapRef = React.useRef(null);
  const chartRef = React.useRef(null);

  /* 폴백 스케일 — 측정 실패 시에도 노드 수 기반으로 보수적 스케일을 적용해 footer 침범 방지 */
  const fallbackScale = React.useMemo(() => {
    const nodes = data.nodes || [];
    const n = nodes.length;
    // 라벨 길이 평균 — 긴 라벨이 multiline 되어 노드 높이 ↑
    const avgLen = n ? nodes.reduce((s, x) => s + ((x.label || '').length), 0) / n : 0;
    const hasLongLabels = avgLen > 14;
    if (n <= 5) return hasLongLabels ? 0.9 : 1;
    if (n <= 6) return hasLongLabels ? 0.75 : 0.85;
    if (n <= 7) return hasLongLabels ? 0.66 : 0.76;
    if (n <= 8) return hasLongLabels ? 0.58 : 0.66;
    if (n <= 9) return hasLongLabels ? 0.5 : 0.58;
    if (n <= 10) return hasLongLabels ? 0.44 : 0.5;
    if (n <= 12) return hasLongLabels ? 0.38 : 0.44;
    return hasLongLabels ? 0.32 : 0.38;
  }, [data.nodes]);
  const [chartScale, setChartScale] = React.useState(fallbackScale);
  // 노드가 바뀌면 즉시 폴백 스케일로 리셋 (측정이 갱신할 때까지의 다리 역할)
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
      </div>

      <div className="flow-wrap" ref={wrapRef} style={{ overflow: 'hidden' }}>
        <div
          className="flow-chart flow-chart-edit"
          ref={chartRef}
          style={{ transform: `scale(${chartScale})`, transformOrigin: 'center center' }}
        >
          {(data.nodes || []).map((n, i, arr) => (
            <React.Fragment key={i}>
              <div className="flow-node-wrap">
                <div className={'flow-node ' + (n.kind || 'process')}>
                  <Editable value={n.label} onChange={(v) => updateNode(i, 'label', v)} multiline />
                </div>
                <div className="flow-node-controls">
                  <button title="위로" disabled={i === 0} onClick={() => moveNode(i, -1)}>↑</button>
                  <button title="아래로" disabled={i === arr.length - 1} onClick={() => moveNode(i, +1)}>↓</button>
                  <select value={n.kind || 'process'} onChange={e => updateNode(i, 'kind', e.target.value)}>
                    <option value="start">start</option>
                    <option value="process">process</option>
                    <option value="decision">decision</option>
                    <option value="end">end</option>
                  </select>
                  <button className="del" onClick={() => removeNode(i)} title="삭제">✕</button>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <div className="flow-arrow"></div>
                  <div className="flow-arrow-add" style={{ height: 0 }}>
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
    console.error('aiGenerateFlow', e);
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
    console.error('aiGenerateDiagram', e);
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

Object.assign(window, {
  DiagramSlide, EnhancedFlowSlide, AiDrawModal,
  aiGenerateFlow, aiGenerateDiagram, stripJson,
});
