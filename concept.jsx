/* === Concept (1-Page GDD) — top-level project concept document ===
   Owns recommended detailed GDDs, gives a high-level project summary. */

/* ===== Sample concept ===== */
const CONCEPT_SUPERBUMPERS = {
  id: 'concept-superbumpers',
  title: '슈퍼범퍼즈',
  subtitle: '속력은 곧 힘이다 — 캐주얼 차량 충돌 배틀',
  badge: '',
  author: '김기획',
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
  badge: '',
  author: '김기획',
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
  mustHaveFeatures: [],   // 사용자가 ConceptBrief 에서 선택한 필수 기능 ID 배열.
  locked: { title: false, overview: false, visual: false, usp: false, coreLoop: false },
  snapshots: [],
});

/* === 게임 기능 카탈로그 === 현존 라이브 서비스 게임에서 자주 채택되는 기능 모음.
 * ConceptBrief 의 "필수 포함 기능" 다중선택 UI 와 AI 프롬프트의 "MUST-HAVE" 블록에서 사용.
 *
 * 카테고리 분류 기준:
 *  - 필요 기획서 priority 단계(1~10) 와 느슨하게 매칭
 *  - 각 feature 는 { id, label, desc } 로 구성
 *  - id 는 영문 snake_case (안정적 키), label/desc 는 한국어 (UI 표시)
 *  - desc 는 30~50자, "무엇을 하는가" + "유사 게임" 짧게
 */
