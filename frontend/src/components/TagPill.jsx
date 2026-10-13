import { Link } from 'react-router-dom';
import { getTagName, slugify } from '../utils/validators';

export default function TagPill({ tag }) {
  const name = getTagName(tag);
  if (!name) return null;
  const slug = typeof tag === 'string' ? slugify(tag) : tag.slug || slugify(name);

  return (
    <Link to={`/tag/${slug}`} className="tag-pill">
      {name}
    </Link>
  );
}
