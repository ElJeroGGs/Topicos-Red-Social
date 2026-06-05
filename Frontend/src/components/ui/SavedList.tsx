import type { FeedPost } from "../../types/social";
import { PostPreview } from "./PostPreview";

export function SavedList({ posts, title }: { posts: FeedPost[]; title: string }) {
  return (
    <section className="entity-section">
      <h3>{title}</h3>
      <div className="entity-card-list">
        {posts.slice(0, 6).map((post) => (
          <PostPreview key={post.id} post={post} />
        ))}
        {!posts.length && <p className="status-message">Todavia no hay contenido aqui.</p>}
      </div>
    </section>
  );
}
