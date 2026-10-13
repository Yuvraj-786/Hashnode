import { Link } from 'react-router-dom';

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/changelog', label: 'Changelog' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="muted">© {new Date().getFullYear()} Hashnode. A Developer-First Blogging & Publishing Platform</p>
        <nav className="footer__links" aria-label="Footer">
          {LINKS.map(({ to, label }) => (
            <Link key={to} to={to}>{label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
