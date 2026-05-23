/* === Concept (1-Page GDD) — top-level project concept document ===
   Owns recommended detailed GDDs, gives a high-level project summary. */

/* ===== Sample concept ===== */
const CONCEPT_SUPERBUMPERS = {
  id: 'concept-superbumpers',
  title: '슈퍼범퍼즈',
  subtitle: '속력은 곧 힘이다 — 캐주얼 차량 충돌 배틀',
  badge: 'TEAM',
  author: '작성자',
  updatedAt: '2026-02-15',
  visual: {
    src: null,
    prompt: 'Cute neon arcade bumper cars, top-down view, vibrant cyan and yellow palette, glowing rim lights, sparks on collision, stylized 3D, energetic motion blur, 4k.',
    promptKo: '귀여운 네온 아케이드 범퍼카, 탑다운 시점. 활기찬 시안·옐로우 팔레트. 차체 주변 림 라이트가 빛나고 충돌 순간 불꽃이 튐. 스타일라이즈드 3D, 다이내믹한 모션 블러, 4K 해상도.',
    placeholder: '비주얼 프롬프트 기반 컨셉 아트 placeholder',
  },
  palette: [
    { name: '주색상', hex: '#4CC2FF' },
    { name: '보조 1', hex: '#CCFFDA' },
    { name: '보조 2', hex: '#8DF0F0' },
    { name: '강조', hex: '#F5D94F' },
    { name: '배경', hex: '#1A2C22' },
  ],
  theme: { bg: '#0a1411', main: '#88DFB0', accent: '#F5D94F' },
  coreLoop: [
    { label: '매칭' },
    { label: '충돌 전투' },
    { label: '차량 성장' },
  ],
  overview: {
    genre: '캐주얼 PvP · 차량 액션',
    platform: 'PC · 모바일',
    target: '라이트 캐주얼 게이머',
    engine: 'Unity',
  },
  keyUsp: [
    '직관적 충돌 기반 전투 — "속력은 곧 힘이다"',
    '5종 차량 특성 × 4단계 등급의 명확한 차별화',
    '차고지/모터샵 통합 — 수집·성장·튜닝 루프',
  ],
  recommendedPlans: [
    { id: 'rp1', title: '인게임 데스매치 기획', description: '4vs4 팀 데스매치 사이클, 매치 종료 규칙, 사망 처리 FLOW', linkedGddId: 'gdd-ingame' },
    { id: 'rp2', title: '차량 시스템 기획', description: '차량 분류(특성/등급), 정보 구조, 보유/대표 상태 규칙', linkedGddId: 'gdd-vehicle' },
    { id: 'rp3', title: '전투 기획', description: '충돌 메커니즘, 데미지 공식, 공격 활성화 상태 정의', linkedGddId: 'gdd-combat' },
    { id: 'rp4', title: '차량 튜닝 기획', description: '파츠 강화/장착, 차량 레벨업, 모터샵 시스템', linkedGddId: null },
    { id: 'rp5', title: '로비/매칭 기획', description: '로비 UI 흐름, 매칭 큐, 파티 시스템', linkedGddId: null },
    { id: 'rp6', title: '튜토리얼 기획', description: '신규 유저 온보딩 흐름, 학습 단계 정의', linkedGddId: null },
    { id: 'rp7', title: '아이템/기믹 기획', description: '인게임 픽업 아이템, 맵 기믹 (가속판, 공중 점프 등)', linkedGddId: null },
    { id: 'rp8', title: '패스권/BM 기획', description: '시즌 패스 구조, 보상 트랙, 결제 BM 설계', linkedGddId: null },
    { id: 'rp9', title: '사운드 기획', description: 'BGM/SFX 리스트, 충돌·환경 사운드 규칙', linkedGddId: null },
    { id: 'rp10', title: '슈퍼럼블 모드 기획', description: '럼블 페이즈 규칙, 가속 버프, 종료 조건', linkedGddId: null },
    { id: 'rp11', title: '스코어배틀 모드 기획', description: '점수 누적 룰, 시간 제한, 라운드 구조', linkedGddId: null },
    { id: 'rp12', title: '이모티콘 기획', description: '인게임/로비 이모티콘 종류, 사용 규칙', linkedGddId: null },
  ],
  locked: { title: false, overview: false, visual: false, usp: false, coreLoop: false },
  snapshots: [],
};

const CONCEPT_BLANK = () => ({
  id: 'concept-' + uid(),
  title: '새 게임 컨셉',
  subtitle: '한 줄로 표현되는 게임의 핵심',
  badge: 'TEAM_?',
  author: '작성자',
  updatedAt: new Date().toISOString().slice(0, 10),
  visual: { src: null, prompt: '', promptKo: '', placeholder: '컨셉 아트 placeholder' },
  palette: [
    { name: '주색상', hex: '#4CC2FF' },
    { name: '보조 1', hex: '#CCFFDA' },
    { name: '보조 2', hex: '#8DF0F0' },
    { name: '강조', hex: '#F5D94F' },
    { name: '배경', hex: '#1A2C22' },
  ],
  theme: { bg: '#0a1411', main: '#88DFB0', accent: '#F5D94F' },
  coreLoop: [
    { label: '루프 1' },
    { label: '루프 2' },
    { label: '루프 3' },
  ],
  overview: { genre: '?', platform: '?', target: '?', engine: '?' },
  keyUsp: ['핵심 USP 1', '핵심 USP 2', '핵심 USP 3'],
  recommendedPlans: [],
  locked: { title: false, overview: false, visual: false, usp: false, coreLoop: false },
  snapshots: [],
});

