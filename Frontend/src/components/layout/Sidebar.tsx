import { NAVIGATION_ITEMS, type ViewId } from "../../config/navigation";
import { UserSuggestionItem } from "../entities/UserSuggestionItem";
import { PotroLogo } from "../ui/PotroLogo";
import type { SessionUser, UserSuggestion } from "../../types/social";

type SidebarProps = {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  token: string;
  sessionUser: SessionUser | null;
  suggestions: UserSuggestion[];
  loadingSuggestions: boolean;
  onFollow: (userId: string) => void;
  followingId: string;
};

export function Sidebar({
  activeView,
  onNavigate,
  token,
  sessionUser,
  suggestions,
  loadingSuggestions,
  onFollow,
  followingId,
}: SidebarProps) {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <PotroLogo className="brand-logo" />
        <h2>Jerobook</h2>
      </div>

      <nav className="sidebar-nav">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              aria-label={item.label}
              className={`nav-item ${activeView === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
              title={item.label}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {token && sessionUser && (
        <div className="sidebar-suggestions">
          <h3>A quien seguir</h3>
          {loadingSuggestions ? (
            <div className="loading-state">Buscando personas...</div>
          ) : suggestions.length > 0 ? (
            <div className="suggestions-list">
              {suggestions.map((suggestion) => (
                <UserSuggestionItem
                  key={suggestion.id}
                  suggestion={suggestion}
                  onFollow={() => onFollow(suggestion.id)}
                  isFollowing={followingId === suggestion.id}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">No hay sugerencias</div>
          )}
        </div>
      )}
    </aside>
  );
}
