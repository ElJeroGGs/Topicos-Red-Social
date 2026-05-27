import { useEffect, useState } from "react";
import { getCurrentUser, login, register } from "../services/authService";
import { ApiError } from "../services/http";
import type { LoginInput, RegisterInput, SessionUser } from "../types/social";

const tokenKey = "jerobook_token";

export function useAuth() {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey) ?? "");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const isLoggedIn = Boolean(token && sessionUser);

  useEffect(() => {
    let ignore = false;

    async function hydrate() {
      if (!token) {
        return;
      }

      try {
        const user = await getCurrentUser(token);
        if (!ignore) {
          setSessionUser(user);
        }
      } catch {
        localStorage.removeItem(tokenKey);
        if (!ignore) {
          setToken("");
          setSessionUser(null);
        }
      }
    }

    hydrate();

    return () => {
      ignore = true;
    };
  }, [token]);

  async function refreshSession() {
    if (!token) {
      return null;
    }

    const user = await getCurrentUser(token);
    setSessionUser(user);
    return user;
  }

  async function signIn(input: LoginInput) {
    setAuthLoading(true);
    setAuthMessage("");

    try {
      const data = await login(input);
      localStorage.setItem(tokenKey, data.token);
      setToken(data.token);
      setSessionUser(data.user);
      setAuthMessage(`Bienvenido, ${data.user.username}`);
      return true;
    } catch (error) {
      setAuthMessage(error instanceof ApiError ? error.message : "No se pudo iniciar sesion");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }

  async function signUp(input: RegisterInput) {
    setAuthLoading(true);
    setAuthMessage("");

    try {
      await register(input);
      setAuthMessage("Cuenta creada. Inicia sesion con tu correo.");
      return true;
    } catch (error) {
      setAuthMessage(error instanceof ApiError ? error.message : "No se pudo crear la cuenta");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }

  function signOut() {
    localStorage.removeItem(tokenKey);
    setToken("");
    setSessionUser(null);
    setAuthMessage("Sesion cerrada");
  }

  return {
    authLoading,
    authMessage,
    isLoggedIn,
    sessionUser,
    signIn,
    signOut,
    signUp,
    refreshSession,
    token,
  };
}
