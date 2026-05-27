import { topics } from "../../config/navigation";
import type { LoginInput, RegisterInput, SessionUser, UserSuggestion } from "../../types/social";
import { AuthPanel } from "../auth/AuthPanel";
import { SuggestedUsers } from "../users/SuggestedUsers";

type RightPanelProps = {
  authLoading: boolean;
  authMessage: string;
  followingId: string;
  isLoggedIn: boolean;
  loadingSuggestions: boolean;
  onFollowSuggestion: (userId: string) => void;
  user: SessionUser | null;
  onLogin: (input: LoginInput) => Promise<boolean>;
  onLogout: () => void;
  onRegister: (input: RegisterInput) => Promise<boolean>;
  suggestions: UserSuggestion[];
  suggestionsMessage: string;
};

export function RightPanel(props: RightPanelProps) {
  return (
    <aside className="right-panel">
      <AuthPanel {...props} />

      <SuggestedUsers
        followingId={props.followingId}
        isLoggedIn={props.isLoggedIn}
        isLoading={props.loadingSuggestions}
        message={props.suggestionsMessage}
        suggestions={props.suggestions}
        onFollow={props.onFollowSuggestion}
      />

      <section className="trend-panel">
        <h2>Tendencias</h2>
        <div className="topic-list">
          {topics.map((topic) => (
            <button key={topic.id} type="button">
              #{topic.name}
            </button>
          ))}
        </div>
      </section>

      <section className="graph-panel">
        <h2>Grafo activo</h2>
        <div className="graph-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p>Publicaciones, autores, hashtags y comentarios se leen como relaciones en Neo4j.</p>
      </section>
    </aside>
  );
}
