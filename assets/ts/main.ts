const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function isVisible(element: HTMLElement): boolean {
  if (element.closest('[hidden], [inert], [aria-hidden="true"]')) {
    return false;
  }

  return element.getClientRects().length > 0;
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => isVisible(element),
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
    menu.hidden = true;
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('has-open-menu');
    lastFocused?.focus();
  };

  const openMenu = (): void => {
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : toggle;
    menu.hidden = false;
    menu.classList.add('is-open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('has-open-menu');
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
    const input = form.querySelector<HTMLInputElement>('[data-signup-email]');
    const message = form.querySelector<HTMLElement>('[data-signup-message]');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!input || !message) {
        return;
      }

      const value = input.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      if (!value) {
        message.textContent = 'Email is required when the Social Club opens.';
        form.dataset.state = 'error';
        input.focus();
        return;
      }

      if (!valid) {
        message.textContent = 'Use a valid email format for the future signup.';
        form.dataset.state = 'error';
        input.focus();
        return;
      }

      message.textContent = 'Signup is not connected yet. The launch styling is ready.';
      form.dataset.state = 'success';
    });
  });
}

function initInteractiveCards(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const cards = Array.from(document.querySelectorAll<HTMLElement>('.interactive-card'));
  const cardRects = new Map<HTMLElement, DOMRect>();
  const resetRects = (): void => cardRects.clear();

  if (!cards.length) {
    return;
  }

  window.addEventListener('resize', resetRects);
  window.addEventListener('scroll', resetRects, { capture: true, passive: true });

  cards.forEach((card) => {
    card.dataset.interaction = 'ready';

    card.addEventListener('pointerenter', () => {
      cardRects.set(card, card.getBoundingClientRect());
    });

    card.addEventListener('pointermove', (event) => {
      const rect = cardRects.get(card) ?? card.getBoundingClientRect();
      cardRects.set(card, rect);

      if (!rect.width || !rect.height) {
        return;
      }

      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--pointer-x', `${x.toFixed(2)}%`);
      card.style.setProperty('--pointer-y', `${y.toFixed(2)}%`);
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      cardRects.delete(card);
      card.style.removeProperty('--pointer-x');
      card.style.removeProperty('--pointer-y');
    });

    card.addEventListener('focusin', () => {
      card.classList.add('is-keyboard-active');
    });

    card.addEventListener('focusout', () => {
      card.classList.remove('is-keyboard-active');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSignupForms();
  initInteractiveCards();
});