/* ===== ConceptView ===== */
function ConceptView({ concept, patch, onCreateGdd, onOpenGdd, onBulkCreate, isGenerating, toast }) {
  const fileInputRef = React.useRef(null);
  const pageRef = React.useRef(null);
  const [busySection, setBusySection] = React.useState(null);
  const [exporting, setExporting] = React.useState(false);
  const [showSnapshotMenu, setShowSnapshotMenu] = React.useState(false);

  if (!concept) {
    return (
      <div className="concept-blank">
        <h2>아직 컨셉이 없습니다.</h2>
        <p>"+ AI로 컨셉 만들기" 버튼을 눌러 새 게임 컨셉을 작성하세요. AI가 1-Page GDD와 함께 필요한 세부 기획서 목록을 추천합니다.</p>
      </div>
    );
  }

  const patchField = (field, value) => patch({ ...concept, [field]: value, updatedAt: new Date().toISOString().slice(0, 10) });
  const patchPath = (path, value) => {
    const next = JSON.parse(JSON.stringify(concept));
    let cur = next; const keys = path.split('.');
    for (let i = 0; i < keys.length - 1; i++) {
      if (cur[keys[i]] == null) cur[keys[i]] = {};
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
    next.updatedAt = new Date().toISOString().slice(0, 10);
    patch(next);
  };

  const toggleLock = (key) => {
    const locked = { ...(concept.locked || {}), [key]: !(concept.locked?.[key]) };
    patchField('locked', locked);
  };
  const isLocked = (key) => !!(concept.locked?.[key]);

  /* Apply theme css vars locally to the concept page */
  const theme = concept.theme || { bg: '#0a1411', main: '#88DFB0', accent: '#F5D94F' };
  const themeStyle = {
    '--c-bg': theme.bg,
    '--c-main': theme.main,
    '--c-accent': theme.accent,
    background: `linear-gradient(180deg, ${theme.bg}EE 0%, ${theme.bg} 100%)`,
    borderColor: `${theme.main}30`,
  };

  /* Partial AI regen */
  const regen = async (section) => {
    if (isLocked(section)) {
      toast?.('이 섹션은 잠겨있습니다. 잠금 해제 후 재생성하세요.', 'err');
      return;
    }
    setBusySection(section);
    try {
      const result = await aiPartialRegen(concept, section);
      if (result) {
        // visual 섹션이면 새 프롬프트로 nano-banana 이미지도 자동 재생성
        let merged = { ...concept, ...result };
        if (section === 'visual' && result.visual?.prompt) {
          try {
            // 이미지 생성은 영문 prompt만 사용 (한국어 promptKo는 사용자 참고용)
            const src = await window.gemini.generateImage(result.visual.prompt);
            merged = {
              ...merged,
              visual: {
                ...(merged.visual || {}),
                src,
                prompt: result.visual.prompt,
                promptKo: result.visual.promptKo || merged.visual?.promptKo || '',
              },
            };
          } catch (imgErr) {
            // 이미지 실패해도 프롬프트(영문/한국어)는 반영
            merged = {
              ...merged,
              visual: {
                ...(merged.visual || {}),
                prompt: result.visual.prompt,
                promptKo: result.visual.promptKo || merged.visual?.promptKo || '',
              },
            };
            toast?.('프롬프트는 갱신되었지만 이미지 생성에 실패했습니다: ' + (imgErr.message || imgErr), 'err');
          }
        }
        patch({ ...merged, updatedAt: new Date().toISOString().slice(0, 10) });
        toast?.(`${SECTION_LABEL[section] || section} 재생성 완료`, 'ok');
      }
    } catch (e) {
      console.error(e);
      toast?.('재생성 실패: ' + (e.message || e), 'err');
    } finally {
      setBusySection(null);
    }
  };

  /* Generate image from current visual.prompt (manual button) */
  const regenImageOnly = async () => {
    const p = (concept.visual?.prompt || '').trim();
    if (!p) {
      toast?.('비주얼 프롬프트가 비어있습니다. 먼저 프롬프트를 입력하세요.', 'err');
      return;
    }
    setBusySection('visual-image');
    try {
      const src = await window.gemini.generateImage(p);
      patch({
        ...concept,
        visual: { ...(concept.visual || {}), src, prompt: p },
        updatedAt: new Date().toISOString().slice(0, 10),
      });
      toast?.('🍌 이미지 생성 완료', 'ok');
    } catch (e) {
      console.error(e);
      toast?.('이미지 생성 실패: ' + (e.message || e), 'err');
    } finally {
      setBusySection(null);
    }
  };

  /* Snapshot save */
  const saveSnapshot = () => {
    const name = prompt('스냅샷 이름:', `${concept.title} - ${new Date().toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`);
    if (!name) return;
    const snapshot = {
      id: 's' + uid(),
      name,
      ts: new Date().toISOString(),
      data: JSON.parse(JSON.stringify({
        ...concept, snapshots: undefined,
      })),
    };
    const next = { ...concept, snapshots: [...(concept.snapshots || []), snapshot] };
    patch(next);
    toast?.('스냅샷 저장됨', 'ok');
  };
  const restoreSnapshot = (snap) => {
    if (!confirm(`"${snap.name}" 스냅샷으로 복원하시겠습니까? 현재 상태는 자동 저장됩니다.`)) return;
    const backup = {
      id: 's' + uid(),
      name: '자동 백업 ' + new Date().toLocaleString('ko-KR'),
      ts: new Date().toISOString(),
      data: JSON.parse(JSON.stringify({ ...concept, snapshots: undefined })),
    };
    patch({ ...snap.data, id: concept.id, snapshots: [...(concept.snapshots || []), backup] });
    setShowSnapshotMenu(false);
    toast?.('스냅샷 복원 완료', 'ok');
  };

  /* PNG export */
  const exportPng = async () => {
    if (!window.html2canvas) {
      toast?.('html2canvas 로드 실패', 'err');
      return;
    }
    setExporting(true);
    try {
      const canvas = await window.html2canvas(pageRef.current, {
        backgroundColor: '#0a0d12',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `${concept.title || 'concept'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast?.('PNG 다운로드 완료', 'ok');
    } catch (e) {
      console.error(e);
      toast?.('PNG 생성 실패: ' + e.message, 'err');
    } finally {
      setExporting(false);
    }
  };

  const onVisualPick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const src = await fileToDataUrl(f);
    patchField('visual', { ...concept.visual, src });
  };

  const patchUsp = (i, value) => {
    const usp = [...(concept.keyUsp || [])]; usp[i] = value;
    patchField('keyUsp', usp);
  };
  const addUsp = () => patchField('keyUsp', [...(concept.keyUsp || []), '새 USP']);
  const removeUsp = (i) => patchField('keyUsp', (concept.keyUsp || []).filter((_, j) => j !== i));

  const patchLoop = (i, value) => {
    const loop = [...(concept.coreLoop || [])]; loop[i] = { ...loop[i], label: value };
    patchField('coreLoop', loop);
  };
  const addLoop = () => patchField('coreLoop', [...(concept.coreLoop || []), { label: '새 단계' }]);
  const removeLoop = (i) => patchField('coreLoop', (concept.coreLoop || []).filter((_, j) => j !== i));

  return (
    <div className="concept-canvas">
      {/* Top toolbar */}
      <div className="concept-toolbar">
        <div className="ct-left">
          <span className="ct-label">테마</span>
          <ColorDot color={theme.bg} onChange={(v) => patchPath('theme.bg', v)} title="배경" />
          <ColorDot color={theme.main} onChange={(v) => patchPath('theme.main', v)} title="메인" />
          <ColorDot color={theme.accent} onChange={(v) => patchPath('theme.accent', v)} title="강조" />
        </div>
        <div className="ct-right">
          <button className="btn ghost" onClick={saveSnapshot}>⏺ 상태 저장</button>
          <button className="btn ghost" onClick={() => setShowSnapshotMenu(v => !v)} disabled={!(concept.snapshots || []).length}>
            ⌖ 히스토리 ({(concept.snapshots || []).length})
          </button>
          <button className="btn primary" onClick={exportPng} disabled={exporting}>
            {exporting ? '생성 중…' : '↓ PNG 다운로드'}
          </button>
          {showSnapshotMenu && (
            <div className="snapshot-menu">
              {(concept.snapshots || []).length === 0 && (
                <div style={{ padding: 16, color: 'var(--text-3)', fontSize: 12 }}>스냅샷 없음</div>
              )}
              {(concept.snapshots || []).slice().reverse().map(s => (
                <div key={s.id} className="snapshot-item" onClick={() => restoreSnapshot(s)}>
                  <div className="snap-name">{s.name}</div>
                  <div className="snap-ts">{new Date(s.ts).toLocaleString('ko-KR')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Concept page */}
      <div className="concept-page" ref={pageRef} style={themeStyle}>
        {/* Header (always visible) */}
        <div className="concept-head">
          <div className="concept-title-wrap">
            <Editable
              tag="h1" className="concept-title"
              value={concept.title}
              onChange={(v) => patchField('title', v)}
              style={{ color: theme.main, textShadow: `0 0 30px ${theme.main}40` }}
            />
            <Editable
              tag="div" className="concept-subtitle"
              value={concept.subtitle}
              onChange={(v) => patchField('subtitle', v)}
              multiline
            />
          </div>
          <div className="concept-meta-r">
            <Editable
              tag="div" className="concept-badge"
              value={concept.badge}
              onChange={(v) => patchField('badge', v)}
              style={{ borderColor: theme.main, color: theme.main }}
            />
            <div className="concept-author">
              <span>◯</span>
              <span>Created by</span>
              <Editable tag="span" value={concept.author} onChange={(v) => patchField('author', v)} />
            </div>
          </div>
        </div>

        {/* Section 1: Title & Logline */}
        <SectionCard
          num="01" title="타이틀 & 로그라인"
          locked={isLocked('title')} onToggleLock={() => toggleLock('title')}
          onAi={() => regen('title')} busy={busySection === 'title'}
          theme={theme}
        >
          <div className="sc-inline-row">
            <div className="sc-inline-field">
              <label>제목</label>
              <Editable tag="div" className="sc-input" value={concept.title} onChange={(v) => patchField('title', v)} />
            </div>
          </div>
          <div className="sc-inline-row">
            <div className="sc-inline-field">
              <label>로그라인 (한 줄 부제)</label>
              <Editable tag="div" className="sc-input" value={concept.subtitle} onChange={(v) => patchField('subtitle', v)} multiline />
            </div>
          </div>
        </SectionCard>

        {/* Section 2: Game Overview */}
        <SectionCard
          num="02" title="게임 오버뷰"
          locked={isLocked('overview')} onToggleLock={() => toggleLock('overview')}
          onAi={() => regen('overview')} busy={busySection === 'overview'}
          theme={theme}
        >
          <div className="sc-grid-2">
            <div className="sc-inline-field">
              <label>장르</label>
              <Editable tag="div" className="sc-input" value={concept.overview?.genre} onChange={(v) => patchPath('overview.genre', v)} />
            </div>
            <div className="sc-inline-field">
              <label>타겟</label>
              <Editable tag="div" className="sc-input" value={concept.overview?.target} onChange={(v) => patchPath('overview.target', v)} />
            </div>
            <div className="sc-inline-field">
              <label>플랫폼</label>
              <Editable tag="div" className="sc-input" value={concept.overview?.platform} onChange={(v) => patchPath('overview.platform', v)} />
            </div>
            <div className="sc-inline-field">
              <label>엔진</label>
              <Editable tag="div" className="sc-input" value={concept.overview?.engine} onChange={(v) => patchPath('overview.engine', v)} />
            </div>
          </div>
        </SectionCard>

        {/* Section 3: Visual Prompt + Image + Palette */}
        <SectionCard
          num="03" title="비주얼 프롬프트"
          locked={isLocked('visual')} onToggleLock={() => toggleLock('visual')}
          onAi={() => regen('visual')} busy={busySection === 'visual'}
          theme={theme}
          aiLabel="프롬프트 생성"
        >
          <div className="sc-visual-wrap">
            <div className="sc-visual-image">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={onVisualPick}
              />
              {busySection === 'visual-image' ? (
                <div className="empty">
                  <div className="icon" style={{ animation: 'pulse 1.4s infinite' }}>🍌</div>
                  <div>나노바나나로 이미지 생성 중…</div>
                </div>
              ) : concept.visual?.src ? (
                <img src={concept.visual.src} alt="concept" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }} />
              ) : (
                <div className="empty" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }}>
                  <div className="icon">⊡</div>
                  <div>이미지 첨부 (클릭 또는 드래그)</div>
                  <div style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 6 }}>또는 아래 🍌 버튼으로 AI 생성</div>
                </div>
              )}
              <button
                className="visual-genimg-btn"
                onClick={(e) => { e.stopPropagation(); regenImageOnly(); }}
                disabled={busySection === 'visual-image' || isLocked('visual')}
                title="비주얼 프롬프트로 이미지 생성 (gemini-2.5-flash-image)"
              >
                {busySection === 'visual-image' ? '생성 중…' : '🍌 이미지 생성'}
              </button>
            </div>
            <div className="sc-visual-side">
              <div className="sc-inline-field" style={{ flex: 1 }}>
                <label>
                  비주얼 프롬프트 (영문 — 이미지 생성용)
                  <span style={{ marginLeft: 6, color: 'var(--text-4)', fontSize: 10, textTransform: 'none', letterSpacing: 0 }}>
                    🍌 nano-banana 입력
                  </span>
                </label>
                <Editable
                  tag="div" className="sc-input sc-textarea"
                  value={concept.visual?.prompt}
                  onChange={(v) => patchPath('visual.prompt', v)}
                  multiline
                  placeholder="A cozy magical forest, cute fairy creatures, soft warm sunlight, studio ghibli style…"
                />
              </div>
              <div className="sc-inline-field">
                <label>
                  한국어 프롬프트
                  <span style={{ marginLeft: 6, color: 'var(--text-4)', fontSize: 10, textTransform: 'none', letterSpacing: 0 }}>
                    참고용 · 이미지 생성에는 사용되지 않음
                  </span>
                </label>
                <Editable
                  tag="div" className="sc-input sc-textarea sc-textarea-ko"
                  value={concept.visual?.promptKo}
                  onChange={(v) => patchPath('visual.promptKo', v)}
                  multiline
                  placeholder="아늑한 마법의 숲, 귀여운 요정 생명체들, 부드럽고 따뜻한 햇살, 스튜디오 지브리 스타일…"
                />
              </div>
              <div className="concept-palette">
                {(concept.palette || []).map((p, i) => (
                  <div className="swatch" key={i}>
                    <input
                      type="color"
                      className="chip"
                      value={p.hex}
                      onChange={(e) => {
                        const palette = [...concept.palette];
                        palette[i] = { ...palette[i], hex: e.target.value };
                        patchField('palette', palette);
                      }}
                    />
                    <Editable tag="div" className="name" value={p.name} onChange={(v) => {
                      const palette = [...concept.palette];
                      palette[i] = { ...palette[i], name: v };
                      patchField('palette', palette);
                    }} />
                    <div className="hex">{p.hex.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Section 4: USP */}
        <SectionCard
          num="04" title="주요 특징 (USP)"
          locked={isLocked('usp')} onToggleLock={() => toggleLock('usp')}
          onAi={() => regen('usp')} busy={busySection === 'usp'}
          theme={theme}
        >
          <div className="concept-usp-list">
            {(concept.keyUsp || []).map((u, i) => (
              <div className="sc-usp-row" key={i}>
                <Editable tag="div" className="concept-usp-item" value={u} onChange={(v) => patchUsp(i, v)} multiline
                  style={{ borderLeftColor: theme.accent }} />
                <button className="sc-del" onClick={() => removeUsp(i)} title="삭제">✕</button>
              </div>
            ))}
            <button className="sc-add" onClick={addUsp}>+ USP 추가</button>
          </div>
        </SectionCard>

        {/* Section 5: Core Loop */}
        <SectionCard
          num="05" title="순환 구조 (Core Loop)"
          locked={isLocked('coreLoop')} onToggleLock={() => toggleLock('coreLoop')}
          onAi={() => regen('coreLoop')} busy={busySection === 'coreLoop'}
          theme={theme}
          aiLabel="USP 기반 생성"
        >
          <div className="concept-coreloop">
            {(concept.coreLoop || []).map((n, i, arr) => (
              <React.Fragment key={i}>
                <div className="coreloop-node" style={{
                  borderColor: i === arr.length - 1 ? theme.accent : theme.main,
                  boxShadow: `0 0 20px ${i === arr.length - 1 ? theme.accent : theme.main}26 inset`,
                }}>
                  <Editable value={n.label} onChange={(v) => patchLoop(i, v)} multiline />
                  {arr.length > 2 && (
                    <button className="sc-del coreloop-del" onClick={() => removeLoop(i)} title="삭제">✕</button>
                  )}
                </div>
                {i < arr.length - 1 && <div className="coreloop-connector" style={{
                  background: `repeating-linear-gradient(90deg, ${theme.main}66 0 6px, transparent 6px 10px)`,
                }}></div>}
              </React.Fragment>
            ))}
            <button className="coreloop-add" onClick={addLoop} title="단계 추가">+</button>
          </div>
        </SectionCard>

        {/* Recommended detailed plans */}
        <div className="concept-recs">
          <div className="concept-recs-head">
            <h3>필요 기획서</h3>
            <div className="meta">
              {(concept.recommendedPlans || []).filter(p => p.linkedGddId).length}
              {' / '}
              {(concept.recommendedPlans || []).length} 작성됨
            </div>
            {(() => {
              const pending = (concept.recommendedPlans || []).filter(p => !p.linkedGddId).length;
              return (
                <button
                  className="bulk-create-btn"
                  onClick={() => onBulkCreate?.()}
                  disabled={isGenerating || pending === 0}
                  title={pending === 0 ? '미작성 기획서가 없습니다' : `미작성 ${pending}개를 AI로 일괄 생성`}
                >
                  {isGenerating ? '생성 중…' : `✦ 미작성 전체 생성 ${pending > 0 ? `(${pending})` : ''}`}
                </button>
              );
            })()}
          </div>
          <div className="concept-rec-grid">
            {(concept.recommendedPlans || []).map(p => (
              <div
                key={p.id}
                className={'concept-rec-card ' + (p.linkedGddId ? 'created' : '')}
                onClick={() => p.linkedGddId ? onOpenGdd(p.linkedGddId) : onCreateGdd(p)}
              >
                <button
                  className="rec-del"
                  title={p.linkedGddId ? '항목 삭제 (연결된 기획서는 사이드바에서 삭제)' : '항목 삭제'}
                  onClick={(e) => {
                    e.stopPropagation();
                    const msg = p.linkedGddId
                      ? `"${p.title}" 항목을 컨셉에서 제거할까요?\n(연결된 기획서 자체는 사이드바에 그대로 남습니다)`
                      : `"${p.title}" 항목을 삭제할까요?`;
                    if (!confirm(msg)) return;
                    patchField('recommendedPlans', (concept.recommendedPlans || []).filter(x => x.id !== p.id));
                    toast?.('항목이 삭제되었습니다', 'ok');
                  }}
                >✕</button>
                <div className="rec-head">
                  <span>#{p.id}</span>
                  <span className="rec-status">{p.linkedGddId ? '✓ 작성됨' : '대기'}</span>
                </div>
                <div className="rec-title">{p.title}</div>
                <div className="rec-desc">{p.description}</div>
                <div className="rec-action">
                  <span></span>
                  <span className="arr">→</span>
                </div>
              </div>
            ))}
            <div
              className="concept-rec-card"
              style={{ borderStyle: 'dashed', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', minHeight: 110, color: 'var(--text-3)' }}
              onClick={() => {
                const newPlan = { id: 'rp' + uid().slice(0,4), title: '새 기획서', description: '설명을 입력하세요', linkedGddId: null };
                patchField('recommendedPlans', [...(concept.recommendedPlans || []), newPlan]);
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>+</div>
              <div style={{ fontSize: 12 }}>기획서 추가</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* SectionCard wrapper component */
const SECTION_LABEL = {
  title: '타이틀 & 로그라인',
  overview: '게임 오버뷰',
  visual: '비주얼 프롬프트',
  usp: '주요 특징',
  coreLoop: '순환 구조',
};

function SectionCard({ num, title, locked, onToggleLock, onAi, busy, theme, aiLabel, children }) {
  return (
    <div className={'section-card ' + (locked ? 'locked' : '')}>
      <div className="sc-head">
        <div className="sc-head-l">
          <span className="sc-num" style={{ color: theme.main }}>{num}</span>
          <span className="sc-title">{title}</span>
        </div>
        <div className="sc-head-r">
          {onAi && (
            <button
              className="sc-btn ai"
              onClick={onAi}
              disabled={busy || locked}
              style={{ background: locked ? 'rgba(255,255,255,0.05)' : theme.main, color: locked ? 'var(--text-4)' : '#061018', borderColor: 'transparent' }}
            >
              {busy ? '생성 중…' : ('✦ ' + (aiLabel || 'AI 재생성'))}
            </button>
          )}
          <button className={'sc-btn lock ' + (locked ? 'on' : '')} onClick={onToggleLock} title={locked ? '잠금 해제' : '잠금'}>
            {locked ? '🔒 고정' : '🔓 고정'}
          </button>
        </div>
      </div>
      <div className="sc-body">{children}</div>
    </div>
  );
}

function ColorDot({ color, onChange, title }) {
  return (
    <label className="color-dot" title={title} style={{ background: color }}>
      <input type="color" value={color} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

/* ===== Concept AI prompt ===== */
function buildConceptPrompt(command, attachments) {
  const textBlocks = (attachments || []).filter(a => a.kind === 'text').map((a, i) => `\n[첨부 텍스트 ${i+1}: ${a.name}]\n${a.value.slice(0, 1500)}`).join('\n');
  const imageNote = (attachments || []).filter(a => a.kind === 'image').length > 0
    ? `\n참고: ${(attachments || []).filter(a => a.kind === 'image').length}개의 참고 이미지가 함께 제공됩니다.`
    : '';

  return `${window.SENIOR_PERSONA || ''}

# 임무
30년차 풀스택 게임 메이커로서, 아래 요청을 1-Page GDD(게임 컨셉 한 장 요약)로 압축한다. 투자자·팀 리더·신규 합류자가 5분 안에 게임을 이해하고 의사결정할 수 있어야 한다.

요청: "${command}"
${textBlocks}
${imageNote}

# 출력 형식 (JSON만, 코드블록 없이)
{
  "title": "게임 제목 (영문/한글 무관, 외우기 쉬운 3~10자)",
  "subtitle": "한 줄 로그라인 (장르 + 핵심 동사 + 차별점, 30자 내외)",
  "badge": "TEAM_? 형식의 짧은 팀/스튜디오 태그",
  "author": "작성자",
  "palette": [
    { "name": "주색상", "hex": "#RRGGBB" },
    { "name": "보조 1", "hex": "#RRGGBB" },
    { "name": "보조 2", "hex": "#RRGGBB" },
    { "name": "강조", "hex": "#RRGGBB" },
    { "name": "배경", "hex": "#RRGGBB" }
  ],
  "coreLoop": [
    { "label": "동사 위주의 단계명 (예: 매칭하기 / 충돌하기 / 성장하기)" }
  ],
  "overview": {
    "genre": "장르 (장르명 + 서브장르까지. 예: 캐주얼 PvP / 차량 액션)",
    "platform": "플랫폼 + 1차 출시 타겟 (예: 모바일 우선, PC 동시)",
    "target": "타겟 유저층 (연령/관심/플레이 시간/유사 게임 경험까지)",
    "engine": "엔진/스택 (예: Unity 2022 LTS, Photon Fusion, Firebase)"
  },
  "keyUsp": [
    "핵심 USP — 무엇이 + 어떻게 + 결과적으로 어떤 체감/지표를 만드는지"
  ],
  "visual": {
    "prompt": "<영문 이미지 생성 프롬프트, 60단어 이내. 컨셉 아트용. 스타일(예: stylized 3D, 2D illustration), 카메라 앵글, 조명, 분위기, 핵심 시각 요소를 포함>",
    "promptKo": "<위 영문 프롬프트의 한국어 번역. 의역 가능. 50~120자 정도. 사용자가 읽고 수정하기 쉽도록 자연스러운 한국어로>"
  },
  "recommendedPlans": [
    { "title": "기획서 제목 (예: 인게임 데스매치 규칙 기획)", "description": "이 기획서가 다룰 핵심 내용 + 의존 시스템 1줄" }
  ]
}

# 시니어 표준 작성 기준
- **subtitle**: "어떤 게임"보다 "왜 다른가"가 드러나도록. "X하는 Y 게임" 패턴 권장.
- **coreLoop**: 3~5단계. 단순 명사 나열 금지, 동사형으로. 첫 단계는 진입, 마지막은 보상/성장으로 회귀하는 구조.
- **overview**: 4개 필드 모두 "?" 금지. 합리적 디폴트로 채운다.
- **keyUsp**: 3~5개. 경쟁작 대비 차별점을 명확히. 단순 기능 나열 금지, "X가 가능하다 → 그래서 Y한 체감을 준다" 구조.
- **palette**: 5색 모두 게임 무드와 정합. 5색이 함께 놓였을 때 충돌 없이 어울리도록 (보색 무분별 사용 X).
- **recommendedPlans**: **10~16개**. 장르에 맞게 가감하되, 시니어라면 다음을 의식적으로 포함한다 — 코어 시스템(전투/이동/성장), 메타 시스템(로비/매칭/소셜), 진행(튜토리얼/온보딩), 콘텐츠(모드/이벤트/시즌), 경제·BM(재화/상점/패스권/광고), 라이브 운영(공지/CS/리포트), 기술·인프라(서버 구조/네트워크/데이터), 아트/UX/사운드. **description은 30~80자**, 무엇을 다루는지 + 의존성 1개 명시.
- **visual.prompt**: 반드시 영문. 추상어 금지, 명사·형용사·동사 모두 구체적으로.

# 출력 규칙
- JSON만. 다른 설명·코드블록·주석 금지.
- 모든 한국어 값은 간결한 -다체 또는 -입니다체로 통일.
- "TBD/추후/협의" 금지.`;
}

async function aiGenerateConcept(command, attachments) {
  const prompt = buildConceptPrompt(command, attachments);
  let raw;
  try {
    const images = (attachments || []).filter(a => a.kind === 'image');
    if (images.length > 0) {
      try {
        const parts = [
          { text: prompt },
          ...images.slice(0, 6)
            .map(a => window.gemini.imagePartFromDataUrl(a.src))
            .filter(Boolean),
        ];
        raw = await window.gemini.complete({ contents: [{ role: 'user', parts }] });
      } catch {
        raw = await window.gemini.complete(prompt);
      }
    } else {
      raw = await window.gemini.complete(prompt);
    }
  } catch (e) {
    throw new Error('Gemini 호출 실패');
  }

  let parsed;
  try { parsed = window.parseAiJson(raw); } catch (e) { throw new Error(e.message || 'JSON 복구 실패'); }

  const visualPrompt = parsed.visual?.prompt || '';
  const visualPromptKo = parsed.visual?.promptKo || '';
  let imageSrc = null;
  if (visualPrompt) {
    try {
      imageSrc = await window.gemini.generateImage(visualPrompt);
    } catch (imgErr) {
      // 이미지 생성 실패는 컨셉 생성 자체를 막지 않음 — 사용자가 수동으로 재시도 가능
      imageSrc = null;
    }
  }

  const conceptResult = {
    id: 'concept-' + uid(),
    title: parsed.title || '새 컨셉',
    subtitle: parsed.subtitle || '',
    badge: parsed.badge || 'TEAM',
    author: parsed.author || '작성자',
    updatedAt: new Date().toISOString().slice(0, 10),
    visual: { src: imageSrc, prompt: visualPrompt, promptKo: visualPromptKo, placeholder: '컨셉 아트 placeholder' },
    palette: parsed.palette || CONCEPT_BLANK().palette,
    coreLoop: parsed.coreLoop || [],
    overview: parsed.overview || {},
    keyUsp: parsed.keyUsp || [],
    recommendedPlans: (parsed.recommendedPlans || []).map(p => ({
      id: 'rp' + uid().slice(0, 4),
      title: p.title || '기획서',
      description: p.description || '',
      linkedGddId: null,
    })),
  };
  // Schema 검증 + 자동 보정
  if (window.validateConcept) {
    const r = window.validateConcept(conceptResult);
    if (r.fixes.length && window.gddToast) {
      try { window.gddToast(`컨셉 응답 ${r.fixes.length}개 항목 자동 보정`, 'ok'); } catch {}
    }
    return r.concept;
  }
  return conceptResult;
}

Object.assign(window, {
  CONCEPT_SUPERBUMPERS, CONCEPT_BLANK,
  ConceptView, ConceptBrief,
  buildConceptPrompt, aiGenerateConcept,
  aiPartialRegen,
});

/* ===== ConceptBrief modal (1PGDD-style initial form) ===== */
function ConceptBrief({ onClose, onSubmit, isGenerating, initialMode = 'ai' }) {
  const [idea, setIdea] = React.useState('');
  const [team, setTeam] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [bgStart, setBgStart] = React.useState('#0a1411');
  const [bgMid, setBgMid] = React.useState('#142822');
  const [bgEnd, setBgEnd] = React.useState('#050a08');
  const [colorMain, setColorMain] = React.useState('#88DFB0');
  const [colorSub, setColorSub] = React.useState('#CCFFDA');
  const [colorAccent, setColorAccent] = React.useState('#F5D94F');
  const [attachments, setAttachments] = React.useState([]);
  const [submissionMode, setSubmissionMode] = React.useState(initialMode);
  const [dragging, setDragging] = React.useState(false);
  const dragCounterRef = React.useRef(0);

  /* Attachments */
  const addImage = async (file) => {
    const src = await fileToDataUrl(file);
    setAttachments(a => [...a, { id: uid(), kind: 'image', src, name: file.name || 'image.png' }]);
  };
  const addTextBlock = (value, name) => {
    setAttachments(a => [...a, { id: uid(), kind: 'text', value, name: name || `텍스트 ${a.filter(x=>x.kind==='text').length + 1}` }]);
  };
  const onPaste = async (e) => {
    const { images } = readClipboard(e);
    if (images.length) {
      e.preventDefault();
      for (const im of images) await addImage(im.file);
      return;
    }
    const text = e.clipboardData?.getData('text/plain') || '';
    if (text.length > 400 && idea.trim().length > 30) {
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
      else if (f.type.startsWith('text/')) addTextBlock(await f.text(), f.name);
    }
  };
  const onDragEnter = (e) => { e.preventDefault(); dragCounterRef.current++; setDragging(true); };
  const onDragLeave = () => { dragCounterRef.current--; if (dragCounterRef.current <= 0) setDragging(false); };
  const onDragOver = (e) => e.preventDefault();
  const removeAttachment = (id) => setAttachments(a => a.filter(x => x.id !== id));

  const submit = () => {
    onSubmit({
      idea: idea.trim(),
      team: team.trim(),
      author: author.trim(),
      bgGradient: [bgStart, bgMid, bgEnd],
      palette: [
        { name: '메인 컬러', hex: colorMain },
        { name: '보조 컬러', hex: colorSub },
        { name: '강조 컬러', hex: colorAccent },
      ],
      theme: { bg: bgStart, main: colorMain, accent: colorAccent },
      attachments,
      mode: submissionMode,
    });
  };

  const imgCount = attachments.filter(a => a.kind === 'image').length;
  const txtCount = attachments.filter(a => a.kind === 'text').length;

  /* Preview style for the live theme preview chip */
  const previewStyle = {
    background: `linear-gradient(180deg, ${bgStart} 0%, ${bgMid} 50%, ${bgEnd} 100%)`,
    borderColor: colorMain,
  };

  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="brief-composer concept-brief" onClick={e => e.stopPropagation()}>
        <header>
          <div className="head-l">
            <h2><span className="accent-dot"></span>✦ AI 컨셉 만들기</h2>
            <div className="sub">한 페이지짜리 게임 컨셉(1-Page GDD)과 필요한 세부 기획서 목록을 함께 생성합니다.</div>
          </div>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>

        <div className="brief-body">
          {/* 1. 기획 아이디어 프롬프트 */}
          <CbSection icon="💡" title="기획 아이디어 프롬프트">
            <div
              className={'brief-prompt-wrap ' + (dragging ? 'dragging' : '')}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
              style={{ marginTop: 0 }}
            >
              <textarea
                value={idea}
                onChange={e => setIdea(e.target.value)}
                onPaste={onPaste}
                placeholder="원하는 장르, 분위기, 소재를 적어주세요. 비워두면 완전히 랜덤하게 창작합니다. (예: 고양이들이 우주선을 타고 탐험하는 픽셀아트 게임)"
                rows={4}
                autoFocus
              />
              <div className="brief-prompt-meta">
                <span className="pill">⌘V <span className="kbd">붙여넣기</span></span>
                <span className="pill">⇧ Drop <span className="kbd">파일</span></span>
                <span style={{ marginLeft: 'auto', color: 'var(--text-4)' }}>{idea.length} chars</span>
              </div>
            </div>
            {attachments.length > 0 && (
              <div className="brief-attach-grid" style={{ marginTop: 12 }}>
                {attachments.map(a => (
                  a.kind === 'image' ? (
                    <div className="attach-tile" key={a.id}>
                      <img src={a.src} alt={a.name} />
                      <span className="label">{a.name.slice(0, 24)}</span>
                      <button className="del" onClick={() => removeAttachment(a.id)}>✕</button>
                    </div>
                  ) : (
                    <div className="attach-tile text-tile" key={a.id}>
                      <div className="t-head"><span>📋 {a.name}</span><span>{a.value.length}자</span></div>
                      <div className="t-body">{a.value.slice(0, 200)}</div>
                      <button className="del" onClick={() => removeAttachment(a.id)}>✕</button>
                    </div>
                  )
                ))}
              </div>
            )}
          </CbSection>

          {/* 2. 테마 디자인 조절 */}
          <CbSection icon="🎨" title="테마 디자인 조절" trailing={
            <div className="cb-theme-preview" style={previewStyle}>
              <div style={{
                width: '100%', textAlign: 'center', color: colorMain, fontSize: 9, fontWeight: 700, lineHeight: 1.2,
              }}>preview</div>
              <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: colorMain }}></span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: colorSub }}></span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: colorAccent }}></span>
              </div>
            </div>
          }>
            <div className="cb-color-grid">
              <CbColorField label="배경 시작" value={bgStart} onChange={setBgStart} />
              <CbColorField label="배경 중간" value={bgMid} onChange={setBgMid} />
              <CbColorField label="배경 끝" value={bgEnd} onChange={setBgEnd} />
              <CbColorField label="메인 컬러" value={colorMain} onChange={setColorMain} />
              <CbColorField label="보조 컬러" value={colorSub} onChange={setColorSub} />
              <CbColorField label="강조 컬러" value={colorAccent} onChange={setColorAccent} />
            </div>
          </CbSection>

          {/* 0. 기획자 정보 */}
          <CbSection num="0" title="기획자 정보">
            <div className="cb-author-row">
              <input
                className="cb-input"
                placeholder="팀 / 스튜디오 (예: TEAM)"
                value={team}
                onChange={e => setTeam(e.target.value)}
              />
              <input
                className="cb-input"
                placeholder="기획자 이름"
                value={author}
                onChange={e => setAuthor(e.target.value)}
              />
            </div>
          </CbSection>
        </div>

        <footer>
          <div className="mode-tabs">
            <button className={submissionMode === 'ai' ? 'active' : ''} onClick={() => setSubmissionMode('ai')}>AI 생성</button>
            <button className={submissionMode === 'demo' ? 'active' : ''} onClick={() => setSubmissionMode('demo')}>빠른 데모</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn ghost" onClick={onClose}>취소</button>
            <button className="btn primary" onClick={submit} disabled={isGenerating}>
              {isGenerating ? '생성 중…' : '✦ 컨셉 생성 ↵'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function CbSection({ icon, num, title, trailing, children }) {
  return (
    <div className="cb-section">
      <div className="cb-section-head">
        <div className="cb-section-title">
          {num !== undefined && <span className="cb-section-num">{num}</span>}
          {icon && <span className="cb-section-icon">{icon}</span>}
          <span>{title}</span>
        </div>
        {trailing}
      </div>
      <div className="cb-section-body">{children}</div>
    </div>
  );
}

function CbColorField({ label, value, onChange }) {
  return (
    <div className="cb-color-field">
      <label>{label}</label>
      <div className="cb-color-input-wrap">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} />
        <span className="cb-color-hex">{value.toUpperCase()}</span>
      </div>
    </div>
  );
}

/* ===== Partial regen (per-section) ===== */
async function aiPartialRegen(concept, section) {
  const persona = window.SENIOR_PERSONA || '';
  const context = `# 현재 컨셉 컨텍스트
- 제목: "${concept.title}"
- 부제: "${concept.subtitle}"
- 장르: "${concept.overview?.genre || ''}"
- 타겟: "${concept.overview?.target || ''}"
- 플랫폼: "${concept.overview?.platform || ''}"
- USP: ${(concept.keyUsp || []).join(' / ') || '(없음)'}`;

  const head = `${persona}\n\n# 임무\n30년차 시니어 게임 메이커로서 아래 섹션을 컨셉의 흐름과 정합되도록 재작성하라. 추상어·미정 표현 금지. JSON만 출력 (코드블록 금지).\n\n${context}\n`;

  const prompts = {
    title: `${head}
# 재작성 대상: 타이틀 + 로그라인
- title: 3~10자, 외우기 쉽고 게임 무드와 일치
- subtitle: 30자 내외. "X하는 Y 게임" 같은 차별점 명시 패턴 권장
출력:
{"title":"...","subtitle":"..."}`,
    overview: `${head}
# 재작성 대상: 게임 오버뷰 (4필드 모두 합리적 디폴트로 채울 것)
- genre: 메인 장르 + 서브 장르
- target: 연령대/플레이 시간대/유사 게임 경험까지 구체적으로
- platform: 1차 출시 + 후속 확장 표기 (예: "모바일 우선, PC 동시")
- engine: 엔진/네트워크/백엔드 스택까지 (예: "Unity 2022 LTS, Photon Fusion, Firebase")
출력:
{"overview":{"genre":"...","target":"...","platform":"...","engine":"..."}}`,
    visual: `${head}
# 재작성 대상: 비주얼 프롬프트 + 5색 팔레트
- prompt: 영문 60단어 이내. 스타일(예: stylized 3D / 2D illust), 카메라 앵글, 조명, 핵심 시각 요소, 분위기 포함
- promptKo: 위 영문 프롬프트의 자연스러운 한국어 번역(의역 가능). 50~120자
- palette: 5색 모두 게임 무드와 정합. 함께 놓였을 때 충돌 없이 어울리는 조합
출력:
{"visual":{"prompt":"<영문 프롬프트>","promptKo":"<한국어 프롬프트>"},"palette":[{"name":"주색상","hex":"#RRGGBB"},{"name":"보조 1","hex":"#..."},{"name":"보조 2","hex":"#..."},{"name":"강조","hex":"#..."},{"name":"배경","hex":"#..."}]}`,
    usp: `${head}
# 재작성 대상: 핵심 USP 3~5개
- 단순 기능 나열 금지. "X가 가능하다 → 그래서 Y한 체감/지표를 만든다" 구조
- 경쟁작 대비 차별점이 분명하게
출력:
{"keyUsp":["USP 1","USP 2","USP 3"]}`,
    coreLoop: `${head}
# 재작성 대상: Core Loop 3~5단계
- 동사형 라벨 ("매칭하기", "충돌하기" 등)
- 첫 단계는 진입, 마지막은 보상/성장으로 회귀하는 구조
- USP가 자연스럽게 발동되는 흐름이어야 함
출력:
{"coreLoop":[{"label":"단계1"},{"label":"단계2"},{"label":"단계3"}]}`,
  };

  const prompt = prompts[section];
  if (!prompt) return null;

  let raw;
  try {
    raw = await window.gemini.complete(prompt);
  } catch (e) {
    throw new Error('Gemini 호출 실패');
  }
  try { return window.parseAiJson(raw); } catch (e) { throw new Error(e.message || 'JSON 복구 실패'); }
}
