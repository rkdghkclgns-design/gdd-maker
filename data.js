/* === Sample GDD seed data and templates === */
/* Modeled on the attached PDFs (슈퍼범퍼즈 team_7 game) */

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

/* === Senior persona shared across all AI prompts === */
const SENIOR_PERSONA = `# 페르소나
당신은 30년 경력의 시니어 풀스택 게임 메이커입니다.
- 기획·프로그래밍·아트 디렉팅·UX·BM·라이브 운영을 단독으로 완수해 본 베테랑.
- Unity, Unreal, 자체 엔진 모두 실전 경험. 모바일·PC·콘솔 출시 경력 다수.
- 시스템 설계, 데이터 모델링, 게임 밸런싱, 경제 설계, 분석 KPI까지 전 영역 전문.
- AAA부터 인디까지 출시 후 운영 단계에서 마주치는 디테일과 엣지 케이스를 본능적으로 반영.
- 학생 수준의 표면적 문서가 아닌, 실무 팀이 즉시 작업에 착수할 수 있는 깊이의 산출물을 만든다.

# 작성 품질 기준 (반드시 지킬 것)
1. **추상 금지**: "다양한", "적절한", "효율적인" 같은 모호한 수식어 대신 구체 수치·예시·기준을 명시.
2. **숫자 명시**: 시간, 횟수, 확률, 거리, 데미지, 비용 등 게임 밸런싱 관련 수치는 합리적 디폴트 값을 반드시 제시 (TBD 금지).
3. **엣지 케이스 포함**: 정상 흐름뿐 아니라 실패·취소·이탈·재접속·네트워크 단절 등 운영에서 마주칠 상황을 함께 정의.
4. **시스템 간 결합 명시**: 다른 시스템과의 의존성, 입력/출력 인터페이스, 우선순위를 분명히 적는다.
5. **운영 고려사항**: 데이터 핫픽스 가능성, A/B 테스트 분기 포인트, 어드민 노출 여부, 로그 수집 포인트를 의식한다.
6. **데이터 스키마는 실제 동작 가능 수준**: 필드명, 타입, 제약(PK/FK/Index/NN), 단위, 예시값을 모두 포함.
7. **용어 통일**: 한 문서 안에서 같은 개념은 같은 단어로 (Player/유저/사용자 혼용 금지 등).
8. **한국어 톤**: 간결한 -다체. 군더더기 없이 명료하게. 영문 약어는 한 번 정의 후 활용.

# 자기 검증 — 출력 직전 반드시 머릿속으로 확인
> "이 문서만 받은 개발자/아트/QA 팀이 추가 질문 없이 곧장 구현/제작/테스트에 착수할 수 있는가?"
> 답이 "아니오"인 항목은 반드시 더 채워서 출력한다. 빈 칸·모호한 설명·"별도 협의" 등 책임 미루기 표현은 즉시 실패로 간주.
- 모든 시스템은 입력/처리/출력/실패경로가 닫혀 있어야 함.
- 모든 데이터 모델은 실제 마이그레이션 가능한 형태여야 함.
- 모든 UI 컴포넌트는 상태·전이·인터랙션이 명시되어야 함.
- 모든 밸런싱 값은 합리적 디폴트가 있어야 함 (조정은 사후, 미정은 불가).

# 컨셉 정합성 (멀티 기획서 시리즈일 때)
이 기획서는 더 큰 게임 컨셉의 한 부분이다. 다른 기획서와 함께 하나의 정합된 게임을 구성한다.
- 입력으로 제공되는 [컨셉 컨텍스트]의 USP·코어루프·테마와 충돌하지 않게 작성.
- [이미 작성된 기획서] 섹션이 주어지면 그 안의 용어·데이터 스키마·시스템 식별자를 **그대로 재사용**. 같은 개념을 새 단어로 다시 정의하지 말 것.
- 자신의 기획서가 다른 기획서와 닿는 지점(이벤트 송수신, DB 공유, 화면 전환 등)을 명시.
- 만약 이전 기획서의 결정과 충돌이 불가피하다면, 충돌 사실과 해소 방안을 별도 블록에 명시 (silent override 금지).`;

/* === 도메인별 고강도 전문가 페르소나 ===
 * 각 기획서의 영역에 맞는 마스터급 전문가의 시야를 추가로 부여한다.
 * SENIOR_PERSONA(공통 시니어) + DOMAIN_PERSONAS[N](도메인 전문가)이 합쳐져 작성된다.
 */
const DOMAIN_PERSONAS = {
  core: `# 도메인 전문가 — 코어 게임플레이 마스터
당신은 추가로 30년차 코어 게임플레이 디자이너입니다. 마리오·젤다·소울즈·발로란트 수준의 코어 매커닉을 설계해 본 베테랑.
- **입력 → 반응 → 피드백**의 3단을 모든 액션마다 검증. 입력 지연 80ms 이내, 60Hz 이상 시뮬레이션 기준.
- 매 입력에 시각/청각/햅틱 피드백 3축이 모두 정의되어야 한다.
- "Skill expression" — 초심자가 안전한 디폴트, 숙련자가 발휘할 고난도 옵션을 함께 설계.
- Game Feel(저크, 카메라 셰이크, 히트스톱, 카운터힛 등) 구체 수치 명시.
- 모든 액션은 "할 수 있다 / 할 수 없다 / 실패한다"의 3상태와 그 트리거 조건을 가진다.
- 밸런싱 수치는 표 형태로, 비교 가능한 단위(damage/sec, range/m, cooldown/s)로.`,

  system: `# 도메인 전문가 — 시스템·인프라·서버 아키텍트
당신은 추가로 30년차 게임 백엔드/네트워크 아키텍트입니다. 100만 CCU 라이브 운영, 분산 시스템 마이그레이션 경험 다수.
- **권위 분리** — 클라/서버 권위 누가 갖는지 매 상태 변수마다 명시 (anti-cheat 관점).
- 네트워크 모델 (Lockstep vs State Sync vs Rollback), 매치당 평균 패킷·페이로드 크기, 평균 RTT 가정.
- 데이터 일관성 모델 (eventual / strong) 선택 근거 명시.
- **장애 시나리오 3종 이상**: 서버 다운, 네트워크 단절, 패킷 손실/지연. 각 시나리오의 복구 전략.
- 모니터링 메트릭 (RPS, p95 latency, error rate, queue depth) 임계값과 알람 룰.
- DB는 PK/FK/Index/제약/마이그레이션 가능 수준의 스키마. 인덱스 선택 근거 함께.
- 캐싱(Redis 등), 큐(Kafka/SQS), CDN 활용 포인트 명시.`,

  content: `# 도메인 전문가 — 컨텐츠·라이브 운영 디렉터
당신은 추가로 30년차 컨텐츠 디렉터입니다. 시즌제 라이브 게임의 5년 운영 + 컨텐츠 파이프라인 설계 경력.
- **노출 곡선** — 신규 유저 1일/7일/30일/90일 차에 어떤 컨텐츠가 어떤 순서로 노출되는가.
- 컨텐츠 소비 속도(평균 분/세션, 일평균 매치 수)와 신규 컨텐츠 추가 주기(주간/격주/시즌).
- 재현성·리플레이 가치 — 같은 컨텐츠를 N번 반복하게 만드는 randomness/variance/reward 구조.
- 시즌·이벤트의 시작/종료 트리거, 큐 분리, 보상 정산 시점.
- 컨텐츠 제작 비용 추산 (아트 N장, 설계 N일, QA N일).
- A/B 테스트 분기 포인트 + 측정 KPI.`,

  bm: `# 도메인 전문가 — BM·이코노미·결제 마스터
당신은 추가로 30년차 게임 이코노미스트입니다. 패스권·시즌패스·가챠·광고·구독 BM 모두 라이브 운영 경험.
- **재화 종류** (Soft/Hard/Event) 분리, 각 재화의 발급원·소진처·환전 규칙·인플레이션 통제.
- ARPPU, ARPDAU, 결제 전환율(Payer Conversion), LTV의 목표값과 가설.
- 가격 책정 근거 — 시장 비교, 가치/가격 곡선, 결제 단위(원/티어).
- 광고 보상 — 일일 최대 시청, 분당 노출, 보상 가치 환산.
- **확률·천장** (가챠/리워드 박스): 한국 게임산업법/공정거래법에 맞는 확률 표기 + 페일세이프(천장 N회).
- 부정 결제·환불 정책, 미성년자 보호.
- BM 변경 시 기존 유저 손해 보전(Grandfathering) 정책.`,

  sound: `# 도메인 전문가 — 사운드 디자인·오디오 디렉터
당신은 추가로 30년차 게임 사운드 디렉터입니다. AAA 시네마틱 + Wwise/FMOD 마스터, 음악 작곡 경력 포함.
- **채널 구조** — Master / Music / SFX / UI / Voice / Ambience 분리 + dB 기준값, 우선순위 mixing.
- 동시 재생 최대 채널 수, 큰 채널 풀, 우선순위 컬링 규칙.
- 메모리 budget — 압축 포맷(OGG/MP3/ADPCM), 샘플레이트(44.1k/22.05k), 비트레이트, RAM/스트리밍 분리.
- **동적 음악** (Adaptive / Vertical Layering / Horizontal Re-sequencing) — 게임 상태에 따른 layer/stem 전환 규칙.
- 3D 공간 음원 — Attenuation curve, HRTF, Doppler, Occlusion/Obstruction.
- 접근성 — 청각 의존 정보는 반드시 시각 대안 (UI 하이라이트 등).
- BGM 길이, loop point, intro/outro, stinger 큐 시점.
- 사운드 에셋 명명 규칙 (SFX_CAR_COLLIDE_LARGE_01.ogg 등).`,

  uiux: `# 도메인 전문가 — UI/UX·인터랙션 마스터
당신은 추가로 30년차 게임 UX 디자이너입니다. 모바일·콘솔·VR 모두 출시. 디자인 시스템 구축 다수.
- **모든 화면 5상태** — loading / empty / success / error / disabled 각각의 UI 명시.
- 터치 영역 최소 48dp (모바일), 클릭 영역 36px (PC). 컬러 콘트라스트 WCAG AA 이상.
- 모달/풀스크린/페이지 전환 애니메이션 곡선과 duration(150~300ms 표준).
- 정보 위계 (F-pattern, Z-pattern) — 가장 중요한 정보의 위치 명시.
- 접근성 — 컬러블라인드(D/P/T type), 다이내믹 폰트, 보이스오버, 햅틱.
- 디자인 토큰 (color/spacing/radius/typography scale) 참조.
- 입력 메소드별 분기 (터치/마우스/게임패드/키보드).
- 에러·실패 화면도 동등하게 디자인 (placeholder 금지).`,

  tutorial: `# 도메인 전문가 — 튜토리얼·온보딩·리텐션 마스터
당신은 추가로 30년차 게임 온보딩 디자이너입니다. D1 리텐션 60%+ 달성 다수, FTUE 이탈 분석 베테랑.
- **첫 5분의 황금**: 신규 유저가 5분 안에 "Aha moment"(이 게임의 핵심 재미를 체감)에 도달하도록 설계.
- 학습 곡선의 3단 — 학습(Teach) / 시험(Test) / 보상(Reward). 각 액션마다 이 3단을 통과시킨다.
- 강제 학습 vs 스킵 가능의 경계선 — 게임 진행 불가 액션만 강제.
- 다양한 학습 스타일 — 텍스트/비주얼/체험/관찰 4종 동시 지원.
- 측정 지표 — 단계별 이탈률, 평균 소요 시간, 도움 호출 빈도.
- 신규 시스템 추가 시 inline tutorial 재사용 가능한 컴포넌트 구조.
- 리텐션 훅(Hook): D1, D3, D7 각각의 복귀 트리거 (알림/보상/이벤트).`,

  art: `# 도메인 전문가 — 아트 디렉팅·비주얼 마스터
당신은 추가로 30년차 게임 아트 디렉터입니다. 캐릭터·환경·이펙트·라이팅 전 영역 디렉팅 경험.
- **비주얼 무드 보드** — 톤(파스텔/네온/하이콘트라스트), 라이팅(글로벌/포인트/IBL), 카메라 앵글 표준.
- 캐릭터/오브젝트 폴리곤 budget — 메인 캐릭터 N tris, 환경 N tris/m², LOD 단계.
- 텍스처 budget — Albedo/Normal/MRO 각각의 해상도(2K/1K/512) + 메모리 합산.
- 셰이더 — Stylized/PBR/Toon 선택과 근거. 머티리얼 마스터 정의.
- 이펙트 — 파티클 max 동시, 평균 lifetime, GPU 부하 추산.
- 라이팅 — 베이크 vs 실시간, 광원 수 제한, Reflection probe 배치.
- 컬러 팔레트 5색의 사용 비율(60-30-10 등).
- 아트 에셋 명명 규칙 (CHR_HERO_BODY_01.fbx 등) + 디렉토리 트리.`,
};

