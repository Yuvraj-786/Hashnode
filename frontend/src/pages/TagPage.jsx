import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTagPosts } from '../api/tagApi';
import PostList from '../components/PostList';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import getErrorMessage from '../utils/getErrorMessage';

export default function TagPage() {
  const { slug } = useParams();
  const [tag, setTag] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    setNotFound(false);

    getTagPosts(slug)
      .then((data) => {
        if (cancelled) return;
        setTag(data.tag);
        setPosts(data.posts || []);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.response?.status === 404) setNotFound(true);
        else setError(getErrorMessage(err));
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <LoadingState label="Loading tag…" />;

  return (
    <div className="container container--narrow page">
      {error && <ErrorMessage message={error} />}

      {notFound && (
        <EmptyState
          title="Tag not found"
          description="That tag doesn't exist."
          action={<Link to="/" className="btn btn--primary">Back to feed</Link>}
        />
      )}

      {tag && (
        <>
          <header className="page-header">
            <h1 className="page-header__title">#{tag.name}</h1>
            {tag.description && <p className="muted">{tag.description}</p>}
            <p className="muted">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</p>
          </header>

          {posts.length === 0 ? (
            <EmptyState title="No posts with this tag yet" description="Check back soon." />
          ) : (
            <PostList posts={posts} />
          )}
        </>
      )}
    </div>
  );
}
