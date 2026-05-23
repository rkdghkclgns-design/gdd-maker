/* === Main App === */

const { useState, useEffect, useRef, useCallback } = React;

/* Persistent state — IndexedDB 기반 (window.gddStorage) + localStorage 폴백 + emergency 슬롯
 * - loadState(): async. 우선 emergency 확인 후 main 로드. 없으면 localStorage 마이그레이션.
 * - saveState(): async + 자동 디바운스 + 이미지 분리 저장.
 */
const LEGACY_STORAGE_KEY = 'gdd-maker-state-v2';

async function loadStateAsync() {
  // 1) emergency 슬롯 — 비정상 종료 시 보존된 상태
  if (window.gddStorage) {
    try {
      const hasE = await window.gddStorage.hasEmergency();
      if (hasE) {
        const recover = confirm('이전 세션이 비정상 종료되었습니다.\n비상 백업으로 복구할까요?');
        if (recover) {
          const em = await window.gddStorage.loadEmergency();
          await window.gddStorage.clearEmergency();
          if (em) return em;
        } else {
          await window.gddStorage.clearEmergency();
        }
      }
      // 2) main 슬롯 (IndexedDB)
      const main = await window.gddStorage.loadState('main');
      if (main && main.projects) return main;
      // 3) legacy localStorage 마이그레이션 (한 번만)
      const migrated = await window.gddStorage.migrateFromLocalStorage();
      if (migrated) {
        return await window.gddStorage.loadState('main');
      }
    } catch (e) {
      console.error('IndexedDB 로드 실패, localStorage 폴백', e);
    }
  }
  // 4) 최종 폴백: 기존 localStorage 직접
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.projects) return parsed;
    }
  } catch (e) {}
  return null;
}

let _saveTimer = null;
function saveStateDebounced(state) {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(async () => {
    if (window.gddStorage) {
      try {
        await window.gddStorage.saveState(state, 'main');
        return;
      } catch (e) {
        console.error('IndexedDB 저장 실패, localStorage 폴백', e);
      }
    }
    try {
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* quota 초과 등 — 사용자에게 알릴 방법 없음, 콘솔만 */ }
  }, 600);
}

/* Apply enhanced renderers (override base ones) */
if (window.SLIDE_RENDERERS) {
  if (window.EnhancedFlowSlide) window.SLIDE_RENDERERS['flow'] = window.EnhancedFlowSlide;
  if (window.DiagramSlide) window.SLIDE_RENDERERS['diagram'] = window.DiagramSlide;
  if (window.SequenceDiagramSlide) window.SLIDE_RENDERERS['sequence-diagram'] = window.SequenceDiagramSlide;
  if (window.ClassDiagramSlide) window.SLIDE_RENDERERS['class-diagram'] = window.ClassDiagramSlide;
}
if (window.SLIDE_LABELS) {
  window.SLIDE_LABELS['diagram'] = '다이어그램';
  window.SLIDE_LABELS['sequence-diagram'] = '시퀀스 다이어그램';
  window.SLIDE_LABELS['class-diagram'] = '클래스 다이어그램';
}

/* Tweaks defaults */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "cyan",
  "showThumbs": true
}/*EDITMODE-END*/;

const THEMES = {
  cyan: {
    label: 'Cyan Blue',
    accent: '#4cc2ff',
    accent2: '#2b88c4',
    accentStrong: '#79d3ff',
    accentSoft: 'rgba(76, 194, 255, 0.12)',
  },
  green: {
    label: 'Terminal Green',
    accent: '#3fb950',
    accent2: '#2d8240',
    accentStrong: '#7ee787',
    accentSoft: 'rgba(63, 185, 80, 0.12)',
  },
  magenta: {
    label: 'Cyber Magenta',
    accent: '#ff5eb8',
    accent2: '#c43e8b',
    accentStrong: '#ff8ccb',
    accentSoft: 'rgba(255, 94, 184, 0.12)',
  },
};

/* Toast helper */
const ToastCtx = React.createContext(null);
function ToastHost({ children }) {
  const [toasts, setToasts] = useState([]);
  // useCallback 으로 식별자 고정 — context 소비자가 매 렌더마다 새 함수를 잡지 않도록 한다.
  const push = useCallback((text, kind = '') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, text, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-host">
        {toasts.map(t => <div className={'toast ' + t.kind} key={t.id}>{t.text}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = () => React.useContext(ToastCtx);

/* === Top bar === */
function TopBar({ project, view, setView, onDownload, isDownloading, onRename, tweaks, isConcept, onOpenSettings, hasApiKey, onExport, onImport, onOpenCmdK, onSaveSnapshot, onOpenSnapshots, onOpenQualityGate, usageTick }) {
  // 품질 점수 — 슬라이드가 있을 때만 계산
  const qScore = (!isConcept && project && window.gddQualityGate)
    ? window.gddQualityGate.scoreProject(project)
    : null;
  const qColor = qScore ? (qScore.total >= 80 ? '#3fb950' : qScore.total >= 60 ? '#d29922' : '#f85149') : null;
  // 비용 배지 — 오늘 사용 + 누계
  const stats = window.gddUsage ? window.gddUsage.getStats() : null;
  const fmt = window.gddUsage ? window.gddUsage.formatUSD : (n) => '$' + (n || 0).toFixed(2);
  const budget = window.gddUsage ? window.gddUsage.isOverBudget() : { daily: false, monthly: false };
  const badgeClass = budget.daily || budget.monthly ? 'usage-badge over' : (stats && stats.todayCost > 0.5 ? 'usage-badge warn' : 'usage-badge');

  return (
    <div className="topbar">
      <div className="brand">
        <div className="logo">G</div>
        <div className="name">GDD 메이커</div>
        <div className="ver">v0.2 beta</div>
      </div>
      <div className="crumb">
        <span className="sep">/</span>
        <span>{isConcept ? '컨셉' : 'TEAM_7'}</span>
        <span className="sep">/</span>
        <span className="doc">{project?.title || '선택 없음'}</span>
      </div>
      <div className="spacer"></div>

      {/* 명령 팔레트 (Cmd+K) */}
      <button
        className="btn ghost"
        onClick={onOpenCmdK}
        title="명령 팔레트 (Cmd/Ctrl + K)"
        style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: 11 }}
      >
        ⌕ <span style={{ marginLeft: 4, opacity: 0.7 }}>⌘K</span>
      </button>

      {/* 비용 배지 */}
      {stats && (
        <div
          className={badgeClass}
          onClick={onOpenSettings}
          title={`오늘 ${fmt(stats.todayCost)} / 이번 달 ${fmt(stats.monthCost)} / 누계 ${fmt(stats.totalCost)} (${stats.totalCalls}회)`}
        >
          <span className="dot"></span>
          <span>오늘 {fmt(stats.todayCost)}</span>
          <span style={{ opacity: 0.5, margin: '0 4px' }}>·</span>
          <span>월 {fmt(stats.monthCost)}</span>
        </div>
      )}

      {/* 내보내기/불러오기 */}
      <button className="btn ghost" onClick={onExport} title="프로젝트 내보내기 (.gddproject)" style={{ padding: '6px 10px', fontSize: 11 }}>
        ↓ 내보내기
      </button>
      <button className="btn ghost" onClick={onImport} title="프로젝트 불러오기" style={{ padding: '6px 10px', fontSize: 11 }}>
        ↑ 불러오기
      </button>

      <button
        className="btn ghost"
        onClick={onOpenSettings}
        title="Gemini API 키 설정"
        style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: 11 }}
      >
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: hasApiKey ? 'var(--ok)' : 'var(--warn)',
          marginRight: 6, display: 'inline-block',
        }}></span>
        Gemini {hasApiKey ? '연결됨' : '키 설정'}
      </button>

      {!isConcept && (
        <div className="view-toggle">
          <button className={view === 'slide' ? 'active' : ''} onClick={() => setView('slide')}>
            <span style={{ marginRight: 4 }}>▭</span> 슬라이드
          </button>
          <button className={view === 'doc' ? 'active' : ''} onClick={() => setView('doc')}>
            <span style={{ marginRight: 4 }}>▤</span> 문서
          </button>
        </div>
      )}

      {isConcept ? (
        <button className="btn ghost" disabled style={{ opacity: 0.5 }}>
          컨셉 (PPTX 비대상)
        </button>
      ) : (
        <>
          {/* 품질 점수 배지 — 클릭 시 점수표 모달 */}
          {qScore && (
            <button
              className="btn ghost"
              onClick={onOpenQualityGate}
              title={`품질 점수: ${qScore.total}/100 (${qScore.grade}). 클릭하여 상세 확인.`}
              style={{
                padding: '6px 10px', fontSize: 11,
                color: qColor, borderColor: qColor,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              🎯 <strong style={{ color: qColor, fontWeight: 800 }}>{qScore.total}</strong>
              <span style={{ color: qColor, marginLeft: 4, opacity: 0.8 }}>{qScore.grade}</span>
            </button>
          )}
          <button className="btn ghost" onClick={onSaveSnapshot} title="현재 기획서를 스냅샷으로 저장" disabled={!project} style={{ padding: '6px 10px', fontSize: 11 }}>
            📸 스냅샷
          </button>
          {(project?.snapshots || []).length > 0 && (
            <button className="btn ghost" onClick={onOpenSnapshots} title="스냅샷 히스토리" style={{ padding: '6px 10px', fontSize: 11 }}>
              ⌖ {(project.snapshots || []).length}
            </button>
          )}
          <button
            className="btn primary"
            onClick={() => {
              if (qScore && qScore.total < 70 && !confirm(`품질 점수 ${qScore.total}/100 (${qScore.grade}). 보강 권장 항목이 있습니다. 그래도 다운로드할까요?`)) return;
              onDownload();
            }}
            disabled={isDownloading || !project}
          >
            {isDownloading ? '생성 중…' : <>↓ PPTX 다운로드</>}
          </button>
        </>
      )}
    </div>
  );
}

