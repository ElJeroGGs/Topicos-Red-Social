import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PotroLogo } from "./PotroLogo";

export function PremiumSplash() {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Timeline de la animación de intro
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
      }
    });

    // 1. Animación del Potro de Grafo (SVG)
    tl.fromTo(
      ".graph-link",
      { strokeDasharray: 80, strokeDashoffset: 80, opacity: 0 },
      { strokeDashoffset: 0, opacity: 0.8, duration: 1.5, stagger: 0.02, ease: "power2.out" }
    );

    tl.fromTo(
      ".graph-node",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, stagger: 0.01, ease: "back.out(2.2)" },
      "-=1.2"
    );

    // 2. Animación de los textos premium
    tl.fromTo(
      ".splash-title",
      { y: 30, opacity: 0, letterSpacing: "-0.05em" },
      { y: 0, opacity: 1, letterSpacing: "0.08em", duration: 1.0, ease: "power3.out" },
      "-=0.8"
    );

    tl.fromTo(
      ".splash-subtitle",
      { y: 15, opacity: 0 },
      { y: 0, opacity: 0.6, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    );

    tl.fromTo(
      ".splash-glow",
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 0.4, duration: 1.5, ease: "sine.out" },
      "-=1.8"
    );

    // 3. Desvanecimiento de salida elegante
    tl.to(
      ".premium-splash",
      {
        opacity: 0,
        scale: 1.05,
        filter: "blur(10px)",
        duration: 0.7,
        ease: "power2.inOut",
        delay: 0.5
      }
    );
  }, { scope: containerRef });

  if (!visible) return null;

  return (
    <div className="premium-splash" role="presentation" ref={containerRef}>
      <div className="splash-glow" />
      <div className="splash-content">
        <div className="potro-svg-container">
          <PotroLogo className="potro-svg" animated />
        </div>

        <h1 className="splash-title">JEROBOOK</h1>
        <p className="splash-subtitle">RED SOCIAL ORIENTADA A GRAFOS</p>
      </div>
    </div>
  );
}