const GAME_FEATURE_CATALOG = [
  {
    id: 'growth', icon: '⬆️', label: '성장·진행',
    features: [
      { id: 'rebirth', label: '환생/리셋', desc: '캐릭터 초기화 후 영구 보너스 — 리니지·디아블로식' },
      { id: 'class_advancement', label: '전직/전직 분기', desc: '레벨 도달 시 직업 분화 — MMORPG 표준' },
      { id: 'transcendence', label: '초월/각성', desc: '레벨 상한 돌파 단계별 진화 — 모바일 RPG 표준' },
      { id: 'potential', label: '잠재능력', desc: '장비/캐릭터 숨겨진 옵션 — 메이플스토리' },
      { id: 'endless_tower', label: '무한의 탑', desc: '층별 난이도 상승 영구 콘텐츠' },
      { id: 'skill_tree', label: '스킬 트리', desc: '분기형 스킬 빌드 — POE·디아블로' },
      { id: 'constellation', label: '별자리/장기 성장', desc: '느린 영구 성장 트리 — 원신' },
      { id: 'mount_growth', label: '탑승물 성장', desc: '말/드래곤 등 탈것 단계 성장' },
    ],
  },
  {
    id: 'combat', icon: '⚔️', label: '전투',
    features: [
      { id: 'auto_battle', label: '자동 전투', desc: '범위 자동 사냥/스킬 사용 — 한국식 모바일 MMO 필수' },
      { id: 'action_combat', label: '액션 콤보', desc: '입력 기반 콤보·연계기 — 검은사막' },
      { id: 'turn_based', label: '턴제 전투', desc: '턴 기반 명령 입력 — 원더러스·서머너즈워' },
      { id: 'auto_hunt', label: '자동 사냥', desc: '지정 영역 무인 파밍 — MMO 표준' },
      { id: 'dodge_parry', label: '회피/패링', desc: '타이밍 기반 방어 메커니즘' },
      { id: 'cooldown', label: '스킬 쿨다운', desc: '스킬별 재사용 대기시간 — MOBA·MMORPG' },
      { id: 'combo_meter', label: '콤보 미터', desc: '연속 처치 시 보너스 — 데빌메이크라이' },
      { id: 'aggro', label: '어그로 시스템', desc: '몹 어그로 관리 — 탱커/딜러/힐러 트리니티' },
    ],
  },
  {
    id: 'content', icon: '📜', label: 'PvE 콘텐츠',
    features: [
      { id: 'main_quest', label: '메인 퀘스트', desc: '스토리 진행 퀘스트 라인' },
      { id: 'daily_quest', label: '일일·주간 퀘스트', desc: '리텐션용 반복 미션' },
      { id: 'dungeon', label: '던전(인스턴스)', desc: '파티 4~5인 인스턴스 던전' },
      { id: 'raid', label: '레이드', desc: '8/16/24인 대규모 파티 콘텐츠' },
      { id: 'world_boss', label: '월드 보스', desc: '정해진 시간 전 서버 참여 보스' },
      { id: 'field_boss', label: '필드 보스', desc: '오픈 필드 등장 네임드 몬스터' },
      { id: 'story_chapter', label: '스토리 챕터', desc: '챕터·에피소드 구성 컷씬' },
      { id: 'seasonal_content', label: '시즌 콘텐츠', desc: '시즌별 한정 던전/이벤트' },
    ],
  },
  {
    id: 'pvp', icon: '🛡️', label: 'PvP·경쟁',
    features: [
      { id: 'arena_1v1', label: '1v1 결투(아레나)', desc: '개인 랭킹 결투장 — 와우' },
      { id: 'team_pvp', label: '팀 PvP', desc: '3v3·5v5 단체 매치' },
      { id: 'siege_war', label: '공성전', desc: '길드 거점 공격·방어 — 리니지·라그나로크' },
      { id: 'territory_war', label: '점령전', desc: '필드 거점 점유율 경쟁' },
      { id: 'guild_war', label: '길드전', desc: '길드 vs 길드 정규 매치' },
      { id: 'faction_war', label: '진영전', desc: '연합·진영 단위 대규모 전투' },
      { id: 'open_pk', label: '자유 PK', desc: '오픈필드 자유 전투·악성 시스템' },
      { id: 'ranked_match', label: '랭킹전', desc: '시즌별 점수 등급 — 로켓리그식' },
    ],
  },
  {
    id: 'social', icon: '🤝', label: '사회·길드',
    features: [
      { id: 'guild', label: '길드/클랜', desc: '항상 켜있는 멤버 그룹 + 길드 콘텐츠' },
      { id: 'party_friend', label: '친구/파티', desc: '친구 목록·파티 매칭' },
      { id: 'marriage', label: '결혼 시스템', desc: '플레이어 간 결혼 + 부부 버프 — 마비노기' },
      { id: 'mentor', label: '사제(스승-제자)', desc: '신규 유저 멘토링 시스템 — 한국 MMO' },
      { id: 'family', label: '가문/가족', desc: '캐릭터 묶음 가족 단위 진영' },
      { id: 'multi_chat', label: '다채널 채팅', desc: '귓속말/지역/세계/길드 분리' },
      { id: 'auction_house', label: '거래소(경매장)', desc: '플레이어 간 자유 거래' },
      { id: 'guild_vault', label: '길드 창고', desc: '공용 인벤토리·기여도 관리' },
    ],
  },
  {
    id: 'collection', icon: '🎒', label: '수집·제작',
    features: [
      { id: 'pet', label: '펫 시스템', desc: '동반 펫 수집·육성·전투 보조' },
      { id: 'mount', label: '탈것 시스템', desc: '말·비행체·드래곤 등 탑승물' },
      { id: 'costume', label: '코스튬·외형', desc: '외형 변경·외형 슬롯' },
      { id: 'enhancement', label: '장비 강화·조합', desc: '+1~+15 등 단계 강화 — 디아블로·메이플' },
      { id: 'crafting', label: '제작(크래프팅)', desc: '재료 → 장비/소모품 제작' },
      { id: 'gathering', label: '채집(낚시/벌목/요리)', desc: '생활 콘텐츠 — 마비노기·파판14' },
      { id: 'gem_rune', label: '보석·룬 슬롯', desc: '장비 슬롯 보석 끼우기' },
      { id: 'codex', label: '도감(컬렉션)', desc: '몬스터/아이템/엔딩 수집 도감' },
    ],
  },
  {
    id: 'retention', icon: '📅', label: '메타·리텐션',
    features: [
      { id: 'daily_login', label: '출석 보상', desc: '일일 접속 보상 — 한국 모바일 표준' },
      { id: 'mailbox', label: '우편함', desc: 'GM 발송·플레이어 간 우편' },
      { id: 'daily_mission', label: '일일 미션', desc: '하루 단위 체크리스트 미션' },
      { id: 'battle_pass', label: '시즌 패스(Battle Pass)', desc: '시즌별 보상 트랙 — 포트나이트' },
      { id: 'daily_free_roll', label: '일일 무료 뽑기', desc: '매일 1회 무료 가챠' },
      { id: 'vip_system', label: 'VIP 시스템', desc: '누적 결제액 기반 등급 보상' },
      { id: 'subscription', label: '멤버십·구독', desc: '월정액 패키지 — 패스 패시브 보상' },
      { id: 'invite_reward', label: '친구 초대 보상', desc: '추천인 코드·신규 영입 보상' },
    ],
  },
  {
    id: 'monetization', icon: '💰', label: '경제·BM',
    features: [
      { id: 'gacha', label: '가챠(확률형 뽑기)', desc: '확률형 아이템 뽑기 — 모바일 RPG 표준' },
      { id: 'pity', label: '천장 시스템(Pity)', desc: '확정 보장 카운터 — 원신' },
      { id: 'multi_currency', label: '다단계 재화', desc: '소프트·하드·프리미엄 분리' },
      { id: 'player_trade', label: '플레이어 거래', desc: '직거래·거래소 수수료 모델' },
      { id: 'rewarded_ad', label: '광고 보상', desc: '광고 시청 후 보상 — 캐주얼 표준' },
      { id: 'cosmetic_shop', label: '외형 상점', desc: '능력치 없는 외형만 판매 — 윤리적 BM' },
      { id: 'limited_pack', label: '한정 패키지', desc: '시즌·이벤트 한정 결제 상품' },
      { id: 'auto_hunt_ticket', label: '자동 사냥권', desc: '오프라인 자동 사냥 시간권' },
    ],
  },
  {
    id: 'convenience', icon: '⚙️', label: '편의·UX',
    features: [
      { id: 'auto_path', label: '자동 이동/네비', desc: '목표지점 자동 길찾기 — 한국 MMO 표준' },
      { id: 'auto_quest', label: '자동 퀘스트', desc: '퀘스트 수락·완료 자동화' },
      { id: 'fast_travel', label: '빠른 이동·귀환서', desc: '텔레포트·귀환 스크롤' },
      { id: 'auto_loot', label: '자동 줍기', desc: '드롭 자동 획득 — 디아블로3' },
      { id: 'inventory_sort', label: '인벤토리 자동 정리', desc: '카테고리별 자동 분류' },
      { id: 'multi_slot', label: '다중 캐릭터 슬롯', desc: '계정당 여러 캐릭터 보유' },
      { id: 'cross_save', label: '크로스 플레이·세이브', desc: 'PC·모바일 동기화' },
      { id: 'ui_custom', label: 'UI 커스터마이징', desc: '핫바·창 위치 자유 배치' },
    ],
  },
  {
    id: 'ops_social', icon: '📣', label: '운영·소셜 액션',
    features: [
      { id: 'clip_share', label: '클립 녹화·공유', desc: '하이라이트 클립 SNS 공유' },
      { id: 'screenshot_share', label: '스크린샷 공유', desc: '게임 내 카메라·필터·공유' },
      { id: 'event_notice', label: '이벤트 공지/푸시', desc: '인앱 배너·푸시 알림' },
      { id: 'report_system', label: '신고·제재', desc: '욕설/매크로 신고 + 자동 검출' },
      { id: 'guild_recruit', label: '길드 모집 게시판', desc: '길드 모집·구직 매칭' },
      { id: 'in_game_survey', label: '인게임 설문', desc: '운영 피드백 수집' },
      { id: 'streamer_mode', label: '스트리머 모드', desc: '닉네임 가리기·소음 차단' },
    ],
  },
];

/** id → { categoryId, categoryLabel, label, desc } lookup.
 * 모듈 로드 시 1회 Map 구축 → O(1) 조회. 78개 항목 * 다중선택 시 매번 선형 스캔하지 않도록. */
const FEATURE_MAP = new Map(
  GAME_FEATURE_CATALOG.flatMap(cat =>
    cat.features.map(f => [f.id, { categoryId: cat.id, categoryLabel: cat.label, ...f }])
  )
);
function lookupFeatureById(id) {
  return FEATURE_MAP.get(id) || null;
}

/* ===== 이미지 리사이즈 유틸 =====
 * dataURL 입력 → 정사각형 dataURL 출력 (object-fit: cover 의 캔버스 버전).
 * - 짧은 변 기준으로 중앙 크롭 → size×size 픽셀로 다운샘플
 * - JPEG 0.85 압축 (PNG 보다 IndexedDB 공간 효율 ↑, 인물/사진 품질 충분)
 * - 비동기 (Image 디코딩) → Promise 반환
 */
