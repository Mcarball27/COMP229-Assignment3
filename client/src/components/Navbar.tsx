// -----------------------------------------------------------------------------
// Navbar.tsx — site-wide navigation bar.
// Author: Maria Martina Carballo Diaz
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Navbar.tsx — site-wide navigation bar.
// Author: Maria Martina Carballo Diaz
// -----------------------------------------------------------------------------
import { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { getCurrentUser, signout } from '../api/authStorage';

type NavLinkItem = {
  to: string;
  label: string;
  end?: boolean;
};

const NAV_LINKS: NavLinkItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About Me' },
  { to: '/projects', label: 'Projects' },
  { to: '/education', label: 'Education' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact Me' }
];

const NAV_LINK_BASE =
  'px-3.5 py-2 rounded-md font-medium no-underline transition-colors hover:bg-white/5';

export default function Navbar() {
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Update the Navbar when a user signs in or signs out.
  useEffect(() => {
    const updateAuth = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener('authChange', updateAuth);

    return () => {
      window.removeEventListener('authChange', updateAuth);
    };
  }, []);

  function handleSignout() {
    signout();
    closeMobileMenu();
    navigate('/');
  }

  const getLinkClass = (isActive: boolean) =>
    [
      NAV_LINK_BASE,
      isActive
        ? 'text-[#2a171d] bg-gradient-to-br from-accent to-accent-strong hover:bg-transparent'
        : 'text-muted hover:text-text'
    ].join(' ');

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-bg/75 border-b border-border">
      <div className="relative max-w-content mx-auto px-5 py-3 flex items-center gap-4">

        {/* Portfolio logo and name */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2.5 text-text no-underline font-bold tracking-wide hover:no-underline"
        >
          <Logo size={38} />
          <span className="text-[1.05rem]">
            Martina Carballo Diaz
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="ml-auto md:hidden inline-flex flex-col gap-1 border border-border rounded-md px-2.5 py-2 cursor-pointer bg-transparent"
        >
          <span className="block w-[22px] h-0.5 bg-text rounded-sm" />
          <span className="block w-[22px] h-0.5 bg-text rounded-sm" />
          <span className="block w-[22px] h-0.5 bg-text rounded-sm" />
        </button>

        {/* Navigation links */}
        <nav
          className={[
            'md:ml-auto md:static md:flex md:flex-row md:items-center md:gap-1 md:flex-wrap md:bg-transparent md:border-0 md:p-0',
            'absolute left-0 right-0 top-full flex-col items-stretch gap-1 px-5 pt-3 pb-5 bg-bg/95 border-b border-border',
            isMobileMenuOpen ? 'flex' : 'hidden'
          ].join(' ')}
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={closeMobileMenu}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              {link.label}
            </NavLink>
          ))}

          {/* Authentication navigation */}
          {currentUser ? (
            <>
              {/* Admin link or regular User name */}
              {currentUser.role === 'admin' ? (
                <NavLink
                  to="/admin/contacts"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    getLinkClass(isActive)
                  }
                >
                  Admin
                </NavLink>
              ) : (
                <span className="px-3.5 py-2 text-accent font-medium">
                  {currentUser.name}
                </span>
              )}

              {/* Sign Out button */}
              <button
                type="button"
                onClick={handleSignout}
                className={`${NAV_LINK_BASE} text-muted hover:text-text bg-transparent border-0 cursor-pointer text-left`}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              {/* Sign In link */}
              <NavLink
                to="/signin"
                onClick={closeMobileMenu}
                className={({ isActive }) => getLinkClass(isActive)}
              >
                Sign In
              </NavLink>

              {/* Sign Up link */}
              <NavLink
                to="/signup"
                onClick={closeMobileMenu}
                className={({ isActive }) => getLinkClass(isActive)}
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}