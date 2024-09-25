import React, { useState } from 'react';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import '../styles/components/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert("Thanks for reaching out! I'll get back to you soon.");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-container">
      <h1>Get in Touch</h1>
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
              <FaEnvelope />{' '}
              <a href="mailto:jsoncp@proton.me">jsoncp@proton.me</a>
            </li>
            <li>
              <FaGithub />{' '}
              <a
                href="https://github.com/jayson-panganiban"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <FaLinkedin />{' '}
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
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
