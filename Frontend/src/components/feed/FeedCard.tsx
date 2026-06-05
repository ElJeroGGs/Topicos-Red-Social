import { Bookmark, CornerDownRight, Heart, MessageCircle, Repeat2 } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { useComments } from "../../hooks/useComments";
import type { FeedPost } from "../../types/social";
import { formatAuthor, getPostTone } from "../../utils/format";
import { Avatar } from "../ui/Avatar";

type FeedCardProps = {
  post: FeedPost;
  index: number;
  isReacting: boolean;
  onCommentCreated: (postId: string) => void;
  onOpenUser: (userId: string) => void;
  onSharePost: (postId: string) => void;
  onToggleSaved: (postId: string) => void;
  onToggleReaction: (postId: string) => void;
  token: string;
};

export function FeedCard({
  post,
  index,
  isReacting,
  onCommentCreated,
  onOpenUser,
  onSharePost,
  onToggleSaved,
  onToggleReaction,
  token,
}: FeedCardProps) {
  const [commentContent, setCommentContent] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const {
    commenting,
    commentMessage,
    comments,
    commentsLoading,
    commentsOpen,
    submitComment,
    submitCommentReaction,
    submitReply,
    toggleComments,
  } = useComments(post.id, token, () => onCommentCreated(post.id));

  async function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await submitComment(commentContent);

    if (success) {
      setCommentContent("");
    }
  }

  async function handleReplySubmit(event: FormEvent<HTMLFormElement>, commentId: string) {
    event.preventDefault();
    const content = replyDrafts[commentId] ?? "";
    const success = await submitReply(commentId, content);

    if (success) {
      setReplyDrafts((drafts) => ({ ...drafts, [commentId]: "" }));
    }
  }

  return (
    <article className={`feed-card ${getPostTone(index)}`}>
      <div className="post-header">
        <Avatar user={post.autor} />
        <div>
          <button
            className="author-button"
            type="button"
            disabled={!post.autor?.id}
            onClick={() => post.autor?.id && onOpenUser(post.autor.id)}
          >
            {formatAuthor(post)}
          </button>
          <span>@{post.autor?.username ?? "comunidad"}</span>
        </div>
      </div>

      <p>{post.contenido}</p>

      <div className="post-tags">
        {post.ciudad?.nombre && <span>{post.ciudad.nombre}</span>}
        {post.hashtags.slice(0, 4).map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>

      <div className="post-actions">
        <button type="button" aria-label="Comentar" onClick={toggleComments}>
          <MessageCircle size={18} />
          <span>{post.comentariosCount}</span>
        </button>
        <button
          type="button"
          className={post.compartido ? "is-active" : ""}
          aria-label="Compartir"
          onClick={() => onSharePost(post.id)}
        >
          <Repeat2 size={18} />
          <span>{post.compartidosCount}</span>
        </button>
        <button
          type="button"
          className={post.guardado ? "is-active" : ""}
          aria-label="Guardar"
          onClick={() => onToggleSaved(post.id)}
        >
          <Bookmark size={18} />
          <span>{post.guardadosCount}</span>
        </button>
        <button
          type="button"
          className={post.reacciono ? "is-active" : ""}
          aria-label="Reaccionar"
          disabled={isReacting}
          onClick={() => onToggleReaction(post.id)}
        >
          <Heart size={18} />
          <span>{post.reaccionesCount}</span>
        </button>
      </div>

      {commentsOpen && (
        <div className="comments-panel">
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <input
              disabled={!token || commenting}
              placeholder={token ? "Escribe un comentario" : "Inicia sesion para comentar"}
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
            />
            <button type="submit" disabled={!token || commenting || !commentContent.trim()}>
              Comentar
            </button>
          </form>

          {commentsLoading ? (
            <p className="status-message">Cargando comentarios...</p>
          ) : comments.length > 0 ? (
            <div className="comment-list">
              {comments.map((comment) => (
                <article key={comment.id} className="comment-item">
                  <Avatar user={comment.autor} />
                  <div>
                    <strong>@{comment.autor?.username ?? "comunidad"}</strong>
                    <p>{comment.contenido}</p>
                    <div className="comment-actions">
                      <button type="button" disabled={!token} onClick={() => void submitCommentReaction(comment.id)}>
                        <Heart size={14} />
                        <span>{comment.reaccionesCount ?? 0}</span>
                      </button>
                      <span>
                        <CornerDownRight size={14} />
                        {comment.respuestasCount ?? 0} respuestas
                      </span>
                    </div>
                    <form className="reply-form" onSubmit={(event) => void handleReplySubmit(event, comment.id)}>
                      <input
                        disabled={!token || commenting}
                        placeholder={token ? "Responder" : "Inicia sesion para responder"}
                        value={replyDrafts[comment.id] ?? ""}
                        onChange={(event) =>
                          setReplyDrafts((drafts) => ({ ...drafts, [comment.id]: event.target.value }))
                        }
                      />
                      <button type="submit" disabled={!token || commenting || !(replyDrafts[comment.id] ?? "").trim()}>
                        Enviar
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="status-message">Todavia no hay comentarios.</p>
          )}

          {commentMessage && <p className="status-message">{commentMessage}</p>}
        </div>
      )}
    </article>
  );
}
