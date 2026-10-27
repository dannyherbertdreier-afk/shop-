import { useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const BACKGROUND = ['.topbar', 'header.header', '#main', 'footer.footer', '.help-bubble'];

/**
 * Modal behaviour for drawers/overlays: moves focus in, traps Tab, closes on Escape,
 * makes the page behind inert and restores focus to the trigger when closed.
 */
export function useDialog<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const panel = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const background = BACKGROUND.flatMap((s) => Array.from(document.querySelectorAll<HTMLElement>(s))).filter((el) => !el.contains(panel));
    background.forEach((el) => el.setAttribute('inert', ''));
    document.body.classList.add('no-scroll');

    const focusFirst = () => {
      const preferred = panel?.querySelector<HTMLElement>('[data-autofocus]') ?? panel?.querySelector<HTMLElement>(FOCUSABLE);
      preferred?.focus();
    };
    const t = window.setTimeout(focusFirst, 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      background.forEach((el) => el.removeAttribute('inert'));
      document.body.classList.remove('no-scroll');
      if (previous && document.contains(previous)) previous.focus();
    };
  }, [open]);

  return ref;
}
