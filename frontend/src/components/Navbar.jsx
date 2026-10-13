import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Avatar from './Avatar';

export default function Navbar() {
  const { user, authStatus, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSearch = (event) => {
    event.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo" aria-hidden="true">H</span>
          <span className="navbar__name">Hashnode</span>
        </Link>

        <form className="navbar__search" role="search" onSubmit={handleSearch}>
          <input
            type="search"
            className="input input--search"
            placeholder="Search posts"
            aria-label="Search posts"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>

        <button
          type="button"
          className="navbar__toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>

        <nav className={`navbar__nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main">
          <NavLink to="/" end className="navbar__link">Home</NavLink>
          <NavLink to="/archive" className="navbar__link">Archive</NavLink>

          {authStatus === 'guest' && (
            <div className="navbar__group">
              <Link to="/login" className="btn btn--ghost">Log in</Link>
              <Link to="/register" className="btn btn--primary">Sign up</Link>
            </div>
          )}

          {authStatus === 'authenticated' && (
            <>
              <NavLink to="/dashboard" className="navbar__link">Dashboard</NavLink>
              <NavLink to="/bookmarks" className="navbar__link">Bookmarks</NavLink>
              <NavLink to="/settings" className="navbar__link">Settings</NavLink>
              <div className="navbar__group">
                <Link to="/editor/new" className="btn btn--primary">Write</Link>
                {user?.id && (
                  <Link to={`/profile/${user.id}`} className="navbar__avatar" aria-label="Your profile">
                    <Avatar name={user.name} src={user.avatarUrl} size={34} />
                  </Link>
                )}
                <button type="button" className="btn btn--ghost" onClick={handleLogout}>Log out</button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
