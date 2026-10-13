import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthForm from '../components/AuthForm';
import getErrorMessage from '../utils/getErrorMessage';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ProtectedRoute sends guests here with `state.from` – that's our "unauthorized" state.
  const notice = location.state?.from ? 'Please sign in to continue.' : '';

  const handleSubmit = async ({ email, password }) => {
    setSubmitting(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="container page page--center">
      <AuthForm mode="login" onSubmit={handleSubmit} submitting={submitting} submitError={error} notice={notice} />
    </div>
  );
}
