import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createPost, getMyPosts, updatePost } from '../api/postApi';
import PostForm from '../components/PostForm';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import getErrorMessage from '../utils/getErrorMessage';
import { getTagName } from '../utils/validators';

export default function PostEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(undefined);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // There is no private GET /posts/:id route, so we find the post in /posts/mine.
  useEffect(() => {
    if (!isEdit) return undefined;

    let cancelled = false;
    setLoading(true);
    setLoadError('');
    setNotFound(false);

    getMyPosts()
      .then((data) => {
        if (cancelled) return;
        const post = (data.posts || []).find((item) => item._id === id);
        if (!post) {
          setNotFound(true);
          return;
        }
        setInitialValues({
          title: post.title || '',
          content: post.content || '',
          tags: (post.tags || []).map(getTagName).filter(Boolean),
          coverImage: post.coverImage || '',
          status: post.status || 'draft',
        });
      })
      .catch((err) => !cancelled && setLoadError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const data = isEdit ? await updatePost(id, payload) : await createPost(payload);
      const saved = data.post;
      const status = saved?.status || payload.status;
      navigate(status === 'published' && saved?.slug ? `/post/${saved.slug}` : '/dashboard');
    } catch (err) {
      setSubmitError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState label="Loading editor…" />;

  return (
    <div className="container container--editor page">
      <header className="page-header">
        <h1 className="page-header__title">{isEdit ? 'Edit post' : 'New post'}</h1>
      </header>

      {loadError && <ErrorMessage message={loadError} />}

      {notFound && (
        <EmptyState
          title="Post not found"
          description="You can only edit your own posts."
          action={<Link to="/dashboard" className="btn btn--primary">Back to dashboard</Link>}
        />
      )}

      {!loadError && !notFound && (
        <PostForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitError={submitError}
          submitLabel={isEdit ? 'Save changes' : 'Save post'}
        />
      )}
    </div>
  );
}
