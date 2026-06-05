import { useEffect, useState } from "react";
import { createCity, createHashtag, fetchCatalogs } from "../services/catalogService";
import type { CatalogCategory, CatalogCity, CatalogHashtag } from "../types/social";

export function useCatalogs(token?: string) {
  const [cities, setCities] = useState<CatalogCity[]>([]);
  const [hashtags, setHashtags] = useState<CatalogHashtag[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [catalogMessage, setCatalogMessage] = useState("");

  async function refreshCatalogs() {
    try {
      const data = await fetchCatalogs();
      setCities(data.cities);
      setHashtags(data.hashtags);
      setCategories(data.categories);
    } catch (error) {
      setCatalogMessage(error instanceof Error ? error.message : "No se pudieron cargar catalogos");
    }
  }

  async function addHashtag(input: { nombre: string; descripcion?: string; categoriaId?: string }) {
    if (!token) return false;
    await createHashtag(token, input);
    await refreshCatalogs();
    return true;
  }

  async function addCity(input: { nombre: string; estado?: string; pais?: string }) {
    if (!token) return false;
    await createCity(token, input);
    await refreshCatalogs();
    return true;
  }

   
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void refreshCatalogs();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
   

  return { addCity, addHashtag, catalogMessage, categories, cities, hashtags, refreshCatalogs };
}
