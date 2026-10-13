/** Small inline notice used on pages whose backend support doesn't exist yet. */
export default function FeatureNotice({ title = 'Not connected yet', children }) {
  return (
    <div className="notice" role="note">
      <strong className="notice__title">{title}</strong>
      <p>{children}</p>
    </div>
  );
}