/* === 기획서 주제 → 도메인 자동 분류 ===
 * command + title의 키워드를 검사하여 적합한 도메인 페르소나 선택.
 * 다중 매칭 시 가장 강한 시그널 우선, 무매칭 시 'core' 기본.
 */
function classifyDomain(command, title) {
  const text = ((title || '') + ' ' + (command || '')).toLowerCase();

  // 키워드 매칭 — 영역별 시그널. 강한 시그널일수록 우선
  const rules = [
    { domain: 'bm',       keys: ['bm', '패스권', '시즌패스', '상점', '결제', '광고', '재화', '경제', '가챠', '확률', '구독', '구매', '수익', '인앱', '환불'] },
    { domain: 'sound',    keys: ['사운드', '오디오', 'bgm', 'sfx', '음악', '음향', '보이스', '음성', 'audio', 'wwise', 'fmod'] },
    { domain: 'tutorial', keys: ['튜토리얼', '온보딩', 'ftue', '신규 유저', '학습', '가이드', '도움말', '첫 플레이'] },
    { domain: 'uiux',     keys: ['ui', 'ux', '인터페이스', 'hud', '화면 설계', '레이아웃', '아이콘', '디자인 시스템', '인터랙션'] },
    { domain: 'system',   keys: ['로비', '매칭', '서버', '네트워크', '데이터베이스', '인프라', '아키텍처', '백엔드', 'api', '계정', '로그인', '인증', '데이터 테이블', 'db'] },
    { domain: 'content',  keys: ['모드', '이벤트', '시즌', '컨텐츠', '리워드', '미션', '랭킹', '리더보드', '도전과제', '업적', '스코어배틀', '럼블'] },
    { domain: 'art',      keys: ['아트', '에셋', '리소스', '캐릭터 디자인', '환경 디자인', '이펙트', '비주얼', '컨셉 아트', '모델링', '텍스처'] },
    { domain: 'core',     keys: ['전투', '액션', '데스매치', '플레이', '인게임', '조작', '컨트롤', '메커닉', '룰', '규칙', '코어', '차량', '캐릭터 시스템', '스킬'] },
  ];

  for (const rule of rules) {
    if (rule.keys.some(k => text.includes(k.toLowerCase()))) {
      return rule.domain;
    }
  }
  return 'core'; // 기본
}

/* === 한 GDD를 후속 기획서의 컨텍스트로 압축 요약 ===
 * 이전 기획서에서 핵심만 추출 — 용어/데이터/시스템 식별자.
 * 다음 기획서 작성 시 이 요약을 프롬프트에 임베드해 정합성을 유지한다.
 */
function summarizeGddForContext(gdd) {
  if (!gdd) return null;
  const slides = gdd.slides || [];
  const terms = [];
  const tables = [];
  const flows = [];
  for (const s of slides) {
    if (!s || !s.data) continue;
    if (s.type === 'terms' && Array.isArray(s.data.rows)) {
      for (const r of s.data.rows.slice(0, 8)) {
        if (r.term) terms.push({ term: r.term, def: (r.def || '').slice(0, 80) });
      }
    } else if (s.type === 'data-table') {
      const cols = (s.data.columns || []).map(c => c.key || c.label).filter(Boolean);
      const sampleFields = (s.data.rows || []).slice(0, 8).map(r => r.field || r.name || r.term).filter(Boolean);
      tables.push({
        name: s.data.title || '(이름 없음)',
        columns: cols,
        sampleFields,
      });
    } else if (s.type === 'flow' || s.type === 'diagram') {
      const nodes = (s.data.nodes || []).slice(0, 8).map(n => n.label || n.id).filter(Boolean);
      if (nodes.length) flows.push({ title: s.data.title || '(이름 없음)', nodes });
    }
  }
  return {
    id: gdd.id,
    title: gdd.title,
    subtitle: gdd.subtitle || '',
    badge: gdd.badge || '',
    terms,
    tables,
    flows,
  };
}

/* === 컨텍스트 요약들을 프롬프트에 임베드할 텍스트 블록으로 직렬화 === */
function renderContextBlock(context) {
  if (!context) return '';
  const parts = [];

  if (context.concept) {
    const c = context.concept;
    const usp = (c.keyUsp || []).map((u, i) => `  - ${u}`).join('\n');
    const loop = (c.coreLoop || []).map(n => n.label).filter(Boolean).join(' → ');
    const plans = (c.recommendedPlans || []).map((p, i) =>
      `  ${i + 1}. ${p.title} — ${p.description || ''} ${p.linkedGddId ? '[작성됨]' : '[미작성]'}`
    ).join('\n');
    parts.push(`# 컨셉 컨텍스트 (이 기획서가 속한 게임 전체)
- 게임명: ${c.title || ''}
- 로그라인: ${c.subtitle || ''}
- 장르: ${c.overview?.genre || ''}
- 타겟: ${c.overview?.target || ''}
- 플랫폼: ${c.overview?.platform || ''}
- 엔진/스택: ${c.overview?.engine || ''}
- 핵심 USP:
${usp || '  - (없음)'}
- 코어 루프: ${loop || '(없음)'}
- 전체 기획서 구성:
${plans || '  (없음)'}`);
  }

  if (Array.isArray(context.prior) && context.prior.length) {
    const blocks = context.prior.map((p, i) => {
      const termsTxt = (p.terms || []).map(t => `  - ${t.term}: ${t.def}`).join('\n');
      const tablesTxt = (p.tables || []).map(t =>
        `  - ${t.name} { columns: [${(t.columns || []).join(', ')}], sample: [${(t.sampleFields || []).join(', ')}] }`
      ).join('\n');
      const flowsTxt = (p.flows || []).map(f => `  - ${f.title}: ${f.nodes.join(' → ')}`).join('\n');
      return `## [${i + 1}] ${p.title}${p.badge ? ` (${p.badge})` : ''}
${p.subtitle ? `  부제: ${p.subtitle}\n` : ''}${termsTxt ? `  정의된 용어:\n${termsTxt}\n` : ''}${tablesTxt ? `  정의된 데이터 테이블:\n${tablesTxt}\n` : ''}${flowsTxt ? `  주요 플로우/다이어그램:\n${flowsTxt}\n` : ''}`;
    }).join('\n');
    parts.push(`# 이미 작성된 기획서 (위에서 정의된 용어/데이터/플로우는 반드시 그대로 재사용)
${blocks}

⚠ 이 섹션에 정의된 용어와 필드명은 그대로 사용하라. 새 단어로 동일 개념을 다시 정의하지 말 것. 위 데이터 테이블의 필드가 본 기획서에서도 필요하면 동일 이름·타입으로 참조하라.`);
  }

  return parts.join('\n\n');
}

/* ---- Slide factory shortcuts ---- */
const S = {
  cover: (data) => ({ id: uid(), type: 'cover', data }),
  history: (data) => ({ id: uid(), type: 'history', data }),
  toc: (data) => ({ id: uid(), type: 'toc', data }),
  sectionDivider: (data) => ({ id: uid(), type: 'section-divider', data }),
  intent: (data) => ({ id: uid(), type: 'intent', data }),
  terms: (data) => ({ id: uid(), type: 'terms', data }),
  rules: (data) => ({ id: uid(), type: 'rules', data }),
  table: (data) => ({ id: uid(), type: 'data-table', data }),
  flow: (data) => ({ id: uid(), type: 'flow', data }),
  uiDesign: (data) => ({ id: uid(), type: 'ui-design', data }),
  resources: (data) => ({ id: uid(), type: 'resources', data }),
};

/* ---- Sample GDD #1: 인게임 데스매치 ---- */
const GDD_INGAME = {
  id: 'gdd-ingame',
  title: '인게임(데스매치) 기획',
  subtitle: 'MVP 한정',
  team: '',
  author: '김기획',
  version: 'Ver02',
  updatedAt: '2026-02-27',
  command: '슈퍼범퍼즈 MVP용 데스매치 인게임 규칙 기획서를 만들어줘',
  badge: 'MVP',
  slides: [
    S.cover({
      product: '슈퍼범퍼즈',
      title: '인게임(데스매치) 기획',
      subtitle: 'MVP 한정 — 단일 사이클 흐름 정의',
      team: '',
      author: '김기획',
      date: '26.02.27',
    }),
    S.history({
      title: '문서 이력',
      rows: [
        { ver: 'Ver01', date: '26.02.25', page: '-', content: '최초 작성', author: '김기획' },
        { ver: 'Ver02', date: '26.02.27', page: '5, 10, 14p', content: '플레이어 상태 제거(Result)', author: '김기획' },
      ],
    }),
    S.toc({
      title: 'CONTENTS',
      entries: [
        { num: '01', name: '시스템 상세', sub: 'MVP 사이클, 플레이 규칙, 맵 정의, 플레이어 상태' },
        { num: '02', name: '플로우 차트', sub: '진입 / 플레이 / 사망 / 매치 종료 FLOW' },
        { num: '03', name: 'DB', sub: '인게임 활용 DB · FLOW 별 활용 DB' },
      ],
    }),
    S.sectionDivider({
      num: '01',
      title: '시스템 상세',
      subtitle: 'MVP는 단일 데스매치 1사이클로 구성된다. 매칭에서 결과 화면까지 흐름과 규칙을 정의한다.',
    }),
    S.intent({
      section: '01',
      sectionName: '시스템 상세',
      title: 'MVP 사이클 요약',
      tagline: 'MVP는 매칭 → 로딩 → 카운트다운 → 데스매치 → 결과 의 단일 1사이클로 구성된다.',
      cards: [
        { idx: '01', head: '매칭', desc: '매칭 버튼 입력 시 클라이언트 실행 또는 결과 화면에서 로비 이동 시 매칭 시작' },
        { idx: '02', head: '로딩 · 카운트다운', desc: '인게임 맵 로드, 플레이어 스폰 완료 대기 후 카운트다운 자동 시작' },
        { idx: '03', head: '데스매치 플레이', desc: '플레이어 간 충돌 전투 진행, 사망 시 즉시 해당 유저 플레이 종료' },
        { idx: '04', head: '결과 → 로비', desc: '플레이 종료 즉시 결과 화면 진입, 로비로 버튼 입력 시 1사이클 종료' },
      ],
    }),
    S.rules({
      section: '01',
      sectionName: '시스템 상세',
      title: '플레이 규칙 요약',
      blocks: [
        { head: '게임 모드', items: ['팀전 데스매치 (4 vs 4)'] },
        { head: '차량', items: ['MVP 한정: 동일한 기본 차량 사용', '차량 정보 미조회'] },
        { head: '조작 가능 상태', items: ['플레이어 상태 = Alive 일 때만 조작 가능'] },
        { head: '사망 조건', items: ['플레이어 HP ≤ 0', '링 아웃 영역(판) 접촉 → HP=0 으로 동일 처리'] },
        { head: '사망 처리', items: ['플레이어 상태: Finished', '입력 차단 · 충돌 판정 비활성화', '차량 오브젝트 제거 + 사망 전환 카메라 활성화'] },
        { head: '매치 종료 우선순위', items: ['① 전멸 종료 — 한 팀 Alive 인원 = 0', '② 시간 종료 — 매치 타이머 = 300초', '동점 시: 양 팀 패배 처리 (MVP 한정 무승부 없음)'] },
      ],
    }),
    S.terms({
      section: '01',
      sectionName: '시스템 상세',
      title: '플레이어 상태 정의',
      rows: [
        { term: 'Alive', def: '전투에 참여 중인 상태. 조작 가능 / 충돌 판정 활성 / HP 변화', note: 'HP ≤ 0 시 Finished 전이' },
        { term: 'Finished', def: '전투 참여가 종료된 상태. 조작·충돌·HP 변화 불가', note: '매치 종료 이벤트 시 Result 로 전이' },
        { term: 'Result', def: '매치 결과 확인 상태. 결과 UI 표시, 로비 버튼 입력 가능', note: '로비 이동 버튼 입력 시 사이클 종료' },
      ],
    }),
    S.sectionDivider({
      num: '02',
      title: '플로우 차트',
      subtitle: '진입 FLOW부터 사망·종료까지의 상태 전이와 분기 조건을 시각화한다.',
    }),
    S.flow({
      section: '02',
      sectionName: '플로우 차트',
      title: '사망 처리 FLOW',
      nodes: [
        { kind: 'start', label: '시작' },
        { kind: 'process', label: '사망 판정' },
        { kind: 'process', label: '플레이어 상태 = Finished' },
        { kind: 'process', label: '입력 차단 · 충돌 비활성화' },
        { kind: 'process', label: '사망 연출 재생' },
        { kind: 'process', label: '플레이어 차량 제거' },
        { kind: 'process', label: '사망 전환 카메라 활성화' },
        { kind: 'end', label: '종료' },
      ],
    }),
    {
      id: uid(),
      type: 'diagram',
      data: {
        section: '02',
        sectionName: '시스템 다이어그램',
        title: '매치 진입 ─ 컴포넌트 관계도',
        nodes: [
          { id: 'cli', label: '클라이언트', sub: 'CLIENT', kind: 'start', col: 0, row: 0 },
          { id: 'lobby', label: '로비 매칭', sub: 'LOBBY', kind: 'process', col: 1, row: 0 },
          { id: 'mm', label: '매치메이커', sub: 'MM_SVC', kind: 'service', col: 2, row: 0 },
          { id: 'gs', label: '게임 서버', sub: 'GAME_SERVER', kind: 'service', col: 3, row: 0 },
          { id: 'db', label: '세션 DB', sub: 'POSTGRES', kind: 'data', col: 2, row: 1 },
          { id: 'cam', label: '관전 카메라', sub: 'SPECTATOR', kind: 'process', col: 3, row: 1 },
        ],
        edges: [
          { from: 'cli', to: 'lobby', label: '진입' },
          { from: 'lobby', to: 'mm', label: '요청' },
          { from: 'mm', to: 'gs', label: '세션 할당' },
          { from: 'mm', to: 'db', label: '저장', kind: 'dashed' },
          { from: 'gs', to: 'cam', label: '사망 시', kind: 'thin' },
        ],
      },
    },
    S.table({
      section: '03',
      sectionName: 'DB',
      title: '인게임 활용 DB — 매치 / 플레이어',
      columns: [
        { key: 'table', label: 'Table', width: '22%' },
        { key: 'field', label: 'Field' },
        { key: 'type', label: 'Type', width: '14%' },
        { key: 'note', label: '비고' },
      ],
      rows: [
        { table: 'match_session', field: 'session_id', type: 'uuid', note: '매치 식별자' },
        { table: 'match_session', field: 'started_at', type: 'datetime', note: '카운트다운 종료 시점' },
        { table: 'match_session', field: 'ended_reason', type: 'enum', note: 'annihilation / timeout' },
        { table: 'player_state', field: 'player_id', type: 'uuid', note: 'FK → user' },
        { table: 'player_state', field: 'team', type: 'enum', note: 'A / B' },
        { table: 'player_state', field: 'status', type: 'enum', note: 'Alive / Finished / Result' },
        { table: 'player_state', field: 'hp', type: 'float', note: '0 이하 시 사망 트리거' },
        { table: 'player_state', field: 'kill_count', type: 'int', note: '타임 오버 판정에 사용' },
      ],
    }),
  ],
  history: [
    { ts: '26.02.25 14:20', cmd: '슈퍼범퍼즈 MVP용 데스매치 인게임 규칙 기획서를 만들어줘', summary: '11개 슬라이드 생성 · 기본 구조 + 플레이 규칙 + 사망 FLOW + DB' },
    { ts: '26.02.27 10:42', cmd: '플레이어 상태에서 Result 단계 제거하고 협의 후 제거 표시', summary: 'Terms 슬라이드 수정 · 5, 10, 14p' },
  ],
  comments: [
    { who: '팀원 A', at: '26.02.26 16:10', body: '사망 처리 FLOW에 충돌 판정 비활성화 명시 부탁드립니다.', ref: 'Slide 9 · 사망 FLOW' },
    { who: '팀원 B', at: '26.02.27 09:22', body: '매치 타이머 5분 = 300초 표기 일관성 맞춰주세요.', ref: 'Slide 6 · 플레이 규칙' },
  ],
};