function resizeImageToSquare(dataUrl, size = 128) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        // 중앙 크롭 — 원본 짧은 변 기준
        const srcSize = Math.min(img.naturalWidth, img.naturalHeight);
        const sx = (img.naturalWidth - srcSize) / 2;
        const sy = (img.naturalHeight - srcSize) / 2;
        ctx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } catch (e) { reject(e); }
    };
    img.onerror = () => reject(new Error('이미지 디코딩 실패'));
    img.src = dataUrl;
  });
}

/* ===== ConceptView ===== */
function ConceptView({ concept, patch, onCreateGdd, onOpenGdd, onBulkCreate, onBulkDownload, isGenerating, isDownloading, toast }) {
  // 일괄 다운로드 메뉴 토글 (PPTX / Markdown 선택)
  const [showBulkMenu, setShowBulkMenu] = React.useState(false);
  // 연결된 GDD 개수 계산 — 0이면 버튼 비활성화
  const linkedCount = React.useMemo(() => {
    if (!concept) return 0;
    return (concept.recommendedPlans || []).filter(p => p.linkedGddId).length;
  }, [concept?.recommendedPlans]);
  const fileInputRef = React.useRef(null);
  const avatarInputRef = React.useRef(null);
  const pageRef = React.useRef(null);
  const [busySection, setBusySection] = React.useState(null);
  const [exporting, setExporting] = React.useState(false);
  const [showSnapshotMenu, setShowSnapshotMenu] = React.useState(false);
  const [applyingKo, setApplyingKo] = React.useState(false);

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
            // 팔레트도 함께 전달 → 이미지가 컨셉 색상에 맞춰 생성됨
            const src = await window.gemini.generateImage(result.visual.prompt, { palette: concept.palette });
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
      // 팔레트 전달 → 이미지가 컨셉 색상에 맞춰 생성됨
      const src = await window.gemini.generateImage(p, { palette: concept.palette });
      patch({
        ...concept,
        visual: { ...(concept.visual || {}), src, prompt: p },
        updatedAt: new Date().toISOString().slice(0, 10),
      });
      toast?.('🍌 이미지 생성 완료', 'ok');
    } catch (e) {
      toast?.('이미지 생성 실패: ' + (e.message || e), 'err');
    } finally {
      setBusySection(null);
    }
  };

  /* 한국어 프롬프트 → 영문 프롬프트 반영
   * - 사용자가 직접 편집한 한국어 본문을 Gemini text 모델로 영문 번역
   * - 이미지 모델에 최적화된 형식 (영문, 60단어 이내, 조명/구도/스타일 포함) 으로 가공
   * - 결과를 visual.prompt 에 덮어쓰기 (이미지는 자동 재생성하지 않음 — 비용 보호)
   */
  const applyKoreanToEnglish = async () => {
    const ko = (concept.visual?.promptKo || '').trim();
    if (!ko) {
      toast?.('한국어 프롬프트가 비어있습니다.', 'err');
      return;
    }
    if (!window.gemini || !window.gemini.complete) {
      toast?.('Gemini API 키를 먼저 설정하세요.', 'err');
      return;
    }
    setApplyingKo(true);
    try {
      const translationPrompt = [
        'You are a prompt engineer for an AI image model (Gemini nano-banana).',
        'Convert the following Korean visual description into an OPTIMIZED ENGLISH image-generation prompt.',
        '',
        'CONSTRAINTS:',
        '- Output ONLY the English prompt, no quotes, no preamble, no explanation.',
        '- Keep it under 60 words.',
        '- Include lighting, composition, art style, and key visual elements.',
        '- Preserve the original mood and intent.',
        '- Use concrete visual nouns and adjectives (avoid abstract terms).',
        '',
        'KOREAN INPUT:',
        ko,
        '',
        'ENGLISH PROMPT (output only, plain text):',
      ].join('\n');
      const raw = await window.gemini.complete(translationPrompt);
      const en = String(raw || '').trim()
        .replace(/^["'`]+|["'`]+$/g, '')
        .replace(/^ENGLISH PROMPT:?\s*/i, '')
        .trim();
      if (!en) {
        toast?.('영문 번역이 비어있습니다. 다시 시도하세요.', 'err');
        return;
      }
      patchPath('visual.prompt', en);
      toast?.('한국어 → 영문 프롬프트 반영 완료', 'ok');
    } catch (e) {
      toast?.('번역 실패: ' + (e.message || e), 'err');
    } finally {
      setApplyingKo(false);
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

  /* PNG export — exporting 클래스를 일시적으로 부여:
   * - CSS 가 sticky/position 등을 static 으로 강제하여 html2canvas 가 정상 캡처
   * - "필요 기획서" 섹션은 컨셉 PNG 에서 제외
   * - 캡처 직후 클래스 제거 → UI 복원
   */
  const exportPng = async () => {
    if (!window.html2canvas) {
      toast?.('html2canvas 로드 실패', 'err');
      return;
    }
    setExporting(true);
    const pageEl = pageRef.current;
    if (!pageEl) {
      setExporting(false);
      toast?.('페이지 ref 누락', 'err');
      return;
    }
    pageEl.classList.add('exporting');
    // 강제 reflow — 클래스 적용 직후 html2canvas 가 안정적으로 새 스타일을 읽도록
    void pageEl.offsetHeight;
    try {
      const canvas = await window.html2canvas(pageEl, {
        backgroundColor: '#0a0d12',
        scale: 2,
        useCORS: true,
        // sticky/fixed 요소가 화면 밖에 있어도 정상 캡처
        windowWidth: pageEl.scrollWidth,
        windowHeight: pageEl.scrollHeight,
      });
      const link = document.createElement('a');
      link.download = `${concept.title || 'concept'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast?.('PNG 다운로드 완료', 'ok');
    } catch (e) {
      toast?.('PNG 생성 실패: ' + e.message, 'err');
    } finally {
      pageEl.classList.remove('exporting');
      setExporting(false);
    }
  };

  const onVisualPick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const src = await fileToDataUrl(f);
    patchField('visual', { ...concept.visual, src });
  };

  /* 작성자 아바타 선택 — 동그라미 클릭 시.
   * - 64x64 square 로 리사이즈 (CSS 가 border-radius 50% + object-fit: cover 로 원형 마스킹)
   * - 큰 원본 이미지가 IndexedDB 를 차지하지 않도록 캔버스로 미리 축소
   * - JPEG 0.85 품질로 압축 → 평균 5~15KB
   * - 결과는 concept.authorAvatar 에 dataURL 로 저장
   */
  const onAvatarPick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const src = await fileToDataUrl(f);
      const resized = await resizeImageToSquare(src, 128); // 2x 픽셀 밀도 (HiDPI 대응)
      patchField('authorAvatar', resized);
      toast?.('아바타 적용 완료', 'ok');
    } catch (err) {
      toast?.('이미지 처리 실패: ' + (err.message || err), 'err');
    } finally {
      // 같은 파일을 다시 선택해도 onChange 가 다시 발화하도록 value 리셋
      e.target.value = '';
    }
  };

  /* 아바타 제거 (alt+클릭 또는 우클릭 등의 경로). 현재 UI 에서는 prompt 로 확인. */
  const clearAvatar = () => {
    if (!concept.authorAvatar) return;
    if (!confirm('아바타를 제거할까요?')) return;
    patchField('authorAvatar', null);
    toast?.('아바타 제거됨', '');
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
      {/* Top toolbar — canvas 최상단(= TopBar 바로 아래)에 sticky */}
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
          {/* 일괄 다운로드 — 연결된 GDD 가 있을 때만 활성화 */}
          <div className="bulk-download-wrap" style={{ position: 'relative' }}>
            <button
              className="btn ghost"
              onClick={() => setShowBulkMenu(v => !v)}
              disabled={!onBulkDownload || isDownloading || linkedCount === 0}
              title={linkedCount === 0 ? '연결된 기획서가 없습니다' : `${linkedCount}개 기획서 일괄 다운로드`}
            >
              {isDownloading ? '준비 중…' : `📦 일괄 다운로드 (${linkedCount})`}
            </button>
            {showBulkMenu && (
              <div className="snapshot-menu" style={{ width: 220 }}>
                <div
                  className="snapshot-item"
                  onClick={() => { setShowBulkMenu(false); onBulkDownload?.('pptx'); }}
                >
                  <div className="snap-name">↓ PPTX 일괄 다운로드</div>
                  <div className="snap-ts">.pptx × {linkedCount} → ZIP</div>
                </div>
                <div
                  className="snapshot-item"
                  onClick={() => { setShowBulkMenu(false); onBulkDownload?.('md'); }}
                >
                  <div className="snap-name">↓ Markdown 일괄 다운로드</div>
                  <div className="snap-ts">.md × {linkedCount} → ZIP</div>
                </div>
              </div>
            )}
          </div>
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

      {/* Concept page — toolbar 아래 컨텐츠 영역, 좌우/상단 여백을 이 wrapper 에 부여 */}
      <div className="concept-canvas-content">
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
              placeholder="스튜디오 이름 입력"
              style={{ borderColor: theme.main, color: theme.main }}
            />
            <div className="concept-author">
              {/* 작성자 아바타 — 동그라미 영역.
                  - 이미지 있으면 채워서 표시 (object-fit: cover)
                  - 없으면 빈 원 + 호버 시 + 아이콘
                  - 클릭 → 파일 선택 → 64x64 리사이즈 → concept.authorAvatar 에 저장
                  - alt+클릭 또는 우클릭 → 제거 (clearAvatar) */}
              <label
                className={'author-avatar' + (concept.authorAvatar ? ' has-img' : '')}
                title={concept.authorAvatar ? '클릭하여 변경 · Alt+클릭으로 제거' : '클릭하여 이미지 업로드'}
                onClick={(e) => {
                  if (e.altKey && concept.authorAvatar) { e.preventDefault(); clearAvatar(); }
                }}
                onContextMenu={(e) => {
                  if (concept.authorAvatar) { e.preventDefault(); clearAvatar(); }
                }}
              >
                {concept.authorAvatar
                  ? <img src={concept.authorAvatar} alt="" />
                  : <span className="author-avatar-plus" aria-hidden="true">+</span>}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onAvatarPick}
                  style={{ display: 'none' }}
                />
              </label>
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
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span>
                    한국어 프롬프트
                    <span style={{ marginLeft: 6, color: 'var(--text-4)', fontSize: 10, textTransform: 'none', letterSpacing: 0 }}>
                      편집 후 ↗ 버튼으로 영문에 반영 가능
                    </span>
                  </span>
                  <button
                    type="button"
                    className="visual-ko-apply-btn"
                    onClick={applyKoreanToEnglish}
                    disabled={applyingKo || !(concept.visual?.promptKo || '').trim() || isLocked('visual')}
                    title="한국어 프롬프트를 AI 가 영문으로 번역 → 영문 프롬프트에 반영"
                  >
                    {applyingKo ? '번역 중…' : '↗ 영문에 반영'}
                  </button>
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
                    {/* color-dot 패턴: 가시 swatch + 절대 위치한 투명 input.
                        Webkit/Gecko 양쪽에서 일관적으로 OS 컬러피커가 열리도록.
                        input[type=color]를 직접 보이게 두면 일부 환경에서 클릭 영역이 좁아져
                        실제로는 변경되지 않는 것처럼 느껴짐. */}
                    <label
                      className="palette-chip-wrap"
                      style={{ background: p.hex }}
                      title="클릭해서 색상 변경"
                    >
                      <input
                        type="color"
                        className="palette-chip-input"
                        value={p.hex || '#000000'}
                        onChange={(e) => {
                          const palette = [...(concept.palette || [])];
                          palette[i] = { ...palette[i], hex: e.target.value };
                          patchField('palette', palette);
                        }}
                        onInput={(e) => {
                          // input 이벤트도 트리거 — 실시간 미리보기
                          const palette = [...(concept.palette || [])];
                          palette[i] = { ...palette[i], hex: e.target.value };
                          patchField('palette', palette);
                        }}
                      />
                    </label>
                    <Editable tag="div" className="name" value={p.name} onChange={(v) => {
                      const palette = [...(concept.palette || [])];
                      palette[i] = { ...palette[i], name: v };
                      patchField('palette', palette);
                    }} />
                    <div className="hex">{(p.hex || '').toUpperCase()}</div>
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
                {i < arr.length - 1 && (
                  /* 점선 연결선 — SVG 로 렌더링.
                     이유: html2canvas 가 CSS repeating-linear-gradient 와 border-dashed 양쪽 모두
                     불완전하게 렌더링하여 PNG 다운로드 시 점선이 사라짐.
                     SVG stroke-dasharray 는 모든 환경에서 안정적으로 그려진다.
                     컨테이너 div 는 flex 비율 유지용. SVG 가 preserveAspectRatio='none' 으로 늘어남. */
                  <div className="coreloop-connector">
                    <svg
                      width="100%" height="10" viewBox="0 0 100 10"
                      preserveAspectRatio="none"
                      style={{ display: 'block', overflow: 'visible' }}
                    >
                      <line
                        x1="0" y1="5" x2="100" y2="5"
                        stroke={theme.main}
                        strokeOpacity="0.85"
                        strokeWidth="1.6"
                        strokeDasharray="4 2"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
            <button className="coreloop-add" onClick={addLoop} title="단계 추가">+</button>
          </div>
        </SectionCard>

        {/* Recommended detailed plans — priority 오름차순(=선행 작성 우선)으로 정렬해 노출. */}
        <div className="concept-recs">
          <div className="concept-recs-head">
            <h3>필요 기획서</h3>
            <div className="meta">
              {(concept.recommendedPlans || []).filter(p => p.linkedGddId).length}
              {' / '}
              {(concept.recommendedPlans || []).length} 작성됨
              <span className="meta-order"> · 선행 단계 순으로 정렬</span>
            </div>
            {(() => {
              const pending = (concept.recommendedPlans || []).filter(p => !p.linkedGddId).length;
              return (
                <button
                  className="bulk-create-btn"
                  onClick={() => onBulkCreate?.()}
                  disabled={isGenerating || pending === 0}
                  title={pending === 0 ? '미작성 기획서가 없습니다' : `미작성 ${pending}개를 선행 단계 순으로 AI 생성`}
                >
                  {isGenerating ? '생성 중…' : `✦ 미작성 전체 생성 ${pending > 0 ? `(${pending})` : ''}`}
                </button>
              );
            })()}
          </div>
          <div className="concept-rec-grid">
            {(() => {
              // priority 기준 안정 정렬 — priority 가 없거나 동률이면 원래 입력 순서 유지.
              // 단계 라벨(이전 카드와 priority 가 다르면 'N단계' divider) 도 함께 부여.
              // resolvePlanPriority 는 validators.js 의 단일 진실 공급원 — DRY 보장.
              const resolve = window.resolvePlanPriority || ((p) => 5);
              const arr = (concept.recommendedPlans || []).map((p, idx) => ({
                p, idx, prio: resolve(p),
              }));
              arr.sort((a, b) => (a.prio - b.prio) || (a.idx - b.idx));
              // map 안에서 외부 `let` 을 변이하면 Strict Mode 의 double-invoke 에서 divider
              // 가 두 배 붙는 등 비결정적이 됨. 정렬된 배열에서 'priority 가 직전과 다른가' 는
              // 인덱스 기반으로 순수 계산 가능.
              return arr.map(({ p, prio }, displayIdx) => {
                const showStageDivider = displayIdx === 0 || arr[displayIdx - 1].prio !== prio;
                return (
                  <React.Fragment key={p.id}>
                    {showStageDivider && <PlanStageDivider priority={prio} />}
                    <div
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
                        <span className="rec-priority" title={`작성 우선순위 ${prio} 단계 — ${PLAN_STAGE_LABEL[prio] || ''}`}>
                          {prio}단계
                        </span>
                        <span className="rec-status">{p.linkedGddId ? '✓ 작성됨' : '대기'}</span>
                      </div>
                      <div className="rec-title">{p.title}</div>
                      <div className="rec-desc">{p.description}</div>
                      <div className="rec-action">
                        <span></span>
                        <span className="arr">→</span>
                      </div>
                    </div>
                  </React.Fragment>
                );
              });
            })()}
            <div
              className="concept-rec-card"
              style={{ borderStyle: 'dashed', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', minHeight: 110, color: 'var(--text-3)' }}
              onClick={() => {
                // 새로 추가하는 항목은 priority 미지정 → validator 가 휴리스틱으로 보강.
                // 사용자가 후에 제목/설명을 채우면 다음 patchField 호출 시 재정렬됨.
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
      </div>{/* /concept-canvas-content */}
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

/* === 필요 기획서 priority(1~10) 단계 라벨 ===
 * concept.jsx 의 필요 기획서 카드 헤더 + 단계 divider 에서 사용. */
const PLAN_STAGE_LABEL = {
  1: '핵심 게임플레이',
  2: '코어 시스템',
  3: '데이터·진행',
  4: '콘텐츠·라이브',
  5: '메타·소셜',
  6: '온보딩·튜토리얼',
  7: '경제·BM',
  8: 'UX·아트·사운드',
  9: '기술·인프라',
  10: '운영·QA·런칭',
};

/** 같은 priority 그룹 사이에 시각적 구분선 — 가로 폭 100% 확보를 위해
 * grid 의 column 을 모두 차지하도록 inline style 로 grid-column: 1 / -1 설정. */
function PlanStageDivider({ priority }) {
  const label = PLAN_STAGE_LABEL[priority] || '';
  return (
    <div className="plan-stage-divider" data-prio={priority} style={{ gridColumn: '1 / -1' }}>
      <span className="plan-stage-num" data-prio={priority}>{priority}단계</span>
      <span className="plan-stage-label">{label}</span>
      <span className="plan-stage-rule" />
    </div>
  );
}

function SectionCard({ num, title, locked, onToggleLock, onAi, busy, theme, aiLabel, children }) {
  const bodyRef = React.useRef(null);

  /* ===== 잠금 시 편집 완전 차단 — 삼중 방어 =====
   * 1) CSS: .section-card.locked .sc-body { pointer-events:none; user-select:none }
   * 2) DOM 속성: contenteditable=false 강제 (mount 직후 + locked 변경 시)
   * 3) Capture-phase 이벤트 차단: keydown/input/paste/cut/drop/click/mousedown
   *    → 어떤 경로로 포커스가 진입해도 입력 자체가 처리 안 됨
   */

  // useLayoutEffect: paint 전에 contenteditable=false 적용 → 첫 프레임부터 잠김
  React.useLayoutEffect(() => {
    if (!bodyRef.current) return;
    const body = bodyRef.current;
    const editables = body.querySelectorAll('[contenteditable]');
    editables.forEach((el) => {
      if (locked) {
        if (!el.dataset.origContenteditable) {
          el.dataset.origContenteditable = el.getAttribute('contenteditable') || 'true';
        }
        el.setAttribute('contenteditable', 'false');
        if (document.activeElement === el) el.blur();
      } else {
        const orig = el.dataset.origContenteditable || 'true';
        el.setAttribute('contenteditable', orig);
        delete el.dataset.origContenteditable;
      }
    });
  });

  // 잠금 상태일 때만 capture-phase 이벤트 리스너 부착 — 모든 편집 시도 차단
  React.useEffect(() => {
    if (!locked || !bodyRef.current) return;
    const body = bodyRef.current;
    const block = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    };
    const events = ['keydown', 'keypress', 'beforeinput', 'input', 'paste', 'cut', 'drop', 'dragstart'];
    events.forEach(ev => body.addEventListener(ev, block, { capture: true }));
    return () => {
      events.forEach(ev => body.removeEventListener(ev, block, { capture: true }));
    };
  }, [locked]);

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
      <div
        className="sc-body"
        ref={bodyRef}
        aria-disabled={locked || undefined}
        /* inert: 가장 강력한 브라우저 네이티브 차단 (Chrome 102+, Firefox 112+).
           포커스/클릭/키보드/탭 모두 차단. 지원 안 되는 브라우저는 위 layered 방어가 백업. */
        {...(locked ? { inert: '' } : {})}
      >{children}</div>
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
function buildConceptPrompt(command, attachments, opts) {
  opts = opts || {};
  const mustHaveFeatures = Array.isArray(opts.mustHaveFeatures) ? opts.mustHaveFeatures : [];
  const textBlocks = (attachments || []).filter(a => a.kind === 'text').map((a, i) => `\n[첨부 텍스트 ${i+1}: ${a.name}]\n${a.value.slice(0, 1500)}`).join('\n');
  const imageCount = (attachments || []).filter(a => a.kind === 'image').length;
  // 이미지가 있다면 명시적으로 시각 분석 지시 — Gemini multimodal 강점 활용
  const imageNote = imageCount > 0
    ? `\n\n# 참고 이미지 분석 지시 (${imageCount}장)
사용자가 ${imageCount}장의 참고 이미지를 첨부했다. 다음 항목을 **이미지에서 직접 관찰**하여 컨셉에 반영하라:
1) **시각 스타일**: 아트 스타일(픽셀/3D/2D/카툰/리얼), 컬러 톤, 분위기, 카메라 앵글
2) **UI/UX 구조**: 화면에 보이는 UI 패널·HUD·버튼 배치 → recommendedPlans 의 "UI/UX" 영역에 구체 반영
3) **게임플레이 요소**: 캐릭터·적·아이템·환경 오브젝트 → coreLoop 및 keyUsp 에 반영
4) **장르 신호**: 인벤토리/스킬창/맵/채팅 등의 UI 요소로 장르를 추론 (MMORPG / 액션 / 시뮬레이션 등)
5) **팔레트**: 이미지의 지배적 색상 3~5색을 추출하여 palette 의 hex 값에 반영

⚠ 첨부 이미지의 게임이나 IP 를 그대로 베끼지는 말 것. 시각·구조 패턴만 참조하고, 사용자의 명령("${(command || '').slice(0, 80)}")에 맞춰 독창적으로 재해석한다.`
    : '';

  // 사용자가 ConceptBrief 에서 다중선택한 "필수 포함 기능" — AI 가 USP / coreLoop / recommendedPlans
  // 에 누락 없이 반영하도록 강한 톤으로 명시. id 가 GAME_FEATURE_CATALOG 에 없으면 무시.
  let mustHaveBlock = '';
  if (mustHaveFeatures.length > 0) {
    const resolved = mustHaveFeatures
      .map(id => lookupFeatureById(id))
      .filter(Boolean);
    if (resolved.length > 0) {
      // 카테고리별 그룹핑 + 카탈로그 순서 보존 — Map 으로 mutation 없이 reduce.
      // (이전: Object.entries 순서가 카테고리 정의 순서와 일치한다는 보장이 약함)
      const byCat = resolved.reduce(
        (acc, f) => acc.set(f.categoryLabel, [...(acc.get(f.categoryLabel) || []), f]),
        new Map()
      );
      // GAME_FEATURE_CATALOG 정의 순서대로 정렬해서 출력 (코어부터 후공정 순).
      const orderedCats = GAME_FEATURE_CATALOG
        .map(c => c.label)
        .filter(label => byCat.has(label));
      const lines = orderedCats.map(cat => {
        const items = byCat.get(cat) || [];
        const itemLines = items.map(i => `  - **${i.label}**: ${i.desc}`).join('\n');
        return `[${cat}]\n${itemLines}`;
      }).join('\n\n');
      mustHaveBlock = `\n\n# MUST-HAVE 필수 포함 기능 (${resolved.length}개) — 사용자가 명시적으로 선택
${lines}

⚠ 위 기능들은 **반드시** 다음 영역에 반영하라:
1) **keyUsp**: 위 기능 중 1~2개를 게임의 핵심 차별점(USP) 으로 격상시켜 표현.
2) **coreLoop**: 위 기능들이 자연스럽게 발동되는 순환 구조로 설계.
3) **recommendedPlans**: 각 기능마다 최소 1개의 기획서를 별도 항목으로 추가. 누락 금지.
4) **overview.genre**: 위 기능들과 정합되는 장르 선택 (예: 공성전이 선택되면 MMORPG / 자동전투 + 가챠는 모바일 RPG).
5) 기능 간 시너지·충돌을 고려 — 자동전투 + 액션 콤보는 둘 다 켜진 게임이 흔치 않으니 둘 다 선택됐다면 "자동/수동 전환" 형태로 통합 설계.`;
    }
  }

  return `${window.SENIOR_PERSONA || ''}

