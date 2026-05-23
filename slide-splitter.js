/* === 슬라이드 자동 분할기 ===
 * 슬라이드 한 장이 1280×720 frame 을 넘쳐 스크롤을 유발할 위험이 있을 때,
 * 슬라이드 타입별 분할 규칙에 따라 N장으로 나눈다.
 *
 * window.gddSlideSplitter.splitSlide(slide, opts?)  → Slide[]  (1장 그대로면 [slide])
 * window.gddSlideSplitter.shouldSplit(slide)         → boolean  (분할 권장 여부)
 * window.gddSlideSplitter.splitAllOverflowing(slides) → Slide[] (전체 일괄 분할)
 *
 * 각 분할 규칙은:
 *  - 첫 번째 슬라이드는 원본 id 유지 (참조 무결성)
 *  - 후속 슬라이드는 새 id 발급
 *  - title 에 "(n/N)" 접미사 자동 추가
 *  - 의존 필드(예: data-table.columns) 는 모든 분할본에 복사
 */
(function () {
  'use strict';

  const uid = () => (window.uid ? window.uid() : Math.random().toString(36).slice(2, 10));

  /** 슬라이드 type 별 한 슬라이드에 허용되는 최대 항목 수 */
  const THRESHOLDS = {
    'data-table': { field: 'rows', max: 10 },
    'terms': { field: 'rows', max: 8 },
    'rules': { field: 'blocks', max: 2 },
    'intent': { field: 'cards', max: 4 },
    'resources': { field: 'categories', max: 3 },
    'acceptance-criteria': { field: 'criteria', max: 3 },
    'telemetry': { field: 'events', max: 4 },
    'risk-register': { field: 'risks', max: 7 },
    'balance-table': { field: 'vars', max: 8 },
    'roadmap': { field: 'phases', max: 5 },
    'state-machine': { field: 'transitions', max: 8 },
    // api-contract 은 특수 — errors 길이가 길거나 request/response 가 크면 분할
  };

  /** 슬라이드 type 별, 분할본 모두에 복사해야 할 메타 필드들 */
  const COPY_FIELDS = {
    'data-table': ['columns'],
    'acceptance-criteria': ['userStory'],
    'telemetry': ['funnels'],
    'balance-table': ['formula', 'curve'],
    'roadmap': [],
    'state-machine': ['states'],
  };

  function copyMeta(srcData, destData, type) {
    const fields = COPY_FIELDS[type] || [];
    for (const f of fields) {
      if (srcData[f] !== undefined) destData[f] = srcData[f];
    }
    // 공통 메타
    for (const f of ['section', 'sectionName']) {
      if (srcData[f] !== undefined) destData[f] = srcData[f];
    }
    return destData;
  }

  function suffixTitle(title, idx, total) {
    if (total <= 1) return title || '';
    return `${title || ''} (${idx + 1}/${total})`;
  }

  /** 표준 배열 분할 — type 의 THRESHOLDS[type] 으로 chunk */
  function splitByArrayField(slide) {
    const t = slide.type;
    const rule = THRESHOLDS[t];
    if (!rule) return [slide];
    const arr = slide.data?.[rule.field] || [];
    if (arr.length <= rule.max) return [slide];
    const chunks = [];
    for (let i = 0; i < arr.length; i += rule.max) chunks.push(arr.slice(i, i + rule.max));
    return chunks.map((chunk, idx) => {
      const base = {
        ...slide.data,
        [rule.field]: chunk,
        title: suffixTitle(slide.data?.title, idx, chunks.length),
      };
      // 후속 슬라이드는 의존 필드만 복사하고 나머지는 비움 (선택적)
      // 여기서는 전체 복사 — 모든 분할본이 컨텍스트(설명/포뮬라 등) 를 가지도록
      return {
        id: idx === 0 ? slide.id : 'sl' + uid(),
        type: t,
        data: copyMeta(slide.data || {}, base, t),
      };
    });
  }

  /** api-contract 특수 분할 — request/response 가 큰 경우 error 들을 별도 슬라이드로 분리 */
  function splitApiContract(slide) {
    const d = slide.data || {};
    const errs = d.errors || [];
    const reqLen = (d.request || '').length;
    const respLen = (d.response || '').length;
    const heavySchema = reqLen + respLen > 1400;
    const manyErrors = errs.length > 5;
    if (!heavySchema && !manyErrors) return [slide];
    // 분할: 메인(METHOD/endpoint/req/resp) + 에러/메모
    const main = {
      id: slide.id,
      type: 'api-contract',
      data: {
        ...d,
        title: suffixTitle(d.title, 0, 2),
        errors: errs.slice(0, 3),
        notes: '',
      },
    };
    const errsSlide = {
      id: 'sl' + uid(),
      type: 'api-contract',
      data: {
        section: d.section,
        sectionName: d.sectionName,
        title: suffixTitle((d.title || 'API') + ' — 에러 & 메모', 1, 2),
        endpoint: d.endpoint,
        method: d.method,
        auth: d.auth,
        slaMs: d.slaMs,
        request: '',
        response: '',
        errors: errs,
        idempotencyKey: d.idempotencyKey || '',
        notes: d.notes || '',
      },
    };
    return [main, errsSlide];
  }

  /** state-machine 특수 — transitions 이 많으면 분할, 첫 슬라이드는 states + 일부 transitions */
  function splitStateMachine(slide) {
    const d = slide.data || {};
    const trans = d.transitions || [];
    if (trans.length <= 8) return [slide];
    const chunks = [];
    for (let i = 0; i < trans.length; i += 8) chunks.push(trans.slice(i, i + 8));
    return chunks.map((chunk, idx) => ({
      id: idx === 0 ? slide.id : 'sl' + uid(),
      type: 'state-machine',
      data: {
        ...d,
        title: suffixTitle(d.title, idx, chunks.length),
        transitions: chunk,
        // states 는 모두 복사 (첫 슬라이드만 가지는 것보다 각 슬라이드가 self-contained)
        states: d.states || [],
      },
    }));
  }

  function shouldSplit(slide) {
    if (!slide || !slide.data) return false;
    const t = slide.type;
    if (t === 'api-contract') {
      const d = slide.data;
      const reqLen = (d.request || '').length;
      const respLen = (d.response || '').length;
      return (d.errors || []).length > 5 || reqLen + respLen > 1400;
    }
    if (t === 'state-machine') {
      return (slide.data.transitions || []).length > 8;
    }
    const rule = THRESHOLDS[t];
    if (!rule) return false;
    return (slide.data[rule.field] || []).length > rule.max;
  }

  function splitSlide(slide) {
    if (!slide || !slide.data) return [slide];
    const t = slide.type;
    if (t === 'api-contract') return splitApiContract(slide);
    if (t === 'state-machine') return splitStateMachine(slide);
    if (THRESHOLDS[t]) return splitByArrayField(slide);
    return [slide];
  }

  /** 전체 슬라이드 배열을 받아 오버플로 슬라이드를 모두 분할한 새 배열 반환 */
  function splitAllOverflowing(slides) {
    if (!Array.isArray(slides)) return slides;
    const out = [];
    for (const s of slides) {
      const parts = splitSlide(s);
      out.push(...parts);
    }
    return out;
  }

  window.gddSlideSplitter = { splitSlide, shouldSplit, splitAllOverflowing, THRESHOLDS };
})();
