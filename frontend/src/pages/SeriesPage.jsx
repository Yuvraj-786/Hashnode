import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import FeatureNotice from '../components/FeatureNotice';
import formatDate from '../utils/formatDate';

const humanize = (slug = '') => slug.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function SeriesPage() {
  const { slug } = useParams();

  // TODO(series): replace this with state filled by `seriesApi.getSeries(slug)` once the backend
  // has a series endpoint. Expected shape: { name, description, posts: [{ _id, slug, title, createdAt }] }
  const series = null;

  return (
    <div className="container container--narrow page">
      <header className="page-header">
        <h1 className="page-header__title">{series?.name || humanize(slug)}</h1>
        {series?.description && <p className="muted">{series.description}</p>}
      </header>

      {series?.posts?.length > 0 ? (
        // A series is an ordered sequence, so a numbered list is appropriate here.
        <ol className="series-list">
          {series.posts.map((post) => (
            <li key={post._id} className="series-list__item">
              <Link to={`/post/${post.slug}`}>{post.title}</Link>
              <span className="muted">{formatDate(post.createdAt)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <>
          <FeatureNotice>Series aren't supported by the backend yet. This page is ready to show grouped posts once they are.</FeatureNotice>
          <EmptyState
            title="No posts in this series yet"
            description="When series arrive, related posts will be listed here in reading order."
            action={<Link to="/" className="btn btn--primary">Browse posts</Link>}
          />
        </>
      )}
    </div>
  );
}
