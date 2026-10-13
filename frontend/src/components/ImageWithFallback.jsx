import { useEffect, useState } from 'react';

export default function ImageWithFallback({ src, alt = '', className, fallbackLabel = 'Image unavailable', ...props }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [src]);

  if (!src || imageFailed) {
    return (
      <div className={`${className} image-fallback`} role="img" aria-label={alt || fallbackLabel}>
        {fallbackLabel}
      </div>
    );
  }

  return (
    <img
      {...props}
      className={className}
      src={src}
      alt={alt}
      onError={() => setImageFailed(true)}
    />
  );
}
