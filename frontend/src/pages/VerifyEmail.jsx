import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import FeatureNotice from '../components/FeatureNotice';

const STATES = {
  pending: { title: 'Verifying your email…', text: 'Hang tight while we check your link.' },
  success: { title: 'Email verified', text: 'Your email address has been confirmed.' },
  error: { title: 'Verification failed', text: 'This link is invalid or has expired.' },
};

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('pending');
  const current = STATES[status];

  // TODO(email-verification): on mount, call authApi.verifyEmail(token) and set the status
  // to "success" or "error" from the result. `token` comes from the URL. No request is made today.
  void token;

  return (
    <div className="container page page--center">
      <AuthCard title={current.title} subtitle={current.text} footer={<Link to="/">Back to home</Link>}>
        <div className="verify-state" aria-live="polite">
          {status === 'pending' && <span className="spinner" aria-hidden="true" />}
          {status === 'success' && <span className="verify-state__icon verify-state__icon--success" aria-hidden="true">✓</span>}
          {status === 'error' && <span className="verify-state__icon verify-state__icon--error" aria-hidden="true">!</span>}
        </div>

        <FeatureNotice>Email verification isn't connected to the backend yet. Use the buttons to preview each state.</FeatureNotice>

        <div className="segmented segmented--center" role="group" aria-label="Preview state">
          {Object.keys(STATES).map((key) => (
            <button
              key={key}
              type="button"
              className={`segmented__item ${status === key ? 'is-active' : ''}`}
              onClick={() => setStatus(key)}
            >
              {key}
            </button>
          ))}
        </div>
      </AuthCard>
    </div>
  );
}
