import { useCallback, useEffect, useState } from "react";
import { fetchEvents } from "../services/eventService";
import type { EntityEvent } from "../types/social";

export function useEvents() {
  const [events, setEvents] = useState<EntityEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsMessage, setEventsMessage] = useState("");

  const refreshEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsMessage("");

    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      setEventsMessage(error instanceof Error ? error.message : "No se pudieron cargar los eventos");
    } finally {
      setEventsLoading(false);
    }
  }, []);

   
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void refreshEvents();
  }, [refreshEvents]);
  /* eslint-enable react-hooks/set-state-in-effect */
   

  return { events, eventsLoading, eventsMessage, refreshEvents };
}
