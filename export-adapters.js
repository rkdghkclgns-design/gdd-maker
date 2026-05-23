/* === 개발 산출물 export 어댑터 ===
 * GDD 의 슬라이드를 엔지니어가 그대로 사용 가능한 산출물로 변환.
 *  - class-diagram → TypeScript interface
 *  - data-table    → JSON Schema (Draft 2020-12) + Zod
 *  - state-machine → XState v5 머신 정의 (JSON)
 *  - api-contract  → OpenAPI 3.1 (YAML)
 *  - acceptance-criteria → Gherkin .feature
 *  - balance-table → CSV
 *
 * 모든 함수는 string 을 반환. 호출자가 Blob 으로 다운로드.
 */
(function () {
  'use strict';

  /* ---- 공통 유틸 ---- */
  function sanitizeName(s, fallback) {
    return String(s || fallback || 'Unnamed').replace(/[^A-Za-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') || fallback || 'Unnamed';
  }
  function pascalCase(s) {
    const safe = sanitizeName(s, 'Item');
    return safe.charAt(0).toUpperCase() + safe.slice(1);
  }
  function camelCase(s) {
    const safe = sanitizeName(s, 'item');
    return safe.charAt(0).toLowerCase() + safe.slice(1);
  }
  function tsType(t) {
    if (!t) return 'unknown';
    const lower = t.toLowerCase().trim();
    if (lower === 'uuid' || lower === 'string' || lower === 'datetime' || lower === 'enum') return 'string';
    if (lower === 'int' || lower === 'integer' || lower === 'number' || lower === 'float') return 'number';
    if (lower === 'bool' || lower === 'boolean') return 'boolean';
    if (lower === 'json' || lower === 'object') return 'Record<string, unknown>';
    if (lower.endsWith('[]')) return tsType(lower.slice(0, -2)) + '[]';
    return 'string';
  }
  function jsonSchemaType(t) {
    if (!t) return { type: 'string' };
    const lower = t.toLowerCase().trim();
    if (lower === 'uuid') return { type: 'string', format: 'uuid' };
    if (lower === 'datetime') return { type: 'string', format: 'date-time' };
    if (lower === 'int' || lower === 'integer') return { type: 'integer' };
    if (lower === 'number' || lower === 'float') return { type: 'number' };
    if (lower === 'bool' || lower === 'boolean') return { type: 'boolean' };
    if (lower === 'enum') return { type: 'string' };
    if (lower === 'json' || lower === 'object') return { type: 'object' };
    return { type: 'string' };
  }

  /* ---- 1. class-diagram → TypeScript interface ---- */
  function exportTypeScript(project) {
    const slides = (project.slides || []).filter(s => s.type === 'class-diagram');
    if (slides.length === 0) throw new Error('class-diagram 슬라이드가 없습니다.');
    const lines = [
      `// ${project.title || 'GDD'} — auto-generated TypeScript types`,
      `// Source: ${slides.length} class-diagram slide(s). Generated ${new Date().toISOString()}.`,
      '',
    ];
    for (const slide of slides) {
      const classes = slide.data?.classes || [];
      const relations = slide.data?.relations || [];
      lines.push(`// === ${slide.data?.title || 'Classes'} ===`);
      lines.push('');
      for (const c of classes) {
        const name = pascalCase(c.name || c.id);
        const stereotype = (c.stereotype || '').replace(/[<>]/g, '').trim();
        const baseRel = relations.find(r => r.from === c.id && (r.kind === 'inherit' || r.kind === 'implement'));
        const baseCls = baseRel ? classes.find(x => x.id === baseRel.to) : null;
        const baseName = baseCls ? pascalCase(baseCls.name || baseCls.id) : null;
        const keyword = stereotype === 'interface' ? 'interface' : (stereotype === 'enum' ? 'enum' : 'interface');
        if (stereotype === 'enum') {
          lines.push(`export enum ${name} {`);
          for (const a of (c.attrs || [])) {
            const m = /\s*([A-Z_][A-Z0-9_]*)\s*=?\s*['"]?([^'"]*)['"]?/.exec(a) || [];
            const key = m[1] || sanitizeName(a, 'VALUE').toUpperCase();
            const val = m[2] || key;
            lines.push(`  ${key} = ${JSON.stringify(val)},`);
          }
          lines.push(`}`, '');
          continue;
        }
        const extendsClause = baseName ? ` extends ${baseName}` : '';
        lines.push(`/** ${(c.stereotype || '').replace(/`/g, '')} ${(c.name || '')} */`);
        lines.push(`export ${keyword} ${name}${extendsClause} {`);
        // attrs: "-hp: int" or "+name: string"
        for (const attr of (c.attrs || [])) {
          const m = /^\s*[+\-#]?\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.+?)\s*$/.exec(attr);
          if (m) {
            const aName = camelCase(m[1]);
            const aType = tsType(m[2]);
            const isPrivate = attr.trim().startsWith('-');
            const visibility = isPrivate ? '/** @private */ ' : '';
            lines.push(`  ${visibility}${aName}: ${aType};`);
          } else {
            lines.push(`  // ${attr}`);
          }
        }
        // methods: "+takeDamage(amount: int): void"
        for (const method of (c.methods || [])) {
          const m = /^\s*[+\-#]?\s*([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*:\s*(.+?)\s*$/.exec(method);
          if (m) {
            const mName = camelCase(m[1]);
            const argsStr = m[2].trim();
            const retType = tsType(m[3]);
            const args = argsStr ? argsStr.split(',').map(arg => {
              const am = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.+?)\s*$/.exec(arg);
              if (am) return `${camelCase(am[1])}: ${tsType(am[2])}`;
              return arg.trim();
            }).join(', ') : '';
            lines.push(`  ${mName}(${args}): ${retType};`);
          } else {
            lines.push(`  // ${method}`);
          }
        }
        lines.push(`}`, '');
      }
    }
    return lines.join('\n');
  }

  /* ---- 2. data-table → JSON Schema + Zod ---- */
  function exportJsonSchema(project) {
    const slides = (project.slides || []).filter(s => s.type === 'data-table');
    if (slides.length === 0) throw new Error('data-table 슬라이드가 없습니다.');
    const schemas = {};
    for (const slide of slides) {
      const cols = slide.data?.columns || [];
      const rows = slide.data?.rows || [];
      const name = sanitizeName(slide.data?.title, 'Table');
      const properties = {};
      const required = [];
      // 컬럼 = 필드 매핑
      const fieldCol = cols.find(c => /field|name|key|id/i.test(c.key));
      const typeCol = cols.find(c => /type/i.test(c.key));
      const reqCol = cols.find(c => /^req/i.test(c.key));
      const descCol = cols.find(c => /desc|note|comment/i.test(c.key));
      for (const r of rows) {
        const fieldName = (r[fieldCol?.key] || '').trim();
        if (!fieldName) continue;
        const fieldType = typeCol ? r[typeCol.key] : 'string';
        const isRequired = reqCol ? (String(r[reqCol.key] || '').toUpperCase() === 'Y') : false;
        const desc = descCol ? (r[descCol.key] || '').replace(/`/g, '') : '';
        properties[fieldName] = { ...jsonSchemaType(fieldType), description: desc };
        if (isRequired) required.push(fieldName);
      }
      schemas[name] = {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: `#/components/schemas/${name}`,
        title: slide.data?.title || name,
        type: 'object',
        properties,
        required,
        additionalProperties: false,
      };
    }
    return JSON.stringify(schemas, null, 2);
  }

  function exportZod(project) {
    const slides = (project.slides || []).filter(s => s.type === 'data-table');
    if (slides.length === 0) throw new Error('data-table 슬라이드가 없습니다.');
    const lines = [
      `// ${project.title || 'GDD'} — auto-generated Zod schemas`,
      `import { z } from 'zod';`,
      '',
    ];
    const zodType = (t) => {
      const lower = (t || '').toLowerCase().trim();
      if (lower === 'uuid') return 'z.string().uuid()';
      if (lower === 'datetime') return 'z.string().datetime()';
      if (lower === 'int' || lower === 'integer') return 'z.number().int()';
      if (lower === 'number' || lower === 'float') return 'z.number()';
      if (lower === 'bool' || lower === 'boolean') return 'z.boolean()';
      if (lower === 'json' || lower === 'object') return 'z.record(z.unknown())';
      return 'z.string()';
    };
    for (const slide of slides) {
      const cols = slide.data?.columns || [];
      const rows = slide.data?.rows || [];
      const name = pascalCase(slide.data?.title || 'Table');
      const fieldCol = cols.find(c => /field|name|key|id/i.test(c.key));
      const typeCol = cols.find(c => /type/i.test(c.key));
      const reqCol = cols.find(c => /^req/i.test(c.key));
      const descCol = cols.find(c => /desc|note/i.test(c.key));
      lines.push(`/** ${slide.data?.title || ''} */`);
      lines.push(`export const ${name}Schema = z.object({`);
      for (const r of rows) {
        const fieldName = (r[fieldCol?.key] || '').trim();
        if (!fieldName) continue;
        const fieldType = typeCol ? r[typeCol.key] : 'string';
        const isRequired = reqCol ? (String(r[reqCol.key] || '').toUpperCase() === 'Y') : true;
        const desc = descCol ? r[descCol.key] : '';
        let v = zodType(fieldType);
        if (desc) v += `.describe(${JSON.stringify(desc.replace(/`/g, ''))})`;
        if (!isRequired) v += `.optional()`;
        lines.push(`  ${fieldName}: ${v},`);
      }
      lines.push(`});`);
      lines.push(`export type ${name} = z.infer<typeof ${name}Schema>;`);
      lines.push('');
    }
    return lines.join('\n');
  }

  /* ---- 3. state-machine → XState v5 ---- */
  function exportXState(project) {
    const slides = (project.slides || []).filter(s => s.type === 'state-machine');
    if (slides.length === 0) throw new Error('state-machine 슬라이드가 없습니다.');
    const machines = [];
    for (const slide of slides) {
      const states = slide.data?.states || [];
      const transitions = slide.data?.transitions || [];
      const initial = states.find(s => s.kind === 'initial') || states[0];
      const cleanCode = (s) => (s || '').replace(/`/g, '').trim();
      const stateMap = {};
      for (const st of states) {
        const onTransitions = transitions.filter(t => t.from === st.id);
        const onObj = {};
        for (const t of onTransitions) {
          const ev = t.event || 'EVENT';
          const stateName = states.find(s => s.id === t.to)?.name || t.to;
          const entry = { target: stateName };
          if (t.guard) entry.guard = cleanCode(t.guard);
          if (t.action) entry.actions = [cleanCode(t.action)];
          onObj[ev] = entry;
        }
        const sObj = { id: st.name };
        if (st.kind === 'final') sObj.type = 'final';
        if (st.onEnter) sObj.entry = [cleanCode(st.onEnter)];
        if (st.onExit) sObj.exit = [cleanCode(st.onExit)];
        if (Object.keys(onObj).length) sObj.on = onObj;
        stateMap[st.name] = sObj;
      }
      machines.push({
        id: sanitizeName(slide.data?.title, 'machine'),
        initial: initial ? initial.name : Object.keys(stateMap)[0],
        states: stateMap,
      });
    }
    return JSON.stringify(machines.length === 1 ? machines[0] : machines, null, 2);
  }

  /* ---- 4. api-contract → OpenAPI 3.1 YAML ---- */
  function exportOpenApi(project) {
    const slides = (project.slides || []).filter(s => s.type === 'api-contract');
    if (slides.length === 0) throw new Error('api-contract 슬라이드가 없습니다.');
    const lines = [
      'openapi: 3.1.0',
      'info:',
      `  title: ${JSON.stringify(project.title || 'GDD API')}`,
      `  version: ${JSON.stringify(project.version || '1.0.0')}`,
      `  description: ${JSON.stringify(project.subtitle || 'Auto-generated from GDD api-contract slides.')}`,
      'paths:',
    ];
    // path 별로 메서드 모으기
    const byPath = {};
    for (const slide of slides) {
      const d = slide.data || {};
      const path = d.endpoint || '/unknown';
      const method = (d.method || 'POST').toLowerCase();
      byPath[path] = byPath[path] || {};
      byPath[path][method] = d;
    }
    for (const path of Object.keys(byPath)) {
      lines.push(`  ${JSON.stringify(path)}:`);
      for (const method of Object.keys(byPath[path])) {
        const d = byPath[path][method];
        lines.push(`    ${method}:`);
        lines.push(`      summary: ${JSON.stringify(d.notes || `${method.toUpperCase()} ${path}`)}`);
        if (d.auth && d.auth !== 'none') {
          lines.push(`      security:`);
          lines.push(`        - ${d.auth}: []`);
        }
        // request
        if (method !== 'get' && d.request) {
          lines.push(`      requestBody:`);
          lines.push(`        required: true`);
          lines.push(`        content:`);
          lines.push(`          application/json:`);
          lines.push(`            schema:`);
          lines.push(`              type: object`);
          lines.push(`              example: |`);
          const reqLines = String(d.request).split('\n');
          for (const rl of reqLines) lines.push(`                ${rl}`);
        }
        lines.push(`      responses:`);
        lines.push(`        '200':`);
        lines.push(`          description: success`);
        if (d.response) {
          lines.push(`          content:`);
          lines.push(`            application/json:`);
          lines.push(`              schema:`);
          lines.push(`                type: object`);
          lines.push(`                example: |`);
          const respLines = String(d.response).split('\n');
          for (const rl of respLines) lines.push(`                  ${rl}`);
        }
        for (const err of (d.errors || [])) {
          lines.push(`        '${err.code || '400'}':`);
          lines.push(`          description: ${JSON.stringify(`${err.message || ''} — ${err.when || ''}`.replace(/`/g, ''))}`);
        }
        if (d.slaMs) {
          lines.push(`      x-sla-ms: ${d.slaMs}`);
        }
        if (d.idempotencyKey) {
          lines.push(`      x-idempotency: ${JSON.stringify(d.idempotencyKey.replace(/`/g, ''))}`);
        }
      }
    }
    return lines.join('\n');
  }

  /* ---- 5. acceptance-criteria → Gherkin .feature ---- */
  function exportGherkin(project) {
    const slides = (project.slides || []).filter(s => s.type === 'acceptance-criteria');
    if (slides.length === 0) throw new Error('acceptance-criteria 슬라이드가 없습니다.');
    const out = [];
    for (const slide of slides) {
      const story = slide.data?.userStory || {};
      const lines = [];
      lines.push(`Feature: ${slide.data?.title || 'Feature'}`);
      if (story.as || story.want || story.soThat) {
        lines.push(`  As a ${story.as || 'user'}`);
        lines.push(`  I want ${story.want || ''}`);
        lines.push(`  So that ${story.soThat || ''}`);
      }
      lines.push('');
      for (const c of (slide.data?.criteria || [])) {
        const cleanGiven = (c.given || '').replace(/\n/g, ' ').replace(/`/g, '"');
        const cleanWhen = (c.when || '').replace(/\n/g, ' ').replace(/`/g, '"');
        const cleanThen = (c.then || '').replace(/\n/g, ' ').replace(/`/g, '"');
        lines.push(`  @${(c.id || 'AC').replace(/\s+/g, '_')}`);
        lines.push(`  Scenario: ${c.id || ''}`);
        lines.push(`    Given ${cleanGiven}`);
        lines.push(`    When ${cleanWhen}`);
        lines.push(`    Then ${cleanThen}`);
        for (const e of (c.edgeCases || [])) {
          lines.push(`    # edge case: ${e.replace(/\n/g, ' ').replace(/`/g, '"')}`);
        }
        lines.push('');
      }
      out.push(lines.join('\n'));
    }
    return out.join('\n# ===\n\n');
  }

  /* ---- 6. balance-table → CSV ---- */
  function exportBalanceCsv(project) {
    const slides = (project.slides || []).filter(s => s.type === 'balance-table');
    if (slides.length === 0) throw new Error('balance-table 슬라이드가 없습니다.');
    const csvEscape = (v) => {
      const s = String(v == null ? '' : v).replace(/`/g, '');
      if (/[,"\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    };
    const parts = [];
    for (const slide of slides) {
      const title = (slide.data?.title || 'balance').replace(/\n/g, ' ');
      parts.push(`# ${title}`);
      if (slide.data?.formula) parts.push(`# formula: ${slide.data.formula.replace(/`/g, '')}`);
      parts.push(['name', 'formula', 'range', 'default', 'sensitivity', 'notes'].join(','));
      for (const v of (slide.data?.vars || [])) {
        parts.push([v.name, v.formula, v.range, v.defaultValue, v.sensitivity, v.notes].map(csvEscape).join(','));
      }
      if (slide.data?.curve && Array.isArray(slide.data.curve.x)) {
        parts.push('');
        parts.push(`# curve: ${slide.data.curve.xLabel || 'x'} → ${slide.data.curve.yLabel || 'y'}`);
        parts.push(slide.data.curve.x.map(csvEscape).join(','));
        parts.push(slide.data.curve.y.map(csvEscape).join(','));
      }
      parts.push('');
    }
    return parts.join('\n');
  }

  /** 모든 어댑터를 한 ZIP 으로 내보내는 메타 — 호출자는 결과를 보고 다운로드 */
  function exportAll(project) {
    const out = {};
    const safe = (fn, key) => {
      try { out[key] = fn(project); } catch (e) { out[key] = `// ${e.message}`; }
    };
    safe(exportTypeScript, 'types.ts');
    safe(exportJsonSchema, 'schemas.json');
    safe(exportZod, 'schemas.zod.ts');
    safe(exportXState, 'machines.json');
    safe(exportOpenApi, 'api.openapi.yaml');
    safe(exportGherkin, 'features.feature');
    safe(exportBalanceCsv, 'balance.csv');
    return out;
  }

  window.gddExportAdapters = {
    exportTypeScript, exportJsonSchema, exportZod,
    exportXState, exportOpenApi, exportGherkin, exportBalanceCsv,
    exportAll,
  };
})();
