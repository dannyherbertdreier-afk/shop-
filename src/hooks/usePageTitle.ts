import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} – PAWGUARD` : 'PAWGUARD – Winterbegleiter für Hunde';
  }, [title]);
}
