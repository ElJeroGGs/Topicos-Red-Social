import { useCallback, useEffect, useState } from "react";
import { fetchGroups } from "../services/groupService";
import type { EntityGroup } from "../types/social";

export function useGroups() {
  const [groups, setGroups] = useState<EntityGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsMessage, setGroupsMessage] = useState("");

  const refreshGroups = useCallback(async () => {
    setGroupsLoading(true);
    setGroupsMessage("");

    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (error) {
      setGroupsMessage(error instanceof Error ? error.message : "No se pudieron cargar los grupos");
    } finally {
      setGroupsLoading(false);
    }
  }, []);

   
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void refreshGroups();
  }, [refreshGroups]);
  /* eslint-enable react-hooks/set-state-in-effect */
   

  return { groups, groupsLoading, groupsMessage, refreshGroups };
}
