import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="page container empty-state">
      <h1 className="page-title">Page not found</h1>
      <p>The page you were looking for does not exist.</p>
      <Link to="/collections/all" className="btn">Continue shopping</Link>
    </div>
  );
}
