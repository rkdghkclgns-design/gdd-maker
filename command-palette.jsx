/* === Command Palette (Cmd/Ctrl+K) ===
 * 컨셉/기획서/슬라이드 + 액션을 fuzzy 검색.
 * 키보드 ↑↓ Enter Esc로 네비게이션.
 *
 * 노출: window.CommandPalette
 */

/** Simple fuzzy: 모든 검색 토큰이 텍스트에 순서 무관하게 포함되면 매칭. 토큰 인접도로 가중치 */
function fuzzyScore(text, query) {
  if (!query) return 1;
  const t = (text || '').toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 1;
  if (t.includes(q)) return 10 + (1 / Math.max(1, t.length)); // exact substring 가장 강함
  // 토큰 분리
  const tokens = q.split(/\s+/).filter(Boolean);
  let score = 0;
  let lastIdx = -1;
  for (const tok of tokens) {
    const i = t.indexOf(tok);
    if (i === -1) return 0;
    score += 1;
    if (lastIdx >= 0 && i > lastIdx) score += 0.1; // 순서 유지 보너스
    lastIdx = i + tok.length;
  }
  return score;
}

/** state로부터 검색 인덱스 구축 */
function buildSearchIndex(state) {
  const items = [];
  for (const c of (state.concepts || [])) {
    items.push({
      kind: 'concept',
      id: c.id,
      title: c.title || '(제목 없음)',
      sub: c.subtitle || '',
      badge: c.badge || 'CONCEPT',
      goto: { type: 'concept', id: c.id },
      searchText: [c.title, c.subtitle, c.badge, c.author, (c.keyUsp || []).join(' ')].filter(Boolean).join(' '),
    });
    for (const rp of (c.recommendedPlans || [])) {
      items.push({
        kind: 'plan',
        id: c.id + ':' + rp.id,
        title: rp.title || '(제목 없음)',
        sub: '필요 기획서 · ' + (c.title || ''),
        badge: rp.linkedGddId ? '작성됨' : '대기',
        goto: rp.linkedGddId
          ? { type: 'gdd', id: rp.linkedGddId }
          : { type: 'concept', id: c.id },
        searchText: [rp.title, rp.description, c.title].filter(Boolean).join(' '),
      });
    }
  }
  for (const p of (state.projects || [])) {
    items.push({
      kind: 'gdd',
      id: p.id,
      title: p.title || '(제목 없음)',
      sub: p.subtitle || '',
      badge: p.badge || 'GDD',
      goto: { type: 'gdd', id: p.id },
      searchText: [p.title, p.subtitle, p.badge, p.team, p.author].filter(Boolean).join(' '),
    });
    (p.slides || []).forEach((s, idx) => {
      const d = s.data || {};
      // 슬라이드 핵심 텍스트만 인덱싱 (너무 길어지면 검색 노이즈)
      const text = [
        d.title, d.tagline, d.subtitle, d.name,
        ...(d.cards || []).flatMap(c => [c.head, c.desc]),
        ...(d.rows || []).flatMap(r => [r.term, r.def, r.field]),
        ...(d.blocks || []).flatMap(b => [b.head, ...(b.items || [])]),
        ...(d.entries || []).flatMap(e => [e.name, e.sub]),
        ...(d.nodes || []).map(n => n.label),
        ...(d.callouts || []).flatMap(c => [c.name, c.desc]),
        ...(d.categories || []).flatMap(c => [c.name, ...(c.items || [])]),
      ].filter(Boolean).join(' ').slice(0, 600);
      items.push({
        kind: 'slide',
        id: p.id + ':' + s.id,
        title: d.title || `슬라이드 ${idx + 1}`,
        sub: (p.title || '') + ' · ' + (window.SLIDE_LABELS?.[s.type] || s.type),
        badge: (idx + 1).toString().padStart(2, '0'),
        goto: { type: 'gdd', id: p.id, slideIdx: idx },
        searchText: [d.title, p.title, text].filter(Boolean).join(' '),
      });
    });
  }
  return items;
}

function CommandPalette({ open, onClose, state, onGoto, actions }) {
  const [query, setQuery] = React.useState('');
  const [activeIdx, setActiveIdx] = React.useState(0);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const index = React.useMemo(() => open ? buildSearchIndex(state || {}) : [], [open, state]);

  const results = React.useMemo(() => {
    const allActions = (actions || []).map(a => ({
      kind: 'action',
      id: 'action:' + a.id,
      title: a.title,
      sub: a.sub || '명령',
      badge: a.shortcut || 'CMD',
      goto: null,
      action: a.run,
      searchText: [a.title, a.sub, (a.keywords || []).join(' ')].filter(Boolean).join(' '),
    }));
    const pool = [...allActions, ...index];
    if (!query.trim()) {
      // 빈 쿼리: 액션 먼저, 그 다음 컨셉, GDD 일부
      return pool.slice(0, 30);
    }
    const scored = pool
      .map(it => ({ it, score: fuzzyScore(it.searchText + ' ' + it.title, query) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40)
      .map(x => x.it);
    return scored;
  }, [index, query, actions]);

  React.useEffect(() => { setActiveIdx(0); }, [query]);

  // 활성 항목 자동 스크롤
  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.children[activeIdx];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(results.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const sel = results[activeIdx];
      if (sel) pick(sel);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const pick = (item) => {
    if (item.action) {
      try { item.action(); } catch (e) { console.error(e); }
    } else if (item.goto) {
      onGoto(item.goto);
    }
    onClose();
  };

  if (!open) return null;

  const kindLabel = {
    concept: '컨셉', gdd: '기획서', slide: '슬라이드', plan: '필요 기획서', action: '명령',
  };
  const kindColor = {
    concept: 'var(--accent)', gdd: '#7ee787', slide: '#d29922', plan: '#b1bac4', action: '#ff8ccb',
  };

  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk-panel" onClick={e => e.stopPropagation()}>
        <div className="cmdk-input-row">
          <span className="cmdk-input-icon">⌕</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="컨셉·기획서·슬라이드 검색 또는 명령 실행…"
          />
          <span className="cmdk-input-hint">Esc</span>
        </div>
        <div className="cmdk-list" ref={listRef}>
          {results.length === 0 && (
            <div className="cmdk-empty">결과 없음</div>
          )}
          {results.map((it, i) => (
            <div
              key={it.id}
              className={'cmdk-item ' + (i === activeIdx ? 'active' : '')}
              onClick={() => pick(it)}
              onMouseEnter={() => setActiveIdx(i)}
            >
              <span className="cmdk-kind" style={{ color: kindColor[it.kind] }}>
                {kindLabel[it.kind] || it.kind}
              </span>
              <div className="cmdk-text">
                <div className="cmdk-title">{it.title}</div>
                {it.sub && <div className="cmdk-sub">{it.sub}</div>}
              </div>
              <span className="cmdk-badge">{it.badge}</span>
            </div>
          ))}
        </div>
        <div className="cmdk-footer">
          <span>↑↓ 이동</span>
          <span>↵ 선택</span>
          <span>Esc 닫기</span>
        </div>
      </div>
    </div>
  );
}

window.CommandPalette = CommandPalette;
window.buildSearchIndex = buildSearchIndex;
