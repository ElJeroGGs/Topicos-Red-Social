import { apiRequest } from "./http";
import type { FeedPost, PostComment } from "../types/social";

export async function fetchFeaturedPosts() {
  return fetchPublicPosts();
}

export async function fetchPublicPosts(filters: { ciudad?: string; hashtag?: string; search?: string } = {}) {
  const params = new URLSearchParams();

  if (filters.ciudad) params.set("ciudad", filters.ciudad);
  if (filters.hashtag) params.set("hashtag", filters.hashtag);
  if (filters.search) params.set("search", filters.search);

  const response = await apiRequest<{ data: FeedPost[] }>(
    `/api/publicaciones${params.toString() ? `?${params.toString()}` : ""}`,
  );

  return response.data.map((post) => ({
    ...post,
    hashtags: post.hashtags ?? [],
    comentariosCount: post.comentariosCount ?? 0,
    reaccionesCount: post.reaccionesCount ?? 0,
    guardadosCount: post.guardadosCount ?? 0,
    compartidosCount: post.compartidosCount ?? 0,
    reacciono: post.reacciono ?? false,
    guardado: post.guardado ?? false,
    compartido: post.compartido ?? false,
  }));
}

export type CreatePostInput = {
  contenido: string;
  ciudadId?: string;
  hashtagNames?: string[];
};

export async function createRichPost(token: string, input: CreatePostInput) {
  const response = await apiRequest<{ message: string; publicacion: FeedPost }>("/api/publicaciones", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      contenido: input.contenido,
      tipo_contenido: "texto",
      visibilidad: "publica",
      ciudadId: input.ciudadId,
      hashtagNames: input.hashtagNames ?? [],
    }),
  });

  return response.publicacion;
}

export async function fetchPostComments(postId: string) {
  const response = await apiRequest<{ data: PostComment[] }>(`/api/publicaciones/${postId}/comentarios`);

  return response.data;
}

export async function createPostComment(token: string, postId: string, contenido: string) {
  const response = await apiRequest<{ message: string; comentario: PostComment }>(
    `/api/publicaciones/${postId}/comentarios`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ contenido }),
    },
  );

  return response.comentario;
}

export async function replyToComment(token: string, commentId: string, contenido: string) {
  const response = await apiRequest<{ message: string; comentario: PostComment }>(
    `/api/comentarios/${commentId}/respuestas`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ contenido }),
    },
  );

  return response.comentario;
}

export async function reactToComment(token: string, commentId: string) {
  return apiRequest<{ message: string; reacciono: true }>(`/api/comentarios/${commentId}/reaccion`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function reactToPost(token: string, postId: string) {
  return apiRequest<{ message: string; reacciono: true; tipo: string }>(`/api/publicaciones/${postId}/reaccion`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tipo: "like" }),
  });
}

export async function removePostReaction(token: string, postId: string) {
  return apiRequest<{ message: string; reacciono: false }>(`/api/publicaciones/${postId}/reaccion`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function savePost(token: string, postId: string) {
  return apiRequest<{ message: string }>(`/api/publicaciones/${postId}/guardar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function removeSavedPost(token: string, postId: string) {
  return apiRequest<{ message: string }>(`/api/publicaciones/${postId}/guardar`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function sharePost(token: string, postId: string) {
  return apiRequest<{ message: string }>(`/api/publicaciones/${postId}/compartir`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchUserFeed(userId: string) {
  const response = await apiRequest<{ data: FeedPost[] }>(`/api/usuarios/${userId}/feed`);

  return response.data.map((post) => ({
    ...post,
    hashtags: post.hashtags ?? [],
    comentariosCount: post.comentariosCount ?? 0,
    reaccionesCount: post.reaccionesCount ?? 0,
    guardadosCount: post.guardadosCount ?? 0,
    compartidosCount: post.compartidosCount ?? 0,
    reacciono: post.reacciono ?? false,
    guardado: post.guardado ?? false,
    compartido: post.compartido ?? false,
  }));
}
