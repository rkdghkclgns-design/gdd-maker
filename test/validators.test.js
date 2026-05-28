/* === validators.js 순수 함수 테스트 ===
 *
 * 실행: node --test test/   또는   npm test
 *
 * validators.js 는 브라우저 IIFE 라 window.* 에 export 함. 여기서는 global.window 를
 * shim 으로 제공한 뒤 require 해서 노출된 함수를 테스트한다. (bundler/jsdom 불필요)
 *
 * 대상:
 *  - sanitizeImageSrc  : URL 스킴 화이트리스트 (보안 chokepoint)
 *  - inferPlanPriority : 기획서 작성 선행 단계 추정 휴리스틱 (1~10)
 *  - resolvePlanPriority : priority clamp/round/fallback 단일 진실 공급원
 *  - validateConcept   : mustHaveFeatures 정규화 + priority 보강 + legacy 마이그레이션
 */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

// validators.js 가 참조하는 최소 window shim
global.window = {};
require(path.join(__dirname, '..', 'validators.js'));
const {
  sanitizeImageSrc,
  inferPlanPriority,
  resolvePlanPriority,
  validateConcept,
} = global.window;

test('validators.js 가 모든 순수 함수를 window 에 노출한다', () => {
  assert.equal(typeof sanitizeImageSrc, 'function');
  assert.equal(typeof inferPlanPriority, 'function');
  assert.equal(typeof resolvePlanPriority, 'function');
  assert.equal(typeof validateConcept, 'function');
});

test('sanitizeImageSrc — 위험 스킴 차단', () => {
  // 공격 벡터는 모두 null
  for (const bad of [
    'javascript:alert(1)',
    'JAVASCRIPT:alert(1)',
    'data:text/html,<script>x</script>',
    'vbscript:msgbox',
    'file:///C:/passwd',
    'chrome-extension://abc/x.js',
    '  javascript:alert(1)  ',  // 앞 공백
  ]) {
    assert.equal(sanitizeImageSrc(bad), null, `차단 실패: ${bad}`);
  }
});

test('sanitizeImageSrc — 정상 스킴 통과', () => {
  for (const good of [
    'data:image/png;base64,iVBORw0KGgo=',
    'data:image/jpeg;base64,/9j/4AAQ',
    'blob:https://example.com/abc-123',
    'idb-image://uuid-1234',
    'https://cdn.example.com/img.png',
    'http://example.com/img.png',
    '/local/relative.png',
    './rel.png',
  ]) {
    assert.equal(sanitizeImageSrc(good), good, `통과 실패: ${good}`);
  }
});

test('sanitizeImageSrc — falsy/비문자열 입력은 null', () => {
  assert.equal(sanitizeImageSrc(null), null);
  assert.equal(sanitizeImageSrc(undefined), null);
  assert.equal(sanitizeImageSrc(''), null);
  assert.equal(sanitizeImageSrc(123), null);
  assert.equal(sanitizeImageSrc({}), null);
});

test('inferPlanPriority — 단계별 키워드 매트릭스', () => {
  const cases = [
    ['코어 루프 기획', '메인 루프 정의', 1],
    ['전투 시스템 기획', '캐릭터 전투 로직 정의', 2],
    ['데이터 스키마', 'DB 테이블 정의', 3],
    ['시즌 패스 콘텐츠', '시즌별 보상 구조', 4],
    ['매칭 시스템', '매치메이커 알고리즘', 5],
    ['튜토리얼 플로우', 'FTUE 단계별', 6],
    ['상점 BM', 'IAP SKU 정의', 7],
    ['UI 와이어프레임', '디자인 시스템', 8],
    ['서버 아키텍처', '네트워크 프로토콜', 9],
    ['스토어 페이지 마케팅', '트레일러와 키비주얼', 10],
    ['CBT 출시 체크리스트', '인증 등급 심의', 10],
  ];
  for (const [title, desc, expected] of cases) {
    assert.equal(inferPlanPriority(title, desc), expected, `${title}`);
  }
});

