export type SessionUser = {
  id: string;
  username: string;
  nombre: string;
  apellido: string;
  correo: string;
  bio?: string;
  foto_perfil_url?: string;
  status?: string;
};

export type UserSuggestion = Pick<
  SessionUser,
  "id" | "username" | "nombre" | "apellido" | "bio" | "foto_perfil_url"
> & {
  postsCount: number;
  followersCount: number;
};

export type FeedPost = {
  id: string;
  contenido: string;
  tipo_contenido?: string;
  visibilidad?: string;
  status?: string;
  fecha_creacion?: string;
  autor?: Partial<SessionUser>;
  hashtags: string[];
  comentariosCount: number;
  reaccionesCount: number;
  guardadosCount: number;
  compartidosCount: number;
  reacciono?: boolean;
  guardado?: boolean;
  compartido?: boolean;
  ciudad?: { id: string; nombre: string; estado?: string; pais?: string };
};

export type PostComment = {
  id: string;
  contenido: string;
  status?: string;
  autor?: Partial<SessionUser>;
  reaccionesCount?: number;
  respuestasCount?: number;
};

export type LoginInput = {
  correo: string;
  password: string;
};

export type RegisterInput = {
  username: string;
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
};

export type AuthMode = "login" | "register";

export type EntityUser = Pick<
  SessionUser,
  "id" | "username" | "nombre" | "apellido" | "bio" | "foto_perfil_url" | "status"
> & {
  grupos?: { id: string; nombre: string }[];
  ciudadActual?: { nombre: string; estado?: string; pais?: string };
};

export type EntityPost = {
  id: string;
  contenido: string;
  tipo_contenido?: string;
  visibilidad?: string;
  status?: string;
  autor?: Pick<SessionUser, "id" | "username" | "nombre" | "apellido">;
  hashtags?: { nombre: string }[];
  ciudad?: { nombre: string; estado?: string };
};

export type EntityComment = {
  id: string;
  contenido: string;
  status?: string;
  autor?: Pick<SessionUser, "username" | "nombre" | "apellido">;
  publicacion?: { id: string; contenido: string };
};

export type EntityGroup = {
  id: string;
  nombre: string;
  descripcion?: string;
  privacidad?: string;
  status?: string;
  miembros?: Pick<SessionUser, "id" | "username">[];
  miembrosCount?: number;
  admins?: Pick<SessionUser, "id" | "username">[];
};

export type EntityEvent = {
  id: string;
  titulo: string;
  descripcion?: string;
  modalidad?: string;
  lugar?: string;
  capacidad?: number;
  status?: string;
  ciudad?: { nombre: string; estado?: string };
  asistentes?: Pick<SessionUser, "id" | "username">[];
  asistentesCount?: number;
  organizadores?: Pick<SessionUser, "id" | "username">[];
};

export type EntityHashtag = {
  id: string;
  nombre: string;
  descripcion?: string;
  categorias?: { nombre: string }[];
  publicaciones?: { id: string }[];
};

export type EntityCategory = {
  id: string;
  nombre: string;
  descripcion?: string;
  subcategorias?: { id: string; nombre: string }[];
  categoriaPadre?: { id: string; nombre: string };
};

export type EntityCity = {
  id: string;
  nombre: string;
  estado?: string;
  pais?: string;
  residentes?: { id: string }[];
  publicaciones?: { id: string }[];
  eventos?: { id: string }[];
};

export type GraphSnapshot = {
  usuarios: EntityUser[];
  publicacions: EntityPost[];
  comentarios: EntityComment[];
  grupos: EntityGroup[];
  eventos: EntityEvent[];
  hashtags: EntityHashtag[];
  categorias: EntityCategory[];
  ciudads: EntityCity[];
};

export type CatalogCity = {
  id: string;
  nombre: string;
  estado?: string;
  pais?: string;
};

export type CatalogHashtag = {
  id: string;
  nombre: string;
  descripcion?: string;
  categorias?: { id: string; nombre: string }[];
};

export type CatalogCategory = {
  id: string;
  nombre: string;
  descripcion?: string;
  subcategorias?: { id: string; nombre: string }[];
};

export type UserSocialSummary = {
  profile: Partial<SessionUser> & {
    ciudadActual?: CatalogCity;
    ciudadNacimiento?: CatalogCity;
  };
  grupos: EntityGroup[];
  eventosAsiste: EntityEvent[];
  eventosGuardados: EntityEvent[];
  eventosOrganizados: EntityEvent[];
  publicacionesGuardadas: FeedPost[];
  publicacionesCompartidas: FeedPost[];
  siguiendo: UserSuggestion[];
  seguidores: UserSuggestion[];
  bloqueados: Pick<SessionUser, "id" | "username" | "nombre" | "apellido">[];
};

export type PublicUserProfile = {
  profile: Partial<SessionUser> & {
    ciudadActual?: CatalogCity;
    ciudadNacimiento?: CatalogCity;
  };
  followersCount: number;
  followingCount: number;
  publicaciones: FeedPost[];
  grupos: EntityGroup[];
  eventos: EntityEvent[];
};
