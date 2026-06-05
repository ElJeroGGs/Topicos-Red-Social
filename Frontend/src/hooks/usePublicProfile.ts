import { useCallback, useEffect, useState } from "react";
import { fetchPublicUserProfile } from "../services/userService";
import type { PublicUserProfile } from "../types/social";

export function usePublicProfile(userId?: string) {
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const refreshProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      return;
    }

    setProfileLoading(true);
    setProfileMessage("");

    try {
      const data = await fetchPublicUserProfile(userId);
      setProfile(data);
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : "No se pudo cargar el perfil");
    } finally {
      setProfileLoading(false);
    }
  }, [userId]);

   
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);
  /* eslint-enable react-hooks/set-state-in-effect */
   

  return { profile, profileLoading, profileMessage, refreshProfile };
}
