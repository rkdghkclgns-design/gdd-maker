#!/usr/bin/env node
/**
 * 빌드 스크립트 — 모든 .jsx 파일을 단일 bundle.jsx로 concat.
 *
 * 이유:
 * - babel-standalone은 다수의 <script type="text/babel"> 스크립트의 cross-file 식별자
 *   인식이 일관적이지 않음 (모듈 스코프 격리 발생). 같은 컴파일 단위로 합치면 안정.
 *
 * 사용:
 *   node build.js
 *
 * 출력: bundle.jsx (모든 .jsx 파일을 순서대로 합친 단일 파일)
 *
 * GitHub Actions에서도 동일 명령으로 빌드한다.
 */

const fs = require('fs');
const path = require('path');

const ORDER = [
  'tweaks-panel.jsx',
  'slides.jsx',
  'diagram.jsx',
  'brief.jsx',
  'concept.jsx',
  'chat.jsx',
  'doc-export.jsx',
  'command-palette.jsx',
  'app.jsx',
];

const ROOT = __dirname;
const OUT = path.join(ROOT, 'bundle.jsx');

function build() {
  const banner = `/* === GDD 메이커 — 자동 생성 번들 ===\n   ${ORDER.length}개 .jsx 파일을 단일 컴파일 단위로 합침.\n   수정은 원본 .jsx 파일에서. 빌드: node build.js\n   생성 시각: ${new Date().toISOString()}\n*/\n\n`;
  const parts = [banner];
  for (const file of ORDER) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠ ${file} 없음 — 건너뜀`);
      continue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    parts.push(`// ============================================================\n// File: ${file}\n// ============================================================\n${content}\n\n`);
  }
  const out = parts.join('');
  fs.writeFileSync(OUT, out, 'utf-8');
  const kb = (out.length / 1024).toFixed(1);
  console.log(`✓ bundle.jsx 생성: ${ORDER.length}개 파일, ${kb} KB`);
}

build();
