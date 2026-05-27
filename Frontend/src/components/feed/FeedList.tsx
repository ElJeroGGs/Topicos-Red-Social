import { useMemo } from "react";
import type { FeedPost } from "../../types/social";
import { FeedCard } from "./FeedCard";

type FeedListProps = {
  isLoading: boolean;
  message: string;
  onCommentCreated: (postId: string) => void;
  onOpenUser: (userId: string) => void;
  onSharePost: (postId: string) => void;
  onToggleSaved: (postId: string) => void;
  onToggleReaction: (postId: string) => void;
  posts: FeedPost[];
  reactingPostId: string;
  token: string;
};

export function FeedList({
  isLoading,
  message,
  onCommentCreated,
  onOpenUser,
  onSharePost,
  onToggleSaved,
  onToggleReaction,
  posts,
  reactingPostId,
  token,
}: FeedListProps) {
  const visiblePosts = useMemo(() => posts.slice(0, 9), [posts]);

  if (isLoading) {
    return (
      <section className="feed-list" aria-label="Publicaciones">
        <div className="empty-state">Cargando publicaciones...</div>
      </section>
    );
  }

  if (message) {
    return (
      <section className="feed-list" aria-label="Publicaciones">
        <div className="empty-state">{message}</div>
      </section>
    );
  }

  if (visiblePosts.length === 0) {
    return (
      <section className="feed-list" aria-label="Publicaciones">
        <div className="empty-state">No hay publicaciones disponibles.</div>
      </section>
    );
  }

  return (
    <section className="feed-list" aria-label="Publicaciones">
      {visiblePosts.map((post, index) => (
        <FeedCard
          key={post.id}
          post={post}
          index={index}
          token={token}
          isReacting={reactingPostId === post.id}
          onCommentCreated={onCommentCreated}
          onOpenUser={onOpenUser}
          onSharePost={onSharePost}
          onToggleSaved={onToggleSaved}
          onToggleReaction={onToggleReaction}
        />
      ))}
    </section>
  );
}