test('inferPlanPriority — 애매한 입력은 기본값 5', () => {
  assert.equal(inferPlanPriority('알 수 없는 항목', '내용 없음'), 5);
  assert.equal(inferPlanPriority('', ''), 5);
  assert.equal(inferPlanPriority(null, null), 5);
});

test('inferPlanPriority — 마케팅(10)이 온보딩(6)의 "가이드"보다 우선', () => {
  // "키비주얼 가이드" 의 '가이드' 가 온보딩으로 오분류되지 않아야 함
  assert.equal(inferPlanPriority('마케팅 키비주얼 가이드', '트레일러 제작 가이드'), 10);
});

test('resolvePlanPriority — 숫자 priority clamp + round', () => {
  assert.equal(resolvePlanPriority({ priority: 1 }), 1);
  assert.equal(resolvePlanPriority({ priority: 10 }), 10);
  assert.equal(resolvePlanPriority({ priority: 0 }), 1);    // clamp min
  assert.equal(resolvePlanPriority({ priority: 99 }), 10);  // clamp max
  assert.equal(resolvePlanPriority({ priority: 3.7 }), 4);  // round
  assert.equal(resolvePlanPriority({ priority: -5 }), 1);   // clamp min
});

test('resolvePlanPriority — priority 없으면 inferPlanPriority 폴백', () => {
  assert.equal(resolvePlanPriority({ title: '전투 시스템', description: '' }), 2);
  assert.equal(resolvePlanPriority({ title: '서버 아키텍처' }), 9);
  assert.equal(resolvePlanPriority({}), 5);   // 아무 정보 없음 → 기본 5
  assert.equal(resolvePlanPriority(null), 5); // null 안전
});

test('resolvePlanPriority — 잘못된 priority 타입은 휴리스틱 폴백', () => {
  // NaN / 문자열 / boolean → 무시하고 inferPlanPriority
  assert.equal(resolvePlanPriority({ priority: NaN, title: '전투' }), 2);
  assert.equal(resolvePlanPriority({ priority: 'high', title: '서버 네트워크' }), 9);
});

test('validateConcept — mustHaveFeatures 정규화', () => {
  const { concept } = validateConcept({
    title: 'X',
    mustHaveFeatures: ['rebirth', '', '  auto_battle  ', 123, null, 'siege_war'],
  });
  // 빈 문자열/숫자/null 제거 + trim
  assert.deepEqual(concept.mustHaveFeatures, ['rebirth', 'auto_battle', 'siege_war']);
});

test('validateConcept — mustHaveFeatures 누락 시 빈 배열', () => {
  const { concept } = validateConcept({ title: 'X' });
  assert.deepEqual(concept.mustHaveFeatures, []);
});

test('validateConcept — recommendedPlans priority 보강 (legacy 마이그레이션)', () => {
  const { concept } = validateConcept({
    title: 'X',
    recommendedPlans: [
      { id: 'a', title: '전투 시스템', description: '' },   // priority 없음 → 2 추정
      { id: 'b', title: '마케팅 런칭', description: '', priority: 10 }, // 명시값 유지
      { id: 'c', title: '서버', description: '', priority: 99 }, // clamp → 9? (서버=9 휴리스틱 아님, priority 명시값 clamp)
    ],
  });
  assert.equal(concept.recommendedPlans[0].priority, 2);  // 휴리스틱
  assert.equal(concept.recommendedPlans[1].priority, 10); // 명시값
  assert.equal(concept.recommendedPlans[2].priority, 10); // 99 → clamp 10
});

test('validateConcept — visual.src 위험 스킴 제거', () => {
  const { concept, fixes } = validateConcept({
    title: 'X',
    visual: { src: 'javascript:alert(1)', prompt: 'p', promptKo: '' },
  });
  assert.equal(concept.visual.src, null);
  assert.ok(fixes.some(f => /visual\.src/.test(f)), 'fixes 에 visual.src 제거 기록');
});

test('validateConcept — visual.src 정상 data URL 유지', () => {
  const ok = 'data:image/png;base64,iVBORw0KGgo=';
  const { concept } = validateConcept({
    title: 'X',
    visual: { src: ok, prompt: 'p', promptKo: '' },
  });
  assert.equal(concept.visual.src, ok);
});
