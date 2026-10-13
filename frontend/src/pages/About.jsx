import StaticPage from '../components/StaticPage';

export default function About() {
  return (
    <StaticPage title="About Inkwell" subtitle="A home for developers who like to write.">
      <p>
        Inkwell is a blogging platform for developers. Write in Markdown, add code blocks with syntax highlighting,
        organize posts with tags, and publish when you're ready.
      </p>
      <h2>What you can do</h2>
      <ul>
        <li>Write drafts and publish them when they're ready.</li>
        <li>Tag posts so readers can find related topics.</li>
        <li>Search and browse the archive by month, tag, or author.</li>
        <li>Share a public profile with your published posts.</li>
      </ul>
      <p>Questions or feedback? Head to the contact page.</p>
    </StaticPage>
  );
}
