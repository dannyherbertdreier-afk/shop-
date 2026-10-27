import { useState } from 'react';
import { sizedImage } from '../lib/money';
import { IconPaw } from './Icons';

interface Props {
  src: string | null | undefined;
  alt: string;
  width: number;
  className?: string;
  eager?: boolean;
}

/** Lazy image with a fade-in and a branded placeholder when no image exists or it fails to load. */
export function Img({ src, alt, width, className = '', eager }: Props) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error');
  if (state === 'error') {
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={alt ? `${alt} – Produktbild folgt` : 'Produktbild folgt'}>
        <IconPaw size={28} />
        <span>Produktbild folgt</span>
      </div>
    );
  }
  return (
    <img
      className={`img ${state} ${className}`}
      src={sizedImage(src, width)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setState('loaded')}
      onError={() => setState('error')}
    />
  );
}
