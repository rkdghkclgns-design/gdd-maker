/* === AI usage tracker ===
 * 모든 Gemini API 호출의 토큰 수 + 추정 비용을 기록.
 * localStorage 사용 (가벼움). 최근 1000개 호출만 유지.
 *
 * 노출: window.gddUsage
 */
(function () {
  const LOG_KEY = 'gdd-usage-log-v1';
  const MAX_LOG = 1000;

  // USD per 1M tokens (2025-05 기준 공개 가격)
  const PRICES = {
    'gemini-2.5-flash':       { in: 0.075,  out: 0.30 },
    'gemini-2.5-flash-lite':  { in: 0.0375, out: 0.15 },
    'gemini-2.5-pro':         { in: 1.25,   out: 5.00 },
    'gemini-2.0-flash':       { in: 0.10,   out: 0.40 },
    'gemini-1.5-flash':       { in: 0.075,  out: 0.30 },
    'gemini-1.5-pro':         { in: 1.25,   out: 5.00 },
  };
  // per-image 단가 (text-to-image)
  const IMAGE_PRICE_PER_IMAGE = 0.039;
  const DEFAULT_PRICE = PRICES['gemini-2.5-flash'];

  function estimateCost({ model, promptTokens, completionTokens, isImage, imageCount }) {
    if (isImage) {
      return (imageCount || 1) * IMAGE_PRICE_PER_IMAGE;
    }
    const p = PRICES[model] || DEFAULT_PRICE;
    const pIn = ((promptTokens || 0) / 1e6) * p.in;
    const pOut = ((completionTokens || 0) / 1e6) * p.out;
    return pIn + pOut;
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    } catch { return []; }
  }
  function save(log) {
    if (log.length > MAX_LOG) log = log.slice(log.length - MAX_LOG);
    try { localStorage.setItem(LOG_KEY, JSON.stringify(log)); } catch {}
  }

  function record(entry) {
    const e = {
      ts: Date.now(),
      model: entry.model || 'unknown',
      kind: entry.kind || 'text', // 'text' | 'image'
      promptTokens: entry.promptTokens || 0,
      completionTokens: entry.completionTokens || 0,
      totalTokens: entry.totalTokens || ((entry.promptTokens || 0) + (entry.completionTokens || 0)),
      cost: entry.cost != null ? entry.cost : estimateCost({
        model: entry.model,
        promptTokens: entry.promptTokens,
        completionTokens: entry.completionTokens,
        isImage: entry.kind === 'image',
        imageCount: entry.imageCount,
      }),
      success: entry.success !== false,
      note: entry.note || '',
    };
    const log = load();
    log.push(e);
    save(log);
    // 살짝 알림 — 외부 리스너용
    try { window.dispatchEvent(new CustomEvent('gdd-usage-changed')); } catch {}
    return e;
  }

  function getLog() { return load(); }

  function getStats() {
    const log = load();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const month = new Date(today.getFullYear(), today.getMonth(), 1);
    const todayTs = today.getTime();
    const monthTs = month.getTime();

    let totalCalls = 0, totalCost = 0, totalTokens = 0;
    let todayCalls = 0, todayCost = 0;
    let monthCalls = 0, monthCost = 0;
    let imageCalls = 0, imageCost = 0;
    let textCalls = 0, textCost = 0;
    let failedCalls = 0;
    const byModel = {};

    for (const e of log) {
      totalCalls++;
      totalCost += e.cost || 0;
      totalTokens += e.totalTokens || 0;
      if (!e.success) failedCalls++;
      if (e.kind === 'image') {
        imageCalls++; imageCost += e.cost || 0;
      } else {
        textCalls++; textCost += e.cost || 0;
      }
      if (e.ts >= todayTs) { todayCalls++; todayCost += e.cost || 0; }
      if (e.ts >= monthTs) { monthCalls++; monthCost += e.cost || 0; }
      const m = e.model || 'unknown';
      if (!byModel[m]) byModel[m] = { calls: 0, cost: 0, tokens: 0 };
      byModel[m].calls++;
      byModel[m].cost += e.cost || 0;
      byModel[m].tokens += e.totalTokens || 0;
    }
    return {
      totalCalls, totalCost, totalTokens,
      todayCalls, todayCost,
      monthCalls, monthCost,
      imageCalls, imageCost,
      textCalls, textCost,
      failedCalls,
      byModel,
    };
  }

  function clear() {
    localStorage.removeItem(LOG_KEY);
    try { window.dispatchEvent(new CustomEvent('gdd-usage-changed')); } catch {}
  }

  function formatUSD(n) {
    if (n == null) return '$0.00';
    if (n < 0.01) return '$' + n.toFixed(4);
    return '$' + n.toFixed(2);
  }

  /* === Budget limits === */
  const BUDGET_KEY = 'gdd-usage-budget';
  function getBudget() {
    try {
      return JSON.parse(localStorage.getItem(BUDGET_KEY) || 'null') ||
        { dailyUsd: 0, monthlyUsd: 0, hardStop: false };
    } catch { return { dailyUsd: 0, monthlyUsd: 0, hardStop: false }; }
  }
  function setBudget(b) {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(b || {}));
  }
  function isOverBudget() {
    const b = getBudget();
    const s = getStats();
    return {
      daily: b.dailyUsd > 0 && s.todayCost >= b.dailyUsd,
      monthly: b.monthlyUsd > 0 && s.monthCost >= b.monthlyUsd,
      hardStop: !!b.hardStop,
    };
  }

  window.gddUsage = {
    record,
    getLog,
    getStats,
    clear,
    formatUSD,
    estimateCost,
    getBudget,
    setBudget,
    isOverBudget,
    PRICES,
    IMAGE_PRICE_PER_IMAGE,
  };
})();
