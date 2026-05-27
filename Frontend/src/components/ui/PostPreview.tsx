import type { FeedPost } from "../../types/social";

export function PostPreview({
  post,
}: {
  post: {
    autor?: FeedPost["autor"];
    contenido: string;
    ciudad?: { nombre: string; estado?: string; pais?: string };
    hashtags?: (string | { nombre: string })[];
    id: string;
  };
}) {
  const hashtags = (post.hashtags ?? []).map((hashtag) => (typeof hashtag === "string" ? hashtag : hashtag.nombre));

  return (
    <article className="entity-card compact">
      <strong>{post.autor?.username ? `@${post.autor.username}` : "Publicacion"}</strong>
      <p>{post.contenido}</p>
      <div className="post-tags">
        {post.ciudad?.nombre && <span>{post.ciudad.nombre}</span>}
        {hashtags.slice(0, 3).map((hashtag) => (
          <span key={`${post.id}-${hashtag}`}>#{hashtag}</span>
        ))}
      </div>
    </article>
  );
}
