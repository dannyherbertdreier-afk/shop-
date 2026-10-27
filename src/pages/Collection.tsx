import { Link, useParams } from 'react-router-dom';
import { findCollection, products } from '../lib/catalog';
import { ProductListing } from '../components/ProductToolbar';
import { NotFound } from './NotFound';

export function Collection() {
  const { handle = 'all' } = useParams();
  const collection = findCollection(handle);
  if (!collection) return <NotFound />;
  const items = products.filter(collection.filter);
  return (
    <div className="page">
      <section className="collection-hero">
        <h1>{collection.title}</h1>
        <p>{collection.subtitle}</p>
        <div className="offer-box">
          <span className="offer-tag">Exclusive offer</span>
          <h2>Buy 1, get 1 free</h2>
          <p>Add your favourites to your cart. Mix and match any styles. Your free watches are discounted automatically.</p>
          <Link to="/collections/best-sellers" className="offer-cta">Buy more, get more free.</Link>
        </div>
      </section>
      <div className="container">
        <ProductListing items={items} defaultSort={collection.defaultSort} />
      </div>
    </div>
  );
}
