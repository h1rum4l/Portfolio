import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = process.env.PORTFOLIO_ROOT || resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];

test('every bare module import resolves through the import map', () => {
  const map = scripts.find(([, attrs]) => /type=["']importmap["']/.test(attrs));
  assert.ok(map, 'Import map is present');
  const { imports } = JSON.parse(map[2]);
  const specifiers = scripts.flatMap(([, attrs, code]) => /type=["']importmap["']/.test(attrs) ? [] :
    [...code.matchAll(/\bfrom\s*["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']/g)].map(m => m[1] || m[2]));
  assert.ok(specifiers.length, 'Found imports to check');
  const unresolved = specifiers.filter(s => !/^(?:[./]|[a-z]+:)/i.test(s)).filter(s =>
    !Object.keys(imports).some(key => key === s || (key.endsWith('/') && s.startsWith(key))));
  assert.deepEqual(unresolved, [], 'Every bare specifier needs an exact or slash-prefix mapping');
});

test('local asset paths work below /Portfolio/ as well as at the domain root', () => {
  assert.ok(!/["'(]\/(?:assets|fonts)\//.test(html), 'Root-relative paths escape the project URL');
});

test('unverified participant and membership metrics are not published', () => {
  assert.ok(!/250\s+participating|40%\s+growth/i.test(html), 'Unverified metrics must remain placeholders');
});

test('social anchors retain their native link semantics', () => {
  const anchors = html.match(/<a\b[^>]*>/gi) || [];
  assert.ok(anchors.length);
  assert.ok(anchors.every(a => !/\brole=["']listitem["']/i.test(a)), 'Wrap anchors in list items rather than overriding their role');
});

test('first role panel is initialized from the selector data', () => {
  assert.ok(/\bactive\s*=\s*-1\b/.test(html), 'Initial active index permits first render');
  assert.ok(/\bselectRole\(\s*0\s*\)\s*;/.test(html), 'First role is initialized through the selector');
});

test('social preview image metadata uses absolute public URLs', () => {
  for (const key of ['og:image', 'twitter:image']) {
    const tag = (html.match(/<meta\b[^>]*>/gi) || []).find(t => t.includes(`"${key}"`) || t.includes(`'${key}'`));
    assert.ok(tag, `${key} exists`);
    const url = tag.match(/\bcontent=["']([^"']*)["']/i)?.[1];
    assert.match(url || '', /^https:\/\/[^/]+\/.+/, `${key} must be an absolute HTTPS URL`);
  }
});

function contactHarness({ valid = true, copyResult = false } = {}) {
  const script = scripts.find(([, , code]) => code.includes('// Contact message composer logic'))?.[2];
  assert.ok(script, 'Contact script found');
  const code = script.slice(script.indexOf('// Contact message composer logic'), script.indexOf('function reducedChanged'));
  const events = new Map();
  const elements = new Map();
  let removed = false;
  let validationCalls = 0;
  const values = { '#sender-name': '', '#sender-contact': '', '#sender-topic': 'General Inquiry', '#sender-message': 'A test message' };
  function element(selector) {
    if (!elements.has(selector)) elements.set(selector, {
      value: values[selector] || '', textContent: '', style: {},
      classList: { add() {}, remove() {} }, focus() {}, reset() {},
      addEventListener(type, callback) { events.set(`${selector}:${type}`, callback); },
      reportValidity() { validationCalls++; return valid; },
      checkValidity() { validationCalls++; return valid; }
    });
    return elements.get(selector);
  }
  const context = {
    document: {
      querySelector: element,
      createElement: () => ({ style: {}, select() {}, remove() { removed = true; } }),
      body: { appendChild() {} },
      execCommand: () => copyResult
    },
    navigator: {}, window: { location: { href: '' } },
    setTimeout: () => 1, clearTimeout() {}, encodeURIComponent
  };
  vm.runInNewContext(code, context);
  return { context, events, element, removed: () => removed, validationCalls: () => validationCalls };
}

test('required name and contact fields prevent opening an invalid email draft', async () => {
  const harness = contactHarness({ valid: false });
  const handler = harness.events.get('#contact-form:submit') || harness.events.get('#btn-send:click');
  assert.ok(handler, 'Send or submit handler is wired');
  await handler({ preventDefault() {} });
  assert.ok(harness.validationCalls() > 0, 'Native validation checks all required fields');
  assert.equal(harness.context.window.location.href, '', 'Invalid form must not open an email client');
});

test('failed clipboard fallback reports failure and removes its temporary field', async () => {
  const harness = contactHarness({ copyResult: false });
  const handler = harness.events.get('#btn-copy:click');
  assert.ok(handler, 'Copy handler is wired');
  await handler({ preventDefault() {} });
  assert.match(harness.element('#toast-text').textContent, /fail|unable|could not|couldn.t/i);
  assert.ok(harness.removed(), 'Temporary textarea is cleaned up even when copying fails');
});
