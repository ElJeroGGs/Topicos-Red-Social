import { useCallback, useEffect, useState } from "react";
import { fetchGraphSnapshot } from "../services/graphService";
import type { GraphSnapshot } from "../types/social";

const emptySnapshot: GraphSnapshot = {
  usuarios: [],
  publicacions: [],
  comentarios: [],
  grupos: [],
  eventos: [],
  hashtags: [],
  categorias: [],
  ciudads: [],
};

export function useGraphSnapshot() {
  const [snapshot, setSnapshot] = useState<GraphSnapshot>(emptySnapshot);
  const [graphLoading, setGraphLoading] = useState(true);
  const [graphMessage, setGraphMessage] = useState("");

  const refreshGraph = useCallback(async () => {
    setGraphLoading(true);
    setGraphMessage("");

    try {
      const data = await fetchGraphSnapshot();
      setSnapshot(data);
    } catch (error) {
      setGraphMessage(error instanceof Error ? error.message : "No se pudo cargar el grafo");
    } finally {
      setGraphLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(refreshGraph);
  }, [refreshGraph]);

  return { graphLoading, graphMessage, refreshGraph, snapshot };
}
