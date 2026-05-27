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

  /** 슬라이드 type 별 한 슬라이드에 허용되는 최대 항목 수.
   * 1280×720 frame 기준 — 폰트/마진 고려해 보수적으로 설정.
   * 분할이 일어나면 (n/N) 접미사로 시리즈 표시. */
  const THRESHOLDS = {
    'data-table': { field: 'rows', max: 8 },     // 폰트 13px row 8개 = ~360px
    'terms': { field: 'rows', max: 6 },          // term + def 가 multi-line 이라 6 안전
    'rules': { field: 'blocks', max: 2 },        // block 당 items 여러 개 가능
    'intent': { field: 'cards', max: 4 },        // 2x2 grid
    'resources': { field: 'categories', max: 3 },
    'acceptance-criteria': { field: 'criteria', max: 3 },
    'telemetry': { field: 'events', max: 4 },
    'risk-register': { field: 'risks', max: 6 },  // 7 → 6 (텍스트 wrap 안전)
    'balance-table': { field: 'vars', max: 8 },
    'roadmap': { field: 'phases', max: 4 },       // 5 → 4 (가로 컬럼)
    'state-machine': { field: 'transitions', max: 3 }, // 4 → 3 (transitions 표 row ~32px × 3 = ~96px + 헤더 = ~130px)
    'behavior-tree': { field: 'nodes', max: 18 }, // 한 슬라이드 노드 18개 정도 fit (row ~32px × 18 = ~576px)
    // api-contract 은 특수 — errors 길이가 길거나 request/response 가 크면 분할
  };

  /** rules 내부 block 의 items 길이도 검사 — block 1개에 너무 많은 item 이면 분할 */
  const MAX_ITEMS_PER_BLOCK = 8;
  /** TOC 한 슬라이드에 들어갈 수 있는 part 수와 part 당 entry 수.
   *  CSS data-density (low/medium/high/xhigh) 가 폰트/간격을 자동 축소하므로
   *  엄청 많은 경우(xhigh 한계 초과)만 분할. 일반적인 16~30개는 분할 X.
   *  실측 기준: xhigh 모드에서 한 슬라이드 32 entries / 한 part 12 entries 까지 fit. */
  const TOC_MAX_PARTS_PER_SLIDE = 6;       // 4 → 6 (3x2 grid 도 허용)
  const TOC_MAX_ENTRIES_PER_PART = 12;     // 6 → 12 (xhigh 한계까지)
  const TOC_MAX_TOTAL_ENTRIES = 36;        // 한 슬라이드 총 entry 수 hard limit

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
    // 기존 (N/M) suffix 가 있으면 모두 제거 → 누적 ("X (2/3) (1/2)") 방지.
    // 분할 임계값이 바뀌어 재분할될 때마다 같은 suffix 가 또 붙던 문제.
    const stripped = String(title || '').replace(/\s*\(\d+\s*\/\s*\d+\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
    if (total <= 1) return stripped;
    return `${stripped} (${idx + 1}/${total})`;
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

  /** state-machine 특수 — states 와 transitions 양쪽 chunk + invariants 가 많은 카드는
   * 1장이 차지하는 "비용" 을 더 크게 계산. 카드 한 장 기본 ~180px, invariant 줄당 +24px.
   * 슬라이드 콘텐츠 영역(~474px) 안에 들어가도록 누적 비용으로 chunk.
   */
  function splitStateMachine(slide) {
    const d = slide.data || {};
    const states = d.states || [];
    const trans = d.transitions || [];
    const maxTrans = (THRESHOLDS['state-machine'] && THRESHOLDS['state-machine'].max) || 3;

    // 각 state 의 추정 높이 (px)
    const SLIDE_BODY_H = 460; // 콘텐츠 가용 높이
    const BASE_CARD_H = 180;  // header + onEnter + onExit + INVARIANTS 라벨 + add 버튼
    const PER_INVARIANT = 24; // 각 invariant 줄
    const GAP = 10;
    const cardHeight = (s) => BASE_CARD_H + (Array.isArray(s.invariants) ? s.invariants.length : 0) * PER_INVARIANT;

    // states 를 누적 높이 기반으로 chunk
    const stateChunks = [];
    let cur = [], curH = 0;
    for (const s of states) {
      const h = cardHeight(s);
      const projected = curH + (cur.length > 0 ? GAP : 0) + h;
      if (cur.length > 0 && projected > SLIDE_BODY_H) {
        stateChunks.push(cur);
        cur = [s];
        curH = h;
      } else {
        cur.push(s);
        curH = projected;
      }
    }
    if (cur.length) stateChunks.push(cur);
    if (stateChunks.length === 0) stateChunks.push([]);

    // transitions chunk
    const transChunks = [];
    if (trans.length === 0) {
      transChunks.push([]);
    } else {
      for (let i = 0; i < trans.length; i += maxTrans) transChunks.push(trans.slice(i, i + maxTrans));
    }

    const total = Math.max(stateChunks.length, transChunks.length);
    if (total <= 1) return [slide];

    return Array.from({ length: total }, (_, idx) => ({
      id: idx === 0 ? slide.id : 'sl' + uid(),
      type: 'state-machine',
      data: {
        ...d,
        title: suffixTitle(d.title, idx, total),
        states: stateChunks[idx] || stateChunks[stateChunks.length - 1] || [],
        transitions: transChunks[idx] || transChunks[transChunks.length - 1] || [],
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
      // 내부 스크롤 없이 한 슬라이드에 들어가는 한계 — height 기반 추정
      const d = slide.data || {};
      const tr = (d.transitions || []).length;
      const states = d.states || [];
      const maxTrans = (THRESHOLDS['state-machine'] && THRESHOLDS['state-machine'].max) || 3;
      if (tr > maxTrans) return true;
      // states 누적 높이 추정 — splitStateMachine 의 계산과 동일한 임계치
      const SLIDE_BODY_H = 460, BASE = 180, PER_INV = 24, GAP = 10;
      const totalH = states.reduce((acc, s, i) => acc + (i > 0 ? GAP : 0) + BASE + ((s.invariants || []).length * PER_INV), 0);
      return totalH > SLIDE_BODY_H;
    }
    // balance-table / acceptance-criteria / telemetry — 높이 기반
    if (t === 'balance-table') {
      const d = slide.data || {};
      const vars = d.vars || [];
      if (vars.length > 6) return true;
      // splitBalanceTable 와 동일한 height 추정
      const SLIDE_BODY_H = 440;
      const formulaH = d.formula ? (50 + estimateTextHeight(d.formula)) : 0;
      const curveH = d.curve && Array.isArray(d.curve.x) ? 150 : 0;
      const availableH = Math.max(180, SLIDE_BODY_H - formulaH - curveH);
      const totalH = vars.reduce((acc, v) => acc + 38 + ['name','formula','range','defaultValue','sensitivity','notes'].reduce((a, f) => a + estimateTextHeight(v[f]), 0), 0);
      return totalH > availableH;
    }
    if (t === 'acceptance-criteria') {
      const d = slide.data || {};
      const cs = d.criteria || [];
      if (cs.length > 3) return true;
      const STORY_H = d.userStory ? 80 : 0;
      const totalH = cs.reduce((acc, c) => {
        const edges = (c.edgeCases || []).length;
        return acc + 60 + estimateTextHeight(c.given) + estimateTextHeight(c.when) + estimateTextHeight(c.then) + (edges > 0 ? 24 + edges * 20 : 0);
      }, 0);
      return totalH > (420 - STORY_H);
    }
    if (t === 'telemetry') {
      const d = slide.data || {};
      const events = d.events || [];
      if (events.length > 4) return true;
      const totalH = events.reduce((acc, e) => {
        const props = (e.props || []).length;
        return acc + 70 + props * 22 + (props > 0 ? 18 : 0) + estimateTextHeight(e.when);
      }, 0);
      return totalH > 440;
    }
    if (t === 'roadmap') {
      const d = slide.data || {};
      const phases = d.phases || [];
      if (phases.length > 4) return true;
      const ganttH = 30 + phases.length * 38;
      const totalH = phases.reduce((acc, p) => {
        const deliv = (p.deliverables || []);
        return acc + 60 + deliv.length * 22 + deliv.reduce((a, dd) => a + estimateTextHeight(dd), 0) + ((p.dependsOn || []).length ? 20 : 0);
      }, 0);
      return ganttH + totalH > 500;
    }
    // rules: blocks 가 많거나 한 block 안 items 가 많으면 분할
    if (t === 'rules') {
      const blocks = slide.data.blocks || [];
      if (blocks.length > 2) return true;
      return blocks.some(b => Array.isArray(b.items) && b.items.length > MAX_ITEMS_PER_BLOCK);
    }
    // toc: density CSS 로 대부분 fit 되므로 hard limit 초과만 분할
    if (t === 'toc') {
      const d = slide.data;
      const parts = Array.isArray(d.parts) ? d.parts : null;
      if (parts) {
        if (parts.length > TOC_MAX_PARTS_PER_SLIDE) return true;
        if (parts.some(p => Array.isArray(p.entries) && p.entries.length > TOC_MAX_ENTRIES_PER_PART)) return true;
        const total = parts.reduce((s, p) => s + ((p.entries && p.entries.length) || 0), 0);
        return total > TOC_MAX_TOTAL_ENTRIES;
      }
      // 평탄 entries 만 있는 경우
      const flat = Array.isArray(d.entries) ? d.entries : [];
      return flat.length > TOC_MAX_TOTAL_ENTRIES;
    }
    const rule = THRESHOLDS[t];
    if (!rule) return false;
    return (slide.data[rule.field] || []).length > rule.max;
  }

  /** rules 특수 분할 — block 단위 chunk + 각 block 의 items 가 너무 많으면 추가 분할 */
  function splitRules(slide) {
    const d = slide.data || {};
    let blocks = d.blocks || [];
    // 1) 먼저 각 block 의 items 가 max 보다 많으면 sub-block 으로 분할
    const expanded = [];
    blocks.forEach((b) => {
      const items = Array.isArray(b.items) ? b.items : [];
      if (items.length <= MAX_ITEMS_PER_BLOCK) {
        expanded.push(b);
      } else {
        for (let i = 0; i < items.length; i += MAX_ITEMS_PER_BLOCK) {
          expanded.push({
            ...b,
            head: (b.head || '') + (i === 0 ? '' : ' (계속)'),
            items: items.slice(i, i + MAX_ITEMS_PER_BLOCK),
          });
        }
      }
    });
    // 2) block 개수가 max 보다 많으면 슬라이드 chunk
    if (expanded.length <= 2) {
      // 단일 슬라이드로 충분
      return [{
        id: slide.id,
        type: 'rules',
        data: copyMeta(d, { ...d, blocks: expanded, title: d.title || '' }, 'rules'),
      }];
    }
    const chunks = [];
    for (let i = 0; i < expanded.length; i += 2) chunks.push(expanded.slice(i, i + 2));
    return chunks.map((chunk, idx) => ({
      id: idx === 0 ? slide.id : 'sl' + uid(),
      type: 'rules',
      data: copyMeta(d, {
        ...d,
        blocks: chunk,
        title: suffixTitle(d.title, idx, chunks.length),
      }, 'rules'),
    }));
  }

  /** TOC 슬라이드 특수 분할.
   *
   *  Cases:
   *  A) parts 배열 사용 + 어떤 part 의 entries 가 너무 많음
   *     → 각 part 의 entries 를 chunk 한 뒤, 슬라이드를 part 단위로 N장으로 분할
   *  B) parts 가 4개 초과
   *     → 4개씩 묶어서 슬라이드 분할
   *  C) entries 평탄 배열만 있는 경우 → 적절히 그룹화하여 N장으로 분할
   *
   *  결과 슬라이드는 모두 toc type 유지 + title 에 (n/N) 접미사. */
  function splitToc(slide) {
    const d = slide.data || {};
    const baseMeta = (extra) => copyMeta(d, { ...d, ...extra }, 'toc');

    // 표준화: parts 형태로 통일.
    let parts;
    if (Array.isArray(d.parts) && d.parts.length > 0) {
      parts = d.parts.map((p) => ({
        roman: p.roman,
        label: p.label || p.name || '',
        sub: p.sub || p.subEn || '',
        entries: Array.isArray(p.entries) ? p.entries : [],
      }));
    } else if (Array.isArray(d.entries) && d.entries.length > 0) {
      // entries 평탄 배열 — 적절히 part 로 묶음 (TOC_MAX_ENTRIES_PER_PART 단위).
      const flat = d.entries;
      parts = [];
      for (let i = 0; i < flat.length; i += TOC_MAX_ENTRIES_PER_PART) {
        parts.push({ label: '', sub: '', entries: flat.slice(i, i + TOC_MAX_ENTRIES_PER_PART) });
      }
    } else {
      return [slide]; // 분할할 데이터 없음
    }

    // Step 1: 각 part 의 entries 가 너무 많으면 sub-part 로 분할
    const expanded = [];
    parts.forEach((p) => {
      const es = p.entries || [];
      if (es.length <= TOC_MAX_ENTRIES_PER_PART) {
        expanded.push(p);
      } else {
        for (let i = 0; i < es.length; i += TOC_MAX_ENTRIES_PER_PART) {
          expanded.push({
            roman: p.roman,
            label: p.label + (i === 0 ? '' : ' (계속)'),
            sub: p.sub,
            entries: es.slice(i, i + TOC_MAX_ENTRIES_PER_PART),
          });
        }
      }
    });

    // Step 2: parts 가 TOC_MAX_PARTS_PER_SLIDE 이내면 단일 슬라이드
    if (expanded.length <= TOC_MAX_PARTS_PER_SLIDE) {
      return [{
        id: slide.id,
        type: 'toc',
        data: baseMeta({ parts: expanded, entries: undefined }),
      }];
    }

    // Step 3: parts 가 많으면 슬라이드 chunk
    const chunks = [];
    for (let i = 0; i < expanded.length; i += TOC_MAX_PARTS_PER_SLIDE) {
      chunks.push(expanded.slice(i, i + TOC_MAX_PARTS_PER_SLIDE));
    }
    return chunks.map((chunk, idx) => ({
      id: idx === 0 ? slide.id : 'sl' + uid(),
      type: 'toc',
      data: baseMeta({
        parts: chunk,
        entries: undefined,
        title: suffixTitle(d.title || 'CONTENTS', idx, chunks.length),
        titleKo: suffixTitle(d.titleKo || d.title || '목차', idx, chunks.length),
      }),
    }));
  }

  /** 텍스트의 추정 렌더 높이 (px) — 마크다운 헤더/개행/글자수 가중. */
  function estimateTextHeight(text) {
    if (!text) return 0;
    const s = String(text);
    let h = 0;
    // 헤더 1개당 +28px
    h += ((s.match(/^#{1,6}\s/gm) || []).length) * 28;
    // 개행 1개당 +18px
    h += ((s.match(/\n/g) || []).length) * 18;
    // 글자수 — 200자당 +20px (wrap 고려)
    h += Math.floor(s.length / 200) * 20;
    // 기본 1줄
    if (h === 0 && s.length > 0) h = 20;
    return h;
  }

  /** balance-table — vars 행 높이 가변. 각 row 의 모든 텍스트 필드 누적 높이로 chunk. */
  function splitBalanceTable(slide) {
    const d = slide.data || {};
    const vars = d.vars || [];
    if (vars.length === 0) return [slide];

    const SLIDE_BODY_H = 440;
    const ROW_BASE = 38; // 1행 빈 텍스트 기준
    const formulaH = d.formula ? (50 + estimateTextHeight(d.formula)) : 0;
    const curveH = d.curve && Array.isArray(d.curve.x) ? 150 : 0;
    const availableH = Math.max(180, SLIDE_BODY_H - formulaH - curveH);

    const rowH = (v) => {
      let h = ROW_BASE;
      for (const f of ['name', 'formula', 'range', 'defaultValue', 'sensitivity', 'notes']) {
        h += estimateTextHeight(v[f]);
      }
      return h;
    };

    const chunks = [];
    let cur = [], curH = 0;
    for (const v of vars) {
      const h = rowH(v);
      if (cur.length > 0 && curH + h > availableH) {
        chunks.push(cur);
        cur = [v]; curH = h;
      } else {
        cur.push(v); curH += h;
      }
    }
    if (cur.length) chunks.push(cur);
    if (chunks.length <= 1) return [slide];

    return chunks.map((chunk, idx) => ({
      id: idx === 0 ? slide.id : 'sl' + uid(),
      type: 'balance-table',
      data: {
        ...d,
        title: suffixTitle(d.title, idx, chunks.length),
        vars: chunk,
        // formula / curve 는 첫 슬라이드에만 — 분할본에서는 비워서 공간 확보
        formula: idx === 0 ? d.formula : '',
        curve: idx === 0 ? d.curve : null,
      },
    }));
  }

  /** acceptance-criteria — criterion 1개가 Given/When/Then + edgeCases 다해서 100~250px 가변. */
  function splitAcceptanceCriteria(slide) {
    const d = slide.data || {};
    const criteria = d.criteria || [];
    if (criteria.length === 0) return [slide];

    const SLIDE_BODY_H = 420;
    const STORY_H = d.userStory ? 80 : 0; // userStory 박스
    const availableH = SLIDE_BODY_H - STORY_H;

    const criterionH = (c) => {
      let h = 60; // 헤더 + GIVEN/WHEN/THEN 라벨 영역
      h += estimateTextHeight(c.given);
      h += estimateTextHeight(c.when);
      h += estimateTextHeight(c.then);
      const edges = (c.edgeCases || []).length;
      if (edges > 0) h += 24 + edges * 20;
      return h;
    };

    const chunks = [];
    let cur = [], curH = 0;
    for (const c of criteria) {
      const h = criterionH(c);
      if (cur.length > 0 && curH + h > availableH) {
        chunks.push(cur);
        cur = [c]; curH = h;
      } else {
        cur.push(c); curH += h;
      }
    }
    if (cur.length) chunks.push(cur);
    if (chunks.length <= 1) return [slide];

    return chunks.map((chunk, idx) => ({
      id: idx === 0 ? slide.id : 'sl' + uid(),
      type: 'acceptance-criteria',
      data: {
        ...d,
        title: suffixTitle(d.title, idx, chunks.length),
        criteria: chunk,
        userStory: idx === 0 ? d.userStory : null,
      },
    }));
  }

  /** telemetry — event 1개당 props 개수 만큼 높이 가변. */
  function splitTelemetry(slide) {
    const d = slide.data || {};
    const events = d.events || [];
    if (events.length === 0) return [slide];

    const SLIDE_BODY_H = 440;
    const eventH = (e) => {
      let h = 70; // 헤더 + when
      const props = (e.props || []).length;
      h += props * 22 + (props > 0 ? 18 : 0);
      h += estimateTextHeight(e.when);
      return h;
    };

    const chunks = [];
    let cur = [], curH = 0;
    for (const e of events) {
      const h = eventH(e);
      if (cur.length > 0 && curH + h > SLIDE_BODY_H) {
        chunks.push(cur);
        cur = [e]; curH = h;
      } else {
        cur.push(e); curH += h;
      }
    }
    if (cur.length) chunks.push(cur);
    if (chunks.length <= 1) return [slide];

    return chunks.map((chunk, idx) => ({
      id: idx === 0 ? slide.id : 'sl' + uid(),
      type: 'telemetry',
      data: {
        ...d,
        title: suffixTitle(d.title, idx, chunks.length),
        events: chunk,
        funnels: idx === 0 ? d.funnels : [],
      },
    }));
  }

  /** roadmap — phase 별 deliverables 길이 가변. 첫 슬라이드만 gantt 표시, 나머지는 phase 카드만. */
  function splitRoadmap(slide) {
    const d = slide.data || {};
    const phases = d.phases || [];
    if (phases.length === 0) return [slide];

    const SLIDE_BODY_H = 500;
    const GANTT_H = 30 + phases.length * 38; // gantt 영역 (모든 phase 가 한 줄씩)
    const phaseH = (p) => {
      let h = 60; // 헤더 (name, start, end, ✕)
      const deliv = (p.deliverables || []);
      h += deliv.length * 22; // 각 산출물 라인
      h += deliv.reduce((acc, d) => acc + estimateTextHeight(d), 0);
      if ((p.dependsOn || []).length) h += 20;
      return h;
    };

    // chunk by height — gantt 는 첫 슬라이드에만 (분할본은 phase 카드만)
    const chunks = [];
    let cur = [], curH = 0;
    const firstAvail = SLIDE_BODY_H - GANTT_H;
    for (let i = 0; i < phases.length; i++) {
      const p = phases[i];
      const h = phaseH(p);
      const limit = chunks.length === 0 ? firstAvail : SLIDE_BODY_H;
      if (cur.length > 0 && curH + h > limit) {
        chunks.push(cur);
        cur = [p]; curH = h;
      } else {
        cur.push(p); curH += h;
      }
    }
    if (cur.length) chunks.push(cur);
    if (chunks.length <= 1) return [slide];

    return chunks.map((chunk, idx) => ({
      id: idx === 0 ? slide.id : 'sl' + uid(),
      type: 'roadmap',
      data: {
        ...d,
        title: suffixTitle(d.title, idx, chunks.length),
        phases: chunk,
        // 첫 슬라이드에만 gantt 가 보이도록 메타 hint — 렌더러가 _hideGantt 를 참고
        _hideGantt: idx > 0,
      },
    }));
  }

  function splitSlide(slide) {
    if (!slide || !slide.data) return [slide];
    const t = slide.type;
    if (t === 'api-contract') return splitApiContract(slide);
    if (t === 'state-machine') return splitStateMachine(slide);
    if (t === 'balance-table') return splitBalanceTable(slide);
    if (t === 'acceptance-criteria') return splitAcceptanceCriteria(slide);
    if (t === 'telemetry') return splitTelemetry(slide);
    if (t === 'roadmap') return splitRoadmap(slide);
    if (t === 'rules') return splitRules(slide);
    if (t === 'toc') return splitToc(slide);
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
