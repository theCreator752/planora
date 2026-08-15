import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth.js';
import Button from '../common/Button.jsx';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [devToken, setDevToken] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    try {
      const res = await forgotPassword(email);
      setDevToken(res.devResetToken || null);
      setStatus('sent');
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setStatus('idle');
    }
  }

  if (status === 'sent') {
    return (
      <div className="space-y-3 text-sm">
        <p>If an account with that email exists, a reset link has been sent.</p>
        {devToken && (
          <div className="rounded-lg bg-mist-200 p-3 dark:bg-night-700">
            <p className="mb-1 text-xs text-ink-700 dark:text-mist-300">
              Dev mode — no email provider is wired up yet, so here's the token directly:
            </p>
            <code className="break-all text-xs">{devToken}</code>
            <Link
              to={`/reset-password?token=${encodeURIComponent(devToken)}`}
              className="mt-2 block text-dusk-500 hover:underline"
            >
              Continue to reset password →
            </Link>
          </div>
        )}
        <Link to="/login" className="block text-dusk-500 hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-mist-300 bg-white px-3 py-2 text-ink-900
            focus:border-dusk-400 dark:border-night-600 dark:bg-night-700 dark:text-mist-100"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <Button type="submit" disabled={status === 'sending'} className="w-full">
        Send reset link
      </Button>
      <Link to="/login" className="block text-center text-sm text-dusk-500 hover:underline">
        Back to login
      </Link>
    </form>
  );
}