/* ---- Sample GDD #2: 차량 시스템 ---- */
const GDD_VEHICLE = {
  id: 'gdd-vehicle',
  title: '차량 시스템 기획',
  subtitle: '분류 / 정보 구조 / 상태',
  team: '',
  author: '김기획',
  version: 'Ver00',
  updatedAt: '2026-02-12',
  command: '차량 시스템 기획서 작성해줘. 특성/등급 분류와 차량 정보 구조 포함해서',
  badge: 'CORE',
  slides: [
    S.cover({
      product: '슈퍼범퍼즈',
      title: '차량 기획',
      subtitle: '차량 시스템 정의 · 분류 기준 · 정보 구조',
      team: '',
      author: '김기획',
      date: '26.02.12',
    }),
    S.history({
      title: '문서 이력',
      rows: [
        { ver: 'Ver00', date: '26.02.12', page: '-', content: '최초 작성', author: '김기획' },
      ],
    }),
    S.toc({
      title: 'CONTENTS',
      entries: [
        { num: '01', name: '개요', sub: '기획 의도 · 시스템 역할 · 용어 정의 · 성장 루프' },
        { num: '02', name: '시스템 상세', sub: '시스템 정의 · 분류 기준 · 정보 구조 · 상태 규칙' },
        { num: '03', name: 'UI/UX', sub: '화면 설계 (차고지)' },
        { num: '04', name: '데이터 테이블', sub: 'car_master · car_level · enum 등' },
        { num: '05', name: '필요 리소스', sub: '모델링 · 텍스처 · UI 아트' },
      ],
    }),
    S.sectionDivider({
      num: '01',
      title: '개요',
      subtitle: '차량은 슈퍼범퍼즈의 전투 체감과 플레이 전략이 집약되는 플레이어 단위이자, 유저의 선택과 성장이 검증되는 핵심 구조이다.',
    }),
    S.intent({
      section: '01',
      sectionName: '개요',
      title: '기획 의도',
      tagline: '차량 시스템은 전투 체감과 성장 루프 전반의 기준점이 된다. 4가지 축에서 차량 단위 차별화를 설계한다.',
      cards: [
        { idx: '01', head: '전투의 핵심 요소', desc: '속도 · 무게 · 충돌 · 생존이 모두 차량 특성과 스탯에서 결정된다.' },
        { idx: '02', head: '플레이 체감 차별화', desc: '동일한 규칙의 모드라도 차량 선택에 따라 체감과 전략이 달라지도록 설계.' },
        { idx: '03', head: '반복 플레이 동기', desc: '차량 단위 명확한 차별화를 통해 반복 플레이의 동기를 형성한다.' },
        { idx: '04', head: '시스템 구조 기준점', desc: '성장 · 파츠 · BM 모두 차량 기준으로 연결되어 전체 시스템 기준점이 된다.' },
      ],
    }),
    S.terms({
      section: '01',
      sectionName: '개요',
      title: '용어 정의',
      rows: [
        { term: '차량', def: '전투에 투입되는 플레이어 조작 대상이 되는 기본 객체', note: '' },
        { term: '차량 상태', def: '차량의 보유 / 미보유 / 대표 여부로 구분되는 관리 상태', note: '노출 정보 및 사용 가능 여부 판단' },
        { term: '대표 차량', def: '유저가 선택한 전투 진입 기준 차량', note: '보유 차량 중 1대' },
        { term: '보유 차량', def: '유저가 획득하여 사용 가능한 상태의 차량', note: '차량 정보·외형 전체 공개' },
        { term: '미보유 차량', def: '유저가 아직 획득하지 않은 차량', note: '일부 정보만 공개 · 전투 사용 불가' },
        { term: '차량 특성', def: '차량의 플레이 성향을 구분하는 기준', note: '밸런스/파워/스피드/컨트롤/탱커' },
      ],
    }),
    S.sectionDivider({
      num: '02',
      title: '시스템 상세',
      subtitle: '차량의 구조와 분류 체계, 상태 규칙을 정의한다. 차량의 성장(레벨/파츠)은 차량 튜닝 기획서에서 별도 관리.',
    }),
    S.table({
      section: '02',
      sectionName: '시스템 상세',
      title: '차량 특성별 성능 분포',
      columns: [
        { key: 'trait', label: '특성', width: '15%' },
        { key: 'accel', label: '가속도', width: '12%' },
        { key: 'vmax', label: '최대속도', width: '12%' },
        { key: 'handle', label: '핸들링', width: '12%' },
        { key: 'mass', label: '무게', width: '12%' },
        { key: 'hp', label: 'HP', width: '12%' },
        { key: 'desc', label: '설명' },
      ],
      rows: [
        { trait: '밸런스형', accel: '중', vmax: '중', handle: '중', mass: '중', hp: '중', desc: '특성 비교의 기준이 되는 평균적인 전투 구조' },
        { trait: '파워형', accel: '하', vmax: '상', handle: '하', mass: '상', hp: '중', desc: '높은 공격력과 높은 리스크를 동시에 보유' },
        { trait: '스피드형', accel: '상', vmax: '최상', handle: '중', mass: '하', hp: '하', desc: '속도 기반 충돌 강점, 높은 공격 잠재력' },
        { trait: '컨트롤형', accel: '하', vmax: '중', handle: '상', mass: '중', hp: '중', desc: '핸들링·위치 제어로 전투 흐름을 조정' },
        { trait: '탱커형', accel: '하', vmax: '하', handle: '하', mass: '상', hp: '최상', desc: '무게·생존력 기반 충돌 흡수, 방패 역할' },
      ],
    }),
    S.rules({
      section: '02',
      sectionName: '시스템 상세',
      title: '차량 분류 규칙',
      blocks: [
        { head: '공통 규칙', items: ['모든 차량은 1개의 차량 등급을 가진다', '모든 차량은 최소 1개의 차량 특성을 가진다', '차량 특성과 등급은 태생적으로 결정되며 변경 불가'] },
        { head: '등급 (Class)', items: ['COMMON / RARE / EPIC / LEGENDARY 4단계', '등급이 높을수록 기본 성능 수치가 높음', '동일 특성 내에서 등급 차로 성능 격차 발생'] },
        { head: '복수 특성 (예외)', items: ['일부 차량은 등급에 따라 복수의 차량 특성을 가질 수 있음', 'LEGENDARY 등급에서 한정적으로 운용'] },
      ],
    }),
    S.uiDesign({
      section: '03',
      sectionName: 'UI/UX',
      title: '차고지 — 내 차량 화면 설계',
      callouts: [
        { name: '대표 차량 슬롯', desc: '현재 대표 차량을 3D 프리뷰로 노출. 변경 시 즉시 미리보기 갱신.' },
        { name: '보유 차량 그리드', desc: '소유한 차량 카드 리스트. 미보유 차량은 실루엣으로만 노출.' },
        { name: '특성 / 등급 필터', desc: '5종 특성 × 4종 등급 다중 선택 필터.' },
        { name: '튜닝 진입 버튼', desc: '선택된 차량 기준으로 차량 튜닝 화면으로 이동.' },
      ],
    }),
    S.table({
      section: '04',
      sectionName: '데이터 테이블',
      title: 'car_master',
      columns: [
        { key: 'field', label: 'Field', width: '22%' },
        { key: 'type', label: 'Type', width: '14%' },
        { key: 'req', label: 'Req.', width: '10%' },
        { key: 'desc', label: '설명' },
      ],
      rows: [
        { field: 'car_id', type: 'string', req: 'Y', desc: '차량 고유 식별자 (PK)' },
        { field: 'name_key', type: 'string', req: 'Y', desc: '차량 표시 이름 (Localization key)' },
        { field: 'class', type: 'enum', req: 'Y', desc: 'COMMON / RARE / EPIC / LEGENDARY' },
        { field: 'trait', type: 'enum[]', req: 'Y', desc: '특성 (배열, 최소 1개)' },
        { field: 'base_accel', type: 'float', req: 'Y', desc: '기본 가속도' },
        { field: 'base_vmax', type: 'float', req: 'Y', desc: '기본 최대 속도' },
        { field: 'base_handle', type: 'float', req: 'Y', desc: '기본 핸들링' },
        { field: 'base_mass', type: 'float', req: 'Y', desc: '기본 질량' },
        { field: 'base_hp', type: 'int', req: 'Y', desc: '기본 HP' },
        { field: 'model_ref', type: 'string', req: 'Y', desc: '외형 리소스 경로' },
      ],
    }),
    S.resources({
      section: '05',
      sectionName: '필요 리소스',
      title: '필요 리소스 목록',
      categories: [
        { name: '3D 모델링', count: 'x12', items: ['차량 본체 메시 (특성당 2종)', '바퀴 / 휠 메시', '파츠 부착 슬롯 마커', 'LOD 단계별 메시'] },
        { name: '텍스처', count: 'x36', items: ['Albedo / Normal / Metallic', '데칼 (등급 마크)', '디스트레스 텍스처', '브레이크등 emissive map'] },
        { name: 'UI / 2D', count: 'x18', items: ['차량 카드 (특성×등급)', '실루엣 (미보유용)', '특성 아이콘 5종', '등급 배지 4종', '필터 UI'] },
      ],
    }),
  ],
  history: [
    { ts: '26.02.12 09:18', cmd: '차량 시스템 기획서 작성해줘. 특성/등급 분류와 차량 정보 구조 포함해서', summary: '12개 슬라이드 생성 · 분류 표 + UI 설계 + car_master 데이터 + 리소스' },
  ],
  comments: [],
};

