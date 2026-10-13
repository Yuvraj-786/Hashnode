import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import FeatureNotice from '../components/FeatureNotice';
import { isValidEmail } from '../utils/validators';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValidEmail(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');

    // TODO(password-reset): call authApi.requestPasswordReset(email.trim()) once the
    // backend adds a "forgot password" endpoint. Nothing is sent to the server today.
    setSubmitted(true);
  };

  return (
    <div className="container page page--center">
      <AuthCard
        title="Reset your password"
        subtitle="Enter your email and we'll send you a reset link."
        footer={<Link to="/login">Back to sign in</Link>}
      >
        <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
          {submitted && (
            <FeatureNotice>
              The password reset API isn't connected yet, so no email was sent. This form is ready to be wired up later.
            </FeatureNotice>
          )}

          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
            {error && <span className="field__error">{error}</span>}
          </div>

          <button type="submit" className="btn btn--primary btn--block">Send reset link</button>
        </form>
      </AuthCard>
    </div>
  );
}
