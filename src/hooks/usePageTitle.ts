import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} – Knuddelwuff` : 'Knuddelwuff – Winterbegleiter für Hunde';
  }, [title]);
}
