const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// Build the current site locally, then point RIP_PARTY_JS at its emitted party bundle.
// No browser, real localStorage, print action, or network is used.
assert(process.env.RIP_PARTY_JS, 'Set RIP_PARTY_JS to the freshly built ts/party.*.js bundle.');
const bundle = fs.readFileSync(process.env.RIP_PARTY_JS, 'utf8');

// sheets: also mount the print pages (cards + placards). confirm: answer to "erase?".
function fixture({ failWrite = false, dropWrite = false, failRead = false, stored, sheets = false, confirm = true } = {}) {
  const callbacks = {};
  const node = () => ({ value: '', textContent: '', className: '', dataset: {}, events: {}, children: [],
    addEventListener(event, callback) { this.events[event] = callback; },
    replaceChildren(...children) { this.children = children; },
    append(...children) { this.children.push(...children); } });
  const box = node(), decide = node(), reset = node(), roster = node(), status = node();
  const elements = { '[data-party-guests]': box, '[data-party-decide]': decide, '[data-party-reset]': reset,
    '[data-party-roster]': roster, '[data-party-status]': status };
  const cards = [], mount = node(), placards = [];
  class Template {
    constructor() {
      this.content = { cloneNode: () => {
        const card = { name: node(), role: node(), roster: node() };
        cards.push(card);
        return { querySelector: (s) => ({ '[data-card-name]': card.name, '[data-card-role]': card.role, '[data-card-roster]': card.roster })[s] ?? null };
      } };
    }
  }
  if (sheets) {
    elements['[data-party-cards]'] = mount;
    for (const slug of ['one', 'two']) {
      const player = node();
      placards.push({ dataset: { slug }, player, querySelector: () => player });
    }
  }
  const values = new Map(stored === undefined ? [] : [['rip-party', stored]]);
  const writes = [];
  const storage = {
    getItem(key) { if (failRead) throw new Error('blocked read'); return values.get(key) ?? null; },
    setItem(key, value) { writes.push([key, value]); if (failWrite) throw new Error('blocked storage'); if (!dropWrite) values.set(key, value); },
    removeItem(key) { values.delete(key); },
  };
  const document = {
    getElementById(id) {
      if (id === 'party-cast') return { textContent: JSON.stringify([
        { slug: 'one', name: 'First Role', role: 'Host' },
        { slug: 'two', name: 'Second Role', role: 'Guest' },
      ]) };
      return id === 'party-card-tpl' && sheets ? new Template() : null;
    },
    querySelector(selector) { return elements[selector] ?? null; },
    querySelectorAll(selector) { return selector === '.placard[data-slug]' ? placards : []; },
    createElement() { return node(); },
    addEventListener(event, callback) { callbacks[event] = callback; },
  };
  vm.runInNewContext(bundle, { document, localStorage: storage, HTMLTemplateElement: Template,
    window: { print() { throw new Error('No printing in fixture'); }, confirm: () => confirm } });
  callbacks.DOMContentLoaded();
  return { box, decide, reset, roster, status, values, writes, cards, mount, placards };
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


test('unreadable saved guest data is preserved while a temporary roster stays usable', () => {
  for (const raw of ['{broken synthetic roster', '{}', '[{"name":"Old fixture","slug":"one"},null]', '[{"name":"Old fixture"}]']) {
    const f = fixture({ stored: raw });
    f.box.value = 'Temporary fixture'; f.box.events.input(); f.decide.events.click();
    assert.equal(f.values.get('rip-party'), raw, 'ordinary input must not erase unreadable saved names');
    assert.equal(f.writes.length, 0);
    assert.equal(f.roster.children.length, 1);
    assert.match(f.status.textContent, /saved.*kept|recovery/i);
  }
});

test('blocked storage reads warn at startup and never overwrite an unseen roster', () => {
  const raw = JSON.stringify([{ name: 'Unseen fixture', slug: 'one' }]);
  const f = fixture({ stored: raw, failRead: true });
  assert.match(f.status.textContent, /storage is unavailable/i);
  f.box.value = 'Temporary fixture'; f.box.events.input(); f.decide.events.click();
  assert.equal(f.values.get('rip-party'), raw);
  assert.equal(f.writes.length, 0);
  assert.match(f.status.textContent, /copy the roster/);
});

test('valid saved guest roles load without rewriting and remain editable', () => {
  const raw = JSON.stringify([{ name: 'Synthetic Guest', slug: 'one' }]);
  const f = fixture({ stored: raw });
  assert.equal(f.box.value, 'Synthetic Guest');
  assert.match(f.roster.children[0].textContent, /First Role/);
  assert.equal(f.writes.length, 0);
  f.box.value = 'Edited fixture'; f.box.events.input();
  assert.equal(JSON.parse(f.values.get('rip-party'))[0].name, 'Edited fixture');
  assert.doesNotMatch(f.status.textContent, /unavailable|could not be read/);
});

test('editing the list keeps assigned roles', () => {
  const f = fixture({ stored: JSON.stringify([{ name: 'Alic', slug: 'one' }, { name: 'Bob', slug: 'two' }]) });
  const saved = () => JSON.parse(f.values.get('rip-party'));
  f.box.value = 'Alice\nBob'; f.box.events.input();                 // typo fixed in place
  assert.deepEqual(saved(), [{ name: 'Alice', slug: 'one' }, { name: 'Bob', slug: 'two' }]);
  f.box.value = 'Bob\nAlice'; f.box.events.input();                 // reordered: roles follow names
  assert.deepEqual(saved(), [{ name: 'Bob', slug: 'two' }, { name: 'Alice', slug: 'one' }]);
  f.box.value = 'Zed\nBob\nAlice'; f.box.events.input();            // new guest starts without a role
  assert.deepEqual(saved(), [{ name: 'Zed', slug: '' }, { name: 'Bob', slug: 'two' }, { name: 'Alice', slug: 'one' }]);
  f.box.value = 'Alice'; f.box.events.input();                      // guest removed
  assert.deepEqual(saved(), [{ name: 'Alice', slug: 'one' }]);
  assert.match(f.roster.children[0].textContent, /First Role/);
});

test('duplicate names keep their own roles in list order', () => {
  const f = fixture({ stored: JSON.stringify([{ name: 'Sam', slug: 'one' }, { name: 'Sam', slug: 'two' }]) });
  const saved = () => JSON.parse(f.values.get('rip-party'));
  f.box.value = 'Sam\nSam\nSam'; f.box.events.input();
  assert.deepEqual(saved(), [{ name: 'Sam', slug: 'one' }, { name: 'Sam', slug: 'two' }, { name: 'Sam', slug: '' }]);
  f.box.value = 'Sam'; f.box.events.input();                       // twins are positional: the first keeps its role
  assert.deepEqual(saved(), [{ name: 'Sam', slug: 'one' }]);
});

test('Start Over erases saved data on confirm, including unreadable data, and leaves it alone otherwise', () => {
  const valid = JSON.stringify([{ name: 'Synthetic Guest', slug: 'one' }]);
  const declined = fixture({ stored: valid, confirm: false });
  declined.reset.events.click();
  assert.equal(declined.values.get('rip-party'), valid);
  assert.equal(declined.box.value, 'Synthetic Guest');

  const f = fixture({ stored: valid });
  f.reset.events.click();
  assert.equal(f.values.get('rip-party'), '[]');
  assert.equal(f.box.value, '');
  assert.equal(f.roster.children.length, 0);

  const broken = fixture({ stored: '{broken synthetic roster' });
  assert.match(broken.status.textContent, /could not be read/);
  broken.reset.events.click();
  assert.doesNotMatch(broken.status.textContent, /could not be read|unavailable/);
  broken.box.value = 'Fresh start'; broken.box.events.input();
  assert.deepEqual(JSON.parse(broken.values.get('rip-party')), [{ name: 'Fresh start', slug: '' }]);
});

test('cards pad to full sheets and carry names, roles, and numbers', () => {
  const guests = Array.from({ length: 11 }, (_, i) => ({ name: i === 0 ? 'A Very Long Guest Name' : `Guest ${i}`, slug: ['one', 'two'][i] ?? '' }));
  const f = fixture({ stored: JSON.stringify(guests), sheets: true });
  assert.equal(f.cards.length, 20, '11 guests need two sheets of ten');
  assert.equal(f.mount.children.length, 2);
  assert.equal(f.cards[0].name.textContent, 'A Very Long Guest Name');
  assert.ok('long' in f.cards[0].name.dataset, 'long names get the shrink flag');
  assert.equal(f.cards[0].role.textContent, 'Permanent Resident • First Role');
  assert.equal(f.cards[2].role.textContent, 'Permanent Resident • La Cantina');
  assert.equal(f.cards[19].name.textContent, '', 'spare cards stay blank for latecomers');
  assert.equal(f.cards[19].roster.textContent, '#0020-DM-RIP');
});

test('an empty roster still prints one blank sheet of cards', () => {
  const f = fixture({ sheets: true });
  assert.equal(f.cards.length, 10);
  assert.ok(f.cards.every((c) => c.name.textContent === ''));
});

test('placards show the player assigned to each role and stay blank otherwise', () => {
  const f = fixture({ stored: JSON.stringify([{ name: 'Alice', slug: 'two' }]), sheets: true });
  assert.equal(f.placards[0].player.textContent, '');
  assert.equal(f.placards[1].player.textContent, 'Alice');
});
