import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export function NotFound() {
  usePageTitle('Seite nicht gefunden');
  return (
    <div className="page container empty-state">
      <h1 className="page-title">Seite nicht gefunden</h1>
      <p>Diese Seite gibt es leider nicht (mehr).</p>
      <Link to="/collections/all" className="btn">Zur Winterkollektion</Link>
    </div>
  );
}