# 임무
30년차 풀스택 게임 메이커로서, 아래 요청을 1-Page GDD(게임 컨셉 한 장 요약)로 압축한다. 투자자·팀 리더·신규 합류자가 5분 안에 게임을 이해하고 의사결정할 수 있어야 한다.

요청: "${command}"
${textBlocks}
${imageNote}${mustHaveBlock}

# 출력 형식 (JSON만, 코드블록 없이)
{
  "title": "게임 제목 (영문/한글 무관, 외우기 쉬운 3~10자)",
  "subtitle": "한 줄 로그라인 (장르 + 핵심 동사 + 차별점, 30자 내외)",
  "badge": "짧은 팀/스튜디오 태그 (예: KGA, INDIE 등 — 비워두면 자동 빈 값)",
  "author": "김기획",
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
    { "title": "기획서 제목 (예: 인게임 데스매치 규칙 기획)", "description": "이 기획서가 다룰 핵심 내용 + 의존 시스템 1줄", "priority": 1 }
  ]
}

# 시니어 표준 작성 기준
- **subtitle**: "어떤 게임"보다 "왜 다른가"가 드러나도록. "X하는 Y 게임" 패턴 권장.
- **coreLoop**: 3~5단계. 단순 명사 나열 금지, 동사형으로. 첫 단계는 진입, 마지막은 보상/성장으로 회귀하는 구조.
- **overview**: 4개 필드 모두 "?" 금지. 합리적 디폴트로 채운다.
- **keyUsp**: 3~5개. 경쟁작 대비 차별점을 명확히. 단순 기능 나열 금지, "X가 가능하다 → 그래서 Y한 체감을 준다" 구조.
- **palette**: 5색 모두 게임 무드와 정합. 5색이 함께 놓였을 때 충돌 없이 어울리도록 (보색 무분별 사용 X).
- **recommendedPlans**: **장르·플랫폼·BM 모델에 따라 필요한 모든 기획서를 빠짐없이 나열한다. 상한 없음 (보통 20~40개, 대형 LiveOps 게임은 50개 이상도 허용).**

  **각 항목에 \`priority\` (1~10) 필드를 반드시 부여하고, 배열 자체도 priority 오름차순으로 정렬해서 출력**. priority 는 "다른 기획서가 이 문서를 참조하는가" 기준의 작성 선행 순서.

  - **1 — 핵심 게임플레이**: 메인 루프, 코어 게임플레이 (모든 기획의 출발점)
  - **2 — 코어 시스템**: 전투/이동/조작, 카메라/입력, 성장/레벨, 난이도/밸런스
  - **3 — 데이터·진행**: DB 스키마, 데이터 테이블, 진행/스테이지/챕터, 보상 테이블
  - **4 — 콘텐츠·라이브**: 모드(듀얼/팀/솔로), 이벤트, 시즌 콘텐츠, 패스, 던전/보스
  - **5 — 메타·소셜**: 로비/매칭/매치메이커, 친구/길드/소셜, 채팅, 리더보드/랭킹
  - **6 — 온보딩·튜토리얼**: 첫 플레이 플로우, 단계별 가이드, FTUE, 신규 유저 리텐션
  - **7 — 경제·BM**: 재화 체계, 상점 구조, IAP SKU, 광고 통합, 패스/구독, 가격/인플레이션
  - **8 — UX·아트·사운드**: UI 와이어/시안, 디자인 시스템, 아트 가이드, 캐릭터/배경, 모션, BGM/SFX
  - **9 — 기술·인프라**: 서버 아키텍처, 네트워크 프로토콜, 안티치트, 빌드/배포, 모니터링/분석
  - **10 — 운영·QA·마케팅·런칭**: 공지/CS/GM, 신고/제재, 테스트 플랜/자동화/인증, 키비주얼/트레일러/스토어/사전등록

  **누락 금지** — 위 영역 중 게임 특성상 명백히 불필요한 것만 제외. 동일 도메인이라도 시스템이 크면 잘게 쪼개 별도 기획서로 (예: "상점 시스템"과 "상점 UI/UX"는 분리). **description은 30~80자**, 무엇을 다루는지 + 의존성 1개 명시.
  **순서 규칙**: priority 가 같으면 코어 → 메타 → 후공정 순. 같은 priority 안에서도 의존도 낮은 것 우선.
- **visual.prompt**: 반드시 영문. 추상어 금지, 명사·형용사·동사 모두 구체적으로.

# 출력 규칙
- JSON만. 다른 설명·코드블록·주석 금지.
- 모든 한국어 값은 간결한 -다체 또는 -입니다체로 통일.
- "TBD/추후/협의" 금지.`;
}

