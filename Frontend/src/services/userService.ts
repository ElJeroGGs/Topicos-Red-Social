import { apiRequest } from "./http";
import type { PublicUserProfile, SessionUser, UserSocialSummary, UserSuggestion } from "../types/social";

export async function fetchUserSuggestions(token: string) {
  const response = await apiRequest<{ data: UserSuggestion[] }>("/api/usuarios/sugerencias", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function followUser(token: string, userId: string) {
  return apiRequest<{ message: string; usuario: UserSuggestion }>(`/api/usuarios/${userId}/seguir`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function unfollowUser(token: string, userId: string) {
  return apiRequest<{ message: string }>(`/api/usuarios/${userId}/seguir`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function blockUser(token: string, userId: string) {
  return apiRequest<{ message: string }>(`/api/usuarios/${userId}/bloquear`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateProfileCities(
  token: string,
  input: { ciudadActualId?: string; ciudadNacimientoId?: string },
) {
  return apiRequest<{ message: string }>("/api/usuarios/me/ciudades", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
}

export async function updateProfile(
  token: string,
  input: Pick<Partial<SessionUser>, "nombre" | "apellido" | "bio" | "foto_perfil_url">,
) {
  return apiRequest<{ message: string; user: SessionUser }>("/api/usuarios/me/perfil", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
}

export async function fetchUserSocialSummary(token: string) {
  const response = await apiRequest<UserSocialSummary>("/api/usuarios/me/social", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function fetchPublicUserProfile(userId: string) {
  return apiRequest<PublicUserProfile>(`/api/usuarios/${userId}/perfil`);
}
