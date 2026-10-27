import { useState } from 'react';
import { sizedImage } from '../lib/money';

interface Props {
  src: string | null | undefined;
  alt: string;
  width: number;
  className?: string;
  eager?: boolean;
}

/** Lazy image with a loading shimmer and a neutral placeholder when the image cannot be loaded. */
export function Img({ src, alt, width, className = '', eager }: Props) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error');
  if (state === 'error') {
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={`${alt} (image unavailable)`}>
        <span>Image unavailable</span>
      </div>
    );
  }
  return (
    <img
      className={`img ${state} ${className}`}
      src={sizedImage(src, width)}
      srcSet={`${sizedImage(src, width)} 1x, ${sizedImage(src, width * 2)} 2x`}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setState('loaded')}
      onError={() => setState('error')}
    />
  );
}
