import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container container--narrow page">
      <div className="state state--empty">
        <p className="state__code">404</p>
        <h1 className="state__title">We can't find that page</h1>
        <p className="state__text">The link may be broken, or the page may have moved.</p>
        <div className="state__actions">
          <Link to="/" className="btn btn--primary">Go home</Link>
          <Link to="/search" className="btn btn--ghost">Search posts</Link>
        </div>
      </div>
    </div>
  );
}
