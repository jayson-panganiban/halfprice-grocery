import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import StructuredData from './StructuredData';
import {
  Envelope,
  GithubLogo,
  LinkedinLogo,
  PaperPlaneTilt,
} from 'phosphor-react';
import '../styles/components/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulating an API call
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit the form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredData = {
    name: 'Contact HalfPrice Grocery',
    description:
      'Get in touch with HalfPrice Grocery. Share your suggestions, report bugs, or just say hi.',
    url: 'https://halfpricegrocery.com/contact',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'jsoncp@proton.me',
      contactType: 'customer support',
    },
  };

  return (
    <div className="contact-container">
      <Helmet>
        <title>Contact Us - HalfPrice Grocery</title>
        <meta
          name="description"
          content="Get in touch with HalfPrice Grocery."
        />
      </Helmet>
      <StructuredData type="ContactPage" data={structuredData} />
      <h1 className="contact-title gradient-text">Get in Touch</h1>
      <p className="contact-intro">
        Hey there! I'm always excited to hear from fellow bargain hunters.
        Whether you've got a suggestion, found a bug, or just want to say hi,
        drop me a line!
      </p>
      <div className="contact-content">
        <div className="contact-info">
          <h2>Let's Connect</h2>
          <ul>
            <li>
              <Envelope size={24} />
              <a href="mailto:jsoncp@proton.me">jsoncp@proton.me</a>
            </li>
            <li>
              <GithubLogo size={24} />
              <a
                href="https://github.com/jayson-panganiban"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <LinkedinLogo size={24} />
              <a
                href="https://www.linkedin.com/in/jayson-panganiban"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send me a Message</h2>
          <div className={`form-group ${errors.name ? 'error' : ''}`}>
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p className="error-message" id="name-error">
                {errors.name}
              </p>
            )}
          </div>
          <div className={`form-group ${errors.email ? 'error' : ''}`}>
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p className="error-message" id="email-error">
                {errors.email}
              </p>
            )}
          </div>
          <div className={`form-group ${errors.message ? 'error' : ''}`}>
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? 'message-error' : undefined}
            ></textarea>
            {errors.message && (
              <p className="error-message" id="message-error">
                {errors.message}
              </p>
            )}
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Submit'}
            <PaperPlaneTilt size={20} />
          </button>
          {errors.submit && <p className="error-message">{errors.submit}</p>}
          {submitSuccess && (
            <div className="success-message">
              Thanks for reaching out! I'll get back to you soon.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;
