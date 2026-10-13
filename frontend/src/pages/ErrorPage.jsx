import { Link } from 'react-router-dom';

/** Generic 500-style fallback. Used by ErrorBoundary, but can be rendered anywhere. */
export default function ErrorPage({ error, onRetry }) {
  return (
    <div className="container container--narrow page">
      <div className="state state--empty" role="alert">
        <p className="state__code">500</p>
        <h1 className="state__title">Something went wrong</h1>
        <p className="state__text">An unexpected error occurred. You can try again or head back home.</p>
        {import.meta.env.DEV && error?.message && <pre className="state__details">{error.message}</pre>}
        <div className="state__actions">
          <button type="button" className="btn btn--primary" onClick={onRetry || (() => window.location.reload())}>
            Try again
          </button>
          <Link to="/" className="btn btn--ghost">Go home</Link>
        </div>
      </div>
    </div>
  );
}
