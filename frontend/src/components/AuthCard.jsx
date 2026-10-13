/** Centered card shell shared by every auth-related page. */
export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="auth-card">
      <h1 className="auth-card__title">{title}</h1>
      {subtitle && <p className="muted">{subtitle}</p>}
      <div className="auth-card__body">{children}</div>
      {footer && <p className="auth-card__switch muted">{footer}</p>}
    </div>
  );
}
