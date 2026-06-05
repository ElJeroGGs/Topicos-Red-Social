import { useState } from "react";
import AppLayout from "./AppLayout";

export default function App() {
  const [activeView, setActiveView] = useState("inicio");
  return <AppLayout activeView={activeView} setActiveView={setActiveView} />;
}
