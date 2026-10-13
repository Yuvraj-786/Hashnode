/** Layout for About / Privacy / Terms and similar text pages. */
export default function StaticPage({ title, subtitle, children }) {
  return (
    <div className="container container--narrow page">
      <header className="page-header">
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </header>
      <div className="prose prose--ui">{children}</div>
    </div>
  );
}
