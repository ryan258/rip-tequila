// Party kit: guest list, role assignment, and the two sheets that need names.
// Names live in this browser's localStorage and are never sent anywhere.

type Cast = { slug: string; name: string; role: string };
type Guest = { name: string; slug: string };

const STORAGE_KEY = 'rip-party';
const CARDS_PER_PAGE = 10;

function readCast(): Cast[] {
  const raw = document.getElementById('party-cast')?.textContent;
  try {
    return raw ? (JSON.parse(raw) as Cast[]) : [];
  } catch {
    return [];
  }
}

function loadGuests(): Guest[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed)
      ? parsed.filter((g): g is Guest => typeof g?.name === 'string' && typeof g?.slug === 'string')
      : [];
  } catch {
    return [];
  }
}

function saveGuests(guests: Guest[]): boolean {
  try {
    const encoded = JSON.stringify(guests);
    localStorage.setItem(STORAGE_KEY, encoded);
    return localStorage.getItem(STORAGE_KEY) === encoded;
  } catch {
    return false;
  }
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

function initHub(): void {
  const box = document.querySelector<HTMLTextAreaElement>('[data-party-guests]');
  const decide = document.querySelector<HTMLButtonElement>('[data-party-decide]');
  const roster = document.querySelector<HTMLElement>('[data-party-roster]');
  const status = document.querySelector<HTMLElement>('[data-party-status]');

  if (!box || !decide || !roster || !status) {
    return;
  }

  const cast = readCast();
  let guests = loadGuests();
  let saved = true;
  const storageNotice = (): string => saved
    ? ''
    : ' Names and roles are only on this page: browser storage is unavailable. Keep this tab open and copy the roster before leaving; print pages may show an older or blank list.';
  box.value = guests.map((g) => g.name).join('\n');

  const names = (): string[] =>
    box.value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

  const render = (): void => {
    roster.replaceChildren(
      ...guests.map((g) => {
        const li = document.createElement('li');
        const c = cast.find((x) => x.slug === g.slug);
        li.textContent = c ? `${g.name} → ${c.name} (${c.role})` : `${g.name} → A Regular`;
        return li;
      }),
    );
    status.textContent = guests.length
      ? `${guests.length} on the roster. Press the button again to re-roll.`
      : 'Nobody is on the roster yet.';
    status.textContent += storageNotice();
  };

  // Editing the list throws the old roles away; the bell has to decide again.
  box.addEventListener('input', () => {
    guests = names().map((name) => ({ name, slug: '' }));
    saved = saveGuests(guests);
    roster.replaceChildren();
    status.textContent = (guests.length ? 'Names changed. Let the bell decide.' : 'Nobody is on the roster yet.') + storageNotice();
  });

  // More guests than cast: the bell picks who gets a role, so the top of the
  // list isn't always the cast.
  decide.addEventListener('click', () => {
    guests = names().map((name) => ({ name, slug: '' }));
    const lucky = shuffle(guests.map((_, i) => i));
    const slugs = shuffle(cast.map((c) => c.slug));
    for (let k = 0; k < Math.min(guests.length, slugs.length); k++) {
      const guest = guests[lucky[k] as number];
      if (guest) {
        guest.slug = slugs[k] as string;
      }
    }
    saved = saveGuests(guests);
    render();
  });

  render();
}

function initCards(): void {
  const mount = document.querySelector<HTMLElement>('[data-party-cards]');
  const tpl = document.getElementById('party-card-tpl');

  if (!mount || !(tpl instanceof HTMLTemplateElement)) {
    return;
  }

  const cast = readCast();
  const guests = loadGuests();
  // Pad to a full sheet so latecomers get a blank card to write on.
  const total = Math.max(1, Math.ceil(guests.length / CARDS_PER_PAGE)) * CARDS_PER_PAGE;
  const pages: HTMLElement[] = [];
  let grid: HTMLElement | null = null;

  for (let i = 0; i < total; i++) {
    if (i % CARDS_PER_PAGE === 0) {
      const page = document.createElement('div');
      page.className = 'party-paper';
      grid = document.createElement('div');
      grid.className = 'party-cards';
      page.append(grid);
      pages.push(page);
    }

    const card = tpl.content.cloneNode(true) as DocumentFragment;
    const guest = guests[i];
    const character = guest ? cast.find((c) => c.slug === guest.slug) : undefined;
    const name = card.querySelector<HTMLElement>('[data-card-name]');
    const role = card.querySelector<HTMLElement>('[data-card-role]');
    const roster = card.querySelector<HTMLElement>('[data-card-roster]');

    if (name) {
      name.textContent = guest?.name ?? '';
      if ((guest?.name.length ?? 0) > 14) {
        name.dataset.long = '';
      }
    }
    if (role) {
      role.textContent = `Permanent Resident • ${character ? character.name : 'La Cantina'}`;
    }
    if (roster) {
      roster.textContent = `#${String(i + 1).padStart(4, '0')}-DM-RIP`;
    }
    grid?.append(card);
  }

  mount.replaceChildren(...pages);
}

function initPlacards(): void {
  const placards = document.querySelectorAll<HTMLElement>('.placard[data-slug]');

  if (placards.length === 0) {
    return;
  }

  const guests = loadGuests();
  placards.forEach((placard) => {
    const player = placard.querySelector<HTMLElement>('[data-placard-player]');
    const guest = guests.find((g) => g.slug === placard.dataset.slug);
    if (player) {
      player.textContent = guest?.name ?? '';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHub();
  initCards();
  initPlacards();
  document.querySelectorAll('[data-print]').forEach((button) => {
    button.addEventListener('click', () => window.print());
  });
});
