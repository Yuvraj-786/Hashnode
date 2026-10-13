import { useState } from 'react';
import StaticPage from '../components/StaticPage';
import FeatureNotice from '../components/FeatureNotice';
import { isValidEmail } from '../utils/validators';

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = {};
    if (!values.name.trim()) found.name = 'Name is required.';
    if (!isValidEmail(values.email.trim())) found.email = 'Enter a valid email address.';
    if (!values.message.trim()) found.message = 'Message is required.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // TODO(contact): send `values` to a contact endpoint once the backend has one.
    // The form is frontend-only for now and nothing leaves the browser.
    setSubmitted(true);
  };

  return (
    <StaticPage title="Contact" subtitle="Questions, feedback, or bug reports are welcome.">
      <p>
        Email us at <a href="mailto:hello@example.com">hello@example.com</a>
        {/* TODO: replace with your real support address. */}
      </p>

      <form className="card contact-form" onSubmit={handleSubmit} noValidate>
        {submitted && <FeatureNotice>Contact submissions aren't connected to the backend yet, so this message was not sent.</FeatureNotice>}

        <div className="field">
          <label className="label" htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" className="input" value={values.name} onChange={handleChange} />
          {errors.name && <span className="field__error">{errors.name}</span>}
        </div>

        <div className="field">
          <label className="label" htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" className="input" value={values.email} onChange={handleChange} />
          {errors.email && <span className="field__error">{errors.email}</span>}
        </div>

        <div className="field">
          <label className="label" htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" className="input input--area" rows={5} value={values.message} onChange={handleChange} />
          {errors.message && <span className="field__error">{errors.message}</span>}
        </div>

        <button type="submit" className="btn btn--primary">Send message</button>
      </form>
    </StaticPage>
  );
}
