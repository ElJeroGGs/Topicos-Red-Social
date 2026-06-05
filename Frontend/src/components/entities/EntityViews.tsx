import {
  CalendarDays,
  Compass,
  MapPin,
  Search,
  Shield,
  UsersRound,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type {
  CatalogCategory,
  CatalogCity,
  CatalogHashtag,
  EntityEvent,
  EntityGroup,
  FeedPost,
  GraphSnapshot,
  PublicUserProfile,
  UserSocialSummary,
} from "../../types/social";
import { fetchPublicPosts } from "../../services/feedService";
import { Avatar } from "../ui/Avatar";
import { SavedList } from "../ui/SavedList";
import { ViewHero } from "../ui/ViewHero";

function getGroupBanner(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("tech") || n.includes("program") || n.includes("code") || n.includes("datos") || n.includes("grafo") || n.includes("web") || n.includes("soft")) {
    return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60";
  }
  if (n.includes("game") || n.includes("juego") || n.includes("play") || n.includes("geek") || n.includes("console") || n.includes("retro")) {
    return "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=60";
  }
  if (n.includes("musica") || n.includes("band") || n.includes("rock") || n.includes("arte") || n.includes("cine") || n.includes("sound")) {
    return "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60";
  }
  if (n.includes("deporte") || n.includes("gym") || n.includes("fit") || n.includes("run") || n.includes("futbol") || n.includes("salud")) {
    return "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60";
  }
  if (n.includes("libro") || n.includes("estud") || n.includes("tarea") || n.includes("univers") || n.includes("ciencia") || n.includes("lectura")) {
    return "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60";
  }
  return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60";
}

function getEventBanner(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("confer") || t.includes("tech") || t.includes("tall") || t.includes("hack") || t.includes("datos") || t.includes("charla")) {
    return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop&q=60";
  }
  if (t.includes("fiest") || t.includes("party") || t.includes("reun") || t.includes("social") || t.includes("conviv") || t.includes("almuer")) {
    return "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=60";
  }
  if (t.includes("concert") || t.includes("musical") || t.includes("festiv") || t.includes("show") || t.includes("banda")) {
    return "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=60";
  }
  return "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&auto=format&fit=crop&q=60";
}

export function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="metric-box">
      <span className="metric-value">{value}</span>
      <span className="metric-label">{label}</span>
    </div>
  );
}

