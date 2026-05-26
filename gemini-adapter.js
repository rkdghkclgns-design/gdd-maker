/* === Google Gemini API client ===
 *
 * Exposes window.gemini.complete(input) returning Promise<string>.
 * Accepts:
 *   - "prompt string"
 *   - { contents: [{ role: 'user', parts: [{ text }, { inline_data: { mime_type, data } }] }] }
 *
 * API key is stored in localStorage. Manage via:
 *   - window.gemini.setApiKey(key)
 *   - window.gemini.getApiKey()
 *   - window.gemini.resetApiKey()
 *   - window.gemini.setModel('gemini-2.5-pro')
 *   - window.gemini.getModel()
 *
 * Get a key at: https://aistudio.google.com/apikey
 */
(function () {
  const KEY_STORAGE = 'gemini-api-key';
  const MODEL_STORAGE = 'gemini-model';
  const DEFAULT_MODEL = 'gemini-2.5-flash';
  const ENDPOINT = (model, key) =>
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;

  function getApiKey() {
    return (localStorage.getItem(KEY_STORAGE) || '').trim();
  }
  function setApiKey(k) {
    const v = (k || '').trim();
    if (v) localStorage.setItem(KEY_STORAGE, v);
    else localStorage.removeItem(KEY_STORAGE);
  }
  function resetApiKey() {
    localStorage.removeItem(KEY_STORAGE);
  }
  function getModel() {
    return localStorage.getItem(MODEL_STORAGE) || DEFAULT_MODEL;
  }
  function setModel(m) {
    if (m) localStorage.setItem(MODEL_STORAGE, m);
  }

  /** Ask the user for the key once, store it. Returns string or '' if cancelled. */
  function promptForKey() {
    const msg = [
      'Google Gemini API 키를 입력하세요.',
      '',
      '아직 키가 없다면 https://aistudio.google.com/apikey 에서 무료로 발급받을 수 있습니다.',
      '키는 이 브라우저의 localStorage에만 저장됩니다.',
    ].join('\n');
    const k = window.prompt(msg, '');
    if (!k) return '';
    setApiKey(k);
    return k.trim();
  }

  /** Normalize input → { contents } body for Gemini. */
  function toRequestBody(input) {
    if (typeof input === 'string') {
      return { contents: [{ role: 'user', parts: [{ text: input }] }] };
    }
    if (input && Array.isArray(input.contents)) {
      return { contents: input.contents };
    }
    if (input && Array.isArray(input.parts)) {
      return { contents: [{ role: 'user', parts: input.parts }] };
    }
    throw new Error('Unsupported input type for gemini.complete');
  }

  function extractText(geminiResponse) {
    const cands = geminiResponse?.candidates;
    if (!cands || !cands.length) return '';
    const parts = cands[0]?.content?.parts || [];
    return parts.map((p) => p?.text || '').join('');
  }

  async function complete(input, options = {}) {
    let key = getApiKey();
    if (!key) {
      key = promptForKey();
      if (!key) throw new Error('Gemini API 키가 설정되지 않았습니다.');
    }
    const model = getModel();
    const reqBody = toRequestBody(input);

    // 기본은 JSON 모드 (대부분의 호출이 JSON 출력) — options.json === false 면 plain text
    const wantJson = options.json !== false;

    const body = {
      ...reqBody,
      generationConfig: {
        temperature: 0.75,
        topP: 0.95,
        maxOutputTokens: 65536,
        ...(wantJson ? { response_mime_type: 'application/json' } : {}),
        ...(options.generationConfig || {}),
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      ],
    };

    let res;
    try {
      res = await fetch(ENDPOINT(model, key), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (e) {
      throw new Error('Gemini API 네트워크 오류: ' + (e.message || e));
    }

    if (!res.ok) {
      let detail = '';
      try {
        const errJson = await res.json();
        detail = errJson?.error?.message || JSON.stringify(errJson);
        const status = errJson?.error?.status;
        if (status === 'INVALID_ARGUMENT' && /API key/i.test(detail)) {
          resetApiKey();
          throw new Error('API 키가 유효하지 않습니다. 페이지 새로고침 후 다시 입력하세요.');
        }
        if (res.status === 403) {
          resetApiKey();
          throw new Error('API 키 권한 거부. 새로고침 후 올바른 키를 입력하세요. ' + detail);
        }
      } catch (parseErr) {
        if (!detail) detail = await res.text().catch(() => '');
      }
      throw new Error(`Gemini API ${res.status}: ${detail.slice(0, 300)}`);
    }

    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error('Gemini 응답 JSON 파싱 실패');
    }

    // usageMetadata 기록 — 텍스트 호출
    if (window.gddUsage && data.usageMetadata) {
      try {
        window.gddUsage.record({
          model,
          kind: 'text',
          promptTokens: data.usageMetadata.promptTokenCount || 0,
          completionTokens: data.usageMetadata.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata.totalTokenCount || 0,
          success: true,
        });
      } catch {}
    }

    const finishReason = data?.candidates?.[0]?.finishReason;
    if (finishReason === 'SAFETY') {
      throw new Error('안전 필터로 인해 응답이 차단되었습니다. 프롬프트를 수정해주세요.');
    }
    if (finishReason === 'RECITATION') {
      throw new Error('Gemini가 응답을 거부했습니다(저작권 인용 가능성).');
    }

    const text = extractText(data);
    if (!text) {
      throw new Error('Gemini 응답이 비어있습니다.');
    }
    return text;
  }

  /** Helper: build a Gemini image part from a data: URL string. */
  function imagePartFromDataUrl(dataUrl) {
    const m = (dataUrl || '').match(/^data:(image\/[^;]+);base64,(.+)$/);
    if (!m) return null;
    return { inline_data: { mime_type: m[1], data: m[2] } };
  }

  /** Generate an image with Gemini "nano-banana" (gemini-2.5-flash-image).
   * Returns a data: URL string ready to use in <img src=...>.
   * Throws on failure — caller decides whether to surface a toast or fall back.
   *
   * options:
   *   - palette: [{name, hex}] — 색상 팔레트. 프롬프트에 자동으로 색상 힌트 주입.
   *   - generationConfig: 추가 generation config
   */
  const IMAGE_MODEL = 'gemini-2.5-flash-image';

  /** 팔레트를 영문 프롬프트 힌트로 변환.
   * - 각 색상의 hex + 역할(role)을 명시
   * - 모델이 "이 색상을 dominant tone 으로 사용" 하도록 강하게 지시 */
  function buildPaletteHint(palette) {
    if (!Array.isArray(palette) || palette.length === 0) return '';
    const items = palette
      .map(p => {
        const hex = (p && (p.hex || p.color || '')).toString().trim();
        if (!/^#?[0-9a-fA-F]{6}$/.test(hex.replace(/^#/, ''))) return null;
        const normalized = hex.startsWith('#') ? hex.toUpperCase() : ('#' + hex.toUpperCase());
        const role = (p.name || '').toString().trim();
        // 한국어 role 을 영문 의미로 매핑 (모델 이해도 ↑)
        const roleMap = {
          '주색상': 'primary', '메인': 'primary', '메인 컬러': 'primary',
          '보조 1': 'secondary 1', '보조1': 'secondary 1', '보조 컬러': 'secondary',
          '보조 2': 'secondary 2', '보조2': 'secondary 2',
          '강조': 'accent', '강조 컬러': 'accent', '포인트': 'accent',
          '배경': 'background', '배경 컬러': 'background',
        };
        const roleEn = roleMap[role] || role || '';
        return roleEn ? `${normalized} (${roleEn})` : normalized;
      })
      .filter(Boolean);
    if (items.length === 0) return '';
    return [
      '',
      'STRICT COLOR PALETTE — use ONLY these colors as the dominant tones in the image.',
      'Match the lighting, gradients, and shading to harmonize with these exact hex values:',
      items.join(', ') + '.',
      'Background must use the listed background color. Primary subjects/highlights must use primary/accent colors.',
      'Do NOT introduce colors outside this palette except for neutral whites/blacks if absolutely necessary.',
    ].join('\n');
  }

  async function generateImage(prompt, options = {}) {
    let key = getApiKey();
    if (!key) {
      key = promptForKey();
      if (!key) throw new Error('Gemini API 키가 설정되지 않았습니다.');
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${encodeURIComponent(key)}`;

    // 팔레트 힌트 자동 주입 (옵션이 있을 때만)
    const paletteHint = buildPaletteHint(options.palette);
    // 슬라이드용 이미지는 강제로 16:9 widescreen 비율로 생성되도록 추가 지시.
    // options.aspectRatio === 'square' 또는 'portrait' 면 그대로, 기본은 widescreen.
    // options.skipAspectHint === true 면 비율 힌트 생략 (이미 prompt 에 포함된 경우).
    let aspectHint = '';
    if (!options.skipAspectHint && !/\baspect ratio\b/i.test(prompt)) {
      const ratio = options.aspectRatio || 'widescreen';
      if (ratio === 'widescreen' || ratio === '16:9') {
        aspectHint = '\n\nFRAME: WIDESCREEN 16:9 aspect ratio (1280×720 proportions). Subject fills the frame edge to edge. No letterboxing, no black bars, no white margins, no padding around subject. Composition uses full width and height.';
      } else if (ratio === 'square') {
        aspectHint = '\n\nFRAME: 1:1 SQUARE aspect ratio. Subject fills the frame edge to edge.';
      } else if (ratio === 'portrait') {
        aspectHint = '\n\nFRAME: 9:16 PORTRAIT aspect ratio. Subject fills the frame top to bottom.';
      }
    }
    const finalPrompt = (paletteHint ? (prompt + '\n' + paletteHint) : prompt) + aspectHint;

    const body = {
      contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        ...(options.generationConfig || {}),
      },
    };

    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (e) {
      throw new Error('Gemini 이미지 API 네트워크 오류: ' + (e.message || e));
    }

    if (!res.ok) {
      let detail = '';
      try {
        const errJson = await res.json();
        detail = errJson?.error?.message || JSON.stringify(errJson);
        if (res.status === 403) {
          throw new Error('이미지 API 권한 거부 (키가 이미지 모델 접근 권한이 없을 수 있습니다). ' + detail);
        }
        if (res.status === 404) {
          throw new Error('이미지 모델을 찾을 수 없습니다 (지역/계정 제한 가능): ' + detail);
        }
      } catch (parseErr) {
        if (!detail) detail = await res.text().catch(() => '');
      }
      throw new Error(`Gemini 이미지 API ${res.status}: ${detail.slice(0, 300)}`);
    }

    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error('Gemini 이미지 응답 파싱 실패');
    }

    // 응답 MIME 화이트리스트 — 비정상 응답이 javascript:/text/html 같은 위험 스킴을
    // 끼어넣지 못하도록 허용된 이미지 타입만 통과시킨다.
    const ALLOWED_IMAGE_MIME = new Set([
      'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml',
    ]);
    const parts = data?.candidates?.[0]?.content?.parts || [];
    for (const p of parts) {
      const inline = p?.inline_data || p?.inlineData;
      if (inline?.data) {
        const rawMime = (inline.mime_type || inline.mimeType || 'image/png').toLowerCase();
        const mime = ALLOWED_IMAGE_MIME.has(rawMime) ? rawMime : 'image/png';
        // usage 기록 — 이미지 호출 (per-image 단가)
        if (window.gddUsage) {
          try {
            window.gddUsage.record({
              model: IMAGE_MODEL,
              kind: 'image',
              imageCount: 1,
              success: true,
            });
          } catch {}
        }
        return `data:${mime};base64,${inline.data}`;
      }
    }
    // 실패도 호출은 일어났으므로 가벼운 추적
    if (window.gddUsage) {
      try {
        window.gddUsage.record({ model: IMAGE_MODEL, kind: 'image', success: false, cost: 0 });
      } catch {}
    }
    const txt = parts.map(p => p?.text || '').join('').trim();
    throw new Error('이미지가 생성되지 않았습니다.' + (txt ? ' ' + txt.slice(0, 200) : ''));
  }

  window.gemini = {
    complete,
    generateImage,
    buildPaletteHint,
    setApiKey,
    resetApiKey,
    getApiKey,
    setModel,
    getModel,
    imagePartFromDataUrl,
  };
})();
