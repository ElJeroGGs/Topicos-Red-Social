import type { FeedPost, SessionUser } from "../types/social";

export function getInitials(user?: Partial<SessionUser> | null) {
  const first = user?.nombre?.[0] ?? user?.username?.[0] ?? "J";
  const second = user?.apellido?.[0] ?? "";

  return `${first}${second}`.toUpperCase();
}

export function getPostTone(index: number) {
  return ["tone-teal", "tone-coral", "tone-gold", "tone-ink"][index % 4];
}

export function formatAuthor(post: FeedPost) {
  const author = post.autor;

  if (!author) {
    return "Comunidad";
  }

  return `${author.nombre ?? ""} ${author.apellido ?? ""}`.trim() || author.username;
}