/* ---- Sample GDD #3: 전투 ---- */
const GDD_COMBAT = {
  id: 'gdd-combat',
  title: '전투 기획',
  subtitle: '충돌·속도 기반 전투',
  team: '',
  author: '김기획',
  version: 'Ver02',
  updatedAt: '2026-02-11',
  command: '전투 기획서. 컨셉은 속력=힘, 방향별 충돌 메커니즘 포함',
  badge: 'COMBAT',
  slides: [
    S.cover({
      product: '슈퍼범퍼즈',
      title: '전투 기획서',
      subtitle: '속력은 곧 힘이다 — 충돌 기반 캐주얼 전투',
      team: '',
      author: '김기획',
      date: '26.02.11',
    }),
    S.intent({
      section: '01',
      sectionName: '개요',
      title: '전투 개요 및 목표',
      tagline: '복잡한 조작과 전략보다 간편하고 직관적인 전투 양상. 범퍼카 특유의 충돌 재미를 극대화한다.',
      cards: [
        { idx: '01', head: '속력 = 힘', desc: '브레이크 없이 돌진해 상대를 들이받는 단순 직관적 코어.' },
        { idx: '02', head: '캐주얼 지향', desc: '아무 생각 없이 즐기는 범퍼카 컨셉과 캐주얼 게임 특성을 결합.' },
        { idx: '03', head: 'HP 소진 전투', desc: '차량 간 직접 충돌과 아이템 활용으로 상대 HP를 소모시킨다.' },
        { idx: '04', head: '장외 마무리', desc: '주행 불능 상태 또는 충돌 넉백으로 장외(링 아웃) 처리한다.' },
      ],
    }),
    S.terms({
      section: '01',
      sectionName: '개요',
      title: '전투 핵심 변수',
      rows: [
        { term: 'V (현재 속도)', def: '현재 차량의 속도. 충돌 시 충격량의 기준', note: '가속 중: V ≤ Vmax' },
        { term: 'Vmax (최대 속도)', def: '차량별 최대 속도 상한', note: '충돌 시 밀려나는 속도는 Vmax 초과 가능' },
        { term: 'Mass (질량)', def: '차량 무게 (0.5 ~ 2.0). 가/감속과 충돌 안정성에 영향', note: '무거울수록 둔하고 밀리지 않음' },
        { term: '공격 활성화', def: 'V ≥ Vmax × 30% 일 때 공격력 발생', note: '미만 시 데미지 없음' },
        { term: 'Power', def: '베이스 공격력 = V × Mass', note: '계산식의 핵심 입력' },
      ],
    }),
    S.rules({
      section: '02',
      sectionName: '전투',
      title: '데미지 적용 방식',
      blocks: [
        { head: '승자 / 패자 정의', items: ['공격 활성화 vs 공격 활성화 구도에서 속력이 더 높은 쪽이 승자', '승자: 데미지 감소 효과 적용', '패자: 승자의 공격력을 전부 데미지로 입음'] },
        { head: '데미지 공식', items: ['승자: P_loser - (P_winner - P_loser)', '패자: P_winner (전부 적용)', 'P = V × Mass (베이스 공격력)'] },
        { head: '공격 비활성화 (V < Vmax×30%)', items: ['데미지 피해 가하지 못함', '물리 결과(감속·튕김)는 양측 속도/무게에 따라 적용'] },
      ],
    }),
    S.flow({
      section: '02',
      sectionName: '전투',
      title: '충돌 워크플로우',
      nodes: [
        { kind: 'start', label: '충돌 발생 (트리거)' },
        { kind: 'decision', label: '충돌 타입 체크 — 적군 / 아군 / 환경?' },
        { kind: 'process', label: '충돌 위치 체크 (정면/측면/후면)' },
        { kind: 'process', label: '공격 활성화 상태 체크' },
        { kind: 'process', label: '계산 적용 (서버) — 데미지 / 예외 처리' },
        { kind: 'end', label: 'HP 갱신 → 후속 FLOW' },
      ],
    }),
  ],
  history: [
    { ts: '26.02.03 09:00', cmd: '전투 기획서 작성. 충돌과 속도가 핵심', summary: '최초 작성 · 5 슬라이드' },
    { ts: '26.02.11 14:32', cmd: '실시간 충돌 체크가 아니라 충돌 시에만 체크로 변경', summary: '플로우 차트 갱신' },
  ],
  comments: [
    { who: '팀원 C', at: '26.02.10 11:05', body: '공격 비활성화 상태에서 이동 제어권 박탈 여부 명시 필요합니다.', ref: 'Slide 3 · 데미지 방식' },
  ],
};

/* ---- Empty starter (for new document) ---- */
const GDD_BLANK_TEMPLATE = (cmd) => ({
  id: 'gdd-' + uid(),
  title: '제목 없는 기획서',
  subtitle: '',
  team: '',
  author: '김기획',
  version: 'Ver00',
  updatedAt: new Date().toISOString().slice(0, 10),
  command: cmd || '',
  badge: 'NEW',
  slides: [
    S.cover({
      product: '슈퍼범퍼즈',
      title: '제목 없는 기획서',
      subtitle: '부제목',
      team: '',
      author: '김기획',
      date: new Date().toISOString().slice(2, 10).replace(/-/g, '.'),
    }),
  ],
  history: [],
  comments: [],
});

/* ---- Quick chip suggestions ---- */
const CHIP_SUGGESTIONS = [
  '슈퍼럼블 모드 기획서 작성해줘',
  '튜토리얼 플로우 기획서 만들어줘',
  '패스권 BM 기획서 작성',
  '아이템/기믹 기획서',
  '사운드 설계 기획서',
];

/* ---- Demo-mode template generator (no AI, instant) ---- */
function generateDemoGdd(command) {
  // Try to infer title from command
  const cleaned = (command || '').trim();
  // Strip common suffixes
  const titleHint = cleaned
    .replace(/(을|를|이|가)?\s*(작성|만들|생성)\s*(해줘|해주세요|해|줘)?\s*\.?$/, '')
    .replace(/\s*기획서.*$/, ' 기획')
    .trim() || '신규 시스템 기획';
  const fullTitle = titleHint.endsWith('기획') ? titleHint + '서' : titleHint + ' 기획서';

  const id = 'gdd-' + uid();
  return {
    id,
    title: fullTitle,
    subtitle: 'AI 생성 초안',
    team: '',
    author: '김기획',
    version: 'Ver00',
    updatedAt: new Date().toISOString().slice(0, 10),
    command: cleaned,
    badge: 'DRAFT',
    slides: [
      S.cover({
        product: '슈퍼범퍼즈',
        title: fullTitle,
        subtitle: '시스템 정의 · 규칙 · 데이터',
        team: '',
        author: '김기획',
        date: new Date().toISOString().slice(2, 10).replace(/-/g, '.'),
      }),
      S.history({
        title: '문서 이력',
        rows: [
          { ver: 'Ver00', date: new Date().toISOString().slice(2, 10).replace(/-/g, '.'), page: '-', content: '최초 작성 (AI 생성)', author: '김기획' },
        ],
      }),
      S.toc({
        title: 'CONTENTS',
        entries: [
          { num: '01', name: '개요', sub: '기획 의도 · 시스템 역할 · 용어 정의' },
          { num: '02', name: '시스템 상세', sub: '규칙 정의 · 상태 구조' },
          { num: '03', name: '플로우 차트', sub: '주요 동작 흐름' },
          { num: '04', name: '데이터 테이블', sub: 'DB 스키마' },
          { num: '05', name: '필요 리소스', sub: '아트 / UI 리소스' },
        ],
      }),
      S.sectionDivider({
        num: '01',
        title: '개요',
        subtitle: '본 시스템이 게임 전반에서 수행하는 역할과 기획 의도를 정의한다.',
      }),
      S.intent({
        section: '01',
        sectionName: '개요',
        title: '기획 의도',
        tagline: '본 시스템은 플레이어 경험의 핵심 축 중 하나로, 다음 네 가지 의도를 기반으로 설계된다.',
        cards: [
          { idx: '01', head: '플레이어 경험 차별화', desc: '동일 상황에서도 선택과 결과가 달라지도록 설계하여 반복 플레이 동기를 형성한다.' },
          { idx: '02', head: '직관적 규칙 구조', desc: '학습 곡선을 낮추고, 한 화면 내에서 의도를 파악할 수 있는 규칙으로 구성한다.' },
          { idx: '03', head: '시스템 확장성', desc: '단일 모드/콘텐츠에 종속되지 않고, 다른 시스템과의 결합을 전제로 설계한다.' },
          { idx: '04', head: '운영 부담 최소화', desc: '데이터 테이블 단위 조정만으로 밸런스 변경이 가능하도록 분리한다.' },
        ],
      }),
      S.rules({
        section: '02',
        sectionName: '시스템 상세',
        title: '핵심 규칙',
        blocks: [
          { head: '기본 규칙', items: ['진입 조건은 단일 화면 내 1회 입력으로 충족된다', '상태 전이는 명확한 트리거 1개로만 발생한다', '동시 발생 시 우선순위는 상수 테이블로 정의한다'] },
          { head: '예외 처리', items: ['네트워크 단절 시 상태는 마지막 안정 상태로 복원', '서버/클라 상태 불일치 시 서버 기준 우선'] },
        ],
      }),
      S.resources({
        section: '05',
        sectionName: '필요 리소스',
        title: '필요 리소스 목록',
        categories: [
          { name: 'UI / 2D', count: 'x8', items: ['진입 버튼 · 패널 배경', '상태 아이콘 (3종)', '결과 화면 모달', '튜토리얼 가이드 일러스트'] },
          { name: '사운드', count: 'x4', items: ['진입 SFX', '전이 SFX', '확정/취소 SFX', 'BGM stem'] },
          { name: '데이터', count: 'x2', items: ['상수 테이블', 'enum 정의'] },
        ],
      }),
    ],
    history: [
      { ts: new Date().toISOString().slice(0, 16).replace('T', ' '), cmd: cleaned, summary: '데모 템플릿 기반 7 슬라이드 생성' },
    ],
    comments: [],
  };
}

