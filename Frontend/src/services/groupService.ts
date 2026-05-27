import { apiRequest } from "./http";
import type { EntityGroup } from "../types/social";

export async function fetchGroups() {
  const response = await apiRequest<{ data: EntityGroup[] }>("/api/grupos");

  return response.data;
}

export async function createGroup(token: string, input: { nombre: string; descripcion?: string; privacidad?: string }) {
  return apiRequest<{ message: string; grupo: EntityGroup }>("/api/grupos", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
}

export async function joinGroup(token: string, groupId: string) {
  return apiRequest<{ message: string; grupo: EntityGroup }>(`/api/grupos/${groupId}/unirse`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}
