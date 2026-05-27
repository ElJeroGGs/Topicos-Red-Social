import { useCallback, useEffect, useState } from "react";
import {
  createRichPost,
  fetchFeaturedPosts,
  fetchUserFeed,
  reactToPost,
  removePostReaction,
  removeSavedPost,
  savePost,
  sharePost,
  type CreatePostInput,
} from "../services/feedService";
import type { FeedPost } from "../types/social";

export function useFeed(userId?: string, token?: string) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedMessage, setFeedMessage] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [reactingPostId, setReactingPostId] = useState("");

  const refreshFeed = useCallback(async () => {
    setFeedLoading(true);
    setFeedMessage("");

    try {
      const data = userId ? await fetchUserFeed(userId) : await fetchFeaturedPosts();
      setPosts(data);
    } catch (error) {
      setFeedMessage(error instanceof Error ? error.message : "No se pudo cargar el feed");
    } finally {
      setFeedLoading(false);
    }
  }, [userId]);

  async function publishPost(input: CreatePostInput) {
    if (!token) {
      setFeedMessage("Inicia sesion para publicar");
      return false;
    }

    setPublishing(true);
    setFeedMessage("");

    try {
      const post = await createRichPost(token, input);
      setPosts((currentPosts) => [post, ...currentPosts]);
      return true;
    } catch (error) {
      setFeedMessage(error instanceof Error ? error.message : "No se pudo publicar");
      return false;
    } finally {
      setPublishing(false);
    }
  }

  async function toggleSaved(postId: string) {
    if (!token) {
      setFeedMessage("Inicia sesion para guardar publicaciones");
      return;
    }

    const currentPost = posts.find((post) => post.id === postId);
    if (!currentPost) return;

    try {
      if (currentPost.guardado) {
        await removeSavedPost(token, postId);
      } else {
        await savePost(token, postId);
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                guardado: !post.guardado,
                guardadosCount: Math.max(0, post.guardadosCount + (post.guardado ? -1 : 1)),
              }
            : post,
        ),
      );
    } catch (error) {
      setFeedMessage(error instanceof Error ? error.message : "No se pudo guardar la publicacion");
    }
  }

  async function shareExistingPost(postId: string) {
    if (!token) {
      setFeedMessage("Inicia sesion para compartir publicaciones");
      return;
    }

    try {
      await sharePost(token, postId);
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? { ...post, compartido: true, compartidosCount: post.compartidosCount + (post.compartido ? 0 : 1) }
            : post,
        ),
      );
    } catch (error) {
      setFeedMessage(error instanceof Error ? error.message : "No se pudo compartir la publicacion");
    }
  }

  async function toggleReaction(postId: string) {
    if (!token) {
      setFeedMessage("Inicia sesion para reaccionar");
      return;
    }

    const currentPost = posts.find((post) => post.id === postId);

    if (!currentPost) {
      return;
    }

    setReactingPostId(postId);
    setFeedMessage("");

    try {
      if (currentPost.reacciono) {
        await removePostReaction(token, postId);
      } else {
        await reactToPost(token, postId);
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id !== postId) {
            return post;
          }

          const nextReacted = !post.reacciono;
          const nextCount = post.reaccionesCount + (nextReacted ? 1 : -1);

          return {
            ...post,
            reacciono: nextReacted,
            reaccionesCount: Math.max(0, nextCount),
          };
        }),
      );
    } catch (error) {
      setFeedMessage(error instanceof Error ? error.message : "No se pudo registrar la reaccion");
    } finally {
      setReactingPostId("");
    }
  }

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (active) {
        void refreshFeed();
      }
    });

    return () => {
      active = false;
    };
  }, [refreshFeed]);

  return {
    feedLoading,
    feedMessage,
    posts,
    publishPost,
    publishing,
    reactingPostId,
    refreshFeed,
    shareExistingPost,
    toggleReaction,
    toggleSaved,
  };
}
