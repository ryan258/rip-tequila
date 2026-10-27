const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// Build the current site locally, then point RIP_PARTY_JS at its emitted party bundle.
// No browser, real localStorage, print action, or network is used.
assert(process.env.RIP_PARTY_JS, 'Set RIP_PARTY_JS to the freshly built ts/party.*.js bundle.');
const bundle = fs.readFileSync(process.env.RIP_PARTY_JS, 'utf8');

function fixture({ failWrite = false, dropWrite = false } = {}) {
  const callbacks = {};
  const node = () => ({ value: '', textContent: '', events: {}, children: [],
    addEventListener(event, callback) { this.events[event] = callback; },
    replaceChildren(...children) { this.children = children; } });
  const box = node(), decide = node(), roster = node(), status = node();
  const elements = { '[data-party-guests]': box, '[data-party-decide]': decide,
    '[data-party-roster]': roster, '[data-party-status]': status };
  const values = new Map();
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { if (failWrite) throw new Error('blocked storage'); if (!dropWrite) values.set(key, value); },
  };
  const document = {
    getElementById(id) { return id === 'party-cast' ? { textContent: JSON.stringify([
      { slug: 'one', name: 'First Role', role: 'Host' },
      { slug: 'two', name: 'Second Role', role: 'Guest' },
    ]) } : null; },
    querySelector(selector) { return elements[selector] ?? null; },
    querySelectorAll() { return []; },
    createElement() { return node(); },
    addEventListener(event, callback) { callbacks[event] = callback; },
  };
  vm.runInNewContext(bundle, { document, localStorage: storage, HTMLTemplateElement: class {}, window: { print() { throw new Error('No printing in fixture'); } } });
  callbacks.DOMContentLoaded();
  return { box, decide, roster, status, values };
}

test('names and assigned roles persist when storage works', () => {
  const f = fixture();
  f.box.value = 'Alice\nBob'; f.box.events.input(); f.decide.events.click();
  assert.equal(JSON.parse(f.values.get('rip-party')).length, 2);
  assert.equal(new Set(JSON.parse(f.values.get('rip-party')).map(g => g.slug)).size, 2);
  assert.equal(f.roster.children.length, 2);
  assert.doesNotMatch(f.status.textContent, /storage is unavailable/);
});
for (const mode of ['failWrite', 'dropWrite']) {
  test(`${mode}: keep the visible roster and warn before print-page transfer`, () => {
    const f = fixture({ [mode]: true });
    f.box.value = 'Alice\nBob'; f.box.events.input();
    assert.match(f.status.textContent, /storage is unavailable/);
    assert.equal(f.box.value, 'Alice\nBob');
    f.decide.events.click();
    assert.equal(f.roster.children.length, 2);
    assert.match(f.status.textContent, /copy the roster/);
    assert.match(f.status.textContent, /print pages may show an older or blank list/);
    assert.equal(f.values.has('rip-party'), false);
  });
}
