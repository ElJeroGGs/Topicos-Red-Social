import { useState } from "react";
import { createPostComment, fetchPostComments, reactToComment, replyToComment } from "../services/feedService";
import type { PostComment } from "../types/social";

export function useComments(postId: string, token?: string, onCommentCreated?: () => void) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [commentMessage, setCommentMessage] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  async function loadComments() {
    setCommentsLoading(true);
    setCommentMessage("");

    try {
      const data = await fetchPostComments(postId);
      setComments(data);
      setHasLoaded(true);
    } catch (error) {
      setCommentMessage(error instanceof Error ? error.message : "No se pudieron cargar comentarios");
    } finally {
      setCommentsLoading(false);
    }
  }

  async function toggleComments() {
    setCommentsOpen((current) => !current);

    if (!hasLoaded) {
      await loadComments();
    }
  }

  async function submitComment(content: string) {
    if (!token) {
      setCommentMessage("Inicia sesion para comentar");
      return false;
    }

    setCommenting(true);
    setCommentMessage("");

    try {
      const comment = await createPostComment(token, postId, content);
      setComments((currentComments) => [comment, ...currentComments]);
      onCommentCreated?.();
      return true;
    } catch (error) {
      setCommentMessage(error instanceof Error ? error.message : "No se pudo comentar");
      return false;
    } finally {
      setCommenting(false);
    }
  }

  async function submitReply(commentId: string, content: string) {
    if (!token) {
      setCommentMessage("Inicia sesion para responder comentarios");
      return false;
    }

    setCommenting(true);
    setCommentMessage("");

    try {
      await replyToComment(token, commentId, content);
      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, respuestasCount: (comment.respuestasCount ?? 0) + 1 }
            : comment,
        ),
      );
      return true;
    } catch (error) {
      setCommentMessage(error instanceof Error ? error.message : "No se pudo responder el comentario");
      return false;
    } finally {
      setCommenting(false);
    }
  }

  async function submitCommentReaction(commentId: string) {
    if (!token) {
      setCommentMessage("Inicia sesion para reaccionar a comentarios");
      return;
    }

    try {
      await reactToComment(token, commentId);
      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, reaccionesCount: (comment.reaccionesCount ?? 0) + 1 }
            : comment,
        ),
      );
    } catch (error) {
      setCommentMessage(error instanceof Error ? error.message : "No se pudo reaccionar al comentario");
    }
  }

  return {
    commenting,
    commentMessage,
    comments,
    commentsLoading,
    commentsOpen,
    submitComment,
    submitCommentReaction,
    submitReply,
    toggleComments,
  };
}