export function SegmentedControl({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="segmented-control">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`segment-btn ${active === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// === Explore View ===
export function ExploreView({
  cities,
  feedPosts,
  hashtags,
  onOpenUser,
  snapshot,
}: {
  cities: CatalogCity[];
  feedPosts: FeedPost[];
  hashtags: CatalogHashtag[];
  onOpenUser?: (userId: string) => void;
  snapshot: GraphSnapshot;
}) {
  const [cityFilter, setCityFilter] = useState("");
  const [hashtagFilter, setHashtagFilter] = useState("");
  const [globalPosts, setGlobalPosts] = useState<FeedPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active) return;
      setIsSearching(true);
      setSearchMessage("");
    });

    fetchPublicPosts({
      ciudad: cityFilter || undefined,
      hashtag: hashtagFilter || undefined,
      search: searchQuery || undefined,
    })
      .then((posts) => {
        if (active) setGlobalPosts(posts);
      })
      .catch((error) => {
        if (active) setSearchMessage(error instanceof Error ? error.message : "No se pudo buscar publicaciones");
      })
      .finally(() => {
        if (active) setIsSearching(false);
      });

    return () => {
      active = false;
    };
  }, [cityFilter, hashtagFilter, searchQuery]);

  const allPosts = new Map<string, FeedPost | GraphSnapshot["publicacions"][number]>();
  globalPosts.forEach((post) => allPosts.set(post.id, post));
  feedPosts.forEach((post) => allPosts.set(post.id, post));
  snapshot.publicacions.forEach((post) => {
    if (!allPosts.has(post.id)) allPosts.set(post.id, post);
  });

  const normalizedSearch = normalizeText(searchQuery);

  const filteredPosts = [...allPosts.values()].filter((post) => {
    const postTags = (post.hashtags ?? []).map((tag) => (typeof tag === "string" ? tag : tag.nombre));

    if (cityFilter && post.ciudad?.nombre !== cityFilter) return false;
    if (hashtagFilter && !postTags.some((tag) => normalizeText(tag) === normalizeText(hashtagFilter))) return false;
    if (
      normalizedSearch &&
      !normalizeText(post.contenido).includes(normalizedSearch) &&
      !normalizeText(post.autor?.username ?? "").includes(normalizedSearch) &&
      !normalizeText(post.ciudad?.nombre ?? "").includes(normalizedSearch) &&
      !postTags.some((tag) => normalizeText(tag).includes(normalizedSearch))
    ) {
      return false;
    }
    return true;
  });

  // Users matching the search query from the graph snapshot
  const matchedUsers = normalizedSearch
    ? snapshot.usuarios.filter(
        (u) =>
          normalizeText(u.username ?? "").includes(normalizedSearch) ||
          normalizeText(u.nombre ?? "").includes(normalizedSearch) ||
          normalizeText(u.apellido ?? "").includes(normalizedSearch),
      )
    : [];

  return (
    <section className="entity-view">
      <ViewHero eyebrow="Descubrimiento" title="Explorar" icon={<Compass size={30} />} variant="explorar" />

      <div className="discovery-filters">
        <label className="search-input">
          <Search size={18} />
          <input
            placeholder="Buscar publicaciones o usuarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
          <option value="">Todas las ciudades</option>
          {cities.map((city) => (
            <option key={city.id} value={city.nombre}>
              {city.nombre}
            </option>
          ))}
        </select>
        <select value={hashtagFilter} onChange={(e) => setHashtagFilter(e.target.value)}>
          <option value="">Filtrar por hashtag</option>
          {hashtags.map((tag) => (
            <option key={tag.id} value={tag.nombre}>
              #{tag.nombre}
            </option>
          ))}
        </select>
        <button
          className="filter-clear-btn"
          type="button"
          disabled={!cityFilter && !hashtagFilter && !searchQuery}
          onClick={() => {
            setCityFilter("");
            setHashtagFilter("");
            setSearchQuery("");
          }}
        >
          Limpiar
        </button>
      </div>

      <div className="discovery-grid">
        <div className="feed-list">
          {matchedUsers.length > 0 && (
            <>
              <h3>Usuarios encontrados</h3>
              <div className="explore-users-list">
                {matchedUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className="explore-user-card"
                    onClick={() => onOpenUser?.(user.id)}
                  >
                    <div className="explore-user-avatar">
                      {user.foto_perfil_url ? (
                        <img src={user.foto_perfil_url} alt={user.username} />
                      ) : (
                        <UserRound size={22} />
                      )}
                    </div>
                    <div className="explore-user-info">
                      <strong>@{user.username}</strong>
                      <span>{[user.nombre, user.apellido].filter(Boolean).join(" ")}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          <h3>Publicaciones recientes</h3>
          {filteredPosts.map((post) => (
            <article key={post.id} className="explore-post-card">
              <div className="explore-post-author">
                <div
                  className={post.autor?.id && onOpenUser ? "explore-post-avatar clickable" : "explore-post-avatar"}
                  role={post.autor?.id && onOpenUser ? "button" : undefined}
                  tabIndex={post.autor?.id && onOpenUser ? 0 : undefined}
                  onClick={() => post.autor?.id && onOpenUser?.(post.autor.id)}
                  onKeyDown={(e) => e.key === "Enter" && post.autor?.id && onOpenUser?.(post.autor.id)}
                >
                  <Avatar user={post.autor} size="sm" />
                </div>
                <div className="explore-post-author-info">
                  {post.autor?.id && onOpenUser ? (
                    <button
                      type="button"
                      className="post-author-link"
                      onClick={() => onOpenUser(post.autor!.id!)}
                    >
                      @{post.autor.username}
                    </button>
                  ) : (
                    <strong className="post-author-name">@{post.autor?.username}</strong>
                  )}
                  {post.ciudad?.nombre && (
                    <span className="explore-post-city">{post.ciudad.nombre}</span>
                  )}
                </div>
              </div>
              <p className="explore-post-content">{post.contenido}</p>
              {(post.hashtags ?? []).length > 0 && (
                <div className="post-tags">
                  {(post.hashtags ?? []).slice(0, 4).map((tag) => {
                    const tagName = typeof tag === "string" ? tag : tag.nombre;
                    return <span key={`${post.id}-${tagName}`}>#{tagName}</span>;
                  })}
                </div>
              )}
            </article>
          ))}
          {!filteredPosts.length && <p className="status-message">No se encontraron resultados</p>}
        </div>
        
        <div className="trending-panel">
          <h3>Tendencias</h3>
          <div className="hashtag-cloud">
            {hashtags.slice(0, 10).map((tag) => (
              <button key={tag.id} className="hashtag-pill" onClick={() => setHashtagFilter(tag.nombre)}>
                #{tag.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>
      {isSearching && <p className="status-message">Buscando en Neo4j...</p>}
      {searchMessage && <p className="status-message">{searchMessage}</p>}
    </section>
  );
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

// === Groups View ===
export function GroupsView({
  groups,
  myGroups,
  onCreateGroup,
  onJoinGroup,
  token,
}: {
  groups: EntityGroup[];
  myGroups: EntityGroup[];
  onCreateGroup: (input: { nombre: string; descripcion?: string; privacidad?: string }) => Promise<boolean>;
  onJoinGroup: (groupId: string) => Promise<boolean>;
  token: string;
}) {
  const [activeTab, setActiveTab] = useState<"mis-grupos" | "explorar">("mis-grupos");
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupPrivacy, setGroupPrivacy] = useState("publico");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await onCreateGroup({ nombre: groupName, descripcion: groupDesc, privacidad: groupPrivacy });
    if (success) {
      setGroupName("");
      setGroupDesc("");
      setActiveTab("mis-grupos");
    }
  }

  const visibleGroups = activeTab === "mis-grupos" ? myGroups : groups;
  const myGroupIds = new Set(myGroups.map((group) => group.id));

  return (
    <section className="entity-view">
      <ViewHero eyebrow="Comunidades" title="Grupos" icon={<UsersRound size={30} />} variant="grupos" />

      <form className="entity-form horizontal" onSubmit={handleSubmit}>
        <input disabled={!token} placeholder="Nombre del grupo" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
        <input disabled={!token} placeholder="Descripcion" value={groupDesc} onChange={(e) => setGroupDesc(e.target.value)} />
        <select disabled={!token} value={groupPrivacy} onChange={(e) => setGroupPrivacy(e.target.value)}>
          <option value="publico">Publico</option>
          <option value="privado">Privado</option>
        </select>
        <button type="submit" disabled={!token || !groupName.trim()}>
          Crear grupo
        </button>
      </form>

      <SegmentedControl
        tabs={[{ id: "mis-grupos", label: "Mis grupos" }, { id: "explorar", label: "Explorar" }]}
        active={activeTab}
        onChange={(val) => setActiveTab(val as "mis-grupos" | "explorar")}
      />

      <div className="entity-grid">
        {visibleGroups.map((group) => (
          <article key={group.id} className="entity-card has-banner">
            <div className="entity-card-banner">
              <img src={getGroupBanner(group.nombre)} alt={group.nombre} />
            </div>
            <div className="card-content">
              <div className="card-header">
                <h3>{group.nombre}</h3>
                <span className="badge">{group.privacidad}</span>
              </div>
              <p>{group.descripcion}</p>
              <div className="card-footer">
                <span>{group.miembrosCount ?? 0} miembros</span>
              </div>
              {activeTab === "explorar" && (
                <div className="entity-actions">
                  <button
                    type="button"
                    disabled={!token || myGroupIds.has(group.id)}
                    onClick={() => void onJoinGroup(group.id)}
                  >
                    {myGroupIds.has(group.id) ? "Ya perteneces" : "Unirme"}
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
        {!visibleGroups.length && <p className="status-message">No se encontraron grupos</p>}
      </div>
    </section>
  );
}

// === Events View ===
export function EventsView({
  cities,
  events,
  onAttendEvent,
  onCreateEvent,
  onSaveEvent,
  social,
  token,
}: {
  cities: CatalogCity[];
  events: EntityEvent[];
  onAttendEvent: (eventId: string) => Promise<boolean>;
  onCreateEvent: (input: { titulo: string; descripcion?: string; modalidad?: string; ciudadId?: string }) => Promise<boolean>;
  onSaveEvent: (eventId: string) => Promise<boolean>;
  social: UserSocialSummary | null;
  token: string;
}) {
  const [activeTab, setActiveTab] = useState<"agenda" | "guardados" | "explorar">("agenda");
  const [eventCityFilter, setEventCityFilter] = useState("");
  const [eventCityId, setEventCityId] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await onCreateEvent({
      titulo: eventName,
      descripcion: eventDesc,
      modalidad: "presencial",
      ciudadId: eventCityId || undefined,
    });
    if (success) {
      setEventName("");
      setEventDesc("");
      setEventCityId("");
    }
  }

  const getVisibleEvents = () => {
    if (activeTab === "agenda") return social?.eventosAsiste ?? [];
    if (activeTab === "guardados") return social?.eventosGuardados ?? [];
    return events.filter((eventItem) => !eventCityFilter || eventItem.ciudad?.nombre === eventCityFilter);
  };

  const visibleEvents = getVisibleEvents();
  const attendingEventIds = new Set((social?.eventosAsiste ?? []).map((eventItem) => eventItem.id));
  const savedEventIds = new Set((social?.eventosGuardados ?? []).map((eventItem) => eventItem.id));

  return (
    <section className="entity-view">
      <ViewHero eyebrow="Agenda" title={activeTab === 'explorar' ? 'Descubrir eventos' : 'Eventos para ti'} icon={<CalendarDays size={30} />} variant="eventos" />

      <div className="metrics-row">
        <Metric label="Iras" value={social?.eventosAsiste.length ?? 0} />
        <Metric label="Guardados" value={social?.eventosGuardados.length ?? 0} />
        <Metric label="Organizas" value={social?.eventosOrganizados.length ?? 0} />
      </div>

      <form className="entity-form horizontal" onSubmit={handleSubmit}>
        <input disabled={!token} placeholder="Titulo del evento" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        <input disabled={!token} placeholder="Descripcion" value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} />
        <select disabled={!token} value={eventCityId} onChange={(e) => setEventCityId(e.target.value)}>
          <option value="">Sin ciudad</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.nombre}
            </option>
          ))}
        </select>
        <button type="submit" disabled={!token || !eventName.trim()}>
          Crear evento
        </button>
      </form>

      <div className="filters-row">
        <SegmentedControl
          tabs={[
            { id: "agenda", label: "Mi agenda" },
            { id: "guardados", label: "Guardados" },
            { id: "explorar", label: "Explorar" }
          ]}
          active={activeTab}
          onChange={(val) => setActiveTab(val as "agenda" | "guardados" | "explorar")}
        />
        {activeTab === 'explorar' && (
          <select value={eventCityFilter} onChange={(e) => setEventCityFilter(e.target.value)}>
            <option value="">Todas las ciudades</option>
            {cities.map((city) => (
              <option key={city.id} value={city.nombre}>
                {city.nombre}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="entity-grid">
        {visibleEvents.map((event) => (
          <article key={event.id} className="entity-card has-banner">
            <div className="entity-card-banner">
              <img src={getEventBanner(event.titulo)} alt={event.titulo} />
            </div>
            <div className="card-content">
              <div className="card-header">
                <h3>{event.titulo}</h3>
                <span className="badge">{event.modalidad}</span>
              </div>
              <p>{event.descripcion}</p>
              <div className="card-footer">
                <span><MapPin size={14} /> {event.ciudad?.nombre ?? "Online"}</span>
                <span>{event.capacidad ?? "Sin limite"} lugares</span>
              </div>
              {/* entity-actions inside card-content */}
              <div className="entity-actions">
                <button
                  type="button"
                  disabled={!token || attendingEventIds.has(event.id)}
                  onClick={() => void onAttendEvent(event.id)}
                >
                  {attendingEventIds.has(event.id) ? "Asistiras" : "Asistir"}
                </button>
                <button
                  type="button"
                  className="secondary-action"
                  disabled={!token || savedEventIds.has(event.id)}
                  onClick={() => void onSaveEvent(event.id)}
                >
                  {savedEventIds.has(event.id) ? "Guardado" : "Guardar"}
                </button>
              </div>
            </div>
          </article>
        ))}
        {!visibleEvents.length && <p className="status-message">No se encontraron eventos</p>}
      </div>
    </section>
  );
}

// === Profile View ===
export function ProfileView({
  categories,
  cities,
  onBlockUser,
  onConnectProfileCities,
  onCreateCity,
  onCreateHashtag,
  onUpdateProfile,
  snapshot,
  social,
  socialLoading,
  socialMessage,
  token,
}: {
  categories: CatalogCategory[];
  cities: CatalogCity[];
  onBlockUser: (userId: string) => Promise<boolean>;
  onConnectProfileCities: (input: { ciudadActualId?: string; ciudadNacimientoId?: string }) => Promise<boolean>;
  onCreateCity: (input: { nombre: string; estado?: string; pais?: string }) => Promise<boolean>;
  onCreateHashtag: (input: { nombre: string; descripcion?: string; categoriaId?: string }) => Promise<boolean>;
  onUpdateProfile: (input: { apellido?: string; bio?: string; foto_perfil_url?: string; nombre?: string }) => Promise<boolean>;
  snapshot: GraphSnapshot;
  social: UserSocialSummary | null;
  socialLoading: boolean;
  socialMessage: string;
  token: string;
}) {
  const [firstName, setFirstName] = useState(social?.profile.nombre ?? "");
  const [lastName, setLastName] = useState(social?.profile.apellido ?? "");
  const [bio, setBio] = useState(social?.profile.bio ?? "");
  const [photoUrl, setPhotoUrl] = useState(social?.profile.foto_perfil_url ?? "");
  const [actualCity, setActualCity] = useState("");
  const [bornCity, setBornCity] = useState("");
  const [blockedUser, setBlockedUser] = useState("");
  const [cityName, setCityName] = useState("");
  const [cityState, setCityState] = useState("");
  const [cityCountry, setCityCountry] = useState("Mexico");
  const [hashtagName, setHashtagName] = useState("");
  const [hashtagDescription, setHashtagDescription] = useState("");
  const [hashtagCategory, setHashtagCategory] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setFirstName(social?.profile.nombre ?? "");
      setLastName(social?.profile.apellido ?? "");
      setBio(social?.profile.bio ?? "");
      setPhotoUrl(social?.profile.foto_perfil_url ?? "");
    });
  }, [social?.profile.apellido, social?.profile.bio, social?.profile.foto_perfil_url, social?.profile.nombre]);

  async function submitProfileCities(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onConnectProfileCities({
      ciudadActualId: actualCity || undefined,
      ciudadNacimientoId: bornCity || undefined,
    });
  }

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onUpdateProfile({
      apellido: lastName,
      bio,
      foto_perfil_url: photoUrl,
      nombre: firstName,
    });
  }

  async function submitCity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await onCreateCity({ nombre: cityName, estado: cityState, pais: cityCountry });
    if (success) {
      setCityName("");
      setCityState("");
      setCityCountry("Mexico");
    }
  }

  async function submitHashtag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await onCreateHashtag({
      nombre: hashtagName.replace(/^#/, ""),
      descripcion: hashtagDescription,
      categoriaId: hashtagCategory || undefined,
    });
    if (success) {
      setHashtagName("");
      setHashtagDescription("");
      setHashtagCategory("");
    }
  }

  async function submitBlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await onBlockUser(blockedUser);
    if (success) {
      setBlockedUser("");
    }
  }

  return (
    <section className="entity-view">
      <ViewHero eyebrow="Tu cuenta" title="Perfil y actividad" icon={<UserRound size={30} />} variant="perfil" />

      {!token && <div className="entity-empty">Inicia sesion para ver tu perfil, agenda y guardados.</div>}
      {socialLoading && <p className="status-message">Cargando tu perfil...</p>}
      {socialMessage && <p className="status-message">{socialMessage}</p>}

      <div className="profile-overview">
        <article className="entity-card profile-summary">
          <UserRound size={26} />
          <div>
            <strong>@{social?.profile.username ?? "usuario"}</strong>
            <span>{[social?.profile.nombre, social?.profile.apellido].filter(Boolean).join(" ") || "Perfil Jerobook"}</span>
          </div>
          <p>
            Vive en {social?.profile.ciudadActual?.nombre ?? "sin ciudad definida"} · Nacio en{" "}
            {social?.profile.ciudadNacimiento?.nombre ?? "sin ciudad definida"}
          </p>
        </article>

        <Metric label="Siguiendo" value={social?.siguiendo.length ?? 0} />
        <Metric label="Seguidores" value={social?.seguidores.length ?? 0} />
        <Metric label="Guardados" value={social?.publicacionesGuardadas.length ?? 0} />
      </div>

      <div className="graph-action-grid">
        <form className="entity-form vertical" onSubmit={submitProfile}>
          <strong>Editar perfil</strong>
          <input disabled={!token} placeholder="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input disabled={!token} placeholder="Apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <input disabled={!token} placeholder="URL de foto" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
          <textarea disabled={!token} placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          <button type="submit" disabled={!token || !firstName.trim()}>
            Guardar cambios
          </button>
        </form>

        <form className="entity-form vertical" onSubmit={submitProfileCities}>
          <strong>Editar ubicacion</strong>
          <select disabled={!token} value={actualCity} onChange={(e) => setActualCity(e.target.value)}>
            <option value="">Ciudad actual</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>{city.nombre}</option>
            ))}
          </select>
          <select disabled={!token} value={bornCity} onChange={(e) => setBornCity(e.target.value)}>
            <option value="">Ciudad de nacimiento</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>{city.nombre}</option>
            ))}
          </select>
          <button type="submit" disabled={!token || (!actualCity && !bornCity)}>Guardar perfil</button>
        </form>

        <form className="entity-form vertical" onSubmit={submitCity}>
          <strong>Agregar ciudad</strong>
          <input disabled={!token} placeholder="Nombre" value={cityName} onChange={(e) => setCityName(e.target.value)} />
          <input disabled={!token} placeholder="Estado" value={cityState} onChange={(e) => setCityState(e.target.value)} />
          <input disabled={!token} placeholder="Pais" value={cityCountry} onChange={(e) => setCityCountry(e.target.value)} />
          <button type="submit" disabled={!token || !cityName.trim()}>Crear ciudad</button>
        </form>

        <form className="entity-form vertical" onSubmit={submitHashtag}>
          <strong>Crear tema</strong>
          <input disabled={!token} placeholder="#tema" value={hashtagName} onChange={(e) => setHashtagName(e.target.value)} />
          <input disabled={!token} placeholder="Descripcion" value={hashtagDescription} onChange={(e) => setHashtagDescription(e.target.value)} />
          <select disabled={!token} value={hashtagCategory} onChange={(e) => setHashtagCategory(e.target.value)}>
            <option value="">Categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.nombre}</option>
            ))}
          </select>
          <button type="submit" disabled={!token || !hashtagName.trim()}>Crear tema</button>
        </form>

        <form className="entity-form vertical" onSubmit={submitBlock}>
          <strong>Bloquear usuario</strong>
          <select disabled={!token} value={blockedUser} onChange={(e) => setBlockedUser(e.target.value)}>
            <option value="">Elegir usuario</option>
            {snapshot.usuarios.map((user) => (
              <option key={user.id} value={user.id}>@{user.username}</option>
            ))}
          </select>
          <button type="submit" disabled={!token || !blockedUser}>Bloquear</button>
        </form>
      </div>

      <div className="discovery-grid">
        <SavedList title="Publicaciones guardadas" posts={social?.publicacionesGuardadas ?? []} />
        <SavedList title="Publicaciones compartidas" posts={social?.publicacionesCompartidas ?? []} />
      </div>

      <section className="entity-section">
        <h3>Usuarios bloqueados</h3>
        <div className="mini-list">
          {(social?.bloqueados ?? []).map((user) => (
            <span key={user.id}>
              <Shield size={14} /> @{user.username}
            </span>
          ))}
          {!social?.bloqueados.length && <p className="status-message">No tienes usuarios bloqueados.</p>}
        </div>
      </section>
    </section>
  );
}

// === Public Profile View ===
export function PublicProfileView({
  onFollow,
  profileId,
  social,
  token,
}: {
  onFollow: (id: string) => Promise<boolean>;
  profileId: string | null;
  social: PublicUserProfile | null;
  token: string;
}) {
  if (!profileId) {
    return null;
  }

  if (!social) {
    return <div className="entity-empty">Cargando perfil...</div>;
  }

  const profile = social.profile ?? {};

  return (
    <section className="entity-view">
      <ViewHero eyebrow="Perfil publico" title={`@${profile.username ?? "usuario"}`} icon={<UserRound size={30} />} variant="perfil_publico" />

      <div className="profile-overview">
        <article className="entity-card profile-summary">
          <UserRound size={26} />
          <div>
            <strong>{[profile.nombre, profile.apellido].filter(Boolean).join(" ") || profile.username}</strong>
            <span>{profile.bio ?? "Usuario de Jerobook"}</span>
          </div>
          <p>
            Vive en {profile.ciudadActual?.nombre ?? "sin ciudad definida"} · {social.followersCount ?? 0} seguidores
          </p>
        </article>
        <Metric label="Publicaciones" value={social.publicaciones?.length ?? 0} />
        <Metric label="Grupos" value={social.grupos?.length ?? 0} />
        <Metric label="Eventos" value={social.eventos?.length ?? 0} />
      </div>

      {token && (
        <div className="entity-actions">
          <button type="button" onClick={() => void onFollow(profileId)}>
            Seguir
          </button>
        </div>
      )}

      <div className="discovery-grid">
        <SavedList title="Publicaciones" posts={social.publicaciones ?? []} />
        <section className="entity-section">
          <h3>Actividad</h3>
          <div className="mini-list">
            {(social.grupos ?? []).slice(0, 8).map((group: EntityGroup) => (
              <span key={group.id}>{group.nombre}</span>
            ))}
            {(social.eventos ?? []).slice(0, 8).map((event: EntityEvent) => (
              <span key={event.id}>{event.titulo}</span>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
