import { Link } from 'react-router-dom';
import PostList from '../components/PostList';
import EmptyState from '../components/EmptyState';
import FeatureNotice from '../components/FeatureNotice';

export default function Bookmarks() {
  // TODO(bookmarks): replace with state loaded from `bookmarkApi.getBookmarks()` once the
  // backend supports bookmarks. Expected shape: an array of posts, like GET /api/posts.
  const bookmarks = [];

  return (
    <div className="container container--narrow page">
      <header className="page-header">
        <h1 className="page-header__title">Bookmarks</h1>
        <p className="muted">Posts you've saved to read later.</p>
      </header>

      {bookmarks.length > 0 ? (
        <PostList posts={bookmarks} />
      ) : (
        <>
          <FeatureNotice>Bookmarks aren't supported by the backend yet. Saved posts will appear here once they are.</FeatureNotice>
          <EmptyState
            title="No saved posts"
            description="Find something worth reading and come back later."
            action={<Link to="/" className="btn btn--primary">Browse posts</Link>}
          />
        </>
      )}
    </div>
  );
}
