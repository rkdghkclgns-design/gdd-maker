/* === 장르 템플릿 10종 ===
 * 컨셉/기획서 생성 시 장르를 선택하면 해당 장르의 표준 슬라이드 스택으로 시작.
 * 각 장르는: { id, name, badge, defaultUSP[], coreSlides[] } 로 구성.
 * coreSlides 는 type 만 나열 — 실제 data 는 AI 가 채움.
 */
(function () {
  'use strict';

  const GENRES = [
    {
      id: 'pvp-shooter',
      name: 'PvP 슈터',
      badge: 'SHOOTER',
      keywords: ['hero', 'fps', 'tps', '5v5', '배틀로얄', '경쟁'],
      description: '경쟁 매치 기반 PvP 슈팅 게임 — 매치메이킹, 무기 밸런싱, 안티치트 핵심',
      defaultUSP: [
        '5초 안에 매치 진입 (UX)',
        '무기 12종 × 캐릭터 8명 = 96 조합',
        '64 tickrate 권속 서버',
        '시즌별 메타 변동 (3개월 사이클)',
      ],
      coreSlides: [
        'cover','history','toc',
        'section-divider','intent','terms',
        'section-divider','flow','sequence-diagram','diagram','state-machine','class-diagram','rules',
        'section-divider','data-table','data-table','balance-table',
        'section-divider','api-contract','api-contract','api-contract','telemetry',
        'section-divider','acceptance-criteria','acceptance-criteria',
        'section-divider','ui-design','ui-design','image-embed','image-embed','image-embed',
        'section-divider','risk-register','roadmap','resources',
      ],
    },
    {
      id: 'deckbuilder-roguelike',
      name: '덱빌더 로그라이크',
      badge: 'DECKBUILDER',
      keywords: ['카드', '덱', '로그라이크', 'slay', 'sts'],
      description: '카드 컬렉션 + 덱빌딩 + 절차 생성 던전. 카드 풀, 시너지, 보스 패턴 핵심',
      defaultUSP: [
        '카드 200장+ 6 아키타입',
        '한 판 30분, 매번 다른 빌드',
        '미트 메타 진행도 + 도전 모드 20단계',
        '오프라인 단일 플레이 (서버 의존 최소)',
      ],
      coreSlides: [
        'cover','history','toc',
        'section-divider','intent','terms',
        'section-divider','flow','flow','state-machine','class-diagram','rules',
        'section-divider','data-table','data-table','data-table','balance-table','balance-table',
        'section-divider','telemetry',
        'section-divider','acceptance-criteria','acceptance-criteria',
        'section-divider','ui-design','ui-design','image-embed','image-embed','image-embed','image-embed',
        'section-divider','risk-register','roadmap','resources',
      ],
    },
    {
      id: 'auto-runner',
      name: '오토 러너',
      badge: 'RUNNER',
      keywords: ['러너', '하이퍼캐주얼', 'endless', '오토'],
      description: '캐주얼 짧은 세션 러너. 광고 BM, 무한 진행, 매일 출석 핵심',
      defaultUSP: [
        '한 판 2분, 1탭 컨트롤',
        '광고 시청 부활 + 재화 두 배',
        '주간 이벤트 5종',
        'iOS/Android 무한 진행 동기화',
      ],
      coreSlides: [
        'cover','history','toc',
        'section-divider','intent','terms',
        'section-divider','flow','state-machine','class-diagram','rules',
        'section-divider','data-table','data-table','balance-table',
        'section-divider','api-contract','telemetry',
        'section-divider','acceptance-criteria',
        'section-divider','ui-design','ui-design','image-embed','image-embed',
        'section-divider','risk-register','roadmap','resources',
      ],
    },
    {
      id: 'action-rpg',
      name: '액션 RPG',
      badge: 'ARPG',
      keywords: ['rpg', '액션', '몹', '루팅', '소울라이크'],
      description: '필드/던전 탐험 + 전투 + 루팅 + 성장. 콤보 시스템, 빌드 다양성, 보스전 핵심',
      defaultUSP: [
        '코어 콤보 시스템 (8 무기군)',
        '레벨 1-100 + 전직 12종',
        '협동 4인 던전',
        '계절 콘텐츠 분기마다',
      ],
      coreSlides: [
        'cover','history','toc',
        'section-divider','intent','terms',
        'section-divider','flow','flow','sequence-diagram','diagram','state-machine','class-diagram','rules',
        'section-divider','data-table','data-table','data-table','balance-table','balance-table',
        'section-divider','api-contract','api-contract','telemetry',
        'section-divider','acceptance-criteria','acceptance-criteria',
        'section-divider','ui-design','ui-design','ui-design','image-embed','image-embed','image-embed',
        'section-divider','risk-register','roadmap','resources',
      ],
    },
    {
      id: 'match-3',
      name: '매치-3',
      badge: 'MATCH3',
      keywords: ['매치3', '퍼즐', 'candy', '3매치'],
      description: '3개 매칭 퍼즐 + 레벨 진행 + 라이브 이벤트. 레벨 디자인, 난이도 곡선, ARPDAU 핵심',
      defaultUSP: [
        '레벨 200+ (런칭 시), 매주 5개 추가',
        '특수 블록 8종 × 콤보 시너지',
        '라이브 이벤트 주간 1회',
        '유저당 첫 30일 평균 50레벨',
      ],
      coreSlides: [
        'cover','history','toc',
        'section-divider','intent','terms',
        'section-divider','flow','state-machine','class-diagram','rules',
        'section-divider','data-table','data-table','balance-table','balance-table',
        'section-divider','api-contract','telemetry',
        'section-divider','acceptance-criteria','acceptance-criteria',
        'section-divider','ui-design','ui-design','image-embed','image-embed',
        'section-divider','risk-register','roadmap','resources',
      ],
    },
    {
      id: 'sim-management',
      name: '경영 시뮬레이션',
      badge: 'SIM',
      keywords: ['시뮬레이션', '경영', '타이쿤', '관리'],
      description: '자원 관리 + 시간 진행 + 의사결정. 경제 시스템, 자동화, 진행도 핵심',
      defaultUSP: [
        '12개 시설 × 24 직원 슬롯',
        '실시간 + 30분 자동 진행',
        '경쟁 리더보드 주간',
        '오프라인 보상 24시간',
      ],
      coreSlides: [
        'cover','history','toc',
        'section-divider','intent','terms',
        'section-divider','flow','state-machine','class-diagram','rules',
        'section-divider','data-table','data-table','data-table','balance-table','balance-table',
        'section-divider','api-contract','telemetry',
        'section-divider','acceptance-criteria','acceptance-criteria',
        'section-divider','ui-design','ui-design','image-embed','image-embed',
        'section-divider','risk-register','roadmap','resources',
      ],
    },
    {
      id: 'story-adventure',
      name: '스토리 어드벤처',
      badge: 'STORY',
      keywords: ['스토리', '어드벤처', '선택지', '비주얼노벨'],
      description: '내러티브 중심 + 선택지 분기 + 캐릭터 관계. 시나리오 트리, 감정 곡선, 회차 플레이 핵심',
      defaultUSP: [
        '챕터 10화 × 평균 3 엔딩',
        '캐릭터 8명 + 관계도',
        '에피소드 별 30~45분',
        '회차 플레이 시 잠금 해제 컨텐츠',
      ],
      coreSlides: [
        'cover','history','toc',
        'section-divider','intent','terms',
        'section-divider','flow','flow','state-machine','class-diagram','rules',
        'section-divider','data-table','data-table',
        'section-divider','telemetry',
        'section-divider','acceptance-criteria','acceptance-criteria',
        'section-divider','ui-design','ui-design','image-embed','image-embed','image-embed','image-embed','image-embed',
        'section-divider','risk-register','roadmap','resources',
      ],
    },
    {
      id: 'social-life',
      name: '소셜/생활',
      badge: 'SOCIAL',
      keywords: ['소셜', 'sns', '꾸미기', '커뮤니티', '아바타'],
      description: '아바타 + 친구 + 공유 + 꾸미기. 소셜 그래프, 컨텐츠 공유, UGC 핵심',
      defaultUSP: [
        '아바타 부위 12종 × 평균 200개 아이템',
        '실시간 친구 채팅 + 비동기 방문',
        '주간 패션쇼 이벤트',
        'UGC 마켓 (디자이너 수익)',
      ],
      coreSlides: [
        'cover','history','toc',
        'section-divider','intent','terms',
        'section-divider','flow','sequence-diagram','diagram','class-diagram','rules',
        'section-divider','data-table','data-table','data-table','balance-table',
        'section-divider','api-contract','api-contract','api-contract','telemetry',
        'section-divider','acceptance-criteria','acceptance-criteria',
        'section-divider','ui-design','ui-design','image-embed','image-embed','image-embed',
        'section-divider','risk-register','roadmap','resources',
      ],
    },
    {
      id: 'mmo',
      name: 'MMO/MMORPG',
      badge: 'MMO',
      keywords: ['mmo', 'mmorpg', '대규모', '월드', '오픈월드'],
      description: '대규모 동시 접속 + 지속 세계 + PvE/PvP. 서버 아키텍처, 동기화, 길드 시스템 핵심',
      defaultUSP: [
        '한 채널 300인 동시 활동',
        '월드 보스 주 2회 + 길드전 시즌',
        '직업 12종 × 스킬 트리 깊이 6',
        '아이템 거래 경제 + 옥션',
      ],
      coreSlides: [
        'cover','history','toc',
        'section-divider','intent','terms',
        'section-divider','flow','flow','sequence-diagram','sequence-diagram','diagram','state-machine','class-diagram','class-diagram','rules',
        'section-divider','data-table','data-table','data-table','balance-table','balance-table',
        'section-divider','api-contract','api-contract','api-contract','api-contract','telemetry',
        'section-divider','acceptance-criteria','acceptance-criteria','acceptance-criteria',
        'section-divider','ui-design','ui-design','image-embed','image-embed','image-embed',
        'section-divider','risk-register','risk-register','roadmap','resources',
      ],
    },
    {
      id: 'sandbox-creative',
      name: '샌드박스/크리에이티브',
      badge: 'SANDBOX',
      keywords: ['샌드박스', '크리에이티브', '빌딩', '월드', 'minecraft'],
      description: '플레이어 창작 + 자유도 + UGC. 빌딩 시스템, 물리 시뮬, 공유 핵심',
      defaultUSP: [
        '블록 100종 + 기계 시스템',
        '월드 저장 + 친구 초대',
        '주간 컨테스트 (Featured 월드)',
        '모드 SDK 공개 (선택)',
      ],
      coreSlides: [
        'cover','history','toc',
        'section-divider','intent','terms',
        'section-divider','flow','sequence-diagram','diagram','class-diagram','class-diagram','rules',
        'section-divider','data-table','data-table','data-table','balance-table',
        'section-divider','api-contract','api-contract','telemetry',
        'section-divider','acceptance-criteria','acceptance-criteria',
        'section-divider','ui-design','ui-design','image-embed','image-embed','image-embed',
        'section-divider','risk-register','roadmap','resources',
      ],
    },
  ];

  function genreById(id) { return GENRES.find(g => g.id === id) || null; }
  function suggestGenre(text) {
    if (!text) return null;
    const lower = String(text).toLowerCase();
    let best = null, bestScore = 0;
    for (const g of GENRES) {
      const score = (g.keywords || []).reduce((s, kw) => s + (lower.includes(kw.toLowerCase()) ? 1 : 0), 0);
      if (score > bestScore) { best = g; bestScore = score; }
    }
    return best;
  }

  window.gddGenres = { GENRES, genreById, suggestGenre };
})();
