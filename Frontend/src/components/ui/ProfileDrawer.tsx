import { useEffect, useRef } from "react";
import { X, UserRound, MapPin, Users, Calendar, FileText } from "lucide-react";
import type { PublicUserProfile, EntityGroup, EntityEvent, FeedPost } from "../../types/social";

interface ProfileDrawerProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onFollow: (id: string) => Promise<boolean>;
  profileId: string | null;
  social: PublicUserProfile | null;
  token: string;
}

export function ProfileDrawer({
  isOpen,
  isLoading,
  onClose,
  onFollow,
  profileId,
  social,
  token,
}: ProfileDrawerProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    // Prevent body scroll when drawer is open
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const profile = social?.profile ?? {};
  const showContent = !isLoading && !!social && !!profileId;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`profile-drawer-backdrop ${isOpen ? "open" : ""}`}
        role="presentation"
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div
        className={`profile-drawer-panel ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Perfil de usuario"
      >
        {/* Header */}
        <div className="profile-drawer-header">
          <div className="profile-drawer-title">
            <UserRound size={18} />
            <span>Perfil público</span>
          </div>
          <button
            type="button"
            className="profile-drawer-close"
            onClick={onClose}
            aria-label="Cerrar panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="profile-drawer-body">
          {/* Loading */}
          {(isLoading || (!social && profileId)) && (
            <div className="profile-drawer-loading">
              <div className="drawer-spinner" />
              <span>Cargando perfil...</span>
            </div>
          )}

          {/* Content */}
          {showContent && (
            <>
              {/* === Hero Banner === */}
              <div className="drawer-hero-banner">
                <div className="drawer-avatar-ring">
                  {profile.foto_perfil_url ? (
                    <img src={profile.foto_perfil_url} alt={profile.username ?? "avatar"} />
                  ) : (
                    <UserRound size={40} strokeWidth={1.5} />
                  )}
                </div>
                <div className="drawer-hero-info">
                  <h2 className="drawer-username">@{profile.username ?? "usuario"}</h2>
                  {(profile.nombre || profile.apellido) && (
                    <p className="drawer-fullname">
                      {[profile.nombre, profile.apellido].filter(Boolean).join(" ")}
                    </p>
                  )}
                  {profile.bio && (
                    <p className="drawer-bio">"{profile.bio}"</p>
                  )}
                </div>
              </div>

              {/* === Stats strip === */}
              <div className="drawer-stats-strip">
                <div className="drawer-stat">
                  <span className="drawer-stat-value">{social.followersCount ?? 0}</span>
                  <span className="drawer-stat-label">Seguidores</span>
                </div>
                <div className="drawer-stat-divider" />
                <div className="drawer-stat">
                  <span className="drawer-stat-value">{social.followingCount ?? 0}</span>
                  <span className="drawer-stat-label">Siguiendo</span>
                </div>
                <div className="drawer-stat-divider" />
                <div className="drawer-stat">
                  <span className="drawer-stat-value">{social.publicaciones?.length ?? 0}</span>
                  <span className="drawer-stat-label">Posts</span>
                </div>
              </div>

              {/* === Location === */}
              {profile.ciudadActual?.nombre && (
                <div className="drawer-info-row">
                  <MapPin size={14} />
                  <span>{profile.ciudadActual.nombre}</span>
                </div>
              )}

              {/* === Follow button === */}
              {token && profileId && (
                <button
                  type="button"
                  className="drawer-follow-btn"
                  onClick={() => void onFollow(profileId)}
                >
                  Seguir
                </button>
              )}

              {/* === Posts === */}
              {(social.publicaciones?.length ?? 0) > 0 && (
                <div className="drawer-section">
                  <div className="drawer-section-header">
                    <FileText size={15} />
                    <h3>Publicaciones</h3>
                  </div>
                  <div className="drawer-posts-list">
                    {(social.publicaciones as FeedPost[]).slice(0, 5).map((post) => (
                      <div key={post.id} className="drawer-post-card">
                        <p className="drawer-post-content">{post.contenido}</p>
                        <div className="drawer-post-meta">
                          {post.ciudad?.nombre && (
                            <span className="drawer-post-tag">{post.ciudad.nombre}</span>
                          )}
                          {(post.hashtags ?? []).slice(0, 3).map((tag) => {
                            const name = typeof tag === "string" ? tag : tag.nombre;
                            return (
                              <span key={name} className="drawer-post-tag hashtag">
                                #{name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* === Groups === */}
              {(social.grupos?.length ?? 0) > 0 && (
                <div className="drawer-section">
                  <div className="drawer-section-header">
                    <Users size={15} />
                    <h3>Grupos</h3>
                  </div>
                  <div className="drawer-chips">
                    {(social.grupos as EntityGroup[]).slice(0, 8).map((g) => (
                      <span key={g.id} className="drawer-chip">{g.nombre}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* === Events === */}
              {(social.eventos?.length ?? 0) > 0 && (
                <div className="drawer-section">
                  <div className="drawer-section-header">
                    <Calendar size={15} />
                    <h3>Eventos</h3>
                  </div>
                  <div className="drawer-chips">
                    {(social.eventos as EntityEvent[]).slice(0, 8).map((e) => (
                      <span key={e.id} className="drawer-chip">{e.titulo}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
