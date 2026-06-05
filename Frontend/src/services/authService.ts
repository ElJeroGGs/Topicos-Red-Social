import { apiRequest } from "./http";
import type { LoginInput, RegisterInput, SessionUser } from "../types/social";

export function login(input: LoginInput) {
  return apiRequest<{ token: string; user: SessionUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function register(input: RegisterInput) {
  return apiRequest<{ message: string; user: Pick<SessionUser, "id" | "username" | "correo"> }>(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function getCurrentUser(token: string) {
  return apiRequest<SessionUser>("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
