
import type { AuthUser } from './auth';

export function getCurrentUser(): AuthUser | null {
  const savedUser = sessionStorage.getItem('authUser');

  if (!savedUser || !sessionStorage.getItem('authToken')) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as AuthUser;
  } catch {
    return null;
  }
}

export function signout(): void {
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('authUser');

  // Notify components that authentication has changed.
  window.dispatchEvent(new Event('authChange'));
}
