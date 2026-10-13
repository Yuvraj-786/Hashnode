import { useState } from 'react';
import { Link } from 'react-router-dom';
import MarkdownEditor from './MarkdownEditor';
import MarkdownPreview from './MarkdownPreview';
import ErrorMessage from './ErrorMessage';
import { isHttpUrl } from '../utils/validateUrl';

const TITLE_MAX = 200;
const EMPTY_VALUES = { title: '', content: '', tags: [], coverImage: '', status: 'draft' };

const parseTags = (input) => [
  ...new Set(input.split(',').map((tag) => tag.trim()).filter(Boolean)),
];

function validate({ title, content, coverImage, status }) {
  const errors = {};
  if (!title.trim()) errors.title = 'Title is required.';
  else if (title.length > TITLE_MAX) errors.title = `Title must be ${TITLE_MAX} characters or fewer.`;
  if (!content.trim()) errors.content = 'Content is required.';
  if (coverImage.trim() && !isHttpUrl(coverImage.trim())) {
    errors.coverImage = 'Cover image must be a valid http or https URL.';
  }
  if (!['draft', 'published'].includes(status)) errors.status = 'Status must be draft or published.';
  return errors;
}

/** Shared by "new post" and "edit post". Submits { title, content, tags, coverImage, status }. */
export default function PostForm({ initialValues = EMPTY_VALUES, onSubmit, submitting, submitError, submitLabel }) {
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);
  const [tagsInput, setTagsInput] = useState(initialValues.tags.join(', '));
  const [coverImage, setCoverImage] = useState(initialValues.coverImage);
  const [status, setStatus] = useState(initialValues.status);
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate({ title, content, coverImage, status });
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      title: title.trim(),
      content,
      tags: parseTags(tagsInput),
      coverImage: coverImage.trim(),
      status,
    });
  };

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      <ErrorMessage message={submitError} />

      <div className="field">
        <input
          className="input input--title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Article title"
          aria-label="Title"
          aria-invalid={Boolean(errors.title)}
        />
        <div className="field__row">
          {errors.title ? <span className="field__error">{errors.title}</span> : <span />}
          <span className={`field__hint ${title.length > TITLE_MAX ? 'is-over' : ''}`}>
            {title.length}/{TITLE_MAX}
          </span>
        </div>
      </div>

      <div className="post-form__meta">
        <div className="field">
          <label className="label" htmlFor="coverImage">Cover image URL</label>
          <input
            id="coverImage"
            className="input"
            value={coverImage}
            onChange={(event) => setCoverImage(event.target.value)}
            placeholder="https://example.com/cover.jpg"
          />
          {errors.coverImage && <span className="field__error">{errors.coverImage}</span>}
        </div>

        <div className="field">
          <label className="label" htmlFor="tags">Tags</label>
          <input
            id="tags"
            className="input"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="react, nodejs, mongodb"
          />
          <span className="field__hint">Separate tags with commas.</span>
        </div>

        <div className="field">
          <label className="label" htmlFor="status">Status</label>
          <select id="status" className="input" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          {errors.status && <span className="field__error">{errors.status}</span>}
        </div>
      </div>

      {/* Side by side on desktop, stacked on mobile (see .editor-split in CSS). */}
      <div className="field">
        <div className="editor-split">
          <MarkdownEditor value={content} onChange={setContent} error={errors.content} />
          <div className="md-pane">
            <div className="md-pane__header">Preview</div>
            <div className="md-pane__preview">
              <MarkdownPreview content={content} />
            </div>
          </div>
        </div>
        {errors.content && <span className="field__error">{errors.content}</span>}
      </div>

      <div className="post-form__actions">
        <Link to="/dashboard" className="btn btn--ghost">Cancel</Link>
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
