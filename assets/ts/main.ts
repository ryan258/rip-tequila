function getFocusable(container: HTMLElement): HTMLElement[] {
  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (el) => el.getClientRects().length > 0 && !el.closest('[inert], [aria-hidden="true"]'),
  );
}

function initMobileMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');

  if (!toggle || !menu) {
    return;
  }

  let lastFocused: HTMLElement | null = null;

  // The menu is a modal dialog, so the rest of the page has to leave the
  // accessibility tree while it is open — the focus trap alone doesn't stop a
  // screen reader from browsing straight past it.
  const background = [document.querySelector('main'), document.querySelector('.site-footer')].filter(
    (el): el is HTMLElement => el instanceof HTMLElement,
  );
  const setBackgroundInert = (inert: boolean): void => {
    background.forEach((el) => el.toggleAttribute('inert', inert));
  };

  const closeMenu = (): void => {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('has-open-menu');
    setBackgroundInert(false);
    lastFocused?.focus();
  };

  const openMenu = (): void => {
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : toggle;
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('has-open-menu');
    setBackgroundInert(true);
    // Open synchronously. This used to sit inside requestAnimationFrame, which
    // never fires in a backgrounded tab — leaving the page inert behind a menu
    // that never appeared. The transform still transitions from one frame.
    menu.classList.add('is-open');
    getFocusable(menu)[0]?.focus();
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // On the document, not the menu: the toggle sits outside the dialog, so a
  // menu-scoped listener misses Escape and Tab whenever focus starts there.
  document.addEventListener('keydown', (event) => {
    if (!menu.classList.contains('is-open')) {
      return;
    }

    if (event.key === 'Escape') {
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    // The toggle is the close control, so it stays in the cycle.
    const focusable = [toggle, ...getFocusable(menu)];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) {
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (toggle.getClientRects().length === 0 && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

// ponytail: there is no list behind these forms yet, so the response says so
// rather than faking a subscription. When a provider is wired up, this whole
// handler goes away — point the form at the endpoint and let it POST.
function initSignupForms(): void {
  document.querySelectorAll<HTMLFormElement>('[data-signup-form]').forEach((form) => {
    const message = form.querySelector<HTMLElement>('[data-signup-message]');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (message) {
        message.textContent =
          'The manifest is not open yet — nothing was recorded. Check back before the next drop.';
        form.dataset.state = 'pending';
      }
    });
  });
}

function initMerchFilters(): void {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.merch-filter-btn'));
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.merch-product-card'));

  if (buttons.length === 0 || cards.length === 0) {
    return;
  }

  const applyFilter = (filter: string): void => {
    buttons.forEach((btn) => {
      const active = btn.dataset.filter === filter;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    cards.forEach((card) => {
      card.toggleAttribute('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter ?? 'all'));
  });

  document.getElementById('merch-view-all-btn')?.addEventListener('click', () => {
    applyFilter('all');
    document.getElementById('featured-artifacts')?.scrollIntoView({ behavior: 'smooth' });
  });
}

function initHeroMotion(): void {
  const image = document.querySelector<HTMLImageElement>('[data-hero-motion-image]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-hero-motion-toggle]');

  if (!image || !toggle) {
    return;
  }

  const motionSrc = image.dataset.motionSrc;
  const stillSrc = image.dataset.stillSrc;

  if (!motionSrc || !stillSrc) {
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const setPaused = (paused: boolean): void => {
    image.src = paused ? stillSrc : motionSrc;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Play poster motion' : 'Pause poster motion';
  };

  const syncPreference = (): void => {
    const shouldReduce = reducedMotion.matches;
    setPaused(shouldReduce);
    toggle.hidden = shouldReduce;
  };

  toggle.addEventListener('click', () => {
    setPaused(toggle.getAttribute('aria-pressed') !== 'true');
  });
  reducedMotion.addEventListener('change', syncPreference);
  syncPreference();
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSignupForms();
  initMerchFilters();
  initHeroMotion();
});
