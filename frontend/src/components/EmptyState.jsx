export default function EmptyState({ title, description, action }) {
  return (
    <div className="state state--empty">
      <h3 className="state__title">{title}</h3>
      {description && <p className="state__text">{description}</p>}
      {action}
    </div>
  );
}
