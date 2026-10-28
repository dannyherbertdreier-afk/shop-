import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CATEGORIES, findCollection, products } from '../lib/catalog';
import { ProductListing } from '../components/ProductToolbar';
import { NotFound } from './NotFound';

export function Collection() {
  const { handle = 'all' } = useParams();
  const collection = findCollection(handle);
  useEffect(() => {
    if (collection) document.title = `${collection.title} – Knuddelwuff`;
  }, [collection]);
  if (!collection) return <NotFound />;
  const items = products.filter(collection.filter);
  return (
    <div className="page">
      <section className="collection-hero container">
        <nav className="breadcrumbs" aria-label="Navigationspfad">
          <Link to="/">Startseite</Link> / <span>{collection.title}</span>
        </nav>
        <h1>{collection.title}</h1>
        <p>{collection.intro}</p>
        <nav className="category-pills" aria-label="Kategorien">
          <Link to="/collections/all" className={handle === 'all' ? 'on' : ''}>Alle</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.handle} to={`/collections/${c.handle}`} className={handle === c.handle ? 'on' : ''}>{c.title}</Link>
          ))}
        </nav>
      </section>
      <div className="container">
        <ProductListing items={items} showCategoryFilter={handle === 'all'} />
      </div>
    </div>
  );
}