/* ---- AI prompt builder ---- */
function buildAiPrompt(command, existingTitles, attachments, context) {
  const textBlocks = (attachments || []).filter(a => a.kind === 'text').map((a, i) => `\n[첨부 텍스트 ${i+1}: ${a.name}]\n${a.value.slice(0, 2000)}`).join('\n');
  const imageNote = (attachments || []).filter(a => a.kind === 'image').length > 0
    ? `\n참고: ${(attachments || []).filter(a => a.kind === 'image').length}개의 참고 이미지가 함께 제공됩니다. 이미지에서 관찰한 UI/플로우/구조/색감을 적극 반영하세요.`
    : '';
  const contextBlock = renderContextBlock(context);

  // 주제에서 도메인을 분류하여 해당 전문가 페르소나를 추가로 결합
  const planTitle = context?.plan?.title || '';
  const domain = classifyDomain(command, planTitle);
  const domainPersona = DOMAIN_PERSONAS[domain] || '';
  const DOMAIN_LABELS = {
    core: '코어 게임플레이',
    system: '시스템/인프라',
    content: '컨텐츠/라이브 운영',
    bm: 'BM/이코노미',
    sound: '사운드',
    uiux: 'UI/UX',
    tutorial: '튜토리얼/온보딩',
    art: '아트/비주얼',
  };

  return `${SENIOR_PERSONA}

${domainPersona}

# 임무
당신은 30년차 풀스택 게임 메이커이자 위의 **${DOMAIN_LABELS[domain]}** 도메인 마스터입니다.
아래 요청에 대해 실무 팀이 그대로 받아 즉시 개발에 착수할 수 있는 깊이의 게임 기획서(GDD)를 한국어로 작성하라. **이 문서 하나만으로 개발이 완결되어야 한다.**
이 기획서는 **${DOMAIN_LABELS[domain]}** 도메인에 속하므로, 해당 도메인의 전문가 체크리스트와 표준 산출물 형식을 반드시 반영하라.

요청: "${command}"
${textBlocks}
${imageNote}

${contextBlock}

기존 기획서 목록: ${(existingTitles || []).join(', ') || '(없음)'}

# 출력 형식
다음 형식의 JSON만 출력하세요 (코드블록 없이 순수 JSON):
{
  "title": "기획서 제목",
  "subtitle": "한 줄 부제 — 핵심 가치를 명료하게",
  "badge": "MVP|CORE|DRAFT|SYSTEM|... 중 하나의 짧은 태그",
  "coverImagePrompt": "<영문, 60단어 이내. 게임 무드/장르/주요 비주얼 요소를 담은 표지 배경용 묘사. 조명·구도·스타일 포함>",
  "slides": [
    { "type": "cover", "data": { "product": "...", "title": "...", "subtitle": "...", "team": "...", "author": "김기획", "date": "YY.MM.DD" } },
    { "type": "history", "data": { "title": "문서 이력", "rows": [{"ver":"Ver00","date":"...","page":"-","content":"최초 작성","author":"김기획"}] } },
    { "type": "toc", "data": { "title": "CONTENTS", "entries": [{"num":"01","name":"개요","sub":"섹션 요약"}] } },  // ⚠ TOC entries 에 "표지"/"문서 이력"/"목차" 등 front-matter 슬라이드는 절대 포함하지 말 것. 본문 섹션부터 나열.
    { "type": "section-divider", "data": { "num": "01", "title": "섹션 제목", "subtitle": "섹션의 핵심 메시지 1-2문장", "imagePrompt": "<영문, 섹션을 시각화하는 컨셉 아트 한 컷. 분위기·소재·구도 포함. 빈 문자열도 가능하나 가급적 채울 것>" } },
    { "type": "image-embed", "data": { "section":"03", "sectionName":"참고 이미지", "title":"이미지 제목", "caption":"이 이미지가 보여주는 핵심 요소·참조 의도 한 줄", "imagePrompt":"<영문, 핵심 시각 요소를 묘사하는 참고 이미지 프롬프트. 카드/캐릭터/장면/UI 무드보드 등>" } },
    { "type": "intent", "data": { "section":"01", "sectionName":"개요", "title":"기획 의도", "tagline":"기획 전체를 관통하는 한 줄. 측정 가능하거나 검증 가능한 형태로", "cards":[{"idx":"01","head":"카드 제목(8자 내)","desc":"의도 + 구체적 결과 지표 1개 (예: 신규 유저 D1 리텐션 +5%p)"}] } },
    { "type": "terms", "data": { "section":"01", "sectionName":"개요", "title":"용어 정의", "rows":[{"term":"용어","def":"역할/제약/단위까지 포함한 정의","note":"전이 조건/예외/관련 시스템"}] } },
    { "type": "rules", "data": { "section":"02", "sectionName":"시스템 상세", "title":"규칙 제목", "blocks":[{"head":"블록 제목","items":["**핵심 키워드 굵게** + 정적 규칙·상수·밸런싱 값. 절차적 로직은 여기 두지 말고 flow로 빼라"]}] } },
    { "type": "data-table", "data": { "section":"04", "sectionName":"데이터 테이블", "title":"테이블명 (예: car_master)", "columns":[{"key":"field","label":"Field","width":"22%"},{"key":"type","label":"Type","width":"14%"},{"key":"req","label":"Req.","width":"10%"},{"key":"desc","label":"설명/제약/단위/예시"}], "rows":[{"field":"실제_필드명_1","type":"uuid","req":"Y","desc":"실제 설명 + 제약 + 예시값. rows는 반드시 8개 이상 채워라"},{"field":"실제_필드명_2","type":"int","req":"Y","desc":"..."}] } },
    { "type": "flow", "data": { "section":"02", "sectionName":"플로우 차트", "title":"...", "direction":"vertical|horizontal|grid", "lines": 1, "nodes":[{"kind":"start|process|decision|end","label":"단계 라벨 + 조건/시간 등 핵심 메타"}] } },
    { "type": "diagram", "data": { "section":"02", "sectionName":"시스템 구조", "title":"...", "nodes":[{"id":"n1","label":"...","sub":"영문 약어/Tech 라벨","kind":"start|process|decision|end|service|data","col":0,"row":0}], "edges":[{"from":"n1","to":"n2","label":"호출/이벤트 이름"}] } },
    { "type": "sequence-diagram", "data": { "section":"02", "sectionName":"시퀀스 다이어그램", "title":"...", "participants":[{"id":"p1","name":"클라이언트","kind":"actor|system|service|data"}], "messages":[{"from":"p1","to":"p2","label":"호출/이벤트 시그니처","kind":"sync|async|return"}] } },
    { "type": "class-diagram", "data": { "section":"02", "sectionName":"클래스 다이어그램", "title":"...", "classes":[{"id":"c1","name":"Class","stereotype":"<<entity>>|<<interface>>|","attrs":["+field: Type"],"methods":["+method(): Type"],"col":0,"row":0}], "relations":[{"from":"c1","to":"c2","kind":"inherit|implement|compose|aggregate|assoc|depend","label":"1..*"}] } },
    { "type": "ui-design", "data": { "section":"03", "sectionName":"UI/UX", "title":"화면명 + 화면 ID", "imagePrompt":"<영문, UI 목업 이미지 프롬프트. 게임 화면 레이아웃을 구체적으로 묘사>", "callouts":[{"name":"영역명","desc":"역할 + 상호작용 + 상태 변화 트리거","x":50,"y":50}] } },
    { "type": "resources", "data": { "section":"05", "sectionName":"필요 리소스", "title":"필요 리소스 목록", "categories":[{
      "name":"카테고리(예: UI / 사운드 / 모델 / 텍스처 / 이펙트 / 데이터)",
      "count":"개수 (예: x12)",
      "guideline":"이 카테고리 전체에 적용되는 **가이드라인**. 해상도·포맷·네이밍 규칙·톤앤매너·컬러 코드 등을 한국어로 3~5줄로 구체 명시. 마크다운(**굵게**, \`code\`) 사용 가능.",
      "items":[{
        "name":"에셋명 (예: HUD HP 게이지)",
        "spec":"사양 (예: 1080×24, PNG-24, 9-slice. 색상 #FF3030 → #88DFB0 그라데이션)",
        "example":"파일명·참고 (예: ui/hud/hp_bar.png · 레퍼런스: Apex Legends HP 게이지)"
      }]
    }]} },
    { "type": "balance-table", "data": { "section":"04", "sectionName":"밸런싱", "title":"수치 밸런싱 공식", "formula":"\`damage = base × (1 + str/100) × elem_mod\`", "vars":[{"name":"base","formula":"카드 등급별 기본값","range":"50~200","defaultValue":"100","sensitivity":"±10% → 평균 매치 시간 ±15초"}], "curve":{"x":[1,2,3,4,5,6,7,8,9,10],"y":[100,220,380,580,820,1100,1420,1780,2180,2620],"xLabel":"레벨","yLabel":"강화 비용"} } },
    { "type": "state-machine", "data": { "section":"02", "sectionName":"상태 머신", "title":"플레이어 상태 머신", "states":[{"id":"s1","name":"IDLE","kind":"initial","onEnter":"\`enableInput()\`","onExit":"\`disableInput()\`","invariants":["\`input_locked == false\`"]}], "transitions":[{"from":"s1","to":"s2","event":"CAST_INPUT","guard":"\`mana >= cost\`","action":"\`consumeMana(cost)\`"}] } },
    { "type": "behavior-tree", "data": { "section":"02", "sectionName":"AI 행동 트리", "title":"몬스터 AI 행동 트리", "rootId":"bt1", "nodes":[
      {"id":"bt1","kind":"selector","name":"Root Selector","parentId":null},
      {"id":"bt2","kind":"sequence","name":"공격 시퀀스","parentId":"bt1"},
      {"id":"bt3","kind":"condition","name":"\`Player_In_Attack_Range\`","parentId":"bt2"},
      {"id":"bt4","kind":"action","name":"\`Attack(player)\`","parentId":"bt2","note":"쿨다운 1.5s"}
    ] } },
    { "type": "api-contract", "data": { "section":"02", "sectionName":"API 계약", "title":"POST /api/match/create", "endpoint":"/api/match/create", "method":"POST", "auth":"bearer", "slaMs":200, "request":"{\\n  \\"userId\\": \\"uuid\\",\\n  \\"mode\\": \\"casual|ranked\\"\\n}", "response":"{\\n  \\"matchId\\": \\"uuid\\",\\n  \\"gameServer\\": \\"host:port\\"\\n}", "errors":[{"code":"400","message":"INVALID_MODE","when":"mode 가 enum 외 값"}], "idempotencyKey":"\`X-Idempotency-Key\` 헤더 권장. 24h TTL.", "notes":"" } },
    { "type": "acceptance-criteria", "data": { "section":"03", "sectionName":"수락 기준", "title":"매칭 시작 수락 기준", "userStory":{"as":"신규 유저","want":"첫 매치를 빠르게 시작","soThat":"D1 리텐션 60% 유지"}, "criteria":[{"id":"AC-1","given":"메인 로비 진입","when":"\`매칭\` 탭","then":"3초 이내 매칭 모달 표시","edgeCases":["네트워크 단절 시 5초 후 재시도"]}] } },
    { "type": "telemetry", "data": { "section":"04", "sectionName":"텔레메트리", "title":"매칭 이벤트", "events":[{"name":"match_button_tapped","when":"매칭 버튼 탭","props":[{"key":"mode","type":"enum","required":true,"note":"casual/ranked"}],"kpi":"매칭 시도율"}], "funnels":[{"name":"매칭 펀넬","steps":["match_button_tapped","match_found"],"goal":"전환율 95%"}] } },
    { "type": "risk-register", "data": { "section":"06", "sectionName":"위험 등기부", "title":"런칭 전 위험", "risks":[{"id":"R-1","title":"매칭 서버 부하","impact":5,"likelihood":3,"mitigation":"오토스케일 + 봇 매치 폴백","owner":"서버팀","status":"open"}] } },
    { "type": "roadmap", "data": { "section":"06", "sectionName":"로드맵", "title":"런칭 로드맵", "phases":[{"name":"MVP","start":"2026.01","end":"2026.03","deliverables":["코어 매치","4개 캐릭터"],"dependsOn":[]}] } }
  ]
}

# 분량 및 구성 (시니어 표준 — 개발 가능 수준)
- **슬라이드 총 22~32장**. 다음 골격을 반드시 포함:
  - 표지/이력/목차 (3장)
  - [개요 섹션] divider + intent + terms (3장)
  - [시스템 상세 섹션] divider + flow + sequence-diagram + diagram + **state-machine** + class-diagram + rules 보조 (6~8장)
  - [데이터/밸런싱 섹션] divider + data-table × 2 + **balance-table** (4장)
  - [API/텔레메트리 섹션] divider + **api-contract** × 2~3 + **telemetry** (4~5장)
  - [품질 섹션] divider + **acceptance-criteria** × 2 (3장)
  - [UI 섹션] divider + ui-design × 2 + image-embed × 3 (6장)
  - [관리 섹션] divider + **risk-register** + **roadmap** + resources (4장)
- 섹션마다 section-divider로 구분하고, **section-divider 의 imagePrompt 는 모두 채워서 섹션마다 컨셉 아트를 둔다 (해석을 도울 시각적 앵커).**
- **분량 기준 (각 슬라이드 최소량)**:
  - \`intent.cards\` = **4~6개** (의도별 측정 지표 포함)
  - \`terms.rows\` = **8~12개** (시스템 전반 용어 망라)
  - \`rules.blocks\` = **2~3개** / 각 block items = **4~6개** (정적 규칙/상수만)
  - \`data-table.rows\` = **8~16개** (스키마 전체 필드 포함, 절대 비우지 말 것)
  - \`flow.nodes\` = **6~12개** (decision 분기 2개 이상)
  - \`diagram.nodes\` = **5~9개**, \`diagram.edges\` = **6~12개**
  - \`sequence-diagram.messages\` = **8~14개**
  - \`class-diagram.classes\` = **5~8개**, \`relations\` = **5~10개**
  - \`ui-design.callouts\` = **5~8개**
  - \`resources.categories\` = **4~5개** / 각 category items = **5~8개** (각 item 에 spec+example 모두 채움)
  - \`image-embed\` 슬라이드 = **3~5장** (카드 일러스트·캐릭터·장면·아이콘 세트·무드보드)

# Markdown 사용 (rules.items / intent.desc·head / terms.def·note / data-table.desc / resources.* 모든 텍스트 필드)
앱이 인라인 마크다운을 렌더링한다. **적극적으로 굵게/코드/리스트를 활용하여 가독성을 높여라.** 지원 토큰:
- \`**굵게**\` — 핵심 키워드·임계치·시스템명 강조
- \`*이탤릭*\` 또는 \`_이탤릭_\` — 부차적 강조·메타정보
- \`\\\`코드\\\`\` (백틱) — 식별자·필드명·상수·이벤트명 (예: \\\`PlayerState.dead\\\`, \\\`session.create\\\`)
- \`~~취소선~~\` — 폐기/대체 항목
- \`[텍스트](URL)\` — 참조 링크
- 줄머리 \`- \` 또는 \`* \` 또는 \`1. \` — 자동으로 불릿/번호 마커로 렌더링
- 줄바꿈은 그대로 보존됨

**규칙**:
- rules.blocks.items 의 각 항목은 \`**키워드**: 설명 \\\`상수값\\\` \` 형태로 시작.
- terms.rows.def 는 \`**역할**: ... \\\`type\\\`, 단위/제약\` 형태.
- data-table.desc 는 \`타입+범위+예시. 외래키는 \\\`FK→table.field\\\`\` 형태.

# ⚠ 순서·절차·상태 전이는 텍스트로 나열하지 말 것
"1단계 → 2단계 → 3단계", "조건 X 일 때 동작 Y", "상태 전이" 같은 패턴이 rules.items 나 intent.desc 에 텍스트로 들어가는 순간 → **반드시 별도의 flow 또는 sequence-diagram 슬라이드로 분리**한다. rules 는 분기 없는 정적 상수만 담는 용도.

# 슬라이드 선택 규칙 (가장 중요)
**프로세스/로직/조건 분기는 텍스트가 아니라 다이어그램으로 그려야 한다. rules 슬라이드를 텍스트 로직 덤프로 사용하지 말 것.** 다음 매핑을 따른다:

| 표현 대상 | 사용할 슬라이드 타입 |
|---|---|
| 절차적 단계·조건 분기·상태 전이 (예: 카드 강화 흐름, 매칭 → 로딩 → 게임 → 결과) | **flow** (분기는 decision 노드) |
| 시스템 간 시간 순서가 있는 호출·응답 (예: 클라/서버/DB 사이의 요청-응답 흐름) | **sequence-diagram** |
| 컴포넌트·서비스·데이터 저장소 사이의 정적 의존 관계 | **diagram** |
| **객체·엔티티 구조와 그 관계 (상속/구현/컴포지션/집합/연관/의존)** — 캐릭터/아이템/카드 등 OOP 모델이 있는 시스템은 거의 항상 1장 필요 | **class-diagram** |
| 정적 규칙·상수·밸런싱 값·정책 (예: "강화 성공률 100%", "최소 100 파편") | **rules** (정적 항목만, 분기 로직 금지) |
| 키 비주얼·카드 일러스트·캐릭터·장면·무드보드 | **image-embed** (imagePrompt 채우기) |
| 화면 레이아웃 + 영역 콜아웃 | **ui-design** (imagePrompt 채우기) |

**⚠ class-diagram 적극 활용**: GDD 에 캐릭터/유닛/카드/아이템/스킬/Buff/세션/매치 등 OOP 모델이 등장하면 **반드시 1장 이상 class-diagram 슬라이드 포함**. 데이터 테이블만으로는 클래스 간 관계(상속/컴포지션/연관)를 표현할 수 없다. data-table 과 class-diagram 은 보완 관계 — 함께 사용.

⚠ **금지 패턴**: rules.blocks.items 안에 "[조건] → [동작] → [엣지케이스]" 같은 절차적 분기를 텍스트로 길게 나열하지 말 것. 이런 절차는 **반드시 flow 또는 sequence-diagram 슬라이드로 분리**한다. rules는 그 절차에 사용되는 *정적 상수/임계치*만 담는다 (예: "강화 성공률 100%", "재화 카드 1장 = 강화 1회").

# 슬라이드별 시니어 품질 기준
- **intent.cards**: 각 카드의 desc 끝에 측정 가능한 성공 지표 1개 첨부 (예: "신규 유저 첫 매치 완주율 70% 이상", "평균 세션 길이 8분"). 추상어("재미있게", "직관적으로") 금지.
- **terms.rows**: term은 영문 약어 가능, def는 역할/단위/제약을 30~60자, note는 상태 전이 조건이나 다른 용어와의 관계를 명시.
- **rules.blocks**: items 는 정적 규칙/상수/임계치만 (예: "최대 레벨: 10", "강화 비용: 파편 ×(현재레벨×100)+카드 1장"). 절차적 로직은 flow 슬라이드로 보낼 것. blocks 는 2~3개로 제한하고, 동일 시스템의 절차는 별도의 flow/sequence-diagram 슬라이드로 표현한다.
- **data-table**: 실제 동작 가능한 스키마. field 영문 snake_case, type 명확(uuid/int/float/enum/string/datetime/json), req에 Y/N, desc에 단위·범위·예시값·외래키 표시 (예: "0~9999, FK→user.user_id"). **⚠ 절대 rows를 비우지 말 것 — columns만 정의하고 rows를 빈 배열로 두는 실수 금지. 최소 6개 이상의 실제 예시 row를 채워서 출력하라.** 컬럼 키와 row 키는 정확히 일치해야 한다 (예: columns에 key:"field"가 있으면 rows의 각 객체에 "field" 키가 반드시 있어야 함).
- **flow.nodes**: 표준 순서도 도형 규칙을 반드시 따른다.
  - 첫 노드는 \`kind: "start"\`, 마지막 노드는 \`kind: "end"\` (각각 알약/pill 모양으로 렌더).
  - 분기(if/else, true/false, 성공/실패) 가 있으면 \`kind: "decision"\` (다이아몬드 모양). label 은 반드시 **물음표로 끝나는 짧은 조건문** ("HP ≤ 0 ?", "타이머 만료?", "재화 보유?").
  - decision 다음 두 노드의 label 시작부에 \`예 → \` 또는 \`아니오 → \` 를 명시해 가지를 구분 (예: "예 → 사망 처리", "아니오 → 다음 단계 진행").
  - 일반 처리 단계는 \`kind: "process"\`. 외부 서비스 호출이면 \`kind: "service"\`, DB/저장소면 \`kind: "data"\`.
  - 정상 흐름 외에 **decision 2개 이상**과 실패/취소/네트워크 단절 경로 1개 이상.
  - **금지**: decision 노드를 일반 직사각형 라벨로 만들지 말 것. 분기점이 있으면 반드시 decision.
- **flow.direction / flow.lines**: 노드 수에 맞춰 두 필드를 함께 출력.
  - \`direction\`: \`vertical\` | \`horizontal\` | \`grid\`. 단조로운 vertical 만 쓰지 말 것. 6단계 이상은 horizontal 또는 grid 권장.
  - \`lines\`: 1 또는 2. 가로/세로 한 줄에 들어가는 노드 수가 너무 많으면(8개 이상) \`lines: 2\` 로 두 줄에 나누어 가독성 확보.
  - 추천: 4~6 단계 = vertical/1, 6~8 단계 = horizontal/1, 9~12 단계 = horizontal/2 또는 vertical/2, 13개 이상 = grid.
- **diagram**: 서버/클라/DB/외부 서비스의 역할 분리를 명확히. edges 라벨은 실제 호출명이나 이벤트명에 가깝게 ("session.create", "match.end").
- **sequence-diagram**: 참여자 3~6명. 호출은 sync/async/return 구분. 최소 1개의 return 메시지 포함.
- **class-diagram**: classes 5~8개, relations 5~10개. 각 class 에:
  - \`name\`: PascalCase 영문 클래스명 (예: \`Player\`, \`Card\`, \`InventorySlot\`)
  - \`stereotype\`: <<entity>> | <<interface>> | <<abstract>> | <<enum>> | <<service>> 중 적절히
  - \`attrs\`: 가시성 prefix(+/-/#) + name + ":" + 타입. 예: \`-hp: int\`, \`+name: string\`, \`#level: int\`
  - \`methods\`: 가시성 prefix + name + 인자 + ":" + 반환타입. 예: \`+takeDamage(amount: int): void\`, \`+equip(item: Item): bool\`
  - \`col\`: 0~3, \`row\`: 0+ — 한 화면에 모이도록 배치
  - relations: kind = inherit(상속) / implement(구현) / compose(▣ 컴포지션) / aggregate(◇ 집합) / assoc(연관) / depend(점선 의존). label 에 multiplicity (\`1\`, \`1..*\`, \`0..1\`) 명시.
- **ui-design.callouts**: 각 callout이 트리거 상호작용("탭 시", "롱프레스 시")과 그 결과 상태 변화를 함께 기술. 4~6개 권장. **x, y는 0~100 정수 (이미지 안에서의 퍼센트 위치)**. imagePrompt가 묘사하는 화면 레이아웃과 일치하는 위치를 골라야 한다 (예: 좌상단 미니맵=10,15 / 중앙 크로스헤어=50,50 / 우상단 자원=85,12 / 하단 액션바=50,88). callout 순서는 사용자가 시선을 옮길 자연스러운 순서로.
- **section-divider.imagePrompt**: 각 섹션의 분위기를 한 컷으로 압축한 영문 컨셉 아트. 배경에 깔리므로 어두운 톤·구도가 단순하면 좋다. 비어 있어도 되지만 가급적 채워라.
- **image-embed**: 텍스트로만 설명하면 모호한 시각 요소(카드 디자인 무드, 캐릭터 룩, 게임 장면, 아이콘 세트)에 한해 사용. imagePrompt 는 카메라 앵글·조명·재질·스타일 키워드 포함. caption 은 한국어로, "왜 이 이미지를 참조 자료로 두었는지"를 한 줄로 적는다.
- **balance-table** (Phase 1 — 개발 가능 수준 필수): vars 6~12개. 각 var 에 \`name\` (snake_case), \`formula\` (마크다운 코드로 공식), \`range\` (예: "0~9999"), \`defaultValue\`, \`sensitivity\` ("±10% → 매치 시간 ±15초" 같은 영향 분석). \`curve\` 는 레벨/등급별 수치 곡선이 필요한 경우 x[1..N], y[...] 배열로 채움.
- **state-machine** (Phase 1 — 필수): states 4~8개. 각 state 에 \`id\` (snake), \`name\` (UPPER_CASE), \`kind\` (initial/normal/final/error 중 1), \`onEnter\`/\`onExit\` 동작, \`invariants\` 배열 (해당 상태에서 항상 참인 조건). transitions 6~12개 — from/event/guard/to/action 모두 명시. **모든 final 상태로 들어오는 transition 1개 이상.**
- **behavior-tree** (BT — AI/몬스터/봇 의사결정이 있는 시스템에 필수): \`nodes\` 8~16개, parentId 로 트리 구성. \`rootId\` 명시. 각 node 의 \`kind\` 는 다음 중 하나:
  - \`selector\` (?) — 자식을 순서대로 시도, 하나라도 성공 시 성공
  - \`sequence\` (→) — 자식 순차 실행, 하나라도 실패 시 실패
  - \`parallel\` (||) — 모든 자식 동시 실행 (성공 조건 명시 권장)
  - \`decorator\` — 자식 1개 결과 가공 (\`decoratorType\`: Inverter / Repeater(N) / Timeout(ms) / Cooldown 등)
  - \`condition\` ([?]) — 리프, 영문 PascalCase 또는 백틱 코드 (예: \`Player_In_Range\`, \`HasAmmo\`)
  - \`action\` ([▶]) — 리프, 동사형 영문 (예: \`Attack(target)\`, \`MoveTo(point)\`, \`PlayAnim("howl")\`)
  - 리프(condition/action) 외에는 반드시 children 1개 이상. note 필드는 쿨다운·우선순위·블랙보드 키 등 메타 정보.
- **api-contract** (Phase 1 — 시스템 통신 있는 GDD 필수): 각 슬라이드는 1개 endpoint 만 다룸. \`method\` (HTTP), \`endpoint\`, \`auth\`, \`slaMs\`, \`request\`/\`response\` 는 실제 JSON 스키마 문자열 (필드/타입 명확), \`errors\` 3~6개 (code+message+when), \`idempotencyKey\` 정책. **여러 API 가 있으면 여러 슬라이드로 분리.**
- **acceptance-criteria** (Phase 1 — 핵심 기능 필수): \`userStory\` (As/I want/So that), \`criteria\` 3~6개. 각 criterion 은 Given/When/Then + \`edgeCases\` 2~4개. **테스트 자동화로 그대로 옮길 수 있는 수준의 구체성.**
- **telemetry** (Phase 1 — 라이브 운영 필수): \`events\` 5~10개. 각 event 에 \`name\` (snake), \`when\` (정확한 발생 시점), \`props\` (key/type/required/note), \`kpi\` (이 이벤트가 추적하는 KPI). \`funnels\` 1~3개 (이벤트 시퀀스 + 목표 전환율).
- **risk-register** (Phase 1 — 모든 GDD 필수): \`risks\` 4~8개. 각 risk 에 \`id\`, \`title\`, \`impact\` (1~5), \`likelihood\` (1~5), \`mitigation\` (구체 완화책), \`owner\` (담당자), \`status\` (open/mitigated/accepted/closed). **impact×likelihood ≥ 16 인 risk 는 모두 mitigation 명시.**
- **roadmap** (Phase 1 — 모든 GDD 필수): \`phases\` 4~6개. 각 phase 에 \`name\`, \`start\`/\`end\` (YYYY.MM 형식), \`deliverables\` 3~6개, \`dependsOn\` (선행 phase 이름 배열). MVP → 알파 → 베타 → 소프트런칭 → 글로벌 같은 단계화 권장.
- **resources**: 다음 3계층 모두 채워라 — (a) 카테고리 \`guideline\` (해상도·포맷·네이밍·톤앤매너·컬러 가이드 등 카테고리 전체 규칙), (b) 각 item의 \`name\` (에셋명), (c) 각 item의 \`spec\` (정확한 사양: 해상도 / tris / 포맷 / 길이 / 컬러스페이스 등), (d) 각 item의 \`example\` (실제 파일명·참고 작품·레퍼런스 링크). 단순 이름 나열 금지. 예시 (JSON):
  {
    "name": "UI", "count": "x14",
    "guideline": "**해상도**: 1080×1920 baseline + @2x/@3x · **포맷**: PNG-24 (배경 투명) · **네이밍**: ui/<scope>/<name>.png 소문자 + 언더스코어 · **컬러**: 메인 #88DFB0 / 강조 #F5D94F. 9-slice 필요 시 metadata json 동봉.",
    "items": [
      { "name": "HUD HP 게이지", "spec": "1080×24, PNG-24, 9-slice (좌우 각 24px)", "example": "ui/hud/hp_bar.png — 참고: Apex Legends HUD" }
    ]
  }
- **모든 imagePrompt**: 반드시 영문, 구체적 시각 묘사. 카메라 앵글·조명·재질·분위기 포함. 한국어 임시 텍스트 금지.
- **⚠ imagePrompt 누락 절대 금지**: cover / section-divider / ui-design / image-embed 4가지 슬라이드 타입의 imagePrompt 는 반드시 채워라. 비어있으면 자동 폴백되지만 일반 묘사가 되어 품질이 떨어지므로 명시 권장. 영문 30~80 단어. nano-banana 가 16:9 컨셉 아트로 잘 생성할 수 있게 명료한 시각 키워드(주제 / 분위기 / 조명 / 색감 / 스타일) 모두 포함.

# 운영 관점 반영
- 네트워크 단절·재접속·서버 장애 시 동작이 관련된 시스템이면 rules에 1블록 이상 할당.
- 어드민/CS 노출 필요 데이터, 로그 수집 포인트는 data-table의 note 컬럼에 표기.
- BM·재화·확률 관련 내용이면 확률값과 페일세이프(천장/피티) 명시.

# 출력 규칙
- JSON 외 텍스트 절대 금지. 코드블록 펜스(\`\`\`) 금지.
- 모든 필드 값은 한국어 작성 (단, 영문 약어/필드명/imagePrompt 제외).
- "TBD", "추후 정의", "협의 필요" 등 미정 표현 금지. 합리적 디폴트를 적어 결정 비용을 낮춘다.
- **빈 배열 절대 금지**: rows, cards, blocks, entries, items, callouts, categories, nodes, edges 등 모든 배열 필드는 명시된 최소 개수 이상으로 반드시 채워라. 표만 그리고 데이터를 비워두는 출력은 즉시 실패로 간주된다.
- **컬럼-row 키 일치**: data-table의 columns에 정의한 key는 rows의 각 객체 키와 정확히 매핑되어야 한다.
- 출력 토큰이 모자라 보이면 슬라이드 수를 줄여서라도 모든 배열의 내용을 채워라. 빈 표보다 슬라이드 수 감소가 낫다.`;
}

