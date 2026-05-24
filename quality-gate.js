/* === GDD 품질 게이트 ===
 * 생성된 GDD 를 7개 차원으로 채점 + 90점 미만이면 보강 체크리스트 노출.
 *
 * 차원 (가중치):
 *  - 완결성     (25): 필수 슬라이드 타입 누락 여부
 *  - 정합성     (20): 용어 일관성, 교차 참조 무결성
 *  - 수치 구체성 (15): 모호어("TBD","적절한","충분한") 비율
 *  - 테스트 가능성 (15): acceptance-criteria 슬라이드 + Given/When/Then 완성도
 *  - 이미지 충실도 (10): cover/section-divider/ui-design/image-embed imageSrc 채움 비율
 *  - 위험 관리   (10): risk-register + 모든 위험에 mitigation
 *  - API/스키마 명시 (5): api-contract / data-table 비율
 *
 * 다운로드 합격 기준 = 90 점 (PASS_THRESHOLD).
 * 90 점 미만이면 자동 보강 사이클 / 사용자 경고 / 다운로드 confirm 활성.
 */
(function () {
  'use strict';

  const PASS_THRESHOLD = 90;

  const REQUIRED_TYPES = [
    'cover', 'toc', 'intent', 'terms', 'rules',
    'data-table', 'flow', 'ui-design', 'resources',
  ];
  const ENGINEER_TYPES = [
    'balance-table', 'state-machine', 'api-contract',
    'acceptance-criteria', 'telemetry', 'risk-register', 'roadmap',
  ];
  const IMAGE_TYPES = ['cover', 'section-divider', 'ui-design', 'image-embed'];

  // 모호어 패턴 — 한국어 + 영문 모두
  const VAGUE_PATTERNS = [
    /\bTBD\b/gi, /\bTODO\b/gi, /\bN\/A\b/gi,
    /추후[\s]*정의/g, /추후[\s]*결정/g, /협의[\s]*필요/g, /미정/g,
    /적절(한|히)/g, /충분(한|히)/g, /적당(한|히)/g, /원활(한|히)/g,
    /\b향후\b/g, /\b추후\b/g,
    /재미있게/g, /직관적으로(?!\s+\d)/g, /자연스럽게/g,
  ];

  function collectText(node, acc) {
    if (typeof node === 'string') {
      acc.push(node);
      return;
    }
    if (Array.isArray(node)) {
      for (const n of node) collectText(n, acc);
      return;
    }
    if (node && typeof node === 'object') {
      for (const k of Object.keys(node)) collectText(node[k], acc);
    }
  }

  function scoreCompleteness(project) {
    const types = new Set((project.slides || []).map(s => s.type));
    const presentRequired = REQUIRED_TYPES.filter(t => types.has(t)).length;
    const presentEngineer = ENGINEER_TYPES.filter(t => types.has(t)).length;
    // 9 필수 중 N개 (16점) + 7 엔지니어 중 N개 (9점)
    const reqPct = presentRequired / REQUIRED_TYPES.length;
    const engPct = presentEngineer / ENGINEER_TYPES.length;
    const points = Math.round(reqPct * 16 + engPct * 9);
    const missing = {
      required: REQUIRED_TYPES.filter(t => !types.has(t)),
      engineer: ENGINEER_TYPES.filter(t => !types.has(t)),
    };
    return { dim: 'completeness', label: '완결성', max: 25, points, missing };
  }

  function scoreConsistency(project) {
    // 용어 (terms.rows[].term) 가 다른 슬라이드에서 사용되는 비율
    const termsSlide = (project.slides || []).find(s => s.type === 'terms');
    if (!termsSlide) {
      return { dim: 'consistency', label: '정합성', max: 20, points: 10, note: 'terms 슬라이드 없음' };
    }
    const terms = (termsSlide.data?.rows || []).map(r => (r.term || '').trim()).filter(Boolean);
    if (terms.length === 0) {
      return { dim: 'consistency', label: '정합성', max: 20, points: 10, note: 'terms 비어있음' };
    }
    const allText = [];
    for (const s of project.slides || []) {
      if (s.type === 'terms') continue;
      collectText(s.data, allText);
    }
    const joined = allText.join(' ');
    const used = terms.filter(t => joined.includes(t));
    const pct = used.length / terms.length;
    const points = Math.round(pct * 20);
    return { dim: 'consistency', label: '정합성', max: 20, points, note: `${used.length}/${terms.length} 용어 재사용` };
  }

  function scoreVagueness(project) {
    const allText = [];
    collectText(project, allText);
    const joined = allText.join(' ');
    const totalChars = joined.length || 1;
    let vagueCount = 0;
    for (const re of VAGUE_PATTERNS) {
      const matches = joined.match(re);
      if (matches) vagueCount += matches.length;
    }
    // 1000자당 5회 이상이면 0점, 0회면 15점
    const ratio = vagueCount / (totalChars / 1000);
    const points = Math.max(0, Math.round(15 - ratio * 3));
    return { dim: 'vagueness', label: '수치 구체성', max: 15, points, note: `모호어 ${vagueCount}회` };
  }

  function scoreTestability(project) {
    const acSlides = (project.slides || []).filter(s => s.type === 'acceptance-criteria');
    if (acSlides.length === 0) {
      return { dim: 'testability', label: '테스트 가능성', max: 15, points: 0, note: 'acceptance-criteria 슬라이드 없음' };
    }
    let totalCriteria = 0, completeCriteria = 0;
    for (const s of acSlides) {
      for (const c of (s.data?.criteria || [])) {
        totalCriteria++;
        if (c.given && c.when && c.then) completeCriteria++;
      }
    }
    if (totalCriteria === 0) {
      return { dim: 'testability', label: '테스트 가능성', max: 15, points: 3, note: 'criteria 비어있음' };
    }
    const pct = completeCriteria / totalCriteria;
    const points = Math.min(15, Math.round(pct * 12 + Math.min(3, acSlides.length)));
    return { dim: 'testability', label: '테스트 가능성', max: 15, points, note: `${completeCriteria}/${totalCriteria} criterion 완전` };
  }

  function scoreImages(project) {
    const targets = (project.slides || []).filter(s => IMAGE_TYPES.includes(s.type));
    if (targets.length === 0) {
      return { dim: 'images', label: '이미지 충실도', max: 10, points: 5, note: '이미지 슬라이드 없음' };
    }
    const filled = targets.filter(s => s.data?.imageSrc).length;
    const pct = filled / targets.length;
    const points = Math.round(pct * 10);
    return { dim: 'images', label: '이미지 충실도', max: 10, points, note: `${filled}/${targets.length} 이미지 채움` };
  }

  function scoreRisk(project) {
    const riskSlide = (project.slides || []).find(s => s.type === 'risk-register');
    if (!riskSlide) {
      return { dim: 'risk', label: '위험 관리', max: 10, points: 0, note: 'risk-register 슬라이드 없음' };
    }
    const risks = riskSlide.data?.risks || [];
    if (risks.length === 0) {
      return { dim: 'risk', label: '위험 관리', max: 10, points: 2, note: 'risks 비어있음' };
    }
    const withMitigation = risks.filter(r => r.mitigation && r.mitigation.trim()).length;
    const pct = withMitigation / risks.length;
    const points = Math.min(10, Math.round(pct * 7 + Math.min(3, risks.length)));
    return { dim: 'risk', label: '위험 관리', max: 10, points, note: `${withMitigation}/${risks.length} 위험에 완화책` };
  }

  function scoreApi(project) {
    const apiSlides = (project.slides || []).filter(s => s.type === 'api-contract');
    const dataSlides = (project.slides || []).filter(s => s.type === 'data-table');
    if (apiSlides.length === 0 && dataSlides.length === 0) {
      return { dim: 'api', label: 'API/스키마', max: 5, points: 0, note: '명세 슬라이드 없음' };
    }
    // 각각 1장 이상 + api 의 request/response 가 채워졌는지
    const apiOk = apiSlides.filter(s => (s.data?.request || '').trim() && (s.data?.response || '').trim()).length;
    const dataOk = dataSlides.filter(s => (s.data?.rows || []).length >= 4).length;
    const points = Math.min(5, Math.round(Math.min(2, apiOk) + Math.min(3, dataOk)));
    return { dim: 'api', label: 'API/스키마', max: 5, points, note: `api ${apiOk} · data ${dataOk}` };
  }

  /** 전체 점수 계산 — 0~100, 7개 차원의 상세 결과 포함 */
  function scoreProject(project) {
    if (!project || !Array.isArray(project.slides)) {
      return { total: 0, grade: 'F', dims: [], canDownload: false };
    }
    const dims = [
      scoreCompleteness(project),
      scoreConsistency(project),
      scoreVagueness(project),
      scoreTestability(project),
      scoreImages(project),
      scoreRisk(project),
      scoreApi(project),
    ];
    const total = dims.reduce((s, d) => s + d.points, 0);
    const grade = total >= 90 ? 'A+' : total >= 80 ? 'A' : total >= 70 ? 'B' : total >= 60 ? 'C' : total >= 50 ? 'D' : 'F';
    return {
      total,
      grade,
      dims,
      canDownload: total >= PASS_THRESHOLD,
      passThreshold: PASS_THRESHOLD,
      summary: dims.map(d => `${d.label} ${d.points}/${d.max}`).join(' · '),
    };
  }

  /** 권장 보강 조치 — 점수가 낮은 차원 별 구체 조치
   * 합격 기준이 90 점이므로 각 차원도 90% 이상 채워야 한다 — 기준 0.9 미만이면 보강 권장.
   */
  function suggestImprovements(project, score) {
    const out = [];
    for (const d of score.dims) {
      const pct = d.points / d.max;
      if (pct >= 0.9) continue;
      if (d.dim === 'completeness') {
        if (d.missing.required.length) out.push({ priority: 'HIGH', action: `필수 슬라이드 추가: ${d.missing.required.join(', ')}` });
        if (d.missing.engineer.length) out.push({ priority: 'MEDIUM', action: `엔지니어 슬라이드 추가: ${d.missing.engineer.join(', ')}` });
      }
      if (d.dim === 'consistency') {
        out.push({ priority: 'MEDIUM', action: 'terms 슬라이드의 용어들이 다른 슬라이드에서 실제 사용되도록 본문 보강' });
      }
      if (d.dim === 'vagueness') {
        out.push({ priority: 'HIGH', action: '"TBD"/"적절한"/"충분한" 등 모호어를 구체 수치·기준으로 치환' });
      }
      if (d.dim === 'testability') {
        out.push({ priority: 'HIGH', action: 'acceptance-criteria 슬라이드 추가 또는 각 criterion 에 Given/When/Then 완성' });
      }
      if (d.dim === 'images') {
        out.push({ priority: 'LOW', action: '`🍌 누락된 이미지 모두 생성` 명령 (Cmd+K) 으로 일괄 보강' });
      }
      if (d.dim === 'risk') {
        out.push({ priority: 'MEDIUM', action: 'risk-register 슬라이드 추가 및 각 위험에 mitigation 명시' });
      }
      if (d.dim === 'api') {
        out.push({ priority: 'MEDIUM', action: 'api-contract 슬라이드 추가 (request/response 스키마 포함) 및 data-table 행수 4개 이상' });
      }
    }
    return out;
  }

  /** 점수가 낮은 차원만 우선순위(HIGH→LOW) + 점수 차(맥스 대비 부족분) 순으로 정렬해서 반환.
   * 자동 보강 사이클에서 어떤 차원을 먼저 끌어올려야 90점에 도달하는지 결정할 때 사용.
   */
  function weakDimensions(score) {
    if (!score || !Array.isArray(score.dims)) return [];
    return score.dims
      .map(d => ({ ...d, deficit: d.max - d.points, pct: d.points / d.max }))
      .filter(d => d.pct < 0.9)
      .sort((a, b) => b.deficit - a.deficit);
  }

  window.gddQualityGate = {
    scoreProject,
    suggestImprovements,
    weakDimensions,
    REQUIRED_TYPES,
    ENGINEER_TYPES,
    PASS_THRESHOLD,
  };
})();
