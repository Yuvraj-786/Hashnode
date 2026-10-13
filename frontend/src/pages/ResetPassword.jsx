import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import FeatureNotice from '../components/FeatureNotice';

export default function ResetPassword() {
  const { token } = useParams();
  const [values, setValues] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = {};
    if (!values.password) found.password = 'Password is required.';
    else if (values.password.length < 8) found.password = 'Password must be at least 8 characters.';
    if (values.confirm !== values.password) found.confirm = 'Passwords do not match.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // TODO(password-reset): call authApi.resetPassword(token, values.password) once the
    // backend adds a reset endpoint. `token` comes from the URL. Nothing is sent today.
    void token;
    setSubmitted(true);
  };

  return (
    <div className="container page page--center">
      <AuthCard
        title="Choose a new password"
        subtitle="Use at least 8 characters."
        footer={<Link to="/login">Back to sign in</Link>}
      >
        <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
          {submitted && (
            <FeatureNotice>
              The password reset API isn't connected yet, so your password was not changed.
            </FeatureNotice>
          )}

          <div className="field">
            <label className="label" htmlFor="password">New password</label>
            <input id="password" name="password" type="password" className="input" value={values.password} onChange={handleChange} autoComplete="new-password" />
            {errors.password && <span className="field__error">{errors.password}</span>}
          </div>

          <div className="field">
            <label className="label" htmlFor="confirm">Confirm password</label>
            <input id="confirm" name="confirm" type="password" className="input" value={values.confirm} onChange={handleChange} autoComplete="new-password" />
            {errors.confirm && <span className="field__error">{errors.confirm}</span>}
          </div>

          <button type="submit" className="btn btn--primary btn--block">Update password</button>
        </form>
      </AuthCard>
    </div>
  );
}
