// 从 tests 下所有 .spec.ts 中提取 CASE_META，输出 JSON，便于从库拉取后读取用例基础信息。
// 运行：node scripts/collect-case-meta.js
// 输出到 stdout 或 --output=case-meta.json

const fs = require('fs');
const path = require('path');

const testsDir = path.resolve(__dirname, '../tests');
const outArg = process.argv.find(a => a.startsWith('--output='));
const outputFile = outArg ? outArg.slice('--output='.length) : null;

function findSpecs(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules') findSpecs(full, list);
    else if (e.isFile() && e.name.endsWith('.spec.ts')) list.push(full);
  }
  return list;
}

function extractCaseMeta(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(path.resolve(__dirname, '..'), filePath);

  // 匹配 const CASE_META = { ... }; 或 const CASE_META: CaseMeta = { ... };
  const startMark = 'CASE_META';
  const idx = content.indexOf(startMark);
  if (idx === -1) return null;

  const afterName = content.indexOf('=', idx);
  if (afterName === -1) return null;
  let brace = content.indexOf('{', afterName);
  if (brace === -1) return null;

  let depth = 1;
  let end = brace + 1;
  while (depth > 0 && end < content.length) {
    const c = content[end];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    end++;
  }
  const objStr = content.slice(brace, end);

  // 简单提取 key: 'value' 或 key: "value"
  const result = { file: relPath, priority: '', description: '', author: '', createdAt: '' };
  const pairs = [
    ['priority', /priority\s*:\s*['"]([^'"]+)['"]/],
    ['description', /description\s*:\s*['"]([^'"]+)['"]/],
    ['author', /author\s*:\s*['"]([^'"]+)['"]/],
    ['createdAt', /createdAt\s*:\s*['"]([^'"]+)['"]/],
  ];
  for (const [key, re] of pairs) {
    const m = objStr.match(re);
    if (m) result[key] = m[1];
  }
  return result;
}

const specFiles = findSpecs(testsDir);
const metaList = [];
for (const f of specFiles) {
  const meta = extractCaseMeta(f);
  if (meta && (meta.priority || meta.description)) metaList.push(meta);
}

const json = JSON.stringify(metaList, null, 2);
if (outputFile) {
  fs.writeFileSync(outputFile, json, 'utf8');
  console.log('Written to', outputFile);
} else {
  console.log(json);
}
