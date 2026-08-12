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

  const closeMenu = (): void => {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('has-open-menu');
    lastFocused?.focus();
  };

  const openMenu = (): void => {
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : toggle;
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('has-open-menu');

    requestAnimationFrame(() => {
      menu.classList.add('is-open');
      getFocusable(menu)[0]?.focus();
    });
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusable = getFocusable(menu);
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

function initSignupForms(): void {
  document.querySelectorAll<HTMLFormElement>('[data-signup-form]').forEach((form) => {
    const message = form.querySelector<HTMLElement>('[data-signup-message]');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (message) {
        message.textContent = 'The manifest opens on the next round. Watch the road for the bell.';
        form.dataset.state = 'success';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSignupForms();
});
