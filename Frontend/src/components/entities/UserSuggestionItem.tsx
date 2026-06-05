import { UserPlus, UserMinus } from "lucide-react";
import type { UserSuggestion } from "../../types/social";
import { Avatar } from "../ui/Avatar";

type Props = {
  suggestion: UserSuggestion;
  onFollow: () => void;
  isFollowing: boolean;
};

export function UserSuggestionItem({ suggestion, onFollow, isFollowing }: Props) {
  return (
    <div className="suggestion-item">
      <div className="suggestion-user">
        <Avatar src={suggestion.foto_perfil_url} alt={suggestion.username} size="sm" />
        <div className="suggestion-info">
          <strong>@{suggestion.username}</strong>
          <span>{suggestion.nombre} {suggestion.apellido}</span>
        </div>
      </div>
      <button 
        className={`icon-btn ${isFollowing ? "following" : ""}`}
        onClick={onFollow}
        title={isFollowing ? "Dejar de seguir" : "Seguir"}
      >
        {isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />}
      </button>
    </div>
  );
}
