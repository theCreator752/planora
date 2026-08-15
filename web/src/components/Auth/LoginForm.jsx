import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../common/Button.jsx';
import Spinner from '../common/Spinner.jsx';

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Could not log in');
    }
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
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-mist-300 bg-white px-3 py-2 text-ink-900
            focus:border-dusk-400 dark:border-night-600 dark:bg-night-700 dark:text-mist-100"
        />
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <Link to="/forgot-password" className="text-sm text-dusk-500 hover:underline">
            Forgot?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-mist-300 bg-white px-3 py-2 text-ink-900
            focus:border-dusk-400 dark:border-night-600 dark:bg-night-700 dark:text-mist-100"
        />
      </div>

      {formError && (
        <p role="alert" className="text-sm text-red-600">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? <Spinner className="border-white/40 border-t-white" /> : 'Log in'}
      </Button>

      <p className="text-center text-sm text-ink-700 dark:text-mist-300">
        No account?{' '}
        <Link to="/signup" className="text-dusk-500 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
