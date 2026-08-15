import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '../../api/auth.js';
import Button from '../common/Button.jsx';

export default function ResetPasswordForm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await resetPassword({ token, newPassword });
      setDone(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Could not reset password');
    }
  }

  if (!token) {
    return (
      <p className="text-sm">
        Missing reset token. Request a new link from{' '}
        <Link to="/forgot-password" className="text-dusk-500 hover:underline">
          the forgot password page
        </Link>
        .
      </p>
    );
  }

  if (done) {
    return <p className="text-sm">Password reset. Redirecting to login…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="newPassword" className="mb-1 block text-sm font-medium">
          New password
        </label>
        <input
          id="newPassword"
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-lg border border-mist-300 bg-white px-3 py-2 text-ink-900
            focus:border-dusk-400 dark:border-night-600 dark:bg-night-700 dark:text-mist-100"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full">
        Reset password
      </Button>
    </form>
  );
}
