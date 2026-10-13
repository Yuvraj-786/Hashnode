import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPosts } from '../api/postApi';
import PostList from '../components/PostList';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import getErrorMessage from '../utils/getErrorMessage';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();

  const [input, setInput] = useState(query);
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Keep the input in sync when the URL changes (e.g. from the navbar search).
  useEffect(() => {
    setInput(query);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setPosts([]);
      setCount(0);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError('');

    getPosts({ search: query })
      .then((data) => {
        if (cancelled) return;
        setPosts(data.posts || []);
        setCount(data.count ?? (data.posts || []).length);
      })
      .catch((err) => !cancelled && setError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [query]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const q = input.trim();
    setSearchParams(q ? { q } : {});
  };

  return (
    <div className="container container--narrow page">
      <header className="page-header">
        <h1 className="page-header__title">Search</h1>
        <form className="search-form" role="search" onSubmit={handleSubmit}>
          <input
            type="search"
            className="input"
            placeholder="Search by title, content, or tag"
            aria-label="Search posts"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            autoFocus
          />
          <button type="submit" className="btn btn--primary">Search</button>
        </form>
      </header>

      {!query && (
        <EmptyState title="What are you looking for?" description="Type a keyword above to search published posts." />
      )}

      {query && loading && <LoadingState variant="posts" label="Searching…" count={2} />}
      {query && !loading && error && <ErrorMessage message={error} />}

      {query && !loading && !error && (
        <>
          <p className="muted search-count" aria-live="polite">
            {count} {count === 1 ? 'result' : 'results'} for “{query}”
          </p>
          {posts.length === 0 ? (
            <EmptyState title="No posts found" description="Try a different keyword or check your spelling." />
          ) : (
            <PostList posts={posts} />
          )}
        </>
      )}
    </div>
  );
}
