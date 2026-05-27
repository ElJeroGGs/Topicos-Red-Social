import { useCallback, useEffect, useState } from "react";
import { fetchUserSuggestions, followUser } from "../services/userService";
import type { UserSuggestion } from "../types/social";

export function useUserSuggestions(token?: string, onFollowSuccess?: () => Promise<void> | void) {
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [followingId, setFollowingId] = useState("");
  const [suggestionsMessage, setSuggestionsMessage] = useState("");

  const refreshSuggestions = useCallback(async () => {
    if (!token) {
      setSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    setSuggestionsMessage("");

    try {
      const data = await fetchUserSuggestions(token);
      setSuggestions(data);
    } catch (error) {
      setSuggestionsMessage(error instanceof Error ? error.message : "No se pudieron cargar sugerencias");
    } finally {
      setLoadingSuggestions(false);
    }
  }, [token]);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (active) {
        void refreshSuggestions();
      }
    });

    return () => {
      active = false;
    };
  }, [refreshSuggestions]);

  async function followSuggestion(userId: string) {
    if (!token) {
      setSuggestionsMessage("Inicia sesion para seguir usuarios");
      return;
    }

    setFollowingId(userId);
    setSuggestionsMessage("");

    try {
      await followUser(token, userId);
      setSuggestions((currentSuggestions) => currentSuggestions.filter((suggestion) => suggestion.id !== userId));
      await onFollowSuccess?.();
    } catch (error) {
      setSuggestionsMessage(error instanceof Error ? error.message : "No se pudo seguir al usuario");
    } finally {
      setFollowingId("");
    }
  }

  return {
    followingId,
    followSuggestion,
    loadingSuggestions,
    refreshSuggestions,
    suggestions,
    suggestionsMessage,
  };
}
