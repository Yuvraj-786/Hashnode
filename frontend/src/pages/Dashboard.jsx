import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deletePost, getMyPosts } from '../api/postApi';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import formatDate from '../utils/formatDate';
import getErrorMessage from '../utils/getErrorMessage';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
];

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyPosts();
      setPosts(data.posts || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const cancelDelete = useCallback(() => setPostToDelete(null), []);

  const confirmDelete = async () => {
    setDeleting(true);
    setActionError('');
    try {
      await deletePost(postToDelete._id);
      setPosts((current) => current.filter((post) => post._id !== postToDelete._id));
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setDeleting(false);
      setPostToDelete(null);
    }
  };

  const visiblePosts = filter === 'all' ? posts : posts.filter((post) => post.status === filter);

  return (
    <div className="container page">
      <header className="page-header page-header--row">
        <div>
          <h1 className="page-header__title">Your posts</h1>
          <p className="muted">{posts.length} {posts.length === 1 ? 'post' : 'posts'} in total</p>
        </div>
        <Link to="/editor/new" className="btn btn--primary">New post</Link>
      </header>

      <div className="segmented" role="tablist" aria-label="Filter posts">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filter === value}
            className={`segmented__item ${filter === value ? 'is-active' : ''}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <ErrorMessage message={actionError} />
      {loading && <LoadingState label="Loading your posts…" />}
      {!loading && error && <ErrorMessage message={error} onRetry={loadPosts} />}

      {!loading && !error && visiblePosts.length === 0 && (
        <EmptyState
          title={filter === 'all' ? "You haven't written anything yet" : 'Nothing here yet'}
          description="Start a draft and publish it when you're ready."
          action={<Link to="/editor/new" className="btn btn--primary">Write a post</Link>}
        />
      )}

      {!loading && !error && visiblePosts.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Updated</th>
                <th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visiblePosts.map((post) => (
                <tr key={post._id}>
                  <td className="table__title">
                    {post.status === 'published' ? <Link to={`/post/${post.slug}`}>{post.title}</Link> : post.title}
                  </td>
                  <td><span className={`badge badge--${post.status}`}>{post.status}</span></td>
                  <td className="muted">{formatDate(post.updatedAt || post.createdAt)}</td>
                  <td>
                    <div className="table__actions">
                      <Link to={`/editor/${post._id}`} className="btn btn--ghost btn--sm">Edit</Link>
                      <button type="button" className="btn btn--danger btn--sm" onClick={() => setPostToDelete(post)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(postToDelete)}
        title="Delete this post?"
        message={postToDelete ? `“${postToDelete.title}” will be permanently deleted. This can't be undone.` : ''}
        confirmLabel="Delete post"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
