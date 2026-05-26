/* === IndexedDB-backed storage with image blob separation ===
 *
 * 설계:
 * - 'state' 객체 저장소: 메인 state JSON을 통째로 보관 (단일 키 'main' / 'emergency')
 * - 'images' 객체 저장소: base64 이미지를 Blob으로 분리 보관 (개별 키 'img-xxxx')
 * - state 안의 'data:image/...;base64,...' 문자열은 저장 시 자동으로 추출되어
 *   images store에 넣어지고, state에는 'idb-image://<uuid>' 참조만 남는다.
 * - 로드 시 참조는 Blob URL(객체 URL)로 자동 복원되어 <img src>에 그대로 사용 가능.
 * - 결과: 메인 state JSON이 매우 작아져 5~10MB localStorage 한계를 우회. 이미지 다수도 안전.
 *
 * 노출: window.gddStorage
 */
(function () {
  const DB_NAME = 'gdd-maker';
  const DB_VERSION = 1;
  const STATE_STORE = 'state';
  const IMAGES_STORE = 'images';
  const REF_PREFIX = 'idb-image://';
  const LEGACY_LS_KEY = 'gdd-maker-state-v2';

  let _dbPromise = null;
  function openDb() {
    if (_dbPromise) return _dbPromise;
    _dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STATE_STORE)) db.createObjectStore(STATE_STORE);
        if (!db.objectStoreNames.contains(IMAGES_STORE)) db.createObjectStore(IMAGES_STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return _dbPromise;
  }

  function tx(db, store, mode) {
    return db.transaction(store, mode).objectStore(store);
  }

  async function dbGet(store, key) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const req = tx(db, store, 'readonly').get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function dbSet(store, key, value) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(store, 'readwrite');
      transaction.objectStore(store).put(value, key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function dbDelete(store, key) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(store, 'readwrite');
      transaction.objectStore(store).delete(key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function dbKeys(store) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const req = tx(db, store, 'readonly').getAllKeys();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function uuid() {
    return 'img-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
  }

  function dataUrlToBlob(dataUrl) {
    const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!m) return null;
    const mime = m[1];
    try {
      const binary = atob(m[2]);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
      return new Blob([bytes], { type: mime });
    } catch (e) {
      return null;
    }
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = () => reject(fr.error);
      fr.readAsDataURL(blob);
    });
  }

  /* === Extract: state 안 data: URL → IndexedDB Blob 으로 분리. state엔 ref만 남김. === */
  async function extractAndStoreImages(state) {
    const pending = []; // {uuid, blob}
    function walk(node) {
      if (Array.isArray(node)) {
        return node.map(walk);
      }
      if (node && typeof node === 'object') {
        const out = {};
        for (const k of Object.keys(node)) {
          const v = node[k];
          if (typeof v === 'string' && v.startsWith('data:image/')) {
            const blob = dataUrlToBlob(v);
            if (blob) {
              const id = uuid();
              pending.push({ uuid: id, blob });
              out[k] = REF_PREFIX + id;
              continue;
            }
          } else if (typeof v === 'string' && v.startsWith('blob:')) {
            // restoreImageRefs 가 만든 blob URL → reverse map 으로 원래 ref 복원.
            // 매핑이 없으면 (외부에서 들어온 임시 blob URL 등) 그대로 두지 않고 null 처리해
            // 다음 새로고침 후 ERR_FILE_NOT_FOUND 가 쏟아지지 않게 한다.
            const known = _urlToUuid.get(v);
            if (known) {
              out[k] = REF_PREFIX + known;
            } else {
              out[k] = null;
            }
            continue;
          }
          out[k] = walk(v);
        }
        return out;
      }
      return node;
    }
    const cleaned = walk(state);
    // 한꺼번에 저장
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(IMAGES_STORE, 'readwrite');
      const store = transaction.objectStore(IMAGES_STORE);
      for (const { uuid, blob } of pending) {
        store.put(blob, uuid);
      }
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    return cleaned;
  }

  /* === Restore: state 안 idb-image:// ref → Blob URL 복원 ===
   * 양방향 매핑 유지:
   *   _urlCache    : uuid → blob URL  (복원 시 동일 ref 가 여러 번 나와도 1번만 생성)
   *   _urlToUuid   : blob URL → uuid  (저장 시 blob URL 을 다시 ref 로 정규화)
   * 두 맵 모두 메모리(이 세션) 한정. 새로고침되면 비워지고 blob URL 도 모두 무효 — 이것이 정상.
   */
  const _urlCache = new Map();
  const _urlToUuid = new Map();

  async function restoreImageRefs(state) {
    const refs = new Set();
    function collect(node) {
      if (Array.isArray(node)) { node.forEach(collect); return; }
      if (node && typeof node === 'object') {
        for (const k of Object.keys(node)) collect(node[k]);
        return;
      }
      if (typeof node === 'string' && node.startsWith(REF_PREFIX)) {
        refs.add(node.slice(REF_PREFIX.length));
      }
    }
    collect(state);

    // 각 ref를 한 번씩만 fetch
    for (const id of refs) {
      if (_urlCache.has(id)) continue;
      const blob = await dbGet(IMAGES_STORE, id);
      if (blob) {
        try {
          const url = URL.createObjectURL(blob);
          _urlCache.set(id, url);
          _urlToUuid.set(url, id); // 역방향 매핑 — 저장 시 ref 로 되돌릴 때 사용
        } catch (e) {
          _urlCache.set(id, null);
        }
      } else {
        _urlCache.set(id, null);
      }
    }

    // 참조를 URL로 치환
    function replace(node) {
      if (Array.isArray(node)) return node.map(replace);
      if (node && typeof node === 'object') {
        const out = {};
        for (const k of Object.keys(node)) out[k] = replace(node[k]);
        return out;
      }
      if (typeof node === 'string' && node.startsWith(REF_PREFIX)) {
        const id = node.slice(REF_PREFIX.length);
        return _urlCache.get(id) || null;
      }
      return node;
    }
    return replace(state);
  }

  /* === Public API === */

  async function saveState(state, slot) {
    slot = slot || 'main';
    // 이미 복원된 state는 blob: URL을 포함할 수 있음 — 다시 저장할 때는 ref로 변환된 형태가 아니라 URL 그대로일 수 있어,
    // 사용자가 새로 첨부한 이미지(data:...)만 추출 대상. URL 형태는 유지.
    const cleaned = await extractAndStoreImages(state);
    await dbSet(STATE_STORE, slot, cleaned);
  }

  async function loadState(slot) {
    slot = slot || 'main';
    const cleaned = await dbGet(STATE_STORE, slot);
    if (!cleaned) return null;
    // 과거 버전에서 영속화된 blob: URL 잔재가 있다면 이 단계에서 제거
    // (해당 URL 은 이번 세션에서 무효 → ERR_FILE_NOT_FOUND 방지)
    const sanitized = stripStaleBlobUrls(cleaned);
    return await restoreImageRefs(sanitized);
  }

  /** state 트리에서 blob: URL 문자열을 null 로 정규화 (immutable). 데이터 URL/ref/객체/배열은 그대로. */
  function stripStaleBlobUrls(node) {
    if (Array.isArray(node)) return node.map(stripStaleBlobUrls);
    if (node && typeof node === 'object') {
      const out = {};
      for (const k of Object.keys(node)) out[k] = stripStaleBlobUrls(node[k]);
      return out;
    }
    if (typeof node === 'string' && node.startsWith('blob:')) return null;
    return node;
  }

  async function hasSlot(slot) {
    return !!(await dbGet(STATE_STORE, slot));
  }

  async function clearSlot(slot) {
    await dbDelete(STATE_STORE, slot);
  }

  /* === Migration from legacy localStorage === */
  async function migrateFromLocalStorage() {
    const existing = await dbGet(STATE_STORE, 'main');
    if (existing) return false; // 이미 IndexedDB에 있으면 skip
    const raw = localStorage.getItem(LEGACY_LS_KEY);
    if (!raw) return false;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.projects) return false;
      await saveState(parsed, 'main');
      // localStorage는 안전을 위해 즉시 삭제하지 않음. 사용자가 안정성 확인 후 수동 정리 가능.
      return true;
    } catch (e) {
      return false;
    }
  }

  /* === GC: 더 이상 참조되지 않는 이미지 삭제 === */
  async function gcImages() {
    const main = await dbGet(STATE_STORE, 'main');
    const emergency = await dbGet(STATE_STORE, 'emergency');
    const used = new Set();
    function collect(node) {
      if (Array.isArray(node)) { node.forEach(collect); return; }
      if (node && typeof node === 'object') {
        for (const k of Object.keys(node)) collect(node[k]);
        return;
      }
      if (typeof node === 'string' && node.startsWith(REF_PREFIX)) {
        used.add(node.slice(REF_PREFIX.length));
      }
    }
    collect(main);
    collect(emergency);

    const all = await dbKeys(IMAGES_STORE);
    let deleted = 0;
    for (const k of all) {
      if (!used.has(k)) {
        await dbDelete(IMAGES_STORE, k);
        deleted++;
        // 메모리 캐시에서도 제거 + URL revoke + 역방향 매핑도 정리
        if (_urlCache.has(k)) {
          const url = _urlCache.get(k);
          if (url && typeof url === 'string' && url.startsWith('blob:')) {
            try { URL.revokeObjectURL(url); } catch {}
            _urlToUuid.delete(url);
          }
          _urlCache.delete(k);
        }
      }
    }
    return deleted;
  }

  /* === Export: 모든 데이터를 단일 JSON으로 직렬화 (이미지는 base64로 인라인) === */
  async function exportProject() {
    const stateRaw = await dbGet(STATE_STORE, 'main');
    if (!stateRaw) throw new Error('내보낼 데이터가 없습니다.');
    // 모든 ref를 다시 data: URL로 변환 (휴대성 확보)
    async function inline(node) {
      if (Array.isArray(node)) return Promise.all(node.map(inline));
      if (node && typeof node === 'object') {
        const out = {};
        for (const k of Object.keys(node)) out[k] = await inline(node[k]);
        return out;
      }
      if (typeof node === 'string' && node.startsWith(REF_PREFIX)) {
        const id = node.slice(REF_PREFIX.length);
        const blob = await dbGet(IMAGES_STORE, id);
        if (blob) {
          try { return await blobToDataUrl(blob); } catch { return null; }
        }
        return null;
      }
      return node;
    }
    const inlined = await inline(stateRaw);
    return JSON.stringify({
      version: 'gdd-project-v1',
      exportedAt: new Date().toISOString(),
      state: inlined,
    });
  }

  async function importProject(jsonText) {
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      throw new Error('유효한 JSON이 아닙니다.');
    }
    if (!parsed || !parsed.state) throw new Error('GDD 프로젝트 파일이 아닙니다.');
    await saveState(parsed.state, 'main');
    return await loadState('main');
  }

  /* === File System Access API: 사용자 폴더 자동 백업 (옵션) ===
   * directoryHandle은 직렬화 불가지만 IndexedDB에는 저장 가능 (구조화 복제 지원).
   * 다음 세션 시작 시 자동 복원되며, 권한은 별도 verify 후 사용. */
  const SETTINGS_STORE = STATE_STORE; // 메인과 같은 스토어, 별도 키 사용
  const BACKUP_HANDLE_KEY = 'backup-dir-handle';
  let _backupDirHandle = null;
  let _lastBackupAt = null;

  async function pickBackupDirectory() {
    if (!('showDirectoryPicker' in window)) {
      throw new Error('이 브라우저는 폴더 선택을 지원하지 않습니다. (Chrome/Edge 권장)');
    }
    _backupDirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
    // IndexedDB에 핸들 영속 저장 (FileSystemDirectoryHandle은 구조화 복제 가능)
    try { await dbSet(SETTINGS_STORE, BACKUP_HANDLE_KEY, _backupDirHandle); } catch (e) { /* 일부 브라우저 미지원 */ }
    return _backupDirHandle.name;
  }

  async function restoreBackupDirectory() {
    if (_backupDirHandle) return _backupDirHandle.name;
    try {
      const handle = await dbGet(SETTINGS_STORE, BACKUP_HANDLE_KEY);
      if (!handle) return null;
      // 권한 확인
      const perm = await handle.queryPermission({ mode: 'readwrite' });
      if (perm === 'granted') {
        _backupDirHandle = handle;
        return handle.name;
      }
      // 권한이 만료되었으면 다음 사용자 액션 때 재요청 필요 — 일단 핸들만 보관
      _backupDirHandle = handle;
      return handle.name + ' (권한 재요청 필요)';
    } catch (e) {
      return null;
    }
  }

  async function ensureBackupPermission() {
    if (!_backupDirHandle) return false;
    try {
      const perm = await _backupDirHandle.queryPermission({ mode: 'readwrite' });
      if (perm === 'granted') return true;
      const req = await _backupDirHandle.requestPermission({ mode: 'readwrite' });
      return req === 'granted';
    } catch { return false; }
  }

  async function clearBackupDirectory() {
    _backupDirHandle = null;
    try { await dbDelete(SETTINGS_STORE, BACKUP_HANDLE_KEY); } catch {}
  }

  function getBackupStatus() {
    return {
      configured: !!_backupDirHandle,
      name: _backupDirHandle?.name || null,
      lastBackupAt: _lastBackupAt,
    };
  }

  async function autoBackup() {
    if (!_backupDirHandle) return false;
    const ok = await ensureBackupPermission();
    if (!ok) return false;
    try {
      const json = await exportProject();
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const name = `gdd-backup-${ts}.gddproject`;
      const fileHandle = await _backupDirHandle.getFileHandle(name, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(json);
      await writable.close();
      _lastBackupAt = Date.now();
      // 최근 30개만 남기기
      const allFiles = [];
      for await (const entry of _backupDirHandle.values()) {
        if (entry.kind === 'file' && entry.name.startsWith('gdd-backup-')) {
          allFiles.push(entry.name);
        }
      }
      allFiles.sort();
      while (allFiles.length > 30) {
        await _backupDirHandle.removeEntry(allFiles.shift());
      }
      return name;
    } catch (e) {
      return false;
    }
  }

  /* === 저장소 사용량 추정 === */
  async function estimateStorage() {
    if (!navigator.storage || !navigator.storage.estimate) return null;
    const est = await navigator.storage.estimate();
    return {
      usage: est.usage || 0,
      quota: est.quota || 0,
      percent: est.quota ? (est.usage / est.quota * 100) : 0,
    };
  }

  /* === Public: ref(idb-image://uuid) 또는 blob: URL → 원본 Blob 반환 ===
   * PPTX/PDF export 시 blob URL/idb-ref 를 data URL 로 다시 inline 화하기 위해 필요.
   * - 'idb-image://uuid' → IMAGES_STORE 에서 직접 조회
   * - 'blob:...'         → _urlToUuid 역 매핑으로 uuid 찾은 뒤 IMAGES_STORE 조회
   *                        (해당 매핑이 없을 수도 있는데, 그땐 fetch 로 마지막 시도)
   * 실패 시 null. 동기 오류는 절대 throw 하지 않음.
   */
  async function getImageBlobByRef(refOrUrl) {
    if (!refOrUrl || typeof refOrUrl !== 'string') return null;
    try {
      if (refOrUrl.startsWith(REF_PREFIX)) {
        const id = refOrUrl.slice(REF_PREFIX.length);
        const blob = await dbGet(IMAGES_STORE, id);
        return blob || null;
      }
      if (refOrUrl.startsWith('blob:')) {
        // 역 매핑이 있으면 우선 사용 (IndexedDB 에 보장된 원본)
        const uuid = _urlToUuid.get(refOrUrl);
        if (uuid) {
          const blob = await dbGet(IMAGES_STORE, uuid);
          if (blob) return blob;
        }
        // 매핑 없으면 fetch 로 직접 시도 (동일 origin/세션 blob URL 은 보통 fetch 가능)
        try {
          const res = await fetch(refOrUrl);
          if (res.ok) return await res.blob();
        } catch (_) {}
        return null;
      }
    } catch (_) {}
    return null;
  }

  window.gddStorage = {
    saveState,
    loadState,
    hasSlot,
    clearSlot,
    migrateFromLocalStorage,
    gcImages,
    exportProject,
    importProject,
    pickBackupDirectory,
    restoreBackupDirectory,
    ensureBackupPermission,
    clearBackupDirectory,
    getBackupStatus,
    autoBackup,
    estimateStorage,
    getImageBlobByRef,
    // Emergency 슬롯 alias
    saveEmergency: (s) => saveState(s, 'emergency'),
    loadEmergency: () => loadState('emergency'),
    hasEmergency: () => hasSlot('emergency'),
    clearEmergency: () => clearSlot('emergency'),
    REF_PREFIX,
  };
})();