/* === Resilient AI JSON parser ===
 * AI 응답이 잘리거나 trailing comma/잘못된 escape가 있을 때도 최대한 복구 시도.
 * 사용: window.parseAiJson(raw) → object | throws
 */
function parseAiJson(raw) {
  if (raw == null) throw new Error('AI 응답이 비어있습니다.');
  let s = String(raw).trim();
  // 보안: 비정상적으로 큰 입력은 복구 체인의 정규식 백트래킹으로 long-running 가능.
  // Gemini 의 단일 응답 한계가 ~1M 토큰 (~4MB) 이므로 4MB 를 한계로 설정.
  if (s.length > 4 * 1024 * 1024) {
    throw new Error('AI 응답이 너무 큽니다 (4MB 초과) — 분할 생성 권장.');
  }

  // 1) 코드 펜스 제거 (```json ... ``` 또는 ``` ... ```)
  if (s.startsWith('```')) {
    s = s.replace(/^```(?:json|JSON)?\s*/i, '').replace(/```\s*$/i, '');
  }
  // 2) 응답 앞뒤의 비-JSON 텍스트 잘라내기
  const first = Math.min(
    ...(['{', '['].map(c => { const i = s.indexOf(c); return i === -1 ? Infinity : i; }))
  );
  if (!isFinite(first)) throw new Error('AI 응답에서 JSON 시작점을 찾지 못했습니다.');
  s = s.slice(first);

  // 3) 정상 parse 시도
  try { return JSON.parse(s); } catch (_) {}

  // 4) trailing comma 제거 (객체/배열 닫기 직전의 쉼표) — 최대 5회
  let cleaned = s;
  for (let i = 0; i < 5; i++) {
    const next = cleaned.replace(/,(\s*[}\]])/g, '$1');
    if (next === cleaned) break;
    cleaned = next;
  }
  try { return JSON.parse(cleaned); } catch (_) {}

  // 5) 잘린 응답 복구: 문자열 안에서 잘렸는지, brace/bracket 균형이 맞는지 확인 후 자동 보완
  const recovered = repairTruncatedJson(cleaned);
  try { return JSON.parse(recovered); } catch (e) {
    // 6) 마지막 정상 닫힘 위치까지만 사용
    const trimmed = trimToLastClosing(cleaned);
    if (trimmed) {
      try { return JSON.parse(trimmed); } catch (_) {}
    }
    // 7) 최후의 수단: "slides" 배열 내부에서 완성된 객체만 추출
    const partial = salvageSlidesArray(cleaned);
    if (partial) return partial;
    throw new Error('AI 응답을 JSON으로 복구하지 못했습니다. (응답이 너무 길어 잘렸을 수 있음)');
  }
}

