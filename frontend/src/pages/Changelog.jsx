import StaticPage from '../components/StaticPage';

const RELEASES = [
  {
    version: '1.0.0',
    date: 'October 2026',
    notes: [
      'Public feed, search, archive, tag pages, and post pages with syntax-highlighted code.',
      'Sign up, sign in, and a dashboard for drafts and published posts.',
      'Markdown editor with live preview.',
      'Public profiles and profile settings.',
    ],
  },
];

export default function Changelog() {
  return (
    <StaticPage title="Changelog" subtitle="What's new in Inkwell.">
      {RELEASES.map((release) => (
        <section key={release.version}>
          <h2>v{release.version} <span className="muted">{release.date}</span></h2>
          <ul>
            {release.notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </section>
      ))}
    </StaticPage>
  );
}
