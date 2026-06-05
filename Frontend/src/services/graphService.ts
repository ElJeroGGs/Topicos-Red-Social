import { apiRequest, ApiError } from "./http";
import type { GraphSnapshot } from "../types/social";

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

async function graphQL<T>(query: string) {
  const response = await apiRequest<GraphQLResponse<T>>("/graphql", {
    method: "POST",
    headers: {
      "apollo-require-preflight": "true",
    },
    body: JSON.stringify({ query }),
  });

  if (response.errors?.length) {
    throw new ApiError(response.errors[0].message);
  }

  return response.data;
}

export async function fetchGraphSnapshot() {
  const query = `
    query GraphSnapshot {
      usuarios(limit: 8) {
        id
        username
        nombre
        apellido
        bio
        foto_perfil_url
        status
        grupos {
          id
          nombre
        }
        ciudadActual {
          nombre
          estado
          pais
        }
      }
      publicacions(limit: 8) {
        id
        contenido
        tipo_contenido
        visibilidad
        status
        autor {
          id
          username
          nombre
          apellido
        }
        hashtags {
          nombre
        }
        ciudad {
          nombre
          estado
        }
      }
      comentarios(limit: 8) {
        id
        contenido
        status
        autor {
          username
          nombre
          apellido
        }
        publicacion {
          id
          contenido
        }
      }
      grupos(limit: 8) {
        id
        nombre
        descripcion
        privacidad
        status
        miembros {
          id
          username
        }
      }
      eventos(limit: 8) {
        id
        titulo
        descripcion
        modalidad
        lugar
        capacidad
        status
        ciudad {
          nombre
          estado
        }
        asistentes {
          id
          username
        }
        organizadores {
          id
          username
        }
      }
      hashtags(limit: 8) {
        id
        nombre
        descripcion
        categorias {
          nombre
        }
        publicaciones {
          id
        }
      }
      categorias(limit: 8) {
        id
        nombre
        descripcion
        categoriaPadre {
          id
          nombre
        }
        subcategorias {
          id
          nombre
        }
      }
      ciudads(limit: 8) {
        id
        nombre
        estado
        pais
        residentes {
          id
        }
        publicaciones {
          id
        }
        eventos {
          id
        }
      }
    }
  `;

  const data = await graphQL<GraphSnapshot>(query);

  return {
    usuarios: data?.usuarios ?? [],
    publicacions: data?.publicacions ?? [],
    comentarios: data?.comentarios ?? [],
    grupos: data?.grupos ?? [],
    eventos: data?.eventos ?? [],
    hashtags: data?.hashtags ?? [],
    categorias: data?.categorias ?? [],
    ciudads: data?.ciudads ?? [],
  };
}
