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

  /** 보안 chokepoint: 이미지 src 의 URL 스킴 화이트리스트.
   * IDB 복원 / AI 응답 / 사용자 import — 어디서 오든 이 검사를 통과해야 DOM 에 들어감.
   *
   * 허용:
   *  - data:image/...           — AI 생성 이미지 (base64 PNG/JPG 등)
   *  - blob:                    — 사용자가 업로드한 파일의 임시 URL
   *  - idb-image://             — 자체 IndexedDB blob URL 프로토콜
   *  - http(s)://               — 정상 외부 이미지
   *  - / 또는 ./ 또는 같은 페이지 내 상대경로
   *
   * 차단: javascript:, data:text/html, vbscript:, file:, chrome-extension://
   * @param {unknown} v
   * @returns {string|null}
   */
  function sanitizeImageSrc(v) {
    if (v == null || v === '') return null;
    if (typeof v !== 'string') return null;
    // 매우 긴 데이터 URL 은 일단 통과(이미지 base64). 다른 스킴은 길이 제한 없음.
    return /^(data:image\/[a-zA-Z0-9+.\-]+;|blob:|idb-image:\/\/|https?:\/\/|\/|\.\/|#)/i.test(v)
      ? v
      : null;
  }

  /* === 기획서 작성 선행 단계 추정 (priority 1~10) ===
   *
   * 게임 개발 표준 순서:
   *   1 = 코어 게임플레이/메인 루프 (모든 기획의 출발점)
   *   2 = 시스템 (전투/이동/조작/카메라/성장/난이도/밸런스)
   *   3 = 데이터 스키마/진행/스테이지 (시스템 정의에 의존)
   *   4 = 콘텐츠 (모드/이벤트/시즌/패스/던전/챕터)
   *   5 = 메타·소셜 (매칭/로비/길드/채팅/리더보드)
   *   6 = 온보딩·튜토리얼 (위 시스템들이 정의되어야 작성 가능)
   *   7 = 경제·BM (재화/상점/IAP/광고/패스)
   *   8 = UI·UX·아트·사운드
   *   9 = 기술·인프라 (서버/네트워크/안티치트/배포)
   *  10 = 운영·QA·마케팅·런칭 (모든 시스템 의존)
   *
   * priority 가 없는 legacy 데이터에 대한 fallback. title + description 의 키워드로 추정.
   */
  function inferPlanPriority(title, description) {
    const t = ((title || '') + ' ' + (description || '')).toLowerCase();
    // 매칭 순서가 곧 우선순위 — 가장 명확한 시그널부터 검사하여 단어 중복 충돌 회피.
    // ex) "키비주얼 가이드" 는 마케팅(10) 이지 온보딩(6) 의 '가이드' 가 아니므로 10 을 먼저 확인.

    // 10: 운영/QA/마케팅/런칭 (후공정 — '가이드' 같은 일반 어휘보다 명확한 후공정 키워드 먼저)
    if (/운영|operation|customer\s*support|환불|refund|보상\s*정책|신고|제재|moderation|테스트\s*플랜|test\s*plan|\bqa\b|품질\s*보증|자동화\s*테스트|출시\s*체크|인증|등급\s*심의|마케팅|marketing|트레일러|trailer|스토어\s*페이지|store\s*page|사전등록|키비주얼|키\s*비주얼|key\s*visual|런칭|launch|cbt|obt/.test(t)) return 10;

    // 9: 기술/인프라
    if (/서버\s|server|네트워크|network|프로토콜|protocol|안티치트|anti-?cheat|빌드\s|build\s|배포|deploy|모니터링|monitoring|\s로그\b|logging|분석\s*파이프라인|analytics|인프라|infra|아키텍처/.test(t)) return 9;

    // 1: 핵심 게임플레이
    if (/코어\s*루프|core\s*loop|메인\s*루프|main\s*loop|핵심\s*게임플레이|핵심\s*컨셉|게임\s*디자인\s*핵심|core\s*gameplay/.test(t)) return 1;

    // 2: 코어 시스템
    if (/전투|battle|combat|조작|컨트롤|control|카메라|이동\s*시스템|movement|성장\s|레벨링|레벨\s*업|leveling|progression\s|난이도|밸런스|balance|difficulty/.test(t)) return 2;

    // 3: 데이터/진행
    if (/데이터\s*스키마|db\s*스키마|database|데이터\s*모델|데이터\s*테이블|data\s*table|스테이지|stage|진행도|챕터|chapter/.test(t)) return 3;

    // 6: 온보딩 (튜토리얼 핵심 시그널 — '가이드' 단독은 제외, 너무 광범위)
    if (/튜토리얼|tutorial|온보딩|onboarding|\bftue\b|첫\s*플레이|신규\s*유저|new\s*user|첫\s*경험|신규\s*가이드|초보\s*가이드/.test(t)) return 6;

    // 7: 경제/BM
    if (/경제\s|economy|재화|currency|상점|샵\b|\bshop\b|\bstore\b|결제|\biap\b|인앱|in-?app|광고\s*수익|ad\s*monet|구독|subscription|\bbm\b|환율|가격|pricing|monetiz/.test(t)) return 7;

    // 8: UI/UX/아트/사운드
    if (/\bui\b|\bux\b|와이어|wireframe|디자인\s*시스템|design\s*system|아트\s|art\s|캐릭터\s*아트|배경\s*아트|모션|motion|이펙트|effect|\bvfx\b|사운드|sound|\bbgm\b|\bsfx\b|음향|보이스|voice/.test(t)) return 8;

    // 4: 콘텐츠 (모드/이벤트/시즌)
    if (/콘텐츠|content|게임\s*모드|game\s*mode|이벤트|event\s|시즌|season|패스\s|battle\s*pass|던전|월드|world\s|보스|\braid\b/.test(t)) return 4;

    // 5: 메타/소셜
    if (/매칭|matchmaking|로비|lobby|매치메이커|소셜|social|친구|friend|길드|클랜|guild|clan|채팅|\bchat\b|리더보드|랭킹|ranking|leaderboard/.test(t)) return 5;

    return 5; // 기본값 — 중반
  }

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
    diagram: {
      required: ['nodes'],
      defaults: { section: '02', sectionName: '시스템 구조', title: '다이어그램', nodes: [], edges: [] },
      arrays: {
        nodes: { item: { id: 'n1', label: '노드', kind: 'process', col: 0, row: 0 } },
        edges: { item: { from: '', to: '', label: '' } },
      },
    },
    flow: {
      required: ['nodes'],
      defaults: {
        section: '02', sectionName: '플로우 차트', title: '플로우 차트',
        direction: 'vertical', lines: 1, nodes: [],
      },
      arrays: {
        nodes: { item: { id: 'n1', label: '단계', kind: 'process', edgeLabel: '' } },
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
    'behavior-tree': {
      required: ['nodes'],
      defaults: { section: '02', sectionName: 'AI 행동 트리', title: '행동 트리 (BT)', rootId: 'n1', nodes: [] },
      arrays: {
        nodes: { item: { id: 'n1', kind: 'sequence', name: '노드', parentId: null, note: '', decoratorType: '' } },
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
    // 보안 chokepoint — imageSrc 스킴 검증.
    // 모든 슬라이드 타입의 imageSrc 필드는 sanitize 후 통과. javascript:/data:text/html
    // 등은 null 로 대체되어 DOM 에 도달하지 않음.
    if ('imageSrc' in data) {
      const before = data.imageSrc;
      const safe = sanitizeImageSrc(before);
      if (before && !safe) {
        fixes.push(`슬라이드 [${type}] imageSrc 의 URL 스킴이 허용되지 않아 제거 (보안)`);
      }
      data.imageSrc = safe;
    }
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
      mustHaveFeatures: [],   // 사용자가 ConceptBrief 에서 선택한 기능 ID 배열
      locked: {},
      snapshots: [],
    };
    const merged = fillDefaults(concept, defaults);

    // visual — src 는 sanitizeImageSrc 로 javascript:/data:text/html 차단.
    if (!isObj(merged.visual)) {
      fixes.push('visual이 객체가 아님 — 보정');
      merged.visual = { src: null, prompt: '', promptKo: '' };
    }
    {
      const beforeSrc = merged.visual.src;
      const safeSrc = sanitizeImageSrc(beforeSrc);
      if (beforeSrc && !safeSrc) {
        fixes.push('visual.src 의 URL 스킴이 허용되지 않아 제거 (보안)');
      }
      merged.visual = { ...merged.visual, src: safeSrc };
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

    // recommendedPlans — priority 1(가장 먼저 작성) ~ 10(맨 나중) 부여.
    // AI 가 직접 넣지 않았더라도 휴리스틱으로 보강해 정렬 가능하도록 함.
    if (!isArr(merged.recommendedPlans)) merged.recommendedPlans = [];
    merged.recommendedPlans = merged.recommendedPlans.map((p, i) => {
      const rawPriority = (p && (p.priority || p.order || p.stage));
      const numPriority = (typeof rawPriority === 'number' && isFinite(rawPriority))
        ? Math.max(1, Math.min(10, Math.round(rawPriority)))
        : (typeof rawPriority === 'string' && /^\d+$/.test(rawPriority.trim())
            ? Math.max(1, Math.min(10, parseInt(rawPriority, 10)))
            : null);
      return {
        id: p?.id || ('rp' + Math.random().toString(36).slice(2, 6)),
        title: p?.title || `기획서 ${i + 1}`,
        description: p?.description || '',
        priority: numPriority !== null ? numPriority : inferPlanPriority(p?.title, p?.description),
        linkedGddId: p?.linkedGddId || null,
      };
    });

    // mustHaveFeatures — 사용자가 선택한 기능 id 의 문자열 배열. 모르는 id 는 제거하지 않음
    // (카탈로그가 확장되어도 hostable). UI 에서 lookupFeatureById 로 누락 항목은 자연 무시됨.
    if (!isArr(merged.mustHaveFeatures)) merged.mustHaveFeatures = [];
    merged.mustHaveFeatures = merged.mustHaveFeatures
      .filter(id => typeof id === 'string' && id.length > 0)
      .map(id => id.trim());

    if (!merged.id) {
      merged.id = 'concept-' + Math.random().toString(36).slice(2, 10);
      fixes.push('id 자동 생성');
    }
    return { concept: merged, fixes };
  }

  /** 단일 진실 공급원: plan 객체의 priority 를 1~10 범위로 강제.
   * - number 면 clamp + round
   * - 누락이면 inferPlanPriority 휴리스틱으로 추정
   * 호출처: validateConcept, concept.jsx UI 정렬, app.jsx bulkCreate 정렬. */
  function resolvePlanPriority(plan) {
    const raw = plan && plan.priority;
    if (typeof raw === 'number' && isFinite(raw)) {
      return Math.max(1, Math.min(10, Math.round(raw)));
    }
    return inferPlanPriority(plan && plan.title, plan && plan.description);
  }

  window.validateGdd = validateGdd;
  window.validateConcept = validateConcept;
  window.validateSlide = (s) => {
    const fixes = [];
    return { slide: validateSlide(s, fixes), fixes };
  };
  window.injectRealDates = injectRealDates;
  window.todayShortYYMMDD = todayShortYYMMDD;
  // concept.jsx UI 와 app.jsx bulkCreate 양쪽에서 재사용.
  window.inferPlanPriority = inferPlanPriority;
  window.resolvePlanPriority = resolvePlanPriority;
  // 보안 chokepoint — DOM 진입 직전 image src 검증 + AI 응답 echo 시 prompt injection 차단.
  window.sanitizeImageSrc = sanitizeImageSrc;
})();
