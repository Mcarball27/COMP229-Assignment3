
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signin } from '../api/auth';

export default function Signin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signin(email, password);

      // Save the signed-in user's information.
      sessionStorage.setItem('authToken', result.token);
      sessionStorage.setItem('authUser', JSON.stringify(result.user));

      // Inform the Navbar that the user has signed in.
      window.dispatchEvent(new Event('authChange'));

      // Redirect to the Projects page.
      navigate('/projects');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to sign in.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-lg mx-auto">
      <h1 className="section-title">Sign In</h1>

      <p className="lead">
        Sign in to access your portfolio account.
      </p>

      <form onSubmit={handleSubmit} className="card grid gap-4 mt-6">
        <div className="grid gap-2">
          <label htmlFor="signin-email" className="font-semibold">
            Email
          </label>
          <input
            id="signin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-md border border-current bg-transparent p-3"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="signin-password" className="font-semibold">
            Password
          </label>
          <input
            id="signin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-current bg-transparent p-3"
          />
        </div>

        {error && (
          <p role="alert" className="text-red-400 m-0">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="m-0 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-accent font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
}
