import { apiRequest } from "./http";
import type { EntityEvent } from "../types/social";

export async function fetchEvents() {
  const response = await apiRequest<{ data: EntityEvent[] }>("/api/eventos");

  return response.data;
}

export async function createEvent(
  token: string,
  input: { titulo: string; descripcion?: string; modalidad?: string; lugar?: string; capacidad?: number; ciudadId?: string },
) {
  return apiRequest<{ message: string; evento: EntityEvent }>("/api/eventos", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
}

export async function attendEvent(token: string, eventId: string) {
  return apiRequest<{ message: string }>(`/api/eventos/${eventId}/asistir`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function saveEvent(token: string, eventId: string) {
  return apiRequest<{ message: string }>(`/api/eventos/${eventId}/guardar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}
