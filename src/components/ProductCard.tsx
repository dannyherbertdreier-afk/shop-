import { Link } from 'react-router-dom';
import type { Product } from '../lib/types';
import { categoryTitle, hasPriceRange, isAvailable, minPriceVariant } from '../lib/catalog';
import { Img } from './Img';
import { Price } from './Price';

function variantSummary(p: Product) {
  return p.options
    .filter((o) => o.values.length > 1)
    .map((o) => `${o.values.length} ${o.name === 'Farbe' ? 'Farben' : o.name === 'Größe' ? 'Größen' : o.name}`)
    .join(' · ');
}

export function ProductCard({ product }: { product: Product }) {
  const shown = minPriceVariant(product);
  const summary = variantSummary(product);
  return (
    <article className="card">
      <Link to={`/products/${product.handle}`} className="card-link">
        <div className="card-media">
          <Img src={product.images[0]} alt={product.images[0] ? `Symbolbild zu ${product.title}` : product.title} width={600} />
          {product.images[1] && <Img src={product.images[1]} alt="" width={600} className="card-hover" />}
          {!isAvailable(product) && <span className="badge badge-dark">Nicht verfügbar</span>}
        </div>
        <div className="card-info">
          <span className="card-category">{categoryTitle(product.category)}</span>
          <h3 className="card-title">{product.title}</h3>
          {summary && <span className="card-variants">{summary}</span>}
          <Price price={shown.price} compareAt={shown.compareAtPrice} from={hasPriceRange(product)} />
          {product.isExample && <span className="card-price-note">Beispielprodukt · Beispielpreis</span>}
        </div>
      </Link>
    </article>
  );
}
