/* === Stats analyzer ===
 * 현재 state(concepts/projects)에서 활동 통계를 산출.
 *
 * 노출: window.computeStats(state)
 */
(function () {

  function dateKey(iso) {
    if (!iso) return null;
    return iso.toString().slice(0, 10); // YYYY-MM-DD
  }

  function wordCount(s) {
    if (!s) return 0;
    return s.toString().trim().split(/\s+/).filter(Boolean).length;
  }

  function slideWords(slide) {
    const d = slide.data || {};
    let n = 0;
    n += wordCount(d.title);
    n += wordCount(d.subtitle);
    n += wordCount(d.tagline);
    for (const arrKey of ['cards', 'rows', 'blocks', 'entries', 'nodes', 'callouts', 'categories']) {
      const arr = d[arrKey] || [];
      for (const item of arr) {
        if (typeof item === 'string') { n += wordCount(item); continue; }
        if (item && typeof item === 'object') {
          for (const v of Object.values(item)) {
            if (typeof v === 'string') n += wordCount(v);
            else if (Array.isArray(v)) for (const x of v) if (typeof x === 'string') n += wordCount(x);
          }
        }
      }
    }
    return n;
  }

  function classifyGddDomain(gdd) {
    // window.classifyDomain은 data.js에서 노출됨
    if (window.classifyDomain) return window.classifyDomain(gdd.command || '', gdd.title || '');
    return 'core';
  }

  function computeStats(state) {
    const concepts = state.concepts || [];
    const projects = state.projects || [];

    let totalSlides = 0;
    let totalWords = 0;
    const byDate = {}; // dateKey -> slide count created/updated
    const byDomain = {}; // domain -> gdd count

    for (const p of projects) {
      const slides = p.slides || [];
      totalSlides += slides.length;
      for (const s of slides) totalWords += slideWords(s);
      const dk = dateKey(p.updatedAt);
      if (dk) byDate[dk] = (byDate[dk] || 0) + 1;
      const dom = classifyGddDomain(p);
      byDomain[dom] = (byDomain[dom] || 0) + 1;
    }

    // 최근 14일 일별 추이
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const recentDays = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 86400000);
      const k = d.toISOString().slice(0, 10);
      recentDays.push({ date: k, count: byDate[k] || 0 });
    }

    // 컨셉별 진행률
    const conceptProgress = concepts.map(c => {
      const total = (c.recommendedPlans || []).length;
      const done = (c.recommendedPlans || []).filter(p => p.linkedGddId).length;
      return {
        id: c.id,
        title: c.title,
        total,
        done,
        ratio: total ? done / total : 0,
      };
    });

    return {
      counts: {
        concepts: concepts.length,
        projects: projects.length,
        slides: totalSlides,
        words: totalWords,
      },
      byDomain,
      recentDays,
      conceptProgress,
    };
  }

  window.computeStats = computeStats;
})();
