import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserById } from '../api/userApi';
import Avatar from '../components/Avatar';
import PostList from '../components/PostList';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import getErrorMessage from '../utils/getErrorMessage';

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    setNotFound(false);

    getUserById(id)
      .then((data) => {
        if (cancelled) return;
        setUser(data.user);
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
  }, [id]);

  if (loading) return <LoadingState label="Loading profile…" />;

  return (
    <div className="container container--narrow page">
      {error && <ErrorMessage message={error} />}

      {notFound && (
        <EmptyState
          title="User not found"
          action={<Link to="/" className="btn btn--primary">Back to feed</Link>}
        />
      )}

      {user && (
        <>
          <header className="profile-header">
            <Avatar name={user.name} src={user.avatarUrl} size={88} />
            <div>
              <h1 className="page-header__title">{user.name}</h1>
              {user.bio && <p className="profile-header__bio">{user.bio}</p>}
            </div>
          </header>

          <h2 className="section-title">Published posts</h2>
          {posts.length === 0 ? (
            <EmptyState title="No published posts yet" />
          ) : (
            <PostList posts={posts} showAuthor={false} />
          )}
        </>
      )}
    </div>
  );
}
