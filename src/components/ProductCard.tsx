import { Link } from 'react-router-dom';
import type { Product } from '../lib/types';
import { firstAvailableVariant, isAvailable, minPriceVariant } from '../lib/catalog';
import { useShop } from '../state/ShopContext';
import { Img } from './Img';
import { Price } from './Price';
import { IconCartPlus } from './Icons';

export function ProductCard({ product, variant = 'grid' }: { product: Product; variant?: 'grid' | 'carousel' }) {
  const { addItems } = useShop();
  const available = isAvailable(product);
  const shown = minPriceVariant(product);
  const onSale = shown.compareAtPrice != null && shown.compareAtPrice > shown.price;
  const quickAdd = () => {
    const v = firstAvailableVariant(product);
    addItems([{ handle: product.handle, variantId: v.id }]);
  };
  return (
    <article className={`card card-${variant}`}>
      <div className="card-media">
        <Link to={`/products/${product.handle}`} aria-label={product.title}>
          <Img src={product.images[0]} alt={product.title} width={420} />
          {product.images[1] && <Img src={product.images[1]} alt="" width={420} className="card-hover" />}
        </Link>
        {!available ? <span className="badge badge-soldout">Sold out</span> : onSale && <span className="badge">Sale</span>}
        {available && (
          <button className="card-quickadd" onClick={quickAdd} aria-label={`Add ${product.title} to cart`} title="Quick add">
            <IconCartPlus size={18} />
          </button>
        )}
      </div>
      <Link to={`/products/${product.handle}`} className="card-info">
        <h3 className="card-title">{product.title}</h3>
        <Price price={shown.price} compareAt={shown.compareAtPrice} />
      </Link>
    </article>
  );
}
