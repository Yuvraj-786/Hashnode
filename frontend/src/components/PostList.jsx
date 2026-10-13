import PostCard from './PostCard';

export default function PostList({ posts, showAuthor = true }) {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} showAuthor={showAuthor} />
      ))}
    </div>
  );
}
