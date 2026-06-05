import { useCallback, useEffect, useState } from "react";
import { fetchUserSocialSummary } from "../services/userService";
import type { UserSocialSummary } from "../types/social";

export function useUserSocialSummary(token?: string) {
  const [social, setSocial] = useState<UserSocialSummary | null>(null);
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialMessage, setSocialMessage] = useState("");

  const refreshSocial = useCallback(async () => {
    if (!token) {
      setSocial(null);
      return;
    }

    setSocialLoading(true);
    setSocialMessage("");

    try {
      const data = await fetchUserSocialSummary(token);
      setSocial(data);
    } catch (error) {
      setSocialMessage(error instanceof Error ? error.message : "No se pudo cargar tu actividad");
    } finally {
      setSocialLoading(false);
    }
  }, [token]);

   
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void refreshSocial();
  }, [refreshSocial]);
  /* eslint-enable react-hooks/set-state-in-effect */
   

  return { refreshSocial, social, socialLoading, socialMessage };
}
