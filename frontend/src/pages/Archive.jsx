import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api/postApi';
import TagPill from '../components/TagPill';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import formatDate, { formatMonthYear } from '../utils/formatDate';
import getErrorMessage from '../utils/getErrorMessage';
import { getTagName } from '../utils/validators';

const ALL = 'all';

const getYear = (post) => {
  const date = new Date(post.createdAt);
  return Number.isNaN(date.getTime()) ? null : String(date.getFullYear());
};

/** Groups already-sorted posts by "Month Year", keeping the order. */
function groupByMonth(posts) {
  const groups = [];
  posts.forEach((post) => {
    const label = formatMonthYear(post.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.posts.push(post);
    else groups.push({ label, posts: [post] });
  });
  return groups;
}

export default function Archive() {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({ year: ALL, tag: ALL, author: ALL });
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

  // Published posts only, newest first.
  const published = useMemo(
    () =>
      posts
        .filter((post) => !post.status || post.status === 'published')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts]
  );

  // Filter options come from the posts we actually have.
  const options = useMemo(() => {
    const years = new Set();
    const tags = new Set();
    const authors = new Map();
    published.forEach((post) => {
      const year = getYear(post);
      if (year) years.add(year);
      (post.tags || []).forEach((tag) => tags.add(getTagName(tag)));
      if (post.author && typeof post.author === 'object') authors.set(post.author._id, post.author.name);
    });
    return {
      years: [...years].sort((a, b) => b - a),
      tags: [...tags].filter(Boolean).sort(),
      authors: [...authors.entries()].sort((a, b) => a[1].localeCompare(b[1])),
    };
  }, [published]);

  const filtered = useMemo(
    () =>
      published.filter((post) => {
        if (filters.year !== ALL && getYear(post) !== filters.year) return false;
        if (filters.tag !== ALL && !(post.tags || []).some((tag) => getTagName(tag) === filters.tag)) return false;
        if (filters.author !== ALL && post.author?._id !== filters.author) return false;
        return true;
      }),
    [published, filters]
  );

  const groups = useMemo(() => groupByMonth(filtered), [filtered]);
  const hasActiveFilter = Object.values(filters).some((value) => value !== ALL);

  const updateFilter = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));

  return (
    <div className="container container--narrow page">
      <header className="page-header">
        <h1 className="page-header__title">Archive</h1>
        <p className="muted">Every published post, grouped by month.</p>
      </header>

      {loading && <LoadingState label="Loading archive…" />}
      {!loading && error && <ErrorMessage message={error} onRetry={() => setReloadKey((key) => key + 1)} />}

      {!loading && !error && published.length === 0 && (
        <EmptyState title="Nothing published yet" description="Posts will show up here once they're published." />
      )}

      {!loading && !error && published.length > 0 && (
        <>
          <div className="filters">
            <div className="field">
              <label className="label" htmlFor="filter-year">Year</label>
              <select id="filter-year" className="input" value={filters.year} onChange={updateFilter('year')}>
                <option value={ALL}>All years</option>
                {options.years.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>

            <div className="field">
              <label className="label" htmlFor="filter-tag">Tag</label>
              <select id="filter-tag" className="input" value={filters.tag} onChange={updateFilter('tag')}>
                <option value={ALL}>All tags</option>
                {options.tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
              </select>
            </div>

            {options.authors.length > 0 && (
              <div className="field">
                <label className="label" htmlFor="filter-author">Author</label>
                <select id="filter-author" className="input" value={filters.author} onChange={updateFilter('author')}>
                  <option value={ALL}>All authors</option>
                  {options.authors.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                </select>
              </div>
            )}

            {hasActiveFilter && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setFilters({ year: ALL, tag: ALL, author: ALL })}>
                Clear filters
              </button>
            )}
          </div>

          {groups.length === 0 ? (
            <EmptyState title="No posts match these filters" description="Try clearing a filter." />
          ) : (
            groups.map((group) => (
              <section key={group.label} className="archive-group">
                <h2 className="archive-group__title">{group.label}</h2>
                <ul className="archive-list">
                  {group.posts.map((post) => (
                    <li key={post._id} className="archive-item">
                      <time className="muted archive-item__date" dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                      <div className="archive-item__main">
                        <Link to={`/post/${post.slug}`} className="archive-item__title">{post.title}</Link>
                        <div className="archive-item__meta">
                          {post.author?.name && <span className="muted">by {post.author.name}</span>}
                          {post.tags?.length > 0 && (
                            <div className="tag-list">
                              {post.tags.map((tag, index) => (
                                <TagPill key={tag._id || tag.slug || `${tag}-${index}`} tag={tag} />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </>
      )}
    </div>
  );
}
