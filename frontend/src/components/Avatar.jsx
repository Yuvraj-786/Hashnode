import { useEffect, useState } from 'react';

/** Shows the user's avatar image or a letter fallback. */
export default function Avatar({ name = '', src, size = 32 }) {
  const [imageFailed, setImageFailed] = useState(false);
  const style = { width: size, height: size, fontSize: size * 0.42 };

  useEffect(() => setImageFailed(false), [src]);

  if (src && !imageFailed) {
    return <img className="avatar" src={src} alt={name} style={style} onError={() => setImageFailed(true)} />;
  }

  return (
    <span className="avatar avatar--fallback" style={style} aria-hidden="true">
      {name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );
}