/**
 * aiGenerateConcept(command, attachments, opts?)
 *
 * opts.onProgress({ stage, message, percent }) — 진행 상황 콜백.
 *  stages: 'prompt' → 'ai-call' → 'parsing' → 'image' → 'validating' → 'done'
 * opts.mustHaveFeatures — 사용자가 ConceptBrief 에서 다중선택한 기능 ID 배열.
 *  AI 프롬프트의 MUST-HAVE 블록으로 들어가 USP/coreLoop/recommendedPlans 에 강제 반영.
 */
async function aiGenerateConcept(command, attachments, opts) {
  opts = opts || {};
  const onProgress = typeof opts.onProgress === 'function' ? opts.onProgress : () => {};
  const mustHaveFeatures = Array.isArray(opts.mustHaveFeatures) ? opts.mustHaveFeatures : [];

  onProgress({ stage: 'prompt', message: '프롬프트 준비 중…', percent: 5 });
  const prompt = buildConceptPrompt(command, attachments, { mustHaveFeatures });

  onProgress({ stage: 'ai-call', message: 'AI 가 컨셉을 작성 중…', percent: 15 });
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

  onProgress({ stage: 'parsing', message: 'AI 응답 파싱 중…', percent: 55 });
  let parsed;
  try { parsed = window.parseAiJson(raw); } catch (e) { throw new Error(e.message || 'JSON 복구 실패'); }

  const visualPrompt = parsed.visual?.prompt || '';
  const visualPromptKo = parsed.visual?.promptKo || '';
  // AI가 생성한 팔레트 (없으면 디폴트). 이미지 생성에 전달.
  const visualPalette = parsed.palette || (CONCEPT_BLANK().palette);
  let imageSrc = null;
  if (visualPrompt) {
    onProgress({ stage: 'image', message: '🍌 nano-banana 가 컨셉 아트 생성 중… (보통 10~20초)', percent: 65 });
    try {
      // 팔레트 전달 → 이미지가 컨셉 색상에 맞춰 생성됨
      imageSrc = await window.gemini.generateImage(visualPrompt, { palette: visualPalette });
    } catch (imgErr) {
      // 이미지 생성 실패는 컨셉 생성 자체를 막지 않음 — 사용자가 수동으로 재시도 가능
      imageSrc = null;
    }
  }

  const conceptResult = {
    id: 'concept-' + uid(),
    title: parsed.title || '새 컨셉',
    subtitle: parsed.subtitle || '',
    badge: parsed.badge || '',
    author: parsed.author || '김기획',
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
      // priority 는 validator 가 누락 시 inferPlanPriority 로 자동 보강 — 여기서는 raw 그대로 전달.
      priority: (typeof p.priority === 'number' && isFinite(p.priority)) ? p.priority : undefined,
      linkedGddId: null,
    })),
    // 사용자가 선택한 필수 기능을 컨셉에 영속 — 후속 기획서 생성/재생성 시 다시 참조 가능.
    mustHaveFeatures: mustHaveFeatures.slice(),
  };
  onProgress({ stage: 'validating', message: '스키마 검증 + 자동 보정 중…', percent: 92 });
  // Schema 검증 + 자동 보정
  if (window.validateConcept) {
    const r = window.validateConcept(conceptResult);
    if (r.fixes.length && window.gddToast) {
      try { window.gddToast(`컨셉 응답 ${r.fixes.length}개 항목 자동 보정`, 'ok'); } catch {}
    }
    onProgress({ stage: 'done', message: '완료', percent: 100 });
    return r.concept;
  }
  onProgress({ stage: 'done', message: '완료', percent: 100 });
  return conceptResult;
}

