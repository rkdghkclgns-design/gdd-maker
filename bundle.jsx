/* === GDD 메이커 — 자동 생성 번들 ===
   9개 .jsx 파일을 단일 컴파일 단위로 합침.
   수정은 원본 .jsx 파일에서. 빌드: node build.js
   생성 시각: 2026-05-26T01:44:55.480Z
*/

// ============================================================
// File: tweaks-panel.jsx
// ============================================================

// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({ title = 'Tweaks', noDeckControls = false, children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  // Auto-inject a rail toggle when a <deck-stage> is on the page. The
  // toggle drives the deck's per-viewer _railVisible via window message;
  // state is mirrored from the same localStorage key the deck reads so
  // the control reflects reality across reloads. The mechanism is the
  // message — authors who want custom placement can post it directly
  // and pass noDeckControls to suppress this one.
  const hasDeckStage = React.useMemo(
    () => typeof document !== 'undefined' && !!document.querySelector('deck-stage'),
    [],
  );
  // deck-stage enables its rail in connectedCallback, but this panel can
  // mount before that element has upgraded. The initial read catches the
  // common case; the listener covers mounting first. (Older deck-stage.js
  // copies still wait for the host's __omelette_rail_enabled postMessage —
  // same listener handles those.)
  const [railEnabled, setRailEnabled] = React.useState(
    () => hasDeckStage && !!document.querySelector('deck-stage')?._railEnabled,
  );
  React.useEffect(() => {
    if (!hasDeckStage || railEnabled) return undefined;
    const onMsg = (e) => {
      if (e.data && e.data.type === '__omelette_rail_enabled') setRailEnabled(true);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [hasDeckStage, railEnabled]);
  const [railVisible, setRailVisible] = React.useState(() => {
    try { return localStorage.getItem('deck-stage.railVisible') !== '0'; } catch (e) { return true; }
  });
  const toggleRail = (on) => {
    setRailVisible(on);
    window.postMessage({ type: '__deck_rail_visible', on }, '*');
  };
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel" data-noncommentable=""
           style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={dismiss}>✕</button>
        </div>
        <div className="twk-body">
          {children}
          {hasDeckStage && railEnabled && !noDeckControls && (
            <TweakSection label="Deck">
              <TweakToggle label="Thumbnail rail" value={railVisible} onChange={toggleRail} />
            </TweakSection>
          )}
        </div>
      </div>
    </>
  );
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({ label, children }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakRow({ label, value, children, inline = false }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = (o) => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({ 2: 16, 3: 10 }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = (s) => {
      const m = options.find((o) => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return <TweakSelect label={label} value={value} options={options}
                        onChange={(s) => onChange(resolve(s))} />;
  }
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </TweakRow>
  );
}

function TweakText({ label, value, placeholder, onChange }) {
  return (
    <TweakRow label={label}>
      <input className="twk-field" type="text" value={value} placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)} />
    </TweakRow>
  );
}

function TweakNumber({ label, value, min, max, step = 1, unit = '', onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="twk-num">
      <span className="twk-num-lbl" onPointerDown={onScrubStart}>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
             onChange={(e) => onChange(clamp(Number(e.target.value)))} />
      {unit && <span className="twk-num-unit">{unit}</span>}
    </div>
  );
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}

const __TwkCheck = ({ light }) => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          stroke={light ? 'rgba(0,0,0,.78)' : '#fff'} />
  </svg>
);

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({ label, value, options, onChange }) {
  if (!options || !options.length) {
    return (
      <div className="twk-row twk-row-h">
        <div className="twk-lbl"><span>{label}</span></div>
        <input type="color" className="twk-swatch" value={value}
               onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = (o) => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const colors = Array.isArray(o) ? o : [o];
          const [hero, ...rest] = colors;
          const sup = rest.slice(0, 4);
          const on = key(o) === cur;
          return (
            <button key={i} type="button" className="twk-chip" role="radio"
                    aria-checked={on} data-on={on ? '1' : '0'}
                    aria-label={colors.join(', ')} title={colors.join(' · ')}
                    style={{ background: hero }}
                    onClick={() => onChange(o)}>
              {sup.length > 0 && (
                <span>
                  {sup.map((c, j) => <i key={j} style={{ background: c }} />)}
                </span>
              )}
              {on && <__TwkCheck light={__twkIsLight(hero)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

function TweakButton({ label, onClick, secondary = false }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'}
            onClick={onClick}>{label}</button>
  );
}

Object.assign(window, {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakNumber, TweakColor, TweakButton,
});


// ============================================================
// File: slides.jsx
// ============================================================
/* === Slide renderers for each type ===
   All slides render into a 1280x720 frame and are inline-editable via contentEditable.
   onChange(updaterFn) lets edits patch the slide.data tree. */

const E = (tag, props, ...children) => React.createElement(tag, props, ...children);

/* ====== Inline Markdown 파서 ======
 * 지원: **bold**, *italic*, _italic_, `code`, ~~strike~~, [text](url)
 * 한 줄 단위로 토큰화 후 React node 트리로 변환. 중첩은 미지원(단순/안전).
 * dangerouslySetInnerHTML 미사용 → contentEditable XSS 위험 없음.
 */
function parseInlineMd(line) {
  if (!line) return [];
  const out = [];
  const RE = /(\*\*([^*\n]+?)\*\*)|(`([^`\n]+?)`)|(~~([^~\n]+?)~~)|(\[([^\]\n]+?)\]\(([^)\n]+?)\))|(\*([^*\s][^*\n]*?)\*)|(\b_([^_\s][^_\n]*?)_\b)/g;
  let last = 0;
  let m;
  let key = 0;
  while ((m = RE.exec(line)) !== null) {
    if (m.index > last) out.push(line.slice(last, m.index));
    if (m[1]) out.push(React.createElement('strong', { key: key++, className: 'md-strong' }, m[2]));
    else if (m[3]) out.push(React.createElement('code', { key: key++, className: 'md-code' }, m[4]));
    else if (m[5]) out.push(React.createElement('span', { key: key++, className: 'md-strike' }, m[6]));
    else if (m[7]) out.push(React.createElement('a', { key: key++, className: 'md-link', href: m[9], target: '_blank', rel: 'noopener noreferrer', onClick: (e) => e.stopPropagation() }, m[8]));
    else if (m[10]) out.push(React.createElement('em', { key: key++, className: 'md-em' }, m[11]));
    else if (m[12]) out.push(React.createElement('em', { key: key++, className: 'md-em' }, m[13]));
    last = RE.lastIndex;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

function MarkdownText({ text }) {
  if (!text) return null;
  const lines = String(text).split('\n');
  const nodes = [];
  lines.forEach((line, i) => {
    // 줄머리의 "- " / "* " / "1. " / "2. " 같은 리스트 마커는 시각화
    const bulletMatch = /^(\s*)([-*•])\s+(.*)$/.exec(line);
    const numMatch = /^(\s*)(\d+\.)\s+(.*)$/.exec(line);
    if (bulletMatch) {
      const indent = bulletMatch[1].length;
      nodes.push(React.createElement('span', { key: `b-${i}`, className: 'md-bullet', style: { paddingLeft: 8 + indent * 12 } },
        React.createElement('span', { className: 'md-bullet-marker' }, '•'),
        ...parseInlineMd(bulletMatch[3])
      ));
    } else if (numMatch) {
      const indent = numMatch[1].length;
      nodes.push(React.createElement('span', { key: `n-${i}`, className: 'md-bullet', style: { paddingLeft: 8 + indent * 12 } },
        React.createElement('span', { className: 'md-bullet-marker md-num' }, numMatch[2]),
        ...parseInlineMd(numMatch[3])
      ));
    } else {
      nodes.push(React.createElement(React.Fragment, { key: `l-${i}` }, ...parseInlineMd(line)));
    }
    if (i < lines.length - 1) nodes.push(React.createElement('br', { key: `br-${i}` }));
  });
  return React.createElement(React.Fragment, null, ...nodes);
}

/* ------ tiny helpers ------ */
function Editable({ value, onChange, tag = 'span', placeholder = '...', className, style, multiline = false, readOnly = false, markdown = false }) {
  const ref = React.useRef(null);
  const [editing, setEditing] = React.useState(false);

  // 일반 모드: 기존과 동일하게 항상 contentEditable
  React.useEffect(() => {
    if (markdown && !editing) return; // markdown 표시 모드에서는 React 노드가 직접 렌더링됨
    if (ref.current && ref.current.textContent !== (value || '')) {
      ref.current.textContent = value || '';
    }
  }, [value, editing, markdown]);

  // markdown 편집 모드 진입 시 텍스트와 포커스 설정
  React.useEffect(() => {
    if (!markdown || !editing || !ref.current) return;
    ref.current.textContent = value || '';
    ref.current.focus();
    // 캐럿을 끝으로
    try {
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch {}
  }, [editing, markdown]);

  const handleInput = (e) => onChange && onChange(e.currentTarget.textContent);
  const handleKey = (e) => {
    if (!multiline && e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
  };

  // markdown 옵션이 꺼져 있거나 readOnly + markdown 인 경우 (편집 비활성) — 기존 동작 유지
  if (!markdown) {
    return React.createElement(tag, {
      ref,
      className,
      style,
      contentEditable: !readOnly,
      suppressContentEditableWarning: true,
      onInput: handleInput,
      onKeyDown: handleKey,
      'data-placeholder': placeholder,
      spellCheck: false,
    });
  }

  // markdown ON + 편집 중: 원본 텍스트 그대로 contentEditable
  if (editing && !readOnly) {
    return React.createElement(tag, {
      ref,
      className: (className || '') + ' md-editing',
      style,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onInput: handleInput,
      onBlur: () => setEditing(false),
      onKeyDown: handleKey,
      'data-placeholder': placeholder,
      spellCheck: false,
    });
  }

  // markdown ON + 표시 모드: 파싱된 React 노드 렌더링. 클릭하면 편집 모드 진입.
  return React.createElement(tag, {
    className: (className || '') + ' md-rendered' + (!value ? ' md-empty' : ''),
    style: { cursor: readOnly ? 'default' : 'text', ...(style || {}) },
    onClick: readOnly ? undefined : () => setEditing(true),
    'data-placeholder': placeholder,
  }, value ? React.createElement(MarkdownText, { text: value }) : null);
}

function SlideFooter({ section, sectionName, page, totalPages }) {
  return (
    <div className="footer">
      <div className="left">
        {section && <span>{section}</span>}
        {sectionName && <><span className="dash"></span><span>{sectionName}</span></>}
      </div>
      <div className="page">{String(page).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}</div>
    </div>
  );
}

function TopTag({ section, sectionName, title }) {
  if (!section && !title) return null;
  return (
    <div className="top-tag">
      {section && <span className="num">{section}</span>}
      {sectionName && <span className="sect-title">{sectionName}</span>}
      {title && <span style={{color:'#7d8590'}}>{title}</span>}
    </div>
  );
}

/* ------ 1. Cover ------ */
function CoverSlide({ data, patch, page, totalPages }) {
  return (
    <div className="slide cover">
      {data.imageSrc ? (
        <div className="cover-bg-img" style={{ backgroundImage: `url(${data.imageSrc})` }}></div>
      ) : (
        <div className="bg-grid"></div>
      )}
      <div className="cover-shade"></div>
      <div className="cover-mark">
        <span className="bar"></span>
        <Editable tag="span" value={data.product} onChange={(v) => patch({ product: v })} />
      </div>
      <div className="cover-team">
        <Editable tag="span" value={data.team} onChange={(v) => patch({ team: v })} />
      </div>
      <div className="cover-center">
        <Editable tag="div" className="cover-title" value={data.title} onChange={(v) => patch({ title: v })} />
        <Editable tag="div" className="cover-subtitle" value={data.subtitle} onChange={(v) => patch({ subtitle: v })} />
      </div>
      <div className="cover-meta">
        <Editable tag="div" className="author" value={data.author} onChange={(v) => patch({ author: v })} />
        <Editable tag="div" value={data.date} onChange={(v) => patch({ date: v })} />
      </div>
      <div className="accent-line"></div>
    </div>
  );
}

/* ------ 2. History (version table) ------ */
function HistorySlide({ data, patch, page, totalPages }) {
  const updateRow = (i, key, val) => {
    const rows = [...(data.rows || [])];
    rows[i] = { ...rows[i], [key]: val };
    patch({ rows });
  };
  return (
    <div className="slide">
      <TopTag />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="data-wrap" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <table className="history-table">
          <thead>
            <tr>
              <th style={{ width: '12%' }}>버전</th>
              <th style={{ width: '16%' }}>변경일자</th>
              <th style={{ width: '14%' }}>page</th>
              <th>내용</th>
              <th style={{ width: '16%' }}>작성자</th>
            </tr>
          </thead>
          <tbody>
            {(data.rows || []).map((r, i) => (
              <tr key={i}>
                <td className="ver"><Editable value={r.ver} onChange={(v) => updateRow(i, 'ver', v)} /></td>
                <td><Editable value={r.date} onChange={(v) => updateRow(i, 'date', v)} /></td>
                <td><Editable value={r.page} onChange={(v) => updateRow(i, 'page', v)} /></td>
                <td><Editable value={r.content} onChange={(v) => updateRow(i, 'content', v)} multiline /></td>
                <td><Editable value={r.author} onChange={(v) => updateRow(i, 'author', v)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SlideFooter sectionName="문서 이력" page={page} totalPages={totalPages} />
    </div>
  );
}

/* === 안전한 문자열 변환 — AI 응답이 텍스트 필드에 객체/배열을 넣어
 *    [object Object] 가 화면에 나오는 사고 방지용. validator 가 먼저 손보지만
 *    렌더 단계에서도 한 번 더 안전화한다. */
function safeText(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) {
    return v.map(x => {
      if (x == null) return '';
      if (typeof x === 'string') return x;
      if (typeof x === 'object') return x.name || x.label || x.title || x.text || x.head || x.desc || '';
      return String(x);
    }).filter(Boolean).join(' · ');
  }
  if (typeof v === 'object') {
    return v.name || v.label || v.title || v.text || v.head || v.desc || '';
  }
  return String(v);
}

/* === 정수 → 로마숫자 (1~20) === */
function intToRoman(n) {
  const m = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'];
  if (n >= 1 && n <= 20) return m[n - 1];
  return String(n);
}
/** num 필드가 "01","02"... 또는 "I","II"... 형태로 와도 정수로 정규화 */
function partIndexOf(numLike) {
  if (numLike == null) return 1;
  const s = String(numLike).trim();
  if (/^[IVXLCDM]+$/i.test(s)) {
    const map = { I:1, II:2, III:3, IV:4, V:5, VI:6, VII:7, VIII:8, IX:9, X:10, XI:11, XII:12 };
    return map[s.toUpperCase()] || 1;
  }
  const n = parseInt(s, 10);
  return isFinite(n) ? n : 1;
}

/** toc.parts 가 명시되어 있으면 그 구조, 없으면 entries 를 4등분으로 자동 그룹화. */
function derivePartsFromToc(data) {
  const DEFAULT_META = [
    { sub: 'OVERVIEW', label: '개요' },
    { sub: 'DESIGN', label: '설계' },
    { sub: 'EXECUTION', label: '실행' },
    { sub: 'OPERATIONS', label: '운영' },
  ];
  if (Array.isArray(data.parts) && data.parts.length > 0) {
    return data.parts.map((p, i) => ({
      roman: p.roman || intToRoman(i + 1),
      label: safeText(p.label || p.name || DEFAULT_META[i % 4].label),
      sub: safeText(p.sub || p.subEn || DEFAULT_META[i % 4].sub),
      entries: Array.isArray(p.entries) ? p.entries : [],
    }));
  }
  const entries = Array.isArray(data.entries) ? data.entries : [];
  if (entries.length === 0) return [];
  const partCount = Math.min(4, Math.max(1, Math.ceil(entries.length / 3)));
  const chunkSize = Math.ceil(entries.length / partCount);
  const out = [];
  for (let i = 0; i < partCount; i++) {
    out.push({
      roman: intToRoman(i + 1),
      label: DEFAULT_META[i % 4].label,
      sub: DEFAULT_META[i % 4].sub,
      entries: entries.slice(i * chunkSize, (i + 1) * chunkSize),
    });
  }
  return out;
}

/* ------ 3. TOC (Elegant) ------
 * 첨부 레퍼런스 스타일: 베이지 배경 + 다크 레드 액센트 + 세리프.
 * parts 배열을 우선 사용하고, 없으면 entries 를 4등분으로 자동 그룹.
 */
function TocSlide({ data, patch, page, totalPages }) {
  const parts = derivePartsFromToc(data);
  const updatePart = (pi, field, val) => {
    const parts2 = parts.map(p => ({ ...p }));
    parts2[pi] = { ...parts2[pi], [field]: val };
    patch({ parts: parts2 });
  };
  const updatePartEntry = (pi, ei, field, val) => {
    const parts2 = parts.map(p => ({ ...p, entries: [...(p.entries || [])] }));
    parts2[pi].entries[ei] = { ...parts2[pi].entries[ei], [field]: val };
    patch({ parts: parts2 });
  };
  return (
    <div className="slide toc elegant-toc">
      <div className="toc-elegant-head">
        <span className="toc-num-mark">00</span>
        <span className="toc-label-en">CONTENTS</span>
      </div>
      <Editable tag="h1" className="toc-h1-ko" value={data.titleKo || data.title || '목차'} onChange={(v) => patch({ titleKo: v })} />

      <div className="toc-elegant-grid">
        {parts.map((p, pi) => (
          <div className="toc-part-block" key={pi}>
            <div className="toc-part-roman">{p.roman}</div>
            <div className="toc-part-meta">
              <div className="toc-part-sub">
                <span>PART · {String(pi + 1).padStart(2, '0')} · </span>
                <Editable tag="span" value={safeText(p.sub)} onChange={(v) => updatePart(pi, 'sub', v)} />
              </div>
              <Editable tag="div" className="toc-part-label" value={safeText(p.label)} onChange={(v) => updatePart(pi, 'label', v)} />
            </div>
            <div className="toc-part-divider"></div>
            <div className="toc-part-entries">
              {p.entries.map((e, ei) => (
                <div className="toc-part-entry" key={ei}>
                  <Editable tag="span" className="num" value={safeText(e.num)} onChange={(v) => updatePartEntry(pi, ei, 'num', v)} />
                  <Editable tag="span" className="name" value={safeText(e.name)} onChange={(v) => updatePartEntry(pi, ei, 'name', v)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------ 4. Section divider (Elegant 간지) ------
 * 첨부 레퍼런스 스타일: 좌측 큰 로마숫자, 우측 한글 제목 + 영문 부제 + 설명 + "IN THIS PART" 목록.
 * "IN THIS PART" 는 slides + slideIndex prop 으로 같은 part 의 후속 슬라이드를 자동 추출.
 */
function SectionDividerSlide({ data, patch, page, totalPages, slides, slideIndex }) {
  const idx = partIndexOf(data.num);
  const roman = intToRoman(idx);
  const totalParts = React.useMemo(() => {
    if (!Array.isArray(slides)) return 4;
    const dividers = slides.filter(s => s.type === 'section-divider');
    return Math.max(4, dividers.length);
  }, [slides]);
  const romanTotal = intToRoman(totalParts);

  const inThisPart = React.useMemo(() => {
    if (!Array.isArray(slides) || typeof slideIndex !== 'number') return [];
    const out = [];
    for (let i = slideIndex + 1; i < slides.length; i++) {
      const s = slides[i];
      if (!s) continue;
      if (s.type === 'section-divider') break; // 다음 part 로
      if (['cover', 'history', 'toc', 'section-divider'].includes(s.type)) continue;
      const t = s.data || {};
      const nm = safeText(t.title) || (window.SLIDE_LABELS && window.SLIDE_LABELS[s.type]) || s.type;
      const sub = safeText(t.sectionName) || '';
      out.push({ num: String(out.length + 1).padStart(2, '0'), name: nm, sub });
      if (out.length >= 8) break;
    }
    return out;
  }, [slides, slideIndex]);

  return (
    <div className={'slide section-divider elegant-divider ' + (data.imageSrc ? 'has-bg' : '')}>
      {data.imageSrc && (
        <div className="sd-bg-img" style={{ backgroundImage: `url(${data.imageSrc})` }}></div>
      )}
      <div className="sd-elegant-head">PART · {String(idx).padStart(2, '0')} / {romanTotal}</div>
      <div className="sd-elegant-body">
        <div className="sd-roman-big">{roman}</div>
        <div className="sd-content">
          <Editable tag="h1" className="sd-title-ko" value={data.title} onChange={(v) => patch({ title: v })} />
          <Editable tag="div" className="sd-sub-en" value={safeText(data.sub || data.subEn || '')} onChange={(v) => patch({ sub: v })} placeholder="DESIGN" />
          <Editable tag="div" className="sd-subtitle" value={safeText(data.subtitle)} onChange={(v) => patch({ subtitle: v })} multiline />
          {inThisPart.length > 0 && (
            <>
              <div className="sd-inpart-label">IN THIS PART</div>
              <div className="sd-inpart-list">
                {inThisPart.map((e, i) => (
                  <div className="sd-inpart-row" key={i}>
                    <span className="num">{e.num}</span>
                    <span className="name">{e.name}</span>
                    {e.sub && <span className="sub"> — {e.sub}</span>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------ 4b. Image embed (참고 이미지) ------
 * 인라인 AI 생성 지원: imagePrompt 필드 편집 + ✦ AI 생성 버튼.
 * 비어 있는 placeholder 상태에서도 바로 prompt 입력 + 생성 가능.
 * 이미지 pan/zoom: 마우스 드래그로 위치 이동, 휠로 확대/축소.
 */
function ImageEmbedSlide({ data, patch, page, totalPages }) {
  const fileRef = React.useRef(null);
  const wrapRef = React.useRef(null);
  const [generating, setGenerating] = React.useState(false);
  const [promptDraft, setPromptDraft] = React.useState('');
  const [dragging, setDragging] = React.useState(false);
  const transform = data.imageTransform || { scale: 1, x: 0, y: 0 };

  // 마우스 휠로 zoom — passive 리스너 회피를 위해 useEffect 로 직접 부착
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el || !data.imageSrc) return;
    const onWheel = (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      const cur = data.imageTransform || { scale: 1, x: 0, y: 0 };
      const newScale = Math.max(0.2, Math.min(8, cur.scale * factor));
      patch({ imageTransform: { ...cur, scale: newScale } });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [data.imageSrc, data.imageTransform, patch]);

  // 마우스 드래그 (pan) — window 단위 리스너로 cursor 가 영역을 벗어나도 추적
  const startDrag = (e) => {
    if (!data.imageSrc) return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const start = { ...transform };
    const onMove = (ev) => {
      patch({ imageTransform: { scale: start.scale, x: start.x + (ev.clientX - startX), y: start.y + (ev.clientY - startY) } });
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const resetTransform = (e) => {
    e.stopPropagation();
    patch({ imageTransform: { scale: 1, x: 0, y: 0 } });
  };
  const fitTransform = (e) => {
    // 컨테이너 전체에 맞추기 — scale 1, position 중앙
    e.stopPropagation();
    patch({ imageTransform: { scale: 1, x: 0, y: 0 } });
  };
  const zoomBtn = (factor) => (e) => {
    e.stopPropagation();
    const cur = data.imageTransform || { scale: 1, x: 0, y: 0 };
    patch({ imageTransform: { ...cur, scale: Math.max(0.2, Math.min(8, cur.scale * factor)) } });
  };

  const onPick = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => patch({ imageSrc: reader.result });
    reader.readAsDataURL(f);
  };
  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f || !f.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => patch({ imageSrc: reader.result });
    reader.readAsDataURL(f);
  };

  const generate = async (promptText) => {
    const p = (promptText || data.imagePrompt || '').trim();
    if (!p) {
      if (window.gddToast) window.gddToast('영문 이미지 프롬프트를 입력하세요', 'err');
      return;
    }
    if (!window.gemini || !window.gemini.generateImage) {
      if (window.gddToast) window.gddToast('Gemini API 키를 먼저 설정하세요', 'err');
      return;
    }
    setGenerating(true);
    try {
      // 현재 활성 팔레트(부모 컨셉 색상)를 자동 적용
      const src = await window.gemini.generateImage(p, { palette: window.gddCurrentPalette });
      patch({ imageSrc: src, imagePrompt: p });
      setPromptDraft('');
      if (window.gddToast) window.gddToast('🍌 참고 이미지 생성 완료', 'ok');
    } catch (e) {
      if (window.gddToast) window.gddToast('이미지 생성 실패: ' + (e?.message || e), 'err');
    } finally {
      setGenerating(false);
    }
  };

  const hasPrompt = !!(data.imagePrompt && data.imagePrompt.trim());

  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <div className="image-embed-headline">
        <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
        <div className="image-embed-actions">
          <button
            className="mini-btn ai"
            onClick={() => generate()}
            disabled={generating || !hasPrompt}
            title={hasPrompt ? '아래 imagePrompt 로 이미지 생성' : '먼저 imagePrompt 를 입력하세요'}
          >{generating ? '생성 중…' : '🍌 AI 이미지 생성'}</button>
          <button className="mini-btn" onClick={() => fileRef.current?.click()} title="파일 첨부">📎 파일</button>
        </div>
      </div>
      <Editable tag="div" className="image-embed-caption" value={data.caption} onChange={(v) => patch({ caption: v })} multiline markdown placeholder="이미지가 보여주는 핵심 시각 요소·참조 의도를 한 줄로" />
      {/* imagePrompt 편집 — 영문 프롬프트 */}
      <Editable
        tag="div"
        className="image-embed-prompt"
        value={data.imagePrompt}
        onChange={(v) => patch({ imagePrompt: v })}
        multiline
        placeholder="🍌 영문 이미지 프롬프트 (예: A frozen-in-time street scene with floating debris, cyan glow, cinematic lighting, ultra-detailed concept art)"
      />
      <div
        ref={wrapRef}
        className={'image-embed-wrap' + (dragging ? ' dragging' : '') + (data.imageSrc ? ' has-image' : '')}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => !data.imageSrc && !generating && fileRef.current?.click()}
      >
        <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={onPick} />
        {generating ? (
          <div className="empty image-embed-loading">
            <div className="banana-spin">🍌</div>
            <div className="desc">nano-banana 로 이미지 생성 중…</div>
          </div>
        ) : data.imageSrc ? (
          <>
            <img
              src={data.imageSrc}
              alt="reference"
              draggable={false}
              onMouseDown={startDrag}
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transformOrigin: 'center center',
                cursor: dragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                transition: dragging ? 'none' : 'transform 0.12s ease-out',
              }}
            />
            <div className="image-embed-transform-bar">
              <button onClick={zoomBtn(0.85)} title="축소 (휠 ↓)">−</button>
              <span className="zoom-label">{Math.round(transform.scale * 100)}%</span>
              <button onClick={zoomBtn(1.15)} title="확대 (휠 ↑)">+</button>
              <span className="sep"></span>
              <button onClick={fitTransform} title="전체에 맞추기">⤢ 맞춤</button>
              <button onClick={resetTransform} title="위치·크기 초기화">↻ 초기화</button>
            </div>
            <div className="image-embed-overlay-actions">
              <button onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }} title="파일 교체">↻ 파일</button>
              {hasPrompt && (
                <button onClick={(e) => { e.stopPropagation(); generate(); }} title="AI 재생성">🍌 재생성</button>
              )}
            </div>
          </>
        ) : (
          <div className="empty image-embed-empty" onClick={(e) => e.stopPropagation()}>
            <div className="lbl">REFERENCE IMAGE</div>
            <div className="desc">클릭하여 이미지 첨부 · 드래그 가능</div>
            <div className="image-embed-inline-gen">
              <textarea
                value={promptDraft || data.imagePrompt || ''}
                onChange={(e) => setPromptDraft(e.target.value)}
                placeholder="또는 영문 프롬프트로 자동 생성 (예: A cyan-glowing stopwatch frozen in time, cinematic)…"
                rows={2}
                spellCheck={false}
              />
              <button
                className="btn primary"
                onClick={() => generate(promptDraft || data.imagePrompt)}
                disabled={generating || !((promptDraft || data.imagePrompt || '').trim())}
              >🍌 AI 생성</button>
            </div>
          </div>
        )}
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 5. Intent (4 cards) ------ */
function IntentSlide({ data, patch, page, totalPages }) {
  const updateCard = (i, key, val) => {
    const cards = [...(data.cards || [])];
    cards[i] = { ...cards[i], [key]: val };
    patch({ cards });
  };
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="intent-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <Editable tag="div" className="intent-tagline" value={data.tagline} onChange={(v) => patch({ tagline: v })} multiline />
      <div className="intent-grid">
        {(data.cards || []).map((c, i) => (
          <div className="intent-card" key={i}>
            <Editable className="idx" value={c.idx} onChange={(v) => updateCard(i, 'idx', v)} />
            <Editable tag="div" className="head" value={c.head} onChange={(v) => updateCard(i, 'head', v)} multiline markdown />
            <Editable tag="div" className="desc" value={c.desc} onChange={(v) => updateCard(i, 'desc', v)} multiline markdown />
          </div>
        ))}
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 6. Terms (definition table) ------ */
function TermsSlide({ data, patch, page, totalPages }) {
  const updateRow = (i, key, val) => {
    const rows = [...(data.rows || [])];
    rows[i] = { ...rows[i], [key]: val };
    patch({ rows });
  };
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="data-wrap" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <table className="terms-table">
          <thead>
            <tr>
              <th>용어</th>
              <th>정의</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {(data.rows || []).map((r, i) => (
              <tr key={i}>
                <td className="term"><Editable tag="div" value={r.term} onChange={(v) => updateRow(i, 'term', v)} markdown /></td>
                <td className="def"><Editable tag="div" value={r.def} onChange={(v) => updateRow(i, 'def', v)} multiline markdown /></td>
                <td className="note"><Editable tag="div" value={r.note} onChange={(v) => updateRow(i, 'note', v)} multiline markdown /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 7. Rules (block list) ------ */
function RulesSlide({ data, patch, replace, page, totalPages }) {
  const [converting, setConverting] = React.useState(false);
  const updateBlock = (i, key, val) => {
    const blocks = [...(data.blocks || [])];
    blocks[i] = { ...blocks[i], [key]: val };
    patch({ blocks });
  };
  const updateItem = (bi, ii, val) => {
    const blocks = [...(data.blocks || [])];
    const items = [...(blocks[bi].items || [])];
    items[ii] = val;
    blocks[bi] = { ...blocks[bi], items };
    patch({ blocks });
  };

  // 현재 rules 슬라이드의 텍스트 내용을 모아 AI에 보내고, flow 슬라이드로 변환
  const convertToFlow = async () => {
    if (!replace) return;
    const rulesText = [
      `규칙 제목: ${data.title || ''}`,
      ...(data.blocks || []).map(b => {
        return `[${b.head || '블록'}]\n` + (b.items || []).map(i => '- ' + i).join('\n');
      }),
    ].join('\n\n') + '\n\n위 규칙들에 포함된 조건/동작/분기/엣지케이스를 절차적 흐름(flow chart)으로 시각화하라. 정적 상수만 있는 규칙은 무시하고, [조건]→[동작] 패턴을 decision/process/end 노드로 표현한다.';

    setConverting(true);
    try {
      const result = await (window.aiGenerateFlow ? window.aiGenerateFlow(rulesText) : null);
      if (result && Array.isArray(result.nodes) && result.nodes.length) {
        replace({
          type: 'flow',
          data: {
            section: data.section || '02',
            sectionName: data.sectionName || '플로우 차트',
            title: data.title || '플로우 차트',
            nodes: result.nodes,
          },
        });
      } else if (window.gddToast) {
        window.gddToast('변환 실패 — AI 응답을 파싱하지 못했습니다.', 'err');
      }
    } catch (e) {
      if (window.gddToast) window.gddToast('변환 실패: ' + (e.message || e), 'err');
    } finally {
      setConverting(false);
    }
  };

  const useGrid = (data.blocks || []).length > 2;
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      {replace && (
        <div className="flow-edit-bar">
          <button className="mini-btn ai" onClick={convertToFlow} disabled={converting}
                  title="이 규칙들의 절차적 분기를 flow chart로 변환합니다. 원래 슬라이드는 대체됩니다.">
            {converting ? '변환 중…' : '⇄ 플로우 차트로 변환'}
          </button>
        </div>
      )}
      <div className={useGrid ? 'rules-grid' : 'rules-wrap'} style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {(data.blocks || []).map((b, i) => (
          <div className="rule-block" key={i}>
            <Editable tag="div" className="head" value={b.head} onChange={(v) => updateBlock(i, 'head', v)} markdown />
            <ul>
              {(b.items || []).map((it, ii) => (
                <li key={ii}><Editable tag="div" value={it} onChange={(v) => updateItem(i, ii, v)} multiline markdown /></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 8. Data table ------ */
/* 컬럼 수가 많으면 자동으로 폰트 축소 + 가로 스크롤. splitter 가 8 컬럼 초과 시 추가 슬라이드로 분리한다. */
function DataTableSlide({ data, patch, page, totalPages }) {
  const updateCell = (i, key, val) => {
    const rows = [...(data.rows || [])];
    rows[i] = { ...rows[i], [key]: val };
    patch({ rows });
  };
  const cols = data.columns || [];
  // 컬럼 수에 따라 폰트 사이즈 / 패딩 자동 축소 — 잘림 방지 (테이블 자체는 splitter 가 추가 분리)
  let densityClass = '';
  if (cols.length >= 12) densityClass = ' density-xs';
  else if (cols.length >= 9) densityClass = ' density-sm';
  else if (cols.length >= 7) densityClass = ' density-md';
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="data-wrap" style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <table className={'data-table' + densityClass}>
          <thead>
            <tr>
              {cols.map((c, i) => (
                <th key={i} style={c.width ? { width: c.width } : undefined}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data.rows || []).map((r, i) => (
              <tr key={i}>
                {cols.map((c, ci) => (
                  <td key={ci} className={c.key === 'field' || c.key === 'table' || c.key === 'id' ? 'tag' : ''}>
                    <Editable tag="div" value={(r[c.key] == null ? '' : (typeof r[c.key] === 'object' ? JSON.stringify(r[c.key]) : String(r[c.key])))} onChange={(v) => updateCell(i, c.key, v)} multiline markdown />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 9. Flow chart ------ */
function FlowSlide({ data, patch, page, totalPages }) {
  const updateNode = (i, val) => {
    const nodes = [...(data.nodes || [])];
    nodes[i] = { ...nodes[i], label: val };
    patch({ nodes });
  };
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="flow-wrap">
        <div className="flow-chart">
          {(data.nodes || []).map((n, i) => (
            <React.Fragment key={i}>
              <div className={'flow-node ' + (n.kind || 'process')}>
                <Editable value={n.label} onChange={(v) => updateNode(i, v)} multiline />
              </div>
              {i < (data.nodes || []).length - 1 && <div className="flow-arrow"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 10. UI design ------ */
function UiDesignSlide({ data, patch, page, totalPages }) {
  const fileRef = React.useRef(null);
  const [generating, setGenerating] = React.useState(false);
  const [promptDraft, setPromptDraft] = React.useState('');

  const updateCallout = (i, key, val) => {
    const cs = [...(data.callouts || [])];
    cs[i] = { ...cs[i], [key]: val };
    patch({ callouts: cs });
  };

  const onPick = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => patch({ imageSrc: reader.result });
    reader.readAsDataURL(f);
  };
  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f || !f.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => patch({ imageSrc: reader.result });
    reader.readAsDataURL(f);
  };

  const generate = async (promptText) => {
    const p = (promptText || data.imagePrompt || '').trim();
    if (!p) {
      if (window.gddToast) window.gddToast('영문 imagePrompt 를 입력하세요', 'err');
      return;
    }
    if (!window.gemini || !window.gemini.generateImage) {
      if (window.gddToast) window.gddToast('Gemini API 키를 먼저 설정하세요', 'err');
      return;
    }
    setGenerating(true);
    try {
      // 현재 활성 팔레트(부모 컨셉 색상)를 자동 적용
      const src = await window.gemini.generateImage(p, { palette: window.gddCurrentPalette });
      patch({ imageSrc: src, imagePrompt: p });
      setPromptDraft('');
      if (window.gddToast) window.gddToast('🍌 UI 목업 생성 완료', 'ok');
    } catch (e) {
      if (window.gddToast) window.gddToast('이미지 생성 실패: ' + (e?.message || e), 'err');
    } finally {
      setGenerating(false);
    }
  };
  const hasPrompt = !!(data.imagePrompt && data.imagePrompt.trim());

  /** 자동 배치 폴백: callout에 x/y가 없을 때 균등 배치(가장자리 우선). [4,96] clamp. */
  const rawCallouts = data.callouts || [];
  const rawPositions = rawCallouts.map((c, i) => {
    if (typeof c.x === 'number' && typeof c.y === 'number') {
      return { x: Math.max(4, Math.min(96, c.x)), y: Math.max(4, Math.min(96, c.y)) };
    }
    const fallbacks = [
      { x: 12, y: 15 }, { x: 88, y: 15 }, { x: 88, y: 50 },
      { x: 88, y: 85 }, { x: 12, y: 85 }, { x: 12, y: 50 },
      { x: 50, y: 15 }, { x: 50, y: 85 },
    ];
    return fallbacks[i % fallbacks.length];
  });
  /* 시각 읽기 순서로 정렬 — y 우선(차이 ≥8% 일 때 행이 다른 것으로 간주), 그 다음 x.
   * 정렬은 표시 전용. 편집은 originalIdx 로 원본 배열에 적용해 컨텍스트 보존. */
  const sortedCallouts = React.useMemo(() => {
    return rawCallouts.map((c, originalIdx) => ({ c, originalIdx, pos: rawPositions[originalIdx] }))
      .sort((a, b) => {
        if (Math.abs(a.pos.y - b.pos.y) > 8) return a.pos.y - b.pos.y;
        return a.pos.x - b.pos.x;
      });
  }, [rawCallouts, rawPositions]);
  // originalIdx → 표시 번호 (1-based) 매핑
  const displayNumByOriginal = React.useMemo(() => {
    const m = new Map();
    sortedCallouts.forEach((s, displayIdx) => m.set(s.originalIdx, displayIdx + 1));
    return m;
  }, [sortedCallouts]);

  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <div className="ui-design-headline">
        <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
        <div className="image-embed-actions">
          <button
            className="mini-btn ai"
            onClick={() => generate()}
            disabled={generating || !hasPrompt}
            title={hasPrompt ? 'imagePrompt 로 UI 목업 생성' : '먼저 imagePrompt 를 입력하세요'}
          >{generating ? '생성 중…' : '🍌 AI 목업 생성'}</button>
          <button className="mini-btn" onClick={() => fileRef.current?.click()} title="파일 첨부">📎 파일</button>
        </div>
      </div>
      {/* imagePrompt 편집 — 영문 프롬프트 */}
      <Editable
        tag="div"
        className="image-embed-prompt ui-design-prompt"
        value={data.imagePrompt}
        onChange={(v) => patch({ imagePrompt: v })}
        multiline
        placeholder="🍌 영문 UI 목업 프롬프트 (예: A clean dark sci-fi game HUD with HP bar top-left, minimap top-right, action bar bottom, 16:9)"
      />
      <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={onPick} />
      <div className="ui-design-wrap">
        <div className="ui-mockup"
             onDragOver={(e) => e.preventDefault()}
             onDrop={onDrop}>
          <div className="mock-bar"><span></span><span></span><span></span></div>
          <div className="mock-canvas">
            {generating ? (
              <div className="placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div className="banana-spin">🍌</div>
                <div className="lbl">GENERATING…</div>
                <div className="desc">nano-banana 로 UI 목업 생성 중</div>
              </div>
            ) : data.imageSrc ? (
              <img src={data.imageSrc} alt="UI mockup" className="ui-mockup-img" />
            ) : (
              <>
                <div className="ui-mockup-grid"></div>
                <div className="placeholder">
                  <div className="lbl">UI MOCKUP</div>
                  <div className="desc">클릭하여 첨부 · 드래그 · AI 생성 모두 가능</div>
                  <div className="image-embed-inline-gen" style={{ marginTop: 14, width: 'min(80%, 480px)' }}>
                    <textarea
                      value={promptDraft || data.imagePrompt || ''}
                      onChange={(e) => setPromptDraft(e.target.value)}
                      placeholder="또는 영문 프롬프트로 UI 목업 생성 (예: A dark sci-fi game HUD…)"
                      rows={2}
                      spellCheck={false}
                    />
                    <button
                      className="btn primary"
                      onClick={(e) => { e.stopPropagation(); generate(promptDraft || data.imagePrompt); }}
                      disabled={generating || !((promptDraft || data.imagePrompt || '').trim())}
                    >🍌 AI 생성</button>
                  </div>
                </div>
              </>
            )}
            {/* 콜아웃 넘버링 배지 — 시각 위치 기준 정렬된 번호 (y, x) */}
            {!generating && rawCallouts.map((c, originalIdx) => (
              <div
                key={originalIdx}
                className="ui-callout-badge"
                style={{ left: `${rawPositions[originalIdx].x}%`, top: `${rawPositions[originalIdx].y}%` }}
                title={c.name}
              >
                {displayNumByOriginal.get(originalIdx)}
              </div>
            ))}
          </div>
        </div>
        <div className="ui-callouts">
          {/* 우측 리스트도 동일하게 시각 순서로 정렬해서 표시 — 배지 번호와 1:1 매칭 */}
          {sortedCallouts.map((s) => (
            <div className="ui-callout" key={s.originalIdx}>
              <div className="num">{displayNumByOriginal.get(s.originalIdx)}</div>
              <div className="text" style={{ flex: 1 }}>
                <Editable tag="div" className="name" value={s.c.name} onChange={(v) => updateCallout(s.originalIdx, 'name', v)} markdown />
                <Editable tag="div" className="desc" value={s.c.desc} onChange={(v) => updateCallout(s.originalIdx, 'desc', v)} multiline markdown />
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 11. Resources ------
 * category 구조:
 *   { name, count, guideline?, items: [{ name, spec?, example? } | "string"] }
 * 하위호환: items 가 문자열 배열이어도 그대로 표시.
 */
function ResourcesSlide({ data, patch, page, totalPages }) {
  const updateCat = (i, key, val) => {
    const cats = [...(data.categories || [])];
    cats[i] = { ...cats[i], [key]: val };
    patch({ categories: cats });
  };
  const updateItem = (ci, ii, key, val) => {
    const cats = [...(data.categories || [])];
    const items = [...(cats[ci].items || [])];
    const cur = items[ii];
    if (typeof cur === 'string') {
      // 문자열 → 객체로 마이그레이션
      items[ii] = { name: cur, spec: '', example: '' };
    } else {
      items[ii] = { ...(cur || {}), [key]: val };
    }
    if (key === 'name' || key === 'spec' || key === 'example') {
      items[ii] = { ...items[ii], [key]: val };
    }
    cats[ci] = { ...cats[ci], items };
    patch({ categories: cats });
  };
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="resources-grid">
        {(data.categories || []).map((c, i) => (
          <div className="resource-cat" key={i}>
            <div className="cat-head">
              <Editable className="cat-name" value={c.name} onChange={(v) => updateCat(i, 'name', v)} />
              <Editable className="cat-count" value={c.count} onChange={(v) => updateCat(i, 'count', v)} />
            </div>
            {/* 카테고리별 가이드라인 — 해상도·포맷·네이밍 규칙·톤앤매너 */}
            <Editable
              tag="div"
              className="cat-guideline"
              value={c.guideline}
              onChange={(v) => updateCat(i, 'guideline', v)}
              multiline
              markdown
              placeholder="가이드라인 (해상도·포맷·네이밍·톤앤매너 등) — 마크다운 지원"
            />
            <ul className="resource-items">
              {(c.items || []).map((it, ii) => {
                const obj = typeof it === 'string' ? { name: it, spec: '', example: '' } : (it || {});
                return (
                  <li key={ii} className="resource-item">
                    <Editable tag="div" className="ri-name"
                      value={obj.name}
                      onChange={(v) => updateItem(i, ii, 'name', v)}
                      multiline markdown
                      placeholder="에셋 이름" />
                    {(obj.spec || obj.spec === '') && (
                      <Editable tag="div" className="ri-spec"
                        value={obj.spec}
                        onChange={(v) => updateItem(i, ii, 'spec', v)}
                        multiline markdown
                        placeholder="사양 (해상도·tris·포맷·길이 등)" />
                    )}
                    {(obj.example || obj.example === '') && (
                      <Editable tag="div" className="ri-example"
                        value={obj.example}
                        onChange={(v) => updateItem(i, ii, 'example', v)}
                        multiline markdown
                        placeholder="예시 / 참고 (파일명·레퍼런스 링크 등)" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ====== Phase 1 신규 슬라이드 — 개발 가능 수준 보장용 ====== */

/* ------ 12. Balance Table (수치 밸런싱 + 공식) ------ */
function BalanceTableSlide({ data, patch, page, totalPages }) {
  const vars = data.vars || [];
  const updateVar = (i, key, v) => {
    const next = [...vars];
    next[i] = { ...next[i], [key]: v };
    patch({ vars: next });
  };
  const addVar = () => patch({ vars: [...vars, { name: '새 변수', formula: '', range: '', defaultValue: '', sensitivity: '', notes: '' }] });
  const removeVar = (i) => patch({ vars: vars.filter((_, j) => j !== i) });
  // 미니 라인 차트 — curve.x, curve.y 가 있을 때만
  const curve = data.curve;
  const renderCurve = () => {
    if (!curve || !Array.isArray(curve.x) || !Array.isArray(curve.y) || curve.x.length < 2) return null;
    const xs = curve.x, ys = curve.y;
    const w = 1080, h = 140, padX = 36, padY = 12;
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const yMin = Math.min(...ys), yMax = Math.max(...ys);
    const xRange = (xMax - xMin) || 1;
    const yRange = (yMax - yMin) || 1;
    const pts = xs.map((x, i) => {
      const px = padX + ((x - xMin) / xRange) * (w - padX * 2);
      const py = h - padY - ((ys[i] - yMin) / yRange) * (h - padY * 2);
      return `${px},${py}`;
    }).join(' ');
    return (
      <div className="balance-curve">
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <polyline points={pts} fill="none" stroke="var(--accent, #4cc2ff)" strokeWidth="2" />
          {xs.map((x, i) => {
            const px = padX + ((x - xMin) / xRange) * (w - padX * 2);
            const py = h - padY - ((ys[i] - yMin) / yRange) * (h - padY * 2);
            return <circle key={i} cx={px} cy={py} r="3" fill="var(--accent, #4cc2ff)" />;
          })}
        </svg>
        <div className="curve-axes">
          <span className="x-label">{curve.xLabel || 'x'}</span>
          <span className="y-label">{curve.yLabel || 'y'}</span>
        </div>
      </div>
    );
  };
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      {(data.formula || data.formula === '') && (
        <Editable tag="div" className="balance-formula"
          value={data.formula}
          onChange={(v) => patch({ formula: v })}
          markdown multiline
          placeholder="핵심 공식 (예: `dmg = base × (1 + str/100) × elem_mod`)" />
      )}
      <div className="data-wrap" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <table className="balance-table">
          <thead>
            <tr>
              <th style={{ width: '18%' }}>변수</th>
              <th style={{ width: '26%' }}>공식 / 정의</th>
              <th style={{ width: '14%' }}>범위</th>
              <th style={{ width: '12%' }}>기본값</th>
              <th>민감도 / 메모</th>
              <th style={{ width: '4%' }}></th>
            </tr>
          </thead>
          <tbody>
            {vars.map((v, i) => (
              <tr key={i}>
                <td className="tag"><Editable tag="div" value={v.name} onChange={(val) => updateVar(i, 'name', val)} multiline markdown /></td>
                <td><Editable tag="div" value={v.formula} onChange={(val) => updateVar(i, 'formula', val)} multiline markdown /></td>
                <td><Editable tag="div" value={v.range} onChange={(val) => updateVar(i, 'range', val)} multiline markdown placeholder="0~100" /></td>
                <td><Editable tag="div" value={v.defaultValue} onChange={(val) => updateVar(i, 'defaultValue', val)} multiline markdown /></td>
                <td><Editable tag="div" value={v.sensitivity || v.notes} onChange={(val) => updateVar(i, 'sensitivity', val)} multiline markdown placeholder="±10% 변경 시 영향" /></td>
                <td><button className="sc-del" onClick={() => removeVar(i)} title="삭제">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="sc-add" onClick={addVar} style={{ marginTop: 8 }}>+ 변수 추가</button>
        {renderCurve()}
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 13. State Machine (상태 + 전이 매트릭스) ------ */
function StateMachineSlide({ data, patch, page, totalPages }) {
  const states = data.states || [];
  const transitions = data.transitions || [];
  const updateState = (i, key, v) => {
    const next = [...states];
    next[i] = { ...next[i], [key]: v };
    patch({ states: next });
  };
  const updateTrans = (i, key, v) => {
    const next = [...transitions];
    next[i] = { ...next[i], [key]: v };
    patch({ transitions: next });
  };
  const updateInvariant = (si, ii, v) => {
    const next = [...states];
    const inv = [...(next[si].invariants || [])];
    inv[ii] = v;
    next[si] = { ...next[si], invariants: inv };
    patch({ states: next });
  };
  const addState = () => patch({ states: [...states, { id: 's' + (states.length + 1), name: 'STATE', kind: 'normal', onEnter: '', onExit: '', invariants: [] }] });
  const addInvariant = (si) => {
    const next = [...states];
    next[si] = { ...next[si], invariants: [...(next[si].invariants || []), '불변 조건'] };
    patch({ states: next });
  };
  const addTrans = () => patch({ transitions: [...transitions, { from: states[0]?.id || '', to: states[0]?.id || '', event: 'EVENT', guard: '', action: '' }] });
  const removeState = (i) => patch({ states: states.filter((_, j) => j !== i) });
  const removeTrans = (i) => patch({ transitions: transitions.filter((_, j) => j !== i) });
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="state-machine-wrap" style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', gap: 16 }}>
        <div className="sm-states-col">
          <div className="sm-section-head">STATES <button className="sc-add inline" onClick={addState}>+</button></div>
          {states.map((s, i) => (
            <div className={'sm-state sm-kind-' + (s.kind || 'normal')} key={i}>
              <div className="sm-state-head">
                <Editable tag="span" className="sm-state-id" value={s.id} onChange={(v) => updateState(i, 'id', v)} placeholder="id" />
                <Editable tag="span" className="sm-state-name" value={s.name} onChange={(v) => updateState(i, 'name', v)} placeholder="STATE_NAME" />
                <select value={s.kind || 'normal'} onChange={(e) => updateState(i, 'kind', e.target.value)}>
                  <option value="initial">initial</option>
                  <option value="normal">normal</option>
                  <option value="final">final</option>
                  <option value="error">error</option>
                </select>
                <button className="sc-del" onClick={() => removeState(i)} title="삭제">✕</button>
              </div>
              <div className="sm-state-body">
                <label>onEnter</label>
                <Editable tag="div" className="sm-action" value={s.onEnter} onChange={(v) => updateState(i, 'onEnter', v)} multiline markdown placeholder="진입 시 동작 — `disableInput()`, `playEnterAnim()`" />
                <label>onExit</label>
                <Editable tag="div" className="sm-action" value={s.onExit} onChange={(v) => updateState(i, 'onExit', v)} multiline markdown placeholder="이탈 시 동작" />
                <label>invariants</label>
                <ul className="sm-invariants">
                  {(s.invariants || []).map((inv, ii) => (
                    <li key={ii}><Editable tag="div" value={inv} onChange={(v) => updateInvariant(i, ii, v)} multiline markdown placeholder="`input_locked == true`" /></li>
                  ))}
                </ul>
                <button className="sc-add inline" onClick={() => addInvariant(i)}>+ 불변 조건</button>
              </div>
            </div>
          ))}
        </div>
        <div className="sm-trans-col">
          <div className="sm-section-head">TRANSITIONS <button className="sc-add inline" onClick={addTrans}>+</button></div>
          <table className="sm-trans-table">
            <thead><tr><th>from</th><th>event</th><th>guard</th><th>to</th><th>action</th><th></th></tr></thead>
            <tbody>
              {transitions.map((t, i) => (
                <tr key={i}>
                  <td>
                    <select value={t.from} onChange={(e) => updateTrans(i, 'from', e.target.value)}>
                      <option value="">-</option>
                      {states.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                    </select>
                  </td>
                  <td><Editable tag="div" value={t.event} onChange={(v) => updateTrans(i, 'event', v)} markdown placeholder="EVENT" /></td>
                  <td><Editable tag="div" value={t.guard} onChange={(v) => updateTrans(i, 'guard', v)} markdown placeholder="`hp > 0`" /></td>
                  <td>
                    <select value={t.to} onChange={(e) => updateTrans(i, 'to', e.target.value)}>
                      <option value="">-</option>
                      {states.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                    </select>
                  </td>
                  <td><Editable tag="div" value={t.action} onChange={(v) => updateTrans(i, 'action', v)} markdown multiline placeholder="동작" /></td>
                  <td><button className="sc-del" onClick={() => removeTrans(i)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 14. API Contract (엔드포인트 + 스키마 + 에러) ------ */
function ApiContractSlide({ data, patch, page, totalPages }) {
  const errors = data.errors || [];
  const updateError = (i, key, v) => {
    const next = [...errors];
    next[i] = { ...next[i], [key]: v };
    patch({ errors: next });
  };
  const addError = () => patch({ errors: [...errors, { code: '400', message: '에러 메시지', when: '발생 조건' }] });
  const removeError = (i) => patch({ errors: errors.filter((_, j) => j !== i) });
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="api-contract-head">
        <select className="api-method" value={data.method || 'POST'} onChange={(e) => patch({ method: e.target.value })}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
        <Editable tag="div" className="api-endpoint" value={data.endpoint} onChange={(v) => patch({ endpoint: v })} placeholder="/api/match/create" />
        <select className="api-auth" value={data.auth || 'bearer'} onChange={(e) => patch({ auth: e.target.value })}>
          <option value="none">no auth</option>
          <option value="bearer">Bearer</option>
          <option value="session">Session</option>
          <option value="signature">HMAC sig</option>
        </select>
        <Editable tag="div" className="api-sla" value={String(data.slaMs || '')} onChange={(v) => patch({ slaMs: parseInt(v, 10) || 200 })} placeholder="200ms" />
      </div>
      <div className="data-wrap" style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="api-pane">
          <div className="api-pane-label">REQUEST 스키마</div>
          <Editable tag="pre" className="api-schema" value={data.request} onChange={(v) => patch({ request: v })} multiline placeholder='{"matchId":"uuid","userId":"uuid","mode":"casual|ranked"}' />
        </div>
        <div className="api-pane">
          <div className="api-pane-label">RESPONSE 스키마</div>
          <Editable tag="pre" className="api-schema" value={data.response} onChange={(v) => patch({ response: v })} multiline placeholder='{"sessionId":"uuid","gameServer":"host:port","token":"jwt"}' />
        </div>
        <div className="api-pane" style={{ gridColumn: '1 / -1' }}>
          <div className="api-pane-label">ERRORS <button className="sc-add inline" onClick={addError}>+</button></div>
          <table className="api-errors-table">
            <thead><tr><th style={{ width: '14%' }}>code</th><th style={{ width: '28%' }}>message</th><th>when</th><th style={{ width: '4%' }}></th></tr></thead>
            <tbody>
              {errors.map((e, i) => (
                <tr key={i}>
                  <td className="tag"><Editable tag="div" value={e.code} onChange={(v) => updateError(i, 'code', v)} /></td>
                  <td><Editable tag="div" value={e.message} onChange={(v) => updateError(i, 'message', v)} multiline markdown /></td>
                  <td><Editable tag="div" value={e.when} onChange={(v) => updateError(i, 'when', v)} multiline markdown /></td>
                  <td><button className="sc-del" onClick={() => removeError(i)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(data.idempotencyKey || data.notes) && (
          <div className="api-pane" style={{ gridColumn: '1 / -1' }}>
            <div className="api-pane-label">메모</div>
            <Editable tag="div" className="api-notes" value={data.idempotencyKey} onChange={(v) => patch({ idempotencyKey: v })} markdown multiline placeholder="idempotency key 정책 — `X-Idempotency-Key` 헤더, 24h TTL 등" />
            <Editable tag="div" className="api-notes" value={data.notes} onChange={(v) => patch({ notes: v })} markdown multiline placeholder="기타 메모" />
          </div>
        )}
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 15. Acceptance Criteria (Given/When/Then + edge cases) ------ */
function AcceptanceCriteriaSlide({ data, patch, page, totalPages }) {
  const criteria = data.criteria || [];
  const story = data.userStory || { as: '', want: '', soThat: '' };
  const updateStory = (key, v) => patch({ userStory: { ...story, [key]: v } });
  const updateCriterion = (i, key, v) => {
    const next = [...criteria];
    next[i] = { ...next[i], [key]: v };
    patch({ criteria: next });
  };
  const updateEdge = (ci, ei, v) => {
    const next = [...criteria];
    const edges = [...(next[ci].edgeCases || [])];
    edges[ei] = v;
    next[ci] = { ...next[ci], edgeCases: edges };
    patch({ criteria: next });
  };
  const addCriterion = () => patch({ criteria: [...criteria, { id: `AC-${criteria.length + 1}`, given: '', when: '', then: '', edgeCases: [] }] });
  const addEdge = (ci) => {
    const next = [...criteria];
    next[ci] = { ...next[ci], edgeCases: [...(next[ci].edgeCases || []), '엣지 케이스'] };
    patch({ criteria: next });
  };
  const removeCriterion = (i) => patch({ criteria: criteria.filter((_, j) => j !== i) });
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="ac-story">
        <span className="ac-label">AS A</span>
        <Editable tag="div" className="ac-story-field" value={story.as} onChange={(v) => updateStory('as', v)} markdown placeholder="신규 유저" />
        <span className="ac-label">I WANT</span>
        <Editable tag="div" className="ac-story-field" value={story.want} onChange={(v) => updateStory('want', v)} markdown placeholder="첫 매치를 빠르게 시작하길" />
        <span className="ac-label">SO THAT</span>
        <Editable tag="div" className="ac-story-field" value={story.soThat} onChange={(v) => updateStory('soThat', v)} markdown placeholder="D1 리텐션이 60%↑ 유지된다" />
      </div>
      <div className="ac-list" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {criteria.map((c, i) => (
          <div className="ac-card" key={i}>
            <div className="ac-card-head">
              <Editable tag="span" className="ac-id" value={c.id} onChange={(v) => updateCriterion(i, 'id', v)} />
              <button className="sc-del" onClick={() => removeCriterion(i)}>✕</button>
            </div>
            <div className="ac-gwt">
              <div className="ac-row"><span className="kw given">GIVEN</span><Editable tag="div" className="ac-text" value={c.given} onChange={(v) => updateCriterion(i, 'given', v)} markdown multiline placeholder="유저가 로그인 직후 메인 로비에 있다" /></div>
              <div className="ac-row"><span className="kw when">WHEN</span><Editable tag="div" className="ac-text" value={c.when} onChange={(v) => updateCriterion(i, 'when', v)} markdown multiline placeholder="`매칭` 버튼을 탭한다" /></div>
              <div className="ac-row"><span className="kw then">THEN</span><Editable tag="div" className="ac-text" value={c.then} onChange={(v) => updateCriterion(i, 'then', v)} markdown multiline placeholder="3초 이내에 매칭 진행 모달이 표시된다" /></div>
            </div>
            <div className="ac-edges">
              <div className="ac-edges-label">엣지 케이스</div>
              <ul>
                {(c.edgeCases || []).map((e, ei) => (
                  <li key={ei}><Editable tag="div" value={e} onChange={(v) => updateEdge(i, ei, v)} markdown multiline /></li>
                ))}
              </ul>
              <button className="sc-add inline" onClick={() => addEdge(i)}>+ 엣지 케이스</button>
            </div>
          </div>
        ))}
        <button className="sc-add" onClick={addCriterion} style={{ marginTop: 8 }}>+ 수락 기준 추가</button>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 16. Telemetry (이벤트 카탈로그 + 펀넬) ------ */
function TelemetrySlide({ data, patch, page, totalPages }) {
  const events = data.events || [];
  const funnels = data.funnels || [];
  const updateEvent = (i, key, v) => {
    const next = [...events];
    next[i] = { ...next[i], [key]: v };
    patch({ events: next });
  };
  const updateProp = (ei, pi, key, v) => {
    const next = [...events];
    const props = [...(next[ei].props || [])];
    props[pi] = { ...props[pi], [key]: v };
    next[ei] = { ...next[ei], props };
    patch({ events: next });
  };
  const addEvent = () => patch({ events: [...events, { name: 'new_event', when: '', props: [], kpi: '' }] });
  const addProp = (ei) => {
    const next = [...events];
    next[ei] = { ...next[ei], props: [...(next[ei].props || []), { key: 'prop_key', type: 'string', required: true, note: '' }] };
    patch({ events: next });
  };
  const removeEvent = (i) => patch({ events: events.filter((_, j) => j !== i) });
  const removeProp = (ei, pi) => {
    const next = [...events];
    next[ei] = { ...next[ei], props: (next[ei].props || []).filter((_, j) => j !== pi) };
    patch({ events: next });
  };
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="data-wrap" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {events.map((e, ei) => (
          <div className="telemetry-event" key={ei}>
            <div className="te-head">
              <Editable tag="span" className="te-name" value={e.name} onChange={(v) => updateEvent(ei, 'name', v)} placeholder="event_name" />
              <Editable tag="span" className="te-kpi" value={e.kpi} onChange={(v) => updateEvent(ei, 'kpi', v)} markdown placeholder="KPI: D1 retention" />
              <button className="sc-del" onClick={() => removeEvent(ei)}>✕</button>
            </div>
            <Editable tag="div" className="te-when" value={e.when} onChange={(v) => updateEvent(ei, 'when', v)} markdown multiline placeholder="발생 시점 — `매칭 시작 버튼 탭` 또는 `세션 생성 완료`" />
            <table className="te-props">
              <thead><tr><th>key</th><th>type</th><th>req</th><th>설명</th><th></th></tr></thead>
              <tbody>
                {(e.props || []).map((p, pi) => (
                  <tr key={pi}>
                    <td className="tag"><Editable tag="div" value={p.key} onChange={(v) => updateProp(ei, pi, 'key', v)} /></td>
                    <td>
                      <select value={p.type || 'string'} onChange={(ev) => updateProp(ei, pi, 'type', ev.target.value)}>
                        <option value="string">string</option>
                        <option value="number">number</option>
                        <option value="boolean">boolean</option>
                        <option value="enum">enum</option>
                        <option value="uuid">uuid</option>
                        <option value="datetime">datetime</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input type="checkbox" checked={!!p.required} onChange={(ev) => updateProp(ei, pi, 'required', ev.target.checked)} />
                    </td>
                    <td><Editable tag="div" value={p.note} onChange={(v) => updateProp(ei, pi, 'note', v)} markdown multiline /></td>
                    <td><button className="sc-del" onClick={() => removeProp(ei, pi)}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="sc-add inline" onClick={() => addProp(ei)}>+ prop</button>
          </div>
        ))}
        <button className="sc-add" onClick={addEvent} style={{ marginTop: 8 }}>+ 이벤트 추가</button>
        {funnels.length > 0 && (
          <div className="telemetry-funnels">
            <div className="te-section-label">FUNNELS</div>
            {funnels.map((f, fi) => (
              <div className="te-funnel" key={fi}>
                <Editable tag="div" className="te-funnel-name" value={f.name} onChange={(v) => {
                  const next = [...funnels]; next[fi] = { ...next[fi], name: v }; patch({ funnels: next });
                }} placeholder="펀넬명" />
                <div className="te-funnel-steps">
                  {(f.steps || []).map((s, si) => (
                    <span key={si} className="te-funnel-step">
                      {s}{si < (f.steps || []).length - 1 ? ' → ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 17. Risk Register (위험 × 영향 × 빈도) ------ */
function RiskRegisterSlide({ data, patch, page, totalPages }) {
  const risks = data.risks || [];
  const updateRisk = (i, key, v) => {
    const next = [...risks];
    next[i] = { ...next[i], [key]: v };
    patch({ risks: next });
  };
  const addRisk = () => patch({ risks: [...risks, { id: `R-${risks.length + 1}`, title: '새 위험', impact: 3, likelihood: 3, mitigation: '', owner: '', status: 'open' }] });
  const removeRisk = (i) => patch({ risks: risks.filter((_, j) => j !== i) });
  const score = (r) => (r.impact || 0) * (r.likelihood || 0);
  const sorted = [...risks].sort((a, b) => score(b) - score(a));
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="risk-wrap" style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>
        <div className="risk-heatmap">
          <div className="rh-label">HEAT MAP</div>
          <div className="rh-grid">
            {[5, 4, 3, 2, 1].map(impact => (
              <React.Fragment key={impact}>
                <div className="rh-axis-y">{impact}</div>
                {[1, 2, 3, 4, 5].map(likelihood => {
                  const inCell = risks.filter(r => r.impact === impact && r.likelihood === likelihood);
                  const score = impact * likelihood;
                  const cls = score >= 16 ? 'critical' : score >= 9 ? 'high' : score >= 4 ? 'medium' : 'low';
                  return (
                    <div key={`${impact}-${likelihood}`} className={'rh-cell ' + cls} title={`I${impact} × L${likelihood} = ${score}`}>
                      {inCell.length > 0 && <span className="rh-count">{inCell.length}</span>}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
            <div className="rh-axis-y"></div>
            {[1, 2, 3, 4, 5].map(l => <div key={l} className="rh-axis-x">{l}</div>)}
          </div>
          <div className="rh-legend">
            <span>Impact ↑</span><span>Likelihood →</span>
          </div>
        </div>
        <div className="risk-list">
          <table className="risk-table">
            <thead><tr><th style={{ width: '10%' }}>ID</th><th>위험</th><th style={{ width: '8%' }}>영향</th><th style={{ width: '8%' }}>빈도</th><th style={{ width: '8%' }}>점수</th><th>완화책</th><th style={{ width: '10%' }}>담당</th><th style={{ width: '10%' }}>상태</th><th style={{ width: '4%' }}></th></tr></thead>
            <tbody>
              {sorted.map((r, i) => {
                const idx = risks.indexOf(r);
                const s = score(r);
                const sevCls = s >= 16 ? 'critical' : s >= 9 ? 'high' : s >= 4 ? 'medium' : 'low';
                return (
                  <tr key={i} className={'risk-row sev-' + sevCls}>
                    <td className="tag"><Editable tag="div" value={r.id} onChange={(v) => updateRisk(idx, 'id', v)} /></td>
                    <td><Editable tag="div" value={r.title} onChange={(v) => updateRisk(idx, 'title', v)} markdown multiline /></td>
                    <td><select value={r.impact || 3} onChange={(e) => updateRisk(idx, 'impact', parseInt(e.target.value, 10))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select></td>
                    <td><select value={r.likelihood || 3} onChange={(e) => updateRisk(idx, 'likelihood', parseInt(e.target.value, 10))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select></td>
                    <td className={'risk-score ' + sevCls}>{s}</td>
                    <td><Editable tag="div" value={r.mitigation} onChange={(v) => updateRisk(idx, 'mitigation', v)} markdown multiline placeholder="완화 방안" /></td>
                    <td><Editable tag="div" value={r.owner} onChange={(v) => updateRisk(idx, 'owner', v)} placeholder="담당자" /></td>
                    <td>
                      <select value={r.status || 'open'} onChange={(e) => updateRisk(idx, 'status', e.target.value)}>
                        <option value="open">open</option>
                        <option value="mitigated">mitigated</option>
                        <option value="accepted">accepted</option>
                        <option value="closed">closed</option>
                      </select>
                    </td>
                    <td><button className="sc-del" onClick={() => removeRisk(idx)}>✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button className="sc-add" onClick={addRisk} style={{ marginTop: 8 }}>+ 위험 추가</button>
        </div>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ 18. Roadmap (마일스톤 간트) ------ */
function RoadmapSlide({ data, patch, page, totalPages }) {
  const phases = data.phases || [];
  const updatePhase = (i, key, v) => {
    const next = [...phases];
    next[i] = { ...next[i], [key]: v };
    patch({ phases: next });
  };
  const updateDeliverable = (pi, di, v) => {
    const next = [...phases];
    const d = [...(next[pi].deliverables || [])];
    d[di] = v;
    next[pi] = { ...next[pi], deliverables: d };
    patch({ phases: next });
  };
  const addPhase = () => patch({ phases: [...phases, { name: `Phase ${phases.length + 1}`, start: '2026.01', end: '2026.03', deliverables: [], dependsOn: [] }] });
  const addDeliverable = (pi) => {
    const next = [...phases];
    next[pi] = { ...next[pi], deliverables: [...(next[pi].deliverables || []), '산출물'] };
    patch({ phases: next });
  };
  const removePhase = (i) => patch({ phases: phases.filter((_, j) => j !== i) });
  // 간트 — 모든 phase 의 start/end 를 YYYY.MM 으로 가정. 가장 빠른 start 와 가장 늦은 end 로 정규화.
  const toMonth = (s) => {
    if (!s) return 0;
    const m = /(\d{4})\D+(\d{1,2})/.exec(String(s));
    if (m) return parseInt(m[1], 10) * 12 + parseInt(m[2], 10);
    return 0;
  };
  const allMonths = phases.flatMap(p => [toMonth(p.start), toMonth(p.end)]).filter(n => n > 0);
  const minM = allMonths.length ? Math.min(...allMonths) : 0;
  const maxM = allMonths.length ? Math.max(...allMonths) : 0;
  const range = maxM - minM || 1;
  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />
      <div className="roadmap-wrap" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {phases.length > 0 && (
          <div className="roadmap-gantt">
            {phases.map((p, i) => {
              const start = toMonth(p.start), end = toMonth(p.end);
              const left = ((start - minM) / range) * 100;
              // start > end 또는 잘못된 month 입력 시 음수/0 가능 → 0..100 으로 clamp
              const width = Math.max(4, Math.min(100, ((end - start) / range) * 100));
              return (
                <div className="rm-row" key={i}>
                  <div className="rm-row-label">{p.name}</div>
                  <div className="rm-row-track">
                    <div className="rm-row-bar" style={{ left: `${left}%`, width: `${width}%` }}>
                      <span className="rm-bar-text">{p.start} – {p.end}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="roadmap-phases">
          {phases.map((p, i) => (
            <div className="rm-phase" key={i}>
              <div className="rm-phase-head">
                <Editable tag="span" className="rm-phase-name" value={p.name} onChange={(v) => updatePhase(i, 'name', v)} />
                <Editable tag="span" className="rm-phase-date" value={p.start} onChange={(v) => updatePhase(i, 'start', v)} placeholder="2026.01" />
                <span style={{ color: 'var(--text-3, #7d8590)' }}>→</span>
                <Editable tag="span" className="rm-phase-date" value={p.end} onChange={(v) => updatePhase(i, 'end', v)} placeholder="2026.03" />
                <button className="sc-del" onClick={() => removePhase(i)}>✕</button>
              </div>
              <ul className="rm-deliverables">
                {(p.deliverables || []).map((d, di) => (
                  <li key={di}><Editable tag="div" value={d} onChange={(v) => updateDeliverable(i, di, v)} markdown multiline placeholder="산출물 (예: MVP 빌드, 알파 데모)" /></li>
                ))}
              </ul>
              <button className="sc-add inline" onClick={() => addDeliverable(i)}>+ 산출물</button>
            </div>
          ))}
          <button className="sc-add" onClick={addPhase} style={{ marginTop: 8 }}>+ Phase 추가</button>
        </div>
      </div>
      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ------ Type registry ------ */
const SLIDE_RENDERERS = {
  'cover': CoverSlide,
  'history': HistorySlide,
  'toc': TocSlide,
  'section-divider': SectionDividerSlide,
  'image-embed': ImageEmbedSlide,
  'intent': IntentSlide,
  'terms': TermsSlide,
  'rules': RulesSlide,
  'data-table': DataTableSlide,
  'flow': FlowSlide,
  'ui-design': UiDesignSlide,
  'resources': ResourcesSlide,
  // Phase 1 신규 7종 (engineer-ready)
  'balance-table': BalanceTableSlide,
  'state-machine': StateMachineSlide,
  'api-contract': ApiContractSlide,
  'acceptance-criteria': AcceptanceCriteriaSlide,
  'telemetry': TelemetrySlide,
  'risk-register': RiskRegisterSlide,
  'roadmap': RoadmapSlide,
};

const SLIDE_LABELS = {
  'cover': '표지',
  'history': '문서 이력',
  'toc': '목차',
  'section-divider': '섹션 구분',
  'image-embed': '참고 이미지',
  'intent': '기획 의도',
  'terms': '용어 정의',
  'rules': '규칙',
  'data-table': '데이터 테이블',
  'flow': '플로우 차트',
  'ui-design': 'UI/UX',
  'resources': '필요 리소스',
  'diagram': '다이어그램',
  'sequence-diagram': '시퀀스 다이어그램',
  'class-diagram': '클래스 다이어그램',
  // Phase 1 신규 7종
  'balance-table': '수치 밸런싱',
  'state-machine': '상태 머신',
  'api-contract': 'API 계약',
  'acceptance-criteria': '수락 기준',
  'telemetry': '텔레메트리',
  'risk-register': '위험 등기부',
  'roadmap': '로드맵',
};

function SlideRenderer({ slide, patch, replace, page, totalPages, slides, slideIndex }) {
  const R = SLIDE_RENDERERS[slide.type] || (() => <div className="slide"><div>Unknown type: {slide.type}</div></div>);
  const isPlaceholder = !!(slide.data && slide.data._placeholder);
  // slides + slideIndex 는 section-divider 가 "IN THIS PART" 목록을 자동 추출하기 위해 필요.
  const rendered = <R data={slide.data || {}} patch={patch} replace={replace} page={page} totalPages={totalPages} slides={slides} slideIndex={slideIndex} />;
  if (!isPlaceholder) return rendered;
  // placeholder 상태 — 자식 렌더는 유지하되 부모 div에 is-placeholder 클래스를 주입해
  // ::after 오버레이가 표시되도록 한다. React.cloneElement 로 className 합치기.
  return React.cloneElement(rendered, {
    className: ((rendered.props && rendered.props.className) || '') + ' is-placeholder',
  });
}

Object.assign(window, {
  SlideRenderer, SLIDE_RENDERERS, SLIDE_LABELS,
  Editable, SlideFooter, TopTag,
  ImageEmbedSlide,
});


// ============================================================
// File: diagram.jsx
// ============================================================
/* === Diagram slide (2D node graph) + AI helpers for diagrams/flows === */

/* ====== usePanZoom — 다이어그램 캔버스의 마우스 pan/zoom ======
 *  - 빈 캔버스 영역 드래그 → translate
 *  - 휠 → 커서 기준 scale (0.2x ~ 8x)
 *  - 변환값은 patch({ _viewTransform: {scale,x,y} }) 로 persist (옵션)
 *  - 노드/인풋/버튼 위에서 드래그하면 pan 안 됨 (편집 보호)
 */
function usePanZoom(slideData, patch, opts) {
  opts = opts || {};
  const NODE_SELECTORS = opts.nodeSelectors || '.diagram-node, .seq-participant, .cls-box, .sm-state, button, select, input, textarea, [contenteditable=true]';
  const initial = slideData?._viewTransform || { scale: 1, x: 0, y: 0 };
  const [transform, setTransform] = React.useState(initial);
  const transformRef = React.useRef(transform);
  const wrapRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);

  // transformRef 는 매 transform 변경 시 동기화 — 이벤트 핸들러가 closure 없이 최신 값 조회
  React.useEffect(() => { transformRef.current = transform; }, [transform]);

  // 외부에서 _viewTransform 이 바뀌면 동기화 (다른 슬라이드 선택 등)
  React.useEffect(() => {
    const t = slideData?._viewTransform;
    if (t && (t.scale !== transformRef.current.scale || t.x !== transformRef.current.x || t.y !== transformRef.current.y)) {
      transformRef.current = t;
      setTransform(t);
    }
    // 의도적으로 transform 은 deps 에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideData?._viewTransform?.scale, slideData?._viewTransform?.x, slideData?._viewTransform?.y]);

  // 공통 — transform 변경 + ref 동기화 + persist. setState updater 사용 X (부작용 분리).
  const applyTransform = (next) => {
    transformRef.current = next;
    setTransform(next);
    if (patch) patch({ _viewTransform: next });
  };

  // 휠 줌 — passive 회피. transformRef 로 최신값 읽음.
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      const cur = transformRef.current;
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const newScale = Math.max(0.2, Math.min(8, cur.scale * factor));
      const k = newScale / cur.scale;
      const nx = cx - k * (cx - cur.x);
      const ny = cy - k * (cy - cur.y);
      applyTransform({ scale: newScale, x: nx, y: ny });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
    // applyTransform 은 closure 안에서 transformRef.current 만 읽으므로 안정. patch 변경에만 반응.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patch]);

  // 마우스 드래그 (pan) — 노드/버튼이 아닌 빈 영역만
  const startDrag = (e) => {
    if (e.target.closest(NODE_SELECTORS)) return;
    if (e.button !== 0) return;
    e.preventDefault();
    setDragging(true);
    const start = { ...transformRef.current };
    const sx = e.clientX, sy = e.clientY;
    const onMove = (ev) => {
      const next = { scale: start.scale, x: start.x + (ev.clientX - sx), y: start.y + (ev.clientY - sy) };
      transformRef.current = next;
      setTransform(next);
      // 드래그 중에는 patch 호출 안 함 — onUp 에서 한 번에 persist
    };
    const onUp = (ev) => {
      setDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      const finalT = { scale: start.scale, x: start.x + (ev.clientX - sx), y: start.y + (ev.clientY - sy) };
      transformRef.current = finalT;
      setTransform(finalT);
      if (patch) patch({ _viewTransform: finalT });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const reset = () => applyTransform({ scale: 1, x: 0, y: 0 });
  const zoomBy = (factor) => {
    const cur = transformRef.current;
    applyTransform({ ...cur, scale: Math.max(0.2, Math.min(8, cur.scale * factor)) });
  };

  return { wrapRef, transform, dragging, startDrag, reset, zoomBy };
}

function PanZoomControls({ transform, onZoom, onReset }) {
  return (
    <div className="pan-zoom-controls">
      <button onClick={() => onZoom(0.85)} title="축소 (휠 ↓)">−</button>
      <span className="zoom-label">{Math.round((transform?.scale || 1) * 100)}%</span>
      <button onClick={() => onZoom(1.15)} title="확대 (휠 ↑)">+</button>
      <span className="sep"></span>
      <button onClick={onReset} title="초기화 (1x, 0,0)">↻ 초기화</button>
    </div>
  );
}


/* Diagram data shape:
   {
     section, sectionName, title,
     nodes: [{ id, label, sub?, kind: 'start'|'process'|'decision'|'end'|'service'|'data',
               col: 0..3, row: 0..N }],
     edges: [{ from, to, label?, kind?: 'solid'|'dashed'|'thin' }]
   }
*/

/* Grid-based positioning: convert col/row to absolute px within slide viewport.
   Slide content area (after 56px padding + ~120px header/footer) is roughly 1136x520.
   We give 4 columns × N rows. */

function computeDiagramLayout(nodes, viewW, viewH, padX = 24, padY = 16) {
  if (!nodes || !nodes.length) return [];
  const cols = Math.max(2, Math.min(4, Math.max(...nodes.map(n => (n.col ?? 0))) + 1));
  const rows = Math.max(1, Math.max(...nodes.map(n => (n.row ?? 0))) + 1);
  const w = (viewW - padX * 2 - (cols - 1) * 36) / cols; // node width
  const h = 64;
  // Always fit within container: divide available height by (rows - 1) spans.
  const ySpace = rows > 1 ? (viewH - padY * 2 - h) / (rows - 1) : 0;
  return nodes.map(n => {
    const col = Math.min(cols - 1, Math.max(0, n.col ?? 0));
    const row = Math.min(rows - 1, Math.max(0, n.row ?? 0));
    const x = padX + col * (w + 36);
    const y = padY + row * ySpace;
    return { ...n, _x: x, _y: y, _w: w, _h: h };
  });
}

function DiagramSlide({ data, patch, page, totalPages }) {
  const wrapRef = React.useRef(null);
  const [size, setSize] = React.useState({ w: 1136, h: 520 });
  const [aiOpen, setAiOpen] = React.useState(false);
  // pan/zoom — wrap 자체에 wheel/mousedown 리스너 부착
  const pz = usePanZoom(data, patch);

  // pan/zoom hook 이 wrap 을 ref 로 잡도록 동기화 + ResizeObserver 도 동시 부착
  const setWrap = React.useCallback((el) => {
    wrapRef.current = el;
    pz.wrapRef.current = el;
  }, [pz.wrapRef]);

  React.useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => {
      if (wrapRef.current) setSize({ w: wrapRef.current.clientWidth, h: wrapRef.current.clientHeight });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const laidOut = React.useMemo(() => computeDiagramLayout(data.nodes || [], size.w, size.h), [data.nodes, size]);

  const nodesById = {};
  laidOut.forEach(n => { nodesById[n.id] = n; });

  /* Edge path: simple step-routing.
     If same column: vertical line.
     Otherwise: out from bottom of A → horizontal → into top of B (or side). */
  const renderEdge = (e, i) => {
    const a = nodesById[e.from];
    const b = nodesById[e.to];
    if (!a || !b) return null;
    const ax = a._x + a._w / 2, ay = a._y + a._h;
    const bx = b._x + b._w / 2, by = b._y;
    let d;
    let labelX, labelY;
    if (Math.abs(ax - bx) < 4) {
      d = `M ${ax} ${ay} L ${bx} ${by - 6}`;
      labelX = ax + 8; labelY = (ay + by) / 2;
    } else {
      const midY = (ay + by) / 2;
      d = `M ${ax} ${ay} L ${ax} ${midY} L ${bx} ${midY} L ${bx} ${by - 6}`;
      labelX = (ax + bx) / 2; labelY = midY - 6;
    }
    const cls = 'diagram-edge ' + (e.kind === 'dashed' ? 'dashed' : e.kind === 'thin' ? 'thin' : '');
    return (
      <g key={i}>
        <path d={d} className={cls} markerEnd="url(#arrow)" />
        {e.label && <text x={labelX} y={labelY} className="diagram-edge-label" textAnchor="middle">{e.label}</text>}
      </g>
    );
  };

  const updateNode = (idx, field, value) => {
    const nodes = [...(data.nodes || [])];
    nodes[idx] = { ...nodes[idx], [field]: value };
    patch({ nodes });
  };
  const deleteNode = (id) => {
    const nodes = (data.nodes || []).filter(n => n.id !== id);
    const edges = (data.edges || []).filter(e => e.from !== id && e.to !== id);
    patch({ nodes, edges });
  };
  const cycleKind = (idx) => {
    const order = ['process', 'start', 'decision', 'service', 'data', 'end'];
    const cur = data.nodes[idx].kind || 'process';
    const next = order[(order.indexOf(cur) + 1) % order.length];
    updateNode(idx, 'kind', next);
  };
  const addNode = () => {
    const maxRow = Math.max(0, ...(data.nodes || []).map(n => n.row ?? 0)) + 1;
    const newNode = { id: 'n' + uid().slice(0, 4), label: '새 노드', kind: 'process', col: 1, row: maxRow };
    patch({ nodes: [...(data.nodes || []), newNode] });
  };

  const runAi = async (prompt) => {
    const result = await aiGenerateDiagram(prompt);
    if (result) patch(result);
    setAiOpen(false);
  };

  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />

      <div className="flow-edit-bar">
        <button className="mini-btn" onClick={addNode}>+ 노드</button>
        <button className="mini-btn ai" onClick={() => setAiOpen(true)}>✦ AI로 그리기</button>
      </div>

      <div
        className={'diagram-wrap pz-host' + (pz.dragging ? ' panning' : '')}
        ref={setWrap}
        onMouseDown={pz.startDrag}
      >
        <div className="pz-stage" style={{ transform: `translate(${pz.transform.x}px, ${pz.transform.y}px) scale(${pz.transform.scale})`, transformOrigin: '0 0' }}>
          <svg className="diagram-svg" viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none" style={{ width: size.w, height: size.h }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#303a45" />
              </marker>
            </defs>
            {(data.edges || []).map(renderEdge)}
          </svg>
          {laidOut.map((n, idx) => (
            <div
              key={n.id}
              className={'diagram-node ' + (n.kind || 'process')}
              style={{ left: n._x, top: n._y, width: n._w, height: n._h }}
            >
              <div style={{ width: '100%' }}>
                <Editable
                  value={n.label}
                  onChange={(v) => updateNode(idx, 'label', v)}
                  multiline
                  tag="div"
                />
                {n.sub && (
                  <Editable
                    tag="div"
                    className="sub"
                    value={n.sub}
                    onChange={(v) => updateNode(idx, 'sub', v)}
                  />
                )}
              </div>
              <div className="diagram-node-controls">
                <button title="유형 변경" onClick={() => cycleKind(idx)}>⇄</button>
                <button title="왼쪽" disabled={(n.col ?? 0) <= 0} onClick={() => updateNode(idx, 'col', Math.max(0, (n.col ?? 0) - 1))}>◀</button>
                <button title="오른쪽" disabled={(n.col ?? 0) >= 3} onClick={() => updateNode(idx, 'col', Math.min(3, (n.col ?? 0) + 1))}>▶</button>
                <button title="위로" disabled={(n.row ?? 0) <= 0} onClick={() => updateNode(idx, 'row', Math.max(0, (n.row ?? 0) - 1))}>▲</button>
                <button title="아래로" onClick={() => updateNode(idx, 'row', (n.row ?? 0) + 1)}>▼</button>
                <button title="삭제" className="del" onClick={() => deleteNode(n.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
        <PanZoomControls transform={pz.transform} onZoom={pz.zoomBy} onReset={pz.reset} />
      </div>

      {aiOpen && <AiDrawModal onClose={() => setAiOpen(false)} onRun={runAi} placeholder="예: 매칭 → 로딩 → 카운트다운 → 데스매치 → 결과 화면 의 흐름. 데스매치 단계는 사망 분기와 시간 종료 분기를 가짐." />}

      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ====== Inline AI prompt modal (floats on slide) ====== */
function AiDrawModal({ onClose, onRun, placeholder, running }) {
  const [text, setText] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const run = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try { await onRun(text); } finally { setBusy(false); }
  };
  return (
    <div className="ai-draw-modal" onClick={e => e.stopPropagation()}>
      <div className="h">
        <span>✦ AI로 다이어그램 그리기</span>
        <button style={{ background: 'transparent', color: 'var(--text-3)', border: 0, cursor: 'pointer' }} onClick={onClose}>✕</button>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={placeholder}
        autoFocus
        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) run(); }}
      />
      <div className="row">
        <button className="btn ghost" onClick={onClose} disabled={busy}>취소</button>
        <button className="btn primary" onClick={run} disabled={busy || !text.trim()}>
          {busy ? '생성 중…' : '그리기  ⌘↵'}
        </button>
      </div>
    </div>
  );
}

/* ====== Enhanced Flow slide (with edit controls and AI) ======
 *
 * direction: 'vertical' | 'horizontal' | 'grid'
 *   - vertical  → 위에서 아래 (전통적)
 *   - horizontal → 좌에서 우 (가로 흐름, 가독성 ↑)
 *   - grid      → 자동 wrap (노드 7개 이상에서 가장 가독성 좋음)
 * direction 이 비어있으면 노드 수에 따라 자동 선택.
 */
function EnhancedFlowSlide({ data, patch, page, totalPages }) {
  const [aiOpen, setAiOpen] = React.useState(false);
  const wrapRef = React.useRef(null);
  const chartRef = React.useRef(null);

  const nodeCount = (data.nodes || []).length;
  // direction 미지정 시 노드 수 기반 자동 선택
  const autoDir = nodeCount <= 5 ? 'vertical' : nodeCount <= 8 ? 'horizontal' : 'grid';
  const direction = data.direction || autoDir;
  // 줄 수 — vertical/horizontal 에서만 의미. 기본 1. 노드 9개 이상이고 사용자가 명시하지 않았으면 자동 2.
  const lines = (direction === 'grid')
    ? 1
    : Math.max(1, Math.min(2, parseInt(data.lines, 10) || (nodeCount >= 10 ? 2 : 1)));
  // 노드를 줄별로 분할 — horizontal 은 row, vertical 은 col 단위로 chunk
  const nodeLines = React.useMemo(() => {
    const arr = (data.nodes || []).map((node, idx) => ({ node, idx }));
    if (direction === 'grid' || lines <= 1) return [arr];
    const perLine = Math.ceil(arr.length / lines);
    const chunks = [];
    for (let i = 0; i < lines; i++) {
      chunks.push(arr.slice(i * perLine, (i + 1) * perLine));
    }
    return chunks.filter(c => c.length > 0);
  }, [data.nodes, direction, lines]);

  /* 폴백 스케일 — 측정 실패 시에도 노드 수·방향·줄 수 기반으로 보수적 스케일을 적용해 footer 침범 방지 */
  const fallbackScale = React.useMemo(() => {
    const nodes = data.nodes || [];
    // 줄 수가 2 이상이면 한 줄당 effective node 수가 줄어들어 더 큰 스케일 가능
    const perLine = lines > 1 ? Math.ceil(nodes.length / lines) : nodes.length;
    const n = perLine;
    const avgLen = nodes.length ? nodes.reduce((s, x) => s + ((x.label || '').length), 0) / nodes.length : 0;
    const hasLongLabels = avgLen > 14;
    if (direction === 'horizontal') {
      if (n <= 4) return 1;
      if (n <= 6) return 0.9;
      if (n <= 8) return 0.78;
      if (n <= 10) return 0.68;
      return hasLongLabels ? 0.55 : 0.6;
    }
    if (direction === 'grid') {
      const total = nodes.length;
      if (total <= 6) return 1;
      if (total <= 9) return 0.9;
      if (total <= 12) return 0.78;
      return hasLongLabels ? 0.62 : 0.7;
    }
    // vertical — perLine 기준으로 fallback 계산 (lines=2 일 때 한 컬럼당 노드 수)
    if (n <= 5) return hasLongLabels ? 0.9 : 1;
    if (n <= 6) return hasLongLabels ? 0.75 : 0.85;
    if (n <= 7) return hasLongLabels ? 0.66 : 0.76;
    if (n <= 8) return hasLongLabels ? 0.58 : 0.66;
    if (n <= 9) return hasLongLabels ? 0.5 : 0.58;
    if (n <= 10) return hasLongLabels ? 0.44 : 0.5;
    if (n <= 12) return hasLongLabels ? 0.38 : 0.44;
    return hasLongLabels ? 0.32 : 0.38;
  }, [data.nodes, direction, lines]);
  const [chartScale, setChartScale] = React.useState(fallbackScale);
  React.useEffect(() => { setChartScale(fallbackScale); }, [fallbackScale]);

  const updateNode = (i, key, val) => {
    const nodes = [...(data.nodes || [])];
    nodes[i] = { ...nodes[i], [key]: val };
    patch({ nodes });
  };
  const insertNodeAt = (i) => {
    const nodes = [...(data.nodes || [])];
    nodes.splice(i, 0, { kind: 'process', label: '새 단계' });
    patch({ nodes });
  };
  const removeNode = (i) => {
    const nodes = (data.nodes || []).filter((_, idx) => idx !== i);
    patch({ nodes });
  };
  const moveNode = (i, delta) => {
    const nodes = [...(data.nodes || [])];
    const j = i + delta;
    if (j < 0 || j >= nodes.length) return;
    [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
    patch({ nodes });
  };

  const runAi = async (prompt) => {
    const result = await aiGenerateFlow(prompt);
    if (result) patch(result);
    setAiOpen(false);
  };

  /* Auto-fit chart inside wrap.
   * - 자식 노드들의 offsetHeight 합산으로 자연 높이 측정 (transform 영향 없음, 항상 정확)
   * - wrap만 observe → ResizeObserver 자기-트리거 루프 방지
   * - useLayoutEffect + rAF → 레이아웃 안정 후 측정 + 페인트 전 적용 (깜박임 방지)
   * - transform-origin: center center → 좌우 양쪽 패딩이 균형있게 확보
   */
  React.useLayoutEffect(() => {
    if (!wrapRef.current || !chartRef.current) return;
    let raf = 0;
    const recompute = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!wrapRef.current || !chartRef.current) return;
        const wh = wrapRef.current.clientHeight;
        const ww = wrapRef.current.clientWidth;
        if (wh <= 0 || ww <= 0) return;
        // 자연 높이 = 자식 노드/화살표의 offsetHeight 합 + flex gap
        let naturalH = 0;
        let naturalW = 0;
        const kids = chartRef.current.children;
        for (const k of kids) {
          naturalH += k.offsetHeight;
          naturalW = Math.max(naturalW, k.offsetWidth);
        }
        if (naturalH <= 0 || naturalW <= 0) return;
        // flex gap 보정
        const cs = window.getComputedStyle(chartRef.current);
        const gap = parseFloat(cs.rowGap) || parseFloat(cs.gap) || 0;
        if (gap > 0 && kids.length > 1) {
          naturalH += (kids.length - 1) * gap;
        }
        // safety margin 16px
        const sH = (wh - 16) / naturalH;
        const sW = (ww - 16) / naturalW;
        const measured = Math.min(sH, sW, 1);
        // 측정값과 폴백 중 더 작은(=안전한) 값 사용. 측정이 부정확하게 1.0을 주더라도 폴백이 살림.
        setChartScale(Math.max(0.28, Math.min(measured, fallbackScale)));
      });
    };
    // 첫 측정 - layout 안정화를 위해 2번 시도
    recompute();
    const t1 = setTimeout(recompute, 50);
    const t2 = setTimeout(recompute, 200);
    const ro = new ResizeObserver(recompute);
    ro.observe(wrapRef.current);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [(data.nodes || []).length, (data.nodes || []).map(n => (n.label || '') + ':' + (n.kind || '')).join('|'), fallbackScale]);

  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />

      <div className="flow-edit-bar">
        <button className="mini-btn" onClick={() => insertNodeAt((data.nodes || []).length)}>+ 단계</button>
        <button className="mini-btn ai" onClick={() => setAiOpen(true)}>✦ AI로 그리기</button>
        {/* 레이아웃 방향 토글 */}
        <div className="flow-dir-toggle" title="배치 방향">
          {[
            { v: 'vertical',   label: '↓ 세로', t: '세로' },
            { v: 'horizontal', label: '→ 가로', t: '가로' },
            { v: 'grid',       label: '▦ 그리드', t: '자동 wrap 그리드' },
          ].map(opt => (
            <button
              key={opt.v}
              className={'mini-btn dir ' + (direction === opt.v ? 'on' : '')}
              onClick={() => patch({ direction: opt.v })}
              title={opt.t}
            >{opt.label}</button>
          ))}
        </div>
        {/* 줄 수 토글 — vertical/horizontal 일 때만 */}
        {direction !== 'grid' && (
          <div className="flow-lines-toggle" title="줄 수">
            {[1, 2].map(n => (
              <button
                key={n}
                className={'mini-btn dir ' + (lines === n ? 'on' : '')}
                onClick={() => patch({ lines: n })}
                title={direction === 'horizontal' ? `가로 ${n}줄` : `세로 ${n}열`}
              >{n}{direction === 'horizontal' ? '줄' : '열'}</button>
            ))}
          </div>
        )}
      </div>

      <div className="flow-wrap" ref={wrapRef} style={{ overflow: 'hidden' }}>
        <div
          className={`flow-chart flow-chart-edit flow-dir-${direction} flow-lines-${lines}`}
          ref={chartRef}
          style={{ transform: `scale(${chartScale})`, transformOrigin: 'center center' }}
        >
          {nodeLines.map((line, li) => (
            <div key={li} className={`flow-line flow-line-${direction}`}>
              {line.map((entry, j, arr) => {
                const { node: n, idx: i } = entry;
                const isLastInLine = j === arr.length - 1;
                const showArrow = direction !== 'grid' && !isLastInLine;
                return (
                  <React.Fragment key={i}>
                    <div className="flow-node-wrap" data-idx={String(i + 1).padStart(2, '0')}>
                      <div className={'flow-node ' + (n.kind || 'process')}>
                        <Editable value={n.label} onChange={(v) => updateNode(i, 'label', v)} multiline />
                      </div>
                      <div className="flow-node-controls">
                        <button title="이전" disabled={i === 0} onClick={() => moveNode(i, -1)}>{direction === 'horizontal' ? '←' : '↑'}</button>
                        <button title="다음" disabled={i === (data.nodes || []).length - 1} onClick={() => moveNode(i, +1)}>{direction === 'horizontal' ? '→' : '↓'}</button>
                        <select value={n.kind || 'process'} onChange={e => updateNode(i, 'kind', e.target.value)}>
                          <option value="start">start</option>
                          <option value="process">process</option>
                          <option value="decision">decision</option>
                          <option value="end">end</option>
                        </select>
                        <button className="del" onClick={() => removeNode(i)} title="삭제">✕</button>
                      </div>
                    </div>
                    {showArrow && (
                      <div className={'flow-arrow-wrap flow-arrow-' + direction}>
                        <div className="flow-arrow"></div>
                        <div className="flow-arrow-add">
                          <button onClick={() => insertNodeAt(i + 1)} title="중간에 단계 추가">+</button>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {aiOpen && <AiDrawModal
        onClose={() => setAiOpen(false)}
        onRun={runAi}
        placeholder="예: 플레이어 사망 처리 FLOW. HP가 0 이하가 되면 사망 판정, 입력 차단, 카메라 전환, 매치 종료 시 결과 패널 출력."
      />}

      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ===== AI helpers for diagrams and flows ===== */
async function aiGenerateFlow(prompt) {
  const persona = window.SENIOR_PERSONA || '';
  const ai = `${persona}

# 임무
30년차 시니어 게임 메이커로서, 아래 설명에 맞는 게임 시스템 플로우 차트를 노드 배열로 작성하라.

설명: "${prompt}"

# 출력 형식 (JSON만, 코드블록 금지)
{
  "nodes": [
    { "kind": "start|process|decision|end", "label": "노드 라벨" }
  ]
}

# 시니어 표준 작성 기준
- 노드 6~10개. 첫 노드 kind="start", 마지막 kind="end".
- 정상 흐름만 늘어놓지 말고, decision 노드를 1~2개 포함해 분기(실패/예외/취소)를 표현.
- decision 라벨은 조건을 직접 명시 ("HP ≤ 0 ?", "타이머 = 300s ?", "재시도 가능 ?" 처럼).
- process 라벨은 "동사+목적어" 형태로 구체적 ("입력 차단·충돌 비활성화", "사망 카메라 전환" 등).
- 라벨은 18자 이내, 약어 활용 가능.
- 시스템 간 책임 경계가 있으면 라벨에 표기 (예: "클라:애니재생", "서버:HP갱신").`;

  try {
    const raw = await window.gemini.complete(ai);
    const parsed = window.parseAiJson(raw);
    if (parsed.nodes && Array.isArray(parsed.nodes)) return parsed;
  } catch (e) {
    if (window.gddToast) try { window.gddToast('AI 플로우 생성 실패: ' + (e?.message || e), 'err'); } catch {}
  }
  return null;
}

async function aiGenerateDiagram(prompt) {
  const persona = window.SENIOR_PERSONA || '';
  const ai = `${persona}

# 임무
30년차 시니어 게임 메이커로서, 아래 설명에 맞는 2D 시스템 다이어그램(노드와 화살표)을 작성하라. 클라/서버/외부서비스/데이터 저장소의 역할이 분명히 드러나야 한다.

설명: "${prompt}"

# 출력 형식 (JSON만, 코드블록 금지)
{
  "nodes": [
    { "id": "n1", "label": "노드 라벨", "sub": "영문 약어/Tech 식별자", "kind": "start|process|decision|end|service|data", "col": 0..3, "row": 0..N }
  ],
  "edges": [
    { "from": "n1", "to": "n2", "label": "호출/이벤트 이름", "kind": "solid|dashed|thin" }
  ]
}

# 시니어 표준 작성 기준
- **노드 5~9개**. id는 n1, n2... 형식.
- col은 0~3 사이 정수(왼→오), row는 0부터 시작(위→아래). 같은 row에 병렬 컴포넌트 배치 가능.
- **kind 의미**: start(진입점), end(종착점), decision(분기), service(서비스/마이크로서비스), data(DB/캐시/저장소), process(일반 컴포넌트).
- **sub 필드**: 시스템의 정체를 영문 약어로 표기. 예: 클라이언트→"CLIENT", 게임서버→"GAME_SERVER", DB→"POSTGRES"/"REDIS", 외부 서비스→"AUTH_SVC"/"PAYMENT" 등. 시니어가 보면 한눈에 스택을 알 수 있어야 한다.
- **edges 라벨**: 실제 호출명·이벤트명에 가깝게. "session.create", "match.end", "payment.callback", "auth.refresh" 같은 패턴. 단순 화살표만 그리지 말 것.
- 비동기/이벤트성 통신은 kind="dashed", 보조적·낮은 빈도 호출은 "thin"으로 구분.
- 라벨은 한국어, sub와 edges 라벨은 영문 식별자 권장.`;

  try {
    const raw = await window.gemini.complete(ai);
    const parsed = window.parseAiJson(raw);
    if (parsed.nodes && parsed.edges) return parsed;
  } catch (e) {
    if (window.gddToast) try { window.gddToast('AI 다이어그램 생성 실패: ' + (e?.message || e), 'err'); } catch {}
  }
  return null;
}

function stripJson(raw) {
  raw = (raw || '').trim();
  if (raw.startsWith('```')) raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const f = raw.indexOf('{'), l = raw.lastIndexOf('}');
  if (f >= 0 && l >= 0) raw = raw.slice(f, l + 1);
  return raw;
}

/* ====== 12. Sequence diagram (시퀀스 다이어그램) ====== */
function SequenceDiagramSlide({ data, patch, page, totalPages }) {
  const wrapRef = React.useRef(null);
  const [size, setSize] = React.useState({ w: 760, h: 480 });
  const [aiOpen, setAiOpen] = React.useState(false);
  const pz = usePanZoom(data, patch);
  const setWrap = React.useCallback((el) => { wrapRef.current = el; pz.wrapRef.current = el; }, [pz.wrapRef]);

  React.useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => {
      if (wrapRef.current) setSize({ w: wrapRef.current.clientWidth, h: wrapRef.current.clientHeight });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const participants = data.participants || [];
  const messages = data.messages || [];

  const TOP_PAD = 14;
  const PART_H = 44;
  const MSG_GAP = 36;
  const PART_W = 124;
  const sideMargin = 28;
  const lifelineCount = Math.max(1, participants.length);
  const innerW = Math.max(220, size.w - sideMargin * 2);
  const colWidth = lifelineCount > 1 ? innerW / (lifelineCount - 1) : 0;
  const partXs = participants.map((_, i) => {
    if (lifelineCount === 1) return size.w / 2;
    return sideMargin + i * colWidth;
  });
  const partById = {};
  participants.forEach((p, i) => { partById[p.id] = { x: partXs[i], idx: i, ...p }; });
  const contentH = Math.max(size.h, TOP_PAD + PART_H + 16 + MSG_GAP * (messages.length + 1));

  const updatePart = (i, k, v) => {
    const ps = [...participants];
    ps[i] = { ...ps[i], [k]: v };
    patch({ participants: ps });
  };
  const updateMsg = (i, k, v) => {
    const ms = [...messages];
    ms[i] = { ...ms[i], [k]: v };
    patch({ messages: ms });
  };
  const removePart = (id) => {
    if (participants.length <= 1) return;
    patch({
      participants: participants.filter(p => p.id !== id),
      messages: messages.filter(m => m.from !== id && m.to !== id),
    });
  };
  const removeMsg = (i) => {
    patch({ messages: messages.filter((_, idx) => idx !== i) });
  };
  const addPart = () => {
    const id = 'p' + uid().slice(0, 4);
    patch({ participants: [...participants, { id, name: '참여자', kind: 'system' }] });
  };
  const addMsg = () => {
    if (!participants.length) return;
    const from = participants[0].id;
    const to = (participants[1] || participants[0]).id;
    patch({ messages: [...messages, { from, to, label: '메시지', kind: 'sync' }] });
  };
  const cycleMsgKind = (i) => {
    const order = ['sync', 'async', 'return'];
    const cur = messages[i]?.kind || 'sync';
    updateMsg(i, 'kind', order[(order.indexOf(cur) + 1) % order.length]);
  };
  const cyclePartKind = (i) => {
    const order = ['actor', 'system', 'service', 'data'];
    const cur = participants[i]?.kind || 'system';
    updatePart(i, 'kind', order[(order.indexOf(cur) + 1) % order.length]);
  };
  const movePart = (i, delta) => {
    const j = i + delta;
    if (j < 0 || j >= participants.length) return;
    const ps = [...participants];
    [ps[i], ps[j]] = [ps[j], ps[i]];
    patch({ participants: ps });
  };
  const moveMsg = (i, delta) => {
    const j = i + delta;
    if (j < 0 || j >= messages.length) return;
    const ms = [...messages];
    [ms[i], ms[j]] = [ms[j], ms[i]];
    patch({ messages: ms });
  };

  const runAi = async (prompt) => {
    const result = await aiGenerateSequence(prompt);
    if (result) patch(result);
    setAiOpen(false);
  };

  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />

      <div className="flow-edit-bar">
        <button className="mini-btn" onClick={addPart}>+ 참여자</button>
        <button className="mini-btn" onClick={addMsg} disabled={!participants.length}>+ 메시지</button>
        <button className="mini-btn ai" onClick={() => setAiOpen(true)}>✦ AI로 그리기</button>
      </div>

      <div className="seq-layout">
        <div className={'seq-canvas pz-host' + (pz.dragging ? ' panning' : '')} ref={setWrap} onMouseDown={pz.startDrag}>
        <div className="pz-stage" style={{ transform: `translate(${pz.transform.x}px, ${pz.transform.y}px) scale(${pz.transform.scale})`, transformOrigin: '0 0', width: '100%', height: '100%' }}>
          <svg className="seq-svg" viewBox={`0 0 ${size.w} ${contentH}`}
               width={size.w} height={contentH} preserveAspectRatio="xMidYMin meet">
            <defs>
              <marker id="seq-arrow-fill" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#303a45" />
              </marker>
              <marker id="seq-arrow-open" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9" fill="none" stroke="#303a45" strokeWidth="1.5" strokeLinejoin="round" />
              </marker>
            </defs>
            {participants.map((p, i) => (
              <line key={'ll' + p.id}
                    x1={partXs[i]} y1={TOP_PAD + PART_H}
                    x2={partXs[i]} y2={contentH - 12}
                    stroke="#a3afbb" strokeDasharray="4 5" strokeWidth="1.2" />
            ))}
            {messages.map((m, i) => {
              const a = partById[m.from], b = partById[m.to];
              if (!a || !b) return null;
              const y = TOP_PAD + PART_H + 16 + MSG_GAP * i + MSG_GAP / 2;
              const dashed = m.kind === 'async' || m.kind === 'return';
              const markerEnd = m.kind === 'return' ? 'url(#seq-arrow-open)' : 'url(#seq-arrow-fill)';
              if (a.x === b.x) {
                const off = 32;
                const d = `M ${a.x + 6} ${y - 6} L ${a.x + off} ${y - 6} L ${a.x + off} ${y + 14} L ${a.x + 8} ${y + 14}`;
                return (
                  <g key={'m' + i}>
                    <path d={d} stroke="#303a45" strokeWidth="1.6" fill="none"
                          markerEnd={markerEnd} strokeDasharray={dashed ? '5 4' : undefined} />
                    <text x={a.x + off + 8} y={y + 4} fontSize="11"
                          fontFamily="JetBrains Mono, monospace" fill="#303a45" fontWeight="600">
                      {m.label || ''}
                    </text>
                  </g>
                );
              }
              const labelX = (a.x + b.x) / 2;
              return (
                <g key={'m' + i}>
                  <line x1={a.x} y1={y} x2={b.x} y2={y} stroke="#303a45" strokeWidth="1.6"
                        markerEnd={markerEnd} strokeDasharray={dashed ? '5 4' : undefined} />
                  <text x={labelX} y={y - 6} fontSize="11"
                        fontFamily="JetBrains Mono, monospace" fill="#303a45"
                        textAnchor="middle" fontWeight="600">
                    {m.label || ''}
                  </text>
                </g>
              );
            })}
          </svg>
          {participants.map((p, i) => (
            <div key={'pt' + p.id}
                 className={'seq-participant ' + (p.kind || 'system')}
                 style={{ left: partXs[i] - PART_W / 2, top: TOP_PAD, width: PART_W, height: PART_H }}>
              <Editable value={p.name} onChange={(v) => updatePart(i, 'name', v)} />
              <div className="seq-participant-controls">
                <button onClick={() => cyclePartKind(i)} title="유형">⇄</button>
                <button onClick={() => movePart(i, -1)} disabled={i === 0} title="왼쪽">◀</button>
                <button onClick={() => movePart(i, 1)} disabled={i === participants.length - 1} title="오른쪽">▶</button>
                <button onClick={() => removePart(p.id)} className="del" title="삭제">✕</button>
              </div>
            </div>
          ))}
        </div>
        <PanZoomControls transform={pz.transform} onZoom={pz.zoomBy} onReset={pz.reset} />
        </div>
        <div className="seq-editor">
          <div className="seq-editor-head">메시지 편집</div>
          <div className="seq-editor-list">
            {messages.map((m, i) => (
              <div key={'me' + i} className="seq-msg-row">
                <span className="seq-msg-idx">{i + 1}</span>
                <select value={m.from || ''} onChange={(e) => updateMsg(i, 'from', e.target.value)}>
                  {participants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <span style={{ color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>→</span>
                <select value={m.to || ''} onChange={(e) => updateMsg(i, 'to', e.target.value)}>
                  {participants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input type="text" value={m.label || ''} placeholder="메시지"
                       onChange={(e) => updateMsg(i, 'label', e.target.value)}
                       className="seq-msg-label" />
                <button onClick={() => cycleMsgKind(i)} title={m.kind || 'sync'}>
                  {m.kind === 'async' ? '⇢' : m.kind === 'return' ? '↩' : '→'}
                </button>
                <button onClick={() => moveMsg(i, -1)} disabled={i === 0} title="위로">↑</button>
                <button onClick={() => moveMsg(i, 1)} disabled={i === messages.length - 1} title="아래로">↓</button>
                <button onClick={() => removeMsg(i)} className="del" title="삭제">✕</button>
              </div>
            ))}
            {!messages.length && <div className="seq-empty">아직 메시지가 없습니다. "+ 메시지"로 추가하세요.</div>}
          </div>
        </div>
      </div>

      {aiOpen && <AiDrawModal onClose={() => setAiOpen(false)} onRun={runAi}
        placeholder="예: 로그인 시퀀스. 클라이언트 → 게이트웨이 → 인증서버 → DB. JWT 발급 후 응답 흐름." />}

      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

/* ====== 13. Class diagram (클래스 다이어그램) ====== */
function computeClassLayout(classes, viewW, viewH, padX = 18, padY = 10) {
  if (!classes || !classes.length) return [];
  const cols = Math.max(2, Math.min(4, Math.max(...classes.map(n => (n.col ?? 0))) + 1));
  const rows = Math.max(1, Math.max(...classes.map(n => (n.row ?? 0))) + 1);
  const w = (viewW - padX * 2 - (cols - 1) * 28) / cols;
  const h = Math.max(120, Math.min(180, (viewH - padY * 2 - (rows - 1) * 24) / rows));
  const ySpace = rows > 1 ? (viewH - padY * 2 - h) / (rows - 1) : 0;
  return classes.map(c => {
    const col = Math.min(cols - 1, Math.max(0, c.col ?? 0));
    const row = Math.min(rows - 1, Math.max(0, c.row ?? 0));
    return {
      ...c,
      _x: padX + col * (w + 28),
      _y: padY + row * ySpace,
      _w: w,
      _h: h,
    };
  });
}

function ClassDiagramSlide({ data, patch, page, totalPages }) {
  const wrapRef = React.useRef(null);
  const [size, setSize] = React.useState({ w: 760, h: 480 });
  const [aiOpen, setAiOpen] = React.useState(false);
  const pz = usePanZoom(data, patch);
  const setWrap = React.useCallback((el) => { wrapRef.current = el; pz.wrapRef.current = el; }, [pz.wrapRef]);

  React.useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => {
      if (wrapRef.current) setSize({ w: wrapRef.current.clientWidth, h: wrapRef.current.clientHeight });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const classes = data.classes || [];
  const relations = data.relations || [];
  const layout = React.useMemo(() => computeClassLayout(classes, size.w, size.h), [classes, size]);
  const byId = {};
  layout.forEach(c => { byId[c.id] = c; });

  const updateClass = (i, k, v) => {
    const cs = [...classes];
    cs[i] = { ...cs[i], [k]: v };
    patch({ classes: cs });
  };
  const updateAttr = (ci, ai, v) => {
    const cs = [...classes];
    const attrs = [...(cs[ci].attrs || [])];
    attrs[ai] = v;
    cs[ci] = { ...cs[ci], attrs };
    patch({ classes: cs });
  };
  const updateMethod = (ci, mi, v) => {
    const cs = [...classes];
    const methods = [...(cs[ci].methods || [])];
    methods[mi] = v;
    cs[ci] = { ...cs[ci], methods };
    patch({ classes: cs });
  };
  const addAttr = (ci) => {
    const cs = [...classes];
    cs[ci] = { ...cs[ci], attrs: [...(cs[ci].attrs || []), '+attr: Type'] };
    patch({ classes: cs });
  };
  const addMethod = (ci) => {
    const cs = [...classes];
    cs[ci] = { ...cs[ci], methods: [...(cs[ci].methods || []), '+method(): void'] };
    patch({ classes: cs });
  };
  const removeAttr = (ci, ai) => {
    const cs = [...classes];
    cs[ci] = { ...cs[ci], attrs: (cs[ci].attrs || []).filter((_, idx) => idx !== ai) };
    patch({ classes: cs });
  };
  const removeMethod = (ci, mi) => {
    const cs = [...classes];
    cs[ci] = { ...cs[ci], methods: (cs[ci].methods || []).filter((_, idx) => idx !== mi) };
    patch({ classes: cs });
  };
  const addClass = () => {
    const id = 'c' + uid().slice(0, 4);
    const maxRow = Math.max(-1, ...classes.map(c => c.row ?? 0)) + 1;
    patch({ classes: [...classes, { id, name: '새 클래스', stereotype: '', attrs: ['+attr: Type'], methods: ['+method(): void'], col: 0, row: maxRow }] });
  };
  const removeClass = (id) => {
    patch({
      classes: classes.filter(c => c.id !== id),
      relations: relations.filter(r => r.from !== id && r.to !== id),
    });
  };
  const addRelation = () => {
    if (classes.length < 2) return;
    patch({ relations: [...relations, { from: classes[0].id, to: classes[1].id, kind: 'assoc', label: '' }] });
  };
  const updateRelation = (i, k, v) => {
    const rs = [...relations];
    rs[i] = { ...rs[i], [k]: v };
    patch({ relations: rs });
  };
  const removeRelation = (i) => {
    patch({ relations: relations.filter((_, idx) => idx !== i) });
  };

  const runAi = async (prompt) => {
    const result = await aiGenerateClass(prompt);
    if (result) patch(result);
    setAiOpen(false);
  };

  const renderRelation = (r, i) => {
    const a = byId[r.from], b = byId[r.to];
    if (!a || !b) return null;
    const ax = a._x + a._w / 2, ay = a._y + a._h / 2;
    const bx = b._x + b._w / 2, by = b._y + b._h / 2;
    const dx = bx - ax, dy = by - ay;
    const ang = Math.atan2(dy, dx);
    const inset = 60;
    const x1 = ax + Math.cos(ang) * inset;
    const y1 = ay + Math.sin(ang) * inset;
    const x2 = bx - Math.cos(ang) * inset;
    const y2 = by - Math.sin(ang) * inset;
    const labelX = (x1 + x2) / 2, labelY = (y1 + y2) / 2;
    const markerStart = r.kind === 'compose' ? 'url(#cls-diamond-fill)'
                     : r.kind === 'aggregate' ? 'url(#cls-diamond-open)' : undefined;
    const markerEnd = r.kind === 'inherit' ? 'url(#cls-triangle)'
                    : r.kind === 'implement' ? 'url(#cls-triangle)'
                    : 'url(#cls-arrow)';
    const dashed = r.kind === 'depend' || r.kind === 'implement';
    return (
      <g key={'r' + i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#303a45" strokeWidth="1.6" fill="none"
              markerStart={markerStart} markerEnd={markerEnd}
              strokeDasharray={dashed ? '6 5' : undefined} />
        {r.label && (
          <text x={labelX} y={labelY - 6} fontSize="11" fontFamily="JetBrains Mono, monospace"
                fill="#303a45" textAnchor="middle" fontWeight="600"
                paintOrder="stroke" stroke="white" strokeWidth="4" strokeLinejoin="round">{r.label}</text>
        )}
      </g>
    );
  };

  return (
    <div className="slide">
      <TopTag section={data.section} sectionName={data.sectionName} />
      <Editable tag="h1" className="h-title" value={data.title} onChange={(v) => patch({ title: v })} />

      <div className="flow-edit-bar">
        <button className="mini-btn" onClick={addClass}>+ 클래스</button>
        <button className="mini-btn" onClick={addRelation} disabled={classes.length < 2}>+ 관계</button>
        <button className="mini-btn ai" onClick={() => setAiOpen(true)}>✦ AI로 그리기</button>
      </div>

      <div className="cls-layout">
        <div className={'cls-canvas pz-host' + (pz.dragging ? ' panning' : '')} ref={setWrap} onMouseDown={pz.startDrag}>
        <div className="pz-stage" style={{ transform: `translate(${pz.transform.x}px, ${pz.transform.y}px) scale(${pz.transform.scale})`, transformOrigin: '0 0', width: '100%', height: '100%' }}>
          <svg className="cls-svg" viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none">
            <defs>
              <marker id="cls-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9" fill="none" stroke="#303a45" strokeWidth="1.5" />
              </marker>
              <marker id="cls-triangle" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
                <path d="M 0 0 L 12 6 L 0 12 z" fill="white" stroke="#303a45" strokeWidth="1.4" />
              </marker>
              <marker id="cls-diamond-fill" viewBox="0 0 14 12" refX="0" refY="6" markerWidth="14" markerHeight="12" orient="auto">
                <path d="M 0 6 L 7 0 L 14 6 L 7 12 z" fill="#303a45" />
              </marker>
              <marker id="cls-diamond-open" viewBox="0 0 14 12" refX="0" refY="6" markerWidth="14" markerHeight="12" orient="auto">
                <path d="M 0 6 L 7 0 L 14 6 L 7 12 z" fill="white" stroke="#303a45" strokeWidth="1.4" />
              </marker>
            </defs>
            {relations.map(renderRelation)}
          </svg>
          {layout.map((c, ci) => (
            <div key={c.id} className="cls-box"
                 style={{ left: c._x, top: c._y, width: c._w, minHeight: c._h }}>
              <div className="cls-header">
                <Editable className="cls-stereotype" value={c.stereotype || ''}
                          placeholder="<<stereotype>>"
                          onChange={(v) => updateClass(ci, 'stereotype', v)} />
                <Editable className="cls-name" value={c.name}
                          onChange={(v) => updateClass(ci, 'name', v)} />
              </div>
              <div className="cls-section attrs">
                {(c.attrs || []).map((a, ai) => (
                  <div key={ai} className="cls-line">
                    <Editable value={a} onChange={(v) => updateAttr(ci, ai, v)} />
                    <button className="cls-line-del" onClick={() => removeAttr(ci, ai)} title="삭제">✕</button>
                  </div>
                ))}
                <button className="cls-add-btn" onClick={() => addAttr(ci)}>+ attr</button>
              </div>
              <div className="cls-section methods">
                {(c.methods || []).map((m, mi) => (
                  <div key={mi} className="cls-line">
                    <Editable value={m} onChange={(v) => updateMethod(ci, mi, v)} />
                    <button className="cls-line-del" onClick={() => removeMethod(ci, mi)} title="삭제">✕</button>
                  </div>
                ))}
                <button className="cls-add-btn" onClick={() => addMethod(ci)}>+ method</button>
              </div>
              <div className="cls-box-controls">
                <button title="왼쪽" disabled={(c.col ?? 0) <= 0} onClick={() => updateClass(ci, 'col', Math.max(0, (c.col ?? 0) - 1))}>◀</button>
                <button title="오른쪽" disabled={(c.col ?? 0) >= 3} onClick={() => updateClass(ci, 'col', Math.min(3, (c.col ?? 0) + 1))}>▶</button>
                <button title="위" disabled={(c.row ?? 0) <= 0} onClick={() => updateClass(ci, 'row', Math.max(0, (c.row ?? 0) - 1))}>▲</button>
                <button title="아래" onClick={() => updateClass(ci, 'row', (c.row ?? 0) + 1)}>▼</button>
                <button title="삭제" className="del" onClick={() => removeClass(c.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
        <PanZoomControls transform={pz.transform} onZoom={pz.zoomBy} onReset={pz.reset} />
        </div>
        <div className="cls-editor">
          <div className="cls-editor-head">관계 편집</div>
          <div className="cls-editor-list">
            {relations.map((r, i) => (
              <div key={'r' + i} className="cls-rel-row">
                <select value={r.from} onChange={(e) => updateRelation(i, 'from', e.target.value)}>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={r.kind || 'assoc'} onChange={(e) => updateRelation(i, 'kind', e.target.value)}>
                  <option value="assoc">→ 연관</option>
                  <option value="inherit">▷ 상속</option>
                  <option value="implement">▷ 구현(점선)</option>
                  <option value="compose">◆ 컴포지션</option>
                  <option value="aggregate">◇ 집합</option>
                  <option value="depend">⇢ 의존(점선)</option>
                </select>
                <select value={r.to} onChange={(e) => updateRelation(i, 'to', e.target.value)}>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="text" value={r.label || ''} placeholder="라벨 (1..*)"
                       onChange={(e) => updateRelation(i, 'label', e.target.value)}
                       className="cls-rel-label" />
                <button onClick={() => removeRelation(i)} className="del" title="삭제">✕</button>
              </div>
            ))}
            {!relations.length && <div className="cls-empty">아직 관계가 없습니다. "+ 관계"로 추가하세요.</div>}
          </div>
        </div>
      </div>

      {aiOpen && <AiDrawModal onClose={() => setAiOpen(false)} onRun={runAi}
        placeholder="예: 인벤토리 시스템의 클래스 구조. Item, Inventory, Stack, Player, Equipment, Slot 의 상속/컴포지션 관계." />}

      <SlideFooter section={data.section} sectionName={data.sectionName} page={page} totalPages={totalPages} />
    </div>
  );
}

async function aiGenerateSequence(prompt) {
  const persona = window.SENIOR_PERSONA || '';
  const ai = `${persona}

# 임무
30년차 시니어 게임 메이커로서, 아래 설명에 맞는 시퀀스 다이어그램을 작성하라.

설명: "${prompt}"

# 출력 형식 (JSON만, 코드블록 금지)
{
  "participants": [
    { "id": "p1", "name": "클라이언트", "kind": "actor|system|service|data" }
  ],
  "messages": [
    { "from": "p1", "to": "p2", "label": "auth.login(id, pw)", "kind": "sync|async|return" }
  ]
}

# 시니어 표준 작성 기준
- 참여자 3~6개. id는 p1, p2... 형식. 왼쪽일수록 외부/사용자에 가깝게 배치.
- kind 의미: actor(사용자/외부), system(컴포넌트), service(서비스/마이크로서비스), data(DB/캐시/큐).
- 메시지 6~12개. 실제 호출명·이벤트명으로 라벨 (예: "auth.login(id, pw)", "match.create", "session.persist").
- kind 의미: sync(동기 호출), async(비동기/이벤트), return(응답·콜백).
- 최소 1개의 return 메시지 포함. 비동기성 통신은 async 사용.
- 라벨은 영문 식별자(snake_case 또는 camelCase) 권장.`;

  try {
    const raw = await window.gemini.complete(ai);
    const parsed = window.parseAiJson(raw);
    if (parsed.participants && parsed.messages) return parsed;
  } catch (e) {
    if (window.gddToast) try { window.gddToast('AI 시퀀스 다이어그램 생성 실패: ' + (e?.message || e), 'err'); } catch {}
  }
  return null;
}

async function aiGenerateClass(prompt) {
  const persona = window.SENIOR_PERSONA || '';
  const ai = `${persona}

# 임무
30년차 시니어 게임 메이커로서, 아래 설명에 맞는 UML 클래스 다이어그램을 작성하라.

설명: "${prompt}"

# 출력 형식 (JSON만, 코드블록 금지)
{
  "classes": [
    {
      "id": "c1",
      "name": "Player",
      "stereotype": "<<entity>>|<<interface>>|<<service>>|<<value>>|",
      "attrs": ["+id: UUID", "-hp: int", "-mp: int"],
      "methods": ["+takeDamage(amount: int): void", "+heal(amount: int): void"],
      "col": 0, "row": 0
    }
  ],
  "relations": [
    { "from": "c1", "to": "c2", "kind": "inherit|implement|compose|aggregate|assoc|depend", "label": "1..*" }
  ]
}

# 시니어 표준 작성 기준
- 클래스 4~7개. id는 c1, c2... col은 0~3, row는 0부터 시작.
- 가시성 prefix: + public, - private, # protected, ~ package.
- attrs: 필드 3~5개. methods: 핵심 메서드 2~4개. 시그니처는 (param: Type, ...): ReturnType.
- 관계 종류:
  - inherit (상속): 일반화/extends 관계. 자식 → 부모.
  - implement (구현): 인터페이스 구현. 클래스 → 인터페이스(<<interface>>). 점선.
  - compose (컴포지션): 강한 소유. 부분의 생명주기가 전체에 종속.
  - aggregate (집합): 약한 소유. 부분이 전체 없이도 존재 가능.
  - assoc (연관): 일반 양방향/단방향 참조.
  - depend (의존): 일시적 사용. 점선.
- 라벨: 다중도(1..*, 0..1, *) 또는 역할명.`;

  try {
    const raw = await window.gemini.complete(ai);
    const parsed = window.parseAiJson(raw);
    if (parsed.classes) return parsed;
  } catch (e) {
    if (window.gddToast) try { window.gddToast('AI 클래스 다이어그램 생성 실패: ' + (e?.message || e), 'err'); } catch {}
  }
  return null;
}

Object.assign(window, {
  DiagramSlide, EnhancedFlowSlide, AiDrawModal,
  SequenceDiagramSlide, ClassDiagramSlide,
  aiGenerateFlow, aiGenerateDiagram, aiGenerateSequence, aiGenerateClass,
  stripJson,
});


// ============================================================
// File: brief.jsx
// ============================================================
/* === Brief Composer + Paste utilities === */

/* Multi-paste helper: extract images + text blocks from a ClipboardEvent.
   Returns { images: [{src, name}], texts: [{value}] } */
function readClipboard(event) {
  const out = { images: [], texts: [] };
  const items = event.clipboardData?.items || [];
  const files = event.clipboardData?.files || [];

  // Files (when user pastes file from explorer)
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    if (f.type.startsWith('image/')) {
      out.images.push({ file: f, name: f.name || `image-${i}.png` });
    }
  }
  // Items (when user pastes raw image data)
  for (const item of items) {
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      const f = item.getAsFile();
      if (f && !out.images.some(x => x.file === f)) {
        out.images.push({ file: f, name: f.name || 'pasted-image.png' });
      }
    } else if (item.kind === 'string' && (item.type === 'text/plain' || item.type === 'text/html')) {
      // text path handled via the textarea natively unless we want to intercept block
    }
  }
  return out;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/* Brief Composer modal */
function BriefComposer({ onClose, onSubmit, isGenerating, initialMode = 'ai', mode = 'gdd', prefill }) {
  const [title, setTitle] = React.useState(prefill?.title || '');
  const [brief, setBrief] = React.useState(prefill?.brief || '');
  const [attachments, setAttachments] = React.useState([]);
  const [submissionMode, setSubmissionMode] = React.useState(initialMode);
  const [dragging, setDragging] = React.useState(false);
  const taRef = React.useRef(null);
  const dragCounterRef = React.useRef(0);

  const isConcept = mode === 'concept';
  const isLinked = mode === 'gdd-linked';

  const addImage = async (file) => {
    const src = await fileToDataUrl(file);
    setAttachments(a => [...a, { id: uid(), kind: 'image', src, name: file.name || 'image.png' }]);
  };
  const addTextBlock = (value, name) => {
    setAttachments(a => [...a, { id: uid(), kind: 'text', value, name: name || `텍스트 ${a.filter(x=>x.kind==='text').length + 1}` }]);
  };

  const onPaste = async (e) => {
    const { images } = readClipboard(e);
    // If clipboard has images, intercept paste and add them as attachments
    if (images.length) {
      e.preventDefault();
      for (const im of images) await addImage(im.file);
      return;
    }
    // Check for large text — if pasting > 200 chars AND user already has content, ask to attach
    const text = e.clipboardData?.getData('text/plain') || '';
    if (text.length > 400 && brief.trim().length > 30) {
      // Heuristic: attach as block rather than concat
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
      else if (f.type.startsWith('text/')) {
        const text = await f.text();
        addTextBlock(text, f.name);
      }
    }
  };
  const onDragEnter = (e) => { e.preventDefault(); dragCounterRef.current++; setDragging(true); };
  const onDragLeave = (e) => { dragCounterRef.current--; if (dragCounterRef.current <= 0) setDragging(false); };
  const onDragOver = (e) => { e.preventDefault(); };

  const removeAttachment = (id) => setAttachments(a => a.filter(x => x.id !== id));

  const submit = () => {
    const text = (title.trim() ? title.trim() + ' — ' : '') + brief.trim();
    if (!text && attachments.length === 0) return;
    onSubmit({ title: title.trim(), brief: brief.trim(), attachments, mode: submissionMode });
  };

  const imgCount = attachments.filter(a => a.kind === 'image').length;
  const txtCount = attachments.filter(a => a.kind === 'text').length;

  const headerCopy = isConcept
    ? { h: '새 게임 컨셉 만들기', sub: '게임의 한 줄 컨셉을 입력하세요. AI가 1-Page GDD + 필요한 세부 기획서 목록을 생성합니다.' }
    : isLinked
    ? { h: '컨셉 기반 세부 기획서 생성', sub: '컨셉의 추천 기획서에서 시작합니다. 추가 설명이나 참고 자료를 더하세요.' }
    : { h: '새 기획서 만들기', sub: '어떤 기획을 작성할지 명령하세요. 이미지·텍스트는 붙여넣기 또는 드래그로 첨부할 수 있습니다.' };

  const submitLabel = isConcept ? '컨셉 생성 ↵' : '기획서 생성 ↵';

  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="brief-composer" onClick={e => e.stopPropagation()}>
        <header>
          <div className="head-l">
            <h2><span className="accent-dot"></span>{headerCopy.h}</h2>
            <div className="sub">{headerCopy.sub}</div>
          </div>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>

        <div className="brief-body">
          <input
            className="brief-title-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={isConcept ? '게임 제목 (선택사항)' : '기획서 제목 (선택사항)'}
            autoFocus
          />

          <div
            className={'brief-prompt-wrap ' + (dragging ? 'dragging' : '')}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <textarea
              ref={taRef}
              value={brief}
              onChange={e => setBrief(e.target.value)}
              onPaste={onPaste}
              placeholder={isConcept
                ? "예) 고양이들이 우주선을 타고 탐험하는 픽셀아트 게임. 친구 4명과 협동, 행성마다 다른 미니게임. 라이트 캐주얼 타겟. 모바일 우선.\n\n이미지를 ⌘V로 붙여넣거나 끌어다 놓으세요."
                : "예) 슈퍼럼블 모드 기획서 만들어줘. 4vs4 팀전이고, 5분 제한, 마지막 30초 럼블 페이즈에서 모든 차량 스피드 +30%.\n\n이미지를 ⌘V 로 붙여넣거나, 텍스트 블록을 끌어다 놓으세요."
              }
              rows={5}
            />
            <div className="brief-prompt-meta">
              <span className="pill">⌘V <span className="kbd">붙여넣기</span></span>
              <span className="pill">⇧ Drop <span className="kbd">파일</span></span>
              <span style={{ marginLeft: 'auto', color: 'var(--text-4)' }}>{brief.length} chars</span>
            </div>
          </div>

          {attachments.length > 0 && (
            <>
              <div className="brief-section-label">
                <span>첨부 자료</span>
                <span className="count">{imgCount > 0 && `이미지 ${imgCount}`}{imgCount > 0 && txtCount > 0 && ' · '}{txtCount > 0 && `텍스트 ${txtCount}`}</span>
              </div>
              <div className="brief-attach-grid">
                {attachments.map(a => (
                  a.kind === 'image' ? (
                    <div className="attach-tile" key={a.id}>
                      <img src={a.src} alt={a.name} />
                      <span className="label">{a.name.slice(0, 24)}</span>
                      <button className="del" onClick={() => removeAttachment(a.id)}>✕</button>
                    </div>
                  ) : (
                    <div className="attach-tile text-tile" key={a.id}>
                      <div className="t-head">
                        <span>📋 {a.name}</span>
                        <span>{a.value.length}자</span>
                      </div>
                      <div className="t-body">{a.value.slice(0, 200)}</div>
                      <button className="del" onClick={() => removeAttachment(a.id)}>✕</button>
                    </div>
                  )
                ))}
              </div>
            </>
          )}
        </div>

        <footer>
          <div className="mode-tabs">
            <button className={submissionMode === 'ai' ? 'active' : ''} onClick={() => setSubmissionMode('ai')}>AI 생성</button>
            <button className={submissionMode === 'demo' ? 'active' : ''} onClick={() => setSubmissionMode('demo')}>빠른 데모</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn ghost" onClick={onClose}>취소</button>
            <button
              className="btn primary"
              onClick={submit}
              disabled={isGenerating || (!brief.trim() && !title.trim() && attachments.length === 0)}
            >
              {isGenerating ? '생성 중…' : submitLabel}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* Chat input paste hook */
function useChatPaste(setAttachments) {
  return async (e) => {
    const { images } = readClipboard(e);
    if (images.length) {
      e.preventDefault();
      for (const im of images) {
        const src = await fileToDataUrl(im.file);
        setAttachments(a => [...a, { id: uid(), kind: 'image', src, name: im.name }]);
      }
    }
  };
}

Object.assign(window, { BriefComposer, useChatPaste, readClipboard, fileToDataUrl });


// ============================================================
// File: concept.jsx
// ============================================================
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
  locked: { title: false, overview: false, visual: false, usp: false, coreLoop: false },
  snapshots: [],
});

/* ===== ConceptView ===== */
function ConceptView({ concept, patch, onCreateGdd, onOpenGdd, onBulkCreate, isGenerating, toast }) {
  const fileInputRef = React.useRef(null);
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
      console.error(e);
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
      console.error(e);
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
      console.error(e);
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
      console.error(e);
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
              style={{ borderColor: theme.main, color: theme.main }}
            />
            <div className="concept-author">
              <span>◯</span>
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

        {/* Recommended detailed plans */}
        <div className="concept-recs">
          <div className="concept-recs-head">
            <h3>필요 기획서</h3>
            <div className="meta">
              {(concept.recommendedPlans || []).filter(p => p.linkedGddId).length}
              {' / '}
              {(concept.recommendedPlans || []).length} 작성됨
            </div>
            {(() => {
              const pending = (concept.recommendedPlans || []).filter(p => !p.linkedGddId).length;
              return (
                <button
                  className="bulk-create-btn"
                  onClick={() => onBulkCreate?.()}
                  disabled={isGenerating || pending === 0}
                  title={pending === 0 ? '미작성 기획서가 없습니다' : `미작성 ${pending}개를 AI로 일괄 생성`}
                >
                  {isGenerating ? '생성 중…' : `✦ 미작성 전체 생성 ${pending > 0 ? `(${pending})` : ''}`}
                </button>
              );
            })()}
          </div>
          <div className="concept-rec-grid">
            {(concept.recommendedPlans || []).map(p => (
              <div
                key={p.id}
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
                  <span>#{p.id}</span>
                  <span className="rec-status">{p.linkedGddId ? '✓ 작성됨' : '대기'}</span>
                </div>
                <div className="rec-title">{p.title}</div>
                <div className="rec-desc">{p.description}</div>
                <div className="rec-action">
                  <span></span>
                  <span className="arr">→</span>
                </div>
              </div>
            ))}
            <div
              className="concept-rec-card"
              style={{ borderStyle: 'dashed', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', minHeight: 110, color: 'var(--text-3)' }}
              onClick={() => {
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
function buildConceptPrompt(command, attachments) {
  const textBlocks = (attachments || []).filter(a => a.kind === 'text').map((a, i) => `\n[첨부 텍스트 ${i+1}: ${a.name}]\n${a.value.slice(0, 1500)}`).join('\n');
  const imageNote = (attachments || []).filter(a => a.kind === 'image').length > 0
    ? `\n참고: ${(attachments || []).filter(a => a.kind === 'image').length}개의 참고 이미지가 함께 제공됩니다.`
    : '';

  return `${window.SENIOR_PERSONA || ''}

# 임무
30년차 풀스택 게임 메이커로서, 아래 요청을 1-Page GDD(게임 컨셉 한 장 요약)로 압축한다. 투자자·팀 리더·신규 합류자가 5분 안에 게임을 이해하고 의사결정할 수 있어야 한다.

요청: "${command}"
${textBlocks}
${imageNote}

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
    { "title": "기획서 제목 (예: 인게임 데스매치 규칙 기획)", "description": "이 기획서가 다룰 핵심 내용 + 의존 시스템 1줄" }
  ]
}

# 시니어 표준 작성 기준
- **subtitle**: "어떤 게임"보다 "왜 다른가"가 드러나도록. "X하는 Y 게임" 패턴 권장.
- **coreLoop**: 3~5단계. 단순 명사 나열 금지, 동사형으로. 첫 단계는 진입, 마지막은 보상/성장으로 회귀하는 구조.
- **overview**: 4개 필드 모두 "?" 금지. 합리적 디폴트로 채운다.
- **keyUsp**: 3~5개. 경쟁작 대비 차별점을 명확히. 단순 기능 나열 금지, "X가 가능하다 → 그래서 Y한 체감을 준다" 구조.
- **palette**: 5색 모두 게임 무드와 정합. 5색이 함께 놓였을 때 충돌 없이 어울리도록 (보색 무분별 사용 X).
- **recommendedPlans**: **10~16개**. 장르에 맞게 가감하되, 시니어라면 다음을 의식적으로 포함한다 — 코어 시스템(전투/이동/성장), 메타 시스템(로비/매칭/소셜), 진행(튜토리얼/온보딩), 콘텐츠(모드/이벤트/시즌), 경제·BM(재화/상점/패스권/광고), 라이브 운영(공지/CS/리포트), 기술·인프라(서버 구조/네트워크/데이터), 아트/UX/사운드. **description은 30~80자**, 무엇을 다루는지 + 의존성 1개 명시.
- **visual.prompt**: 반드시 영문. 추상어 금지, 명사·형용사·동사 모두 구체적으로.

# 출력 규칙
- JSON만. 다른 설명·코드블록·주석 금지.
- 모든 한국어 값은 간결한 -다체 또는 -입니다체로 통일.
- "TBD/추후/협의" 금지.`;
}

async function aiGenerateConcept(command, attachments) {
  const prompt = buildConceptPrompt(command, attachments);
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

  let parsed;
  try { parsed = window.parseAiJson(raw); } catch (e) { throw new Error(e.message || 'JSON 복구 실패'); }

  const visualPrompt = parsed.visual?.prompt || '';
  const visualPromptKo = parsed.visual?.promptKo || '';
  // AI가 생성한 팔레트 (없으면 디폴트). 이미지 생성에 전달.
  const visualPalette = parsed.palette || (CONCEPT_BLANK().palette);
  let imageSrc = null;
  if (visualPrompt) {
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
      linkedGddId: null,
    })),
  };
  // Schema 검증 + 자동 보정
  if (window.validateConcept) {
    const r = window.validateConcept(conceptResult);
    if (r.fixes.length && window.gddToast) {
      try { window.gddToast(`컨셉 응답 ${r.fixes.length}개 항목 자동 보정`, 'ok'); } catch {}
    }
    return r.concept;
  }
  return conceptResult;
}

Object.assign(window, {
  CONCEPT_SUPERBUMPERS, CONCEPT_BLANK,
  ConceptView, ConceptBrief,
  buildConceptPrompt, aiGenerateConcept,
  aiPartialRegen,
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


// ============================================================
// File: chat.jsx
// ============================================================
/* === Chat panel + Right sidebar (Chat / History / Comments) === */

function ChatTab({ project, isConcept, onSendCommand, isGenerating, generationMode, setGenerationMode }) {
  const [input, setInput] = React.useState('');
  const [attachments, setAttachments] = React.useState([]);
  const bodyRef = React.useRef(null);
  const taRef = React.useRef(null);
  // 현재 GDD를 보고 있고 AI 모드면 "수정 모드", 그 외엔 "신규 생성 모드"
  const isEditMode = !!(project && !isConcept && generationMode === 'ai');

  const handlePaste = async (e) => {
    const { images } = readClipboard(e);
    if (images.length) {
      e.preventDefault();
      for (const im of images) {
        const src = await fileToDataUrl(im.file);
        setAttachments(a => [...a, { id: uid(), kind: 'image', src, name: im.name }]);
      }
    }
  };

  const messages = project?._chatMessages || project?.history?.map(h => ({
    role: 'user', text: h.cmd, ts: h.ts, summary: h.summary,
  })) || [];

  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages.length, isGenerating]);

  const send = () => {
    const t = input.trim();
    if ((!t && attachments.length === 0) || isGenerating) return;
    setInput('');
    const atts = attachments;
    setAttachments([]);
    onSendCommand(t, atts);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <div className="chat-body" ref={bodyRef}>
        {messages.length === 0 && (
          <div className="chat-msg ai">
            <div className="avatar">AI</div>
            <div className="bubble">
              <div>안녕하세요. 어떤 게임 기획서를 만들어 드릴까요?</div>
              <div className="meta">한 줄 아이디어 → 22~32 슬라이드 자동 생성. DEEP 모드는 self-critique 까지.</div>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div className={'chat-msg ' + (m.role || 'user')} key={i}>
            <div className="avatar">{m.role === 'ai' ? 'AI' : (project?.author || '나').slice(0, 2)}</div>
            <div className="bubble">
              {m.role === 'ai' && m.actions && (
                <div style={{ marginBottom: 6 }}>
                  {m.actions.map((a, ai) => <span key={ai} className="action-chip">{a}</span>)}
                </div>
              )}
              <div>{m.text}</div>
              {m.summary && <div className="meta">{m.summary}</div>}
              {m.ts && <div className="meta">{m.ts}</div>}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="chat-msg ai">
            <div className="avatar">AI</div>
            <div className="bubble">
              <div className="chat-typing">
                <span>{generationMode === 'ai' ? '슬라이드 구조 생성 중' : '템플릿 채우는 중'}</span>
                <span className="dots"><span></span><span></span><span></span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="chat-suggestions">
          <div className="label">빠른 시작</div>
          {CHIP_SUGGESTIONS.map((s, i) => (
            <button key={i} className="chip" onClick={() => onSendCommand(s)}>{s}</button>
          ))}
        </div>
      )}

      <div className="chat-input">
        {attachments.length > 0 && (
          <div className="chat-attach-row">
            {attachments.map(a => (
              <div className="chat-attach-chip" key={a.id}>
                <div className="thumb">
                  {a.kind === 'image' ? <img src={a.src} alt="" /> : 'TXT'}
                </div>
                <span>{a.name.slice(0, 18)}</span>
                <button onClick={() => setAttachments(at => at.filter(x => x.id !== a.id))}>✕</button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
          <button
            className={'chip ' + (generationMode === 'ai' ? 'active' : '')}
            style={generationMode === 'ai' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : null}
            onClick={() => setGenerationMode('ai')}
            title="단일 호출 — 빠르고 저렴 (~$0.05)"
          >
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>AI</span> 표준 생성
          </button>
          <button
            className={'chip ' + (generationMode === 'deep' ? 'active' : '')}
            style={generationMode === 'deep' ? { borderColor: '#88dfb0', color: '#88dfb0' } : null}
            onClick={() => setGenerationMode('deep')}
            title="Outline → Flesh-out → Self-critique 3단계. 슬라이드당 3~5배 깊이. 비용 ~$0.15."
          >
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>DEEP</span> 심층 생성
          </button>
          <button
            className={'chip ' + (generationMode === 'demo' ? 'active' : '')}
            style={generationMode === 'demo' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : null}
            onClick={() => setGenerationMode('demo')}
            title="AI 호출 없이 템플릿 채움 (무료)"
          >
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>FAST</span> 데모
          </button>
        </div>
        <div className="wrap">
          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            onPaste={handlePaste}
            placeholder={
              isEditMode
                ? '현재 기획서 수정 명령 (예: "사망 FLOW 슬라이드 추가", "data-table에 status 컬럼 추가")…  (Enter 전송)'
                : '새 기획서 생성 명령 또는 ⌘V로 이미지 첨부…  (Enter 전송)'
            }
            rows={2}
            disabled={isGenerating}
          />
          <button className="send" onClick={send} disabled={(!input.trim() && attachments.length === 0) || isGenerating}>
            전송 <span style={{ opacity: 0.8 }}>↵</span>
          </button>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
          {isEditMode ? (
            <>
              <span style={{ color: 'var(--accent)' }}>● 수정 모드</span> — 현재 GDD에 add / replace / patch / delete / move 적용. 예: "사망 FLOW 슬라이드 추가", "5번 슬라이드 삭제", "제목을 XX로"
            </>
          ) : (
            <>
              <span style={{ color: 'var(--text-3)' }}>● 신규 생성 모드</span> — 새 기획서를 만듭니다. 예: "사망 FLOW 슬라이드 추가" / 이미지 붙여넣기 + "이 디자인 참고해서 화면 설계 슬라이드"
            </>
          )}
        </div>
      </div>
    </>
  );
}

function HistoryTab({ project, onRollback }) {
  const items = project?.history || [];
  if (items.length === 0) {
    return <div className="chat-body" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)', fontSize: 12 }}>아직 명령 기록이 없습니다.</div>;
  }
  return (
    <div className="chat-body">
      {items.slice().reverse().map((h, i) => (
        <div className="history-item" key={i}>
          <div className="ts">{h.ts}</div>
          <div className="cmd">"{h.cmd}"</div>
          <div className="res">→ {h.summary}</div>
          <div className="actions">
            <button onClick={() => onRollback && onRollback(items.length - 1 - i)}>롤백</button>
            <button>차이 보기</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentsTab({ project, onAddComment }) {
  const [text, setText] = React.useState('');
  const comments = project?.comments || [];

  return (
    <>
      <div className="chat-body">
        {comments.length === 0 && (
          <div style={{ color: 'var(--text-4)', fontSize: 12, textAlign: 'center', marginTop: 24 }}>
            댓글이 없습니다.
          </div>
        )}
        {comments.map((c, i) => (
          <div className="comment" key={i}>
            <div className="head">
              <span className="who">{c.who}</span>
              <span className="at">{c.at}</span>
            </div>
            <div className="body">{c.body}</div>
            {c.ref && <div className="ref">→ {c.ref}</div>}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <div className="wrap">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="댓글 추가… (Shift+Enter 줄바꿈)"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (text.trim()) {
                  onAddComment({
                    who: project?.author || '나',
                    at: new Date().toISOString().slice(0, 16).replace('T', ' '),
                    body: text.trim(),
                    ref: '',
                  });
                  setText('');
                }
              }
            }}
          />
          <button className="send" disabled={!text.trim()} onClick={() => {
            if (!text.trim()) return;
            onAddComment({
              who: project?.author || '나',
              at: new Date().toISOString().slice(0, 16).replace('T', ' '),
              body: text.trim(),
              ref: '',
            });
            setText('');
          }}>추가</button>
        </div>
      </div>
    </>
  );
}

function RightPanel(props) {
  const [tab, setTab] = React.useState('chat');
  const isConcept = props.isConcept;
  React.useEffect(() => {
    // If on concept and current tab is comments, switch back to chat
    if (isConcept && tab === 'comments') setTab('chat');
  }, [isConcept, tab]);
  return (
    <div className="chat">
      <div className="chat-tabs">
        <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>AI 채팅</button>
        <button className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>
          명령 히스토리
          {props.project?.history?.length > 0 && (
            <span style={{ marginLeft: 4, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)' }}>
              ({props.project.history.length})
            </span>
          )}
        </button>
        {!isConcept && (
          <button className={tab === 'comments' ? 'active' : ''} onClick={() => setTab('comments')}>
            댓글
            {props.project?.comments?.length > 0 && (
              <span style={{ marginLeft: 4, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)' }}>
                ({props.project.comments.length})
              </span>
            )}
          </button>
        )}
      </div>
      {tab === 'chat' && <ChatTab {...props} />}
      {tab === 'history' && <HistoryTab {...props} />}
      {tab === 'comments' && !isConcept && <CommentsTab {...props} />}
    </div>
  );
}

Object.assign(window, { RightPanel });


// ============================================================
// File: doc-export.jsx
// ============================================================
/* === Document view (Word-style flow) + PPTX export === */

function DocumentView({ project, patchSlide, onPatchProject }) {
  if (!project) return null;
  const slides = project.slides || [];

  return (
    <div className="doc-view">
      <div className="doc-page">
        <Editable
          tag="h1" className="doc-h1"
          value={project.title}
          onChange={(v) => onPatchProject && onPatchProject({ title: v })}
        />
        <div className="doc-meta">
          {project.team} · {project.author} · {project.version} · {project.updatedAt}
        </div>

        {slides.map((s, i) => (
          <DocSection key={s.id} slide={s} index={i} patch={(u) => patchSlide(s.id, u)} />
        ))}
      </div>
    </div>
  );
}

function DocSection({ slide, index, patch }) {
  const d = slide.data || {};
  const sectionTag = (d.section ? d.section + ' · ' : '') + (d.sectionName || SLIDE_LABELS[slide.type] || '');

  const patchData = (u) => patch({ data: { ...d, ...u } });

  if (slide.type === 'cover') {
    return null; // cover shown via doc-h1 above
  }

  if (slide.type === 'history') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title || '문서 이력'}</h2>
        <table>
          <thead><tr><th>버전</th><th>변경일자</th><th>page</th><th>내용</th><th>작성자</th></tr></thead>
          <tbody>
            {(d.rows || []).map((r, i) => (
              <tr key={i}>
                <td><code style={{color:'var(--accent)'}}>{r.ver}</code></td>
                <td>{r.date}</td>
                <td>{r.page}</td>
                <td>{r.content}</td>
                <td>{r.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (slide.type === 'toc') {
    const hasParts = Array.isArray(d.parts) && d.parts.length > 0;
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.titleKo || '목차'}</h2>
        {hasParts ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px 40px' }}>
            {d.parts.map((p, i) => (
              <div key={i}>
                <div style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.2em', marginBottom: 4 }}>
                  PART · {String(i + 1).padStart(2, '0')} · {p.sub || ''}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{p.roman} · {p.label}</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {(p.entries || []).map((e, j) => (
                    <li key={j}><strong>{e.num}</strong> {e.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <ul>
            {(d.entries || []).map((e, i) => (
              <li key={i}><strong>{e.num}. {e.name}</strong> <span style={{color:'#7d8590'}}>— {e.sub}</span></li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (slide.type === 'section-divider') {
    return (
      <div className="doc-section" style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 22, borderTop: '3px solid var(--accent)', paddingTop: 16 }}>
          <span className="idx" style={{ fontSize: 18 }}>{d.num}</span>
          {d.title}{d.sub ? <span style={{ fontSize: 14, color: 'var(--accent)', marginLeft: 10, fontStyle: 'italic' }}>— {d.sub}</span> : null}
        </h2>
        <p style={{ color: '#7d8590', whiteSpace: 'pre-line' }}>{d.subtitle}</p>
      </div>
    );
  }

  if (slide.type === 'intent') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        <p>{d.tagline}</p>
        {(d.cards || []).map((c, i) => (
          <div key={i} style={{ margin: '10px 0', paddingLeft: 12, borderLeft: '2px solid var(--accent)' }}>
            <h3 style={{ margin: '0 0 4px' }}>{c.idx}. {c.head}</h3>
            <p style={{ margin: 0 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    );
  }

  if (slide.type === 'terms') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        <table>
          <thead><tr><th>용어</th><th>정의</th><th>비고</th></tr></thead>
          <tbody>{(d.rows || []).map((r, i) => <tr key={i}><td><strong>{r.term}</strong></td><td>{r.def}</td><td style={{color:'#7d8590'}}>{r.note}</td></tr>)}</tbody>
        </table>
      </div>
    );
  }

  if (slide.type === 'rules') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        {(d.blocks || []).map((b, i) => (
          <div key={i}>
            <h3>{b.head}</h3>
            <ul>{(b.items || []).map((it, ii) => <li key={ii}>{it}</li>)}</ul>
          </div>
        ))}
      </div>
    );
  }

  if (slide.type === 'data-table') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        <table>
          <thead><tr>{(d.columns || []).map((c, i) => <th key={i}>{c.label}</th>)}</tr></thead>
          <tbody>{(d.rows || []).map((r, i) => <tr key={i}>{(d.columns || []).map((c, ci) => <td key={ci}>{r[c.key]}</td>)}</tr>)}</tbody>
        </table>
      </div>
    );
  }

  if (slide.type === 'flow') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        <ol>{(d.nodes || []).map((n, i) => <li key={i}><strong>[{n.kind}]</strong> {n.label}</li>)}</ol>
      </div>
    );
  }

  if (slide.type === 'ui-design') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        <p style={{color:'#7d8590', fontStyle:'italic'}}>[UI 목업 placeholder]</p>
        <ol>{(d.callouts || []).map((c, i) => <li key={i}><strong>{c.name}</strong> — {c.desc}</li>)}</ol>
      </div>
    );
  }

  if (slide.type === 'resources') {
    return (
      <div className="doc-section">
        <h2><span className="idx">{String(index).padStart(2, '0')}</span>{d.title}</h2>
        <div className="sub">{sectionTag}</div>
        {(d.categories || []).map((c, i) => (
          <div key={i}>
            <h3>{c.name} <span style={{color:'var(--accent)', fontFamily:'JetBrains Mono'}}>{c.count}</span></h3>
            <ul>{(c.items || []).map((it, ii) => <li key={ii}>{it}</li>)}</ul>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

/* === PPTX export ===
   Uses PptxGenJS loaded from CDN.
   We render slides as native shapes/text (editable in PowerPoint). */

/** 사용자가 슬라이드에서 한 pan/zoom 상태가 출력물에 그대로 박히지 않도록 export 직전 normalize. */
function sanitizeProjectForExport(project) {
  if (!project) return project;
  return {
    ...project,
    slides: (project.slides || []).map(s => {
      if (!s?.data?._viewTransform) return s;
      const { _viewTransform, ...restData } = s.data;
      return { ...s, data: restData };
    }),
  };
}

async function exportPptx(project) {
  if (!window.PptxGenJS) throw new Error('PptxGenJS not loaded');
  // pan/zoom 상태 제거 — 사용자가 줌-인 한 채로 두면 캡처 결과에 그대로 박힘
  project = sanitizeProjectForExport(project);
  const pptx = new window.PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches (16:9)
  pptx.title = project.title;
  pptx.author = project.author || '';
  pptx.company = project.team || '';

  // Korean-friendly font fallback. PowerPoint will substitute if not installed.
  const FONT = '맑은 고딕';
  const MONO = 'Consolas';
  const ACCENT = '4CC2FF';
  const TEXT = '1C222B';
  const TEXT2 = '7D8590';
  const BG = 'FFFFFF';

  const slides = project.slides || [];
  const totalPages = slides.length;

  // Slide W=13.33", H=7.5"
  const W = 13.33;
  const H = 7.5;
  const PAD_X = 0.75;
  const PAD_Y = 0.6;

  const addFooter = (slide, section, sectionName, page) => {
    const leftParts = [];
    if (section) leftParts.push(section);
    if (sectionName) leftParts.push(sectionName);
    if (leftParts.length) {
      slide.addText(leftParts.join('  —  '), {
        x: PAD_X, y: H - 0.3, w: 6, h: 0.25,
        fontSize: 9, fontFace: MONO, color: TEXT2,
      });
    }
    slide.addText(`${String(page).padStart(2,'0')} / ${String(totalPages).padStart(2,'0')}`, {
      x: W - PAD_X - 2, y: H - 0.3, w: 2, h: 0.25,
      fontSize: 9, fontFace: MONO, color: '303A45', align: 'right', bold: true,
    });
  };

  const addTopTag = (slide, section, sectionName) => {
    if (!section && !sectionName) return;
    const parts = [];
    if (section) parts.push({ text: section, options: { color: ACCENT, bold: true } });
    if (sectionName) parts.push({ text: '  ' + sectionName, options: { color: '303A45' } });
    slide.addText(parts, {
      x: PAD_X, y: 0.3, w: 8, h: 0.25,
      fontSize: 10, fontFace: MONO, charSpacing: 1.6,
    });
  };

  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const d = s.data || {};
    const page = i + 1;
    const slide = pptx.addSlide();
    slide.background = { color: BG };

    if (s.type === 'cover') {
      slide.background = { color: '0A0D12' };
      // 배경 이미지 + 어두운 오버레이 (AI 생성된 표지 이미지)
      if (d.imageSrc && typeof d.imageSrc === 'string' && d.imageSrc.startsWith('data:image/')) {
        slide.addImage({ data: d.imageSrc, x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H } });
        slide.addShape('rect', { x: 0, y: 0, w: W, h: H, fill: { color: '0A0D12', transparency: 35 }, line: { color: '0A0D12', width: 0 } });
      }
      // accent bar
      slide.addShape('rect', { x: PAD_X, y: 0.55, w: 0.3, h: 0.04, fill: { color: ACCENT } });
      slide.addText(d.product || '', { x: PAD_X + 0.4, y: 0.45, w: 5, h: 0.3, fontSize: 12, fontFace: MONO, color: ACCENT, charSpacing: 1.6 });
      slide.addText(d.team || '', { x: W - PAD_X - 4, y: 0.45, w: 4, h: 0.3, fontSize: 11, fontFace: MONO, color: 'B1BAC4', align: 'right' });
      slide.addText(d.title || '', { x: PAD_X, y: 2.6, w: W - 2 * PAD_X, h: 1.8, fontSize: 56, bold: true, fontFace: FONT, color: 'E6EDF3', valign: 'top' });
      slide.addText(d.subtitle || '', { x: PAD_X, y: 4.4, w: W - 2 * PAD_X, h: 0.6, fontSize: 20, fontFace: FONT, color: 'B1BAC4' });
      slide.addText(d.author || '', { x: PAD_X, y: H - 0.9, w: 4, h: 0.3, fontSize: 14, fontFace: FONT, color: 'E6EDF3', bold: true });
      slide.addText(d.date || '', { x: W - PAD_X - 4, y: H - 0.9, w: 4, h: 0.3, fontSize: 11, fontFace: MONO, color: '7D8590', align: 'right' });
      slide.addShape('rect', { x: 0, y: H - 0.06, w: W * 0.35, h: 0.06, fill: { color: ACCENT } });
      continue;
    }

    if (s.type === 'section-divider') {
      slide.background = { color: '0A0D12' };
      // 배경 컨셉 아트 (AI 생성)
      if (d.imageSrc && typeof d.imageSrc === 'string' && d.imageSrc.startsWith('data:image/')) {
        slide.addImage({ data: d.imageSrc, x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H } });
        slide.addShape('rect', { x: 0, y: 0, w: W, h: H, fill: { color: '0A0D12', transparency: 25 }, line: { color: '0A0D12', width: 0 } });
      }
      slide.addText(d.num || '', { x: W - PAD_X - 6, y: 1.0, w: 6, h: 5.5, fontSize: 220, fontFace: MONO, color: 'FFFFFF22', align: 'right', valign: 'middle', bold: true });
      slide.addShape('rect', { x: PAD_X, y: 0.55, w: 0.25, h: 0.04, fill: { color: ACCENT } });
      slide.addText(`CHAPTER ${d.num || ''}`, { x: PAD_X + 0.35, y: 0.45, w: 5, h: 0.3, fontSize: 12, fontFace: MONO, color: ACCENT, charSpacing: 1.6 });
      slide.addText(d.title || '', { x: PAD_X, y: H - 2.2, w: W - 2 * PAD_X, h: 1.2, fontSize: 64, bold: true, fontFace: FONT, color: 'E6EDF3' });
      slide.addText(d.subtitle || '', { x: PAD_X, y: H - 1.0, w: W - 2 * PAD_X - 1, h: 0.7, fontSize: 16, fontFace: FONT, color: 'B1BAC4' });
      continue;
    }

    addTopTag(slide, d.section, d.sectionName);
    if (d.title || s.type === 'toc') {
      const titleText = s.type === 'toc' ? (d.title || 'CONTENTS') : (d.title || '');
      if (s.type === 'toc') {
        slide.addText('— TABLE OF CONTENTS', { x: PAD_X, y: 0.7, w: 6, h: 0.25, fontSize: 11, fontFace: MONO, color: ACCENT, charSpacing: 1.4 });
        slide.addText(titleText, { x: PAD_X, y: 1.0, w: W - 2 * PAD_X, h: 1.2, fontSize: 48, bold: true, fontFace: FONT, color: TEXT });
      } else {
        slide.addText(titleText, { x: PAD_X, y: 0.7, w: W - 2 * PAD_X, h: 0.7, fontSize: 26, bold: true, fontFace: FONT, color: TEXT });
      }
    }

    if (s.type === 'history') {
      const rows = [
        [
          { text: '버전', options: { bold: true, fill: { color: 'F3F5F7' } } },
          { text: '변경일자', options: { bold: true, fill: { color: 'F3F5F7' } } },
          { text: 'page', options: { bold: true, fill: { color: 'F3F5F7' } } },
          { text: '내용', options: { bold: true, fill: { color: 'F3F5F7' } } },
          { text: '작성자', options: { bold: true, fill: { color: 'F3F5F7' } } },
        ],
        ...(d.rows || []).map(r => [
          { text: r.ver || '', options: { color: ACCENT, bold: true, fontFace: MONO } },
          { text: r.date || '' },
          { text: r.page || '' },
          { text: r.content || '' },
          { text: r.author || '' },
        ])
      ];
      slide.addTable(rows, {
        x: PAD_X, y: 1.7, w: W - 2 * PAD_X,
        colW: [1.5, 1.8, 1.5, W - 2 * PAD_X - 1.5 - 1.8 - 1.5 - 1.8, 1.8],
        fontSize: 11, fontFace: FONT, color: TEXT,
        border: { type: 'solid', color: 'E3E7EB', pt: 0.5 },
        rowH: 0.4,
      });
    } else if (s.type === 'toc') {
      // parts 가 있으면 entries 가 빈 배열이어도 펼쳐서 사용
      let entries = d.entries || [];
      if ((!entries || entries.length === 0) && Array.isArray(d.parts)) {
        entries = d.parts.flatMap(p => (p.entries || []).map(e => ({ ...e, sub: p.label || p.sub || '' })));
      }
      const colW = (W - 2 * PAD_X - 0.5) / 2;
      entries.forEach((e, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = PAD_X + col * (colW + 0.5);
        const y = 2.6 + row * 0.85;
        slide.addText(e.num || '', { x, y, w: 0.5, h: 0.4, fontSize: 13, bold: true, fontFace: MONO, color: ACCENT });
        slide.addText(e.name || '', { x: x + 0.55, y, w: colW - 0.55, h: 0.35, fontSize: 15, bold: true, fontFace: FONT, color: TEXT });
        slide.addText(e.sub || '', { x: x + 0.55, y: y + 0.3, w: colW - 0.55, h: 0.4, fontSize: 11, fontFace: FONT, color: TEXT2 });
        slide.addShape('line', { x, y: y + 0.7, w: colW, h: 0, line: { color: 'E3E7EB', width: 0.5 } });
      });
    } else if (s.type === 'intent') {
      slide.addText(d.tagline || '', { x: PAD_X, y: 1.5, w: W - 2 * PAD_X - 1, h: 0.6, fontSize: 13, fontFace: FONT, color: '303A45' });
      const cards = d.cards || [];
      const cardW = (W - 2 * PAD_X - 0.3) / 2;
      const cardH = 1.7;
      cards.forEach((c, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = PAD_X + col * (cardW + 0.3);
        const y = 2.4 + row * (cardH + 0.25);
        slide.addShape('roundRect', { x, y, w: cardW, h: cardH, fill: { color: 'FAFBFC' }, line: { color: 'D0D7DE', width: 0.5 }, rectRadius: 0.1 });
        slide.addText(c.idx || '', { x: x + 0.25, y: y + 0.2, w: 1, h: 0.3, fontSize: 11, bold: true, fontFace: MONO, color: ACCENT });
        slide.addText(c.head || '', { x: x + 0.25, y: y + 0.5, w: cardW - 0.5, h: 0.6, fontSize: 16, bold: true, fontFace: FONT, color: TEXT });
        slide.addText(c.desc || '', { x: x + 0.25, y: y + 1.05, w: cardW - 0.5, h: cardH - 1.1, fontSize: 12, fontFace: FONT, color: '424A55' });
      });
    } else if (s.type === 'terms') {
      const rows = [
        [
          { text: '용어', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
          { text: '정의', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
          { text: '비고', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        ],
        ...(d.rows || []).map(r => [
          { text: r.term || '', options: { bold: true } },
          { text: r.def || '' },
          { text: r.note || '', options: { color: TEXT2 } },
        ])
      ];
      slide.addTable(rows, {
        x: PAD_X, y: 1.7, w: W - 2 * PAD_X,
        colW: [2.5, (W - 2 * PAD_X - 2.5 - 3), 3],
        fontSize: 11, fontFace: FONT, color: TEXT,
        border: { type: 'solid', color: 'E3E7EB', pt: 0.5 },
        rowH: 0.45,
      });
    } else if (s.type === 'rules') {
      const blocks = d.blocks || [];
      const useGrid = blocks.length > 2;
      if (useGrid) {
        const bw = (W - 2 * PAD_X - 0.3) / 2;
        const bh = 2.0;
        blocks.forEach((b, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const x = PAD_X + col * (bw + 0.3);
          const y = 1.7 + row * (bh + 0.2);
          slide.addShape('rect', { x, y, w: 0.04, h: bh, fill: { color: ACCENT } });
          slide.addShape('rect', { x: x + 0.04, y, w: bw - 0.04, h: bh, fill: { color: 'F8F9FA' } });
          slide.addText(b.head || '', { x: x + 0.25, y: y + 0.15, w: bw - 0.3, h: 0.35, fontSize: 14, bold: true, fontFace: FONT, color: TEXT });
          const itemsText = (b.items || []).map(it => ({ text: it, options: { bullet: { code: '2022' } } }));
          slide.addText(itemsText, { x: x + 0.35, y: y + 0.5, w: bw - 0.5, h: bh - 0.55, fontSize: 11, fontFace: FONT, color: '424A55', paraSpaceAfter: 4 });
        });
      } else {
        const bw = W - 2 * PAD_X;
        let y = 1.7;
        blocks.forEach(b => {
          const bh = 0.5 + 0.28 * Math.max(1, (b.items || []).length);
          slide.addShape('rect', { x: PAD_X, y, w: 0.04, h: bh, fill: { color: ACCENT } });
          slide.addShape('rect', { x: PAD_X + 0.04, y, w: bw - 0.04, h: bh, fill: { color: 'F8F9FA' } });
          slide.addText(b.head || '', { x: PAD_X + 0.25, y: y + 0.1, w: bw - 0.3, h: 0.3, fontSize: 14, bold: true, fontFace: FONT, color: TEXT });
          const itemsText = (b.items || []).map(it => ({ text: it, options: { bullet: { code: '2022' } } }));
          slide.addText(itemsText, { x: PAD_X + 0.35, y: y + 0.4, w: bw - 0.5, h: bh - 0.45, fontSize: 12, fontFace: FONT, color: '424A55', paraSpaceAfter: 4 });
          y += bh + 0.15;
        });
      }
    } else if (s.type === 'data-table') {
      const cols = d.columns || [];
      const rowsData = d.rows || [];
      const header = cols.map(c => ({ text: c.label, options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } }));
      const body = rowsData.map(r => cols.map(c => ({ text: String(r[c.key] || '') })));
      slide.addTable([header, ...body], {
        x: PAD_X, y: 1.7, w: W - 2 * PAD_X,
        fontSize: 10, fontFace: FONT, color: TEXT,
        border: { type: 'solid', color: 'E3E7EB', pt: 0.5 },
        rowH: 0.32,
      });
    } else if (s.type === 'flow') {
      const nodes = d.nodes || [];
      const n = nodes.length;
      const autoDir = n <= 5 ? 'vertical' : n <= 8 ? 'horizontal' : 'grid';
      const dir = d.direction || autoDir;
      const lines = (dir === 'grid') ? 1 : Math.max(1, Math.min(2, parseInt(d.lines, 10) || (n >= 10 ? 2 : 1)));
      const drawNode = (node, x, y, w, h) => {
        let fill = 'FFFFFF', col = TEXT, bd = '303A45';
        if (node.kind === 'start') { fill = ACCENT; col = '061018'; bd = ACCENT; }
        else if (node.kind === 'end') { fill = '1C222B'; col = 'E6EDF3'; bd = '1C222B'; }
        else if (node.kind === 'decision') { fill = 'FFF8DC'; bd = 'D29922'; }
        slide.addShape('roundRect', { x, y, w, h, fill: { color: fill }, line: { color: bd, width: 1.5 }, rectRadius: 0.05 });
        slide.addText(node.label || '', { x, y, w, h, fontSize: 11, bold: true, fontFace: FONT, color: col, align: 'center', valign: 'middle' });
      };
      if (dir === 'horizontal') {
        const frameY = 1.7, frameH = H - 2.8;
        const perLine = Math.ceil(n / lines);
        const gap = 0.2;
        const usableW = W - 2 * PAD_X;
        const arrowW = 0.3;
        const nodeW = (usableW - (perLine - 1) * (arrowW + gap)) / perLine;
        const nodeH = Math.min(1.0, (frameH - (lines - 1) * 0.4) / lines - 0.2);
        const lineSpacing = (frameH - lines * nodeH) / (lines + 1);
        nodes.forEach((node, idx) => {
          const line = Math.floor(idx / perLine);
          const col = idx % perLine;
          const x = PAD_X + col * (nodeW + arrowW + gap);
          const y = frameY + lineSpacing + line * (nodeH + lineSpacing);
          drawNode(node, x, y, nodeW, nodeH);
          if (col < perLine - 1 && idx < n - 1) {
            const ax = x + nodeW;
            const ay = y + nodeH / 2;
            slide.addShape('line', { x: ax, y: ay, w: arrowW + gap - 0.05, h: 0, line: { color: '303A45', width: 1.5, endArrowType: 'triangle' } });
          }
        });
      } else if (dir === 'grid') {
        const frameY = 1.7, frameH = H - 2.8;
        const cols = Math.ceil(Math.sqrt(n));
        const rows = Math.ceil(n / cols);
        const usableW = W - 2 * PAD_X;
        const cellW = (usableW - (cols - 1) * 0.25) / cols;
        const cellH = Math.min(0.9, (frameH - (rows - 1) * 0.25) / rows);
        nodes.forEach((node, idx) => {
          const col = idx % cols, row = Math.floor(idx / cols);
          const x = PAD_X + col * (cellW + 0.25);
          const y = frameY + row * (cellH + 0.25);
          drawNode(node, x, y, cellW, cellH);
          slide.addShape('ellipse', { x: x - 0.12, y: y - 0.12, w: 0.28, h: 0.28, fill: { color: '303A45' }, line: { color: '303A45' } });
          slide.addText(String(idx + 1).padStart(2, '0'), { x: x - 0.12, y: y - 0.12, w: 0.28, h: 0.28, fontSize: 9, bold: true, fontFace: MONO, color: 'FFFFFF', align: 'center', valign: 'middle' });
        });
      } else {
        // vertical with optional 2 columns
        const frameY = 1.6, frameH = H - 2.4;
        const perLine = Math.ceil(n / lines);
        const nodeH = 0.5;
        const nodeW = lines === 1 ? 3.0 : 2.4;
        const gap = 0.25;
        const totalH = perLine * nodeH + (perLine - 1) * gap;
        const startY = frameY + ((frameH - totalH) / 2);
        const usableW = W - 2 * PAD_X;
        const colSpacing = lines === 1 ? 0 : (usableW - lines * nodeW) / (lines + 1);
        nodes.forEach((node, idx) => {
          const col = Math.floor(idx / perLine);
          const row = idx % perLine;
          const x = lines === 1
            ? (W / 2 - nodeW / 2)
            : (PAD_X + colSpacing + col * (nodeW + colSpacing));
          const y = startY + row * (nodeH + gap);
          drawNode(node, x, y, nodeW, nodeH);
          if (row < perLine - 1 && idx < n - 1 && (idx + 1) % perLine !== 0) {
            const cx = x + nodeW / 2;
            slide.addShape('line', { x: cx, y: y + nodeH, w: 0, h: gap, line: { color: '303A45', width: 1.5, endArrowType: 'triangle' } });
          }
        });
      }
    } else if (s.type === 'ui-design') {
      slide.addShape('roundRect', { x: PAD_X, y: 1.6, w: 6.5, h: 4.6, fill: { color: '0A0D12' }, line: { color: '0A0D12' }, rectRadius: 0.1 });
      slide.addText('UI MOCKUP', { x: PAD_X + 1, y: 3.5, w: 4.5, h: 0.4, fontSize: 14, fontFace: MONO, color: ACCENT, align: 'center', charSpacing: 1.6 });
      slide.addText('화면 시안 placeholder', { x: PAD_X + 1, y: 3.9, w: 4.5, h: 0.4, fontSize: 12, fontFace: FONT, color: 'B1BAC4', align: 'center' });
      // 화면 표시와 동일하게 (y, x) 시각 읽기 순서로 정렬 — 배지·리스트 번호 일치
      const callouts = [...(d.callouts || [])]
        .map((c) => ({ c, x: typeof c.x === 'number' ? c.x : 50, y: typeof c.y === 'number' ? c.y : 50 }))
        .sort((a, b) => Math.abs(a.y - b.y) > 8 ? a.y - b.y : a.x - b.x)
        .map(s => s.c);
      const coX = PAD_X + 7.0;
      const coW = W - PAD_X - coX;
      callouts.forEach((c, idx) => {
        const y = 1.7 + idx * 0.95;
        slide.addShape('ellipse', { x: coX, y, w: 0.35, h: 0.35, fill: { color: ACCENT }, line: { color: ACCENT } });
        slide.addText(String(idx + 1), { x: coX, y, w: 0.35, h: 0.35, fontSize: 10, bold: true, fontFace: MONO, color: '061018', align: 'center', valign: 'middle' });
        slide.addText(c.name || '', { x: coX + 0.5, y, w: coW - 0.5, h: 0.3, fontSize: 13, bold: true, fontFace: FONT, color: TEXT });
        slide.addText(c.desc || '', { x: coX + 0.5, y: y + 0.32, w: coW - 0.5, h: 0.55, fontSize: 11, fontFace: FONT, color: '424A55' });
      });
    } else if (s.type === 'resources') {
      const cats = d.categories || [];
      const colN = Math.min(4, Math.max(2, cats.length));
      const catW = (W - 2 * PAD_X - 0.2 * (colN - 1)) / colN;
      const catH = H - 2.5;
      cats.forEach((c, idx) => {
        const col = idx % colN;
        const row = Math.floor(idx / colN);
        const x = PAD_X + col * (catW + 0.2);
        const y = 1.7 + row * (catH + 0.2);
        slide.addShape('roundRect', { x, y, w: catW, h: catH, fill: { color: 'F8F9FA' }, line: { color: 'F8F9FA' }, rectRadius: 0.1 });
        slide.addText(c.name || '', { x: x + 0.3, y: y + 0.25, w: catW - 1.2, h: 0.4, fontSize: 14, bold: true, fontFace: FONT, color: TEXT });
        slide.addText(c.count || '', { x: x + catW - 1.0, y: y + 0.25, w: 0.8, h: 0.4, fontSize: 11, fontFace: MONO, color: ACCENT, bold: true, align: 'right' });
        // 가이드라인 박스
        let yCursor = y + 0.75;
        if (c.guideline) {
          const gh = 0.95;
          slide.addShape('rect', { x: x + 0.3, y: yCursor, w: catW - 0.6, h: gh, fill: { color: 'E8F4FF' }, line: { color: 'B8DCFF', width: 0.5 } });
          slide.addText(c.guideline.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1'), { x: x + 0.4, y: yCursor + 0.05, w: catW - 0.8, h: gh - 0.1, fontSize: 9.5, fontFace: FONT, color: '1C4D70', italic: true });
          yCursor += gh + 0.1;
        }
        // 아이템들 — 새 형식(object)과 구 형식(string) 모두 지원
        const items = c.items || [];
        const itemBlocks = items.map((it, i) => {
          if (typeof it === 'string') return { text: '• ' + it, options: { fontSize: 10.5, color: '424A55' } };
          const lines = [];
          if (it.name) lines.push({ text: '• ' + it.name, options: { bold: true, fontSize: 10.5, color: '1C222B' } });
          if (it.spec) lines.push({ text: '\n    ' + it.spec, options: { fontSize: 9, fontFace: MONO, color: '586A75' } });
          if (it.example) lines.push({ text: '\n    예) ' + it.example, options: { fontSize: 9, italic: true, color: '7D8590' } });
          return lines;
        }).flat();
        if (itemBlocks.length) {
          slide.addText(itemBlocks, { x: x + 0.3, y: yCursor, w: catW - 0.6, h: y + catH - yCursor - 0.2, fontSize: 10.5, fontFace: FONT, color: '424A55', paraSpaceAfter: 4, valign: 'top' });
        }
      });
    } else if (s.type === 'balance-table') {
      const vars = d.vars || [];
      if (d.formula) {
        slide.addText(d.formula.replace(/`/g, ''), { x: PAD_X, y: 1.6, w: W - 2 * PAD_X, h: 0.45, fontSize: 13, fontFace: MONO, color: '1C4D70', fill: { color: 'F0F4F8' }, italic: true, valign: 'middle' });
      }
      const tableY = d.formula ? 2.15 : 1.7;
      const header = [
        { text: '변수', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '공식/정의', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '범위', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '기본값', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '민감도', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
      ];
      const body = vars.map(v => [
        { text: v.name || '', options: { fontFace: MONO, color: ACCENT, bold: true } },
        { text: (v.formula || '').replace(/`/g, ''), options: { fontFace: MONO } },
        { text: v.range || '' },
        { text: v.defaultValue || '' },
        { text: (v.sensitivity || v.notes || '').replace(/`/g, '') },
      ]);
      slide.addTable([header, ...body], { x: PAD_X, y: tableY, w: W - 2 * PAD_X, fontSize: 10, fontFace: FONT, color: TEXT, border: { type: 'solid', color: 'E3E7EB', pt: 0.5 }, rowH: 0.32 });
    } else if (s.type === 'state-machine') {
      const states = d.states || [];
      const transitions = d.transitions || [];
      const colW = (W - 2 * PAD_X - 0.3) / 2;
      // states 좌측
      slide.addText('STATES', { x: PAD_X, y: 1.6, w: colW, h: 0.3, fontSize: 11, fontFace: MONO, color: '7D8590', charSpacing: 1.6 });
      let y = 1.95;
      for (const st of states) {
        const fill = st.kind === 'initial' ? 'F4FAFF' : st.kind === 'final' ? 'F4FAF6' : st.kind === 'error' ? 'FDF5F5' : 'FFFFFF';
        const bd = st.kind === 'initial' ? ACCENT : st.kind === 'final' ? '3FB950' : st.kind === 'error' ? 'F85149' : '303A45';
        const h = 0.55;
        slide.addShape('roundRect', { x: PAD_X, y, w: colW, h, fill: { color: fill }, line: { color: bd, width: 1.5 }, rectRadius: 0.04 });
        slide.addText(`${st.id} · ${st.name} (${st.kind})`, { x: PAD_X + 0.15, y, w: colW - 0.3, h, fontSize: 11, bold: true, fontFace: MONO, color: '1C222B', valign: 'middle' });
        y += h + 0.06;
        if (y > H - 1.0) break;
      }
      // transitions 우측 — 표
      const trHeader = [
        { text: 'from', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: 'event', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: 'guard', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: 'to', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
      ];
      const trBody = transitions.map(t => [
        { text: t.from || '', options: { fontFace: MONO, color: ACCENT } },
        { text: t.event || '', options: { fontFace: MONO } },
        { text: (t.guard || '').replace(/`/g, '') },
        { text: t.to || '', options: { fontFace: MONO, color: ACCENT } },
      ]);
      slide.addText('TRANSITIONS', { x: PAD_X + colW + 0.3, y: 1.6, w: colW, h: 0.3, fontSize: 11, fontFace: MONO, color: '7D8590', charSpacing: 1.6 });
      slide.addTable([trHeader, ...trBody], { x: PAD_X + colW + 0.3, y: 1.95, w: colW, fontSize: 9, fontFace: FONT, color: TEXT, border: { type: 'solid', color: 'E3E7EB', pt: 0.5 }, rowH: 0.3 });
    } else if (s.type === 'api-contract') {
      slide.addShape('rect', { x: PAD_X, y: 1.6, w: W - 2 * PAD_X, h: 0.6, fill: { color: '1C222B' } });
      slide.addText(`${d.method || 'POST'}  ${d.endpoint || ''}`, { x: PAD_X + 0.2, y: 1.6, w: W - 2 * PAD_X - 2.5, h: 0.6, fontSize: 16, bold: true, fontFace: MONO, color: 'E6EDF3', valign: 'middle' });
      slide.addText(`auth: ${d.auth || 'bearer'}  ·  SLA ${d.slaMs || 200}ms`, { x: W - PAD_X - 2.3, y: 1.6, w: 2.1, h: 0.6, fontSize: 11, fontFace: MONO, color: ACCENT, align: 'right', valign: 'middle' });
      const colW = (W - 2 * PAD_X - 0.2) / 2;
      slide.addText('REQUEST', { x: PAD_X, y: 2.35, w: colW, h: 0.25, fontSize: 10, fontFace: MONO, color: '7D8590', charSpacing: 1.4 });
      slide.addText(d.request || '{}', { x: PAD_X, y: 2.6, w: colW, h: 1.6, fontSize: 10, fontFace: MONO, color: 'E6EDF3', fill: { color: '1C222B' } });
      slide.addText('RESPONSE', { x: PAD_X + colW + 0.2, y: 2.35, w: colW, h: 0.25, fontSize: 10, fontFace: MONO, color: '7D8590', charSpacing: 1.4 });
      slide.addText(d.response || '{}', { x: PAD_X + colW + 0.2, y: 2.6, w: colW, h: 1.6, fontSize: 10, fontFace: MONO, color: 'E6EDF3', fill: { color: '1C222B' } });
      // errors
      const errH = [
        { text: 'code', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: 'message', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: 'when', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
      ];
      const errB = (d.errors || []).map(e => [
        { text: e.code || '', options: { fontFace: MONO, color: 'F85149', bold: true } },
        { text: e.message || '', options: { fontFace: MONO } },
        { text: e.when || '' },
      ]);
      slide.addTable([errH, ...errB], { x: PAD_X, y: 4.35, w: W - 2 * PAD_X, fontSize: 10, fontFace: FONT, color: TEXT, border: { type: 'solid', color: 'E3E7EB', pt: 0.5 }, rowH: 0.3 });
    } else if (s.type === 'acceptance-criteria') {
      const story = d.userStory || {};
      slide.addShape('rect', { x: PAD_X, y: 1.6, w: W - 2 * PAD_X, h: 0.8, fill: { color: 'F8F9FA' }, line: { color: ACCENT, width: 0 } });
      slide.addShape('rect', { x: PAD_X, y: 1.6, w: 0.05, h: 0.8, fill: { color: ACCENT } });
      slide.addText(`AS A ${story.as || ''}  ·  I WANT ${story.want || ''}  ·  SO THAT ${story.soThat || ''}`, { x: PAD_X + 0.2, y: 1.6, w: W - 2 * PAD_X - 0.4, h: 0.8, fontSize: 12, fontFace: FONT, color: '1C222B', valign: 'middle' });
      let y = 2.6;
      for (const c of (d.criteria || [])) {
        const h = 1.4;
        slide.addShape('roundRect', { x: PAD_X, y, w: W - 2 * PAD_X, h, fill: { color: 'FFFFFF' }, line: { color: 'D0D7DE', width: 0.5 }, rectRadius: 0.05 });
        slide.addText(c.id || '', { x: PAD_X + 0.15, y: y + 0.1, w: 0.8, h: 0.25, fontSize: 11, fontFace: MONO, color: ACCENT, bold: true });
        slide.addText([
          { text: 'GIVEN ', options: { bold: true, color: '1C4D70', fontFace: MONO } }, { text: (c.given || '') + '\n', options: {} },
          { text: 'WHEN ', options: { bold: true, color: '9C6F00', fontFace: MONO } }, { text: (c.when || '').replace(/`/g, '') + '\n', options: {} },
          { text: 'THEN ', options: { bold: true, color: '166534', fontFace: MONO } }, { text: c.then || '', options: {} },
        ], { x: PAD_X + 0.15, y: y + 0.4, w: W - 2 * PAD_X - 0.3, h: h - 0.5, fontSize: 10.5, fontFace: FONT, color: '424A55' });
        y += h + 0.15;
        if (y > H - 1.0) break;
      }
    } else if (s.type === 'telemetry') {
      let y = 1.7;
      for (const e of (d.events || [])) {
        const propsCount = (e.props || []).length;
        const h = 0.5 + propsCount * 0.22 + 0.2;
        slide.addShape('roundRect', { x: PAD_X, y, w: W - 2 * PAD_X, h, fill: { color: 'FAFBFC' }, line: { color: 'D0D7DE', width: 0.5 }, rectRadius: 0.04 });
        slide.addText(e.name || '', { x: PAD_X + 0.15, y: y + 0.06, w: 4, h: 0.3, fontSize: 13, bold: true, fontFace: MONO, color: ACCENT });
        if (e.kpi) slide.addText(`KPI: ${e.kpi}`, { x: W - PAD_X - 3, y: y + 0.08, w: 2.8, h: 0.25, fontSize: 10, fontFace: MONO, color: '88DFB0', align: 'right' });
        if (e.when) slide.addText(e.when, { x: PAD_X + 0.15, y: y + 0.35, w: W - 2 * PAD_X - 0.3, h: 0.22, fontSize: 10, fontFace: FONT, italic: true, color: '586A75' });
        let py = y + 0.6;
        for (const p of (e.props || [])) {
          slide.addText(`  ${p.key} : ${p.type}${p.required ? ' *' : ''}${p.note ? ' — ' + p.note : ''}`, { x: PAD_X + 0.15, y: py, w: W - 2 * PAD_X - 0.3, h: 0.2, fontSize: 9.5, fontFace: MONO, color: '424A55' });
          py += 0.22;
        }
        y += h + 0.12;
        if (y > H - 0.8) break;
      }
    } else if (s.type === 'risk-register') {
      const risks = [...(d.risks || [])].sort((a, b) => ((b.impact || 0) * (b.likelihood || 0)) - ((a.impact || 0) * (a.likelihood || 0)));
      const header = [
        { text: 'ID', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '위험', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: 'I', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: 'L', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '점수', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '완화책', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '담당', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
        { text: '상태', options: { bold: true, color: 'FFFFFF', fill: { color: '1C222B' } } },
      ];
      const body = risks.map(r => {
        const sc = (r.impact || 0) * (r.likelihood || 0);
        const sevFill = sc >= 16 ? '8B0000' : sc >= 9 ? 'F85149' : sc >= 4 ? 'FFC107' : '3FB950';
        return [
          { text: r.id || '', options: { fontFace: MONO, color: 'FFFFFF', fill: { color: sevFill }, bold: true } },
          { text: r.title || '' },
          { text: String(r.impact || 0), options: { align: 'center', fontFace: MONO } },
          { text: String(r.likelihood || 0), options: { align: 'center', fontFace: MONO } },
          { text: String(sc), options: { bold: true, fontFace: MONO, align: 'center', color: sevFill } },
          { text: r.mitigation || '' },
          { text: r.owner || '', options: { fontFace: MONO } },
          { text: r.status || 'open', options: { fontFace: MONO, fontSize: 9 } },
        ];
      });
      slide.addTable([header, ...body], { x: PAD_X, y: 1.7, w: W - 2 * PAD_X, colW: [0.5, 2.6, 0.4, 0.4, 0.6, 3.0, 0.8, 0.8], fontSize: 9.5, fontFace: FONT, color: TEXT, border: { type: 'solid', color: 'E3E7EB', pt: 0.5 }, rowH: 0.3 });
    } else if (s.type === 'roadmap') {
      const phases = d.phases || [];
      const toMonth = (str) => {
        const m = /(\d{4})\D+(\d{1,2})/.exec(String(str || ''));
        return m ? parseInt(m[1], 10) * 12 + parseInt(m[2], 10) : 0;
      };
      const allMonths = phases.flatMap(p => [toMonth(p.start), toMonth(p.end)]).filter(n => n > 0);
      const minM = allMonths.length ? Math.min(...allMonths) : 0;
      const maxM = allMonths.length ? Math.max(...allMonths) : 0;
      const range = (maxM - minM) || 1;
      const trackX = PAD_X + 1.4, trackW = W - 2 * PAD_X - 1.4;
      // 간트
      let y = 1.8;
      for (const p of phases) {
        const start = toMonth(p.start), end = toMonth(p.end);
        const left = trackX + ((start - minM) / range) * trackW;
        const w = Math.max(0.3, ((end - start) / range) * trackW);
        slide.addText(p.name || '', { x: PAD_X, y: y - 0.05, w: 1.3, h: 0.3, fontSize: 11, fontFace: FONT, bold: true, color: TEXT, align: 'right' });
        slide.addShape('roundRect', { x: trackX, y, w: trackW, h: 0.25, fill: { color: 'F0F4F8' }, line: { color: 'F0F4F8' }, rectRadius: 0.12 });
        slide.addShape('roundRect', { x: left, y, w, h: 0.25, fill: { color: ACCENT }, line: { color: ACCENT_2 || '2B88C4' }, rectRadius: 0.12 });
        slide.addText(`${p.start || ''} – ${p.end || ''}`, { x: left + 0.1, y, w: w - 0.2, h: 0.25, fontSize: 8.5, fontFace: MONO, color: '061018', valign: 'middle', bold: true });
        y += 0.4;
        if (y > 4.5) break;
      }
      // 산출물 리스트
      let pY = y + 0.2;
      for (const p of phases) {
        if (pY > H - 0.6) break;
        const text = (p.deliverables || []).map(dl => '▸ ' + dl).join('  ');
        if (text) {
          slide.addText(`${p.name}: ${text}`, { x: PAD_X, y: pY, w: W - 2 * PAD_X, h: 0.28, fontSize: 10, fontFace: FONT, color: '424A55' });
          pY += 0.3;
        }
      }
    } else if (s.type === 'image-embed') {
      // 캡션 + 중앙 정렬된 참고 이미지
      const cap = d.caption || '';
      if (cap) {
        slide.addText(cap, { x: PAD_X, y: 1.5, w: W - 2 * PAD_X, h: 0.4, fontSize: 12, fontFace: FONT, color: TEXT2, italic: true });
      }
      const imgY = cap ? 2.0 : 1.7;
      const imgH = H - imgY - 0.7;
      if (d.imageSrc && typeof d.imageSrc === 'string' && d.imageSrc.startsWith('data:image/')) {
        slide.addImage({ data: d.imageSrc, x: PAD_X, y: imgY, w: W - 2 * PAD_X, h: imgH, sizing: { type: 'contain', w: W - 2 * PAD_X, h: imgH } });
      } else {
        slide.addShape('rect', { x: PAD_X, y: imgY, w: W - 2 * PAD_X, h: imgH, fill: { color: 'F3F5F7' }, line: { color: 'E3E7EB', width: 0.5 } });
        slide.addText('REFERENCE IMAGE\n(이미지 미생성)', { x: PAD_X, y: imgY, w: W - 2 * PAD_X, h: imgH, fontSize: 12, fontFace: MONO, color: '7D8590', align: 'center', valign: 'middle' });
        if (d.imagePrompt) {
          slide.addText(`prompt: ${d.imagePrompt}`, { x: PAD_X + 0.5, y: imgY + imgH - 0.45, w: W - 2 * PAD_X - 1, h: 0.35, fontSize: 9, fontFace: MONO, color: '7D8590', italic: true });
        }
      }
    } else if (s.type === 'sequence-diagram') {
      // 참여자 가로 배치 + 세로 lifeline + 메시지 화살표
      const parts = d.participants || [];
      const msgs = d.messages || [];
      const frameX = PAD_X, frameY = 1.6, frameW = W - 2 * PAD_X, frameH = H - 2.6;
      slide.addShape('roundRect', { x: frameX, y: frameY, w: frameW, h: frameH, fill: { color: 'FCFDFE' }, line: { color: 'E3E7EB', width: 0.5 }, rectRadius: 0.08 });
      if (parts.length === 0) {
        slide.addText('(참여자 없음)', { x: frameX, y: frameY + frameH / 2 - 0.2, w: frameW, h: 0.4, fontSize: 12, fontFace: FONT, color: '7D8590', align: 'center' });
      } else {
        const colW = (frameW - 0.6) / parts.length;
        const headY = frameY + 0.25;
        const headH = 0.55;
        const lifeTop = headY + headH + 0.1;
        const lifeBottom = frameY + frameH - 0.3;
        const partX = (i) => frameX + 0.3 + i * colW + colW / 2;
        // 참여자 박스 + lifeline
        parts.forEach((p, i) => {
          const cx = partX(i);
          let fill = 'FFFFFF', bd = '303A45', col = TEXT;
          if (p.kind === 'actor') { fill = ACCENT; col = '061018'; bd = ACCENT; }
          else if (p.kind === 'service') { fill = 'ECF3FF'; bd = '58A6FF'; }
          else if (p.kind === 'data') { fill = 'F0F9EB'; bd = '3FB950'; }
          slide.addShape('roundRect', { x: cx - colW / 2 + 0.15, y: headY, w: colW - 0.3, h: headH, fill: { color: fill }, line: { color: bd, width: 1.5 }, rectRadius: 0.06 });
          slide.addText(p.name || p.id || '', { x: cx - colW / 2 + 0.15, y: headY, w: colW - 0.3, h: headH, fontSize: 12, bold: true, fontFace: FONT, color: col, align: 'center', valign: 'middle' });
          // lifeline (dashed)
          slide.addShape('line', { x: cx, y: lifeTop, w: 0, h: lifeBottom - lifeTop, line: { color: 'A0A8B2', width: 0.8, dashType: 'dash' } });
        });
        // 메시지: 위에서 아래로 배치, 가로 화살표
        const msgGap = msgs.length > 0 ? Math.min(0.45, (lifeBottom - lifeTop - 0.3) / msgs.length) : 0;
        msgs.forEach((m, i) => {
          const fromI = parts.findIndex(p => p.id === m.from);
          const toI = parts.findIndex(p => p.id === m.to);
          if (fromI < 0 || toI < 0) return;
          const y = lifeTop + 0.2 + i * msgGap;
          const x1 = partX(fromI);
          const x2 = partX(toI);
          const dashed = (m.kind === 'async' || m.kind === 'return');
          slide.addShape('line', { x: Math.min(x1, x2), y, w: Math.abs(x2 - x1), h: 0, line: { color: '303A45', width: 1.2, dashType: dashed ? 'dash' : undefined, endArrowType: x2 > x1 ? 'triangle' : undefined, beginArrowType: x2 < x1 ? 'triangle' : undefined } });
          if (m.label) {
            slide.addText(m.label, { x: Math.min(x1, x2), y: y - 0.22, w: Math.abs(x2 - x1) || 1.5, h: 0.22, fontSize: 9, fontFace: MONO, color: '303A45', align: 'center' });
          }
        });
      }
    } else if (s.type === 'class-diagram') {
      // 클래스 박스(col/row) + 관계선
      const classes = d.classes || [];
      const relations = d.relations || [];
      const frameX = PAD_X, frameY = 1.6, frameW = W - 2 * PAD_X, frameH = H - 2.6;
      slide.addShape('roundRect', { x: frameX, y: frameY, w: frameW, h: frameH, fill: { color: 'FCFDFE' }, line: { color: 'E3E7EB', width: 0.5 }, rectRadius: 0.08 });
      const cols = Math.max(2, Math.min(4, Math.max(0, ...classes.map(c => c.col ?? 0)) + 1));
      const rows = Math.max(1, Math.max(0, ...classes.map(c => c.row ?? 0)) + 1);
      const px = 0.3, py = 0.25;
      const cw = (frameW - 2 * px - (cols - 1) * 0.4) / cols;
      const baseH = Math.max(1.2, (frameH - 2 * py - (rows - 1) * 0.4) / rows);
      const layouts = {};
      classes.forEach(c => {
        const col = Math.min(cols - 1, Math.max(0, c.col ?? 0));
        const row = Math.min(rows - 1, Math.max(0, c.row ?? 0));
        const x = frameX + px + col * (cw + 0.4);
        const y = frameY + py + row * (baseH + 0.4);
        layouts[c.id] = { x, y, w: cw, h: baseH };
      });
      // 관계선 (단순 직선 + 라벨)
      const RELATION_DASH = { inherit: undefined, implement: 'dash', compose: undefined, aggregate: undefined, assoc: undefined, depend: 'dash' };
      relations.forEach(r => {
        const a = layouts[r.from], b = layouts[r.to];
        if (!a || !b) return;
        const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
        const bx = b.x + b.w / 2, by = b.y + b.h / 2;
        slide.addShape('line', { x: Math.min(ax, bx), y: Math.min(ay, by), w: Math.abs(bx - ax), h: Math.abs(by - ay), line: { color: '303A45', width: 1.2, dashType: RELATION_DASH[r.kind], endArrowType: 'triangle' } });
        if (r.label) {
          const lx = (ax + bx) / 2, ly = (ay + by) / 2;
          slide.addText(r.label, { x: lx - 0.5, y: ly - 0.12, w: 1, h: 0.24, fontSize: 9, fontFace: MONO, color: '303A45', align: 'center', fill: { color: 'FFFFFF' } });
        }
      });
      // 클래스 박스
      classes.forEach(c => {
        const l = layouts[c.id];
        if (!l) return;
        slide.addShape('roundRect', { x: l.x, y: l.y, w: l.w, h: l.h, fill: { color: 'FFFFFF' }, line: { color: '303A45', width: 1.5 }, rectRadius: 0.04 });
        // header
        slide.addShape('rect', { x: l.x, y: l.y, w: l.w, h: 0.55, fill: { color: 'F0F4F8' }, line: { color: '303A45', width: 0 } });
        if (c.stereotype) {
          slide.addText(c.stereotype, { x: l.x, y: l.y + 0.05, w: l.w, h: 0.2, fontSize: 8, fontFace: MONO, color: '586A75', italic: true, align: 'center' });
        }
        slide.addText(c.name || c.id || '', { x: l.x, y: l.y + (c.stereotype ? 0.22 : 0.1), w: l.w, h: 0.35, fontSize: 13, bold: true, fontFace: FONT, color: TEXT, align: 'center' });
        // attrs
        const attrs = c.attrs || [];
        if (attrs.length) {
          const attrText = attrs.map(a => ({ text: a, options: {} }));
          slide.addText(attrText, { x: l.x + 0.1, y: l.y + 0.6, w: l.w - 0.2, h: Math.min(0.7, attrs.length * 0.2), fontSize: 9, fontFace: MONO, color: TEXT, paraSpaceAfter: 1 });
        }
        // methods
        const methods = c.methods || [];
        if (methods.length) {
          const methStart = l.y + 0.6 + Math.min(0.7, attrs.length * 0.2) + 0.05;
          const methText = methods.map(m => ({ text: m, options: {} }));
          slide.addText(methText, { x: l.x + 0.1, y: methStart, w: l.w - 0.2, h: l.h - (methStart - l.y) - 0.05, fontSize: 9, fontFace: MONO, color: TEXT, paraSpaceAfter: 1 });
        }
      });
    } else if (s.type === 'diagram') {
      // Render diagram nodes laid out by col/row, with edges
      const nodes = d.nodes || [];
      const edges = d.edges || [];
      // Frame
      const frameX = PAD_X, frameY = 1.6, frameW = W - 2 * PAD_X, frameH = H - 2.6;
      slide.addShape('roundRect', { x: frameX, y: frameY, w: frameW, h: frameH, fill: { color: 'FCFDFE' }, line: { color: 'E3E7EB', width: 0.5 }, rectRadius: 0.08 });
      // Compute layout
      const cols = Math.max(2, Math.min(4, Math.max(...nodes.map(n => n.col ?? 0)) + 1));
      const rows = Math.max(1, Math.max(...nodes.map(n => n.row ?? 0)) + 1);
      const px = 0.3, py = 0.25;
      const nodeW = (frameW - 2 * px - (cols - 1) * 0.35) / cols;
      const nodeH = 0.7;
      const rowSpace = rows > 1 ? (frameH - 2 * py - nodeH) / (rows - 1) : 0;
      const layouts = {};
      nodes.forEach(n => {
        const c = Math.min(cols - 1, Math.max(0, n.col ?? 0));
        const r = Math.min(rows - 1, Math.max(0, n.row ?? 0));
        const x = frameX + px + c * (nodeW + 0.35);
        const y = frameY + py + r * Math.max(rowSpace, nodeH + 0.4);
        layouts[n.id] = { x, y, w: nodeW, h: nodeH };
      });
      // Draw edges first (so they go under nodes)
      edges.forEach(e => {
        const a = layouts[e.from], b = layouts[e.to];
        if (!a || !b) return;
        const ax = a.x + a.w / 2, ay = a.y + a.h;
        const bx = b.x + b.w / 2, by = b.y;
        const lineOpts = { color: '303A45', width: e.kind === 'thin' ? 0.8 : 1.5, endArrowType: 'triangle' };
        if (e.kind === 'dashed') lineOpts.dashType = 'dash';
        if (Math.abs(ax - bx) < 0.05) {
          slide.addShape('line', { x: ax, y: ay, w: 0, h: by - ay - 0.05, line: lineOpts });
        } else {
          const midY = (ay + by) / 2;
          slide.addShape('line', { x: ax, y: ay, w: 0, h: midY - ay, line: { color: '303A45', width: e.kind === 'thin' ? 0.8 : 1.5, dashType: e.kind === 'dashed' ? 'dash' : undefined } });
          slide.addShape('line', { x: Math.min(ax, bx), y: midY, w: Math.abs(bx - ax), h: 0, line: { color: '303A45', width: e.kind === 'thin' ? 0.8 : 1.5, dashType: e.kind === 'dashed' ? 'dash' : undefined } });
          slide.addShape('line', { x: bx, y: midY, w: 0, h: by - midY - 0.05, line: lineOpts });
        }
        if (e.label) {
          const lx = (ax + bx) / 2, ly = (ay + by) / 2;
          slide.addText(e.label, { x: lx - 0.7, y: ly - 0.13, w: 1.4, h: 0.26, fontSize: 10, fontFace: MONO, color: '303A45', align: 'center', fill: { color: 'FFFFFF' }, bold: true });
        }
      });
      // Draw nodes
      nodes.forEach(n => {
        const l = layouts[n.id];
        if (!l) return;
        let fill = 'FFFFFF', col = TEXT, bd = '303A45';
        if (n.kind === 'start') { fill = ACCENT; col = '061018'; bd = ACCENT; }
        else if (n.kind === 'end') { fill = '1C222B'; col = 'E6EDF3'; bd = '1C222B'; }
        else if (n.kind === 'decision') { fill = 'FFF8DC'; bd = 'D29922'; }
        else if (n.kind === 'service') { fill = 'ECF3FF'; bd = '58A6FF'; }
        else if (n.kind === 'data') { fill = 'F0F9EB'; bd = '3FB950'; }
        slide.addShape('roundRect', { x: l.x, y: l.y, w: l.w, h: l.h, fill: { color: fill }, line: { color: bd, width: 1.5 }, rectRadius: 0.06 });
        slide.addText(n.label || '', { x: l.x, y: l.y + (n.sub ? 0.05 : 0.05), w: l.w, h: n.sub ? 0.4 : l.h, fontSize: 13, bold: true, fontFace: FONT, color: col, align: 'center', valign: 'middle' });
        if (n.sub) {
          slide.addText(n.sub, { x: l.x, y: l.y + 0.42, w: l.w, h: 0.25, fontSize: 9, fontFace: MONO, color: col, align: 'center', charSpacing: 1.2 });
        }
      });
    }

    addFooter(slide, d.section || '', d.sectionName || SLIDE_LABELS[s.type] || '', page);
  }

  await pptx.writeFile({ fileName: `${project.title || 'GDD'}.pptx` });
}

Object.assign(window, { DocumentView, exportPptx });


// ============================================================
// File: command-palette.jsx
// ============================================================
/* === Command Palette (Cmd/Ctrl+K) ===
 * 컨셉/기획서/슬라이드 + 액션을 fuzzy 검색.
 * 키보드 ↑↓ Enter Esc로 네비게이션.
 *
 * 노출: window.CommandPalette
 */

/** Simple fuzzy: 모든 검색 토큰이 텍스트에 순서 무관하게 포함되면 매칭. 토큰 인접도로 가중치 */
function fuzzyScore(text, query) {
  if (!query) return 1;
  const t = (text || '').toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 1;
  if (t.includes(q)) return 10 + (1 / Math.max(1, t.length)); // exact substring 가장 강함
  // 토큰 분리
  const tokens = q.split(/\s+/).filter(Boolean);
  let score = 0;
  let lastIdx = -1;
  for (const tok of tokens) {
    const i = t.indexOf(tok);
    if (i === -1) return 0;
    score += 1;
    if (lastIdx >= 0 && i > lastIdx) score += 0.1; // 순서 유지 보너스
    lastIdx = i + tok.length;
  }
  return score;
}

/** state로부터 검색 인덱스 구축 */
function buildSearchIndex(state) {
  const items = [];
  for (const c of (state.concepts || [])) {
    items.push({
      kind: 'concept',
      id: c.id,
      title: c.title || '(제목 없음)',
      sub: c.subtitle || '',
      badge: c.badge || 'CONCEPT',
      goto: { type: 'concept', id: c.id },
      searchText: [c.title, c.subtitle, c.badge, c.author, (c.keyUsp || []).join(' ')].filter(Boolean).join(' '),
    });
    for (const rp of (c.recommendedPlans || [])) {
      items.push({
        kind: 'plan',
        id: c.id + ':' + rp.id,
        title: rp.title || '(제목 없음)',
        sub: '필요 기획서 · ' + (c.title || ''),
        badge: rp.linkedGddId ? '작성됨' : '대기',
        goto: rp.linkedGddId
          ? { type: 'gdd', id: rp.linkedGddId }
          : { type: 'concept', id: c.id },
        searchText: [rp.title, rp.description, c.title].filter(Boolean).join(' '),
      });
    }
  }
  for (const p of (state.projects || [])) {
    items.push({
      kind: 'gdd',
      id: p.id,
      title: p.title || '(제목 없음)',
      sub: p.subtitle || '',
      badge: p.badge || 'GDD',
      goto: { type: 'gdd', id: p.id },
      searchText: [p.title, p.subtitle, p.badge, p.team, p.author].filter(Boolean).join(' '),
    });
    (p.slides || []).forEach((s, idx) => {
      const d = s.data || {};
      // 슬라이드 핵심 텍스트만 인덱싱 (너무 길어지면 검색 노이즈)
      const text = [
        d.title, d.tagline, d.subtitle, d.name,
        ...(d.cards || []).flatMap(c => [c.head, c.desc]),
        ...(d.rows || []).flatMap(r => [r.term, r.def, r.field]),
        ...(d.blocks || []).flatMap(b => [b.head, ...(b.items || [])]),
        ...(d.entries || []).flatMap(e => [e.name, e.sub]),
        ...(d.nodes || []).map(n => n.label),
        ...(d.callouts || []).flatMap(c => [c.name, c.desc]),
        ...(d.categories || []).flatMap(c => [c.name, ...(c.items || [])]),
      ].filter(Boolean).join(' ').slice(0, 600);
      items.push({
        kind: 'slide',
        id: p.id + ':' + s.id,
        title: d.title || `슬라이드 ${idx + 1}`,
        sub: (p.title || '') + ' · ' + (window.SLIDE_LABELS?.[s.type] || s.type),
        badge: (idx + 1).toString().padStart(2, '0'),
        goto: { type: 'gdd', id: p.id, slideIdx: idx },
        searchText: [d.title, p.title, text].filter(Boolean).join(' '),
      });
    });
  }
  return items;
}

function CommandPalette({ open, onClose, state, onGoto, actions }) {
  const [query, setQuery] = React.useState('');
  const [activeIdx, setActiveIdx] = React.useState(0);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const index = React.useMemo(() => open ? buildSearchIndex(state || {}) : [], [open, state]);

  const results = React.useMemo(() => {
    const allActions = (actions || []).map(a => ({
      kind: 'action',
      id: 'action:' + a.id,
      title: a.title,
      sub: a.sub || '명령',
      badge: a.shortcut || 'CMD',
      goto: null,
      action: a.run,
      searchText: [a.title, a.sub, (a.keywords || []).join(' ')].filter(Boolean).join(' '),
    }));
    const pool = [...allActions, ...index];
    if (!query.trim()) {
      // 빈 쿼리: 액션 먼저, 그 다음 컨셉, GDD 일부
      return pool.slice(0, 30);
    }
    const scored = pool
      .map(it => ({ it, score: fuzzyScore(it.searchText + ' ' + it.title, query) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40)
      .map(x => x.it);
    return scored;
  }, [index, query, actions]);

  React.useEffect(() => { setActiveIdx(0); }, [query]);

  // 활성 항목 자동 스크롤
  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.children[activeIdx];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(results.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const sel = results[activeIdx];
      if (sel) pick(sel);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const pick = (item) => {
    if (item.action) {
      try { item.action(); } catch (e) { console.error(e); }
    } else if (item.goto) {
      onGoto(item.goto);
    }
    onClose();
  };

  if (!open) return null;

  const kindLabel = {
    concept: '컨셉', gdd: '기획서', slide: '슬라이드', plan: '필요 기획서', action: '명령',
  };
  const kindColor = {
    concept: 'var(--accent)', gdd: '#7ee787', slide: '#d29922', plan: '#b1bac4', action: '#ff8ccb',
  };

  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk-panel" onClick={e => e.stopPropagation()}>
        <div className="cmdk-input-row">
          <span className="cmdk-input-icon">⌕</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="컨셉·기획서·슬라이드 검색 또는 명령 실행…"
          />
          <span className="cmdk-input-hint">Esc</span>
        </div>
        <div className="cmdk-list" ref={listRef}>
          {results.length === 0 && (
            <div className="cmdk-empty">결과 없음</div>
          )}
          {results.map((it, i) => (
            <div
              key={it.id}
              className={'cmdk-item ' + (i === activeIdx ? 'active' : '')}
              onClick={() => pick(it)}
              onMouseEnter={() => setActiveIdx(i)}
            >
              <span className="cmdk-kind" style={{ color: kindColor[it.kind] }}>
                {kindLabel[it.kind] || it.kind}
              </span>
              <div className="cmdk-text">
                <div className="cmdk-title">{it.title}</div>
                {it.sub && <div className="cmdk-sub">{it.sub}</div>}
              </div>
              <span className="cmdk-badge">{it.badge}</span>
            </div>
          ))}
        </div>
        <div className="cmdk-footer">
          <span>↑↓ 이동</span>
          <span>↵ 선택</span>
          <span>Esc 닫기</span>
        </div>
      </div>
    </div>
  );
}

window.CommandPalette = CommandPalette;
window.buildSearchIndex = buildSearchIndex;


// ============================================================
// File: app.jsx
// ============================================================
/* === Main App === */

const { useState, useEffect, useRef, useCallback } = React;

/* Persistent state — IndexedDB 기반 (window.gddStorage) + localStorage 폴백 + emergency 슬롯
 * - loadState(): async. 우선 emergency 확인 후 main 로드. 없으면 localStorage 마이그레이션.
 * - saveState(): async + 자동 디바운스 + 이미지 분리 저장.
 */
const LEGACY_STORAGE_KEY = 'gdd-maker-state-v2';

/**
 * 레거시 값 마이그레이션.
 * 이전 시드 데이터에 박혀있던 "TEAM" / "TEAM_7" / "TEAM_?" 같은 placeholder badge 와
 * "작성자" placeholder author 를 새 디폴트("" / "김기획")로 일괄 교체.
 *
 * 불변성 유지: 원본 state 는 건드리지 않고 새 객체를 반환.
 * 안전성: state 또는 하위 배열이 없어도 비-throw.
 */
function migrateLegacyValues(state) {
  if (!state || typeof state !== 'object') return state;
  const STALE_BADGES = new Set(['TEAM', 'TEAM_7', 'TEAM_?', 'AI', 'MVP']);
  const STALE_AUTHORS = new Set(['작성자', 'Author', 'AUTHOR', '']);
  const cleanBadge = (b) => (STALE_BADGES.has(String(b || '').trim()) ? '' : b);
  const cleanAuthor = (a) => (STALE_AUTHORS.has(String(a || '').trim()) ? '김기획' : a);

  const next = { ...state };

  if (Array.isArray(state.concepts)) {
    next.concepts = state.concepts.map((c) => {
      if (!c || typeof c !== 'object') return c;
      return { ...c, badge: cleanBadge(c.badge), author: cleanAuthor(c.author) };
    });
  }

  if (Array.isArray(state.projects)) {
    next.projects = state.projects.map((p) => {
      if (!p || typeof p !== 'object') return p;
      return { ...p, team: cleanBadge(p.team), author: cleanAuthor(p.author) };
    });
  }

  return next;
}

async function loadStateAsync() {
  // 1) emergency 슬롯 — 비정상 종료 시 보존된 상태
  if (window.gddStorage) {
    try {
      const hasE = await window.gddStorage.hasEmergency();
      if (hasE) {
        const recover = confirm('이전 세션이 비정상 종료되었습니다.\n비상 백업으로 복구할까요?');
        if (recover) {
          const em = await window.gddStorage.loadEmergency();
          await window.gddStorage.clearEmergency();
          if (em) return migrateLegacyValues(em);
        } else {
          await window.gddStorage.clearEmergency();
        }
      }
      // 2) main 슬롯 (IndexedDB)
      const main = await window.gddStorage.loadState('main');
      if (main && main.projects) return migrateLegacyValues(main);
      // 3) legacy localStorage 마이그레이션 (한 번만)
      const migrated = await window.gddStorage.migrateFromLocalStorage();
      if (migrated) {
        const loaded = await window.gddStorage.loadState('main');
        return migrateLegacyValues(loaded);
      }
    } catch (e) {
      console.error('IndexedDB 로드 실패, localStorage 폴백', e);
    }
  }
  // 4) 최종 폴백: 기존 localStorage 직접
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.projects) return migrateLegacyValues(parsed);
    }
  } catch (e) {}
  return null;
}

let _saveTimer = null;
function saveStateDebounced(state) {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(async () => {
    if (window.gddStorage) {
      try {
        await window.gddStorage.saveState(state, 'main');
        return;
      } catch (e) {
        console.error('IndexedDB 저장 실패, localStorage 폴백', e);
      }
    }
    try {
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* quota 초과 등 — 사용자에게 알릴 방법 없음, 콘솔만 */ }
  }, 600);
}

/* Apply enhanced renderers (override base ones) */
if (window.SLIDE_RENDERERS) {
  if (window.EnhancedFlowSlide) window.SLIDE_RENDERERS['flow'] = window.EnhancedFlowSlide;
  if (window.DiagramSlide) window.SLIDE_RENDERERS['diagram'] = window.DiagramSlide;
  if (window.SequenceDiagramSlide) window.SLIDE_RENDERERS['sequence-diagram'] = window.SequenceDiagramSlide;
  if (window.ClassDiagramSlide) window.SLIDE_RENDERERS['class-diagram'] = window.ClassDiagramSlide;
}
if (window.SLIDE_LABELS) {
  window.SLIDE_LABELS['diagram'] = '다이어그램';
  window.SLIDE_LABELS['sequence-diagram'] = '시퀀스 다이어그램';
  window.SLIDE_LABELS['class-diagram'] = '클래스 다이어그램';
}

/* Tweaks defaults */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "cyan",
  "showThumbs": true
}/*EDITMODE-END*/;

const THEMES = {
  cyan: {
    label: 'Cyan Blue',
    accent: '#4cc2ff',
    accent2: '#2b88c4',
    accentStrong: '#79d3ff',
    accentSoft: 'rgba(76, 194, 255, 0.12)',
  },
  green: {
    label: 'Terminal Green',
    accent: '#3fb950',
    accent2: '#2d8240',
    accentStrong: '#7ee787',
    accentSoft: 'rgba(63, 185, 80, 0.12)',
  },
  magenta: {
    label: 'Cyber Magenta',
    accent: '#ff5eb8',
    accent2: '#c43e8b',
    accentStrong: '#ff8ccb',
    accentSoft: 'rgba(255, 94, 184, 0.12)',
  },
};

/* Toast helper */
const ToastCtx = React.createContext(null);
function ToastHost({ children }) {
  const [toasts, setToasts] = useState([]);
  // useCallback 으로 식별자 고정 — context 소비자가 매 렌더마다 새 함수를 잡지 않도록 한다.
  const push = useCallback((text, kind = '') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, text, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-host">
        {toasts.map(t => <div className={'toast ' + t.kind} key={t.id}>{t.text}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = () => React.useContext(ToastCtx);

/* === Top bar === */
function TopBar({ project, view, setView, onDownload, isDownloading, onRename, tweaks, isConcept, onOpenSettings, hasApiKey, onExport, onImport, onOpenCmdK, onSaveSnapshot, onOpenSnapshots, onOpenQualityGate, usageTick }) {
  // 품질 점수 — 슬라이드가 있을 때만 계산
  const qScore = (!isConcept && project && window.gddQualityGate)
    ? window.gddQualityGate.scoreProject(project)
    : null;
  const qColor = qScore ? (qScore.total >= 80 ? '#3fb950' : qScore.total >= 60 ? '#d29922' : '#f85149') : null;
  // 비용 배지 — 오늘 사용 + 누계
  const stats = window.gddUsage ? window.gddUsage.getStats() : null;
  const fmt = window.gddUsage ? window.gddUsage.formatUSD : (n) => '$' + (n || 0).toFixed(2);
  const budget = window.gddUsage ? window.gddUsage.isOverBudget() : { daily: false, monthly: false };
  const badgeClass = budget.daily || budget.monthly ? 'usage-badge over' : (stats && stats.todayCost > 0.5 ? 'usage-badge warn' : 'usage-badge');

  return (
    <div className="topbar">
      <div className="brand">
        <div className="logo">G</div>
        <div className="name">GDD 메이커</div>
        <div className="ver">v0.2 beta</div>
      </div>
      <div className="crumb">
        {/* 카테고리: 컨셉 또는 GDD. 팀 표기는 project.team 이 실제 값일 때만 노출. */}
        <span className="sep">/</span>
        <span>{isConcept ? '컨셉' : '기획서'}</span>
        {!isConcept && project?.team && project.team.trim() && !['TEAM', 'TEAM_7', 'AI', 'MVP'].includes(project.team) && (
          <>
            <span className="sep">/</span>
            <span>{project.team}</span>
          </>
        )}
        <span className="sep">/</span>
        <span className="doc">{project?.title || '선택 없음'}</span>
      </div>
      <div className="spacer"></div>

      {/* 명령 팔레트 (Cmd+K) */}
      <button
        className="btn ghost"
        onClick={onOpenCmdK}
        title="명령 팔레트 (Cmd/Ctrl + K)"
        style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: 11 }}
      >
        ⌕ <span style={{ marginLeft: 4, opacity: 0.7 }}>⌘K</span>
      </button>

      {/* 비용 배지 */}
      {stats && (
        <div
          className={badgeClass}
          onClick={onOpenSettings}
          title={`오늘 ${fmt(stats.todayCost)} / 이번 달 ${fmt(stats.monthCost)} / 누계 ${fmt(stats.totalCost)} (${stats.totalCalls}회)`}
        >
          <span className="dot"></span>
          <span>오늘 {fmt(stats.todayCost)}</span>
          <span style={{ opacity: 0.5, margin: '0 4px' }}>·</span>
          <span>월 {fmt(stats.monthCost)}</span>
        </div>
      )}

      {/* 내보내기/불러오기 */}
      <button className="btn ghost" onClick={onExport} title="프로젝트 내보내기 (.gddproject)" style={{ padding: '6px 10px', fontSize: 11 }}>
        ↓ 내보내기
      </button>
      <button className="btn ghost" onClick={onImport} title="프로젝트 불러오기" style={{ padding: '6px 10px', fontSize: 11 }}>
        ↑ 불러오기
      </button>

      <button
        className="btn ghost"
        onClick={onOpenSettings}
        title="Gemini API 키 설정"
        style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: 11 }}
      >
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: hasApiKey ? 'var(--ok)' : 'var(--warn)',
          marginRight: 6, display: 'inline-block',
        }}></span>
        Gemini {hasApiKey ? '연결됨' : '키 설정'}
      </button>

      {!isConcept && (
        <div className="view-toggle">
          <button className={view === 'slide' ? 'active' : ''} onClick={() => setView('slide')}>
            <span style={{ marginRight: 4 }}>▭</span> 슬라이드
          </button>
          <button className={view === 'doc' ? 'active' : ''} onClick={() => setView('doc')}>
            <span style={{ marginRight: 4 }}>▤</span> 문서
          </button>
        </div>
      )}

      {isConcept ? (
        <button className="btn ghost" disabled style={{ opacity: 0.5 }}>
          컨셉 (PPTX 비대상)
        </button>
      ) : (
        <>
          {/* 품질 점수 배지 — 클릭 시 점수표 모달 */}
          {qScore && (
            <button
              className="btn ghost"
              onClick={onOpenQualityGate}
              title={`품질 점수: ${qScore.total}/100 (${qScore.grade}). 클릭하여 상세 확인.`}
              style={{
                padding: '6px 10px', fontSize: 11,
                color: qColor, borderColor: qColor,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              🎯 <strong style={{ color: qColor, fontWeight: 800 }}>{qScore.total}</strong>
              <span style={{ color: qColor, marginLeft: 4, opacity: 0.8 }}>{qScore.grade}</span>
            </button>
          )}
          <button className="btn ghost" onClick={onSaveSnapshot} title="현재 기획서를 스냅샷으로 저장" disabled={!project} style={{ padding: '6px 10px', fontSize: 11 }}>
            📸 스냅샷
          </button>
          {(project?.snapshots || []).length > 0 && (
            <button className="btn ghost" onClick={onOpenSnapshots} title="스냅샷 히스토리" style={{ padding: '6px 10px', fontSize: 11 }}>
              ⌖ {(project.snapshots || []).length}
            </button>
          )}
          <button
            className="btn primary"
            onClick={() => {
              if (qScore && qScore.total < 70 && !confirm(`품질 점수 ${qScore.total}/100 (${qScore.grade}). 보강 권장 항목이 있습니다. 그래도 다운로드할까요?`)) return;
              onDownload();
            }}
            disabled={isDownloading || !project}
          >
            {isDownloading ? '생성 중…' : <>↓ PPTX 다운로드</>}
          </button>
        </>
      )}
    </div>
  );
}

/* === 장르 템플릿용 — 슬라이드 type 별 최소 시드 (사용자가 AI 로 채우기 전 placeholder) === */
const SLIDE_TEMPLATES_FOR_GENRE = {
  'cover': { product: '신규 게임', title: '게임 제목', subtitle: '한 줄 부제', team: '', author: '김기획', date: '26.05.23' },
  'history': { title: '문서 이력', rows: [{ ver: 'Ver00', date: '26.05.23', page: '-', content: '최초 작성', author: '김기획' }] },
  'toc': { title: 'CONTENTS', entries: [{ num: '01', name: '개요', sub: '게임 컨셉 및 용어' }] },
  'section-divider': { num: '01', title: '섹션', subtitle: '설명', imagePrompt: '' },
  'intent': { section: '01', sectionName: '개요', title: '기획 의도', tagline: '', cards: [] },
  'terms': { section: '01', sectionName: '개요', title: '용어 정의', rows: [] },
  'rules': { section: '02', sectionName: '시스템', title: '규칙', blocks: [] },
  'data-table': { section: '04', sectionName: '데이터', title: '테이블', columns: [{ key: 'field', label: 'Field', width: '22%' }, { key: 'type', label: 'Type', width: '14%' }, { key: 'desc', label: '설명' }], rows: [] },
  'flow': { section: '02', sectionName: '플로우', title: '플로우 차트', direction: '', lines: 1, nodes: [] },
  'diagram': { section: '02', sectionName: '시스템 구조', title: '시스템 구조', nodes: [], edges: [] },
  'sequence-diagram': { section: '02', sectionName: '시퀀스', title: '시퀀스 다이어그램', participants: [], messages: [] },
  'class-diagram': { section: '02', sectionName: '클래스', title: '클래스 다이어그램', classes: [], relations: [] },
  'state-machine': { section: '02', sectionName: '상태 머신', title: '상태 머신', states: [], transitions: [] },
  'ui-design': { section: '03', sectionName: 'UI/UX', title: '화면 설계', imagePrompt: '', callouts: [] },
  'image-embed': { section: '03', sectionName: '참고 이미지', title: '참고 이미지', caption: '', imagePrompt: '' },
  'resources': { section: '05', sectionName: '필요 리소스', title: '필요 리소스', categories: [] },
  'balance-table': { section: '04', sectionName: '밸런싱', title: '수치 밸런싱', formula: '', vars: [], curve: null },
  'api-contract': { section: '02', sectionName: 'API 계약', title: 'API 계약', endpoint: '/api/...', method: 'POST', auth: 'bearer', request: '', response: '', errors: [], slaMs: 200, idempotencyKey: '', notes: '' },
  'acceptance-criteria': { section: '03', sectionName: '수락 기준', title: '수락 기준', userStory: { as: '', want: '', soThat: '' }, criteria: [] },
  'telemetry': { section: '04', sectionName: '텔레메트리', title: '텔레메트리', events: [], funnels: [] },
  'risk-register': { section: '06', sectionName: '위험 등기부', title: '위험 등기부', risks: [] },
  'roadmap': { section: '06', sectionName: '로드맵', title: '로드맵', phases: [] },
};

/* === downloadBlob 헬퍼 — 텍스트/JSON/YAML 등을 즉시 다운로드 === */
function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime || 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* === Quality Gate Modal — GDD 점수표 + 보강 권장 === */
function QualityGateModal({ project, onClose, onJump }) {
  const score = React.useMemo(() => {
    if (!project || !window.gddQualityGate) return null;
    return window.gddQualityGate.scoreProject(project);
  }, [project]);
  const suggestions = React.useMemo(() => {
    if (!score) return [];
    return window.gddQualityGate.suggestImprovements(project, score);
  }, [project, score]);
  if (!score) return null;
  const gradeColor = score.total >= 80 ? '#3fb950' : score.total >= 60 ? '#d29922' : '#f85149';
  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="form-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <header>
          <h2>🎯 GDD 품질 점수</h2>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>
        <div className="body" style={{ maxHeight: '72vh', overflow: 'auto' }}>
          {/* 전체 점수 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '14px 18px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16 }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', border: '6px solid ' + gradeColor, display: 'grid', placeItems: 'center', flexDirection: 'column' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: gradeColor, fontFamily: 'JetBrains Mono, monospace' }}>{score.total}</div>
              <div style={{ fontSize: 11, color: gradeColor, marginTop: -4 }}>{score.grade}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                {score.canDownload ? '✓ 개발 가능 수준 (70+)' : '⚠ 보강이 필요한 상태 (70점 미만)'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace' }}>{score.summary}</div>
            </div>
          </div>
          {/* 차원별 점수 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {score.dims.map((d, i) => {
              const pct = d.points / d.max;
              const c = pct >= 0.7 ? '#3fb950' : pct >= 0.4 ? '#d29922' : '#f85149';
              return (
                <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{d.label}</span>
                    <span style={{ fontSize: 12, color: c, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{d.points} / {d.max}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct * 100}%`, background: c, transition: 'width 0.3s' }}></div>
                  </div>
                  {d.note && <div style={{ fontSize: 10.5, color: 'var(--text-4)', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>{d.note}</div>}
                </div>
              );
            })}
          </div>
          {/* 보강 권장 */}
          {suggestions.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 8 }}>보강 권장</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {suggestions.map((s, i) => {
                  const pcolor = s.priority === 'HIGH' ? '#f85149' : s.priority === 'MEDIUM' ? '#d29922' : '#7d8590';
                  return (
                    <div key={i} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ fontSize: 10, color: pcolor, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, minWidth: 60 }}>{s.priority}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{s.action}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* === Stats Dashboard Modal === */
function StatsModal({ state, onClose }) {
  const stats = React.useMemo(() => {
    if (!window.computeStats) return null;
    return window.computeStats(state);
  }, [state]);
  const usage = window.gddUsage ? window.gddUsage.getStats() : null;
  if (!stats) return null;

  const DOM_LABEL = {
    core: '코어', system: '시스템', content: '컨텐츠', bm: 'BM',
    sound: '사운드', uiux: 'UI/UX', tutorial: '튜토리얼', art: '아트',
  };
  const DOM_COLOR = {
    core: '#4cc2ff', system: '#7ee787', content: '#d29922',
    bm: '#ff5eb8', sound: '#a78bfa', uiux: '#56d4dd',
    tutorial: '#f5d94f', art: '#ff8ccb',
  };

  const maxDayCount = Math.max(1, ...stats.recentDays.map(d => d.count));
  const totalDomain = Math.max(1, Object.values(stats.byDomain).reduce((a, b) => a + b, 0));
  const fmt = window.gddUsage ? window.gddUsage.formatUSD : (n) => '$' + n.toFixed(2);

  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="form-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <header>
          <h2>📊 작업 통계</h2>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>
        <div className="body" style={{ maxHeight: '70vh', overflow: 'auto' }}>
          {/* 핵심 카운트 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 18 }}>
            {[
              { label: '컨셉', v: stats.counts.concepts, c: '#88DFB0' },
              { label: '기획서', v: stats.counts.projects, c: '#4cc2ff' },
              { label: '슬라이드', v: stats.counts.slides, c: '#d29922' },
              { label: '총 단어', v: stats.counts.words.toLocaleString(), c: '#ff5eb8' },
            ].map((m, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', padding: '12px', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: m.c, marginTop: 2 }}>{m.v}</div>
              </div>
            ))}
          </div>

          {/* 최근 14일 활동 */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 8 }}>최근 14일 기획서 활동</div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 100, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: 12 }}>
              {stats.recentDays.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                     title={`${d.date}: ${d.count}건`}>
                  <div style={{
                    width: '100%',
                    height: `${(d.count / maxDayCount) * 80}px`,
                    minHeight: d.count > 0 ? 2 : 0,
                    background: d.count > 0 ? 'var(--accent)' : 'transparent',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 0.2s',
                  }}></div>
                  <div style={{ fontSize: 9, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                    {d.date.slice(5)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 도메인 분포 */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 8 }}>도메인 분포</div>
            <div style={{ display: 'flex', height: 24, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {Object.entries(stats.byDomain).map(([dom, n], i) => (
                <div key={i} title={`${DOM_LABEL[dom] || dom}: ${n}건`} style={{
                  flex: n,
                  background: DOM_COLOR[dom] || '#666',
                  color: '#061018', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
                  display: 'grid', placeItems: 'center', padding: '0 6px',
                  borderRight: i < Object.keys(stats.byDomain).length - 1 ? '1px solid rgba(0,0,0,0.2)' : 'none',
                }}>{n}</div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {Object.entries(stats.byDomain).map(([dom, n]) => (
                <div key={dom} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-2)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: DOM_COLOR[dom] }}></span>
                  {DOM_LABEL[dom] || dom} <span style={{ color: 'var(--text-4)' }}>{Math.round(n / totalDomain * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 컨셉별 진행률 */}
          {stats.conceptProgress.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 8 }}>컨셉별 기획서 진행률</div>
              {stats.conceptProgress.map(c => (
                <div key={c.id} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: 10, marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{c.title}</span>
                    <span style={{ color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{c.done} / {c.total}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${c.ratio * 100}%`,
                      background: c.ratio === 1 ? 'var(--ok)' : 'var(--accent)',
                      transition: 'width 0.3s',
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI 사용량 요약 */}
          {usage && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.06, marginBottom: 8 }}>AI 사용량</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <div style={{ background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>총 호출</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{usage.totalCalls}</div>
                </div>
                <div style={{ background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>총 토큰</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{(usage.totalTokens / 1000).toFixed(1)}K</div>
                </div>
                <div style={{ background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>총 비용</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{fmt(usage.totalCost)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* === Consistency Check Modal === */
function ConsistencyModal({ concept, projects, onClose, onGoto }) {
  const result = React.useMemo(() => {
    if (!concept || !window.runConsistencyCheck) return null;
    return window.runConsistencyCheck(concept, projects);
  }, [concept, projects]);
  if (!result) return null;
  const { issues, stats } = result;
  const levelColor = { warn: 'var(--warn)', info: 'var(--accent)', error: 'var(--danger)' };
  const levelLabel = { warn: '경고', info: '정보', error: '오류' };
  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="form-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <header>
          <h2>🧐 컨셉 일관성 점검 — {concept.title}</h2>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>
        <div className="body" style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
            {[
              { label: '연결 기획서', v: stats.gddCount },
              { label: '정의된 용어', v: stats.termCount },
              { label: '데이터 필드', v: stats.fieldCount },
              { label: '이슈 합계', v: stats.issueCount },
            ].map((m, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{m.v}</div>
              </div>
            ))}
          </div>
          {issues.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--ok)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
              <div>이슈가 없습니다. 모든 기획서가 정합성 있게 작성되었습니다.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {issues.map((it, i) => (
                <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', background: 'var(--bg-2)' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{
                      fontSize: 10, fontFamily: 'var(--font-mono)',
                      color: levelColor[it.level], borderColor: levelColor[it.level],
                      border: '1px solid', padding: '1px 6px', borderRadius: 3, fontWeight: 700,
                    }}>{levelLabel[it.level] || it.level}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}>{it.kind}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{it.message}</div>
                  {it.locations.length > 0 && (
                    <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {it.locations.map((loc, j) => (
                        <button
                          key={j}
                          onClick={() => onGoto({ type: 'gdd', id: loc.gddId })}
                          style={{
                            textAlign: 'left',
                            background: 'transparent', border: '1px solid var(--border)',
                            padding: '6px 10px', borderRadius: 4, color: 'var(--text-2)',
                            fontSize: 11, fontFamily: 'var(--font-mono)', cursor: 'pointer',
                          }}
                        >
                          → {loc.gddTitle}{loc.snippet ? ` · ${loc.snippet}` : ''}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* === Shortcuts Help Modal === */
function ShortcutsModal({ onClose }) {
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || '');
  const mod = isMac ? '⌘' : 'Ctrl';
  const rows = [
    { keys: [`${mod} K`], desc: '명령 팔레트 열기 / 닫기' },
    { keys: [`${mod} S`], desc: '강제 저장' },
    { keys: [`${mod} Z`], desc: '실행 취소 (Undo)' },
    { keys: [`${mod} ⇧ Z`], desc: '다시 실행 (Redo)' },
    { keys: [`${mod} D`], desc: '현재 슬라이드 복제' },
    { keys: [`${mod} C`], desc: '현재 슬라이드 복사 (텍스트 선택 시 기본 동작)' },
    { keys: [`${mod} X`], desc: '현재 슬라이드 잘라내기' },
    { keys: [`${mod} V`], desc: '복사한 슬라이드 붙여넣기' },
    { keys: ['←', '→', '↑', '↓'], desc: '이전/다음 슬라이드 이동' },
    { keys: ['Alt + ←', 'Alt + →', 'Alt + ↑', 'Alt + ↓'], desc: '현재 슬라이드 위치 이동 (재정렬)' },
    { keys: ['PageUp', 'PageDn'], desc: '이전/다음 슬라이드 (대체)' },
    { keys: ['?'], desc: '단축키 도움말' },
    { keys: ['Esc'], desc: '모달/명령팔레트 닫기' },
  ];
  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="form-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <header>
          <h2>단축키</h2>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>
        <div className="body">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 0', width: 180 }}>
                    {r.keys.map((k, j) => (
                      <span key={j} style={{
                        display: 'inline-block', marginRight: 6,
                        fontFamily: 'var(--font-mono)', fontSize: 11,
                        background: 'var(--surface-2)', border: '1px solid var(--border)',
                        borderRadius: 4, padding: '3px 8px', color: 'var(--text)',
                      }}>{k}</span>
                    ))}
                  </td>
                  <td style={{ padding: '10px 0', color: 'var(--text-2)', fontSize: 13 }}>{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-3)' }}>
            💡 텍스트 편집 중에는 브라우저 기본 Undo/Redo가 사용됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}

/* === GDD Snapshots Modal === */
function GddSnapshotsModal({ project, onClose, onRestore }) {
  const snapshots = (project?.snapshots || []).slice().reverse();
  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="form-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <header>
          <h2>스냅샷 히스토리 — {project?.title}</h2>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>
        <div className="body">
          {snapshots.length === 0 && <div style={{ color: 'var(--text-3)', textAlign: 'center', padding: 24 }}>스냅샷이 없습니다.</div>}
          {snapshots.map(s => (
            <div key={s.id} className="snapshot-item" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', cursor: 'pointer' }}
              onClick={() => onRestore(s)}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{s.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>
                {new Date(s.ts).toLocaleString('ko-KR')} · {(s.data?.slides || []).length} slides
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* === Usage Stats Panel (Settings Modal 안에 표시) === */
function UsageStatsPanel() {
  const [tick, setTick] = useState(0);
  const stats = window.gddUsage ? window.gddUsage.getStats() : null;
  const budget = window.gddUsage ? window.gddUsage.getBudget() : { dailyUsd: 0, monthlyUsd: 0, hardStop: false };
  const fmt = window.gddUsage ? window.gddUsage.formatUSD : (n) => '$' + (n || 0).toFixed(2);

  const updateBudget = (patch) => {
    window.gddUsage.setBudget({ ...budget, ...patch });
    setTick(t => t + 1);
  };

  if (!stats) return null;

  return (
    <div className="form-field" style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 6 }}>
      <label>AI 사용량 (이 브라우저 누계)</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 6 }}>
        <div style={{ background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>오늘</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{fmt(stats.todayCost)}</div>
          <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{stats.todayCalls}회</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>이번 달</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{fmt(stats.monthCost)}</div>
          <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{stats.monthCalls}회</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>누계</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{fmt(stats.totalCost)}</div>
          <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{stats.totalCalls}회 · {(stats.totalTokens / 1000).toFixed(1)}K tok</div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-3)' }}>
        텍스트 {stats.textCalls}회 ({fmt(stats.textCost)}) · 이미지 {stats.imageCalls}회 ({fmt(stats.imageCost)}) · 실패 {stats.failedCalls}회
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', minWidth: 70 }}>일일 한도</span>
        <input
          type="number"
          step="0.5"
          min="0"
          value={budget.dailyUsd || ''}
          placeholder="0 (무제한)"
          onChange={(e) => updateBudget({ dailyUsd: parseFloat(e.target.value) || 0 })}
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '4px 8px', color: 'var(--text)', fontSize: 12, width: 100 }}
        />
        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>USD</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', minWidth: 70 }}>월 한도</span>
        <input
          type="number"
          step="1"
          min="0"
          value={budget.monthlyUsd || ''}
          placeholder="0 (무제한)"
          onChange={(e) => updateBudget({ monthlyUsd: parseFloat(e.target.value) || 0 })}
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '4px 8px', color: 'var(--text)', fontSize: 12, width: 100 }}
        />
        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>USD</span>
      </div>
      <div style={{ marginTop: 10 }}>
        <button
          className="btn ghost"
          onClick={() => { if (confirm('사용량 로그를 모두 삭제할까요?')) { window.gddUsage.clear(); setTick(t => t + 1); } }}
          style={{ fontSize: 11, padding: '4px 10px', color: 'var(--text-3)' }}
        >
          사용량 로그 초기화
        </button>
      </div>
    </div>
  );
}

/* === Backup Folder Panel (Settings Modal 안에 표시) === */
function BackupFolderPanel() {
  const [status, setStatus] = useState(() => window.gddStorage?.getBackupStatus?.() || { configured: false });
  const [busy, setBusy] = useState(false);
  const supported = 'showDirectoryPicker' in window;

  const pick = async () => {
    if (!window.gddStorage) return;
    setBusy(true);
    try {
      const name = await window.gddStorage.pickBackupDirectory();
      setStatus(window.gddStorage.getBackupStatus());
      // 즉시 첫 백업
      await window.gddStorage.autoBackup();
      setStatus(window.gddStorage.getBackupStatus());
    } catch (e) { /* swallow — 사용자 취소 등 */ }
    finally { setBusy(false); }
  };
  const clear = async () => {
    if (!confirm('자동 백업 폴더 설정을 해제할까요?')) return;
    await window.gddStorage.clearBackupDirectory();
    setStatus(window.gddStorage.getBackupStatus());
  };
  const backupNow = async () => {
    setBusy(true);
    try {
      const name = await window.gddStorage.autoBackup();
      setStatus(window.gddStorage.getBackupStatus());
      if (name) alert('백업됨: ' + name);
      else alert('백업 실패 — 권한이 필요할 수 있습니다.');
    } finally { setBusy(false); }
  };

  return (
    <div className="form-field" style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 6 }}>
      <label>자동 백업 폴더 (FS Access API)</label>
      {!supported ? (
        <div style={{ fontSize: 11, color: 'var(--warn)' }}>이 브라우저는 폴더 선택을 지원하지 않습니다. Chrome/Edge 권장.</div>
      ) : status.configured ? (
        <div>
          <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'var(--font-mono)', background: 'var(--bg-2)', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)' }}>
            📁 {status.name}
            {status.lastBackupAt && (
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>
                마지막 백업: {new Date(status.lastBackupAt).toLocaleString('ko-KR')}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <button className="btn ghost" onClick={backupNow} disabled={busy} style={{ fontSize: 11 }}>📥 지금 백업</button>
            <button className="btn ghost" onClick={clear} disabled={busy} style={{ fontSize: 11, color: 'var(--danger)' }}>해제</button>
          </div>
        </div>
      ) : (
        <div>
          <button className="btn ghost" onClick={pick} disabled={busy} style={{ fontSize: 12, padding: '6px 12px' }}>
            📁 백업 폴더 선택
          </button>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
            지정된 폴더에 큰 변경 후 자동으로 <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-2)', padding: '1px 4px', borderRadius: 3 }}>.gddproject</code> 파일이 저장됩니다. 최근 30개 유지.
          </div>
        </div>
      )}
    </div>
  );
}

/* === ErrorBoundary — 비정상 종료 시 비상 백업 === */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  async componentDidCatch(error, info) {
    this.setState({ info });
    // 가능하면 현재 사용자가 작업 중이던 state를 emergency 슬롯에 저장
    try {
      const snapshot = this.props.getCurrentState?.();
      if (snapshot && window.gddStorage) {
        await window.gddStorage.saveEmergency(snapshot);
      }
    } catch (e) { /* swallow */ }
  }
  render() {
    if (this.state.error) {
      const msg = this.state.error?.message || String(this.state.error);
      const stack = this.state.info?.componentStack || '';
      return (
        <div className="error-boundary-screen">
          <div className="error-boundary-card">
            <h2>⚠ 예상치 못한 오류가 발생했습니다</h2>
            <p>작업 내용은 <strong>비상 백업 슬롯에 자동 보존</strong>되었습니다. 페이지를 다시 로드하면 복구 안내가 나옵니다.</p>
            <pre>{msg}{stack ? '\n\n' + stack : ''}</pre>
            <div className="actions">
              <button className="btn primary" onClick={() => window.location.reload()}>↻ 새로고침하고 복구</button>
              <button className="btn ghost" onClick={() => this.setState({ error: null, info: null })}>이 화면 닫고 계속 시도</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* === Settings Modal (Gemini API key + model) === */
function SettingsModal({ onClose, onSaved }) {
  const initialKey = (window.gemini?.getApiKey && window.gemini.getApiKey()) || '';
  const initialModel = (window.gemini?.getModel && window.gemini.getModel()) || 'gemini-2.5-flash';
  const [apiKey, setApiKey] = useState(initialKey);
  const [model, setModel] = useState(initialModel);
  const [showKey, setShowKey] = useState(false);

  const masked = (k) => {
    if (!k) return '(없음)';
    if (k.length < 12) return '••••';
    return k.slice(0, 4) + '••••••••' + k.slice(-4);
  };

  const save = () => {
    if (window.gemini?.setApiKey) window.gemini.setApiKey(apiKey);
    if (window.gemini?.setModel) window.gemini.setModel(model);
    onSaved?.();
    onClose();
  };

  const clear = () => {
    if (!confirm('저장된 API 키를 삭제할까요?')) return;
    if (window.gemini?.resetApiKey) window.gemini.resetApiKey();
    setApiKey('');
    onSaved?.();
  };

  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="form-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <header>
          <h2>Gemini API 설정</h2>
          <button className="btn ghost icon" onClick={onClose}>✕</button>
        </header>
        <div className="body">
          <div className="form-field">
            <label>API 키</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza... 로 시작하는 키를 붙여넣으세요"
                style={{ flex: 1, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-mono)' }}
                autoFocus
              />
              <button className="btn ghost" onClick={() => setShowKey((v) => !v)}>
                {showKey ? '숨김' : '표시'}
              </button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
              현재 저장됨: <span style={{ fontFamily: 'var(--font-mono)' }}>{masked(initialKey)}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
              키 발급: <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>aistudio.google.com/apikey</a> · 키는 이 브라우저의 localStorage에만 저장됩니다.
            </div>
          </div>

          <div className="form-field">
            <label>모델</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', color: 'var(--text)', fontSize: 13 }}
            >
              <option value="gemini-2.5-flash">gemini-2.5-flash (빠르고 저렴, 권장)</option>
              <option value="gemini-2.5-pro">gemini-2.5-pro (고품질, 느림)</option>
              <option value="gemini-2.0-flash">gemini-2.0-flash (이전 세대)</option>
              <option value="gemini-1.5-flash">gemini-1.5-flash (레거시)</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro (레거시)</option>
            </select>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
              긴 기획서 생성에는 Pro, 빠른 반복에는 Flash가 적합합니다.
            </div>
          </div>

          {/* AI 사용량 통계 */}
          <UsageStatsPanel />

          {/* 자동 백업 폴더 */}
          <BackupFolderPanel />
        </div>
        <footer>
          <button className="btn ghost" onClick={clear} style={{ marginRight: 'auto', color: 'var(--danger)' }}>
            키 삭제
          </button>
          <button className="btn ghost" onClick={onClose}>취소</button>
          <button className="btn primary" onClick={save}>저장</button>
        </footer>
      </div>
    </div>
  );
}

/* === Sidebar === */
function Sidebar({ concepts, projects, selection, onSelect, onNewBlank, onOpenConceptBrief, onOpenGddBrief, onDelete }) {
  const handleDelete = (e, type, item) => {
    e.stopPropagation();
    if (confirm(`"${item.title}" 을(를) 삭제할까요?`)) onDelete(type, item.id);
  };
  return (
    <div className="sidebar">
      <div style={{ height: 14 }}></div>
      <button className="big-cta" onClick={onOpenConceptBrief}>
        <span style={{ fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.15)', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>✦ AI</span>
        컨셉 만들기
        <span className="arr">↵</span>
      </button>

      <div className="concept-list-section">
        <div className="section-label">컨셉 기획 <span style={{ float: 'right', color: 'var(--text-4)' }}>{(concepts || []).length}</span></div>
        {(concepts || []).map(c => {
          const linkedCount = (c.recommendedPlans || []).filter(rp => rp.linkedGddId).length;
          const totalCount = (c.recommendedPlans || []).length;
          return (
            <div
              key={c.id}
              className={'concept-item ' + (selection.type === 'concept' && selection.id === c.id ? 'active' : '')}
              onClick={() => onSelect('concept', c.id)}
            >
              <button className="item-del" title="삭제" onClick={(e) => handleDelete(e, 'concept', c)}>✕</button>
              <div className="title">{c.title}</div>
              <div className="meta">
                <span className="gdd-count">{linkedCount}</span>/<span>{totalCount}</span> 기획서 · {c.updatedAt}
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>세부 기획서 <span style={{ color: 'var(--text-4)' }}>{projects.length}</span></span>
      </div>
      <button className="new-doc-btn" onClick={onOpenGddBrief}>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>✦</span> AI로 기획서 추가
      </button>
      <button className="new-doc-btn" onClick={onNewBlank} style={{ marginTop: -4 }}>
        <span style={{ fontFamily: 'var(--font-mono)' }}>+</span> 빈 기획서 추가
      </button>
      <div className="doc-list">
        {projects.map(p => (
          <div
            key={p.id}
            className={'doc-item ' + (selection.type === 'gdd' && selection.id === p.id ? 'active' : '')}
            onClick={() => onSelect('gdd', p.id)}
            style={{ paddingLeft: 14 }}
          >
            <button className="item-del" title="삭제" onClick={(e) => handleDelete(e, 'gdd', p)}>✕</button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <div className="title">{p.title}</div>
              {p.badge && <div className="badge">{p.badge}</div>}
            </div>
            <div className="meta">
              <span>{p.version}</span>
              <span className="dot">·</span>
              <span>{(p.slides || []).length} slides</span>
              <span className="dot">·</span>
              <span>{p.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>
      {/* 사이드바 푸터 — 하드코딩된 샘플 라벨 제거. 추후 동적 통계로 대체 가능. */}
    </div>
  );
}

/* === Slide stage === */
function SlideStage({ project, patchSlide, replaceSlide, scale, setScale, currentIdx, setCurrentIdx, isGenerating, onSplitSlide }) {
  const slides = project.slides || [];
  const slide = slides[currentIdx];
  const stageRef = useRef(null);

  // Auto-fit scale
  useEffect(() => {
    const recompute = () => {
      if (!stageRef.current) return;
      const w = stageRef.current.clientWidth - 56;
      const h = stageRef.current.clientHeight - 56;
      const s = Math.min(w / 1280, h / 720, 1);
      setScale(s);
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [setScale]);

  // 분할 권장 여부 — splitter 의 휴리스틱으로 즉시 판단
  const shouldSplit = slide && window.gddSlideSplitter && window.gddSlideSplitter.shouldSplit(slide);

  if (!slide) {
    return <div className="stage" ref={stageRef} style={{ display: 'grid', placeItems: 'center', color: 'var(--text-3)' }}>슬라이드 없음</div>;
  }

  return (
    <div className="stage">
      <div className="stage-scroll" ref={stageRef} style={{ position: 'relative' }}>
        <div className="slide-frame" style={{ transform: `scale(${scale})`, position: 'relative' }}>
          <SlideRenderer
            slide={slide}
            patch={(u) => patchSlide(slide.id, { data: { ...slide.data, ...u } })}
            replace={(newSlide) => replaceSlide && replaceSlide(slide.id, newSlide)}
            page={currentIdx + 1}
            totalPages={slides.length}
          />
          {shouldSplit && onSplitSlide && (
            <div className="slide-overflow-banner">
              <span>⚠ 콘텐츠가 슬라이드 영역을 초과 — 분할 권장</span>
              <button onClick={() => onSplitSlide(slide.id)} title="이 슬라이드를 N장으로 분할">✂️ 분할</button>
            </div>
          )}
        </div>
        {isGenerating && (
          <div className="stage-veil">
            <div className="label">기획서 생성 중…</div>
            <div className="bar"><div className="fill"></div></div>
          </div>
        )}
      </div>
      <div className="stage-footer">
        <div>
          <span style={{ color: 'var(--accent)' }}>{(window.SLIDE_LABELS && window.SLIDE_LABELS[slide.type]) || slide.type}</span>
          <span style={{ margin: '0 8px', color: 'var(--text-4)' }}>·</span>
          <span>{currentIdx + 1} / {slides.length}</span>
          <span style={{ margin: '0 8px', color: 'var(--text-4)' }}>·</span>
          <span>{Math.round(scale * 100)}%</span>
        </div>
        <div className="nav">
          <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}>← Prev</button>
          <button onClick={() => setCurrentIdx(Math.min(slides.length - 1, currentIdx + 1))} disabled={currentIdx === slides.length - 1}>Next →</button>
        </div>
      </div>
    </div>
  );
}

/* === Thumbnails strip ===
 * - 각 썸네일은 정확한 16:9 비율 (CSS aspect-ratio)
 * - 컨테이너는 세로 스크롤 + 활성 슬라이드가 자동으로 viewport 안에 오도록 scrollIntoView
 * - 키보드 방향키는 App 전역 핸들러가 처리 (← / → / ↑ / ↓ + PageUp/Down)
 */
function Thumbs({ slides, currentIdx, setCurrentIdx, onAddSlide, onDeleteSlide, onMoveSlide }) {
  const activeRef = useRef(null);

  // currentIdx 변경 시 활성 썸네일을 viewport 안으로 스크롤
  useEffect(() => {
    const el = activeRef.current;
    if (!el || typeof el.scrollIntoView !== 'function') return;
    // block: 'nearest' → 이미 보이면 스크롤하지 않음, 가려져있으면 가장 가까운 가장자리로
    try { el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch {}
  }, [currentIdx]);

  return (
    <div className="thumbs" tabIndex={-1}>
      {slides.map((s, i) => {
        const isActive = i === currentIdx;
        const isChild = !!(s.data?._parent && s.data._parent.slideId);
        const isPlaceholder = !!s.data?._placeholder;
        return (
          <div
            className={'thumb ' + (isActive ? 'active' : '') + (isChild ? ' child' : '') + (isPlaceholder ? ' is-placeholder' : '')}
            key={s.id}
            ref={isActive ? activeRef : null}
            onClick={() => setCurrentIdx(i)}
            title={isPlaceholder ? `생성 대기 중…` : isChild ? `↳ "${s.data._parent.slideTitle || ''}" 의 드릴다운` : `슬라이드 ${i + 1}`}
          >
            <span className="num">{isChild ? '↳' : ''}{String(i + 1).padStart(2, '0')}</span>
            <div className="thumb-actions">
              {i > 0 && (
                <button title="위로" onClick={(e) => { e.stopPropagation(); onMoveSlide(i, -1); }}>↑</button>
              )}
              {i < slides.length - 1 && (
                <button title="아래로" onClick={(e) => { e.stopPropagation(); onMoveSlide(i, 1); }}>↓</button>
              )}
              {slides.length > 1 && (
                <button title="삭제" className="del" onClick={(e) => { e.stopPropagation(); if (confirm(`${i + 1}번 슬라이드를 삭제할까요?`)) onDeleteSlide(s.id); }}>✕</button>
              )}
            </div>
            <div className="thumb-canvas">
              <ThumbScaler slide={s} index={i} total={slides.length} />
            </div>
          </div>
        );
      })}
      <button className="thumb-add" onClick={onAddSlide}>+ 슬라이드 추가</button>
    </div>
  );
}

/* 썸네일은 16:9 컨테이너 폭에 맞춰 1280px 슬라이드를 자동 비율로 축소 */
function ThumbScaler({ slide, index, total }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(124 / 1280);
  useEffect(() => {
    if (!ref.current) return;
    const recompute = () => {
      if (!ref.current) return;
      const w = ref.current.clientWidth;
      if (w > 0) setScale(w / 1280);
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="thumb-scaler-host">
      <div className="scaler" style={{ transform: `scale(${scale})` }}>
        <SlideRenderer slide={slide} patch={() => {}} page={index + 1} totalPages={total} />
      </div>
    </div>
  );
}

/* === Add slide menu === */
function AddSlideMenu({ onAdd, onClose }) {
  const types = [
    // 개요/구조
    { type: 'intent', label: '기획 의도', icon: '◆', group: '개요' },
    { type: 'terms', label: '용어 정의', icon: '≡', group: '개요' },
    { type: 'section-divider', label: '섹션 구분', icon: '—', group: '개요' },
    // 시스템 / 로직
    { type: 'rules', label: '규칙', icon: '§', group: '시스템' },
    { type: 'flow', label: '플로우 차트', icon: '⇣', group: '시스템' },
    { type: 'diagram', label: '다이어그램 (2D)', icon: '◇', group: '시스템' },
    { type: 'sequence-diagram', label: '시퀀스 다이어그램', icon: '⇄', group: '시스템' },
    { type: 'class-diagram', label: '클래스 다이어그램', icon: '▤', group: '시스템' },
    { type: 'state-machine', label: '상태 머신', icon: '◎', group: '시스템' },
    // 데이터 / 밸런싱
    { type: 'data-table', label: '데이터 테이블', icon: '▦', group: '데이터' },
    { type: 'balance-table', label: '수치 밸런싱', icon: '∿', group: '데이터' },
    // API / 텔레메트리
    { type: 'api-contract', label: 'API 계약', icon: '⇿', group: 'API' },
    { type: 'telemetry', label: '텔레메트리', icon: '◉', group: 'API' },
    // 품질 / 검증
    { type: 'acceptance-criteria', label: '수락 기준', icon: '✓', group: '품질' },
    // UI / 리소스
    { type: 'ui-design', label: 'UI/UX', icon: '▣', group: 'UI' },
    { type: 'image-embed', label: '참고 이미지', icon: '🖼', group: 'UI' },
    { type: 'resources', label: '필요 리소스', icon: '◉', group: 'UI' },
    // 프로젝트 관리
    { type: 'risk-register', label: '위험 등기부', icon: '⚠', group: '관리' },
    { type: 'roadmap', label: '로드맵', icon: '►', group: '관리' },
  ];
  return (
    <div className="form-panel-overlay" onClick={onClose}>
      <div className="form-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <header><h2>슬라이드 추가</h2><button className="btn ghost icon" onClick={onClose}>✕</button></header>
        <div className="body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {types.map(t => (
              <button key={t.type} className="btn" style={{ padding: '12px 14px', justifyContent: 'flex-start' }} onClick={() => onAdd(t.type)}>
                <span style={{ color: 'var(--accent)', fontSize: 16, marginRight: 8, fontFamily: 'var(--font-mono)' }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* === Main App === */
function App({ onStateChange }) {
  const [state, _setStateRaw] = useState(() => {
    // 다른 .jsx 파일의 const는 모듈 스코프이므로 window로 참조
    const seedConcept = window.CONCEPT_SUPERBUMPERS;
    const seedProjects = [window.GDD_INGAME, window.GDD_VEHICLE, window.GDD_COMBAT].filter(Boolean);
    return {
      concepts: seedConcept ? [seedConcept] : [],
      projects: seedProjects,
      selection: seedConcept
        ? { type: 'concept', id: seedConcept.id }
        : (seedProjects[0] ? { type: 'gdd', id: seedProjects[0].id } : { type: 'concept', id: null }),
    };
  });
  const [bootLoaded, setBootLoaded] = useState(false);

  /* ===== Slide clipboard =====
   * - Ctrl+C / Ctrl+X / Ctrl+V 가 슬라이드 단위로 동작.
   * - 텍스트 선택이 있거나 입력 위젯에 포커스 중이면 브라우저 기본 동작에 양보.
   * - 세션 단위로만 유지 (탭/페이지 새로고침 시 비워짐). */
  const slideClipRef = useRef(null);

  /* ===== Undo/Redo 스택 =====
   * - 큰 변경(추가/삭제/이동/AI 생성/일괄/import) 직전에 commitNow() 호출.
   * - 텍스트 인라인 편집·selection 변경은 history 미추가 (contentEditable native undo가 텍스트 처리).
   * - 최대 50 단계 유지. */
  const historyRef = useRef({ past: [], future: [] });
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);
  const setState = _setStateRaw; // alias

  const commitNow = (label) => {
    const snapshot = stateRef.current;
    const past = [...historyRef.current.past, { state: snapshot, label, ts: Date.now() }];
    if (past.length > 50) past.shift();
    historyRef.current = { past, future: [] };
  };
  const undo = () => {
    const h = historyRef.current;
    if (!h.past.length) return false;
    const cur = stateRef.current;
    const last = h.past[h.past.length - 1];
    historyRef.current = {
      past: h.past.slice(0, -1),
      future: [{ state: cur, label: last.label, ts: Date.now() }, ...h.future].slice(0, 50),
    };
    _setStateRaw(last.state);
    return true;
  };
  const redo = () => {
    const h = historyRef.current;
    if (!h.future.length) return false;
    const cur = stateRef.current;
    const next = h.future[0];
    historyRef.current = {
      past: [...h.past, { state: cur, label: next.label, ts: Date.now() }].slice(-50),
      future: h.future.slice(1),
    };
    _setStateRaw(next.state);
    return true;
  };
  const canUndo = () => historyRef.current.past.length > 0;
  const canRedo = () => historyRef.current.future.length > 0;

  // 초기 로드 — IndexedDB / emergency 슬롯 / legacy localStorage + 백업 폴더 핸들 복원
  useEffect(() => {
    let alive = true;
    (async () => {
      const loaded = await loadStateAsync();
      if (!alive) return;
      if (loaded && loaded.projects && loaded.concepts) {
        setState(loaded);
      }
      // 백업 폴더 핸들 복원 (IndexedDB에 보관된 FileSystemDirectoryHandle)
      if (window.gddStorage?.restoreBackupDirectory) {
        try { await window.gddStorage.restoreBackupDirectory(); } catch {}
      }
      setBootLoaded(true);
    })();
    return () => { alive = false; };
  }, []);

  // 자동 백업: 큰 변경 발생 후 30초 디바운스로 폴더에 .gddproject 저장
  useEffect(() => {
    if (!bootLoaded) return;
    const t = setTimeout(async () => {
      if (window.gddStorage?.getBackupStatus?.()?.configured) {
        try { await window.gddStorage.autoBackup(); } catch {}
      }
    }, 30000);
    return () => clearTimeout(t);
  }, [state, bootLoaded]);

  const [view, setView] = useState('slide');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scale, setScale] = useState(0.6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [generationMode, setGenerationMode] = useState('ai');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showBrief, setShowBrief] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCmdK, setShowCmdK] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showConsistency, setShowConsistency] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showQualityGate, setShowQualityGate] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(() => !!(window.gemini?.getApiKey && window.gemini.getApiKey()));
  const [usageTick, setUsageTick] = useState(0); // 토큰/비용 강제 갱신 트리거

  const toast = useToast();
  // 슬라이드 내부(예: RulesSlide의 플로우 변환 버튼)에서 토스트를 띄울 수 있도록 글로벌 노출
  useEffect(() => {
    window.gddToast = toast;
    return () => { if (window.gddToast === toast) delete window.gddToast; };
  }, [toast]);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  /* Apply theme accent CSS vars */
  useEffect(() => {
    const theme = THEMES[tweaks.theme] || THEMES.cyan;
    const r = document.documentElement;
    r.style.setProperty('--accent', theme.accent);
    r.style.setProperty('--accent-2', theme.accent2);
    r.style.setProperty('--accent-strong', theme.accentStrong);
    r.style.setProperty('--accent-soft', theme.accentSoft);
  }, [tweaks.theme]);

  /* AI usage 변경 이벤트 구독 — 배지 자동 갱신 */
  useEffect(() => {
    const h = () => setUsageTick(t => t + 1);
    window.addEventListener('gdd-usage-changed', h);
    return () => window.removeEventListener('gdd-usage-changed', h);
  }, []);

  /* Persist (디바운스 + IndexedDB). 부트 로드 완료 후에만 저장 — 초기값 덮어쓰기 방지 */
  useEffect(() => {
    if (!bootLoaded) return;
    const payload = { projects: state.projects, concepts: state.concepts, selection: state.selection };
    saveStateDebounced(payload);
    onStateChange?.(payload); // ErrorBoundary가 비상 백업을 위해 참조
  }, [state, bootLoaded, onStateChange]);

  const selection = state.selection || { type: 'concept', id: state.concepts?.[0]?.id };
  const project = selection.type === 'gdd' ? state.projects.find(p => p.id === selection.id) : null;
  const concept = selection.type === 'concept' ? state.concepts.find(c => c.id === selection.id) : null;

  // 현재 활성 팔레트를 window 에 노출 — slides.jsx 등 컴포넌트에서 prop 없이 접근 가능.
  // 컨셉 선택 시 그 컨셉의 팔레트, GDD 선택 시 부모 컨셉의 팔레트.
  useEffect(() => {
    let activePalette = null;
    if (concept) {
      activePalette = concept.palette;
    } else if (project) {
      const parent = state.concepts?.find(c => c.id === project.conceptId);
      activePalette = parent?.palette;
    }
    window.gddCurrentPalette = activePalette || null;
  }, [concept, project, state.concepts]);

  const setProject = (updater) => {
    if (selection.type !== 'gdd') return;
    setState(s => ({
      ...s,
      projects: s.projects.map(p => p.id === selection.id ? (typeof updater === 'function' ? updater(p) : updater) : p),
    }));
  };

  const setConcept = (updater) => {
    if (selection.type !== 'concept') return;
    setState(s => ({
      ...s,
      concepts: s.concepts.map(c => c.id === selection.id ? (typeof updater === 'function' ? updater(c) : updater) : c),
    }));
  };

  const patchSlide = useCallback((slideId, patch) => {
    setProject(p => ({
      ...p,
      slides: (p.slides || []).map(s => s.id === slideId ? { ...s, ...patch, data: patch.data || s.data } : s),
      updatedAt: new Date().toISOString().slice(0, 10),
    }));
  }, [selection.id, selection.type]);

  const addSlide = (type) => {
    setShowAddMenu(false);
    commitNow('슬라이드 추가: ' + type);
    const templates = {
      'intent': { section: '01', sectionName: '개요', title: '기획 의도', tagline: '본 기능의 기획 의도를 4가지 축에서 정의한다.', cards: [
        { idx: '01', head: '제목', desc: '설명' },
        { idx: '02', head: '제목', desc: '설명' },
        { idx: '03', head: '제목', desc: '설명' },
        { idx: '04', head: '제목', desc: '설명' },
      ]},
      'terms': { section: '01', sectionName: '개요', title: '용어 정의', rows: [
        { term: '용어 1', def: '정의', note: '비고' },
        { term: '용어 2', def: '정의', note: '비고' },
        { term: '용어 3', def: '정의', note: '비고' },
      ]},
      'rules': { section: '02', sectionName: '시스템 상세', title: '규칙', blocks: [
        { head: '기본 규칙', items: ['규칙 1', '규칙 2', '규칙 3'] },
        { head: '예외 처리', items: ['예외 1', '예외 2'] },
      ]},
      'data-table': { section: '04', sectionName: '데이터 테이블', title: '데이터 테이블',
        columns: [
          { key: 'field', label: 'Field', width: '22%' },
          { key: 'type', label: 'Type', width: '15%' },
          { key: 'desc', label: '설명' },
        ],
        rows: [
          { field: 'id', type: 'string', desc: '고유 식별자' },
          { field: 'name', type: 'string', desc: '이름' },
        ],
      },
      'flow': { section: '02', sectionName: '플로우 차트', title: '플로우 차트', nodes: [
        { kind: 'start', label: '시작' },
        { kind: 'process', label: '처리' },
        { kind: 'end', label: '종료' },
      ]},
      'diagram': { section: '02', sectionName: '시스템 다이어그램', title: '시스템 구조', nodes: [
        { id: 'n1', label: '클라이언트', kind: 'start', col: 0, row: 0 },
        { id: 'n2', label: '게임 서버', sub: 'GAME_SERVER', kind: 'service', col: 2, row: 0 },
        { id: 'n3', label: '매치메이커', kind: 'process', col: 1, row: 1 },
        { id: 'n4', label: 'DB', sub: 'POSTGRES', kind: 'data', col: 3, row: 1 },
      ], edges: [
        { from: 'n1', to: 'n3', label: '매칭 요청' },
        { from: 'n3', to: 'n2', label: '세션 생성' },
        { from: 'n2', to: 'n4', label: '저장', kind: 'dashed' },
      ]},
      'sequence-diagram': { section: '02', sectionName: '시퀀스 다이어그램', title: '시퀀스 다이어그램',
        participants: [
          { id: 'p1', name: '클라이언트', kind: 'actor' },
          { id: 'p2', name: '게이트웨이', kind: 'system' },
          { id: 'p3', name: '인증 서비스', kind: 'service' },
          { id: 'p4', name: 'DB', kind: 'data' },
        ],
        messages: [
          { from: 'p1', to: 'p2', label: 'POST /login', kind: 'sync' },
          { from: 'p2', to: 'p3', label: 'auth.verify(id, pw)', kind: 'sync' },
          { from: 'p3', to: 'p4', label: 'user.find(id)', kind: 'sync' },
          { from: 'p4', to: 'p3', label: 'user record', kind: 'return' },
          { from: 'p3', to: 'p2', label: 'JWT token', kind: 'return' },
          { from: 'p2', to: 'p1', label: '200 OK + token', kind: 'return' },
        ],
      },
      'class-diagram': { section: '02', sectionName: '클래스 다이어그램', title: '클래스 다이어그램',
        classes: [
          { id: 'c1', name: 'Entity', stereotype: '<<abstract>>', attrs: ['#id: UUID', '#createdAt: DateTime'], methods: ['+save(): void'], col: 1, row: 0 },
          { id: 'c2', name: 'Player', stereotype: '', attrs: ['-hp: int', '-mp: int', '-level: int'], methods: ['+takeDamage(amount: int): void', '+heal(amount: int): void'], col: 0, row: 1 },
          { id: 'c3', name: 'Inventory', stereotype: '', attrs: ['-slots: Item[]', '-capacity: int'], methods: ['+add(item: Item): bool', '+remove(slotIdx: int): Item'], col: 2, row: 1 },
          { id: 'c4', name: 'Item', stereotype: '<<entity>>', attrs: ['+name: string', '+stack: int'], methods: ['+use(target: Entity): void'], col: 3, row: 0 },
        ],
        relations: [
          { from: 'c2', to: 'c1', kind: 'inherit', label: '' },
          { from: 'c2', to: 'c3', kind: 'compose', label: '1' },
          { from: 'c3', to: 'c4', kind: 'aggregate', label: '0..*' },
        ],
      },
      'ui-design': { section: '03', sectionName: 'UI/UX', title: '화면 설계', callouts: [
        { name: '영역 1', desc: '설명' },
        { name: '영역 2', desc: '설명' },
        { name: '영역 3', desc: '설명' },
      ]},
      'resources': { section: '05', sectionName: '필요 리소스', title: '필요 리소스 목록', categories: [
        { name: 'UI', count: 'x?', items: ['아이템 1', '아이템 2'] },
        { name: '사운드', count: 'x?', items: ['아이템 1'] },
        { name: '데이터', count: 'x?', items: ['아이템 1'] },
      ]},
      'section-divider': { num: '0?', title: '섹션 제목', subtitle: '섹션 설명', imagePrompt: '' },
      'image-embed': { section: '03', sectionName: '참고 이미지', title: '참고 이미지', caption: '참고 이미지 캡션', imagePrompt: '' },
      // Phase 1 신규 7종
      'balance-table': {
        section: '04', sectionName: '밸런싱', title: '수치 밸런싱',
        formula: '`damage = base × (1 + str/100) × elem_mod`',
        vars: [
          { name: 'base', formula: '카드 등급별 기본값', range: '50~200', defaultValue: '100', sensitivity: '±10% → 평균 매치 시간 ±15초', notes: '' },
          { name: 'str', formula: '레벨 + 강화 보정', range: '0~500', defaultValue: '0', sensitivity: '레벨 1당 +5', notes: '' },
          { name: 'elem_mod', formula: '속성 상성표', range: '0.5~2.0', defaultValue: '1.0', sensitivity: '상성 일치 시 1.5', notes: '카운터는 2.0' },
        ],
        curve: { x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], y: [100, 220, 380, 580, 820, 1100, 1420, 1780, 2180, 2620], xLabel: '레벨', yLabel: '강화 비용 (재화)' },
      },
      'state-machine': {
        section: '02', sectionName: '상태 머신', title: '상태 머신',
        states: [
          { id: 's1', name: 'IDLE', kind: 'initial', onEnter: '`enableInput()`', onExit: '`disableInput()`', invariants: ['`input_locked == false`'] },
          { id: 's2', name: 'CASTING', kind: 'normal', onEnter: '`playCastAnim()`', onExit: '', invariants: ['`animation_locked == true`'] },
          { id: 's3', name: 'COOLDOWN', kind: 'normal', onEnter: '`startCooldownTimer()`', onExit: '', invariants: ['`canCast == false`'] },
          { id: 's4', name: 'DEAD', kind: 'final', onEnter: '`playDeathSeq()`', onExit: '', invariants: ['모든 입력 차단', '카메라 페이드아웃'] },
        ],
        transitions: [
          { from: 's1', to: 's2', event: 'CAST_INPUT', guard: '`mana >= cost`', action: '`consumeMana(cost)`' },
          { from: 's2', to: 's3', event: 'CAST_COMPLETE', guard: '', action: '`spawnProjectile()`' },
          { from: 's3', to: 's1', event: 'COOLDOWN_END', guard: '', action: '' },
          { from: 's1', to: 's4', event: 'HP_ZERO', guard: '`hp <= 0`', action: '`emit(death)`' },
        ],
      },
      'api-contract': {
        section: '02', sectionName: 'API 계약', title: 'POST /api/match/create',
        endpoint: '/api/match/create', method: 'POST', auth: 'bearer', slaMs: 200,
        request: '{\n  "userId": "uuid",\n  "mode": "casual" | "ranked" | "custom",\n  "preferredRegion": "ap-northeast-1"\n}',
        response: '{\n  "matchId": "uuid",\n  "gameServer": "host:port",\n  "sessionToken": "jwt",\n  "expiresAt": "2026-05-23T12:34:56Z"\n}',
        errors: [
          { code: '400', message: 'INVALID_MODE', when: '`mode` 가 enum 외 값' },
          { code: '401', message: 'TOKEN_EXPIRED', when: 'Bearer 토큰 만료' },
          { code: '409', message: 'ALREADY_IN_MATCH', when: '동일 userId 가 매치 진행 중' },
          { code: '503', message: 'NO_SERVERS', when: '리전에 가용 게임 서버 없음 → 큐 대기' },
        ],
        idempotencyKey: '`X-Idempotency-Key` 헤더 권장. 동일 키로 24h 내 재요청 시 동일 matchId 반환.',
        notes: '평균 응답 200ms 이하. 99p 500ms 이하. 큐 진입 시 202 + Location 헤더.',
      },
      'acceptance-criteria': {
        section: '03', sectionName: '수락 기준', title: '매칭 시작 — 수락 기준',
        userStory: { as: '신규 유저', want: '첫 매치를 빠르게 시작하길', soThat: 'D1 리텐션 60%↑ 유지' },
        criteria: [
          { id: 'AC-1', given: '유저가 로그인 직후 메인 로비에 진입했다', when: '`매칭` 버튼을 1회 탭한다', then: '3초 이내에 매칭 진행 모달이 표시되고, 카운트다운이 시작된다', edgeCases: ['네트워크 단절 시 5초 후 재시도 안내', '동시에 두 번 탭하면 두 번째 탭은 무시'] },
          { id: 'AC-2', given: '매칭 진행 중이다', when: '60초가 지나도 상대를 못 찾는다', then: '`매칭 범위 확대` 알림 + 봇 매치 옵션 제공', edgeCases: ['랭크 매치는 봇 옵션 미노출'] },
        ],
      },
      'telemetry': {
        section: '04', sectionName: '텔레메트리', title: '매칭 이벤트',
        events: [
          { name: 'match_button_tapped', when: '유저가 매칭 버튼 탭', props: [
            { key: 'mode', type: 'enum', required: true, note: 'casual / ranked / custom' },
            { key: 'session_id', type: 'uuid', required: true, note: '클라이언트 세션' },
          ], kpi: '매칭 시도율' },
          { name: 'match_found', when: '매칭 성공', props: [
            { key: 'match_id', type: 'uuid', required: true, note: '' },
            { key: 'wait_time_ms', type: 'number', required: true, note: '매칭 대기 시간' },
            { key: 'opponent_mmr_delta', type: 'number', required: false, note: '랭크에서만' },
          ], kpi: '평균 매칭 시간' },
          { name: 'match_abandoned', when: '매칭 도중 취소', props: [
            { key: 'reason', type: 'enum', required: true, note: 'user_cancel / timeout / network_error' },
            { key: 'wait_time_ms', type: 'number', required: true, note: '' },
          ], kpi: '매칭 이탈율' },
        ],
        funnels: [
          { name: '매칭 펀넬', steps: ['match_button_tapped', 'match_found', 'match_started'], goal: '진입율 95%↑' },
        ],
      },
      'risk-register': {
        section: '06', sectionName: '위험 등기부', title: '런칭 전 위험',
        risks: [
          { id: 'R-1', title: '매칭 서버 부하 (동접 10만 초과 시 큐 지연)', impact: 5, likelihood: 3, mitigation: '오토스케일 + 봇 매치 폴백 + 큐 대기 UX', owner: '서버팀', status: 'open' },
          { id: 'R-2', title: '결제 모듈 인증 실패 (PG사 API 변경)', impact: 4, likelihood: 2, mitigation: '월 1회 정기 스모크 테스트 + 폴백 PG', owner: 'BM 팀', status: 'mitigated' },
          { id: 'R-3', title: '리텐션 D1 < 40% 시 마케팅 ROI 미달', impact: 4, likelihood: 3, mitigation: '튜토리얼 A/B + 첫 매치 봇 난이도 보정', owner: 'PM', status: 'open' },
          { id: 'R-4', title: '저사양 안드로이드 (RAM 2GB) 60fps 미달', impact: 3, likelihood: 4, mitigation: '품질 옵션 자동 다운그레이드 + 디바이스별 QA 매트릭스', owner: '클라팀', status: 'open' },
        ],
      },
      'roadmap': {
        section: '06', sectionName: '로드맵', title: '런칭 로드맵',
        phases: [
          { name: 'MVP', start: '2026.01', end: '2026.03', deliverables: ['코어 매치 + 단일 모드', '4개 캐릭터', '내부 알파'], dependsOn: [] },
          { name: '알파', start: '2026.03', end: '2026.05', deliverables: ['랭크 모드 추가', '8개 캐릭터', '클로즈드 베타 (500명)'], dependsOn: ['MVP'] },
          { name: '베타', start: '2026.05', end: '2026.07', deliverables: ['BM 시스템', '시즌 패스', '오픈 베타 (10K명)'], dependsOn: ['알파'] },
          { name: '소프트런칭', start: '2026.07', end: '2026.09', deliverables: ['1개 지역 출시', '운영 안정화', 'KPI 검증'], dependsOn: ['베타'] },
          { name: '글로벌 런칭', start: '2026.09', end: '2026.12', deliverables: ['전 지역 출시', '마케팅 캠페인'], dependsOn: ['소프트런칭'] },
        ],
      },
    };
    const newSlide = { id: window.uid(), type, data: templates[type] || {} };
    setProject(p => ({ ...p, slides: [...(p.slides || []), newSlide] }));
    setCurrentIdx((project?.slides || []).length);
    toast('슬라이드 추가됨', 'ok');
  };

  /* 컨셉/선행 기획서를 후속 기획서의 컨텍스트로 빌드.
   * priorIds를 명시하면 그 GDD들의 요약만, 아니면 컨셉에 링크된 모든 작성됨 GDD 요약. */
  const buildGddContext = (conceptOrId, priorIds) => {
    const c = typeof conceptOrId === 'string'
      ? state.concepts.find(x => x.id === conceptOrId)
      : conceptOrId;
    if (!c) return null;
    const ids = (priorIds && priorIds.length)
      ? priorIds
      : (c.recommendedPlans || []).filter(p => p.linkedGddId).map(p => p.linkedGddId);
    const prior = ids
      .map(id => state.projects.find(p => p.id === id))
      .filter(Boolean)
      .map(g => window.summarizeGddForContext(g));
    return { concept: c, prior };
  };

  /* Handle command:
   *  - 현재 GDD가 선택된 상태 → 현재 GDD를 수정 (aiEditGdd)
   *  - 그 외 (컨셉 선택 또는 선택 없음) → 새 GDD 생성 (aiGenerateGdd)
   */
  const sendCommand = async (text, attachments) => {
    // 분기: GDD 가 선택되어 있고, AI 모드일 때는 "수정 명령"으로 처리
    if (selection.type === 'gdd' && project && generationMode === 'ai') {
      commitNow('AI 기획서 수정');
      setIsGenerating(true);
      try {
        // 부모 컨셉 팔레트 추출 → aiEditGdd 의 이미지 생성에 전달
        const _parent = state.concepts?.find(c => c.id === project.conceptId);
        const { project: updated, summary, opsCount } = await aiEditGdd(project, text, attachments, _parent?.palette);
        setProject(_ => updated);
        toast(`수정 완료 (${opsCount}개 변경) — ${summary}`, 'ok');
      } catch (e) {
        console.error(e);
        toast('수정 실패: ' + (e.message || e), 'err');
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // 그 외: 새 GDD 생성 — 순차 스트리밍
    commitNow('AI 기획서 생성');
    setIsGenerating(true);
    try {
      let result;
      const fullCommand = text;
      if (generationMode === 'demo') {
        await new Promise(r => setTimeout(r, 700));
        result = window.generateDemoGdd(fullCommand);
      } else {
        const ctx = concept ? buildGddContext(concept) : null;
        const linkConceptId = concept?.id;
        let createdProjectId = null;
        const onChunk = (chunk) => {
          if (chunk.kind === 'init') {
            createdProjectId = chunk.project.id;
            // 컨셉이 있으면 team 배지 상속 + recommendedPlan 자동 연결
            const projectWithTeam = concept?.badge ? { ...chunk.project, team: concept.badge } : chunk.project;
            setState(s => {
              let newConcepts = s.concepts;
              if (linkConceptId) {
                const newPlan = { id: 'rp' + window.uid().slice(0, 4), title: projectWithTeam.title, description: projectWithTeam.subtitle || '채팅에서 생성', linkedGddId: projectWithTeam.id };
                newConcepts = s.concepts.map(c => c.id === linkConceptId ? { ...c, recommendedPlans: [...(c.recommendedPlans || []), newPlan] } : c);
              }
              return { ...s, concepts: newConcepts, projects: [...s.projects, projectWithTeam], selection: { type: 'gdd', id: projectWithTeam.id } };
            });
            setCurrentIdx(0);
          } else if (chunk.kind === 'batch' && chunk.updates) {
            setState(s => ({
              ...s,
              projects: s.projects.map(p => {
                if (p.id !== createdProjectId) return p;
                const byId = new Map(chunk.updates.map(u => [u.id, u]));
                return { ...p, slides: (p.slides || []).map(slide => byId.get(slide.id) || slide), updatedAt: new Date().toISOString().slice(0, 10) };
              }),
            }));
          } else if (chunk.kind === 'image' && chunk.slideId) {
            setState(s => ({
              ...s,
              projects: s.projects.map(p => {
                if (p.id !== createdProjectId) return p;
                return { ...p, slides: (p.slides || []).map(slide => slide.id === chunk.slideId
                  ? { ...slide, data: { ...slide.data, imageSrc: chunk.imageSrc, ...(chunk.imagePrompt ? { imagePrompt: chunk.imagePrompt } : {}) } }
                  : slide) };
              }),
            }));
          }
        };
        result = await aiGenerateGddTwoStage(fullCommand, state.projects.map(p => p.title), attachments, ctx, {
          selfCritique: generationMode === 'deep',
          onProgress: ({ stage, message }) => { try { toast(`[${stage}] ${message}`, ''); } catch {} },
          onChunk,
        });
      }
      // 메타 마무리
      const historyEntry = {
        ts: new Date().toISOString().slice(0, 16).replace('T', ' '),
        cmd: fullCommand + (attachments?.length ? ` [+${attachments.length}개 첨부]` : ''),
        summary: `${result.slides.length}개 슬라이드 생성`,
      };

      if (generationMode === 'demo') {
        if (concept && concept.badge) result.team = concept.badge;
        result.history = [historyEntry];
        if (attachments?.length) result.attachments = attachments;
        const linkConceptId = concept?.id;
        setState(s => {
          let newConcepts = s.concepts;
          if (linkConceptId) {
            const newPlan = { id: 'rp' + window.uid().slice(0, 4), title: result.title, description: result.subtitle || '채팅에서 생성', linkedGddId: result.id };
            newConcepts = s.concepts.map(c => c.id === linkConceptId ? { ...c, recommendedPlans: [...(c.recommendedPlans || []), newPlan] } : c);
          }
          return { ...s, concepts: newConcepts, projects: [...s.projects, result], selection: { type: 'gdd', id: result.id } };
        });
        setCurrentIdx(0);
      } else {
        // 스트리밍에서 이미 등록 — history/attachments 만 추가
        setState(s => ({
          ...s,
          projects: s.projects.map(p => p.id === result.id ? {
            ...p,
            history: [historyEntry],
            attachments: attachments?.length ? attachments : (p.attachments || []),
          } : p),
        }));
      }
      toast(`"${result.title}" 생성 완료 (${result.slides.length} slides)`, 'ok');
    } catch (e) {
      console.error(e);
      toast('생성 실패: ' + (e.message || e), 'err');
    } finally {
      setIsGenerating(false);
    }
  };

  /* Brief composer submit */
  const [briefMode, setBriefMode] = useState('gdd'); // 'gdd' | 'concept' | 'gdd-linked'
  const [briefPrefill, setBriefPrefill] = useState(null); // {title, brief, linkedPlan}

  const handleBriefSubmit = async ({ title, brief, attachments, mode }) => {
    commitNow('브리프 생성');
    setShowBrief(false);
    setGenerationMode(mode);
    const linkedPlan = briefPrefill?.linkedPlan;
    const conceptIdForLink = briefPrefill?.conceptId;
    setBriefPrefill(null);

    if (briefMode === 'concept') {
      // Generate a concept
      setIsGenerating(true);
      try {
        const text = (title ? title + ' — ' : '') + (brief || '');
        let result;
        if (mode === 'demo') {
          await new Promise(r => setTimeout(r, 600));
          result = { ...window.CONCEPT_BLANK(), title: title || '새 컨셉', subtitle: brief || '한 줄 부제' };
        } else {
          result = await aiGenerateConcept(text, attachments);
        }
        setState(s => ({
          ...s,
          concepts: [...s.concepts, result],
          selection: { type: 'concept', id: result.id },
        }));
        toast(`"${result.title}" 컨셉 생성 완료`, 'ok');
      } catch (e) {
        console.error(e);
        toast('컨셉 생성 실패: ' + (e.message || e), 'err');
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Generate a GDD; if linked, attach to concept
      const text = (title ? title + ' — ' : '') + (brief || '');
      setIsGenerating(true);
      try {
        let result;
        if (mode === 'demo') {
          await new Promise(r => setTimeout(r, 600));
          result = window.generateDemoGdd(text);
        } else {
          // brief에 conceptId가 지정되어 있으면 그 컨셉 + 형제 기획서 요약을 컨텍스트로 전달
          const baseCtx = conceptIdForLink ? buildGddContext(conceptIdForLink) : (concept ? buildGddContext(concept) : null);
          const ctx = baseCtx ? { ...baseCtx, plan: linkedPlan || { title } } : null;
          // 순차 스트리밍 — 각 단계 결과를 즉시 setState 에 반영해 슬라이드가 하나씩 채워지는 모습 노출.
          // 'deep' 모드면 self-critique 까지.
          let createdProjectId = null;
          const onChunk = (chunk) => {
            if (chunk.kind === 'init') {
              // placeholder GDD 즉시 등록 → 사용자가 곧바로 본다
              createdProjectId = chunk.project.id;
              const linkedPlanLocal = linkedPlan;
              setState(s => {
                const newProjects = [...s.projects, chunk.project];
                let newConcepts = s.concepts;
                if (linkedPlanLocal && conceptIdForLink) {
                  newConcepts = s.concepts.map(c => c.id === conceptIdForLink ? {
                    ...c,
                    recommendedPlans: (c.recommendedPlans || []).map(rp => rp.id === linkedPlanLocal.id ? { ...rp, linkedGddId: chunk.project.id } : rp),
                  } : c);
                }
                return { ...s, projects: newProjects, concepts: newConcepts, selection: { type: 'gdd', id: chunk.project.id } };
              });
              setCurrentIdx(0);
            } else if (chunk.kind === 'batch' && chunk.updates) {
              // 슬라이드 단위 업데이트 — 같은 id 의 placeholder 를 실제 내용으로 교체
              setState(s => ({
                ...s,
                projects: s.projects.map(p => {
                  if (p.id !== createdProjectId) return p;
                  const byId = new Map(chunk.updates.map(u => [u.id, u]));
                  return {
                    ...p,
                    slides: (p.slides || []).map(slide => byId.get(slide.id) || slide),
                    updatedAt: new Date().toISOString().slice(0, 10),
                  };
                }),
              }));
            } else if (chunk.kind === 'image' && chunk.slideId) {
              setState(s => ({
                ...s,
                projects: s.projects.map(p => {
                  if (p.id !== createdProjectId) return p;
                  return {
                    ...p,
                    slides: (p.slides || []).map(slide => slide.id === chunk.slideId
                      ? { ...slide, data: { ...slide.data, imageSrc: chunk.imageSrc, ...(chunk.imagePrompt ? { imagePrompt: chunk.imagePrompt } : {}) } }
                      : slide),
                  };
                }),
              }));
            }
          };
          const onProgressCb = ({ stage, message }) => { try { toast(`[${stage}] ${message}`, ''); } catch {} };
          result = await aiGenerateGddTwoStage(text, state.projects.map(p => p.title), attachments, ctx, {
            selfCritique: mode === 'deep',
            onProgress: onProgressCb,
            onChunk,
          });
          // 스트리밍에서 이미 setState 로 모두 반영했으니 메타만 마무리
        }
        const historyEntry = {
          ts: new Date().toISOString().slice(0, 16).replace('T', ' '),
          cmd: text,
          summary: `${result.slides.length}개 슬라이드 생성`,
        };

        if (mode === 'demo') {
          // demo 모드는 streaming 안 했으니 여기서 일괄 등록
          result.history = [historyEntry];
          if (attachments?.length) result.attachments = attachments;
          setState(s => {
            const newProjects = [...s.projects, result];
            let newConcepts = s.concepts;
            if (linkedPlan && conceptIdForLink) {
              newConcepts = s.concepts.map(c => c.id === conceptIdForLink ? {
                ...c,
                recommendedPlans: (c.recommendedPlans || []).map(rp => rp.id === linkedPlan.id ? { ...rp, linkedGddId: result.id } : rp),
              } : c);
            }
            return { ...s, projects: newProjects, concepts: newConcepts, selection: { type: 'gdd', id: result.id } };
          });
          setCurrentIdx(0);
        } else {
          // streaming 모드 — 이미 등록된 project 의 history/attachments 만 추가
          setState(s => ({
            ...s,
            projects: s.projects.map(p => p.id === result.id ? {
              ...p,
              history: [historyEntry],
              attachments: attachments?.length ? attachments : (p.attachments || []),
            } : p),
          }));
        }
        toast(`"${result.title}" 생성 완료 (${result.slides.length} slides)`, 'ok');
      } catch (e) {
        console.error(e);
        toast('생성 실패: ' + (e.message || e), 'err');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const openBriefForConcept = () => {
    setBriefMode('concept');
    setBriefPrefill(null);
    setShowBrief(true);
  };

  /* Concept brief — richer payload with theme/team/author */
  const handleConceptBriefSubmit = async ({ idea, team, author, bgGradient, palette, theme, attachments, mode }) => {
    commitNow('AI 컨셉 생성');
    setShowBrief(false);
    setGenerationMode(mode);
    setIsGenerating(true);
    try {
      let result;
      const command = idea || '랜덤 게임 컨셉';
      if (mode === 'demo') {
        await new Promise(r => setTimeout(r, 600));
        result = {
          ...window.CONCEPT_BLANK(),
          title: '랜덤 컨셉',
          subtitle: idea ? idea.slice(0, 60) : '한 줄 부제',
        };
      } else {
        result = await aiGenerateConcept(command, attachments);
      }
      // Apply user-provided team/author/theme overrides
      if (team) result.badge = team;
      if (author) result.author = author;
      if (theme) result.theme = theme;
      if (palette && palette.length) {
        // Merge: palette from user provides main 3 colors, but keep 5-color shape
        const existing = result.palette || [];
        result.palette = [
          { name: '메인 컬러', hex: palette[0]?.hex || existing[0]?.hex || '#88DFB0' },
          { name: '보조 컬러', hex: palette[1]?.hex || existing[1]?.hex || '#CCFFDA' },
          existing[2] || { name: '보조 2', hex: '#8DF0F0' },
          { name: '강조 컬러', hex: palette[2]?.hex || existing[3]?.hex || '#F5D94F' },
          { name: '배경', hex: (bgGradient && bgGradient[0]) || existing[4]?.hex || '#0A1411' },
        ];
      }
      if (bgGradient) result.bgGradient = bgGradient;

      setState(s => ({
        ...s,
        concepts: [...s.concepts, result],
        selection: { type: 'concept', id: result.id },
      }));
      toast(`"${result.title}" 컨셉 생성 완료`, 'ok');
    } catch (e) {
      console.error(e);
      toast('컨셉 생성 실패: ' + (e.message || e), 'err');
    } finally {
      setIsGenerating(false);
    }
  };

  const openBriefForGdd = () => {
    setBriefMode('gdd');
    setBriefPrefill(null);
    setShowBrief(true);
  };
  const openBriefForRecommendedPlan = (plan) => {
    if (!concept) return;
    setBriefMode('gdd-linked');
    setBriefPrefill({
      title: plan.title,
      brief: plan.description + '\n\n(컨셉: ' + concept.title + ' — ' + concept.subtitle + ')',
      linkedPlan: plan,
      conceptId: concept.id,
    });
    setShowBrief(true);
  };

  /* 일괄 생성: 컨셉의 미작성 recommendedPlans 전체를 AI로 시리얼 생성 */
  const bulkCreatePlansForConcept = async () => {
    if (!concept) return;
    const pending = (concept.recommendedPlans || []).filter(p => !p.linkedGddId);
    if (!pending.length) {
      toast('미작성 기획서가 없습니다.', 'ok');
      return;
    }
    const ok = confirm(
      `미작성 기획서 ${pending.length}개를 AI로 일괄 생성합니다.\n` +
      `Gemini 모델 속도에 따라 약 ${pending.length}~${pending.length * 2}분이 소요될 수 있습니다.\n` +
      `진행하시겠습니까?`
    );
    if (!ok) return;

    commitNow('일괄 기획서 생성');
    setIsGenerating(true);
    const conceptId = concept.id;
    const conceptTitle = concept.title;
    const conceptSubtitle = concept.subtitle || '';
    const conceptBadge = concept.badge;

    // 정합성 보장: 이미 작성된 기획서 ID + 일괄 진행 중 생성된 ID를 누적
    const accumulatedPriorIds = (concept.recommendedPlans || [])
      .filter(p => p.linkedGddId)
      .map(p => p.linkedGddId);
    // 그리고 매 반복마다 직전에 생성된 GDD도 prior에 포함되도록 — 단,
    // setState는 비동기라 즉시 state.projects에서 못 찾을 수 있어 로컬 캐시도 유지
    const sessionGenerated = [];

    let success = 0, failed = 0;
    for (let i = 0; i < pending.length; i++) {
      const plan = pending[i];
      toast(`(${i + 1}/${pending.length}) "${plan.title}" 생성 중…`, '');
      try {
        const text = `${plan.title} — ${plan.description}\n\n(컨셉: ${conceptTitle} — ${conceptSubtitle})`;
        // 컨셉 + 누적 prior (state + 세션 캐시) 모두로 컨텍스트 구성
        const knownProjects = [...state.projects, ...sessionGenerated];
        const prior = accumulatedPriorIds
          .map(id => knownProjects.find(p => p.id === id))
          .filter(Boolean)
          .map(g => window.summarizeGddForContext(g));
        const ctx = { concept, prior, plan };
        // 2단계 파이프라인으로 — 단일 호출은 분량 잘림 위험
        const result = await aiGenerateGddTwoStage(text, knownProjects.map(p => p.title), null, ctx, {
          selfCritique: false,
          onProgress: ({ stage, message }) => { try { toast(`(${i+1}/${pending.length}) [${stage}] ${message}`, ''); } catch {} },
        });
        if (conceptBadge) result.team = conceptBadge;
        result.history = [{
          ts: new Date().toISOString().slice(0, 16).replace('T', ' '),
          cmd: text,
          summary: `${result.slides.length}개 슬라이드 생성 (일괄, 컨텍스트 ${prior.length}개)`,
        }];
        sessionGenerated.push(result);
        accumulatedPriorIds.push(result.id);
        setState(s => {
          const newProjects = [...s.projects, result];
          const newConcepts = s.concepts.map(c => {
            if (c.id !== conceptId) return c;
            return {
              ...c,
              recommendedPlans: (c.recommendedPlans || []).map(rp =>
                rp.id === plan.id ? { ...rp, linkedGddId: result.id } : rp
              ),
            };
          });
          return { ...s, projects: newProjects, concepts: newConcepts };
        });
        success++;
      } catch (e) {
        console.error('bulk fail', plan.title, e);
        failed++;
      }
    }

    setIsGenerating(false);
    toast(
      `일괄 생성 완료 — ${success} 성공${failed ? ` / ${failed} 실패` : ''}`,
      success > 0 ? 'ok' : 'err'
    );
  };

  const newProject = () => {
    commitNow('새 빈 기획서');
    const fresh = window.GDD_BLANK_TEMPLATE();
    setState(s => ({
      ...s,
      projects: [...s.projects, fresh],
      selection: { type: 'gdd', id: fresh.id },
    }));
    setCurrentIdx(0);
    toast('새 빈 기획서 생성됨', 'ok');
  };

  /* === GDD 스냅샷 (컨셉처럼) === */
  const saveGddSnapshot = () => {
    if (selection.type !== 'gdd' || !project) {
      toast('기획서를 선택한 상태에서만 스냅샷 저장이 가능합니다.', 'err');
      return;
    }
    const defaultName = `${project.title} - ${new Date().toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
    const name = prompt('스냅샷 이름:', defaultName);
    if (!name) return;
    const snapshot = {
      id: 's' + uid(),
      name,
      ts: new Date().toISOString(),
      data: JSON.parse(JSON.stringify({
        ...project,
        snapshots: undefined,
      })),
    };
    commitNow('GDD 스냅샷 저장');
    setProject(p => ({ ...p, snapshots: [...(p.snapshots || []), snapshot] }));
    toast(`스냅샷 "${name}" 저장됨`, 'ok');
  };
  const restoreGddSnapshot = (snap) => {
    if (selection.type !== 'gdd' || !project) return;
    if (!confirm(`"${snap.name}" 스냅샷으로 복원하시겠습니까? 현재 상태는 자동 백업됩니다.`)) return;
    const backup = {
      id: 's' + uid(),
      name: '자동 백업 ' + new Date().toLocaleString('ko-KR'),
      ts: new Date().toISOString(),
      data: JSON.parse(JSON.stringify({ ...project, snapshots: undefined })),
    };
    commitNow('GDD 스냅샷 복원');
    setProject(p => ({
      ...snap.data,
      id: p.id,
      snapshots: [...(p.snapshots || []), backup],
    }));
    toast('스냅샷 복원됨', 'ok');
  };
  const [showGddSnapshots, setShowGddSnapshots] = useState(false);

  /* Delete slide */
  const deleteSlide = (slideId) => {
    if (selection.type !== 'gdd' || !project) return;
    commitNow('슬라이드 삭제');
    const slides = (project.slides || []).filter(s => s.id !== slideId);
    setProject(p => ({ ...p, slides, updatedAt: new Date().toISOString().slice(0, 10) }));
    if (currentIdx >= slides.length) setCurrentIdx(Math.max(0, slides.length - 1));
    toast('슬라이드 삭제됨', 'ok');
  };

  /* Move slide (delta: -1 = up, +1 = down) */
  const moveSlide = (fromIdx, delta) => {
    if (selection.type !== 'gdd' || !project) return;
    commitNow('슬라이드 이동');
    const slides = [...(project.slides || [])];
    const toIdx = fromIdx + delta;
    if (toIdx < 0 || toIdx >= slides.length) return;
    [slides[fromIdx], slides[toIdx]] = [slides[toIdx], slides[fromIdx]];
    setProject(p => ({ ...p, slides, updatedAt: new Date().toISOString().slice(0, 10) }));
    if (currentIdx === fromIdx) setCurrentIdx(toIdx);
    else if (currentIdx === toIdx) setCurrentIdx(fromIdx);
  };

  /* Delete project or concept */
  const deleteItem = (type, id) => {
    commitNow(type === 'gdd' ? '기획서 삭제' : '컨셉 삭제');
    if (type === 'gdd') {
      const projectsLeft = state.projects.filter(p => p.id !== id);
      // Also unlink from any concept that referenced this gdd
      const concepts = state.concepts.map(c => ({
        ...c,
        recommendedPlans: (c.recommendedPlans || []).map(rp => rp.linkedGddId === id ? { ...rp, linkedGddId: null } : rp),
      }));
      let nextSelection = state.selection;
      if (state.selection.type === 'gdd' && state.selection.id === id) {
        nextSelection = concepts[0] ? { type: 'concept', id: concepts[0].id } : (projectsLeft[0] ? { type: 'gdd', id: projectsLeft[0].id } : { type: 'concept', id: null });
      }
      setState({ ...state, projects: projectsLeft, concepts, selection: nextSelection });
    } else if (type === 'concept') {
      const conceptsLeft = state.concepts.filter(c => c.id !== id);
      let nextSelection = state.selection;
      if (state.selection.type === 'concept' && state.selection.id === id) {
        nextSelection = conceptsLeft[0] ? { type: 'concept', id: conceptsLeft[0].id } : (state.projects[0] ? { type: 'gdd', id: state.projects[0].id } : { type: 'concept', id: null });
      }
      setState({ ...state, concepts: conceptsLeft, selection: nextSelection });
    }
    toast('삭제됨', 'ok');
  };

  /* Esc + arrow keys + Ctrl+C/V/X */
  useEffect(() => {
    const isTypingTarget = (el) => {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (el.isContentEditable) return true;
      return false;
    };
    const hasTextSelection = () => {
      const sel = window.getSelection && window.getSelection();
      return !!(sel && !sel.isCollapsed && (sel.toString() || '').length > 0);
    };
    const anyModalOpen = () => (
      showAddMenu || showBrief || showSettings || showCmdK || showShortcuts || showGddSnapshots || showStats || showConsistency
    );
    const inSlideContext = () => (selection.type === 'gdd' && view === 'slide' && !!project);

    const onKey = (e) => {
      const isTyping = isTypingTarget(document.activeElement);
      const ctrl = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl+K — 어디서든 명령 팔레트
      if (ctrl && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setShowCmdK(v => !v);
        return;
      }
      // Cmd/Ctrl+S — 강제 저장
      if (ctrl && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        const payload = { projects: stateRef.current.projects, concepts: stateRef.current.concepts, selection: stateRef.current.selection };
        if (window.gddStorage) window.gddStorage.saveState(payload).then(() => toast('저장됨', 'ok')).catch(e => toast('저장 실패: ' + e.message, 'err'));
        return;
      }
      // Cmd/Ctrl+Shift+Z — Redo
      if (ctrl && e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        if (isTyping) return; // contentEditable native undo 보호
        e.preventDefault();
        if (redo()) toast('다시 실행', '');
        else toast('다시 실행할 항목이 없습니다', '');
        return;
      }
      // Cmd/Ctrl+Z — Undo (텍스트 편집 중이면 브라우저 native undo가 처리)
      if (ctrl && (e.key === 'z' || e.key === 'Z')) {
        if (isTyping) return;
        e.preventDefault();
        if (undo()) toast('실행 취소', '');
        else toast('실행 취소할 항목이 없습니다', '');
        return;
      }
      // Cmd/Ctrl+D — 현재 슬라이드 복제
      if (ctrl && (e.key === 'd' || e.key === 'D')) {
        if (isTyping || !inSlideContext()) return;
        e.preventDefault();
        const slides = project.slides || [];
        const cur = slides[currentIdx];
        if (!cur) return;
        commitNow('슬라이드 복제');
        const dup = { id: uid(), type: cur.type, data: JSON.parse(JSON.stringify(cur.data || {})) };
        setProject(p => ({
          ...p,
          slides: [...slides.slice(0, currentIdx + 1), dup, ...slides.slice(currentIdx + 1)],
        }));
        setCurrentIdx(currentIdx + 1);
        toast('슬라이드 복제됨', 'ok');
        return;
      }
      // Cmd/Ctrl+C / X / V — 슬라이드 단위 클립보드
      // 텍스트 입력/선택이 있을 때는 브라우저 기본 동작을 방해하지 않는다.
      if (ctrl && !e.shiftKey && !e.altKey && (e.key === 'c' || e.key === 'C')) {
        if (isTyping || hasTextSelection()) return;
        if (!inSlideContext() || anyModalOpen()) return;
        const cur = (project.slides || [])[currentIdx];
        if (!cur) return;
        e.preventDefault();
        slideClipRef.current = { type: cur.type, data: JSON.parse(JSON.stringify(cur.data || {})) };
        toast('슬라이드 복사됨', 'ok');
        return;
      }
      if (ctrl && !e.shiftKey && !e.altKey && (e.key === 'x' || e.key === 'X')) {
        if (isTyping || hasTextSelection()) return;
        if (!inSlideContext() || anyModalOpen()) return;
        const curSlides = project.slides || [];
        const cur = curSlides[currentIdx];
        if (!cur) return;
        e.preventDefault();
        slideClipRef.current = { type: cur.type, data: JSON.parse(JSON.stringify(cur.data || {})) };
        commitNow('슬라이드 잘라내기');
        // 함수형 updater 내부에서 slides 를 다시 계산 (stale closure 방지)
        setProject(p => {
          const slidesNow = p.slides || [];
          const idx = Math.min(currentIdx, slidesNow.length - 1);
          if (idx < 0) return p;
          const filtered = slidesNow.filter((_, i) => i !== idx);
          return { ...p, slides: filtered, updatedAt: new Date().toISOString().slice(0, 10) };
        });
        if (currentIdx >= curSlides.length - 1) setCurrentIdx(Math.max(0, curSlides.length - 2));
        toast('슬라이드 잘라내기', 'ok');
        return;
      }
      if (ctrl && !e.shiftKey && !e.altKey && (e.key === 'v' || e.key === 'V')) {
        if (isTyping) return;
        if (!inSlideContext() || anyModalOpen()) return;
        const clip = slideClipRef.current;
        if (!clip) { toast('붙여넣을 슬라이드가 없습니다', ''); return; }
        e.preventDefault();
        commitNow('슬라이드 붙여넣기');
        const dup = { id: uid(), type: clip.type, data: JSON.parse(JSON.stringify(clip.data || {})) };
        // 함수형 updater 내부에서 slides 를 다시 계산 (stale closure 방지)
        let plannedInsertAt = currentIdx + 1;
        setProject(p => {
          const slidesNow = p.slides || [];
          const insertAt = Math.min(slidesNow.length, currentIdx + 1);
          plannedInsertAt = insertAt;
          return {
            ...p,
            slides: [...slidesNow.slice(0, insertAt), dup, ...slidesNow.slice(insertAt)],
            updatedAt: new Date().toISOString().slice(0, 10),
          };
        });
        setCurrentIdx(plannedInsertAt);
        toast('슬라이드 붙여넣기', 'ok');
        return;
      }
      // ? — 단축키 도움말
      if (!isTyping && (e.key === '?' || (e.shiftKey && e.key === '/'))) {
        e.preventDefault();
        setShowShortcuts(v => !v);
        return;
      }
      if (e.key === 'Escape') {
        if (showShortcuts) { setShowShortcuts(false); return; }
        if (showCmdK) { setShowCmdK(false); return; }
        if (showStats) { setShowStats(false); return; }
        if (showConsistency) { setShowConsistency(false); return; }
        if (showAddMenu) setShowAddMenu(false);
        if (showBrief) setShowBrief(false);
        if (showSettings) setShowSettings(false);
        if (showGddSnapshots) setShowGddSnapshots(false);
        return;
      }
      // Alt + Arrow — 현재 슬라이드를 앞/뒤로 이동(재정렬)
      const isArrow = e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'PageUp' || e.key === 'PageDown';
      if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        if (anyModalOpen()) return;
        if (!inSlideContext()) return;
        if (isTyping) return;
        const slides = project.slides || [];
        if (slides.length < 2) return;
        const delta = (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 1;
        const toIdx = currentIdx + delta;
        if (toIdx < 0 || toIdx >= slides.length) return;
        e.preventDefault();
        commitNow('슬라이드 위치 이동');
        const next = [...slides];
        [next[currentIdx], next[toIdx]] = [next[toIdx], next[currentIdx]];
        setProject(p => ({ ...p, slides: next, updatedAt: new Date().toISOString().slice(0, 10) }));
        setCurrentIdx(toIdx);
        return;
      }
      // 슬라이드 이동(네비게이션): GDD 슬라이드 뷰에서, 편집 중이 아니고, 모달도 닫혀있을 때
      if (!isArrow) return;
      if (anyModalOpen()) return;
      if (!inSlideContext()) return;
      if (isTypingTarget(document.activeElement)) return;
      const slides = project.slides || [];
      if (!slides.length) return;
      const goPrev = e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp';
      const goNext = e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown';
      if (goPrev && currentIdx > 0) {
        e.preventDefault();
        setCurrentIdx(currentIdx - 1);
      } else if (goNext && currentIdx < slides.length - 1) {
        e.preventDefault();
        setCurrentIdx(currentIdx + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showAddMenu, showBrief, showSettings, showCmdK, showShortcuts, showGddSnapshots, showStats, showConsistency, selection.type, view, project, currentIdx]);

  const addComment = (c) => {
    if (selection.type !== 'gdd') return;
    setProject(p => ({ ...p, comments: [...(p.comments || []), c] }));
  };

  const downloadPptx = async () => {
    if (!project) {
      toast('컨셉은 PPTX 다운로드를 지원하지 않습니다. 기획서를 선택하세요.', 'err');
      return;
    }
    setIsDownloading(true);
    try {
      await exportPptx(project);
      toast('PPTX 다운로드 완료', 'ok');
    } catch (e) {
      console.error(e);
      toast('PPTX 생성 실패: ' + (e.message || e), 'err');
    } finally {
      setIsDownloading(false);
    }
  };

  // Reset slide idx when selection changes
  useEffect(() => {
    setCurrentIdx(0);
  }, [selection.id, selection.type]);

  if (!project && !concept) {
    return <div style={{ padding: 40 }}>선택된 항목이 없습니다. 좌측에서 컨셉이나 기획서를 선택하세요.</div>;
  }

  return (
    <div className="app">
      <TopBar
        project={project || concept}
        view={view}
        setView={setView}
        onDownload={downloadPptx}
        isDownloading={isDownloading}
        onRename={(t) => {
          if (selection.type === 'gdd') setProject(p => ({ ...p, title: t }));
          else setConcept(c => ({ ...c, title: t }));
        }}
        tweaks={tweaks}
        isConcept={selection.type === 'concept'}
        onOpenSettings={() => setShowSettings(true)}
        hasApiKey={hasApiKey}
        usageTick={usageTick}
        onOpenCmdK={() => setShowCmdK(true)}
        onSaveSnapshot={saveGddSnapshot}
        onOpenSnapshots={() => setShowGddSnapshots(true)}
        onOpenQualityGate={() => setShowQualityGate(true)}
        onExport={async () => {
          try {
            const json = await window.gddStorage.exportProject();
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const ts = new Date().toISOString().slice(0, 10);
            a.href = url; a.download = `gdd-project-${ts}.gddproject`;
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            toast('프로젝트 내보내기 완료', 'ok');
          } catch (e) {
            toast('내보내기 실패: ' + (e.message || e), 'err');
          }
        }}
        onImport={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.gddproject,.json,application/json';
          input.onchange = async () => {
            const f = input.files?.[0];
            if (!f) return;
            if (!confirm(`"${f.name}"을(를) 불러옵니다. 현재 작업은 비상 백업으로 보존됩니다. 진행하시겠습니까?`)) return;
            try {
              commitNow('프로젝트 가져오기');
              // 안전: 현재 state 비상 백업
              await window.gddStorage.saveEmergency({ projects: state.projects, concepts: state.concepts, selection: state.selection });
              const text = await f.text();
              const newState = await window.gddStorage.importProject(text);
              setState({
                concepts: newState.concepts || [],
                projects: newState.projects || [],
                selection: newState.selection || { type: 'concept', id: newState.concepts?.[0]?.id },
              });
              setCurrentIdx(0);
              toast('프로젝트 불러오기 완료', 'ok');
            } catch (e) {
              toast('불러오기 실패: ' + (e.message || e), 'err');
            }
          };
          input.click();
        }}
      />
      <Sidebar
        concepts={state.concepts}
        projects={state.projects}
        selection={selection}
        onSelect={(type, id) => setState(s => ({ ...s, selection: { type, id } }))}
        onNewBlank={newProject}
        onOpenConceptBrief={openBriefForConcept}
        onOpenGddBrief={openBriefForGdd}
        onDelete={deleteItem}
      />

      <div className="canvas">
        {selection.type === 'concept' ? (
          <div className="canvas-main">
            <ConceptView
              concept={concept}
              patch={(next) => setState(s => ({ ...s, concepts: s.concepts.map(c => c.id === concept.id ? next : c) }))}
              onCreateGdd={openBriefForRecommendedPlan}
              onOpenGdd={(gddId) => setState(s => ({ ...s, selection: { type: 'gdd', id: gddId } }))}
              onBulkCreate={bulkCreatePlansForConcept}
              isGenerating={isGenerating}
              toast={toast}
            />
          </div>
        ) : (
          <>
            <div className="canvas-toolbar">
              <input
                className="title-inline"
                value={project.title}
                onChange={e => setProject(p => ({ ...p, title: e.target.value }))}
              />
              <span style={{ color: 'var(--text-4)' }}>by</span>
              <input
                className="author-inline"
                value={project.author}
                onChange={e => setProject(p => ({ ...p, author: e.target.value }))}
              />
              <span style={{ color: 'var(--text-4)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>· {project.version} · {project.updatedAt}</span>
              <div style={{ flex: 1 }}></div>
              {view === 'slide' && (
                <button className="btn ghost" onClick={() => setShowAddMenu(true)}>+ 슬라이드</button>
              )}
            </div>
            <div className="canvas-main">
              {view === 'slide' && tweaks.showThumbs && (
                <Thumbs
                  slides={project.slides || []}
                  currentIdx={currentIdx}
                  setCurrentIdx={setCurrentIdx}
                  onAddSlide={() => setShowAddMenu(true)}
                  onDeleteSlide={deleteSlide}
                  onMoveSlide={moveSlide}
                />
              )}
              {view === 'slide' && (
                <SlideStage
                  project={project}
                  patchSlide={patchSlide}
                  replaceSlide={(slideId, newSlide) => {
                    commitNow('슬라이드 변환');
                    setProject(p => ({
                      ...p,
                      slides: (p.slides || []).map(s => s.id === slideId ? { ...s, ...newSlide } : s),
                      updatedAt: new Date().toISOString().slice(0, 10),
                    }));
                  }}
                  onSplitSlide={(slideId) => {
                    if (!window.gddSlideSplitter) return;
                    commitNow('슬라이드 분할');
                    setProject(p => {
                      const slides = p.slides || [];
                      const idx = slides.findIndex(s => s.id === slideId);
                      if (idx < 0) return p;
                      const parts = window.gddSlideSplitter.splitSlide(slides[idx]);
                      if (parts.length <= 1) return p;
                      const next = [...slides.slice(0, idx), ...parts, ...slides.slice(idx + 1)];
                      return { ...p, slides: next, updatedAt: new Date().toISOString().slice(0, 10) };
                    });
                    toast('슬라이드 분할 완료', 'ok');
                  }}
                  scale={scale}
                  setScale={setScale}
                  currentIdx={currentIdx}
                  setCurrentIdx={setCurrentIdx}
                  isGenerating={isGenerating}
                />
              )}
              {view === 'doc' && (
                <DocumentView
                  project={project}
                  patchSlide={patchSlide}
                  onPatchProject={(u) => setProject(p => ({ ...p, ...u }))}
                />
              )}
            </div>
          </>
        )}
      </div>

      <RightPanel
        project={project || concept}
        isConcept={selection.type === 'concept'}
        onSendCommand={sendCommand}
        isGenerating={isGenerating}
        generationMode={generationMode}
        setGenerationMode={setGenerationMode}
        onAddComment={addComment}
      />

      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      {showConsistency && concept && (
        <ConsistencyModal
          concept={concept}
          projects={state.projects}
          onClose={() => setShowConsistency(false)}
          onGoto={(g) => { setState(s => ({ ...s, selection: g })); setShowConsistency(false); }}
        />
      )}
      {showStats && (
        <StatsModal
          state={state}
          onClose={() => setShowStats(false)}
        />
      )}
      {showQualityGate && project && (
        <QualityGateModal
          project={project}
          onClose={() => setShowQualityGate(false)}
        />
      )}
      {showGddSnapshots && (
        <GddSnapshotsModal
          project={project}
          onClose={() => setShowGddSnapshots(false)}
          onRestore={(s) => { restoreGddSnapshot(s); setShowGddSnapshots(false); }}
        />
      )}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSaved={() => {
            setHasApiKey(!!(window.gemini?.getApiKey && window.gemini.getApiKey()));
            toast('Gemini 설정 저장됨', 'ok');
          }}
        />
      )}

      {/* Cmd+K 명령 팔레트 */}
      {window.CommandPalette && (
        <window.CommandPalette
          open={showCmdK}
          onClose={() => setShowCmdK(false)}
          state={state}
          onGoto={(goto) => {
            if (goto.type === 'gdd') {
              setState(s => ({ ...s, selection: { type: 'gdd', id: goto.id } }));
              if (typeof goto.slideIdx === 'number') setTimeout(() => setCurrentIdx(goto.slideIdx), 50);
            } else if (goto.type === 'concept') {
              setState(s => ({ ...s, selection: { type: 'concept', id: goto.id } }));
            }
          }}
          actions={[
            { id: 'new-concept', title: '✦ 새 컨셉 만들기', sub: 'AI 컨셉 브리프 열기', shortcut: 'CMD', keywords: ['컨셉', 'concept', '새로'], run: () => setShowBrief(true) || setBriefMode('concept') },
            { id: 'new-gdd', title: '+ 새 기획서 추가', sub: 'AI 기획서 브리프 열기', shortcut: 'CMD', keywords: ['gdd', '기획서', '새로'], run: () => { setBriefMode('gdd'); setBriefPrefill(null); setShowBrief(true); } },
            { id: 'export', title: '↓ 프로젝트 내보내기', sub: '.gddproject 파일로 백업', shortcut: 'CMD', keywords: ['export', '백업', '내보내기', 'backup'], run: async () => {
              try {
                const json = await window.gddStorage.exportProject();
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const ts = new Date().toISOString().slice(0, 10);
                a.href = url; a.download = `gdd-project-${ts}.gddproject`;
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                toast('내보내기 완료', 'ok');
              } catch (e) { toast('내보내기 실패: ' + e.message, 'err'); }
            }},
            { id: 'settings', title: '⚙ 설정', sub: 'Gemini 키 / 모델 / 사용량', shortcut: 'CMD', keywords: ['설정', 'settings', 'api', 'key'], run: () => setShowSettings(true) },
            { id: 'view-slide', title: '슬라이드 뷰로 전환', sub: '', shortcut: 'CMD', keywords: ['slide', '슬라이드'], run: () => setView('slide') },
            { id: 'view-doc', title: '문서 뷰로 전환', sub: '', shortcut: 'CMD', keywords: ['doc', '문서'], run: () => setView('doc') },
            { id: 'download-pptx', title: '↓ PPTX 다운로드', sub: '현재 기획서를 PPTX로', shortcut: 'CMD', keywords: ['pptx', 'powerpoint', '다운로드'], run: downloadPptx },
            { id: 'download-pdf', title: '↓ PDF 다운로드', sub: '슬라이드를 PDF로 출력', shortcut: 'CMD', keywords: ['pdf', '다운로드', '출력', 'print'], run: async () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try { toast('PDF 생성 중… 잠시만 기다려주세요', ''); await window.exportPdf(project); toast('PDF 다운로드 완료', 'ok'); }
              catch (e) { toast('PDF 실패: ' + e.message, 'err'); }
            }},
            { id: 'download-md', title: '↓ Markdown 다운로드', sub: '.md (GitHub/Notion 친화)', shortcut: 'CMD', keywords: ['markdown', 'md', '다운로드'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try { window.exportMarkdown(project); toast('Markdown 다운로드 완료', 'ok'); }
              catch (e) { toast('MD 실패: ' + e.message, 'err'); }
            }},
            { id: 'slide-png', title: '🖼 현재 슬라이드 PNG', sub: '1280×720 @ 2x 캡처', shortcut: 'CMD', keywords: ['png', '슬라이드', '이미지'], run: async () => {
              if (!project) return;
              const cur = (project.slides || [])[currentIdx];
              if (!cur) return;
              try { toast('PNG 생성 중…', ''); await window.exportSlidePng(cur, currentIdx + 1, project.slides.length); toast('PNG 저장됨', 'ok'); }
              catch (e) { toast('PNG 실패: ' + e.message, 'err'); }
            }},
            { id: 'slide-svg', title: '⤓ 현재 슬라이드 SVG', sub: 'flow/diagram 전용', shortcut: 'CMD', keywords: ['svg', '벡터', 'flow', 'diagram'], run: () => {
              if (!project) return;
              const cur = (project.slides || [])[currentIdx];
              if (!cur) return;
              try { window.exportSlideSvg(cur); toast('SVG 저장됨', 'ok'); }
              catch (e) { toast(e.message, 'err'); }
            }},
            { id: 'gc-images', title: '🗑 사용하지 않는 이미지 정리', sub: '스토리지 공간 회수', shortcut: 'CMD', keywords: ['gc', '정리', 'cleanup', '이미지'], run: async () => {
              try {
                const n = await window.gddStorage.gcImages();
                toast(`사용하지 않는 이미지 ${n}개 정리`, 'ok');
              } catch (e) { toast('정리 실패', 'err'); }
            }},
            { id: 'split-overflowing', title: '✂️ 오버플로 슬라이드 일괄 분할', sub: '슬라이드 영역을 초과하는 모든 슬라이드를 분할 규칙에 따라 N장으로 나눔', shortcut: 'CMD', keywords: ['split', '분할', 'overflow', '오버플로'], run: () => {
              if (selection.type !== 'gdd' || !project) { toast('기획서를 선택하세요', 'err'); return; }
              if (!window.gddSlideSplitter) { toast('splitter 미로드', 'err'); return; }
              const overflowing = (project.slides || []).filter(s => window.gddSlideSplitter.shouldSplit(s));
              if (overflowing.length === 0) { toast('분할이 필요한 슬라이드가 없습니다', 'ok'); return; }
              if (!confirm(`${overflowing.length}개 슬라이드가 분할 권장 상태입니다. 일괄 분할할까요?`)) return;
              commitNow('오버플로 슬라이드 일괄 분할');
              setProject(p => {
                const next = window.gddSlideSplitter.splitAllOverflowing(p.slides || []);
                return { ...p, slides: next, updatedAt: new Date().toISOString().slice(0, 10) };
              });
              toast(`${overflowing.length}개 슬라이드를 분할했습니다`, 'ok');
            }},
            { id: 'drill-down', title: '✦ 현재 슬라이드 드릴다운 생성', sub: '현재 슬라이드의 핵심 부분을 더 상세한 슬라이드로 확장 (parent-child)', shortcut: 'CMD', keywords: ['drill', '드릴다운', '상세', 'detail', '확장'], run: async () => {
              if (selection.type !== 'gdd' || !project) { toast('기획서를 선택하세요', 'err'); return; }
              const cur = (project.slides || [])[currentIdx];
              if (!cur) return;
              const ask = prompt(`"${cur.data?.title || cur.type}" 슬라이드의 어느 부분을 더 상세히 다룰까요?\n예: "decision 노드 'HP ≤ 0' 의 sub-flow", "Player 클래스의 state-machine", "first criterion 의 edge case 4개 추가"`);
              if (!ask) return;
              commitNow('드릴다운 생성');
              setIsGenerating(true);
              try {
                // aiEditGdd 의 add op 와 동일한 흐름이지만 메타에 parentRef 를 명시
                const parentRef = { slideId: cur.id, slideTitle: cur.data?.title || '', anchor: ask };
                const editPrompt = `현재 슬라이드 (${cur.type} "${cur.data?.title || ''}") 의 다음 부분을 더 상세한 1~2개의 새 슬라이드로 확장하라:\n\n"${ask}"\n\n새 슬라이드를 add op 로 현재 슬라이드 바로 뒤에 삽입. 각 슬라이드의 data._parent 필드에 ${JSON.stringify(parentRef)} 그대로 포함.`;
                // 부모 컨셉 팔레트 → 이미지 생성에 반영
                const _drillParent = state.concepts?.find(c => c.id === project.conceptId);
                const { project: updated, summary } = await aiEditGdd(project, editPrompt, [], _drillParent?.palette);
                setProject(_ => updated);
                toast(`드릴다운 — ${summary}`, 'ok');
              } catch (e) {
                toast('드릴다운 실패: ' + e.message, 'err');
              } finally {
                setIsGenerating(false);
              }
            }},
            { id: 'gen-missing-images', title: '🍌 누락된 이미지 모두 생성', sub: '현재 GDD 에서 imageSrc 가 비어있는 슬라이드 모두 일괄 생성', shortcut: 'CMD', keywords: ['이미지', '생성', 'image', 'banana', '누락', 'missing'], run: async () => {
              if (selection.type !== 'gdd' || !project) { toast('기획서를 선택하세요', 'err'); return; }
              const targets = (project.slides || [])
                .map((s, idx) => ({ s, idx }))
                .filter(({ s }) => ['cover', 'section-divider', 'ui-design', 'image-embed'].includes(s.type) && !s.data?.imageSrc);
              if (targets.length === 0) { toast('누락된 이미지가 없습니다', 'ok'); return; }
              if (!confirm(`${targets.length}개 슬라이드의 누락 이미지를 nano-banana 로 생성합니다.\n예상 비용: 약 $${(targets.length * 0.03).toFixed(2)}.\n진행하시겠습니까?`)) return;
              commitNow(`누락 이미지 ${targets.length}개 일괄 생성`);
              setIsGenerating(true);
              let ok = 0, fail = 0;
              // 프로젝트의 부모 컨셉 팔레트 추출 (있으면 이미지 생성에 반영)
              const parentConcept = state.concepts?.find(c => c.id === project.conceptId);
              const projectPalette = parentConcept?.palette;
              try {
                for (const { s, idx } of targets) {
                  let p = s.data?.imagePrompt;
                  if (!p || !p.trim()) {
                    p = synthesizeImagePrompt(s, { title: project.title, subtitle: project.subtitle });
                  }
                  if (!p) { fail++; continue; }
                  try {
                    const src = await window.gemini.generateImage(p, { palette: projectPalette });
                    // 각 이미지 생성 직후 setProject 로 즉시 반영 — 진행률 시각화
                    setProject(pr => ({
                      ...pr,
                      slides: (pr.slides || []).map((sl, i) => i === idx ? { ...sl, data: { ...sl.data, imageSrc: src, imagePrompt: p } } : sl),
                      updatedAt: new Date().toISOString().slice(0, 10),
                    }));
                    ok++;
                    toast(`(${ok + fail}/${targets.length}) "${s.data?.title || s.type}" 생성`, '');
                  } catch (e) {
                    fail++;
                  }
                }
                toast(`완료 — 성공 ${ok}장${fail ? ` / 실패 ${fail}장` : ''}`, ok > 0 ? 'ok' : 'err');
              } finally {
                setIsGenerating(false);
              }
            }},
            { id: 'shortcuts', title: '⌨ 단축키 도움말', sub: '?', shortcut: 'CMD', keywords: ['shortcut', '단축키', 'help', '도움말'], run: () => setShowShortcuts(true) },
            { id: 'undo', title: '↶ 실행 취소', sub: `${navigator.platform.match(/Mac/) ? '⌘' : 'Ctrl'}+Z`, shortcut: 'CMD', keywords: ['undo', '취소', 'revert'], run: () => { if (!undo()) toast('취소할 항목 없음', ''); } },
            { id: 'redo', title: '↷ 다시 실행', sub: `${navigator.platform.match(/Mac/) ? '⌘' : 'Ctrl'}+⇧+Z`, shortcut: 'CMD', keywords: ['redo', '다시'], run: () => { if (!redo()) toast('재실행할 항목 없음', ''); } },
            { id: 'save-snapshot', title: '📸 기획서 스냅샷 저장', sub: '현재 기획서를 시점 저장', shortcut: 'CMD', keywords: ['snapshot', '스냅샷', 'save'], run: saveGddSnapshot },
            { id: 'open-snapshots', title: '⌖ 스냅샷 히스토리', sub: '기획서 스냅샷 목록', shortcut: 'CMD', keywords: ['history', 'snapshot'], run: () => setShowGddSnapshots(true) },
            { id: 'consistency', title: '🧐 컨셉 일관성 점검', sub: '용어/필드/누락 자동 분석', shortcut: 'CMD', keywords: ['일관성', 'consistency', 'lint', '검증', '점검'], run: () => {
              if (!concept) { toast('컨셉을 선택하세요', 'err'); return; }
              setShowConsistency(true);
            }},
            { id: 'stats', title: '📊 작업 통계 대시보드', sub: '활동/도메인/AI 사용량', shortcut: 'CMD', keywords: ['stats', '통계', 'dashboard', '대시보드'], run: () => setShowStats(true) },
            { id: 'quality-gate', title: '🎯 품질 점수 확인', sub: '7개 차원 점수표 + 보강 권장', shortcut: 'CMD', keywords: ['quality', '품질', 'score', '점수', '게이트'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              setShowQualityGate(true);
            }},
            { id: 'export-ts', title: '⤓ TypeScript interface 내보내기', sub: 'class-diagram → .ts', shortcut: 'CMD', keywords: ['typescript', 'ts', 'export', 'interface'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const out = window.gddExportAdapters.exportTypeScript(project);
                downloadBlob(out, `${project.title || 'gdd'}.types.ts`, 'text/typescript');
                toast('types.ts 다운로드 완료', 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
            { id: 'export-json-schema', title: '⤓ JSON Schema 내보내기', sub: 'data-table → JSON Schema 2020-12', shortcut: 'CMD', keywords: ['json schema', 'schema', 'export'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const out = window.gddExportAdapters.exportJsonSchema(project);
                downloadBlob(out, `${project.title || 'gdd'}.schemas.json`, 'application/json');
                toast('schemas.json 다운로드 완료', 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
            { id: 'export-zod', title: '⤓ Zod 스키마 내보내기', sub: 'data-table → Zod', shortcut: 'CMD', keywords: ['zod', 'export'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const out = window.gddExportAdapters.exportZod(project);
                downloadBlob(out, `${project.title || 'gdd'}.zod.ts`, 'text/typescript');
                toast('zod.ts 다운로드 완료', 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
            { id: 'export-xstate', title: '⤓ XState 머신 내보내기', sub: 'state-machine → XState v5 JSON', shortcut: 'CMD', keywords: ['xstate', 'state', 'machine'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const out = window.gddExportAdapters.exportXState(project);
                downloadBlob(out, `${project.title || 'gdd'}.machines.json`, 'application/json');
                toast('machines.json 다운로드 완료', 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
            { id: 'export-openapi', title: '⤓ OpenAPI YAML 내보내기', sub: 'api-contract → OpenAPI 3.1', shortcut: 'CMD', keywords: ['openapi', 'swagger', 'yaml'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const out = window.gddExportAdapters.exportOpenApi(project);
                downloadBlob(out, `${project.title || 'gdd'}.openapi.yaml`, 'text/yaml');
                toast('openapi.yaml 다운로드 완료', 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
            { id: 'export-gherkin', title: '⤓ Gherkin feature 내보내기', sub: 'acceptance-criteria → .feature', shortcut: 'CMD', keywords: ['gherkin', 'cucumber', 'feature', 'bdd'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const out = window.gddExportAdapters.exportGherkin(project);
                downloadBlob(out, `${project.title || 'gdd'}.feature`, 'text/plain');
                toast('feature 파일 다운로드 완료', 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
            { id: 'export-balance-csv', title: '⤓ 밸런싱 CSV 내보내기', sub: 'balance-table → .csv (Google Sheets)', shortcut: 'CMD', keywords: ['csv', 'balance', '밸런싱', 'export'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const out = window.gddExportAdapters.exportBalanceCsv(project);
                downloadBlob(out, `${project.title || 'gdd'}.balance.csv`, 'text/csv');
                toast('balance.csv 다운로드 완료', 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
            ...((window.gddGenres?.GENRES || []).map(g => ({
              id: 'genre-' + g.id,
              title: `🎮 [장르] ${g.name} 빈 기획서`,
              sub: g.description,
              shortcut: 'CMD',
              keywords: ['장르', 'genre', 'template', g.name, ...(g.keywords || [])],
              run: () => {
                // 장르의 coreSlides 를 시드로 빈 GDD 생성
                const slides = (g.coreSlides || []).map((type, i) => {
                  const template = SLIDE_TEMPLATES_FOR_GENRE[type] || { title: `${i + 1}. ${SLIDE_LABELS[type] || type}` };
                  return { id: window.uid(), type, data: { ...template, title: template.title || `${SLIDE_LABELS[type] || type}` } };
                });
                commitNow(`장르 템플릿: ${g.name}`);
                const fresh = {
                  id: 'gdd-' + window.uid(),
                  title: `${g.name} — 새 기획서`,
                  subtitle: g.description,
                  team: '',
                  author: '김기획',
                  badge: g.badge,
                  version: 'Ver00',
                  updatedAt: new Date().toISOString().slice(0, 10),
                  slides,
                  history: [],
                  comments: [],
                };
                setState(s => ({
                  ...s,
                  projects: [...s.projects, fresh],
                  selection: { type: 'gdd', id: fresh.id },
                }));
                setCurrentIdx(0);
                toast(`"${g.name}" 장르 템플릿 (${slides.length}장) 생성. AI 채팅에서 명령으로 채우거나 슬라이드 클릭하여 직접 편집.`, 'ok');
              },
            }))),
            { id: 'export-all', title: '⤓ 모든 개발 산출물 한꺼번에', sub: 'TS + JSON Schema + Zod + XState + OpenAPI + Gherkin + CSV', shortcut: 'CMD', keywords: ['all', 'export', '모두', '일괄'], run: () => {
              if (!project) { toast('기획서를 선택하세요', 'err'); return; }
              try {
                const all = window.gddExportAdapters.exportAll(project);
                let n = 0;
                for (const filename of Object.keys(all)) {
                  setTimeout(() => downloadBlob(all[filename], `${project.title || 'gdd'}.${filename}`, 'text/plain'), n++ * 200);
                }
                toast(`${Object.keys(all).length}개 파일 순차 다운로드`, 'ok');
              } catch (e) { toast('실패: ' + e.message, 'err'); }
            }},
          ]}
        />
      )}
      {showAddMenu && <AddSlideMenu onAdd={addSlide} onClose={() => setShowAddMenu(false)} />}
      {showBrief && briefMode === 'concept' && <ConceptBrief
        onClose={() => setShowBrief(false)}
        onSubmit={handleConceptBriefSubmit}
        isGenerating={isGenerating}
        initialMode={generationMode}
      />}
      {showBrief && briefMode !== 'concept' && <BriefComposer
        onClose={() => setShowBrief(false)}
        onSubmit={handleBriefSubmit}
        isGenerating={isGenerating}
        initialMode={generationMode}
        mode={briefMode}
        prefill={briefPrefill}
      />}

      <TweaksPanel>
        <TweakSection title="테마">
          <TweakRadio
            label="액센트"
            value={tweaks.theme}
            options={[
              { value: 'cyan', label: 'Cyan' },
              { value: 'green', label: 'Green' },
              { value: 'magenta', label: 'Magenta' },
            ]}
            onChange={(v) => setTweak('theme', v)}
          />
        </TweakSection>
        <TweakSection title="레이아웃">
          <TweakToggle label="썸네일 사이드" value={tweaks.showThumbs} onChange={(v) => setTweak('showThumbs', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

/* === 순차 스트리밍 AI 파이프라인 ===
 * "토큰 한계가 넘어가면 더 작게 쪼개서 끝까지 작성한다" — fallback 이 아니라 자기조절.
 *
 * 흐름:
 *  1) Outline (단일 호출, 가볍게) — 슬라이드 N개 구조만 받음
 *  2) 즉시 placeholder 슬라이드를 가진 빈 GDD 를 만들어 onChunk({kind:'init'}) 으로 emit
 *     → 호출자는 그 시점에 project 를 state 에 넣어 화면에 노출
 *  3) 3개씩 배치 직렬로 Flesh-out — 배치 완료마다 onChunk({kind:'batch', updates}) emit
 *     → 호출자는 placeholder 슬라이드를 즉시 실제 내용으로 교체
 *  4) 배치 호출이 (a) 토큰 잘림이나 (b) 파싱 실패 시 → 자동으로 그 배치만 1장씩 재시도
 *  5) 1장 단위 호출도 실패하면 placeholder 유지하고 다음 슬라이드로 진행 (전체 중단 ✕)
 *  6) 이미지 생성은 슬라이드 모두 끝난 후 병렬 시작, 각 이미지 완료 시 onChunk({kind:'image'}) emit
 *  7) 마지막 onChunk({kind:'done'})
 *
 * onChunk 가 없으면 (legacy 호출자) 모든 단계가 끝나고 완성된 project 만 return.
 */
async function aiGenerateGddTwoStage(command, existingTitles, attachments, context, opts) {
  opts = opts || {};
  const onProgress = opts.onProgress || (() => {});
  const onChunk = typeof opts.onChunk === 'function' ? opts.onChunk : null;

  /* ---- Stage 1: Outline ---- */
  onProgress({ stage: 'outline', message: '슬라이드 구조 설계 중…' });
  const outlinePrompt = window.buildOutlinePrompt(command, existingTitles, attachments, context);
  let outlineRaw;
  try {
    const imageAttachments = (attachments || []).filter(a => a.kind === 'image');
    if (imageAttachments.length > 0) {
      const parts = [
        { text: outlinePrompt },
        ...imageAttachments.slice(0, 3).map(a => window.gemini.imagePartFromDataUrl(a.src)).filter(Boolean),
      ];
      outlineRaw = await window.gemini.complete({ contents: [{ role: 'user', parts }] });
    } else {
      outlineRaw = await window.gemini.complete(outlinePrompt);
    }
  } catch (e) {
    throw new Error('Outline 단계 실패: ' + (e?.message || e));
  }
  const outline = window.parseAiJson(outlineRaw);
  if (!outline || !Array.isArray(outline.outline)) throw new Error('Outline JSON 파싱 실패');

  /* ---- Stage 2: placeholder GDD 즉시 생성 ---- */
  const projectId = 'gdd-' + window.uid();
  // 각 outline 항목에 미리 slide id 부여 — 배치 결과를 id 로 매칭
  const placeholderSlides = outline.outline.map(o => ({
    id: window.uid(),
    type: o.type,
    data: {
      title: o.title || `(${o.type})`,
      sectionName: o.intent || '',
      _placeholder: true,
      _intent: o.intent || '',
    },
  }));
  const projectMeta = {
    id: projectId,
    title: outline.title || '제목 없음',
    subtitle: outline.subtitle || '',
    team: outline.team || '',
    author: outline.author || '김기획',
    version: 'Ver00',
    updatedAt: new Date().toISOString().slice(0, 10),
    command,
    badge: outline.badge || 'AI',
    slides: placeholderSlides,
    history: [],
    comments: [],
  };
  if (onChunk) onChunk({ kind: 'init', project: projectMeta });

  /* ---- Stage 3: 순차 Flesh-out (3장 배치) + 자동 분할 ---- */
  const BATCH_SIZE = 3;
  const fleshSingle = async (outlineItem) => {
    // 1장만 요청 — 토큰 부족이 거의 없음
    const prompt = window.buildFleshOutPrompt(outline, [outlineItem], outline.outline, command, context);
    const raw = await window.gemini.complete(prompt);
    const parsed = window.parseAiJson(raw);
    if (parsed && Array.isArray(parsed.slides) && parsed.slides[0]) return parsed.slides[0];
    throw new Error('1장 응답 파싱 실패');
  };
  const fleshBatch = async (batchItems) => {
    const prompt = window.buildFleshOutPrompt(outline, batchItems, outline.outline, command, context);
    const raw = await window.gemini.complete(prompt);
    const parsed = window.parseAiJson(raw);
    if (parsed && Array.isArray(parsed.slides)) return parsed.slides;
    throw new Error('배치 응답 파싱 실패');
  };

  const totalSlides = placeholderSlides.length;
  let doneCount = 0;
  const slidesById = new Map(placeholderSlides.map(s => [s.id, s]));

  for (let i = 0; i < placeholderSlides.length; i += BATCH_SIZE) {
    const batchSlides = placeholderSlides.slice(i, i + BATCH_SIZE);
    const batchOutlines = outline.outline.slice(i, i + BATCH_SIZE);
    onProgress({ stage: 'flesh', message: `슬라이드 ${i + 1}~${Math.min(i + BATCH_SIZE, totalSlides)}/${totalSlides} 생성 중…` });

    // 배치 호출 시도
    let detailedBatch = null;
    try {
      detailedBatch = await fleshBatch(batchOutlines);
    } catch (e) {
      // 배치 실패 (토큰 잘림 등) → 1장씩 재시도
      onProgress({ stage: 'flesh', message: `토큰 한계 — 슬라이드 단위로 분할 재시도 (${i + 1}~${Math.min(i + BATCH_SIZE, totalSlides)})` });
      detailedBatch = [];
      for (let j = 0; j < batchOutlines.length; j++) {
        try {
          const single = await fleshSingle(batchOutlines[j]);
          detailedBatch.push(single);
        } catch (eSingle) {
          // 1장도 실패 → placeholder 유지 (null 표시)
          detailedBatch.push(null);
        }
      }
    }

    // 배치 결과를 placeholder 슬라이드에 매칭하여 업데이트
    const updates = [];
    for (let j = 0; j < batchSlides.length; j++) {
      const placeholder = batchSlides[j];
      const detailed = detailedBatch[j];
      if (!detailed) continue; // 실패한 슬라이드는 placeholder 유지
      const merged = {
        id: placeholder.id,
        type: detailed.type || placeholder.type,
        data: { ...(detailed.data || {}), _placeholder: false },
      };
      const validated = window.validateSlide ? window.validateSlide(merged) : { slide: merged };
      const final = validated.slide;
      slidesById.set(final.id, final);
      // placeholderSlides 배열도 동기화 (이미지 단계에서 사용)
      const idx = placeholderSlides.findIndex(s => s.id === final.id);
      if (idx >= 0) placeholderSlides[idx] = final;
      updates.push(final);
      doneCount++;
    }

    if (onChunk && updates.length > 0) {
      onChunk({ kind: 'batch', updates, progress: { done: doneCount, total: totalSlides } });
    }
  }

  /* ---- Stage 4: 이미지 생성 (병렬 + 완료 즉시 emit) ---- */
  const imageTargets = [];
  placeholderSlides.forEach(s => {
    if (!['cover', 'ui-design', 'section-divider', 'image-embed'].includes(s.type)) return;
    let p = s.data?.imagePrompt;
    if (!p || !p.trim()) p = synthesizeImagePrompt(s, outline);
    if (!p) return;
    imageTargets.push({ id: s.id, prompt: p, syntheticPrompt: !s.data?.imagePrompt });
  });

  if (imageTargets.length > 0) {
    onProgress({ stage: 'images', message: `이미지 ${imageTargets.length}장 생성 중…` });
    let imgDone = 0;
    // 컨텍스트에 부모 컨셉이 있으면 팔레트를 추출하여 모든 이미지 생성에 적용
    const ctxPalette = context?.concept?.palette;
    await Promise.all(imageTargets.map(async (t) => {
      try {
        const src = await window.gemini.generateImage(t.prompt, { palette: ctxPalette });
        // placeholderSlides 동기화
        const idx = placeholderSlides.findIndex(s => s.id === t.id);
        if (idx >= 0) {
          const cur = placeholderSlides[idx];
          const next = { ...cur, data: { ...cur.data, imageSrc: src, ...(t.syntheticPrompt ? { imagePrompt: t.prompt } : {}) } };
          placeholderSlides[idx] = next;
          slidesById.set(t.id, next);
          if (onChunk) onChunk({ kind: 'image', slideId: t.id, imageSrc: src, imagePrompt: t.syntheticPrompt ? t.prompt : undefined });
        }
        imgDone++;
        onProgress({ stage: 'images', message: `이미지 ${imgDone}/${imageTargets.length} 완료` });
      } catch (e) { /* swallow per-image */ }
    }));
  }

  /* ---- Stage 5: (선택) Self-critique → 약한 슬라이드 재생성 ---- */
  if (opts.selfCritique) {
    onProgress({ stage: 'critique', message: 'GDD 자체 비평 중…' });
    try {
      const previewProject = { title: outline.title, subtitle: outline.subtitle, slides: placeholderSlides };
      const critiqueRaw = await window.gemini.complete(window.buildCritiquePrompt(previewProject));
      const critique = window.parseAiJson(critiqueRaw);
      const weakIds = new Set((critique?.weakSlides || []).map(w => w.slideId));
      if (weakIds.size > 0) {
        onProgress({ stage: 'critique', message: `${weakIds.size}개 약한 슬라이드 재생성 중…` });
        for (let i = 0; i < placeholderSlides.length; i++) {
          const s = placeholderSlides[i];
          if (!weakIds.has(s.id)) continue;
          try {
            const outItem = outline.outline[i];
            const suggestion = critique.weakSlides.find(w => w.slideId === s.id)?.suggestion;
            const augOutline = { ...outItem, _suggestion: suggestion };
            const reFleshPrompt = window.buildFleshOutPrompt(outline, [augOutline], outline.outline, command + (suggestion ? `\n\n# 약점 보강 지시\n${suggestion}` : ''), context);
            const reRaw = await window.gemini.complete(reFleshPrompt);
            const reparsed = window.parseAiJson(reRaw);
            if (reparsed?.slides?.[0]) {
              const merged = { id: s.id, type: reparsed.slides[0].type || s.type, data: { ...(reparsed.slides[0].data || {}), _placeholder: false } };
              const validated = window.validateSlide ? window.validateSlide(merged) : { slide: merged };
              placeholderSlides[i] = validated.slide;
              slidesById.set(s.id, validated.slide);
              if (onChunk) onChunk({ kind: 'batch', updates: [validated.slide], progress: { done: doneCount, total: totalSlides, critique: true } });
            }
          } catch (eW) { /* swallow per-slide */ }
        }
      }
    } catch (e) { /* swallow */ }
  }

  if (onChunk) onChunk({ kind: 'done', project: { ...projectMeta, slides: placeholderSlides } });

  return { ...projectMeta, slides: placeholderSlides };
}

/* === 이미지 프롬프트 폴백 합성 ===
 * AI 가 imagePrompt 를 빼먹은 슬라이드를 위해 title/caption/subtitle/team 으로부터
 * 영문 이미지 생성 프롬프트를 합성. 한국어 키워드는 그대로 두되 nano-banana 가
 * 의미를 파악할 수 있게 영문 컨텍스트 키워드 + 스타일 + 16:9 키워드를 덧붙임.
 */
function synthesizeImagePrompt(slide, parsedRoot) {
  if (!slide) return '';
  const d = slide.data || {};
  const root = parsedRoot || {};
  const topic = [d.title, d.caption, d.subtitle, root.title, root.subtitle]
    .filter(s => typeof s === 'string' && s.trim())
    .slice(0, 3)
    .join(', ');
  if (!topic) return '';
  const styleByType = {
    'cover': 'cinematic key art cover, dramatic lighting, ultra-detailed, bold composition, 16:9 aspect ratio',
    'section-divider': 'atmospheric chapter concept art, moody lighting, dark background with negative space for text, cinematic 16:9',
    'ui-design': 'clean game UI mockup, dark sci-fi theme, hud elements, high-fidelity wireframe, 16:9 aspect ratio',
    'image-embed': 'high-detail concept art reference, painterly digital art, cinematic lighting, 16:9 aspect ratio',
  };
  const style = styleByType[slide.type] || styleByType['image-embed'];
  return `Game design reference: ${topic}. Style: ${style}, professional game art, vivid colors, high contrast.`;
}

/* === AI generation via window.gemini.complete === */
async function aiGenerateGdd(command, existingTitles, attachments, context) {
  const prompt = window.buildAiPrompt(command, existingTitles, attachments, context);
  let raw;
  try {
    // Try multimodal if images present
    const imageAttachments = (attachments || []).filter(a => a.kind === 'image');
    if (imageAttachments.length > 0) {
      try {
        const parts = [
          { text: prompt },
          ...imageAttachments.slice(0, 6)
            .map(a => window.gemini.imagePartFromDataUrl(a.src))
            .filter(Boolean),
        ];
        raw = await window.gemini.complete({ contents: [{ role: 'user', parts }] });
      } catch (multimodalErr) {
        raw = await window.gemini.complete(prompt);
      }
    } else {
      raw = await window.gemini.complete(prompt);
    }
  } catch (e) {
    throw new Error('Gemini 호출 실패. 데모 모드로 전환하거나 다시 시도해주세요.');
  }
  // 공용 복구 파서 사용 — 잘림/trailing comma/escape 문제까지 자동 복구.
  // 그래도 실패하면 2단계 파이프라인으로 자동 폴백 (Outline 짧음 → Flesh-out 배치).
  let parsed;
  try {
    parsed = window.parseAiJson(raw);
  } catch (e) {
    if (window.gddToast) try { window.gddToast('단일 호출 잘림 — 2단계 파이프라인으로 자동 재시도', ''); } catch {}
    return await aiGenerateGddTwoStage(command, existingTitles, attachments, context, { selfCritique: false });
  }

  const rawSlides = (parsed.slides || []).map(s => ({ id: window.uid(), type: s.type, data: s.data || {} }));
  // Schema 검증 + 자동 보정
  const allFixes = [];
  const slides = rawSlides.map(s => {
    if (window.validateSlide) {
      const r = window.validateSlide(s);
      allFixes.push(...r.fixes);
      return r.slide;
    }
    return s;
  });
  if (allFixes.length && window.gddToast) {
    try { window.gddToast(`AI 응답 ${allFixes.length}개 항목 자동 보정`, 'ok'); } catch {}
  } else if (allFixes.length) {
    console.warn('AI 응답 자동 보정:', allFixes);
  }

  // nano-banana: 참고 이미지 자동 생성
  // - cover 슬라이드: 표지 배경
  // - ui-design 슬라이드: UI 목업 이미지
  // - section-divider 슬라이드: 섹션 컨셉 아트
  // - image-embed 슬라이드: 참고 이미지
  // imagePrompt 가 비어있으면 slide.title/caption/subtitle 로부터 폴백 프롬프트 합성
  // 실패해도 GDD 생성은 정상 완료(이미지만 비어있음)
  const imageJobs = [];
  // 컨텍스트(부모 컨셉)에서 팔레트 추출 — 모든 이미지 생성에 적용
  const ctxPalette = context?.concept?.palette;
  const coverIdx = slides.findIndex(s => s.type === 'cover');
  if (coverIdx >= 0) {
    const coverPrompt = parsed.coverImagePrompt || synthesizeImagePrompt(slides[coverIdx], parsed);
    if (coverPrompt) {
      imageJobs.push((async () => {
        try {
          const src = await window.gemini.generateImage(coverPrompt, { palette: ctxPalette });
          slides[coverIdx].data = { ...slides[coverIdx].data, imageSrc: src, imagePrompt: coverPrompt };
        } catch (e) { /* swallow */ }
      })());
    }
  }
  slides.forEach((s, idx) => {
    if (s.type === 'cover') return; // 위에서 처리됨
    if (!['ui-design', 'section-divider', 'image-embed'].includes(s.type)) return;
    // imagePrompt 가 비어있으면 폴백 합성 — 이미지 누락 방지
    let p = s.data?.imagePrompt;
    if (!p || !p.trim()) {
      p = synthesizeImagePrompt(s, parsed);
      if (!p) return;
      // 합성된 프롬프트도 slide.data 에 저장해서 UI 에서 보이도록
      slides[idx].data = { ...slides[idx].data, imagePrompt: p };
    }
    imageJobs.push((async () => {
      try {
        const src = await window.gemini.generateImage(p, { palette: ctxPalette });
        slides[idx].data = { ...slides[idx].data, imageSrc: src };
      } catch (e) { /* swallow */ }
    })());
  });
  if (imageJobs.length) {
    await Promise.allSettled(imageJobs);
  }

  return {
    id: 'gdd-' + window.uid(),
    title: parsed.title || '제목 없음',
    subtitle: parsed.subtitle || '',
    team: parsed.team || '',
    author: parsed.author || '김기획',
    version: 'Ver00',
    updatedAt: new Date().toISOString().slice(0, 10),
    command,
    badge: parsed.badge || 'AI',
    slides: slides.length ? slides : window.generateDemoGdd(command).slides,
    history: [],
    comments: [],
  };
}

/* === AI 기획서 수정 (operations 기반) ===
 * 현재 GDD + 사용자 명령을 받아 add/replace/patch/delete/move/meta 작업을 적용.
 * 반환값: { project: 갱신된 project, summary }
 */
async function aiEditGdd(currentProject, command, attachments, palette) {
  const prompt = window.buildAiEditPrompt(currentProject, command, attachments);
  let raw;
  try {
    const imageAttachments = (attachments || []).filter(a => a.kind === 'image');
    if (imageAttachments.length > 0) {
      try {
        const parts = [
          { text: prompt },
          ...imageAttachments.slice(0, 6)
            .map(a => window.gemini.imagePartFromDataUrl(a.src))
            .filter(Boolean),
        ];
        raw = await window.gemini.complete({ contents: [{ role: 'user', parts }] });
      } catch (multimodalErr) {
        raw = await window.gemini.complete(prompt);
      }
    } else {
      raw = await window.gemini.complete(prompt);
    }
  } catch (e) {
    throw new Error('Gemini 호출 실패. 다시 시도해주세요.');
  }

  let parsed;
  try {
    parsed = window.parseAiJson(raw);
  } catch (e) {
    throw new Error(e.message || 'AI 응답을 JSON으로 변환하지 못했습니다.');
  }
  const ops = Array.isArray(parsed.operations) ? parsed.operations : [];
  if (!ops.length) throw new Error('AI가 적용 가능한 변경을 반환하지 않았습니다. 명령을 더 구체적으로 적어주세요.');

  // 1) 슬라이드 배열에 operations 적용
  let slides = [...(currentProject.slides || [])];
  const newOrChanged = []; // 이미지 생성 대상
  const findIdx = (key) => {
    if (key == null) return -1;
    const idx = slides.findIndex(s => s.id === key);
    if (idx >= 0) return idx;
    const n = parseInt(key, 10);
    if (!isNaN(n) && n >= 1 && n <= slides.length) return n - 1;
    return -1;
  };
  // AI 가 patch/replace 로 imageSrc 같은 위험 필드를 임의 값으로 주입하지 못하도록 정제.
  // imageSrc 는 data:image/* base64 만 허용 (LLM 이 javascript: 같은 스킴을 넣어도 차단).
  const ALLOWED_IMG_RE = /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,/i;
  const sanitizeSlideData = (data) => {
    if (!data || typeof data !== 'object') return data;
    const out = { ...data };
    if (typeof out.imageSrc === 'string' && !ALLOWED_IMG_RE.test(out.imageSrc)) {
      delete out.imageSrc; // 위험 스킴 / 비정형 URL 제거
    }
    return out;
  };
  const metaUpdate = {};
  const fixes = [];
  let opFailures = 0;
  for (const op of ops) {
    try {
      if (op.op === 'add' && op.slide) {
        const sanitizedData = sanitizeSlideData(op.slide.data || {});
        const rawSlide = { id: window.uid(), type: op.slide.type || 'rules', data: sanitizedData };
        const validated = window.validateSlide ? window.validateSlide(rawSlide) : { slide: rawSlide, fixes: [] };
        fixes.push(...(validated.fixes || []));
        const newSlide = validated.slide;
        let pos;
        if (op.after === 'start') pos = 0;
        else if (op.after === 'end' || op.after == null) pos = slides.length;
        else {
          const idx = findIdx(op.after);
          pos = idx >= 0 ? idx + 1 : slides.length;
        }
        slides = [...slides.slice(0, pos), newSlide, ...slides.slice(pos)];
        newOrChanged.push(newSlide);
      } else if (op.op === 'replace' && op.slide) {
        const idx = findIdx(op.id);
        if (idx < 0) continue;
        const oldId = slides[idx].id;
        const sanitizedData = sanitizeSlideData(op.slide.data || {});
        const rawSlide = { id: oldId, type: op.slide.type || slides[idx].type, data: sanitizedData };
        const validated = window.validateSlide ? window.validateSlide(rawSlide) : { slide: rawSlide, fixes: [] };
        fixes.push(...(validated.fixes || []));
        slides = slides.map((s, i) => i === idx ? validated.slide : s);
        newOrChanged.push(validated.slide);
      } else if (op.op === 'patch' && op.fields) {
        const idx = findIdx(op.id);
        if (idx < 0) continue;
        const sanitizedFields = sanitizeSlideData(op.fields);
        const merged = { ...slides[idx], data: { ...slides[idx].data, ...sanitizedFields } };
        slides = slides.map((s, i) => i === idx ? merged : s);
        if (sanitizedFields.imagePrompt) newOrChanged.push(merged);
      } else if (op.op === 'delete') {
        const idx = findIdx(op.id);
        if (idx < 0) continue;
        slides = slides.filter((_, i) => i !== idx);
      } else if (op.op === 'move') {
        const idx = findIdx(op.id);
        const to = (parseInt(op.to, 10) || 1) - 1;
        if (idx < 0 || to < 0 || to >= slides.length || idx === to) continue;
        const moved = slides[idx];
        const without = slides.filter((_, i) => i !== idx);
        slides = [...without.slice(0, to), moved, ...without.slice(to)];
      } else if (op.op === 'meta' && op.fields) {
        for (const k of ['title', 'subtitle', 'team', 'badge']) {
          if (typeof op.fields[k] === 'string' && op.fields[k].trim()) metaUpdate[k] = op.fields[k];
        }
      }
    } catch (e) {
      // 개별 op 적용 실패는 전체 수정을 중단시키지 않고 카운트만 누적
      opFailures++;
    }
  }
  if (fixes.length && window.gddToast) {
    try { window.gddToast(`AI 응답 ${fixes.length}개 항목 자동 보정`, 'ok'); } catch {}
  }
  if (opFailures > 0 && window.gddToast) {
    try { window.gddToast(`${opFailures}개 변경 작업 실패 (스킵됨)`, 'err'); } catch {}
  }

  // 2) 새/변경 슬라이드 중 이미지 대상에 대해 nano-banana 로 이미지 생성.
  //    imagePrompt 가 비어있으면 synthesizeImagePrompt 로 폴백 합성 — 이미지 누락 방지.
  //    id 기반으로 트래킹 → 이후 ops 가 같은 슬라이드를 다시 교체해도 race 가 안 생긴다.
  const imageTargets = newOrChanged
    .filter(s => ['cover', 'ui-design', 'section-divider', 'image-embed'].includes(s.type))
    .map(s => {
      let p = s.data?.imagePrompt;
      if (!p || !p.trim()) p = synthesizeImagePrompt(s, currentProject || {});
      return p ? { id: s.id, prompt: p, synthesized: !s.data?.imagePrompt } : null;
    })
    .filter(Boolean);
  if (imageTargets.length > 0) {
    // 부모 컨셉 팔레트가 있으면 모든 이미지 생성에 적용 (수정 시에도 컨셉 색상 유지)
    const results = await Promise.allSettled(imageTargets.map(t => window.gemini.generateImage(t.prompt, { palette })));
    const idToUpdate = {};
    results.forEach((r, i) => {
      if (r.status === 'fulfilled' && typeof r.value === 'string') {
        idToUpdate[imageTargets[i].id] = { src: r.value, syntheticPrompt: imageTargets[i].synthesized ? imageTargets[i].prompt : null };
      }
    });
    if (Object.keys(idToUpdate).length > 0) {
      slides = slides.map(s => {
        const u = idToUpdate[s.id];
        if (!u) return s;
        const patchData = { ...s.data, imageSrc: u.src };
        if (u.syntheticPrompt) patchData.imagePrompt = u.syntheticPrompt;
        return { ...s, data: patchData };
      });
    }
  }

  // 3) 갱신된 project 반환
  const summary = (parsed.summary && String(parsed.summary).slice(0, 200)) || `${ops.length}개 변경 적용`;
  const updatedProject = {
    ...currentProject,
    ...metaUpdate,
    slides,
    updatedAt: new Date().toISOString().slice(0, 10),
    history: [
      ...(currentProject.history || []),
      {
        ts: new Date().toISOString().slice(0, 16).replace('T', ' '),
        cmd: command + ((attachments || []).length ? ` [+${(attachments || []).length}개 첨부]` : ''),
        summary,
      },
    ],
  };
  return { project: updatedProject, summary, opsCount: ops.length };
}

/* Mount */
let _appStateRef = null;
window.__getAppStateForRecovery = () => _appStateRef;
function captureStateForRecovery(s) { _appStateRef = s; }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary getCurrentState={() => _appStateRef}>
    <ToastHost>
      <App onStateChange={captureStateForRecovery} />
    </ToastHost>
  </ErrorBoundary>
);


