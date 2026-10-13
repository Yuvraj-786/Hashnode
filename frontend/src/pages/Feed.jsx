import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts } from '../api/postApi';
import { getTags } from '../api/tagApi';
import PostList from '../components/PostList';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import getErrorMessage from '../utils/getErrorMessage';

const MAX_TAGS = 15;

export default function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    getPosts()
      .then((data) => !cancelled && setPosts(data.posts || []))
      .catch((err) => !cancelled && setError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Popular tags are optional, so failures are ignored.
  useEffect(() => {
    getTags()
      .then((data) => setTags((data.tags || []).slice(0, MAX_TAGS)))
      .catch(() => {});
  }, []);

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  const handleSearch = (event) => {
    event.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <div className="container page">
      <header className="feed-hero">
        <h1 className="feed-hero__title">Latest from the community</h1>
        <p className="muted feed-hero__sub">Fresh posts on code, tools, and lessons learned.</p>
        <form role="search" onSubmit={handleSearch}>
          <input
            type="search"
            className="input input--search"
            placeholder="Search posts"
            aria-label="Search posts"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
      </header>

      <div className="feed-layout">
        <section aria-live="polite">
          {loading && <LoadingState variant="posts" label="Loading posts…" />}
          {!loading && error && <ErrorMessage message={error} onRetry={retry} />}
          {!loading && !error && posts.length === 0 && (
            <EmptyState
              title="No posts yet"
              description="Be the first to publish something."
              action={<Link to="/editor/new" className="btn btn--primary">Write a post</Link>}
            />
          )}
          {!loading && !error && posts.length > 0 && <PostList posts={posts} />}
        </section>

        {tags.length > 0 && (
          <aside className="sidebar">
            <h2 className="sidebar__title">Popular tags</h2>
            <div className="tag-list">
              {tags.map((tag) => (
                <Link key={tag._id} to={`/tag/${tag.slug}`} className="tag-pill">
                  {tag.name}
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
