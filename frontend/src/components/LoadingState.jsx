/**
 * variant="spinner" – centered spinner (default)
 * variant="posts"   – skeleton placeholders shaped like post cards
 */
export default function LoadingState({ label = 'Loading…', variant = 'spinner', count = 3 }) {
  if (variant === 'posts') {
    return (
      <div className="post-list" role="status" aria-label={label}>
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="post-card" aria-hidden="true">
            <div className="post-card__body">
              <div className="skeleton skeleton--line skeleton--short" />
              <div className="skeleton skeleton--title" />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line skeleton--mid" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="state" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p className="state__text">{label}</p>
    </div>
  );
}
