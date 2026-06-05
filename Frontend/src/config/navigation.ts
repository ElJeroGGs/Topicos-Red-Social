import { Home, Compass, UsersRound, CalendarDays, UserRound } from "lucide-react";

export const NAVIGATION_ITEMS = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "explorar", label: "Explorar", icon: Compass },
  { id: "grupos", label: "Grupos", icon: UsersRound },
  { id: "eventos", label: "Eventos", icon: CalendarDays },
  { id: "perfil", label: "Perfil", icon: UserRound },
] as const;

export type ViewId = (typeof NAVIGATION_ITEMS)[number]["id"];

export const topics = [
  { id: "1", name: "Tecnologia" },
  { id: "2", name: "Deportes" },
  { id: "3", name: "Musica" },
  { id: "4", name: "Arte" },
  { id: "5", name: "Cine" },
];
