import { useState } from 'react';
import { trackEvent } from '../analytics';

export default function NewsletterForm({ actionUrl }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');

    try {
      // If user provided an actionUrl (Mailchimp / ConvertKit / Buttondown), POST to it.
      if (actionUrl) {
        const res = await fetch(actionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ EMAIL: email }),
        });
        if (!res.ok) throw new Error('Signup failed');
      } else {
        // Fallback: fake success for local testing
        await new Promise((r) => setTimeout(r, 400));
      }

      setStatus('success');
      trackEvent('newsletter_signup', { method: actionUrl ? 'external' : 'local' });
    } catch (err) {
      console.error(err);
      setStatus('error');
      trackEvent('newsletter_signup_error', { error: err.message });
    }
  };

  return (
    <form className="max-w-md" onSubmit={handleSubmit}>
      <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-300 mb-2">Join our newsletter</label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          aria-label="Email address"
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-base-secondary text-text-primary border border-gray-700"
        />
        <button type="submit" className="px-4 py-2 rounded bg-accent-primary text-white">{status === 'loading' ? 'Joining…' : 'Join'}</button>
      </div>
      {status === 'success' && <p className="text-green-400 mt-2">Thanks — please check your email.</p>}
      {status === 'error' && <p className="text-red-400 mt-2">Something went wrong. Please try again.</p>}
    </form>
  );
}