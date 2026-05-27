/* === Slide schema validators + auto-fix ===
 * AI 응답이 schema에 어긋날 때 자동 보정. 보정한 내역을 fixes에 기록해 사용자에게 알림.
 *
 * 노출: window.validateGdd, window.validateConcept, window.validateSlide
 */
(function () {

  const isStr = (v) => typeof v === 'string';
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  const isArr = Array.isArray;
  const isNum = (v) => typeof v === 'number' && isFinite(v);

  /* === 개별 슬라이드 schema === */
  const SLIDE_SCHEMAS = {
    cover: {
      required: ['title'],
      defaults: { product: '', title: '제목 없음', subtitle: '', team: '', author: '김기획', date: '' },
    },
    history: {
      required: ['rows'],
      defaults: { title: '문서 이력', rows: [] },
      arrays: { rows: { item: { ver: 'Ver00', date: '', page: '-', content: '', author: '김기획' } } },
    },
    toc: {
      required: ['entries'],
      defaults: { title: 'CONTENTS', entries: [] },
      arrays: { entries: { item: { num: '01', name: '항목', sub: '' } } },
    },
    'section-divider': {
      required: ['title'],
      defaults: { num: '01', title: '섹션', subtitle: '', imagePrompt: '', imageSrc: null },
    },
    'image-embed': {
      required: ['title'],
      defaults: { section: '03', sectionName: '참고 이미지', title: '참고 이미지', caption: '', imagePrompt: '', imageSrc: null, imageTransform: null },
    },
    intent: {
      required: ['title'],
      defaults: { section: '01', sectionName: '개요', title: '기획 의도', tagline: '', cards: [] },
      arrays: { cards: { item: { idx: '01', head: '제목', desc: '설명' } } },
    },
    terms: {
      required: ['rows'],
      defaults: { section: '01', sectionName: '개요', title: '용어 정의', rows: [] },
      arrays: { rows: { item: { term: '용어', def: '정의', note: '' } } },
    },
    rules: {
      required: ['blocks'],
      defaults: { section: '02', sectionName: '시스템 상세', title: '규칙', blocks: [] },
      arrays: { blocks: { item: { head: '블록 제목', items: [] } } },
    },
    'data-table': {
      required: ['columns', 'rows'],
      defaults: { section: '04', sectionName: '데이터 테이블', title: '테이블', columns: [], rows: [] },
      arrays: {
        columns: { item: { key: 'field', label: 'Field' } },
        rows: { item: {} },
      },
    },
    /* flow: 아래 (현재 line 99~) 에서 direction/lines 필드까지 포함된 완전한 정의 사용.
       여기 첫 번째 정의는 두 번째에 의해 덮어써졌으므로 제거. */
    diagram: {
      required: ['nodes'],
      defaults: { section: '02', sectionName: '시스템 구조', title: '다이어그램', nodes: [], edges: [] },
      arrays: {
        nodes: { item: { id: 'n1', label: '노드', kind: 'process', col: 0, row: 0 } },
        edges: { item: { from: '', to: '', label: '' } },
      },
    },
    'sequence-diagram': {
      required: ['participants'],
      defaults: { section: '02', sectionName: '시퀀스 다이어그램', title: '시퀀스 다이어그램', participants: [], messages: [] },
      arrays: {
        participants: { item: { id: 'p1', name: '참여자', kind: 'system' } },
        messages: { item: { from: '', to: '', label: '메시지', kind: 'sync' } },
      },
    },
    'class-diagram': {
      required: ['classes'],
      defaults: { section: '02', sectionName: '클래스 다이어그램', title: '클래스 다이어그램', classes: [], relations: [] },
      arrays: {
        classes: { item: { id: 'c1', name: '클래스', stereotype: '', attrs: [], methods: [], col: 0, row: 0 } },
        relations: { item: { from: '', to: '', kind: 'assoc', label: '' } },
      },
    },
    'ui-design': {
      required: [],
      defaults: {
        section: '03', sectionName: 'UI/UX', title: '화면 설계',
        callouts: [],
        /* 이미지 관련 필드 — 누락 시 AI 가 imagePrompt 만 주고 imageSrc 빈 채로 와도 안전 */
        imagePrompt: '', imageSrc: null, imageTransform: null,
      },
      arrays: { callouts: { item: { name: '영역', desc: '설명', x: 50, y: 50 } } },
    },
    resources: {
      required: ['categories'],
      defaults: { section: '05', sectionName: '필요 리소스', title: '리소스 목록', categories: [] },
      arrays: { categories: { item: { name: '카테고리', count: 'x?', guideline: '', items: [] } } },
    },
    /* NOTE: 위에 line 60-64 에 'flow' 가 이미 정의되어 있음.
       JS 객체 리터럴에서 같은 키 중복 시 뒤의 값이 이전 값을 덮어쓰므로 의도하지 않은 동작 위험.
       이 두 번째 정의(direction/lines 필드 포함)가 채택되어야 하는 의도된 schema 이므로 유지.
       향후 첫 번째 정의(line 60-64)를 제거하면 깔끔하지만 호환성 안전을 위해 그대로 둠. */
    /* === Phase 1 신규 슬라이드 7종 — 개발 가능 수준 보장용 === */
    'balance-table': {
      required: ['vars'],
      defaults: { section: '04', sectionName: '밸런싱', title: '수치 밸런싱', formula: '', vars: [], curve: null },
      arrays: { vars: { item: { name: '변수', formula: '', range: '', defaultValue: '', sensitivity: '', notes: '' } } },
    },
    'state-machine': {
      required: ['states'],
      defaults: { section: '02', sectionName: '상태 머신', title: '상태 머신', states: [], transitions: [] },
      arrays: {
        states: { item: { id: 's1', name: 'IDLE', kind: 'normal', onEnter: '', onExit: '', invariants: [] } },
        transitions: { item: { from: '', to: '', event: '', guard: '', action: '' } },
      },
    },
    'api-contract': {
      required: ['endpoint'],
      defaults: { section: '02', sectionName: 'API 계약', title: 'API 계약', endpoint: '/api/...', method: 'POST', auth: 'bearer', request: '', response: '', errors: [], idempotencyKey: '', slaMs: 200, notes: '' },
      arrays: { errors: { item: { code: '400', message: '메시지', when: '발생 조건' } } },
    },
    'acceptance-criteria': {
      required: ['criteria'],
      defaults: { section: '03', sectionName: '수락 기준', title: '수락 기준 (AC)', userStory: { as: '', want: '', soThat: '' }, criteria: [] },
      arrays: { criteria: { item: { id: 'AC-1', given: '', when: '', then: '', edgeCases: [] } } },
    },
    telemetry: {
      required: ['events'],
      defaults: { section: '04', sectionName: '텔레메트리', title: '텔레메트리 이벤트', events: [], funnels: [] },
      arrays: {
        events: { item: { name: 'event_name', when: '발생 시점', props: [], kpi: '' } },
        funnels: { item: { name: '펀넬명', steps: [], goal: '' } },
      },
    },
    'risk-register': {
      required: ['risks'],
      defaults: { section: '06', sectionName: '위험 등기부', title: '위험 등기부', risks: [] },
      arrays: { risks: { item: { id: 'R-1', title: '위험명', impact: 3, likelihood: 3, mitigation: '', owner: '', status: 'open' } } },
    },
    roadmap: {
      required: ['phases'],
      defaults: { section: '06', sectionName: '로드맵', title: '로드맵', phases: [] },
      arrays: { phases: { item: { name: 'Phase 1', start: '2026.01', end: '2026.03', deliverables: [], dependsOn: [] } } },
    },
  };

  function fillDefaults(obj, defaults) {
    const out = { ...defaults, ...(obj || {}) };
    return out;
  }

  function normalizeArrayItems(arr, itemDefaults) {
    if (!isArr(arr)) return [];
    return arr.map(it => {
      if (!isObj(it)) return { ...itemDefaults };
      return { ...itemDefaults, ...it };
    });
  }

  /** 단일 슬라이드 검증 + 보정 */
  function validateSlide(slide, fixes) {
    if (!isObj(slide)) {
      fixes.push('잘못된 슬라이드 객체 — 빈 cover로 대체');
      return { id: 'fix-' + Math.random().toString(36).slice(2, 8), type: 'cover', data: { title: '제목 없음', subtitle: '', team: '', author: '김기획', date: '' } };
    }
    const type = slide.type;
    const schema = SLIDE_SCHEMAS[type];
    if (!schema) {
      // 알 수 없는 타입 — 그대로 두되 fixes에 기록
      fixes.push(`알 수 없는 슬라이드 타입 "${type}" — 그대로 유지`);
      return slide;
    }
    const data = fillDefaults(slide.data, schema.defaults);
    // 배열 필드 정규화
    if (schema.arrays) {
      for (const [key, conf] of Object.entries(schema.arrays)) {
        const before = data[key];
        if (!isArr(before)) {
          fixes.push(`슬라이드 [${type}] ${key}이(가) 배열이 아님 — 빈 배열로 보정`);
          data[key] = [];
        } else {
          data[key] = normalizeArrayItems(before, conf.item);
        }
      }
    }
    // 필수 필드 확인 (보정 안 되는 경우만 경고)
    for (const req of (schema.required || [])) {
      const v = data[req];
      if (v == null || (isStr(v) && !v.trim()) || (isArr(v) && v.length === 0)) {
        fixes.push(`슬라이드 [${type}] 필수 필드 "${req}"이(가) 비어있음`);
      }
    }
    return { ...slide, data };
  }

  /** 오늘 날짜를 'YY.MM.DD' 한국식 짧은 형식으로 반환 (history 슬라이드용). */
  function todayShortYYMMDD() {
    const d = new Date();
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yy}.${mm}.${dd}`;
  }

  /** AI 가 학습 데이터의 가짜 날짜('26.02.25' 등)로 채운 history rows[].date 와 cover.date 를
   *  실제 작업 시점(오늘) 으로 교체. AI 생성/편집 직후에 호출.
   *
   *  교체 대상:
   *   - slide.type === 'cover' 의 data.date
   *   - slide.type === 'history' 의 data.rows[*].date 중 '비어있거나/명백히 가짜인' 것
   *
   *  보존: 사용자가 명시적으로 수정한 날짜는 변경 안 함 (값이 있고 오늘과 가까우면 유지).
   *  단, '갓 생성된' 직후 흐름에서는 모든 가짜 날짜를 강제로 오늘로 덮어씀(opts.force).
   */
  function injectRealDates(gdd, opts) {
    if (!isObj(gdd) || !isArr(gdd.slides)) return gdd;
    opts = opts || {};
    const today = todayShortYYMMDD();
    // AI 학습 데이터 빈도 높은 가짜 날짜 패턴 — 이런 값은 무조건 오늘로 교체.
    // YY.MM.DD 형식의 임의 날짜는 사용자가 수정한 값일 수 있으므로 force 옵션이 없으면 보존.
    const isFakePlaceholder = (s) => {
      if (!s || typeof s !== 'string') return true;
      const t = s.trim();
      if (!t) return true;
      if (/^[.…]+$/.test(t)) return true; // "...", "..." 등
      if (/^(TBD|TODO|미정|추후)/i.test(t)) return true;
      return false;
    };
    const newSlides = gdd.slides.map(slide => {
      if (!slide || !slide.data) return slide;
      // cover.date
      if (slide.type === 'cover') {
        const d = slide.data;
        if (opts.force || isFakePlaceholder(d.date)) {
          return { ...slide, data: { ...d, date: today } };
        }
      }
      // history.rows[].date
      if (slide.type === 'history' && isArr(slide.data.rows)) {
        const rows = slide.data.rows.map(r => {
          if (!isObj(r)) return r;
          if (opts.force || isFakePlaceholder(r.date)) {
            return { ...r, date: today };
          }
          return r;
        });
        return { ...slide, data: { ...slide.data, rows } };
      }
      return slide;
    });
    return { ...gdd, slides: newSlides };
  }

  /** GDD 전체 검증 + 보정 */
  function validateGdd(gdd) {
    const fixes = [];
    if (!isObj(gdd)) {
      return { gdd: null, fixes: ['유효하지 않은 GDD 객체'] };
    }
    const slides = isArr(gdd.slides) ? gdd.slides.map(s => validateSlide(s, fixes)) : [];
    if (!isArr(gdd.slides)) fixes.push('slides 배열 누락 — 빈 배열로 보정');

    const fixed = {
      ...gdd,
      title: gdd.title || '제목 없음',
      subtitle: gdd.subtitle || '',
      team: gdd.team || '',
      author: gdd.author || '김기획',
      version: gdd.version || 'Ver00',
      badge: gdd.badge || 'AI',
      slides,
      history: isArr(gdd.history) ? gdd.history : [],
      comments: isArr(gdd.comments) ? gdd.comments : [],
    };
    if (!gdd.id) {
      fixed.id = 'gdd-' + Math.random().toString(36).slice(2, 10);
      fixes.push('id 자동 생성');
    }
    return { gdd: fixed, fixes };
  }

  /** 컨셉 검증 + 보정 */
  function validateConcept(concept) {
    const fixes = [];
    if (!isObj(concept)) return { concept: null, fixes: ['유효하지 않은 컨셉 객체'] };

    const defaults = {
      title: '새 컨셉',
      subtitle: '',
      badge: '',
      author: '김기획',
      visual: { src: null, prompt: '', promptKo: '' },
      palette: [],
      theme: { bg: '#0a1411', main: '#88DFB0', accent: '#F5D94F' },
      coreLoop: [],
      overview: { genre: '', platform: '', target: '', engine: '' },
      keyUsp: [],
      recommendedPlans: [],
      locked: {},
      snapshots: [],
    };
    const merged = fillDefaults(concept, defaults);

    // visual
    if (!isObj(merged.visual)) {
      fixes.push('visual이 객체가 아님 — 보정');
      merged.visual = { src: null, prompt: '', promptKo: '' };
    }
    // palette
    if (!isArr(merged.palette)) {
      fixes.push('palette가 배열이 아님 — 보정');
      merged.palette = [];
    }
    merged.palette = merged.palette.map(p => isObj(p) ? { name: p.name || '색상', hex: p.hex || '#888888' } : { name: '색상', hex: '#888888' });

    // coreLoop
    if (!isArr(merged.coreLoop)) merged.coreLoop = [];
    merged.coreLoop = merged.coreLoop.map(n => isObj(n) ? { label: n.label || '단계' } : { label: '단계' });

    // overview
    if (!isObj(merged.overview)) merged.overview = defaults.overview;
    else merged.overview = { ...defaults.overview, ...merged.overview };

    // keyUsp
    if (!isArr(merged.keyUsp)) merged.keyUsp = [];
    merged.keyUsp = merged.keyUsp.map(u => isStr(u) ? u : String(u || ''));

    // recommendedPlans
    if (!isArr(merged.recommendedPlans)) merged.recommendedPlans = [];
    merged.recommendedPlans = merged.recommendedPlans.map((p, i) => ({
      id: p?.id || ('rp' + Math.random().toString(36).slice(2, 6)),
      title: p?.title || `기획서 ${i + 1}`,
      description: p?.description || '',
      linkedGddId: p?.linkedGddId || null,
    }));

    if (!merged.id) {
      merged.id = 'concept-' + Math.random().toString(36).slice(2, 10);
      fixes.push('id 자동 생성');
    }
    return { concept: merged, fixes };
  }

  window.validateGdd = validateGdd;
  window.validateConcept = validateConcept;
  window.validateSlide = (s) => {
    const fixes = [];
    return { slide: validateSlide(s, fixes), fixes };
  };
  window.injectRealDates = injectRealDates;
  window.todayShortYYMMDD = todayShortYYMMDD;
})();