/* === downloadBlob 헬퍼 — 텍스트/JSON/YAML 등을 즉시 다운로드 === */
function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime || 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* === Quality Gate Modal — GDD 점수표 + 보강 권장 === */
function QualityGateModal({ project, onClose, onJump }) {
  const score = React.useMemo(() => {
    if (!project || !window.gddQualityGate) return null;
    return window.gddQualityGate.scoreProject(project);
  }, [project]);
  const suggestions = React.useMemo(() => {
    if (!score) return [];
    return window.gddQualityGate.suggestImprovements(project, score);
  }, [project, score]);
  if (!score) return null;
  const gradeColor = score.total >= 80 ? '#3fb950' : score.total >= 60 ? '#d29922' : '#f85149';
  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="form-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <header>
          <h2>🎯 GDD 품질 점수</h2>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>
        <div className="body" style={{ maxHeight: '72vh', overflow: 'auto' }}>
          {/* 전체 점수 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '14px 18px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16 }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', border: '6px solid ' + gradeColor, display: 'grid', placeItems: 'center', flexDirection: 'column' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: gradeColor, fontFamily: 'JetBrains Mono, monospace' }}>{score.total}</div>
              <div style={{ fontSize: 11, color: gradeColor, marginTop: -4 }}>{score.grade}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                {score.canDownload ? '✓ 개발 가능 수준 (70+)' : '⚠ 보강이 필요한 상태 (70점 미만)'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace' }}>{score.summary}</div>
            </div>
          </div>
          {/* 차원별 점수 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {score.dims.map((d, i) => {
              const pct = d.points / d.max;
              const c = pct >= 0.7 ? '#3fb950' : pct >= 0.4 ? '#d29922' : '#f85149';
              return (
                <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{d.label}</span>
                    <span style={{ fontSize: 12, color: c, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{d.points} / {d.max}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct * 100}%`, background: c, transition: 'width 0.3s' }}></div>
                  </div>
                  {d.note && <div style={{ fontSize: 10.5, color: 'var(--text-4)', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>{d.note}</div>}
                </div>
              );
            })}
          </div>
          {/* 보강 권장 */}
          {suggestions.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 8 }}>보강 권장</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {suggestions.map((s, i) => {
                  const pcolor = s.priority === 'HIGH' ? '#f85149' : s.priority === 'MEDIUM' ? '#d29922' : '#7d8590';
                  return (
                    <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ fontSize: 10, color: pcolor, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, minWidth: 60 }}>{s.priority}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{s.action}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* === Stats Dashboard Modal === */
function StatsModal({ state, onClose }) {
  const stats = React.useMemo(() => {
    if (!window.computeStats) return null;
    return window.computeStats(state);
  }, [state]);
  const usage = window.gddUsage ? window.gddUsage.getStats() : null;
  if (!stats) return null;

  const DOM_LABEL = {
    core: '코어', system: '시스템', content: '컨텐츠', bm: 'BM',
    sound: '사운드', uiux: 'UI/UX', tutorial: '튜토리얼', art: '아트',
  };
  const DOM_COLOR = {
    core: '#4cc2ff', system: '#7ee787', content: '#d29922',
    bm: '#ff5eb8', sound: '#a78bfa', uiux: '#56d4dd',
    tutorial: '#f5d94f', art: '#ff8ccb',
  };

  const maxDayCount = Math.max(1, ...stats.recentDays.map(d => d.count));
  const totalDomain = Math.max(1, Object.values(stats.byDomain).reduce((a, b) => a + b, 0));
  const fmt = window.gddUsage ? window.gddUsage.formatUSD : (n) => '$' + n.toFixed(2);

  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="form-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <header>
          <h2>📊 작업 통계</h2>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>
        <div className="body" style={{ maxHeight: '70vh', overflow: 'auto' }}>
          {/* 핵심 카운트 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 18 }}>
            {[
              { label: '컨셉', v: stats.counts.concepts, c: '#88DFB0' },
              { label: '기획서', v: stats.counts.projects, c: '#4cc2ff' },
              { label: '슬라이드', v: stats.counts.slides, c: '#d29922' },
              { label: '총 단어', v: stats.counts.words.toLocaleString(), c: '#ff5eb8' },
            ].map((m, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', padding: '12px', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: m.c, marginTop: 2 }}>{m.v}</div>
              </div>
            ))}
          </div>

          {/* 최근 14일 활동 */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 8 }}>최근 14일 기획서 활동</div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 100, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: 12 }}>
              {stats.recentDays.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                     title={`${d.date}: ${d.count}건`}>
                  <div style={{
                    width: '100%',
                    height: `${(d.count / maxDayCount) * 80}px`,
                    minHeight: d.count > 0 ? 2 : 0,
                    background: d.count > 0 ? 'var(--accent)' : 'transparent',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 0.2s',
                  }}></div>
                  <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                    {d.date.slice(5)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 도메인 분포 */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 8 }}>도메인 분포</div>
            <div style={{ display: 'flex', height: 24, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {Object.entries(stats.byDomain).map(([dom, n], i) => (
                <div key={i} title={`${DOM_LABEL[dom] || dom}: ${n}건`} style={{
                  flex: n,
                  background: DOM_COLOR[dom] || '#666',
                  color: '#061018', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
                  display: 'grid', placeItems: 'center', padding: '0 6px',
                  borderRight: i < Object.keys(stats.byDomain).length - 1 ? '1px solid rgba(0,0,0,0.2)' : 'none',
                }}>{n}</div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {Object.entries(stats.byDomain).map(([dom, n]) => (
                <div key={dom} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-2)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: DOM_COLOR[dom] }}></span>
                  {DOM_LABEL[dom] || dom} <span style={{ color: 'var(--text-4)' }}>{Math.round(n / totalDomain * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 컨셉별 진행률 */}
          {stats.conceptProgress.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 8 }}>컨셉별 기획서 진행률</div>
              {stats.conceptProgress.map(c => (
                <div key={c.id} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: 10, marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{c.title}</span>
                    <span style={{ color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{c.done} / {c.total}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${c.ratio * 100}%`,
                      background: c.ratio === 1 ? 'var(--ok)' : 'var(--accent)',
                      transition: 'width 0.3s',
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI 사용량 요약 */}
          {usage && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 8 }}>AI 사용량</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <div style={{ background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>총 호출</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{usage.totalCalls}</div>
                </div>
                <div style={{ background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>총 토큰</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{(usage.totalTokens / 1000).toFixed(1)}K</div>
                </div>
                <div style={{ background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>총 비용</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{fmt(usage.totalCost)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* === Consistency Check Modal === */
function ConsistencyModal({ concept, projects, onClose, onGoto }) {
  const result = React.useMemo(() => {
    if (!concept || !window.runConsistencyCheck) return null;
    return window.runConsistencyCheck(concept, projects);
  }, [concept, projects]);
  if (!result) return null;
  const { issues, stats } = result;
  const levelColor = { warn: 'var(--warn)', info: 'var(--accent)', error: 'var(--danger)' };
  const levelLabel = { warn: '경고', info: '정보', error: '오류' };
  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="form-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <header>
          <h2>🧐 컨셉 일관성 점검 — {concept.title}</h2>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>
        <div className="body" style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
            {[
              { label: '연결 기획서', v: stats.gddCount },
              { label: '정의된 용어', v: stats.termCount },
              { label: '데이터 필드', v: stats.fieldCount },
              { label: '이슈 합계', v: stats.issueCount },
            ].map((m, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{m.v}</div>
              </div>
            ))}
          </div>
          {issues.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--ok)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
              <div>이슈가 없습니다. 모든 기획서가 정합성 있게 작성되었습니다.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {issues.map((it, i) => (
                <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', background: 'var(--bg-2)' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{
                      fontSize: 10, fontFamily: 'var(--font-mono)',
                      color: levelColor[it.level], borderColor: levelColor[it.level],
                      border: '1px solid', padding: '1px 6px', borderRadius: 3, fontWeight: 700,
                    }}>{levelLabel[it.level] || it.level}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>{it.kind}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{it.message}</div>
                  {it.locations.length > 0 && (
                    <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {it.locations.map((loc, j) => (
                        <button
                          key={j}
                          onClick={() => onGoto({ type: 'gdd', id: loc.gddId })}
                          style={{
                            textAlign: 'left',
                            background: 'transparent', border: '1px solid var(--border)',
                            padding: '6px 10px', borderRadius: 4, color: 'var(--text-2)',
                            fontSize: 11, fontFamily: 'var(--font-mono)', cursor: 'pointer',
                          }}
                        >
                          → {loc.gddTitle}{loc.snippet ? ` · ${loc.snippet}` : ''}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* === Shortcuts Help Modal === */
function ShortcutsModal({ onClose }) {
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || '');
  const mod = isMac ? '⌘' : 'Ctrl';
  const rows = [
    { keys: [`${mod} K`], desc: '명령 팔레트 열기 / 닫기' },
    { keys: [`${mod} S`], desc: '강제 저장' },
    { keys: [`${mod} Z`], desc: '실행 취소 (Undo)' },
    { keys: [`${mod} ⇧ Z`], desc: '다시 실행 (Redo)' },
    { keys: [`${mod} D`], desc: '현재 슬라이드 복제' },
    { keys: [`${mod} C`], desc: '현재 슬라이드 복사 (텍스트 선택 시 기본 동작)' },
    { keys: [`${mod} X`], desc: '현재 슬라이드 잘라내기' },
    { keys: [`${mod} V`], desc: '복사한 슬라이드 붙여넣기' },
    { keys: ['←', '→', '↑', '↓'], desc: '이전/다음 슬라이드 이동' },
    { keys: ['Alt + ←', 'Alt + →', 'Alt + ↑', 'Alt + ↓'], desc: '현재 슬라이드 위치 이동 (재정렬)' },
    { keys: ['PageUp', 'PageDn'], desc: '이전/다음 슬라이드 (대체)' },
    { keys: ['?'], desc: '단축키 도움말' },
    { keys: ['Esc'], desc: '모달/명령팔레트 닫기' },
  ];
  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="form-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <header>
          <h2>단축키</h2>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>
        <div className="body">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 0', width: 180 }}>
                    {r.keys.map((k, j) => (
                      <span key={j} style={{
                        display: 'inline-block', marginRight: 6,
                        fontFamily: 'var(--font-mono)', fontSize: 11,
                        background: 'var(--surface-2)', border: '1px solid var(--border)',
                        borderRadius: 4, padding: '3px 8px', color: 'var(--text)',
                      }}>{k}</span>
                    ))}
                  </td>
                  <td style={{ padding: '10px 0', color: 'var(--text-2)', fontSize: 13 }}>{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-3)' }}>
            💡 텍스트 편집 중에는 브라우저 기본 Undo/Redo가 사용됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}

/* === GDD Snapshots Modal === */
function GddSnapshotsModal({ project, onClose, onRestore }) {
  const snapshots = (project?.snapshots || []).slice().reverse();
  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="form-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <header>
          <h2>스냅샷 히스토리 — {project?.title}</h2>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>
        <div className="body">
          {snapshots.length === 0 && <div style={{ color: 'var(--text-3)', textAlign: 'center', padding: 24 }}>스냅샷이 없습니다.</div>}
          {snapshots.map(s => (
            <div key={s.id} className="snapshot-item" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', cursor: 'pointer' }}
              onClick={() => onRestore(s)}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{s.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>
                {new Date(s.ts).toLocaleString('ko-KR')} · {(s.data?.slides || []).length} slides
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* === Usage Stats Panel (Settings Modal 안에 표시) === */
function UsageStatsPanel() {
  const [tick, setTick] = useState(0);
  const stats = window.gddUsage ? window.gddUsage.getStats() : null;
  const budget = window.gddUsage ? window.gddUsage.getBudget() : { dailyUsd: 0, monthlyUsd: 0, hardStop: false };
  const fmt = window.gddUsage ? window.gddUsage.formatUSD : (n) => '$' + (n || 0).toFixed(2);

  const updateBudget = (patch) => {
    window.gddUsage.setBudget({ ...budget, ...patch });
    setTick(t => t + 1);
  };

  if (!stats) return null;

  return (
    <div className="form-field" style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 6 }}>
      <label>AI 사용량 (이 브라우저 누계)</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 6 }}>
        <div style={{ background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>오늘</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{fmt(stats.todayCost)}</div>
          <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{stats.todayCalls}회</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>이번 달</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{fmt(stats.monthCost)}</div>
          <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{stats.monthCalls}회</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>누계</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{fmt(stats.totalCost)}</div>
          <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{stats.totalCalls}회 · {(stats.totalTokens / 1000).toFixed(1)}K tok</div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-3)' }}>
        텍스트 {stats.textCalls}회 ({fmt(stats.textCost)}) · 이미지 {stats.imageCalls}회 ({fmt(stats.imageCost)}) · 실패 {stats.failedCalls}회
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', minWidth: 70 }}>일일 한도</span>
        <input
          type="number"
          step="0.5"
          min="0"
          value={budget.dailyUsd || ''}
          placeholder="0 (무제한)"
          onChange={(e) => updateBudget({ dailyUsd: parseFloat(e.target.value) || 0 })}
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '4px 8px', color: 'var(--text)', fontSize: 12, width: 100 }}
        />
        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>USD</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', minWidth: 70 }}>월 한도</span>
        <input
          type="number"
          step="1"
          min="0"
          value={budget.monthlyUsd || ''}
          placeholder="0 (무제한)"
          onChange={(e) => updateBudget({ monthlyUsd: parseFloat(e.target.value) || 0 })}
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '4px 8px', color: 'var(--text)', fontSize: 12, width: 100 }}
        />
        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>USD</span>
      </div>
      <div style={{ marginTop: 10 }}>
        <button
          className="btn ghost"
          onClick={() => { if (confirm('사용량 로그를 모두 삭제할까요?')) { window.gddUsage.clear(); setTick(t => t + 1); } }}
          style={{ fontSize: 11, padding: '4px 10px', color: 'var(--text-3)' }}
        >
          사용량 로그 초기화
        </button>
      </div>
    </div>
  );
}

/* === Backup Folder Panel (Settings Modal 안에 표시) === */
function BackupFolderPanel() {
  const [status, setStatus] = useState(() => window.gddStorage?.getBackupStatus?.() || { configured: false });
  const [busy, setBusy] = useState(false);
  const supported = 'showDirectoryPicker' in window;

  const pick = async () => {
    if (!window.gddStorage) return;
    setBusy(true);
    try {
      const name = await window.gddStorage.pickBackupDirectory();
      setStatus(window.gddStorage.getBackupStatus());
      // 즉시 첫 백업
      await window.gddStorage.autoBackup();
      setStatus(window.gddStorage.getBackupStatus());
    } catch (e) { /* swallow — 사용자 취소 등 */ }
    finally { setBusy(false); }
  };
  const clear = async () => {
    if (!confirm('자동 백업 폴더 설정을 해제할까요?')) return;
    await window.gddStorage.clearBackupDirectory();
    setStatus(window.gddStorage.getBackupStatus());
  };
  const backupNow = async () => {
    setBusy(true);
    try {
      const name = await window.gddStorage.autoBackup();
      setStatus(window.gddStorage.getBackupStatus());
      if (name) alert('백업됨: ' + name);
      else alert('백업 실패 — 권한이 필요할 수 있습니다.');
    } finally { setBusy(false); }
  };

  return (
    <div className="form-field" style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 6 }}>
      <label>자동 백업 폴더 (FS Access API)</label>
      {!supported ? (
        <div style={{ fontSize: 11, color: 'var(--warn)' }}>이 브라우저는 폴더 선택을 지원하지 않습니다. Chrome/Edge 권장.</div>
      ) : status.configured ? (
        <div>
          <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'var(--font-mono)', background: 'var(--bg-2)', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)' }}>
            📁 {status.name}
            {status.lastBackupAt && (
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>
                마지막 백업: {new Date(status.lastBackupAt).toLocaleString('ko-KR')}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <button className="btn ghost" onClick={backupNow} disabled={busy} style={{ fontSize: 11 }}>📥 지금 백업</button>
            <button className="btn ghost" onClick={clear} disabled={busy} style={{ fontSize: 11, color: 'var(--danger)' }}>해제</button>
          </div>
        </div>
      ) : (
        <div>
          <button className="btn ghost" onClick={pick} disabled={busy} style={{ fontSize: 12, padding: '6px 12px' }}>
            📁 백업 폴더 선택
          </button>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
            지정된 폴더에 큰 변경 후 자동으로 <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-2)', padding: '1px 4px', borderRadius: 3 }}>.gddproject</code> 파일이 저장됩니다. 최근 30개 유지.
          </div>
        </div>
      )}
    </div>
  );
}

/* === ErrorBoundary — 비정상 종료 시 비상 백업 === */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  async componentDidCatch(error, info) {
    this.setState({ info });
    // 가능하면 현재 사용자가 작업 중이던 state를 emergency 슬롯에 저장
    try {
      const snapshot = this.props.getCurrentState?.();
      if (snapshot && window.gddStorage) {
        await window.gddStorage.saveEmergency(snapshot);
      }
    } catch (e) { /* swallow */ }
  }
  render() {
    if (this.state.error) {
      const msg = this.state.error?.message || String(this.state.error);
      const stack = this.state.info?.componentStack || '';
      return (
        <div className="error-boundary-screen">
          <div className="error-boundary-card">
            <h2>⚠ 예상치 못한 오류가 발생했습니다</h2>
            <p>작업 내용은 <strong>비상 백업 슬롯에 자동 보존</strong>되었습니다. 페이지를 다시 로드하면 복구 안내가 나옵니다.</p>
            <pre>{msg}{stack ? '\n\n' + stack : ''}</pre>
            <div className="actions">
              <button className="btn primary" onClick={() => window.location.reload()}>↻ 새로고침하고 복구</button>
              <button className="btn ghost" onClick={() => this.setState({ error: null, info: null })}>이 화면 닫고 계속 시도</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* === Settings Modal (Gemini API key + model) === */
function SettingsModal({ onClose, onSaved }) {
  const initialKey = (window.gemini?.getApiKey && window.gemini.getApiKey()) || '';
  const initialModel = (window.gemini?.getModel && window.gemini.getModel()) || 'gemini-2.5-flash';
  const [apiKey, setApiKey] = useState(initialKey);
  const [model, setModel] = useState(initialModel);
  const [showKey, setShowKey] = useState(false);

  const masked = (k) => {
    if (!k) return '(없음)';
    if (k.length < 12) return '••••';
    return k.slice(0, 4) + '••••••••' + k.slice(-4);
  };

  const save = () => {
    if (window.gemini?.setApiKey) window.gemini.setApiKey(apiKey);
    if (window.gemini?.setModel) window.gemini.setModel(model);
    onSaved?.();
    onClose();
  };

  const clear = () => {
    if (!confirm('저장된 API 키를 삭제할까요?')) return;
    if (window.gemini?.resetApiKey) window.gemini.resetApiKey();
    setApiKey('');
    onSaved?.();
  };

  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="form-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <header>
          <h2>Gemini API 설정</h2>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>
        <div className="body">
          <div className="form-field">
            <label>API 키</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza... 로 시작하는 키를 붙여넣으세요"
                style={{ flex: 1, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-mono)' }}
                autoFocus
              />
              <button className="btn ghost" onClick={() => setShowKey((v) => !v)}>
                {showKey ? '숨김' : '표시'}
              </button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
              현재 저장됨: <span style={{ fontFamily: 'var(--font-mono)' }}>{masked(initialKey)}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
              키 발급: <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>aistudio.google.com/apikey</a> · 키는 이 브라우저의 localStorage에만 저장됩니다.
            </div>
          </div>

          <div className="form-field">
            <label>모델</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--text)', fontSize: 13 }}
            >
              <option value="gemini-2.5-flash">gemini-2.5-flash (빠르고 저렴, 권장)</option>
              <option value="gemini-2.5-pro">gemini-2.5-pro (고품질, 느림)</option>
              <option value="gemini-2.0-flash">gemini-2.0-flash (이전 세대)</option>
              <option value="gemini-1.5-flash">gemini-1.5-flash (레거시)</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro (레거시)</option>
            </select>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
              긴 기획서 생성에는 Pro, 빠른 반복에는 Flash가 적합합니다.
            </div>
          </div>

          {/* AI 사용량 통계 */}
          <UsageStatsPanel />

          {/* 자동 백업 폴더 */}
          <BackupFolderPanel />
        </div>
        <footer>
          <button className="btn ghost" onClick={clear} style={{ marginRight: 'auto', color: 'var(--danger)' }}>
            키 삭제
          </button>
          <button className="btn ghost" onClick={onClose}>취소</button>
          <button className="btn primary" onClick={save}>저장</button>
        </footer>
      </div>
    </div>
  );
}

/* === Sidebar === */
function Sidebar({ concepts, projects, selection, onSelect, onNewBlank, onOpenConceptBrief, onOpenGddBrief, onDelete }) {
  const handleDelete = (e, type, item) => {
    e.stopPropagation();
    if (confirm(`"${item.title}" 을(를) 삭제할까요?`)) onDelete(type, item.id);
  };
  return (
    <div className="sidebar">
      <div style={{ height: 14 }}></div>
      <button className="big-cta" onClick={onOpenConceptBrief}>
        <span style={{ fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.15)', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>✦ AI</span>
        컨셉 만들기
        <span className="arr">↵</span>
      </button>

      <div className="concept-list-section">
        <div className="section-label">컨셉 기획 <span style={{ float: 'right', color: 'var(--text-4)' }}>{(concepts || []).length}</span></div>
        {(concepts || []).map(c => {
          const linkedCount = (c.recommendedPlans || []).filter(rp => rp.linkedGddId).length;
          const totalCount = (c.recommendedPlans || []).length;
          return (
            <div
              key={c.id}
              className={'concept-item ' + (selection.type === 'concept' && selection.id === c.id ? 'active' : '')}
              onClick={() => onSelect('concept', c.id)}
            >
              <button className="item-del" title="삭제" onClick={(e) => handleDelete(e, 'concept', c)}>✕</button>
              <div className="title">{c.title}</div>
              <div className="meta">
                <span className="gdd-count">{linkedCount}</span>/<span>{totalCount}</span> 기획서 · {c.updatedAt}
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>세부 기획서 <span style={{ color: 'var(--text-4)' }}>{projects.length}</span></span>
      </div>
      <button className="new-doc-btn" onClick={onOpenGddBrief}>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>✦</span> AI로 기획서 추가
      </button>
      <button className="new-doc-btn" onClick={onNewBlank} style={{ marginTop: -4 }}>
        <span style={{ fontFamily: 'var(--font-mono)' }}>+</span> 빈 기획서 추가
      </button>
      <div className="doc-list">
        {projects.map(p => (
          <div
            key={p.id}
            className={'doc-item ' + (selection.type === 'gdd' && selection.id === p.id ? 'active' : '')}
            onClick={() => onSelect('gdd', p.id)}
            style={{ paddingLeft: 14 }}
          >
            <button className="item-del" title="삭제" onClick={(e) => handleDelete(e, 'gdd', p)}>✕</button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <div className="title">{p.title}</div>
              {p.badge && <div className="badge">{p.badge}</div>}
            </div>
            <div className="meta">
              <span>{p.version}</span>
              <span className="dot">·</span>
              <span>{(p.slides || []).length} slides</span>
              <span className="dot">·</span>
              <span>{p.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="footer-meta">
        <div>SAMPLE PDFs: 18 docs analyzed</div>
      </div>
    </div>
  );
}

/* === Slide stage === */
function SlideStage({ project, patchSlide, replaceSlide, scale, setScale, currentIdx, setCurrentIdx, isGenerating }) {
  const slides = project.slides || [];
  const slide = slides[currentIdx];
  const stageRef = useRef(null);

  // Auto-fit scale
  useEffect(() => {
    const recompute = () => {
      if (!stageRef.current) return;
      const w = stageRef.current.clientWidth - 56;
      const h = stageRef.current.clientHeight - 56;
      const s = Math.min(w / 1280, h / 720, 1);
      setScale(s);
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [setScale]);

  if (!slide) {
    return <div className="stage" ref={stageRef} style={{ display: 'grid', placeItems: 'center', color: 'var(--text-3)' }}>슬라이드 없음</div>;
  }

  return (
    <div className="stage">
      <div className="stage-scroll" ref={stageRef} style={{ position: 'relative' }}>
        <div className="slide-frame" style={{ transform: `scale(${scale})` }}>
          <SlideRenderer
            slide={slide}
            patch={(u) => patchSlide(slide.id, { data: { ...slide.data, ...u } })}
            replace={(newSlide) => replaceSlide && replaceSlide(slide.id, newSlide)}
            page={currentIdx + 1}
            totalPages={slides.length}
          />
        </div>
        {isGenerating && (
          <div className="stage-veil">
            <div className="label">기획서 생성 중…</div>
            <div className="bar"><div className="fill"></div></div>
          </div>
        )}
      </div>
      <div className="stage-footer">
        <div>
          <span style={{ color: 'var(--accent)' }}>{(window.SLIDE_LABELS && window.SLIDE_LABELS[slide.type]) || slide.type}</span>
          <span style={{ margin: '0 8px', color: 'var(--text-4)' }}>·</span>
          <span>{currentIdx + 1} / {slides.length}</span>
          <span style={{ margin: '0 8px', color: 'var(--text-4)' }}>·</span>
          <span>{Math.round(scale * 100)}%</span>
        </div>
        <div className="nav">
          <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}>← Prev</button>
          <button onClick={() => setCurrentIdx(Math.min(slides.length - 1, currentIdx + 1))} disabled={currentIdx === slides.length - 1}>Next →</button>
        </div>
      </div>
    </div>
  );
}

/* === Thumbnails strip ===
 * - 각 썸네일은 정확한 16:9 비율 (CSS aspect-ratio)
 * - 컨테이너는 세로 스크롤 + 활성 슬라이드가 자동으로 viewport 안에 오도록 scrollIntoView
 * - 키보드 방향키는 App 전역 핸들러가 처리 (← / → / ↑ / ↓ + PageUp/Down)
 */
function Thumbs({ slides, currentIdx, setCurrentIdx, onAddSlide, onDeleteSlide, onMoveSlide }) {
  const activeRef = useRef(null);

  // currentIdx 변경 시 활성 썸네일을 viewport 안으로 스크롤
  useEffect(() => {
    const el = activeRef.current;
    if (!el || typeof el.scrollIntoView !== 'function') return;
    // block: 'nearest' → 이미 보이면 스크롤하지 않음, 가려져있으면 가장 가까운 가장자리로
    try { el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch {}
  }, [currentIdx]);

  return (
    <div className="thumbs" tabIndex={-1}>
      {slides.map((s, i) => {
        const isActive = i === currentIdx;
        return (
          <div
            className={'thumb ' + (isActive ? 'active' : '')}
            key={s.id}
            ref={isActive ? activeRef : null}
            onClick={() => setCurrentIdx(i)}
            title={`슬라이드 ${i + 1}`}
          >
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <div className="thumb-actions">
              {i > 0 && (
                <button title="위로" onClick={(e) => { e.stopPropagation(); onMoveSlide(i, -1); }}>↑</button>
              )}
              {i < slides.length - 1 && (
                <button title="아래로" onClick={(e) => { e.stopPropagation(); onMoveSlide(i, 1); }}>↓</button>
              )}
              {slides.length > 1 && (
                <button title="삭제" className="del" onClick={(e) => { e.stopPropagation(); if (confirm(`${i + 1}번 슬라이드를 삭제할까요?`)) onDeleteSlide(s.id); }}>✕</button>
              )}
            </div>
            <div className="thumb-canvas">
              <ThumbScaler slide={s} index={i} total={slides.length} />
            </div>
          </div>
        );
      })}
      <button className="thumb-add" onClick={onAddSlide}>+ 슬라이드 추가</button>
    </div>
  );
}

/* 썸네일은 16:9 컨테이너 폭에 맞춰 1280px 슬라이드를 자동 비율로 축소 */
function ThumbScaler({ slide, index, total }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(124 / 1280);
  useEffect(() => {
    if (!ref.current) return;
    const recompute = () => {
      if (!ref.current) return;
      const w = ref.current.clientWidth;
      if (w > 0) setScale(w / 1280);
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="thumb-scaler-host">
      <div className="scaler" style={{ transform: `scale(${scale})` }}>
        <SlideRenderer slide={slide} patch={() => {}} page={index + 1} totalPages={total} />
      </div>
    </div>
  );
}

/* === Add slide menu === */
function AddSlideMenu({ onAdd, onClose }) {
  const types = [
    // 개요/구조
    { type: 'intent', label: '기획 의도', icon: '◆', group: '개요' },
    { type: 'terms', label: '용어 정의', icon: '≡', group: '개요' },
    { type: 'section-divider', label: '섹션 구분', icon: '—', group: '개요' },
    // 시스템 / 로직
    { type: 'rules', label: '규칙', icon: '§', group: '시스템' },
    { type: 'flow', label: '플로우 차트', icon: '⇣', group: '시스템' },
    { type: 'diagram', label: '다이어그램 (2D)', icon: '◇', group: '시스템' },
    { type: 'sequence-diagram', label: '시퀀스 다이어그램', icon: '⇄', group: '시스템' },
    { type: 'class-diagram', label: '클래스 다이어그램', icon: '▤', group: '시스템' },
    { type: 'state-machine', label: '상태 머신', icon: '◎', group: '시스템' },
    // 데이터 / 밸런싱
    { type: 'data-table', label: '데이터 테이블', icon: '▦', group: '데이터' },
    { type: 'balance-table', label: '수치 밸런싱', icon: '∿', group: '데이터' },
    // API / 텔레메트리
    { type: 'api-contract', label: 'API 계약', icon: '⇿', group: 'API' },
    { type: 'telemetry', label: '텔레메트리', icon: '◉', group: 'API' },
    // 품질 / 검증
    { type: 'acceptance-criteria', label: '수락 기준', icon: '✓', group: '품질' },
    // UI / 리소스
    { type: 'ui-design', label: 'UI/UX', icon: '▣', group: 'UI' },
    { type: 'image-embed', label: '참고 이미지', icon: '🖼', group: 'UI' },
    { type: 'resources', label: '필요 리소스', icon: '◉', group: 'UI' },
    // 프로젝트 관리
    { type: 'risk-register', label: '위험 등기부', icon: '⚠', group: '관리' },
    { type: 'roadmap', label: '로드맵', icon: '►', group: '관리' },
  ];
  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="form-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <header><h2>슬라이드 추가</h2><button className="btn ghost icon" onClick={onClose}>✕</button></header>
        <div className="body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {types.map(t => (
              <button key={t.type} className="btn" style={{ padding: '12px 14px', justifyContent: 'flex-start' }} onClick={() => onAdd(t.type)}>
                <span style={{ color: 'var(--accent)', fontSize: 16, marginRight: 8, fontFamily: 'var(--font-mono)' }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* === Main App === */
function App({ onStateChange }) {
  const [state, _setStateRaw] = useState(() => {
    // 다른 .jsx 파일의 const는 모듈 스코프이므로 window로 참조
    const seedConcept = window.CONCEPT_SUPERBUMPERS;
    const seedProjects = [window.GDD_INGAME, window.GDD_VEHICLE, window.GDD_COMBAT].filter(Boolean);
    return {
      concepts: seedConcept ? [seedConcept] : [],
      projects: seedProjects,
      selection: seedConcept
        ? { type: 'concept', id: seedConcept.id }
        : (seedProjects[0] ? { type: 'gdd', id: seedProjects[0].id } : { type: 'concept', id: null }),
    };
  });
  const [bootLoaded, setBootLoaded] = useState(false);

  /* ===== Slide clipboard =====
   * - Ctrl+C / Ctrl+X / Ctrl+V 가 슬라이드 단위로 동작.
   * - 텍스트 선택이 있거나 입력 위젯에 포커스 중이면 브라우저 기본 동작에 양보.
   * - 세션 단위로만 유지 (탭/페이지 새로고침 시 비워짐). */
  const slideClipRef = useRef(null);

  /* ===== Undo/Redo 스택 =====
   * - 큰 변경(추가/삭제/이동/AI 생성/일괄/import) 직전에 commitNow() 호출.
   * - 텍스트 인라인 편집·selection 변경은 history 미추가 (contentEditable native undo가 텍스트 처리).
   * - 최대 50 단계 유지. */
  const historyRef = useRef({ past: [], future: [] });
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);
  const setState = _setStateRaw; // alias

  const commitNow = (label) => {
    const snapshot = stateRef.current;
    const past = [...historyRef.current.past, { state: snapshot, label, ts: Date.now() }];
    if (past.length > 50) past.shift();
    historyRef.current = { past, future: [] };
  };
  const undo = () => {
    const h = historyRef.current;
    if (!h.past.length) return false;
    const cur = stateRef.current;
    const last = h.past[h.past.length - 1];
    historyRef.current = {
      past: h.past.slice(0, -1),
      future: [{ state: cur, label: last.label, ts: Date.now() }, ...h.future].slice(0, 50),
    };
    _setStateRaw(last.state);
    return true;
  };
  const redo = () => {
    const h = historyRef.current;
    if (!h.future.length) return false;
    const cur = stateRef.current;
    const next = h.future[0];
    historyRef.current = {
      past: [...h.past, { state: cur, label: next.label, ts: Date.now() }].slice(-50),
      future: h.future.slice(1),
    };
    _setStateRaw(next.state);
    return true;
  };
  const canUndo = () => historyRef.current.past.length > 0;
  const canRedo = () => historyRef.current.future.length > 0;

  // 초기 로드 — IndexedDB / emergency 슬롯 / legacy localStorage + 백업 폴더 핸들 복원
  useEffect(() => {
    let alive = true;
    (async () => {
      const loaded = await loadStateAsync();
      if (!alive) return;
      if (loaded && loaded.projects && loaded.concepts) {
        setState(loaded);
      }
      // 백업 폴더 핸들 복원 (IndexedDB에 보관된 FileSystemDirectoryHandle)
      if (window.gddStorage?.restoreBackupDirectory) {
        try { await window.gddStorage.restoreBackupDirectory(); } catch {}
      }
      setBootLoaded(true);
    })();
    return () => { alive = false; };
  }, []);

  // 자동 백업: 큰 변경 발생 후 30초 디바운스로 폴더에 .gddproject 저장
  useEffect(() => {
    if (!bootLoaded) return;
    const t = setTimeout(async () => {
      if (window.gddStorage?.getBackupStatus?.()?.configured) {
        try { await window.gddStorage.autoBackup(); } catch {}
      }
    }, 30000);
    return () => clearTimeout(t);
  }, [state, bootLoaded]);

  const [view, setView] = useState('slide');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scale, setScale] = useState(0.6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [generationMode, setGenerationMode] = useState('ai');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showBrief, setShowBrief] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCmdK, setShowCmdK] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showConsistency, setShowConsistency] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showQualityGate, setShowQualityGate] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(() => !!(window.gemini?.getApiKey && window.gemini.getApiKey()));
  const [usageTick, setUsageTick] = useState(0); // 토큰/비용 강제 갱신 트리거

  const toast = useToast();
  // 슬라이드 내부(예: RulesSlide의 플로우 변환 버튼)에서 토스트를 띄울 수 있도록 글로벌 노출
  useEffect(() => {
    window.gddToast = toast;
    return () => { if (window.gddToast === toast) delete window.gddToast; };
  }, [toast]);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  /* Apply theme accent CSS vars */
  useEffect(() => {
    const theme = THEMES[tweaks.theme] || THEMES.cyan;
    const r = document.documentElement;
    r.style.setProperty('--accent', theme.accent);
    r.style.setProperty('--accent-2', theme.accent2);
    r.style.setProperty('--accent-strong', theme.accentStrong);
    r.style.setProperty('--accent-soft', theme.accentSoft);
  }, [tweaks.theme]);

  /* AI usage 변경 이벤트 구독 — 배지 자동 갱신 */
  useEffect(() => {
    const h = () => setUsageTick(t => t + 1);
    window.addEventListener('gdd-usage-changed', h);
    return () => window.removeEventListener('gdd-usage-changed', h);
  }, []);

  /* Persist (디바운스 + IndexedDB). 부트 로드 완료 후에만 저장 — 초기값 덮어쓰기 방지 */
  useEffect(() => {
    if (!bootLoaded) return;
    const payload = { projects: state.projects, concepts: state.concepts, selection: state.selection };
    saveStateDebounced(payload);
    onStateChange?.(payload); // ErrorBoundary가 비상 백업을 위해 참조
  }, [state, bootLoaded, onStateChange]);

  const selection = state.selection || { type: 'concept', id: state.concepts?.[0]?.id };
  const project = selection.type === 'gdd' ? state.projects.find(p => p.id === selection.id) : null;
  const concept = selection.type === 'concept' ? state.concepts.find(c => c.id === selection.id) : null;

  const setProject = (updater) => {
    if (selection.type !== 'gdd') return;
    setState(s => ({
      ...s,
      projects: s.projects.map(p => p.id === selection.id ? (typeof updater === 'function' ? updater(p) : updater) : p),
    }));
  };

  const setConcept = (updater) => {
    if (selection.type !== 'concept') return;
    setState(s => ({
      ...s,
      concepts: s.concepts.map(c => c.id === selection.id ? (typeof updater === 'function' ? updater(c) : updater) : c),
    }));
  };

  const patchSlide = useCallback((slideId, patch) => {
    setProject(p => ({
      ...p,
      slides: (p.slides || []).map(s => s.id === slideId ? { ...s, ...patch, data: patch.data || s.data } : s),
      updatedAt: new Date().toISOString().slice(0, 10),
    }));
  }, [selection.id, selection.type]);

  const addSlide = (type) => {
    setShowAddMenu(false);
    commitNow('슬라이드 추가: ' + type);
    const templates = {
      'intent': { section: '01', sectionName: '개요', title: '기획 의도', tagline: '본 기능의 기획 의도를 4가지 축에서 정의한다.', cards: [
        { idx: '01', head: '제목', desc: '설명' },
        { idx: '02', head: '제목', desc: '설명' },
        { idx: '03', head: '제목', desc: '설명' },
        { idx: '04', head: '제목', desc: '설명' },
      ]},
      'terms': { section: '01', sectionName: '개요', title: '용어 정의', rows: [
        { term: '용어 1', def: '정의', note: '비고' },
        { term: '용어 2', def: '정의', note: '비고' },
        { term: '용어 3', def: '정의', note: '비고' },
      ]},
      'rules': { section: '02', sectionName: '시스템 상세', title: '규칙', blocks: [
        { head: '기본 규칙', items: ['규칙 1', '규칙 2', '규칙 3'] },
        { head: '예외 처리', items: ['예외 1', '예외 2'] },
      ]},
      'data-table': { section: '04', sectionName: '데이터 테이블', title: '데이터 테이블',
        columns: [
          { key: 'field', label: 'Field', width: '22%' },
          { key: 'type', label: 'Type', width: '15%' },
          { key: 'desc', label: '설명' },
        ],
        rows: [
          { field: 'id', type: 'string', desc: '고유 식별자' },
          { field: 'name', type: 'string', desc: '이름' },
        ],
      },
      'flow': { section: '02', sectionName: '플로우 차트', title: '플로우 차트', nodes: [
        { kind: 'start', label: '시작' },
        { kind: 'process', label: '처리' },
        { kind: 'end', label: '종료' },
      ]},
      'diagram': { section: '02', sectionName: '시스템 다이어그램', title: '시스템 구조', nodes: [
        { id: 'n1', label: '클라이언트', kind: 'start', col: 0, row: 0 },
        { id: 'n2', label: '게임 서버', sub: 'GAME_SERVER', kind: 'service', col: 2, row: 0 },
        { id: 'n3', label: '매치메이커', kind: 'process', col: 1, row: 1 },
        { id: 'n4', label: 'DB', sub: 'POSTGRES', kind: 'data', col: 3, row: 1 },
      ], edges: [
        { from: 'n1', to: 'n3', label: '매칭 요청' },
        { from: 'n3', to: 'n2', label: '세션 생성' },
        { from: 'n2', to: 'n4', label: '저장', kind: 'dashed' },
      ]},
      'sequence-diagram': { section: '02', sectionName: '시퀀스 다이어그램', title: '시퀀스 다이어그램',
        participants: [
          { id: 'p1', name: '클라이언트', kind: 'actor' },
          { id: 'p2', name: '게이트웨이', kind: 'system' },
          { id: 'p3', name: '인증 서비스', kind: 'service' },
          { id: 'p4', name: 'DB', kind: 'data' },
        ],
        messages: [
          { from: 'p1', to: 'p2', label: 'POST /login', kind: 'sync' },
          { from: 'p2', to: 'p3', label: 'auth.verify(id, pw)', kind: 'sync' },
          { from: 'p3', to: 'p4', label: 'user.find(id)', kind: 'sync' },
          { from: 'p4', to: 'p3', label: 'user record', kind: 'return' },
          { from: 'p3', to: 'p2', label: 'JWT token', kind: 'return' },
          { from: 'p2', to: 'p1', label: '200 OK + token', kind: 'return' },
        ],
      },
      'class-diagram': { section: '02', sectionName: '클래스 다이어그램', title: '클래스 다이어그램',
        classes: [
          { id: 'c1', name: 'Entity', stereotype: '<<abstract>>', attrs: ['#id: UUID', '#createdAt: DateTime'], methods: ['+save(): void'], col: 1, row: 0 },
          { id: 'c2', name: 'Player', stereotype: '', attrs: ['-hp: int', '-mp: int', '-level: int'], methods: ['+takeDamage(amount: int): void', '+heal(amount: int): void'], col: 0, row: 1 },
          { id: 'c3', name: 'Inventory', stereotype: '', attrs: ['-slots: Item[]', '-capacity: int'], methods: ['+add(item: Item): bool', '+remove(slotIdx: int): Item'], col: 2, row: 1 },
          { id: 'c4', name: 'Item', stereotype: '<<entity>>', attrs: ['+name: string', '+stack: int'], methods: ['+use(target: Entity): void'], col: 3, row: 0 },
        ],
        relations: [
          { from: 'c2', to: 'c1', kind: 'inherit', label: '' },
          { from: 'c2', to: 'c3', kind: 'compose', label: '1' },
          { from: 'c3', to: 'c4', kind: 'aggregate', label: '0..*' },
        ],
      },
      'ui-design': { section: '03', sectionName: 'UI/UX', title: '화면 설계', callouts: [
        { name: '영역 1', desc: '설명' },
        { name: '영역 2', desc: '설명' },
        { name: '영역 3', desc: '설명' },
      ]},
      'resources': { section: '05', sectionName: '필요 리소스', title: '필요 리소스 목록', categories: [
        { name: 'UI', count: 'x?', items: ['아이템 1', '아이템 2'] },
        { name: '사운드', count: 'x?', items: ['아이템 1'] },
        { name: '데이터', count: 'x?', items: ['아이템 1'] },
      ]},
      'section-divider': { num: '0?', title: '섹션 제목', subtitle: '섹션 설명', imagePrompt: '' },
      'image-embed': { section: '03', sectionName: '참고 이미지', title: '참고 이미지', caption: '참고 이미지 캡션', imagePrompt: '' },
      // Phase 1 신규 7종
      'balance-table': {
        section: '04', sectionName: '밸런싱', title: '수치 밸런싱',
        formula: '`damage = base × (1 + str/100) × elem_mod`',
        vars: [
          { name: 'base', formula: '카드 등급별 기본값', range: '50~200', defaultValue: '100', sensitivity: '±10% → 평균 매치 시간 ±15초', notes: '' },
          { name: 'str', formula: '레벨 + 강화 보정', range: '0~500', defaultValue: '0', sensitivity: '레벨 1당 +5', notes: '' },
          { name: 'elem_mod', formula: '속성 상성표', range: '0.5~2.0', defaultValue: '1.0', sensitivity: '상성 일치 시 1.5', notes: '카운터는 2.0' },
        ],
        curve: { x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], y: [100, 220, 380, 580, 820, 1100, 1420, 1780, 2180, 2620], xLabel: '레벨', yLabel: '강화 비용 (재화)' },
      },
      'state-machine': {
        section: '02', sectionName: '상태 머신', title: '상태 머신',
        states: [
          { id: 's1', name: 'IDLE', kind: 'initial', onEnter: '`enableInput()`', onExit: '`disableInput()`', invariants: ['`input_locked == false`'] },
          { id: 's2', name: 'CASTING', kind: 'normal', onEnter: '`playCastAnim()`', onExit: '', invariants: ['`animation_locked == true`'] },
          { id: 's3', name: 'COOLDOWN', kind: 'normal', onEnter: '`startCooldownTimer()`', onExit: '', invariants: ['`canCast == false`'] },
          { id: 's4', name: 'DEAD', kind: 'final', onEnter: '`playDeathSeq()`', onExit: '', invariants: ['모든 입력 차단', '카메라 페이드아웃'] },
        ],
        transitions: [
          { from: 's1', to: 's2', event: 'CAST_INPUT', guard: '`mana >= cost`', action: '`consumeMana(cost)`' },
          { from: 's2', to: 's3', event: 'CAST_COMPLETE', guard: '', action: '`spawnProjectile()`' },
          { from: 's3', to: 's1', event: 'COOLDOWN_END', guard: '', action: '' },
          { from: 's1', to: 's4', event: 'HP_ZERO', guard: '`hp <= 0`', action: '`emit(death)`' },
        ],
      },
      'api-contract': {
        section: '02', sectionName: 'API 계약', title: 'POST /api/match/create',
        endpoint: '/api/match/create', method: 'POST', auth: 'bearer', slaMs: 200,
        request: '{\n  "userId": "uuid",\n  "mode": "casual" | "ranked" | "custom",\n  "preferredRegion": "ap-northeast-1"\n}',
        response: '{\n  "matchId": "uuid",\n  "gameServer": "host:port",\n  "sessionToken": "jwt",\n  "expiresAt": "2026-05-23T12:34:56Z"\n}',
        errors: [
          { code: '400', message: 'INVALID_MODE', when: '`mode` 가 enum 외 값' },
          { code: '401', message: 'TOKEN_EXPIRED', when: 'Bearer 토큰 만료' },
          { code: '409', message: 'ALREADY_IN_MATCH', when: '동일 userId 가 매치 진행 중' },
          { code: '503', message: 'NO_SERVERS', when: '리전에 가용 게임 서버 없음 → 큐 대기' },
        ],
        idempotencyKey: '`X-Idempotency-Key` 헤더 권장. 동일 키로 24h 내 재요청 시 동일 matchId 반환.',
        notes: '평균 응답 200ms 이하. 99p 500ms 이하. 큐 진입 시 202 + Location 헤더.',
      },
      'acceptance-criteria': {
        section: '03', sectionName: '수락 기준', title: '매칭 시작 — 수락 기준',
        userStory: { as: '신규 유저', want: '첫 매치를 빠르게 시작하길', soThat: 'D1 리텐션 60%↑ 유지' },
        criteria: [
          { id: 'AC-1', given: '유저가 로그인 직후 메인 로비에 진입했다', when: '`매칭` 버튼을 1회 탭한다', then: '3초 이내에 매칭 진행 모달이 표시되고, 카운트다운이 시작된다', edgeCases: ['네트워크 단절 시 5초 후 재시도 안내', '동시에 두 번 탭하면 두 번째 탭은 무시'] },
          { id: 'AC-2', given: '매칭 진행 중이다', when: '60초가 지나도 상대를 못 찾는다', then: '`매칭 범위 확대` 알림 + 봇 매치 옵션 제공', edgeCases: ['랭크 매치는 봇 옵션 미노출'] },
        ],
      },
      'telemetry': {
        section: '04', sectionName: '텔레메트리', title: '매칭 이벤트',
        events: [
          { name: 'match_button_tapped', when: '유저가 매칭 버튼 탭', props: [
            { key: 'mode', type: 'enum', required: true, note: 'casual / ranked / custom' },
            { key: 'session_id', type: 'uuid', required: true, note: '클라이언트 세션' },
          ], kpi: '매칭 시도율' },
          { name: 'match_found', when: '매칭 성공', props: [
            { key: 'match_id', type: 'uuid', required: true, note: '' },
            { key: 'wait_time_ms', type: 'number', required: true, note: '매칭 대기 시간' },
            { key: 'opponent_mmr_delta', type: 'number', required: false, note: '랭크에서만' },
          ], kpi: '평균 매칭 시간' },
          { name: 'match_abandoned', when: '매칭 도중 취소', props: [
            { key: 'reason', type: 'enum', required: true, note: 'user_cancel / timeout / network_error' },
            { key: 'wait_time_ms', type: 'number', required: true, note: '' },
          ], kpi: '매칭 이탈율' },
        ],
        funnels: [
          { name: '매칭 펀넬', steps: ['match_button_tapped', 'match_found', 'match_started'], goal: '진입율 95%↑' },
        ],
      },
      'risk-register': {
        section: '06', sectionName: '위험 등기부', title: '런칭 전 위험',
        risks: [
          { id: 'R-1', title: '매칭 서버 부하 (동접 10만 초과 시 큐 지연)', impact: 5, likelihood: 3, mitigation: '오토스케일 + 봇 매치 폴백 + 큐 대기 UX', owner: '서버팀', status: 'open' },
          { id: 'R-2', title: '결제 모듈 인증 실패 (PG사 API 변경)', impact: 4, likelihood: 2, mitigation: '월 1회 정기 스모크 테스트 + 폴백 PG', owner: 'BM 팀', status: 'mitigated' },
          { id: 'R-3', title: '리텐션 D1 < 40% 시 마케팅 ROI 미달', impact: 4, likelihood: 3, mitigation: '튜토리얼 A/B + 첫 매치 봇 난이도 보정', owner: 'PM', status: 'open' },
          { id: 'R-4', title: '저사양 안드로이드 (RAM 2GB) 60fps 미달', impact: 3, likelihood: 4, mitigation: '품질 옵션 자동 다운그레이드 + 디바이스별 QA 매트릭스', owner: '클라팀', status: 'open' },
        ],
      },
      'roadmap': {
        section: '06', sectionName: '로드맵', title: '런칭 로드맵',
        phases: [
          { name: 'MVP', start: '2026.01', end: '2026.03', deliverables: ['코어 매치 + 단일 모드', '4개 캐릭터', '내부 알파'], dependsOn: [] },
          { name: '알파', start: '2026.03', end: '2026.05', deliverables: ['랭크 모드 추가', '8개 캐릭터', '클로즈드 베타 (500명)'], dependsOn: ['MVP'] },
          { name: '베타', start: '2026.05', end: '2026.07', deliverables: ['BM 시스템', '시즌 패스', '오픈 베타 (10K명)'], dependsOn: ['알파'] },
          { name: '소프트런칭', start: '2026.07', end: '2026.09', deliverables: ['1개 지역 출시', '운영 안정화', 'KPI 검증'], dependsOn: ['베타'] },
          { name: '글로벌 런칭', start: '2026.09', end: '2026.12', deliverables: ['전 지역 출시', '마케팅 캠페인'], dependsOn: ['소프트런칭'] },
        ],
      },
    };
    const newSlide = { id: window.uid(), type, data: templates[type] || {} };
    setProject(p => ({ ...p, slides: [...(p.slides || []), newSlide] }));
    setCurrentIdx((project?.slides || []).length);
    toast('슬라이드 추가됨', 'ok');
  };

  /* 컨셉/선행 기획서를 후속 기획서의 컨텍스트로 빌드.
   * priorIds를 명시하면 그 GDD들의 요약만, 아니면 컨셉에 링크된 모든 작성됨 GDD 요약. */
  const buildGddContext = (conceptOrId, priorIds) => {
    const c = typeof conceptOrId === 'string'
      ? state.concepts.find(x => x.id === conceptOrId)
      : conceptOrId;
    if (!c) return null;
    const ids = (priorIds && priorIds.length)
      ? priorIds
      : (c.recommendedPlans || []).filter(p => p.linkedGddId).map(p => p.linkedGddId);
    const prior = ids
      .map(id => state.projects.find(p => p.id === id))
      .filter(Boolean)
      .map(g => window.summarizeGddForContext(g));
    return { concept: c, prior };
  };

  /* Handle command:
   *  - 현재 GDD가 선택된 상태 → 현재 GDD를 수정 (aiEditGdd)
   *  - 그 외 (컨셉 선택 또는 선택 없음) → 새 GDD 생성 (aiGenerateGdd)
   */
  const sendCommand = async (text, attachments) => {
    // 분기: GDD 가 선택되어 있고, AI 모드일 때는 "수정 명령"으로 처리
    if (selection.type === 'gdd' && project && generationMode === 'ai') {
      commitNow('AI 기획서 수정');
      setIsGenerating(true);
      try {
        const { project: updated, summary, opsCount } = await aiEditGdd(project, text, attachments);
        setProject(_ => updated);
        toast(`수정 완료 (${opsCount}개 변경) — ${summary}`, 'ok');
      } catch (e) {
        console.error(e);
        toast('수정 실패: ' + (e.message || e), 'err');
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // 그 외: 새 GDD 생성
    commitNow('AI 기획서 생성');
    setIsGenerating(true);
    try {
      let result;
      const fullCommand = text;
      if (generationMode === 'demo') {
        await new Promise(r => setTimeout(r, 700));
        result = window.generateDemoGdd(fullCommand);
      } else {
        const ctx = concept ? buildGddContext(concept) : null;
        result = await aiGenerateGdd(fullCommand, state.projects.map(p => p.title), attachments, ctx);
      }
      // If viewing a concept, inherit its team badge
      if (concept && concept.badge) result.team = concept.badge;

      result.history = [{
        ts: new Date().toISOString().slice(0, 16).replace('T', ' '),
        cmd: fullCommand + (attachments?.length ? ` [+${attachments.length}개 첨부]` : ''),
        summary: `${result.slides.length}개 슬라이드 생성`,
      }];
      if (attachments?.length) result.attachments = attachments;

      const linkConceptId = concept?.id;
      setState(s => {
        let newConcepts = s.concepts;
        if (linkConceptId) {
          // Auto-link as a new recommendedPlan
          const newPlan = { id: 'rp' + window.uid().slice(0, 4), title: result.title, description: result.subtitle || '채팅에서 생성', linkedGddId: result.id };
          newConcepts = s.concepts.map(c => c.id === linkConceptId
            ? { ...c, recommendedPlans: [...(c.recommendedPlans || []), newPlan] }
            : c);
        }
        return {
          ...s,
          concepts: newConcepts,
          projects: [...s.projects, result],
          selection: { type: 'gdd', id: result.id },
        };
      });
      setCurrentIdx(0);
      toast(`"${result.title}" 생성 완료 (${result.slides.length} slides)`, 'ok');
    } catch (e) {
      console.error(e);
      toast('생성 실패: ' + (e.message || e), 'err');
    } finally {
      setIsGenerating(false);
    }
  };

  /* Brief composer submit */
  const [briefMode, setBriefMode] = useState('gdd'); // 'gdd' | 'concept' | 'gdd-linked'
  const [briefPrefill, setBriefPrefill] = useState(null); // {title, brief, linkedPlan}

  const handleBriefSubmit = async ({ title, brief, attachments, mode }) => {
    commitNow('브리프 생성');
    setShowBrief(false);
    setGenerationMode(mode);
    const linkedPlan = briefPrefill?.linkedPlan;
    const conceptIdForLink = briefPrefill?.conceptId;
    setBriefPrefill(null);

    if (briefMode === 'concept') {
      // Generate a concept
      setIsGenerating(true);
      try {
        const text = (title ? title + ' — ' : '') + (brief || '');
        let result;
        if (mode === 'demo') {
          await new Promise(r => setTimeout(r, 600));
          result = { ...window.CONCEPT_BLANK(), title: title || '새 컨셉', subtitle: brief || '한 줄 부제' };
        } else {
          result = await aiGenerateConcept(text, attachments);
        }
        setState(s => ({
          ...s,
          concepts: [...s.concepts, result],
          selection: { type: 'concept', id: result.id },
        }));
        toast(`"${result.title}" 컨셉 생성 완료`, 'ok');
      } catch (e) {
        console.error(e);
        toast('컨셉 생성 실패: ' + (e.message || e), 'err');
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Generate a GDD; if linked, attach to concept
      const text = (title ? title + ' — ' : '') + (brief || '');
      setIsGenerating(true);
      try {
        let result;
        if (mode === 'demo') {
          await new Promise(r => setTimeout(r, 600));
          result = window.generateDemoGdd(text);
        } else {
          // brief에 conceptId가 지정되어 있으면 그 컨셉 + 형제 기획서 요약을 컨텍스트로 전달
          const baseCtx = conceptIdForLink ? buildGddContext(conceptIdForLink) : (concept ? buildGddContext(concept) : null);
          const ctx = baseCtx ? { ...baseCtx, plan: linkedPlan || { title } } : null;
          result = await aiGenerateGdd(text, state.projects.map(p => p.title), attachments, ctx);
        }
        result.history = [{
          ts: new Date().toISOString().slice(0, 16).replace('T', ' '),
          cmd: text,
          summary: `${result.slides.length}개 슬라이드 생성`,
        }];
        if (attachments?.length) result.attachments = attachments;

        setState(s => {
          const newProjects = [...s.projects, result];
          let newConcepts = s.concepts;
          if (linkedPlan && conceptIdForLink) {
            newConcepts = s.concepts.map(c => {
              if (c.id !== conceptIdForLink) return c;
              return {
                ...c,
                recommendedPlans: (c.recommendedPlans || []).map(rp =>
                  rp.id === linkedPlan.id ? { ...rp, linkedGddId: result.id } : rp
                ),
              };
            });
          }
          return {
            ...s,
            projects: newProjects,
            concepts: newConcepts,
            selection: { type: 'gdd', id: result.id },
          };
        });
        setCurrentIdx(0);
        toast(`"${result.title}" 생성 완료 (${result.slides.length} slides)`, 'ok');
      } catch (e) {
        console.error(e);
        toast('생성 실패: ' + (e.message || e), 'err');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const openBriefForConcept = () => {
    setBriefMode('concept');
    setBriefPrefill(null);
    setShowBrief(true);
  };

  /* Concept brief — richer payload with theme/team/author */
  const handleConceptBriefSubmit = async ({ idea, team, author, bgGradient, palette, theme, attachments, mode }) => {
    commitNow('AI 컨셉 생성');
    setShowBrief(false);
    setGenerationMode(mode);
    setIsGenerating(true);
    try {
      let result;
      const command = idea || '랜덤 게임 컨셉';
      if (mode === 'demo') {
        await new Promise(r => setTimeout(r, 600));
        result = {
          ...window.CONCEPT_BLANK(),
          title: '랜덤 컨셉',
          subtitle: idea ? idea.slice(0, 60) : '한 줄 부제',
        };
      } else {
        result = await aiGenerateConcept(command, attachments);
      }
      // Apply user-provided team/author/theme overrides
      if (team) result.badge = team;
      if (author) result.author = author;
      if (theme) result.theme = theme;
      if (palette && palette.length) {
        // Merge: palette from user provides main 3 colors, but keep 5-color shape
        const existing = result.palette || [];
        result.palette = [
          { name: '메인 컬러', hex: palette[0]?.hex || existing[0]?.hex || '#88DFB0' },
          { name: '보조 컬러', hex: palette[1]?.hex || existing[1]?.hex || '#CCFFDA' },
          existing[2] || { name: '보조 2', hex: '#8DF0F0' },
          { name: '강조 컬러', hex: palette[2]?.hex || existing[3]?.hex || '#F5D94F' },
          { name: '배경', hex: (bgGradient && bgGradient[0]) || existing[4]?.hex || '#0A1411' },
        ];
      }
      if (bgGradient) result.bgGradient = bgGradient;

      setState(s => ({
        ...s,
        concepts: [...s.concepts, result],
        selection: { type: 'concept', id: result.id },
      }));
      toast(`"${result.title}" 컨셉 생성 완료`, 'ok');
    } catch (e) {
      console.error(e);
      toast('컨셉 생성 실패: ' + (e.message || e), 'err');
    } finally {
      setIsGenerating(false);
    }
  };

  const openBriefForGdd = () => {
    setBriefMode('gdd');
    setBriefPrefill(null);
    setShowBrief(true);
  };
  const openBriefForRecommendedPlan = (plan) => {
    if (!concept) return;
    setBriefMode('gdd-linked');
    setBriefPrefill({
      title: plan.title,
      brief: plan.description + '\n\n(컨셉: ' + concept.title + ' — ' + concept.subtitle + ')',
      linkedPlan: plan,
      conceptId: concept.id,
    });
    setShowBrief(true);
  };

  /* 일괄 생성: 컨셉의 미작성 recommendedPlans 전체를 AI로 시리얼 생성 */
  const bulkCreatePlansForConcept = async () => {
    if (!concept) return;
    const pending = (concept.recommendedPlans || []).filter(p => !p.linkedGddId);
    if (!pending.length) {
      toast('미작성 기획서가 없습니다.', 'ok');
      return;
    }
    const ok = confirm(
      `미작성 기획서 ${pending.length}개를 AI로 일괄 생성합니다.\n` +
      `Gemini 모델 속도에 따라 약 ${pending.length}~${pending.length * 2}분이 소요될 수 있습니다.\n` +
      `진행하시겠습니까?`
    );
    if (!ok) return;

    commitNow('일괄 기획서 생성');
    setIsGenerating(true);
    const conceptId = concept.id;
    const conceptTitle = concept.title;
    const conceptSubtitle = concept.subtitle || '';
    const conceptBadge = concept.badge;

    // 정합성 보장: 이미 작성된 기획서 ID + 일괄 진행 중 생성된 ID를 누적
    const accumulatedPriorIds = (concept.recommendedPlans || [])
      .filter(p => p.linkedGddId)
      .map(p => p.linkedGddId);
    // 그리고 매 반복마다 직전에 생성된 GDD도 prior에 포함되도록 — 단,
    // setState는 비동기라 즉시 state.projects에서 못 찾을 수 있어 로컬 캐시도 유지
    const sessionGenerated = [];

    let success = 0, failed = 0;
    for (let i = 0; i < pending.length; i++) {
      const plan = pending[i];
      toast(`(${i + 1}/${pending.length}) "${plan.title}" 생성 중…`, '');
      try {
        const text = `${plan.title} — ${plan.description}\n\n(컨셉: ${conceptTitle} — ${conceptSubtitle})`;
        // 컨셉 + 누적 prior (state + 세션 캐시) 모두로 컨텍스트 구성
        const knownProjects = [...state.projects, ...sessionGenerated];
        const prior = accumulatedPriorIds
          .map(id => knownProjects.find(p => p.id === id))
          .filter(Boolean)
          .map(g => window.summarizeGddForContext(g));
        const ctx = { concept, prior, plan };
        const result = await aiGenerateGdd(text, knownProjects.map(p => p.title), null, ctx);
        if (conceptBadge) result.team = conceptBadge;
        result.history = [{
          ts: new Date().toISOString().slice(0, 16).replace('T', ' '),
          cmd: text,
          summary: `${result.slides.length}개 슬라이드 생성 (일괄, 컨텍스트 ${prior.length}개)`,
        }];
        sessionGenerated.push(result);
        accumulatedPriorIds.push(result.id);
        setState(s => {
          const newProjects = [...s.projects, result];
          const newConcepts = s.concepts.map(c => {
            if (c.id !== conceptId) return c;
            return {
              ...c,
              recommendedPlans: (c.recommendedPlans || []).map(rp =>
                rp.id === plan.id ? { ...rp, linkedGddId: result.id } : rp
              ),
            };
          });
          return { ...s, projects: newProjects, concepts: newConcepts };
        });
        success++;
      } catch (e) {
        console.error('bulk fail', plan.title, e);
        failed++;
      }
    }

    setIsGenerating(false);
    toast(
      `일괄 생성 완료 — ${success} 성공${failed ? ` / ${failed} 실패` : ''}`,
      success > 0 ? 'ok' : 'err'
    );
  };

  const newProject = () => {
    commitNow('새 빈 기획서');
    const fresh = window.GDD_BLANK_TEMPLATE();
    setState(s => ({
      ...s,
      projects: [...s.projects, fresh],
      selection: { type: 'gdd', id: fresh.id },
    }));
    setCurrentIdx(0);
    toast('새 빈 기획서 생성됨', 'ok');
  };

  /* === GDD 스냅샷 (컨셉처럼) === */
  const saveGddSnapshot = () => {
    if (selection.type !== 'gdd' || !project) {
      toast('기획서를 선택한 상태에서만 스냅샷 저장이 가능합니다.', 'err');
      return;
    }
    const defaultName = `${project.title} - ${new Date().toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
    const name = prompt('스냅샷 이름:', defaultName);
    if (!name) return;
    const snapshot = {
      id: 's' + uid(),
      name,
      ts: new Date().toISOString(),
      data: JSON.parse(JSON.stringify({
        ...project,
        snapshots: undefined,
      })),
    };
    commitNow('GDD 스냅샷 저장');
    setProject(p => ({ ...p, snapshots: [...(p.snapshots || []), snapshot] }));
    toast(`스냅샷 "${name}" 저장됨`, 'ok');
  };
  const restoreGddSnapshot = (snap) => {
    if (selection.type !== 'gdd' || !project) return;
    if (!confirm(`"${snap.name}" 스냅샷으로 복원하시겠습니까? 현재 상태는 자동 백업됩니다.`)) return;
    const backup = {
      id: 's' + uid(),
      name: '자동 백업 ' + new Date().toLocaleString('ko-KR'),
      ts: new Date().toISOString(),
      data: JSON.parse(JSON.stringify({ ...project, snapshots: undefined })),
    };
    commitNow('GDD 스냅샷 복원');
    setProject(p => ({
      ...snap.data,
      id: p.id,
      snapshots: [...(p.snapshots || []), backup],
    }));
    toast('스냅샷 복원됨', 'ok');
  };
  const [showGddSnapshots, setShowGddSnapshots] = useState(false);

  /* Delete slide */
  const deleteSlide = (slideId) => {
    if (selection.type !== 'gdd' || !project) return;
    commitNow('슬라이드 삭제');
    const slides = (project.slides || []).filter(s => s.id !== slideId);
    setProject(p => ({ ...p, slides, updatedAt: new Date().toISOString().slice(0, 10) }));
    if (currentIdx >= slides.length) setCurrentIdx(Math.max(0, slides.length - 1));
    toast('슬라이드 삭제됨', 'ok');
  };

  /* Move slide (delta: -1 = up, +1 = down) */
  const moveSlide = (fromIdx, delta) => {
    if (selection.type !== 'gdd' || !project) return;
    commitNow('슬라이드 이동');
    const slides = [...(project.slides || [])];
    const toIdx = fromIdx + delta;
    if (toIdx < 0 || toIdx >= slides.length) return;
    [slides[fromIdx], slides[toIdx]] = [slides[toIdx], slides[fromIdx]];
    setProject(p => ({ ...p, slides, updatedAt: new Date().toISOString().slice(0, 10) }));
    if (currentIdx === fromIdx) setCurrentIdx(toIdx);
    else if (currentIdx === toIdx) setCurrentIdx(fromIdx);
  };

  /* Delete project or concept */
  const deleteItem = (type, id) => {
    commitNow(type === 'gdd' ? '기획서 삭제' : '컨셉 삭제');
    if (type === 'gdd') {
      const projectsLeft = state.projects.filter(p => p.id !== id);
      // Also unlink from any concept that referenced this gdd
      const concepts = state.concepts.map(c => ({
        ...c,
        recommendedPlans: (c.recommendedPlans || []).map(rp => rp.linkedGddId === id ? { ...rp, linkedGddId: null } : rp),
      }));
      let nextSelection = state.selection;
      if (state.selection.type === 'gdd' && state.selection.id === id) {
        nextSelection = concepts[0] ? { type: 'concept', id: concepts[0].id } : (projectsLeft[0] ? { type: 'gdd', id: projectsLeft[0].id } : { type: 'concept', id: null });
      }
      setState({ ...state, projects: projectsLeft, concepts, selection: nextSelection });
    } else if (type === 'concept') {
      const conceptsLeft = state.concepts.filter(c => c.id !== id);
      let nextSelection = state.selection;
      if (state.selection.type === 'concept' && state.selection.id === id) {
        nextSelection = conceptsLeft[0] ? { type: 'concept', id: conceptsLeft[0].id } : (state.projects[0] ? { type: 'gdd', id: state.projects[0].id } : { type: 'concept', id: null });
      }
      setState({ ...state, concepts: conceptsLeft, selection: nextSelection });
    }
    toast('삭제됨', 'ok');
  };

  /* Esc + arrow keys + Ctrl+C/V/X */
  useEffect(() => {
    const isTypingTarget = (el) => {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (el.isContentEditable) return true;
      return false;
    };
    const hasTextSelection = () => {
      const sel = window.getSelection && window.getSelection();
      return !!(sel && !sel.isCollapsed && (sel.toString() || '').length > 0);
    };
    const anyModalOpen = () => (
      showAddMenu || showBrief || showSettings || showCmdK || showShortcuts || showGddSnapshots || showStats || showConsistency
    );
    const inSlideContext = () => (selection.type === 'gdd' && view === 'slide' && !!project);

    const onKey = (e) => {
      const isTyping = isTypingTarget(document.activeElement);
      const ctrl = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl+K — 어디서든 명령 팔레트
      if (ctrl && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setShowCmdK(v => !v);
        return;
      }
      // Cmd/Ctrl+S — 강제 저장
      if (ctrl && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        const payload = { projects: stateRef.current.projects, concepts: stateRef.current.concepts, selection: stateRef.current.selection };
        if (window.gddStorage) window.gddStorage.saveState(payload).then(() => toast('저장됨', 'ok')).catch(e => toast('저장 실패: ' + e.message, 'err'));
        return;
      }
      // Cmd/Ctrl+Shift+Z — Redo
      if (ctrl && e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        if (isTyping) return; // contentEditable native undo 보호
        e.preventDefault();
        if (redo()) toast('다시 실행', '');
        else toast('다시 실행할 항목이 없습니다', '');
        return;
      }
      // Cmd/Ctrl+Z — Undo (텍스트 편집 중이면 브라우저 native undo가 처리)
      if (ctrl && (e.key === 'z' || e.key === 'Z')) {
        if (isTyping) return;
        e.preventDefault();
        if (undo()) toast('실행 취소', '');
        else toast('실행 취소할 항목이 없습니다', '');
        return;
      }
      // Cmd/Ctrl+D — 현재 슬라이드 복제
      if (ctrl && (e.key === 'd' || e.key === 'D')) {
        if (isTyping || !inSlideContext()) return;
        e.preventDefault();
        const slides = project.slides || [];
        const cur = slides[currentIdx];
        if (!cur) return;
        commitNow('슬라이드 복제');
        const dup = { id: uid(), type: cur.type, data: JSON.parse(JSON.stringify(cur.data || {})) };
        setProject(p => ({
          ...p,
          slides: [...slides.slice(0, currentIdx + 1), dup, ...slides.slice(currentIdx + 1)],
        }));
        setCurrentIdx(currentIdx + 1);
        toast('슬라이드 복제됨', 'ok');
        return;
      }
      // Cmd/Ctrl+C / X / V — 슬라이드 단위 클립보드
      // 텍스트 입력/선택이 있을 때는 브라우저 기본 동작을 방해하지 않는다.
      if (ctrl && !e.shiftKey && !e.altKey && (e.key === 'c' || e.key === 'C')) {
        if (isTyping || hasTextSelection()) return;
        if (!inSlideContext() || anyModalOpen()) return;
        const cur = (project.slides || [])[currentIdx];
        if (!cur) return;
        e.preventDefault();
        slideClipRef.current = { type: cur.type, data: JSON.parse(JSON.stringify(cur.data || {})) };
        toast('슬라이드 복사됨', 'ok');
        return;
      }
      if (ctrl && !e.shiftKey && !e.altKey && (e.key === 'x' || e.key === 'X')) {
        if (isTyping || hasTextSelection()) return;
        if (!inSlideContext() || anyModalOpen()) return;
        const curSlides = project.slides || [];
        const cur = curSlides[currentIdx];
        if (!cur) return;
        e.preventDefault();
        slideClipRef.current = { type: cur.type, data: JSON.parse(JSON.stringify(cur.data || {})) };
        commitNow('슬라이드 잘라내기');
        // 함수형 updater 내부에서 slides 를 다시 계산 (stale closure 방지)
        setProject(p => {
          const slidesNow = p.slides || [];
          const idx = Math.min(currentIdx, slidesNow.length - 1);
          if (idx < 0) return p;
          const filtered = slidesNow.filter((_, i) => i !== idx);
          return { ...p, slides: filtered, updatedAt: new Date().toISOString().slice(0, 10) };
        });
        if (currentIdx >= curSlides.length - 1) setCurrentIdx(Math.max(0, curSlides.length - 2));
        toast('슬라이드 잘라내기', 'ok');
        return;
      }
      if (ctrl && !e.shiftKey && !e.altKey && (e.key === 'v' || e.key === 'V')) {
        if (isTyping) return;
        if (!inSlideContext() || anyModalOpen()) return;
        const clip = slideClipRef.current;
        if (!clip) { toast('붙여넣을 슬라이드가 없습니다', ''); return; }
        e.preventDefault();
        commitNow('슬라이드 붙여넣기');
        const dup = { id: uid(), type: clip.type, data: JSON.parse(JSON.stringify(clip.data || {})) };
        // 함수형 updater 내부에서 slides 를 다시 계산 (stale closure 방지)
        let plannedInsertAt = currentIdx + 1;
        setProject(p => {
          const slidesNow = p.slides || [];
          const insertAt = Math.min(slidesNow.length, currentIdx + 1);
          plannedInsertAt = insertAt;
          return {
            ...p,
            slides: [...slidesNow.slice(0, insertAt), dup, ...slidesNow.slice(insertAt)],
            updatedAt: new Date().toISOString().slice(0, 10),
          };
        });
        setCurrentIdx(plannedInsertAt);
        toast('슬라이드 붙여넣기', 'ok');
        return;
      }
      // ? — 단축키 도움말
      if (!isTyping && (e.key === '?' || (e.shiftKey && e.key === '/'))) {
        e.preventDefault();
        setShowShortcuts(v => !v);
        return;
      }
      if (e.key === 'Escape') {
        if (showShortcuts) { setShowShortcuts(false); return; }
        if (showCmdK) { setShowCmdK(false); return; }
        if (showStats) { setShowStats(false); return; }
        if (showConsistency) { setShowConsistency(false); return; }
        if (showAddMenu) setShowAddMenu(false);
        if (showBrief) setShowBrief(false);
        if (showSettings) setShowSettings(false);
        if (showGddSnapshots) setShowGddSnapshots(false);
        return;
      }
      // Alt + Arrow — 현재 슬라이드를 앞/뒤로 이동(재정렬)
      const isArrow = e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'PageUp' || e.key === 'PageDown';
      if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        if (anyModalOpen()) return;
        if (!inSlideContext()) return;
        if (isTyping) return;
        const slides = project.slides || [];
        if (slides.length < 2) return;
        const delta = (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 1;
        const toIdx = currentIdx + delta;
        if (toIdx < 0 || toIdx >= slides.length) return;
        e.preventDefault();
        commitNow('슬라이드 위치 이동');
        const next = [...slides];
        [next[currentIdx], next[toIdx]] = [next[toIdx], next[currentIdx]];
        setProject(p => ({ ...p, slides: next, updatedAt: new Date().toISOString().slice(0, 10) }));
        setCurrentIdx(toIdx);
        return;
      }
      // 슬라이드 이동(네비게이션): GDD 슬라이드 뷰에서, 편집 중이 아니고, 모달도 닫혀있을 때
      if (!isArrow) return;
      if (anyModalOpen()) return;
      if (!inSlideContext()) return;
      if (isTypingTarget(document.activeElement)) return;
      const slides = project.slides || [];
      if (!slides.length) return;
      const goPrev = e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp';
      const goNext = e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown';
      if (goPrev && currentIdx > 0) {
        e.preventDefault();
        setCurrentIdx(currentIdx - 1);
      } else if (goNext && currentIdx < slides.length - 1) {
        e.preventDefault();
        setCurrentIdx(currentIdx + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showAddMenu, showBrief, showSettings, showCmdK, showShortcuts, showGddSnapshots, showStats, showConsistency, selection.type, view, project, currentIdx]);

  const addComment = (c) => {
    if (selection.type !== 'gdd') return;
    setProject(p => ({ ...p, comments: [...(p.comments || []), c] }));
  };

  const downloadPptx = async () => {
    if (!project) {
      toast('컨셉은 PPTX 다운로드를 지원하지 않습니다. 기획서를 선택하세요.', 'err');
      return;
    }
    setIsDownloading(true);
    try {
      await exportPptx(project);
      toast('PPTX 다운로드 완료', 'ok');
    } catch (e) {
      console.error(e);
      toast('PPTX 생성 실패: ' + (e.message || e), 'err');
    } finally {
      setIsDownloading(false);
    }
  };

  // Reset slide idx when selection changes
  useEffect(() => {
    setCurrentIdx(0);
  }, [selection.id, selection.type]);

  if (!project && !concept) {
    return <div style={{ padding: 40 }}>선택된 항목이 없습니다. 좌측에서 컨셉이나 기획서를 선택하세요.</div>;
  }

  return (
    <div className="app">
      <TopBar
        project={project || concept}
        view={view}
        setView={setView}
        onDownload={downloadPptx}
        isDownloading={isDownloading}
        onRename={(t) => {
          if (selection.type === 'gdd') setProject(p => ({ ...p, title: t }));
          else setConcept(c => ({ ...c, title: t }));
        }}
        tweaks={tweaks}
        isConcept={selection.type === 'concept'}
        onOpenSettings={() => setShowSettings(true)}
        hasApiKey={hasApiKey}
        usageTick={usageTick}
        onOpenCmdK={() => setShowCmdK(true)}
        onSaveSnapshot={saveGddSnapshot}
        onOpenSnapshots={() => setShowGddSnapshots(true)}
        onOpenQualityGate={() => setShowQualityGate(true)}
        onExport={async () => {
          try {
            const json = await window.gddStorage.exportProject();
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const ts = new Date().toISOString().slice(0, 10);
            a.href = url; a.download = `gdd-project-${ts}.gddproject`;
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            toast('프로젝트 내보내기 완료', 'ok');
          } catch (e) {
            toast('내보내기 실패: ' + (e.message || e), 'err');
          }
        }}
        onImport={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.gddproject,.json,application/json';
          input.onchange = async () => {
            const f = input.files?.[0];
            if (!f) return;
            if (!confirm(`"${f.name}"을(를) 불러옵니다. 현재 작업은 비상 백업으로 보존됩니다. 진행하시겠습니까?`)) return;
            try {
              commitNow('프로젝트 가져오기');
              // 안전: 현재 state 비상 백업
              await window.gddStorage.saveEmergency({ projects: state.projects, concepts: state.concepts, selection: state.selection });
              const text = await f.text();
              const newState = await window.gddStorage.importProject(text);
              setState({
                concepts: newState.concepts || [],
                projects: newState.projects || [],
                selection: newState.selection || { type: 'concept', id: newState.concepts?.[0]?.id },
              });
              setCurrentIdx(0);
              toast('프로젝트 불러오기 완료', 'ok');
            } catch (e) {
              toast('불러오기 실패: ' + (e.message || e), 'err');
            }
          };
          input.click();
        }}
      />
      <Sidebar
        concepts={state.concepts}
        projects={state.projects}
        selection={selection}
        onSelect={(type, id) => setState(s => ({ ...s, selection: { type, id } }))}
        onNewBlank={newProject}
        onOpenConceptBrief={openBriefForConcept}
        onOpenGddBrief={openBriefForGdd}
        onDelete={deleteItem}
      />

      <div className="canvas">
        {selection.type === 'concept' ? (
          <div className="canvas-main">
            <ConceptView
              concept={concept}
              patch={(next) => setState(s => ({ ...s, concepts: s.concepts.map(c => c.id === concept.id ? next : c) }))}
              onCreateGdd={openBriefForRecommendedPlan}
              onOpenGdd={(gddId) => setState(s => ({ ...s, selection: { type: 'gdd', id: gddId } }))}
              onBulkCreate={bulkCreatePlansForConcept}
              isGenerating={isGenerating}
              toast={toast}
            />
          </div>
        ) : (
          <>
            <div className="canvas-toolbar">
              <input
                className="title-inline"
                value={project.title}
                onChange={e => setProject(p => ({ ...p, title: e.target.value }))}
              />
              <span style={{ color: 'var(--text-4)' }}>by</span>
              <input
                className="author-inline"
                value={project.author}
                onChange={e => setProject(p => ({ ...p, author: e.target.value }))}
              />
              <span style={{ color: 'var(--text-4)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>· {project.version} · {project.updatedAt}</span>
              <div style={{ flex: 1 }}></div>
              {view === 'slide' && (
                <button className="btn ghost" onClick={() => setShowAddMenu(true)}>+ 슬라이드</button>
              )}
            </div>
            <div className="canvas-main">
              {view === 'slide' && tweaks.showThumbs && (
                <Thumbs
                  slides={project.slides || []}
                  currentIdx={currentIdx}
                  setCurrentIdx={setCurrentIdx}
                  onAddSlide={() => setShowAddMenu(true)}
                  onDeleteSlide={deleteSlide}
                  onMoveSlide={moveSlide}
                />
              )}
              {view === 'slide' && (
                <SlideStage
                  project={project}
                  patchSlide={patchSlide}
                  replaceSlide={(slideId, newSlide) => {
                    commitNow('슬라이드 변환');
                    setProject(p => ({
                      ...p,
                      slides: (p.slides || []).map(s => s.id === slideId ? { ...s, ...newSlide } : s),
                      updatedAt: new Date().toISOString().slice(0, 10),
                    }));
                  }}
                  scale={scale}
                  setScale={setScale}
                  currentIdx={currentIdx}
                  setCurrentIdx={setCurrentIdx}
                  isGenerating={isGenerating}
                />
              )}
              {view === 'doc' && (
                <DocumentView
                  project={project}
                  patchSlide={patchSlide}
                  onPatchProject={(u) => setProject(p => ({ ...p, ...u }))}
                />
              )}
            </div>
          </>
        )}
      </div>

      <RightPanel
        project={project || concept}
        isConcept={selection.type === 'concept'}
        onSendCommand={sendCommand}
        isGenerating={isGenerating}
        generationMode={generationMode}
        setGenerationMode={setGenerationMode}
        onAddComment={addComment}
      />

      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      {showConsistency && concept && (
        <ConsistencyModal
          concept={concept}
          projects={state.projects}
          onClose={() => setShowConsistency(false)}
          onGoto={(g) => { setState(s => ({ ...s, selection: g })); setShowConsistency(false); }}
        />
      )}
      {showStats && (
        <StatsModal
          state={state}
          onClose={() => setShowStats(false)}
        />
      )}
      {showQualityGate && project && (
        <QualityGateModal
          project={project}
          onClose={() => setShowQualityGate(false)}
        />
      )}
      {showGddSnapshots && (
        <GddSnapshotsModal
          project={project}
          onClose={() => setShowGddSnapshots(false)}
          onRestore={(s) => { restoreGddSnapshot(s); setShowGddSnapshots(false); }}
        />
      )}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSaved={() => {
            setHasApiKey(!!(window.gemini?.getApiKey && window.gemini.getApiKey()));
            toast('Gemini 설정 저장됨', 'ok');
          }}
        />
      )}

      {/* Cmd+K 명령 팔레트 */}
      {window.CommandPalette && (
        <window.CommandPalette
          open={showCmdK}
          onClose={() => setShowCmdK(false)}
          state={state}
          onGoto={(goto) => {
            if (goto.type === 'gdd') {
              setState(s => ({ ...s, selection: { type: 'gdd', id: goto.id } }));
              if (typeof goto.slideIdx === 'number') setTimeout(() => setCurrentIdx(goto.slideIdx), 50);
            } else if (goto.type === 'concept') {
              setState(s => ({ ...s, selection: { type: 'concept', id: goto.id } }));
            }
          }}
          actions={[
            { id: 'new-concept', title: '✦ 새 컨셉 만들기', sub: 'AI 컨셉 브리프 열기', shortcut: 'CMD', keywords: ['컨셉', 'concept', '새로'], run: () => setShowBrief(true) || setBriefMode('concept') },
            { id: 'new-gdd', title: '+ 새 기획서 추가', sub: 'AI 기획서 브리프 열기', shortcut: 'CMD', keywords: ['gdd', '기획서', '새로'], run: () => { setBriefMode('gdd'); setBriefPrefill(null); setShowBrief(true); } },
            { id: 'export', title: '↓ 프로젝트 내보내기', sub: '.gddproject 파일로 백업', shortcut: 'CMD', keywords: ['export', '백업', '내보내기', 'backup'], run: async () => {
              try {
                const json = await window.gddStorage.exportProject();
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const ts = new Date().toISOString().slice(0, 10);
                a.href = url; a.download = `gdd-project-${ts}.gddproject`;
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                toast('내보내기 완료', 'ok');
              } catch (e) { toast('내보내기 실패: ' + e.message, 'err'); }
            }},
            { id: 'settings', title: '⚙ 설정', sub: 'Gemini 키 / 모델 / 사용량', shortcut: 'CMD', keywords: ['설정', 'settings', 'api', 'key'], run: () => setShowSettings(true) },
            { id: 'view-slide', title: '슬라이드 뷰로 전환', sub: '', shortcut: 'CMD', keywords: ['slide', '슬라이드'], run: () => setView('slide') },
            { id: 'view-doc', title: '문서 뷰로 전환', sub: '', shortcut: 'CMD', keywords: ['doc', '문서'], run: () => setView('doc') },
            { id: 'download-pptx', title: '↓ PPTX 다운로드', sub: '현재 기획서를 PPTX로', shortcut: 'CMD', keywords: ['pptx', 'powerpoint', '다운로드'], run: downloadPptx },
            { id: 'download-pdf', title: '↓ PDF 다운로드', sub: '슬라이드를 PDF로 출력', shortcut: 'CMD', keywords: ['pdf', '다운로드', '출력', 'print'], run: async () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try { toast('PDF 생성 중… 잠시만 기다려주세요', ''); await window.exportPdf(project); toast('PDF 다운로드 완료', 'ok'); }
              catch (e) { toast('PDF 실패: ' + e.message, 'err'); }
            }},
            { id: 'download-md', title: '↓ Markdown 다운로드', sub: '.md (GitHub/Notion 친화)', shortcut: 'CMD', keywords: ['markdown', 'md', '다운로드'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try { window.exportMarkdown(project); toast('Markdown 다운로드 완료', 'ok'); }
              catch (e) { toast('MD 실패: ' + e.message, 'err'); }
            }},
            { id: 'slide-png', title: '🖼 현재 슬라이드 PNG', sub: '1280×720 @ 2x 캡처', shortcut: 'CMD', keywords: ['png', '슬라이드', '이미지'], run: async () => {
              if (!project) return;
              const cur = (project.slides || [])[currentIdx];
              if (!cur) return;
              try { toast('PNG 생성 중…', ''); await window.exportSlidePng(cur, currentIdx + 1, project.slides.length); toast('PNG 저장됨', 'ok'); }
              catch (e) { toast('PNG 실패: ' + e.message, 'err'); }
            }},
            { id: 'slide-svg', title: '⤓ 현재 슬라이드 SVG', sub: 'flow/diagram 전용', shortcut: 'CMD', keywords: ['svg', '벡터', 'flow', 'diagram'], run: () => {
              if (!project) return;
              const cur = (project.slides || [])[currentIdx];
              if (!cur) return;
              try { window.exportSlideSvg(cur); toast('SVG 저장됨', 'ok'); }
              catch (e) { toast(e.message, 'err'); }
            }},
            { id: 'gc-images', title: '🗑 사용하지 않는 이미지 정리', sub: '스토리지 공간 회수', shortcut: 'CMD', keywords: ['gc', '정리', 'cleanup', '이미지'], run: async () => {
              try {
                const n = await window.gddStorage.gcImages();
                toast(`사용하지 않는 이미지 ${n}개 정리`, 'ok');
              } catch (e) { toast('정리 실패', 'err'); }
            }},
            { id: 'gen-missing-images', title: '🍌 누락된 이미지 모두 생성', sub: '현재 GDD 에서 imageSrc 가 비어있는 슬라이드 모두 일괄 생성', shortcut: 'CMD', keywords: ['이미지', '생성', 'image', 'banana', '누락', 'missing'], run: async () => {
              if (selection.type !== 'gdd' || !project) { toast('기획서를 선택하세요', 'err'); return; }
              const targets = (project.slides || [])
                .map((s, idx) => ({ s, idx }))
                .filter(({ s }) => ['cover', 'section-divider', 'ui-design', 'image-embed'].includes(s.type) && !s.data?.imageSrc);
              if (targets.length === 0) { toast('누락된 이미지가 없습니다', 'ok'); return; }
              if (!confirm(`${targets.length}개 슬라이드의 누락 이미지를 nano-banana 로 생성합니다.\n예상 비용: 약 $${(targets.length * 0.03).toFixed(2)}.\n진행하시겠습니까?`)) return;
              commitNow(`누락 이미지 ${targets.length}개 일괄 생성`);
              setIsGenerating(true);
              let ok = 0, fail = 0;
              try {
                for (const { s, idx } of targets) {
                  let p = s.data?.imagePrompt;
                  if (!p || !p.trim()) {
                    p = synthesizeImagePrompt(s, { title: project.title, subtitle: project.subtitle });
                  }
                  if (!p) { fail++; continue; }
                  try {
                    const src = await window.gemini.generateImage(p);
                    // 각 이미지 생성 직후 setProject 로 즉시 반영 — 진행률 시각화
                    setProject(pr => ({
                      ...pr,
                      slides: (pr.slides || []).map((sl, i) => i === idx ? { ...sl, data: { ...sl.data, imageSrc: src, imagePrompt: p } } : sl),
                      updatedAt: new Date().toISOString().slice(0, 10),
                    }));
                    ok++;
                    toast(`(${ok + fail}/${targets.length}) "${s.data?.title || s.type}" 생성`, '');
                  } catch (e) {
                    fail++;
                  }
                }
                toast(`완료 — 성공 ${ok}장${fail ? ` / 실패 ${fail}장` : ''}`, ok > 0 ? 'ok' : 'err');
              } finally {
                setIsGenerating(false);
              }
            }},
            { id: 'shortcuts', title: '⌨ 단축키 도움말', sub: '?', shortcut: 'CMD', keywords: ['shortcut', '단축키', 'help', '도움말'], run: () => setShowShortcuts(true) },
            { id: 'undo', title: '↶ 실행 취소', sub: `${navigator.platform.match(/Mac/) ? '⌘' : 'Ctrl'}+Z`, shortcut: 'CMD', keywords: ['undo', '취소', 'revert'], run: () => { if (!undo()) toast('취소할 항목 없음', ''); } },
            { id: 'redo', title: '↷ 다시 실행', sub: `${navigator.platform.match(/Mac/) ? '⌘' : 'Ctrl'}+⇧+Z`, shortcut: 'CMD', keywords: ['redo', '다시'], run: () => { if (!redo()) toast('재실행할 항목 없음', ''); } },
            { id: 'save-snapshot', title: '📸 기획서 스냅샷 저장', sub: '현재 기획서를 시점 저장', shortcut: 'CMD', keywords: ['snapshot', '스냅샷', 'save'], run: saveGddSnapshot },
            { id: 'open-snapshots', title: '⌖ 스냅샷 히스토리', sub: '기획서 스냅샷 목록', shortcut: 'CMD', keywords: ['history', 'snapshot'], run: () => setShowGddSnapshots(true) },
            { id: 'consistency', title: '🧐 컨셉 일관성 점검', sub: '용어/필드/누락 자동 분석', shortcut: 'CMD', keywords: ['일관성', 'consistency', 'lint', '검증', '점검'], run: () => {
              if (!concept) { toast('컨셉을 선택하세요', 'err'); return; }
              setShowConsistency(true);
            }},
            { id: 'stats', title: '📊 작업 통계 대시보드', sub: '활동/도메인/AI 사용량', shortcut: 'CMD', keywords: ['stats', '통계', 'dashboard', '대시보드'], run: () => setShowStats(true) },
            { id: 'quality-gate', title: '🎯 품질 점수 확인', sub: '7개 차원 점수표 + 보강 권장', shortcut: 'CMD', keywords: ['quality', '품질', 'score', '점수', '게이트'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              setShowQualityGate(true);
            }},
            { id: 'export-ts', title: '⤓ TypeScript interface 내보내기', sub: 'class-diagram → .ts', shortcut: 'CMD', keywords: ['typescript', 'ts', 'export', 'interface'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const out = window.gddExportAdapters.exportTypeScript(project);
                downloadBlob(out, `${project.title || 'gdd'}.types.ts`, 'text/typescript');
                toast('types.ts 다운로드 완료', 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
            { id: 'export-json-schema', title: '⤓ JSON Schema 내보내기', sub: 'data-table → JSON Schema 2020-12', shortcut: 'CMD', keywords: ['json schema', 'schema', 'export'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const out = window.gddExportAdapters.exportJsonSchema(project);
                downloadBlob(out, `${project.title || 'gdd'}.schemas.json`, 'application/json');
                toast('schemas.json 다운로드 완료', 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
            { id: 'export-zod', title: '⤓ Zod 스키마 내보내기', sub: 'data-table → Zod', shortcut: 'CMD', keywords: ['zod', 'export'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const out = window.gddExportAdapters.exportZod(project);
                downloadBlob(out, `${project.title || 'gdd'}.zod.ts`, 'text/typescript');
                toast('zod.ts 다운로드 완료', 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
            { id: 'export-xstate', title: '⤓ XState 머신 내보내기', sub: 'state-machine → XState v5 JSON', shortcut: 'CMD', keywords: ['xstate', 'state', 'machine'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const out = window.gddExportAdapters.exportXState(project);
                downloadBlob(out, `${project.title || 'gdd'}.machines.json`, 'application/json');
                toast('machines.json 다운로드 완료', 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
            { id: 'export-openapi', title: '⤓ OpenAPI YAML 내보내기', sub: 'api-contract → OpenAPI 3.1', shortcut: 'CMD', keywords: ['openapi', 'swagger', 'yaml'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const out = window.gddExportAdapters.exportOpenApi(project);
                downloadBlob(out, `${project.title || 'gdd'}.openapi.yaml`, 'text/yaml');
                toast('openapi.yaml 다운로드 완료', 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
            { id: 'export-gherkin', title: '⤓ Gherkin feature 내보내기', sub: 'acceptance-criteria → .feature', shortcut: 'CMD', keywords: ['gherkin', 'cucumber', 'feature', 'bdd'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const out = window.gddExportAdapters.exportGherkin(project);
                downloadBlob(out, `${project.title || 'gdd'}.feature`, 'text/plain');
                toast('feature 파일 다운로드 완료', 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
            { id: 'export-balance-csv', title: '⤓ 밸런싱 CSV 내보내기', sub: 'balance-table → .csv (Google Sheets)', shortcut: 'CMD', keywords: ['csv', 'balance', '밸런싱', 'export'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const out = window.gddExportAdapters.exportBalanceCsv(project);
                downloadBlob(out, `${project.title || 'gdd'}.balance.csv`, 'text/csv');
                toast('balance.csv 다운로드 완료', 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
            { id: 'export-all', title: '⤓ 모든 개발 산출물 한꺼번에', sub: 'TS + JSON Schema + Zod + XState + OpenAPI + Gherkin + CSV', shortcut: 'CMD', keywords: ['all', 'export', '모두', '일괄'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const all = window.gddExportAdapters.exportAll(project);
                let n = 0;
                for (const filename of Object.keys(all)) {
                  setTimeout(() => downloadBlob(all[filename], `${project.title || 'gdd'}.${filename}`, 'text/plain'), n++ * 200);
                }
                toast(`${Object.keys(all).length}개 파일 순차 다운로드`, 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
          ]}
        />
      )}
      {showAddMenu && <AddSlideMenu onAdd={addSlide} onClose={() => setShowAddMenu(false)} />}
      {showBrief && briefMode === 'concept' && <ConceptBrief
        onClose={() => setShowBrief(false)}
        onSubmit={handleConceptBriefSubmit}
        isGenerating={isGenerating}
        initialMode={generationMode}
      />}
      {showBrief && briefMode !== 'concept' && <BriefComposer
        onClose={() => setShowBrief(false)}
        onSubmit={handleBriefSubmit}
        isGenerating={isGenerating}
        initialMode={generationMode}
        mode={briefMode}
        prefill={briefPrefill}
      />}

      <TweaksPanel>
        <TweakSection title="테마">
          <TweakRadio
            label="액센트"
            value={tweaks.theme}
            options={[
              { value: 'cyan', label: 'Cyan' },
              { value: 'green', label: 'Green' },
              { value: 'magenta', label: 'Magenta' },
            ]}
            onChange={(v) => setTweak('theme', v)}
          />
        </TweakSection>
        <TweakSection title="레이아웃">
          <TweakToggle label="썸네일 사이드" value={tweaks.showThumbs} onChange={(v) => setTweak('showThumbs', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

/* === 이미지 프롬프트 폴백 합성 ===
 * AI 가 imagePrompt 를 빼먹은 슬라이드를 위해 title/caption/subtitle/team 으로부터
 * 영문 이미지 생성 프롬프트를 합성. 한국어 키워드는 그대로 두되 nano-banana 가
 * 의미를 파악할 수 있게 영문 컨텍스트 키워드 + 스타일 + 16:9 키워드를 덧붙임.
 */
function synthesizeImagePrompt(slide, parsedRoot) {
  if (!slide) return '';
  const d = slide.data || {};
  const root = parsedRoot || {};
  const topic = [d.title, d.caption, d.subtitle, root.title, root.subtitle]
    .filter(s => typeof s === 'string' && s.trim())
    .slice(0, 3)
    .join(', ');
  if (!topic) return '';
  const styleByType = {
    'cover': 'cinematic key art cover, dramatic lighting, ultra-detailed, bold composition, 16:9 aspect ratio',
    'section-divider': 'atmospheric chapter concept art, moody lighting, dark background with negative space for text, cinematic 16:9',
    'ui-design': 'clean game UI mockup, dark sci-fi theme, hud elements, high-fidelity wireframe, 16:9 aspect ratio',
    'image-embed': 'high-detail concept art reference, painterly digital art, cinematic lighting, 16:9 aspect ratio',
  };
  const style = styleByType[slide.type] || styleByType['image-embed'];
  return `Game design reference: ${topic}. Style: ${style}, professional game art, vivid colors, high contrast.`;
}

/* === AI generation via window.gemini.complete === */
async function aiGenerateGdd(command, existingTitles, attachments, context) {
  const prompt = window.buildAiPrompt(command, existingTitles, attachments, context);
  let raw;
  try {
    // Try multimodal if images present
    const imageAttachments = (attachments || []).filter(a => a.kind === 'image');
    if (imageAttachments.length > 0) {
      try {
        const parts = [
          { text: prompt },
          ...imageAttachments.slice(0, 6)
            .map(a => window.gemini.imagePartFromDataUrl(a.src))
            .filter(Boolean),
        ];
        raw = await window.gemini.complete({ contents: [{ role: 'user', parts }] });
      } catch (multimodalErr) {
        raw = await window.gemini.complete(prompt);
      }
    } else {
      raw = await window.gemini.complete(prompt);
    }
  } catch (e) {
    throw new Error('Gemini 호출 실패. 데모 모드로 전환하거나 다시 시도해주세요.');
  }
  // 공용 복구 파서 사용 — 잘림/trailing comma/escape 문제까지 자동 복구
  let parsed;
  try {
    parsed = window.parseAiJson(raw);
  } catch (e) {
    throw new Error(e.message || 'AI 응답을 JSON으로 변환하지 못했습니다.');
  }

  const rawSlides = (parsed.slides || []).map(s => ({ id: window.uid(), type: s.type, data: s.data || {} }));
  // Schema 검증 + 자동 보정
  const allFixes = [];
  const slides = rawSlides.map(s => {
    if (window.validateSlide) {
      const r = window.validateSlide(s);
      allFixes.push(...r.fixes);
      return r.slide;
    }
    return s;
  });
  if (allFixes.length && window.gddToast) {
    try { window.gddToast(`AI 응답 ${allFixes.length}개 항목 자동 보정`, 'ok'); } catch {}
  } else if (allFixes.length) {
    console.warn('AI 응답 자동 보정:', allFixes);
  }

  // nano-banana: 참고 이미지 자동 생성
  // - cover 슬라이드: 표지 배경
  // - ui-design 슬라이드: UI 목업 이미지
  // - section-divider 슬라이드: 섹션 컨셉 아트
  // - image-embed 슬라이드: 참고 이미지
  // imagePrompt 가 비어있으면 slide.title/caption/subtitle 로부터 폴백 프롬프트 합성
  // 실패해도 GDD 생성은 정상 완료(이미지만 비어있음)
  const imageJobs = [];
  const coverIdx = slides.findIndex(s => s.type === 'cover');
  if (coverIdx >= 0) {
    const coverPrompt = parsed.coverImagePrompt || synthesizeImagePrompt(slides[coverIdx], parsed);
    if (coverPrompt) {
      imageJobs.push((async () => {
        try {
          const src = await window.gemini.generateImage(coverPrompt);
          slides[coverIdx].data = { ...slides[coverIdx].data, imageSrc: src, imagePrompt: coverPrompt };
        } catch (e) { /* swallow */ }
      })());
    }
  }
  slides.forEach((s, idx) => {
    if (s.type === 'cover') return; // 위에서 처리됨
    if (!['ui-design', 'section-divider', 'image-embed'].includes(s.type)) return;
    // imagePrompt 가 비어있으면 폴백 합성 — 이미지 누락 방지
    let p = s.data?.imagePrompt;
    if (!p || !p.trim()) {
      p = synthesizeImagePrompt(s, parsed);
      if (!p) return;
      // 합성된 프롬프트도 slide.data 에 저장해서 UI 에서 보이도록
      slides[idx].data = { ...slides[idx].data, imagePrompt: p };
    }
    imageJobs.push((async () => {
      try {
        const src = await window.gemini.generateImage(p);
        slides[idx].data = { ...slides[idx].data, imageSrc: src };
      } catch (e) { /* swallow */ }
    })());
  });
  if (imageJobs.length) {
    await Promise.allSettled(imageJobs);
  }

  return {
    id: 'gdd-' + window.uid(),
    title: parsed.title || '제목 없음',
    subtitle: parsed.subtitle || '',
    team: parsed.team || 'TEAM',
    author: parsed.author || '작성자',
    version: 'Ver00',
    updatedAt: new Date().toISOString().slice(0, 10),
    command,
    badge: parsed.badge || 'AI',
    slides: slides.length ? slides : window.generateDemoGdd(command).slides,
    history: [],
    comments: [],
  };
}

/* === AI 기획서 수정 (operations 기반) ===
 * 현재 GDD + 사용자 명령을 받아 add/replace/patch/delete/move/meta 작업을 적용.
 * 반환값: { project: 갱신된 project, summary }
 */
async function aiEditGdd(currentProject, command, attachments) {
  const prompt = window.buildAiEditPrompt(currentProject, command, attachments);
  let raw;
  try {
    const imageAttachments = (attachments || []).filter(a => a.kind === 'image');
    if (imageAttachments.length > 0) {
      try {
        const parts = [
          { text: prompt },
          ...imageAttachments.slice(0, 6)
            .map(a => window.gemini.imagePartFromDataUrl(a.src))
            .filter(Boolean),
        ];
        raw = await window.gemini.complete({ contents: [{ role: 'user', parts }] });
      } catch (multimodalErr) {
        raw = await window.gemini.complete(prompt);
      }
    } else {
      raw = await window.gemini.complete(prompt);
    }
  } catch (e) {
    throw new Error('Gemini 호출 실패. 다시 시도해주세요.');
  }

  let parsed;
  try {
    parsed = window.parseAiJson(raw);
  } catch (e) {
    throw new Error(e.message || 'AI 응답을 JSON으로 변환하지 못했습니다.');
  }
  const ops = Array.isArray(parsed.operations) ? parsed.operations : [];
  if (!ops.length) throw new Error('AI가 적용 가능한 변경을 반환하지 않았습니다. 명령을 더 구체적으로 적어주세요.');

  // 1) 슬라이드 배열에 operations 적용
  let slides = [...(currentProject.slides || [])];
  const newOrChanged = []; // 이미지 생성 대상
  const findIdx = (key) => {
    if (key == null) return -1;
    const idx = slides.findIndex(s => s.id === key);
    if (idx >= 0) return idx;
    const n = parseInt(key, 10);
    if (!isNaN(n) && n >= 1 && n <= slides.length) return n - 1;
    return -1;
  };
  // AI 가 patch/replace 로 imageSrc 같은 위험 필드를 임의 값으로 주입하지 못하도록 정제.
  // imageSrc 는 data:image/* base64 만 허용 (LLM 이 javascript: 같은 스킴을 넣어도 차단).
  const ALLOWED_IMG_RE = /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,/i;
  const sanitizeSlideData = (data) => {
    if (!data || typeof data !== 'object') return data;
    const out = { ...data };
    if (typeof out.imageSrc === 'string' && !ALLOWED_IMG_RE.test(out.imageSrc)) {
      delete out.imageSrc; // 위험 스킴 / 비정형 URL 제거
    }
    return out;
  };
  const metaUpdate = {};
  const fixes = [];
  let opFailures = 0;
  for (const op of ops) {
    try {
      if (op.op === 'add' && op.slide) {
        const sanitizedData = sanitizeSlideData(op.slide.data || {});
        const rawSlide = { id: window.uid(), type: op.slide.type || 'rules', data: sanitizedData };
        const validated = window.validateSlide ? window.validateSlide(rawSlide) : { slide: rawSlide, fixes: [] };
        fixes.push(...(validated.fixes || []));
        const newSlide = validated.slide;
        let pos;
        if (op.after === 'start') pos = 0;
        else if (op.after === 'end' || op.after == null) pos = slides.length;
        else {
          const idx = findIdx(op.after);
          pos = idx >= 0 ? idx + 1 : slides.length;
        }
        slides = [...slides.slice(0, pos), newSlide, ...slides.slice(pos)];
        newOrChanged.push(newSlide);
      } else if (op.op === 'replace' && op.slide) {
        const idx = findIdx(op.id);
        if (idx < 0) continue;
        const oldId = slides[idx].id;
        const sanitizedData = sanitizeSlideData(op.slide.data || {});
        const rawSlide = { id: oldId, type: op.slide.type || slides[idx].type, data: sanitizedData };
        const validated = window.validateSlide ? window.validateSlide(rawSlide) : { slide: rawSlide, fixes: [] };
        fixes.push(...(validated.fixes || []));
        slides = slides.map((s, i) => i === idx ? validated.slide : s);
        newOrChanged.push(validated.slide);
      } else if (op.op === 'patch' && op.fields) {
        const idx = findIdx(op.id);
        if (idx < 0) continue;
        const sanitizedFields = sanitizeSlideData(op.fields);
        const merged = { ...slides[idx], data: { ...slides[idx].data, ...sanitizedFields } };
        slides = slides.map((s, i) => i === idx ? merged : s);
        if (sanitizedFields.imagePrompt) newOrChanged.push(merged);
      } else if (op.op === 'delete') {
        const idx = findIdx(op.id);
        if (idx < 0) continue;
        slides = slides.filter((_, i) => i !== idx);
      } else if (op.op === 'move') {
        const idx = findIdx(op.id);
        const to = (parseInt(op.to, 10) || 1) - 1;
        if (idx < 0 || to < 0 || to >= slides.length || idx === to) continue;
        const moved = slides[idx];
        const without = slides.filter((_, i) => i !== idx);
        slides = [...without.slice(0, to), moved, ...without.slice(to)];
      } else if (op.op === 'meta' && op.fields) {
        for (const k of ['title', 'subtitle', 'team', 'badge']) {
          if (typeof op.fields[k] === 'string' && op.fields[k].trim()) metaUpdate[k] = op.fields[k];
        }
      }
    } catch (e) {
      // 개별 op 적용 실패는 전체 수정을 중단시키지 않고 카운트만 누적
      opFailures++;
    }
  }
  if (fixes.length && window.gddToast) {
    try { window.gddToast(`AI 응답 ${fixes.length}개 항목 자동 보정`, 'ok'); } catch {}
  }
  if (opFailures > 0 && window.gddToast) {
    try { window.gddToast(`${opFailures}개 변경 작업 실패 (스킵됨)`, 'err'); } catch {}
  }

  // 2) 새/변경 슬라이드 중 이미지 대상에 대해 nano-banana 로 이미지 생성.
  //    imagePrompt 가 비어있으면 synthesizeImagePrompt 로 폴백 합성 — 이미지 누락 방지.
  //    id 기반으로 트래킹 → 이후 ops 가 같은 슬라이드를 다시 교체해도 race 가 안 생긴다.
  const imageTargets = newOrChanged
    .filter(s => ['cover', 'ui-design', 'section-divider', 'image-embed'].includes(s.type))
    .map(s => {
      let p = s.data?.imagePrompt;
      if (!p || !p.trim()) p = synthesizeImagePrompt(s, currentProject || {});
      return p ? { id: s.id, prompt: p, synthesized: !s.data?.imagePrompt } : null;
    })
    .filter(Boolean);
  if (imageTargets.length > 0) {
    const results = await Promise.allSettled(imageTargets.map(t => window.gemini.generateImage(t.prompt)));
    const idToUpdate = {};
    results.forEach((r, i) => {
      if (r.status === 'fulfilled' && typeof r.value === 'string') {
        idToUpdate[imageTargets[i].id] = { src: r.value, syntheticPrompt: imageTargets[i].synthesized ? imageTargets[i].prompt : null };
      }
    });
    if (Object.keys(idToUpdate).length > 0) {
      slides = slides.map(s => {
        const u = idToUpdate[s.id];
        if (!u) return s;
        const patchData = { ...s.data, imageSrc: u.src };
        if (u.syntheticPrompt) patchData.imagePrompt = u.syntheticPrompt;
        return { ...s, data: patchData };
      });
    }
  }

  // 3) 갱신된 project 반환
  const summary = (parsed.summary && String(parsed.summary).slice(0, 200)) || `${ops.length}개 변경 적용`;
  const updatedProject = {
    ...currentProject,
    ...metaUpdate,
    slides,
    updatedAt: new Date().toISOString().slice(0, 10),
    history: [
      ...(currentProject.history || []),
      {
        ts: new Date().toISOString().slice(0, 16).replace('T', ' '),
        cmd: command + ((attachments || []).length ? ` [+${(attachments || []).length}개 첨부]` : ''),
        summary,
      },
    ],
  };
  return { project: updatedProject, summary, opsCount: ops.length };
}

/* Mount */
let _appStateRef = null;
window.__getAppStateForRecovery = () => _appStateRef;
function captureStateForRecovery(s) { _appStateRef = s; }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary getCurrentState={() => _appStateRef}>
    <ToastHost>
      <App onStateChange={captureStateForRecovery} />
    </ToastHost>
  </ErrorBoundary>
);
