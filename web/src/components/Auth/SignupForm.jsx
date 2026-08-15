import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../common/Button.jsx';
import Spinner from '../common/Spinner.jsx';

export default function SignupForm() {
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    try {
      await signup({ name, email, password });
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Could not sign up');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-mist-300 bg-white px-3 py-2 text-ink-900
            focus:border-dusk-400 dark:border-night-600 dark:bg-night-700 dark:text-mist-100"
        />
      </div>
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
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-mist-300 bg-white px-3 py-2 text-ink-900
            focus:border-dusk-400 dark:border-night-600 dark:bg-night-700 dark:text-mist-100"
        />
        <p className="mt-1 text-xs text-ink-700 dark:text-mist-300">At least 8 characters.</p>
      </div>

      {formError && (
        <p role="alert" className="text-sm text-red-600">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? <Spinner className="border-white/40 border-t-white" /> : 'Create account'}
      </Button>

      <p className="text-center text-sm text-ink-700 dark:text-mist-300">
        Already have an account?{' '}
        <Link to="/login" className="text-dusk-500 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