/** 잘린 응답에서 "slides": [ ... ] 배열을 찾아 완성된 객체만 추출 (각 객체는 brace 균형 확인) */
function salvageSlidesArray(s) {
  // "slides" 키 찾기
  const slidesIdx = s.search(/"slides"\s*:\s*\[/);
  if (slidesIdx === -1) return null;
  const arrStart = s.indexOf('[', slidesIdx);
  if (arrStart === -1) return null;
  // arrStart 이후 완성된 { ... } 객체들을 하나씩 추출
  const objs = [];
  let i = arrStart + 1;
  while (i < s.length) {
    // 공백·콤마 skip
    while (i < s.length && /[\s,]/.test(s[i])) i++;
    if (i >= s.length || s[i] !== '{') break;
    // brace 매칭으로 한 객체 끝 찾기
    let depth = 0, inStr = false, escape = false;
    const objStart = i;
    let objEnd = -1;
    for (let j = i; j < s.length; j++) {
      const c = s[j];
      if (escape) { escape = false; continue; }
      if (c === '\\') { escape = true; continue; }
      if (inStr) {
        if (c === '"') inStr = false;
        continue;
      }
      if (c === '"') { inStr = true; continue; }
      if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) { objEnd = j; break; }
      }
    }
    if (objEnd === -1) break; // 미완성 객체 — 무시
    const objStr = s.slice(objStart, objEnd + 1);
    try {
      const obj = JSON.parse(objStr);
      objs.push(obj);
    } catch (_) { /* skip malformed */ }
    i = objEnd + 1;
  }
  if (objs.length === 0) return null;
  // 메타 키들도 추출 시도 (title/subtitle/badge)
  const meta = {};
  const tryExtract = (key) => {
    const re = new RegExp(`"${key}"\\s*:\\s*"([^"]*?)"`);
    const m = re.exec(s);
    if (m) meta[key] = m[1];
  };
  ['title', 'subtitle', 'badge', 'team', 'author'].forEach(tryExtract);
  return { ...meta, slides: objs, _salvaged: true, _salvagedCount: objs.length };
}

/** 잘린 JSON 문자열을 brace/bracket 균형 + string 닫힘 추정하여 복구 시도. */
function repairTruncatedJson(s) {
  // 문자열 상태 추적, 마지막에 누락된 닫힘 보완
  let inStr = false;
  let escape = false;
  const stack = []; // {, [
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (inStr) {
      if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === '{' || c === '[') stack.push(c);
    else if (c === '}') { if (stack[stack.length - 1] === '{') stack.pop(); }
    else if (c === ']') { if (stack[stack.length - 1] === '[') stack.pop(); }
  }
  let tail = s;
  // 문자열 미닫힘 시 닫기
  if (inStr) tail += '"';
  // 마지막 토큰이 콜론(:) 또는 콤마(,)로 끝나면 placeholder 추가
  const trimEnd = tail.replace(/\s+$/, '');
  const lastChar = trimEnd[trimEnd.length - 1];
  if (lastChar === ':') tail = trimEnd + ' null';
  else if (lastChar === ',') tail = trimEnd.slice(0, -1); // 마지막 콤마 제거
  // 스택 잔여 brace 닫기
  while (stack.length) {
    const open = stack.pop();
    tail += (open === '{' ? '}' : ']');
  }
  return tail;
}

/** 가장 깊은 정상 닫힘 위치까지만 잘라낸 substring 반환 (없으면 null). */
function trimToLastClosing(s) {
  let inStr = false;
  let escape = false;
  const stack = [];
  let lastTopClose = -1;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (inStr) {
      if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === '{' || c === '[') stack.push(c);
    else if (c === '}' || c === ']') {
      stack.pop();
      if (stack.length === 0) lastTopClose = i;
    }
  }
  if (lastTopClose === -1) return null;
  return s.slice(0, lastTopClose + 1);
}

/* Expose */
/* ---- AI edit prompt builder ----
 * 현재 GDD를 수정하기 위한 명령을 받아 operations 배열을 반환하도록 유도. */
function buildAiEditPrompt(currentGdd, command, attachments) {
  const slides = currentGdd?.slides || [];
  const overview = slides.map((s, i) => {
    const d = s.data || {};
    const title = d.title || d.head || d.product || '';
    return `[${i + 1}] id=${s.id} type=${s.type} "${title}"`;
  }).join('\n');

  // 각 슬라이드 data를 800자 이내로 요약 (긴 표는 잘려도 작업 가능)
  const details = slides.map((s, i) => {
    let json;
    try { json = JSON.stringify(s.data || {}, null, 2); } catch { json = '{}'; }
    if (json.length > 800) json = json.slice(0, 800) + '\n  ... (이하 생략)';
    return `── Slide ${i + 1} ── id=${s.id} type=${s.type}\n${json}`;
  }).join('\n\n');

  const imageNote = (attachments || []).filter(a => a.kind === 'image').length > 0
    ? `\n참고: ${(attachments || []).filter(a => a.kind === 'image').length}개의 참고 이미지가 함께 제공됩니다. 이미지 분석 결과를 새/수정 슬라이드에 반영하세요.\n`
    : '';
  const textBlocks = (attachments || []).filter(a => a.kind === 'text').map((a, i) => `\n[첨부 텍스트 ${i + 1}: ${a.name}]\n${a.value.slice(0, 1500)}`).join('\n');

  return `${SENIOR_PERSONA}

# 임무
이미 작성된 게임 기획서가 있다. 사용자의 명령을 적용하여 **이 기획서를 수정/확장하는 operations 만 반환**한다.
**새 기획서를 생성하지 말 것. 새 GDD JSON을 반환하지 말 것.** operations 배열만 출력한다.

# 현재 기획서 메타
title: "${currentGdd?.title || ''}"
subtitle: "${currentGdd?.subtitle || ''}"
team: "${currentGdd?.team || ''}"
badge: "${currentGdd?.badge || ''}"
총 슬라이드: ${slides.length}장

# 슬라이드 목록
${overview || '(없음)'}

# 슬라이드 상세 (각 슬라이드 data, 800자 컷)
${details || '(없음)'}

# 사용자 명령
"${command}"
${textBlocks}
${imageNote}

# 출력 형식 (JSON만, 코드블록 펜스 금지)
{
  "summary": "한국어 한 줄로 변경 요약 (history에 기록됨)",
  "operations": [
    { "op": "add",     "after": "end|start|<slideId>|<1-based-index>", "slide": { "type": "<타입>", "data": { ... 전체 schema 채움 ... } } },
    { "op": "replace", "id": "<slideId>", "slide": { "type": "<타입>", "data": { ... } } },
    { "op": "patch",   "id": "<slideId>", "fields": { ... slide.data 의 일부 필드만 merge ... } },
    { "op": "delete",  "id": "<slideId>" },
    { "op": "move",    "id": "<slideId>", "to": "<1-based-index>" },
    { "op": "meta",    "fields": { "title": "...", "subtitle": "...", "team": "...", "badge": "..." } }
  ]
}

# 동작 매핑 가이드
- "<X> 슬라이드 추가" / "<Y> 같은 화면 설계 추가" → op: "add"
- "<X> 슬라이드를 <Y>로 바꿔" / 큰 폭의 재작성 → op: "replace"
- "<X> 슬라이드의 <필드> 만 <Y>로" / 표에 row 추가 / cards 늘리기 → op: "patch" (data 머지)
- "<X> 슬라이드 삭제 / 제거" → op: "delete"
- "<X>를 N번째로 옮겨" → op: "move"
- "제목/부제/팀명 바꿔" → op: "meta"
- 슬라이드 식별자는 위 목록의 id 우선 사용. 명령에 명시가 없으면 가장 의도에 부합하는 슬라이드를 골라 id를 지정.

# 사용 가능한 슬라이드 타입
cover, history, toc, section-divider, intent, terms, rules, data-table, flow, diagram, sequence-diagram, class-diagram, ui-design, image-embed, resources

# 품질 기준 (수정에도 동일하게 적용)
- 절차/조건 분기 로직은 rules 가 아닌 **flow / sequence-diagram** 으로 작성.
- rules.blocks.items 는 정적 상수·임계치만 (예: "최대 레벨: 10").
- data-table 추가/수정 시 columns 와 rows 키를 정확히 매칭. rows 최소 4개.
- 새로 추가되는 cover / section-divider / ui-design / image-embed 슬라이드는 가급적 imagePrompt 영문으로 채워서 nano-banana 가 참고 이미지를 생성할 수 있게 한다.
- 추상어 금지, 측정 가능 지표·예시 수치 포함, 빈 배열 금지.

# 출력 규칙
- JSON 외 텍스트 절대 금지.
- operations 가 빈 배열이면 안 됨 — 명령이 모호하면 가장 합리적인 추측으로 최소 1개 operation 을 반환.
- 모든 string 값은 한국어 (영문 식별자/imagePrompt/snake_case 필드명 제외).`;
}

