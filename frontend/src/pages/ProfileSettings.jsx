import { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile } from '../api/userApi';
import useAuth from '../hooks/useAuth';
import Avatar from '../components/Avatar';
import FeatureNotice from '../components/FeatureNotice';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import getErrorMessage from '../utils/getErrorMessage';
import { isHttpUrl } from '../utils/validateUrl';

const BIO_MAX = 400;

export default function ProfileSettings() {
  const { setUser } = useAuth();
  const [values, setValues] = useState({ name: '', bio: '', avatarUrl: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getMyProfile()
      .then(({ user }) => {
        if (cancelled) return;
        setValues({ name: user.name || '', bio: user.bio || '', avatarUrl: user.avatarUrl || '' });
      })
      .catch((err) => !cancelled && setLoadError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSaved(false);
  };

  const validate = () => {
    const found = {};
    if (!values.name.trim()) found.name = 'Name is required.';
    if (values.bio.length > BIO_MAX) found.bio = `Bio must be ${BIO_MAX} characters or fewer.`;
    if (values.avatarUrl.trim() && !isHttpUrl(values.avatarUrl.trim())) {
      found.avatarUrl = 'Avatar must be a valid http or https URL.';
    }
    return found;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    setSaveError('');
    setSaved(false);
    try {
      const data = await updateMyProfile({
        name: values.name.trim(),
        bio: values.bio.trim(),
        avatarUrl: values.avatarUrl.trim(),
      });
      setUser(data.user); // keep the navbar in sync
      setSaved(true);
    } catch (err) {
      setSaveError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState label="Loading settings…" />;

  return (
    <div className="container container--narrow page">
      <header className="page-header">
        <h1 className="page-header__title">Profile settings</h1>
        <p className="muted">This is what readers see on your public profile.</p>
      </header>

      {loadError ? (
        <ErrorMessage message={loadError} />
      ) : (
        <form className="card settings-form" onSubmit={handleSubmit} noValidate>
          <ErrorMessage message={saveError} />
          {saved && <div className="alert alert--success" role="status">Profile saved.</div>}

          <div className="settings-form__avatar">
            <Avatar name={values.name} src={isHttpUrl(values.avatarUrl.trim()) ? values.avatarUrl.trim() : ''} size={64} />
          </div>

          <div className="field">
            <label className="label" htmlFor="name">Name</label>
            <input id="name" name="name" className="input" value={values.name} onChange={handleChange} />
            {errors.name && <span className="field__error">{errors.name}</span>}
          </div>

          <div className="field">
            <label className="label" htmlFor="avatarUrl">Avatar URL</label>
            <input
              id="avatarUrl"
              name="avatarUrl"
              className="input"
              value={values.avatarUrl}
              onChange={handleChange}
              placeholder="https://example.com/me.jpg"
            />
            {errors.avatarUrl && <span className="field__error">{errors.avatarUrl}</span>}
          </div>

          <div className="field">
            <label className="label" htmlFor="bio">Bio</label>
            <textarea id="bio" name="bio" className="input input--area" rows={4} value={values.bio} onChange={handleChange} />
            <div className="field__row">
              {errors.bio ? <span className="field__error">{errors.bio}</span> : <span />}
              <span className={`field__hint ${values.bio.length > BIO_MAX ? 'is-over' : ''}`}>
                {values.bio.length}/{BIO_MAX}
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      )}

      {/* TODO(account-deletion): connect once the backend exposes a delete-account endpoint. */}
      <section className="card danger-zone" aria-labelledby="danger-title">
        <div className="danger-zone__header">
          <h2 id="danger-title" className="danger-zone__title">Delete account</h2>
          <span className="badge badge--draft">Unavailable</span>
        </div>
        <p className="muted">Permanently remove your account and all of your posts.</p>
        <FeatureNotice>Account deletion isn't supported by the backend yet, so this action is disabled.</FeatureNotice>
        <button type="button" className="btn btn--danger" disabled>Delete my account</button>
      </section>
    </div>
  );
}
