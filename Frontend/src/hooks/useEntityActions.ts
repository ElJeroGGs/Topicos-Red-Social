import { attendEvent, createEvent, saveEvent } from "../services/eventService";
import { createGroup, joinGroup } from "../services/groupService";
import { blockUser, updateProfileCities } from "../services/userService";

export function useEntityActions(
  token: string,
  refreshGraph: () => Promise<void>,
  refreshFeed: () => Promise<void>,
  refreshSocial?: () => Promise<void>,
  refreshGroups?: () => Promise<void>,
  refreshEvents?: () => Promise<void>,
) {
  async function requireToken() {
    if (!token) {
      return false;
    }
    return true;
  }

  async function addGroup(input: { nombre: string; descripcion?: string; privacidad?: string }) {
    if (!(await requireToken())) return false;
    await createGroup(token, input);
    await refreshGraph();
    await refreshGroups?.();
    await refreshSocial?.();
    return true;
  }

  async function joinExistingGroup(groupId: string) {
    if (!(await requireToken())) return false;
    await joinGroup(token, groupId);
    await refreshGraph();
    await refreshGroups?.();
    await refreshSocial?.();
    return true;
  }

  async function addEvent(input: {
    titulo: string;
    descripcion?: string;
    modalidad?: string;
    lugar?: string;
    capacidad?: number;
    ciudadId?: string;
  }) {
    if (!(await requireToken())) return false;
    await createEvent(token, input);
    await refreshGraph();
    await refreshEvents?.();
    await refreshSocial?.();
    return true;
  }

  async function attendExistingEvent(eventId: string) {
    if (!(await requireToken())) return false;
    await attendEvent(token, eventId);
    await refreshGraph();
    await refreshEvents?.();
    await refreshSocial?.();
    return true;
  }

  async function saveExistingEvent(eventId: string) {
    if (!(await requireToken())) return false;
    await saveEvent(token, eventId);
    await refreshGraph();
    await refreshSocial?.();
    return true;
  }

  async function blockExistingUser(userId: string) {
    if (!(await requireToken())) return false;
    await blockUser(token, userId);
    await refreshGraph();
    await refreshFeed();
    await refreshSocial?.();
    return true;
  }

  async function connectProfileCities(input: { ciudadActualId?: string; ciudadNacimientoId?: string }) {
    if (!(await requireToken())) return false;
    await updateProfileCities(token, input);
    await refreshGraph();
    await refreshSocial?.();
    return true;
  }

  return {
    addEvent,
    addGroup,
    attendExistingEvent,
    blockExistingUser,
    connectProfileCities,
    joinExistingGroup,
    saveExistingEvent,
  };
}
