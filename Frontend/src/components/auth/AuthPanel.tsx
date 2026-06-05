import { AtSign, Lock, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import type { AuthMode, LoginInput, RegisterInput, SessionUser } from "../../types/social";
import { Avatar } from "../ui/Avatar";

const initialRegisterForm: RegisterInput = {
  username: "",
  nombre: "",
  apellido: "",
  correo: "",
  password: "",
};

type AuthPanelProps = {
  authLoading: boolean;
  authMessage: string;
  isLoggedIn: boolean;
  user: SessionUser | null;
  onLogin: (input: LoginInput) => Promise<boolean>;
  onLogout: () => void;
  onRegister: (input: RegisterInput) => Promise<boolean>;
};

export function AuthPanel({
  authLoading,
  authMessage,
  isLoggedIn,
  onLogin,
  onLogout,
  onRegister,
  user,
}: AuthPanelProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loginForm, setLoginForm] = useState<LoginInput>({ correo: "", password: "" });
  const [registerForm, setRegisterForm] = useState<RegisterInput>(initialRegisterForm);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await onLogin(loginForm);

    if (success) {
      setLoginForm({ correo: "", password: "" });
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await onRegister(registerForm);

    if (success) {
      setAuthMode("login");
      setLoginForm({ correo: registerForm.correo, password: "" });
      setRegisterForm(initialRegisterForm);
    }
  }

  return (
    <section className="auth-panel">
      <div className="panel-title">
        <ShieldCheck size={20} />
        <h2>{isLoggedIn ? "Sesion activa" : authMode === "login" ? "Entrar" : "Crear cuenta"}</h2>
      </div>

      {isLoggedIn ? (
        <div className="session-card">
          <Avatar user={user} size="large" />
          <strong>
            {user?.nombre} {user?.apellido}
          </strong>
          <span>@{user?.username}</span>
          <button type="button" className="secondary-button" onClick={onLogout}>
            <LogOut size={18} />
            <span>Salir</span>
          </button>
        </div>
      ) : authMode === "login" ? (
        <form className="auth-form" onSubmit={handleLogin}>
          <label>
            <AtSign size={17} />
            <input
              required
              type="email"
              placeholder="correo"
              value={loginForm.correo}
              onChange={(event) => setLoginForm((form) => ({ ...form, correo: event.target.value }))}
            />
          </label>
          <label>
            <Lock size={17} />
            <input
              required
              minLength={8}
              type="password"
              placeholder="password"
              value={loginForm.password}
              onChange={(event) => setLoginForm((form) => ({ ...form, password: event.target.value }))}
            />
          </label>
          <button type="submit" disabled={authLoading}>
            {authLoading ? "Entrando..." : "Entrar"}
          </button>
          <button type="button" className="link-button" onClick={() => setAuthMode("register")}>
            Crear cuenta
          </button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleRegister}>
          <label>
            <UserRound size={17} />
            <input
              required
              placeholder="username"
              value={registerForm.username}
              onChange={(event) => setRegisterForm((form) => ({ ...form, username: event.target.value }))}
            />
          </label>
          <div className="form-grid">
            <input
              required
              placeholder="nombre"
              value={registerForm.nombre}
              onChange={(event) => setRegisterForm((form) => ({ ...form, nombre: event.target.value }))}
            />
            <input
              required
              placeholder="apellido"
              value={registerForm.apellido}
              onChange={(event) => setRegisterForm((form) => ({ ...form, apellido: event.target.value }))}
            />
          </div>
          <label>
            <AtSign size={17} />
            <input
              required
              type="email"
              placeholder="correo"
              value={registerForm.correo}
              onChange={(event) => setRegisterForm((form) => ({ ...form, correo: event.target.value }))}
            />
          </label>
          <label>
            <Lock size={17} />
            <input
              required
              minLength={8}
              type="password"
              placeholder="password"
              value={registerForm.password}
              onChange={(event) => setRegisterForm((form) => ({ ...form, password: event.target.value }))}
            />
          </label>
          <button type="submit" disabled={authLoading}>
            {authLoading ? "Creando..." : "Registrarme"}
          </button>
          <button type="button" className="link-button" onClick={() => setAuthMode("login")}>
            Ya tengo cuenta
          </button>
        </form>
      )}

      {authMessage && <p className="status-message">{authMessage}</p>}
    </section>
  );
}
