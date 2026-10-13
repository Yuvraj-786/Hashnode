import StaticPage from '../components/StaticPage';

// TODO: this is a template. Have your legal text reviewed before launch.
export default function Privacy() {
  return (
    <StaticPage title="Privacy policy" subtitle="Template – replace with your own policy before launch.">
      <h2>Information we collect</h2>
      <p>Account details you provide (name, email, optional bio and avatar) and the content you publish.</p>
      <h2>How we use it</h2>
      <p>To run your account, display your public profile and posts, and keep the service secure.</p>
      <h2>Storage</h2>
      <p>Your sign-in token is stored in your browser's local storage so you stay signed in.</p>
      <h2>Your choices</h2>
      <p>You can edit your profile and delete your posts at any time from your dashboard and settings.</p>
      <h2>Contact</h2>
      <p>Questions about privacy? Reach out through the contact page.</p>
    </StaticPage>
  );
}
