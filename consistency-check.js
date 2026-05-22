/* === Consistency checker ===
 * 한 컨셉의 모든 연결 GDD를 분석해 정합성 이슈를 자동 감지.
 * - 용어 충돌: 같은 정의가 다른 단어로 (또는 다른 정의가 같은 단어로)
 * - 데이터 스키마 충돌: field 명명 규칙 불일치 (camelCase/snake_case 혼용 등)
 * - 미작성 필수 필드: rows/items/cards/blocks 비어있음
 * - 컨셉 USP/코어루프 미반영: 어떤 USP 키워드도 등장하지 않는 기획서
 *
 * 노출: window.runConsistencyCheck(concept, projects)
 */
(function () {

  function normalize(s) {
    return (s || '').toString().trim().toLowerCase();
  }

  function isCamel(s) { return /^[a-z][a-zA-Z0-9]*$/.test(s) && /[A-Z]/.test(s); }
  function isSnake(s) { return /^[a-z][a-z0-9_]*$/.test(s) && /_/.test(s); }

  function collectTermsFromGdd(gdd) {
    const out = [];
    for (const s of (gdd.slides || [])) {
      if (s.type !== 'terms') continue;
      for (const r of (s.data?.rows || [])) {
        if (r.term && r.def) out.push({ term: r.term, def: r.def, gddId: gdd.id, gddTitle: gdd.title, slideId: s.id });
      }
    }
    return out;
  }

  function collectFieldsFromGdd(gdd) {
    const out = [];
    for (const s of (gdd.slides || [])) {
      if (s.type !== 'data-table') continue;
      for (const r of (s.data?.rows || [])) {
        const f = r.field || r.name || r.term;
        if (f) out.push({ field: f, table: s.data?.title, type: r.type, gddId: gdd.id, gddTitle: gdd.title, slideId: s.id });
      }
    }
    return out;
  }

  function collectEmptyArraysFromGdd(gdd) {
    const out = [];
    for (const s of (gdd.slides || [])) {
      const d = s.data || {};
      const checkArr = (key) => {
        const v = d[key];
        if (Array.isArray(v) && v.length === 0) {
          out.push({ slideId: s.id, slideType: s.type, slideTitle: d.title || '', field: key, gddId: gdd.id, gddTitle: gdd.title });
        }
      };
      ['rows', 'cards', 'blocks', 'entries', 'items', 'nodes', 'edges', 'callouts', 'categories'].forEach(checkArr);
    }
    return out;
  }

  function similarity(a, b) {
    if (!a || !b) return 0;
    const sa = a.split(/\s+/).filter(Boolean);
    const sb = b.split(/\s+/).filter(Boolean);
    if (!sa.length || !sb.length) return 0;
    const set = new Set(sa);
    let common = 0;
    for (const w of sb) if (set.has(w)) common++;
    return common / Math.max(sa.length, sb.length);
  }

  /** 메인 진입점 */
  function runConsistencyCheck(concept, projects) {
    const issues = [];

    // 컨셉에 연결된 모든 GDD
    const linkedGddIds = new Set((concept.recommendedPlans || []).map(p => p.linkedGddId).filter(Boolean));
    const gdds = projects.filter(p => linkedGddIds.has(p.id));

    // 1) 용어 정의 충돌 — 같은 term이지만 def가 다름
    const termsByGdd = gdds.map(collectTermsFromGdd);
    const allTerms = termsByGdd.flat();
    const termMap = new Map(); // norm(term) -> [entries]
    for (const t of allTerms) {
      const key = normalize(t.term);
      if (!termMap.has(key)) termMap.set(key, []);
      termMap.get(key).push(t);
    }
    for (const [k, list] of termMap.entries()) {
      if (list.length < 2) continue;
      // 같은 term, 다른 def 검사
      const defs = list.map(x => normalize(x.def));
      const unique = Array.from(new Set(defs));
      if (unique.length > 1) {
        issues.push({
          level: 'warn',
          kind: 'term-conflict',
          message: `용어 "${list[0].term}"이(가) ${list.length}개 기획서에서 서로 다른 정의로 사용됨`,
          locations: list.map(x => ({ gddId: x.gddId, gddTitle: x.gddTitle, slideId: x.slideId, snippet: x.def.slice(0, 60) })),
        });
      }
    }

    // 2) 유사 용어 (같은 뜻일 가능성)
    const termKeys = Array.from(termMap.keys());
    for (let i = 0; i < termKeys.length; i++) {
      for (let j = i + 1; j < termKeys.length; j++) {
        const a = termKeys[i], b = termKeys[j];
        if (a === b) continue;
        // 한쪽이 다른쪽의 일부 (예: "유저" vs "유저 계정") 또는 def가 매우 유사
        const aEntries = termMap.get(a);
        const bEntries = termMap.get(b);
        const defA = aEntries[0]?.def || '';
        const defB = bEntries[0]?.def || '';
        const sim = similarity(normalize(defA), normalize(defB));
        if (sim > 0.6 && aEntries[0].gddId !== bEntries[0].gddId) {
          issues.push({
            level: 'info',
            kind: 'term-similar',
            message: `용어 "${aEntries[0].term}" ↔ "${bEntries[0].term}"의 정의가 유사 (서로 다른 기획서 — 같은 개념일 수 있음)`,
            locations: [
              { gddId: aEntries[0].gddId, gddTitle: aEntries[0].gddTitle, slideId: aEntries[0].slideId, snippet: defA.slice(0, 60) },
              { gddId: bEntries[0].gddId, gddTitle: bEntries[0].gddTitle, slideId: bEntries[0].slideId, snippet: defB.slice(0, 60) },
            ],
          });
        }
      }
    }

    // 3) 데이터 스키마 명명 규칙 충돌
    const allFields = gdds.flatMap(collectFieldsFromGdd);
    const fieldMap = new Map(); // normalized field -> [entries]
    for (const f of allFields) {
      const key = normalize(f.field).replace(/[_-]/g, '');
      if (!fieldMap.has(key)) fieldMap.set(key, []);
      fieldMap.get(key).push(f);
    }
    for (const [k, list] of fieldMap.entries()) {
      if (list.length < 2) continue;
      const variants = new Set(list.map(x => x.field));
      if (variants.size > 1) {
        issues.push({
          level: 'warn',
          kind: 'field-naming-conflict',
          message: `필드 "${k}"이(가) 여러 명명 규칙으로 사용됨: ${Array.from(variants).join(', ')}`,
          locations: list.map(x => ({ gddId: x.gddId, gddTitle: x.gddTitle, slideId: x.slideId, snippet: `${x.table || ''} · ${x.field} (${x.type || ''})` })),
        });
      }
    }
    // camelCase + snake_case 혼용 전체 검사
    const cAll = allFields.filter(f => isCamel(f.field)).length;
    const sAll = allFields.filter(f => isSnake(f.field)).length;
    if (cAll > 0 && sAll > 0) {
      issues.push({
        level: 'info',
        kind: 'naming-style-mixed',
        message: `전체에 걸쳐 camelCase(${cAll}) + snake_case(${sAll}) 혼용 — 하나로 통일 권장`,
        locations: [],
      });
    }

    // 4) 빈 배열 (필수 필드 누락)
    for (const gdd of gdds) {
      const empties = collectEmptyArraysFromGdd(gdd);
      for (const e of empties) {
        // history.rows, comments 등 작성 안 한 게 자연스러운 케이스는 제외
        if (e.slideType === 'history' && e.field === 'rows') continue;
        issues.push({
          level: 'warn',
          kind: 'empty-array',
          message: `[${gdd.title}] "${e.slideTitle || e.slideType}" 슬라이드의 ${e.field}이(가) 비어있음`,
          locations: [{ gddId: e.gddId, gddTitle: e.gddTitle, slideId: e.slideId, snippet: `${e.slideType} · ${e.field}: []` }],
        });
      }
    }

    // 5) 컨셉 USP 미반영 검사
    const usp = (concept.keyUsp || []).join(' ').toLowerCase();
    if (usp.length > 0) {
      // USP에서 핵심 단어 추출 (한국어 길이 기반 단순화: 2~6자 명사 후보)
      const uspWords = usp.split(/[\s,·.()\\[\]{}!?]+/).filter(w => w.length >= 2 && w.length <= 8);
      for (const gdd of gdds) {
        const fullText = JSON.stringify(gdd).toLowerCase();
        const hits = uspWords.filter(w => fullText.includes(w));
        if (hits.length === 0 && uspWords.length > 0) {
          issues.push({
            level: 'info',
            kind: 'usp-not-referenced',
            message: `[${gdd.title}]에서 컨셉 USP 키워드가 전혀 등장하지 않음`,
            locations: [{ gddId: gdd.id, gddTitle: gdd.title, slideId: null, snippet: '' }],
          });
        }
      }
    }

    // 6) 미작성 기획서 (참고)
    const pendingPlans = (concept.recommendedPlans || []).filter(p => !p.linkedGddId);
    if (pendingPlans.length > 0) {
      issues.push({
        level: 'info',
        kind: 'pending-plans',
        message: `필요 기획서 중 ${pendingPlans.length}개 미작성: ${pendingPlans.slice(0, 3).map(p => p.title).join(', ')}${pendingPlans.length > 3 ? ' …' : ''}`,
        locations: [],
      });
    }

    // 통계
    const stats = {
      gddCount: gdds.length,
      termCount: allTerms.length,
      fieldCount: allFields.length,
      issueCount: issues.length,
      warns: issues.filter(i => i.level === 'warn').length,
      infos: issues.filter(i => i.level === 'info').length,
    };
    return { issues, stats };
  }

  window.runConsistencyCheck = runConsistencyCheck;
})();
