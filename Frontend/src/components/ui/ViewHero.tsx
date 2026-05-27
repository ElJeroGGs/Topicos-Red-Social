import type { ReactNode } from "react";

const HERO_IMAGES: Record<string, string> = {
  explorar:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
  grupos:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80",
  eventos:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80",
  perfil:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
  perfil_publico:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80",
  inicio:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
};

const HERO_ACCENTS: Record<string, string> = {
  explorar:  "linear-gradient(135deg, rgba(16,185,129,0.75) 0%, rgba(6,182,212,0.6) 100%)",
  grupos:    "linear-gradient(135deg, rgba(139,92,246,0.75) 0%, rgba(217,119,6,0.5) 100%)",
  eventos:   "linear-gradient(135deg, rgba(245,158,11,0.75) 0%, rgba(239,68,68,0.5) 100%)",
  perfil:    "linear-gradient(135deg, rgba(16,185,129,0.7) 0%, rgba(217,119,6,0.6) 100%)",
  perfil_publico: "linear-gradient(135deg, rgba(99,102,241,0.7) 0%, rgba(16,185,129,0.5) 100%)",
  inicio:    "linear-gradient(135deg, rgba(16,185,129,0.65) 0%, rgba(99,102,241,0.5) 100%)",
};

export function ViewHero({
  eyebrow,
  icon,
  title,
  variant,
}: {
  eyebrow: string;
  icon: ReactNode;
  title: string;
  variant?: string;
}) {
  const img = variant ? HERO_IMAGES[variant] : undefined;
  const accent = variant ? HERO_ACCENTS[variant] : undefined;

  if (img) {
    return (
      <div className="entity-hero entity-hero--cover">
        {/* Background image */}
        <div
          className="entity-hero-bg"
          style={{ backgroundImage: `url(${img})` }}
        />
        {/* Gradient overlay */}
        <div className="entity-hero-overlay" style={{ background: accent }} />
        {/* Decorative floating orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        {/* Content */}
        <div className="entity-hero-content">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <div className="entity-hero-icon">{icon}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="entity-hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {icon}
    </div>
  );
}
