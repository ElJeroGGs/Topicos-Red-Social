import { apiRequest } from "./http";
import type { CatalogCategory, CatalogCity, CatalogHashtag } from "../types/social";

export async function fetchCatalogs() {
  const [cities, hashtags, categories] = await Promise.all([
    apiRequest<{ data: CatalogCity[] }>("/api/catalogos/ciudades"),
    apiRequest<{ data: CatalogHashtag[] }>("/api/catalogos/hashtags"),
    apiRequest<{ data: CatalogCategory[] }>("/api/catalogos/categorias"),
  ]);

  return {
    cities: cities.data,
    hashtags: dedupeHashtags(hashtags.data),
    categories: categories.data,
  };
}

export async function createHashtag(token: string, input: { nombre: string; descripcion?: string; categoriaId?: string }) {
  return apiRequest<{ message: string; hashtag: CatalogHashtag }>("/api/catalogos/hashtags", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
}

export async function createCity(token: string, input: { nombre: string; estado?: string; pais?: string }) {
  return apiRequest<{ message: string; ciudad: CatalogCity }>("/api/catalogos/ciudades", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
}

function dedupeHashtags(hashtags: CatalogHashtag[]) {
  const unique = new Map<string, CatalogHashtag>();

  for (const hashtag of hashtags) {
    const key = hashtag.nombre.trim().toLowerCase();
    if (!unique.has(key)) unique.set(key, hashtag);
  }

  return [...unique.values()];
}
