import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPostBySlug } from '../api/postApi';
import Avatar from '../components/Avatar';
import ImageWithFallback from '../components/ImageWithFallback';
import TagPill from '../components/TagPill';
import MarkdownPreview from '../components/MarkdownPreview';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import formatDate from '../utils/formatDate';
import getErrorMessage from '../utils/getErrorMessage';

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    setNotFound(false);

    getPostBySlug(slug)
      .then((data) => !cancelled && setPost(data.post))
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

  if (loading) return <LoadingState label="Loading post…" />;
  if (error) return <div className="container container--narrow page"><ErrorMessage message={error} /></div>;
  if (notFound || !post) {
    return (
      <div className="container container--narrow page">
        <EmptyState
          title="Post not found"
          description="It may have been removed or is not published."
          action={<Link to="/" className="btn btn--primary">Back to feed</Link>}
        />
      </div>
    );
  }

  const author = post.author && typeof post.author === 'object' ? post.author : null;
  const wasUpdated = post.updatedAt && formatDate(post.updatedAt) !== formatDate(post.createdAt);

  return (
    <article className="container container--narrow page article">
      {post.tags?.length > 0 && (
        <div className="tag-list">
          {post.tags.map((tag, index) => (
            <TagPill key={tag._id || tag.slug || `${tag}-${index}`} tag={tag} />
          ))}
        </div>
      )}

      <h1 className="article__title">{post.title}</h1>

      <div className="article__meta">
        {author && (
          <Link to={`/profile/${author._id}`} className="article__author">
            <Avatar name={author.name} src={author.avatarUrl} size={40} />
            <strong>{author.name}</strong>
          </Link>
        )}
        <div className="muted article__dates">
          <time dateTime={post.createdAt}>Published {formatDate(post.createdAt)}</time>
          {wasUpdated && <time dateTime={post.updatedAt}>Updated {formatDate(post.updatedAt)}</time>}
        </div>
      </div>

      {post.coverImage && (
        <ImageWithFallback src={post.coverImage} className="article__cover" alt="Post cover" />
      )}

      <MarkdownPreview content={post.content} />
    </article>
  );
}
