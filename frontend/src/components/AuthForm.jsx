import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from './AuthCard';
import ErrorMessage from './ErrorMessage';
import { isValidEmail } from '../utils/validators';

const COPY = {
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to manage your posts.',
    submit: 'Sign in',
    footer: (
      <>New here? <Link to="/register">Create an account</Link></>
    ),
  },
  register: {
    title: 'Create your account',
    subtitle: 'Start writing in a minute.',
    submit: 'Create account',
    footer: (
      <>Already have an account? <Link to="/login">Sign in</Link></>
    ),
  },
};

/** Shared by Login ("login") and Register ("register"). */
export default function AuthForm({ mode, onSubmit, submitting, submitError, notice }) {
  const copy = COPY[mode];
  const isRegister = mode === 'register';

  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const validate = () => {
    const found = {};
    if (isRegister && !values.name.trim()) found.name = 'Name is required.';
    if (!values.email.trim()) found.email = 'Email is required.';
    else if (!isValidEmail(values.email.trim())) found.email = 'Enter a valid email address.';
    if (!values.password) found.password = 'Password is required.';
    else if (isRegister && values.password.length < 8) found.password = 'Password must be at least 8 characters.';
    return found;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload = { email: values.email.trim(), password: values.password };
    if (isRegister) payload.name = values.name.trim();
    onSubmit(payload);
  };

  return (
    <AuthCard title={copy.title} subtitle={copy.subtitle} footer={copy.footer}>
      <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
        {notice && <div className="alert alert--info" role="status">{notice}</div>}
        <ErrorMessage message={submitError} />

        {isRegister && (
          <div className="field">
            <label className="label" htmlFor="name">Name</label>
            <input id="name" name="name" className="input" value={values.name} onChange={handleChange} autoComplete="name" />
            {errors.name && <span className="field__error">{errors.name}</span>}
          </div>
        )}

        <div className="field">
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" value={values.email} onChange={handleChange} autoComplete="email" />
          {errors.email && <span className="field__error">{errors.email}</span>}
        </div>

        <div className="field">
          <div className="field__row">
            <label className="label" htmlFor="password">Password</label>
            {!isRegister && <Link to="/forgot-password" className="field__link">Forgot password?</Link>}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            value={values.password}
            onChange={handleChange}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
          />
          {isRegister && !errors.password && <span className="field__hint">At least 8 characters.</span>}
          {errors.password && <span className="field__error">{errors.password}</span>}
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? 'Please wait…' : copy.submit}
        </button>
      </form>
    </AuthCard>
  );
}
