// Simple SCSS reformatter:
// - Reorders contiguous property runs by categories per spec
// - Keeps original values/selectors as-is
// - Normalizes indentation to 2 spaces and inserts blank lines between top-level blocks
// NOTE: Not a full parser; aims to be conservative and safe.

const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  // Position
  ['position', 'top', 'right', 'bottom', 'left', 'z-index', 'inset'],
  // Box-model
  [
    'display', 'flex', 'flex-grow', 'flex-shrink', 'flex-basis', 'flex-direction', 'flex-wrap', 'order',
    'grid', 'grid-template', 'grid-template-columns', 'grid-template-rows', 'grid-column', 'grid-row',
    'grid-auto-flow', 'grid-auto-columns', 'grid-auto-rows', 'place-items', 'place-content',
    'align-items', 'align-content', 'justify-items', 'justify-content',
    'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-color', 'border-style', 'border-width',
    'border-radius', 'box-sizing', 'gap', 'column-gap', 'row-gap', 'object-fit',
  ],
  // Typography
  [
    'font', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing',
    'text-align', 'text-decoration', 'text-transform', 'color',
  ],
  // Visual (per spec order)
  [
    'background', 'background-color', 'background-image', 'background-position', 'background-size', 'background-repeat',
    'box-shadow', 'transition', 'transform', 'opacity',
  ],
  // Misc
  [
    'cursor', 'overflow', 'overflow-x', 'overflow-y', 'white-space', 'visibility',
  ],
];

function categoryIndex(prop) {
  const p = prop.toLowerCase();
  for (let i = 0; i < CATEGORIES.length; i++) {
    if (CATEGORIES[i].some((k) => p === k || p.startsWith(k + '-'))) return i;
  }
  return CATEGORIES.length; // unknown => last
}

function isPropertyLine(line) {
  const t = line.trim();
  if (!t) return false;
  if (t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) return false;
  if (t.startsWith('@') || t.startsWith('$')) return false; // at-rules or variables
  if (t.includes('{') || t.includes('}')) return false;
  if (!t.includes(':') || !t.endsWith(';')) return false;
  // simple heuristic: property: value;
  const key = t.split(':', 1)[0].trim();
  if (!key || key.includes(' ')) return false;
  return true;
}

function reorderRun(lines) {
  // lines are property lines; keep stable order within category
  const buckets = Array.from({ length: CATEGORIES.length + 1 }, () => []);
  for (const l of lines) {
    const key = l.trim().split(':', 1)[0].trim();
    const idx = categoryIndex(key);
    buckets[idx].push(l);
  }
  return buckets.flat();
}

function reorderPropertiesInBlock(blockText) {
  const lines = blockText.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    // capture contiguous property run
    if (isPropertyLine(lines[i])) {
      const start = i;
      while (i < lines.length && isPropertyLine(lines[i])) i++;
      const indent = (lines[start].match(/^\s*/) || [''])[0];
      const run = lines.slice(start, i);
      const reordered = reorderRun(run);
      for (const l of reordered) out.push(indent + l.trim());
      continue; // do not i++ here, already advanced
    }
    out.push(lines[i]);
    i++;
  }
  return out.join('\n');
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/\r\n?/g, '\n');

  // Skip reordering in variables file; only normalize indentation lightly
  const isVariables = path.basename(filePath) === '_variables.scss' && filePath.includes(path.join('src','styles'));

  // First pass: expand inline blocks and ensure newlines after ; and around braces
  let pre = raw
    // newline after opening brace
    .replace(/\{\s*/g, '{\n')
    // ensure semicolons end lines (but not within urls)
    .replace(/;\s*(?!\n)/g, ';\n')
    // ensure newline before closing brace
    .replace(/\s*\}/g, '\n}')
    // collapse excessive blank lines
    .replace(/\n{3,}/g, '\n\n');

  let text = pre;
  if (!isVariables) {
    // find blocks by brace matching
    const chars = [...raw];
    const stack = [];
    const ranges = []; // pairs of [openIndex, closeIndex]
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === '{') stack.push(i);
      else if (chars[i] === '}') {
        const open = stack.pop();
        if (open != null) ranges.push([open, i]);
      }
    }
    ranges.sort((a, b) => b[0] - a[0]); // process inner blocks first

    let mut = pre;
    for (const [open, close] of ranges) {
      const before = mut.slice(0, open + 1);
      const body = mut.slice(open + 1, close);
      const after = mut.slice(close);
      const newBody = reorderPropertiesInBlock(body);
      mut = before + newBody + after;
    }
    text = mut;
  }

  // Normalize indentation to 2 spaces, add blank line between blocks
  const lines = text.split('\n');
  let depth = 0;
  const out = [];
  for (let ln of lines) {
    ln = ln.replace(/\t/g, '  ').trim();
    const startsWithClose = ln.startsWith('}');
    if (startsWithClose) depth = Math.max(depth - 1, 0);
    const indent = '  '.repeat(depth);
    // add simple comments improvements
    let formatted = ln;
    if (/^&:hover\s*\{\s*$/.test(formatted)) {
      out.push(indent + '// hover state');
    }
    if (/text-align:\s*center;\s*$/.test(formatted) && !/\/\//.test(formatted)) {
      formatted = formatted + ' // centra el texto';
    }
    out.push(indent + formatted);
    const opens = (ln.match(/\{/g) || []).length;
    const closes = (ln.match(/\}/g) || []).length;
    depth += opens - (startsWithClose ? (closes - 1) : closes);
    if (depth < 0) depth = 0;
  }

  // Ensure single blank line between sibling blocks and nested child blocks
  const out2 = [];
  for (let i = 0; i < out.length; i++) {
    out2.push(out[i]);
    const cur = (out[i] || '').trim();
    const nxt = (out[i+1] || '').trim();
    if (cur === '}' && nxt && !nxt.startsWith('}')) {
      out2.push('');
    }
    // also between property runs and next nested selector
    if (/^}/.test(out[i]) && /^&[\w:-]/.test(out[i+1] || '')) {
      out2.push('');
    }
  }

  const finalText = out2.join('\n').replace(/\s+$/gm, '');
  if (finalText !== raw) fs.writeFileSync(filePath, finalText, 'utf8');
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.isFile() && p.endsWith('.scss')) processFile(p);
  }
}

const target = path.join(process.cwd(), 'src');
walk(target);
console.log('SCSS reformat complete.');
