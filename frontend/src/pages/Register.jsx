import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthForm from '../components/AuthForm';
import getErrorMessage from '../utils/getErrorMessage';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async ({ name, email, password }) => {
    setSubmitting(true);
    setError('');
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="container page page--center">
      <AuthForm mode="register" onSubmit={handleSubmit} submitting={submitting} submitError={error} />
    </div>
  );
}