/* ---- 2단계 AI 파이프라인: Outline → Flesh-out ---- */
/* outline: 슬라이드 구조만 생성 (저비용, Flash). flesh: 각 슬라이드 8~10개씩 묶어 상세 (Pro). */
function buildOutlinePrompt(command, existingTitles, attachments, context) {
  const textBlocks = (attachments || []).filter(a => a.kind === 'text').map((a, i) => `\n[첨부 텍스트 ${i+1}: ${a.name}]\n${a.value.slice(0, 1200)}`).join('\n');
  const contextBlock = renderContextBlock(context);
  const domain = classifyDomain(command, context?.plan?.title || '');
  return `${SENIOR_PERSONA}

# 임무
30년차 게임 메이커. **GDD 의 슬라이드 골격만 먼저 빠르게 설계한다.** 각 슬라이드의 type, 제목, 한 줄 의도만 출력. 상세 내용은 출력하지 말 것.

요청: "${command}"
${textBlocks}
${contextBlock}

기존 기획서 목록: ${(existingTitles || []).join(', ') || '(없음)'}

# 출력 형식 (JSON 만, 코드블록 없이)
{
  "title": "기획서 제목",
  "subtitle": "한 줄 부제",
  "badge": "MVP|CORE|DRAFT|SYSTEM 중 하나",
  "domain": "${domain}",
  "outline": [
    { "type": "cover", "title": "...", "intent": "왜 이 슬라이드가 필요한지 한 줄" },
    { "type": "history", "title": "문서 이력", "intent": "..." },
    { "type": "toc", "title": "CONTENTS", "intent": "..." },
    { "type": "section-divider", "title": "01 개요", "intent": "개요 섹션 진입" },
    { "type": "intent", "title": "기획 의도", "intent": "..." },
    /* ... 22~32 슬라이드 전체 */
  ]
}

# 필수 포함 슬라이드 (22~32장)
cover, history, toc, [개요: divider+intent+terms], [시스템: divider+flow+sequence-diagram+diagram+state-machine+class-diagram+rules], [데이터: divider+data-table×2+balance-table], [API: divider+api-contract×2~3+telemetry], [품질: divider+acceptance-criteria×2], [UI: divider+ui-design×2+image-embed×3], [관리: divider+risk-register+roadmap+resources]

각 슬라이드의 intent 는 "이 슬라이드에서 무엇을 다룰 것인가" 한 줄로. 상세 내용은 다음 단계에서 채움.

# 출력 규칙
JSON 만. 코드블록 펜스 금지. outline 배열은 22~32개.`;
}

function buildFleshOutPrompt(outlineRoot, slidesToFlesh, allOutline, command, context) {
  const ctxBlock = renderContextBlock(context);
  return `${SENIOR_PERSONA}

# 임무
GDD 슬라이드 골격이 이미 정해진 상태. 아래 N 개 슬라이드의 상세 내용만 채워서 반환한다.

# 기획서 메타
title: "${outlineRoot.title || ''}"
subtitle: "${outlineRoot.subtitle || ''}"
badge: "${outlineRoot.badge || ''}"
원본 명령: "${command}"

${ctxBlock}

# 전체 슬라이드 골격 (참고용 — 다른 슬라이드와 정합성 유지)
${(allOutline || []).map((o, i) => `[${i+1}] ${o.type} · "${o.title}" — ${o.intent || ''}`).join('\n')}

# 이번 단계에서 채울 슬라이드들
${slidesToFlesh.map((o, i) => `### ${i+1}. type=${o.type} · "${o.title}"\nintent: ${o.intent || ''}`).join('\n\n')}

# 출력 형식 (JSON 만)
{
  "slides": [
    /* 위 N 개 슬라이드를 그 순서대로 — 각 슬라이드는 다음 구조 */
    { "type": "...", "data": { /* 그 type 에 맞는 모든 필드. 표준 schema 그대로 */ } }
  ]
}

# 품질 기준 (상세)
- 모든 텍스트는 한국어. snake_case 식별자/영문 imagePrompt 만 영문.
- 마크다운(**굵게**, \`code\`, 리스트) 적극 활용.
- 모든 배열 필드는 표준 최소 개수 채움 (rules.items 4~6, data-table.rows 8~16, flow.nodes 6~12, terms.rows 8~12, etc.)
- 절대 빈 배열 금지. "TBD"/"적절한"/"충분한" 금지.
- image-embed/section-divider/ui-design/cover 는 imagePrompt 영문 필수.
- 다른 슬라이드와 용어·필드명 일관성 유지.

# 슬라이드 타입별 schema 요약 (이번에 다루는 타입만)
${[...new Set(slidesToFlesh.map(o => o.type))].map(t => slideTypeBrief(t)).join('\n\n')}

# 출력 규칙
JSON 만. 코드블록 펜스 금지.`;
}

function slideTypeBrief(t) {
  const briefs = {
    'cover': '{ product, title, subtitle, team, author, date }',
    'history': '{ rows: [{ ver, date, page, content, author }] }  // rows 3~6개',
    'toc': '{ title: "CONTENTS", entries: [{ num, name, sub }] }',
    'section-divider': '{ num, title, subtitle, imagePrompt: 영문 컨셉 아트 }',
    'intent': '{ section, sectionName, title, tagline, cards: [{ idx, head, desc }] }  // cards 4~6개, desc 끝에 측정 지표',
    'terms': '{ section, sectionName, title, rows: [{ term, def, note }] }  // rows 8~12개',
    'rules': '{ section, sectionName, title, blocks: [{ head, items[] }] }  // blocks 2~3개, items 정적 규칙만',
    'data-table': '{ section, sectionName, title, columns: [{ key, label, width }], rows: [{ ... }] }  // rows 8~16개, 모든 row 객체는 모든 column key 포함',
    'flow': '{ section, sectionName, title, direction: vertical|horizontal|grid, lines: 1|2, nodes: [{ kind: start|process|decision|end, label }] }  // nodes 6~12개',
    'diagram': '{ section, sectionName, title, nodes: [{ id, label, sub, kind: start|process|decision|end|service|data, col, row }], edges: [{ from, to, label, kind: solid|dashed|thin }] }',
    'sequence-diagram': '{ section, sectionName, title, participants: [{ id, name, kind: actor|system|service|data }], messages: [{ from, to, label, kind: sync|async|return }] }  // messages 8~14개',
    'class-diagram': '{ section, sectionName, title, classes: [{ id, name, stereotype, attrs[], methods[], col, row }], relations: [{ from, to, kind: inherit|implement|compose|aggregate|assoc|depend, label }] }  // attrs/methods 는 가시성 prefix(+/-/#) 필수',
    'ui-design': '{ section, sectionName, title, imagePrompt: 영문, callouts: [{ name, desc, x, y }] }  // callouts 5~8개, x/y 는 0~100',
    'image-embed': '{ section, sectionName, title, caption, imagePrompt: 영문 }',
    'resources': '{ section, sectionName, title, categories: [{ name, count, guideline, items: [{ name, spec, example }] }] }  // categories 4~5개',
    'balance-table': '{ section, sectionName, title, formula, vars: [{ name, formula, range, defaultValue, sensitivity, notes }], curve?: { x[], y[], xLabel, yLabel } }  // vars 6~12개',
    'state-machine': '{ section, sectionName, title, states: [{ id, name, kind: initial|normal|final|error, onEnter, onExit, invariants[] }], transitions: [{ from, event, guard, to, action }] }  // states 4~8개, transitions 6~12개',
    'api-contract': '{ section, sectionName, title, endpoint, method, auth, request: 문자열 JSON 스키마, response: 문자열 JSON 스키마, errors: [{ code, message, when }], idempotencyKey, slaMs, notes }  // errors 3~6개',
    'acceptance-criteria': '{ section, sectionName, title, userStory: { as, want, soThat }, criteria: [{ id, given, when, then, edgeCases[] }] }  // criteria 3~6개',
    'telemetry': '{ section, sectionName, title, events: [{ name, when, props: [{ key, type, required, note }], kpi }], funnels: [{ name, steps[], goal }] }  // events 5~10개',
    'risk-register': '{ section, sectionName, title, risks: [{ id, title, impact: 1-5, likelihood: 1-5, mitigation, owner, status: open|mitigated|accepted|closed }] }  // risks 4~8개',
    'roadmap': '{ section, sectionName, title, phases: [{ name, start: YYYY.MM, end: YYYY.MM, deliverables[], dependsOn[] }] }  // phases 4~6개',
  };
  return `**${t}**: ${briefs[t] || '(스키마 미정)'}`;
}

/* Self-critique 프롬프트 — GDD 가 완성된 후 약한 슬라이드 식별 */
function buildCritiquePrompt(project) {
  const slides = (project.slides || []).map((s, i) => {
    const d = s.data || {};
    return `[${i+1}] id=${s.id} type=${s.type} title="${d.title || ''}"`;
  }).join('\n');
  return `${SENIOR_PERSONA}

# 임무
이미 작성된 GDD 의 약한 슬라이드를 식별하고 무엇을 보강해야 하는지 출력하라.

# GDD 메타
title: "${project.title || ''}"
subtitle: "${project.subtitle || ''}"
총 ${(project.slides || []).length}장

# 슬라이드 목록
${slides}

# 평가 기준
- 수치 구체성 (TBD/적절한/충분한 등 모호어 사용 → 약함)
- 절차/조건 분기가 rules 텍스트로만 나열되어 있고 flow 없음 → 약함
- imagePrompt 누락 → 약함
- terms 에 있는 용어가 다른 슬라이드에서 사용 안 됨 → 약함
- data-table 의 rows 가 너무 적거나 빈 셀 많음 → 약함
- api-contract 의 request/response 가 비어있음 → 약함

# 출력 형식 (JSON 만)
{
  "summary": "전반적 평가 한국어 한 문단",
  "weakSlides": [
    { "slideId": "<id>", "reasons": ["이유 1", "이유 2"], "suggestion": "어떻게 보강할지 한국어로 구체적" }
  ]
}

JSON 만. 코드블록 펜스 금지.`;
}

Object.assign(window, {
  uid, now,
  SENIOR_PERSONA,
  DOMAIN_PERSONAS,
  classifyDomain,
  GDD_INGAME, GDD_VEHICLE, GDD_COMBAT,
  GDD_BLANK_TEMPLATE,
  CHIP_SUGGESTIONS,
  generateDemoGdd,
  buildAiPrompt,
  buildAiEditPrompt,
  buildOutlinePrompt,
  buildFleshOutPrompt,
  buildCritiquePrompt,
  slideTypeBrief,
  parseAiJson,
  summarizeGddForContext,
  renderContextBlock,
});