Object.assign(window, {
  CONCEPT_SUPERBUMPERS, CONCEPT_BLANK,
  ConceptView, ConceptBrief,
  buildConceptPrompt, aiGenerateConcept,
  aiPartialRegen,
  GAME_FEATURE_CATALOG, lookupFeatureById,
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
  // 필수 포함 기능 — 사용자가 다중선택. AI 프롬프트의 "MUST-HAVE" 블록으로 들어감.
  const [selectedFeatures, setSelectedFeatures] = React.useState([]);
  // useCallback: FeatureCatalogPicker 의 78개 chip 에 새 함수 참조가 매 렌더 흐르지 않도록.
  const toggleFeature = React.useCallback((id) => {
    setSelectedFeatures(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);
  const setMultipleFeatures = React.useCallback((ids, add) => {
    // 카테고리 전체 토글용 — 단일 setState 로 N개 항목을 일괄 변경. 다중 setState 회피.
    setSelectedFeatures(prev => {
      if (add) {
        const next = new Set(prev);
        ids.forEach(id => next.add(id));
        return Array.from(next);
      }
      const idSet = new Set(ids);
      return prev.filter(x => !idSet.has(x));
    });
  }, []);

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
      mustHaveFeatures: selectedFeatures,
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

          {/* 1.5 필수 포함 기능 — 다중선택. 환생/자동전투/공성전 등 현존 라이브 서비스 게임 기능. */}
          <CbSection
            icon="🧩"
            title="필수 포함 기능"
            trailing={
              <div className="cb-feat-meta">
                <span className="cb-feat-count">{selectedFeatures.length}개 선택</span>
                {selectedFeatures.length > 0 && (
                  <button className="cb-feat-clear" onClick={() => setSelectedFeatures([])} title="선택 초기화">초기화</button>
                )}
              </div>
            }
          >
            <div className="cb-feat-hint">
              현존 라이브 서비스 게임에서 자주 채택되는 기능 모음. 선택한 기능은 컨셉의 USP·Core Loop·필요 기획서에 자동으로 반영됩니다.
              <span className="cb-feat-hint-em">선택 없으면 AI 가 장르에 맞춰 자유롭게 구성합니다.</span>
            </div>
            <FeatureCatalogPicker
              catalog={GAME_FEATURE_CATALOG}
              selected={selectedFeatures}
              onToggle={toggleFeature}
              onBulkToggle={setMultipleFeatures}
            />
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

/* ===== 게임 기능 카탈로그 다중선택 위젯 =====
 * - 카테고리별 그리드. 카테고리 헤더 클릭 → 카테고리 내 전체 선택/해제 토글.
 * - 각 chip 은 체크박스 + 라벨 + (호버 시) 설명 툴팁.
 * - 정렬: 카탈로그 정의 순서 그대로 (이미 priority 우선순위에 맞춰 정렬돼 있음).
 *
 * 성능:
 * - selected 배열을 Set 으로 메모이즈하여 isSelected 가 O(1).
 * - 카테고리 전체 토글은 단일 setState (onBulkToggle) 로 8회 → 1회 리렌더 단축.
 */
function FeatureCatalogPicker({ catalog, selected, onToggle, onBulkToggle }) {
  const selectedSet = React.useMemo(() => new Set(selected), [selected]);
  const toggleCategory = (cat) => {
    const ids = cat.features.map(f => f.id);
    const allSelected = ids.every(id => selectedSet.has(id));
    // allSelected → 카테고리 전체 해제, 아니면 미선택분 일괄 추가.
    onBulkToggle(ids, !allSelected);
  };

  return (
    <div className="cb-feat-catalog">
      {catalog.map(cat => {
        const catSelectedCount = cat.features.reduce(
          (acc, f) => acc + (selectedSet.has(f.id) ? 1 : 0),
          0
        );
        const allSelected = catSelectedCount === cat.features.length && cat.features.length > 0;
        return (
          <div className="cb-feat-cat" key={cat.id}>
            <div className="cb-feat-cat-head">
              <span className="cb-feat-cat-icon">{cat.icon}</span>
              <span className="cb-feat-cat-label">{cat.label}</span>
              <span className="cb-feat-cat-count">{catSelectedCount}/{cat.features.length}</span>
              <button
                className={'cb-feat-cat-all ' + (allSelected ? 'on' : '')}
                onClick={() => toggleCategory(cat)}
                title={allSelected ? '카테고리 전체 해제' : '카테고리 전체 선택'}
              >
                {allSelected ? '전체 해제' : '전체 선택'}
              </button>
            </div>
            <div className="cb-feat-chip-grid">
              {cat.features.map(f => {
                const on = selectedSet.has(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    className={'cb-feat-chip ' + (on ? 'on' : '')}
                    onClick={() => onToggle(f.id)}
                    title={f.desc}
                    aria-label={`${f.label}${on ? ' (선택됨)' : ''} — ${f.desc}`}
                    aria-pressed={on}
                  >
                    <span className="cb-feat-chip-check" aria-hidden>{on ? '✓' : '+'}</span>
                    <span className="cb-feat-chip-label">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
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
