import { Moon, Sun } from "lucide-react";
import { NAVIGATION_ITEMS, type ViewId } from "../../config/navigation";
import type { SessionUser } from "../../types/social";

type TopbarProps = {
  activeView: ViewId;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onSignOut: () => void;
  sessionUser: SessionUser | null;
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export function Topbar({
  activeView,
  isLoggedIn,
  onLoginClick,
  onRegisterClick,
  onSignOut,
  sessionUser,
  theme,
  toggleTheme,
}: TopbarProps) {
  const currentView = NAVIGATION_ITEMS.find((v) => v.id === activeView);

  return (
    <header className="app-topbar">
      <div className="topbar-title">
        <h1>{currentView?.label || "Inicio"}</h1>
      </div>

      <div className="topbar-actions">
        <button className="icon-btn theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {isLoggedIn ? (
          <div className="user-menu">
            <span className="user-greeting">Hola, {sessionUser?.nombre || sessionUser?.username}</span>
            <button className="btn outline" onClick={onSignOut}>
              Cerrar sesion
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="btn text" onClick={onLoginClick}>
              Iniciar sesion
            </button>
            <button className="btn primary" onClick={onRegisterClick}>
              Registrarse
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
