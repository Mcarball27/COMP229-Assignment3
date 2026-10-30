
import { API_BASE_URL } from './config';

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user';
};

export type SigninResponse = {
  token: string;
  user: AuthUser;
};

export async function signin(
  email: string,
  password: string
): Promise<SigninResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Unable to sign in');
  }

  return data;
}

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Unable to create account');
  }

  return data;
}
