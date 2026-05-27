import type { SessionUser } from "../../types/social";
import { getInitials } from "../../utils/format";

type AvatarProps = {
  alt?: string;
  src?: string | null;
  user?: Partial<SessionUser> | null;
  size?: "sm" | "default" | "large";
};

export function Avatar({ alt, src, user, size = "default" }: AvatarProps) {
  const imageUrl = src ?? user?.foto_perfil_url;
  const label = alt ?? user?.username ?? "usuario";

  return (
    <div className={`avatar ${size === "large" ? "large" : ""} ${size === "sm" ? "sm" : ""}`}>
      {imageUrl ? <img src={imageUrl} alt={label} /> : getInitials(user)}
    </div>
  );
}
