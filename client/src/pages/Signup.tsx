
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      await signup(name, email, password);
      navigate('/signin');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to create account.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-lg mx-auto">
      <h1 className="section-title">Sign Up</h1>

      <p className="lead">
        Create an account to access the portfolio.
      </p>

      <form onSubmit={handleSubmit} className="card grid gap-4 mt-6">
        <div className="grid gap-2">
          <label htmlFor="signup-name" className="font-semibold">
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            autoComplete="name"
            className="w-full rounded-md border border-current bg-transparent p-3"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="signup-email" className="font-semibold">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-md border border-current bg-transparent p-3"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="signup-password" className="font-semibold">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-md border border-current bg-transparent p-3"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="signup-confirm" className="font-semibold">
            Confirm Password
          </label>
          <input
            id="signup-confirm"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            autoComplete="new-password"
            className="w-full rounded-md border border-current bg-transparent p-3"
          />
        </div>

        {error && (
          <p role="alert" className="text-red-400 m-0">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn">
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="m-0 text-sm">
          Already have an account?{' '}
          <Link to="/signin" className="text-accent font-semibold">
            Sign in
          </Link>
        </p>
      </form>
    </section>
  );
}
