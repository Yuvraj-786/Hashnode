import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import TagPill from './TagPill';
import ImageWithFallback from './ImageWithFallback';
import formatDate from '../utils/formatDate';
import getExcerpt from '../utils/getExcerpt';

export default function PostCard({ post, showAuthor = true }) {
  const author = post.author && typeof post.author === 'object' ? post.author : null;

  return (
    <article className="post-card">
      <div className="post-card__body">
        {showAuthor && author && (
          <Link to={`/profile/${author._id}`} className="post-card__author">
            <Avatar name={author.name} src={author.avatarUrl} size={26} />
            <span>{author.name}</span>
          </Link>
        )}

        <h2 className="post-card__title">
          <Link to={`/post/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="post-card__excerpt">{getExcerpt(post.content)}</p>

        <div className="post-card__footer">
          <time className="muted" dateTime={post.createdAt}>
            {formatDate(post.createdAt)}
          </time>
          {post.tags?.length > 0 && (
            <div className="tag-list">
              {post.tags.map((tag, index) => (
                <TagPill key={tag._id || tag.slug || `${tag}-${index}`} tag={tag} />
              ))}
            </div>
          )}
        </div>
      </div>

      {post.coverImage && (
        <Link to={`/post/${post.slug}`} className="post-card__cover" tabIndex={-1} aria-hidden="true">
          <ImageWithFallback src={post.coverImage} alt="" className="post-card__cover-image" loading="lazy" />
        </Link>
      )}
    </article>
  );
}
