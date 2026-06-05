import { Send } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import type { CatalogCity, SessionUser } from "../../types/social";
import { Avatar } from "../ui/Avatar";

type ComposerProps = {
  cities: CatalogCity[];
  isLoggedIn: boolean;
  isPublishing: boolean;
  onPublish: (input: { contenido: string; ciudadId?: string; hashtagNames?: string[] }) => Promise<boolean>;
  user: SessionUser | null;
};

export function Composer({ cities, isLoggedIn, isPublishing, onPublish, user }: ComposerProps) {
  const [content, setContent] = useState("");
  const [cityId, setCityId] = useState("");
  const [hashtags, setHashtags] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const success = await onPublish({
      contenido: content,
      ciudadId: cityId || undefined,
      hashtagNames: hashtags
        .split(",")
        .map((tag) => tag.replace("#", "").trim())
        .filter(Boolean),
    });

    if (success) {
      setContent("");
      setHashtags("");
    }
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <Avatar user={user} />
      <div className="composer-body">
        <textarea
          disabled={!isLoggedIn || isPublishing}
          maxLength={500}
          placeholder={isLoggedIn ? "Comparte algo con Jerobook" : "Inicia sesion para publicar"}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <div className="composer-fields">
          <select
            disabled={!isLoggedIn || isPublishing}
            value={cityId}
            onChange={(event) => setCityId(event.target.value)}
          >
            <option value="">Sin ciudad</option>
            {cities.slice(0, 30).map((city) => (
              <option key={city.id} value={city.id}>
                {city.nombre}
              </option>
            ))}
          </select>
          <input
            disabled={!isLoggedIn || isPublishing}
            placeholder="hashtags separados por coma"
            value={hashtags}
            onChange={(event) => setHashtags(event.target.value)}
          />
        </div>
        <div className="composer-actions">
          <span>{content.length}/500</span>
          <button type="submit" aria-label="Enviar publicacion" disabled={!isLoggedIn || isPublishing || !content.trim()}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </form>
  );
}
