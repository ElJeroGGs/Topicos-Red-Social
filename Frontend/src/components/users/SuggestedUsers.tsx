import { UserPlus } from "lucide-react";
import type { UserSuggestion } from "../../types/social";
import { Avatar } from "../ui/Avatar";

type SuggestedUsersProps = {
  followingId: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  message: string;
  onFollow: (userId: string) => void;
  suggestions: UserSuggestion[];
};

export function SuggestedUsers({
  followingId,
  isLoggedIn,
  isLoading,
  message,
  onFollow,
  suggestions,
}: SuggestedUsersProps) {
  return (
    <section className="suggestions-panel">
      <h2>Personas para seguir</h2>

      {!isLoggedIn ? (
        <p className="status-message">Inicia sesion para descubrir usuarios.</p>
      ) : isLoading ? (
        <p className="status-message">Buscando usuarios...</p>
      ) : suggestions.length > 0 ? (
        <div className="suggestion-list">
          {suggestions.map((user) => (
            <article key={user.id} className="suggestion-card">
              <Avatar user={user} />
              <div>
                <strong>{`${user.nombre ?? ""} ${user.apellido ?? ""}`.trim() || user.username}</strong>
                <span>@{user.username}</span>
                <small>
                  {user.followersCount} seguidores · {user.postsCount} posts
                </small>
              </div>
              <button
                type="button"
                aria-label={`Seguir a ${user.username}`}
                disabled={followingId === user.id}
                onClick={() => onFollow(user.id)}
              >
                <UserPlus size={18} />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <p className="status-message">No hay sugerencias nuevas por ahora.</p>
      )}

      {message && <p className="status-message">{message}</p>}
    </section>
  );
}
