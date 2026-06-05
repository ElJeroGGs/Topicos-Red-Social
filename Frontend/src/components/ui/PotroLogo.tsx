export const potroNodes = [
  { id: "nose", x: 130, y: 60 },
  { id: "forehead", x: 145, y: 65 },
  { id: "backHead", x: 155, y: 60 },
  { id: "earTip", x: 152, y: 45 },
  { id: "muzzle", x: 120, y: 70 },
  { id: "throat", x: 150, y: 95 },
  { id: "maneTop", x: 165, y: 75 },
  { id: "maneMid", x: 180, y: 95 },
  { id: "throatBottom", x: 155, y: 115 },
  { id: "frontShoulder", x: 185, y: 130 },
  { id: "frontElbowL", x: 145, y: 125 },
  { id: "frontWristL", x: 115, y: 105 },
  { id: "frontHoofL", x: 95, y: 110 },
  { id: "frontElbowR", x: 160, y: 150 },
  { id: "frontWristR", x: 135, y: 140 },
  { id: "frontHoofR", x: 115, y: 145 },
  { id: "spineMid", x: 215, y: 135 },
  { id: "spineLow", x: 240, y: 150 },
  { id: "underbelly", x: 210, y: 180 },
  { id: "hip", x: 265, y: 170 },
  { id: "hindKneeL", x: 275, y: 205 },
  { id: "hindHockL", x: 265, y: 240 },
  { id: "hindHoofL", x: 275, y: 280 },
  { id: "hindKneeR", x: 245, y: 210 },
  { id: "hindHockR", x: 230, y: 245 },
  { id: "hindHoofR", x: 235, y: 280 },
  { id: "tailBase", x: 275, y: 175 },
  { id: "tailMid", x: 290, y: 210 },
  { id: "tailTip", x: 280, y: 255 }
];

export const potroConnections = [
  // Head
  ["nose", "forehead"], ["forehead", "backHead"], ["backHead", "throat"], ["throat", "muzzle"], ["muzzle", "nose"],
  ["earTip", "forehead"], ["earTip", "backHead"],
  // Neck
  ["forehead", "maneTop"], ["maneTop", "maneMid"], ["maneMid", "frontShoulder"],
  ["throat", "throatBottom"], ["throatBottom", "frontShoulder"],
  ["maneTop", "throat"], ["maneMid", "throatBottom"],
  // Left Front Leg
  ["frontShoulder", "frontElbowL"], ["frontElbowL", "frontWristL"], ["frontWristL", "frontHoofL"],
  // Right Front Leg
  ["frontShoulder", "frontElbowR"], ["frontElbowR", "frontWristR"], ["frontWristR", "frontHoofR"],
  // Spine
  ["frontShoulder", "spineMid"], ["spineMid", "spineLow"], ["spineLow", "hip"],
  // Belly
  ["throatBottom", "underbelly"], ["underbelly", "hindKneeR"],
  // Left Hind Leg
  ["hip", "hindKneeL"], ["hindKneeL", "hindHockL"], ["hindHockL", "hindHoofL"],
  ["spineLow", "hindKneeL"],
  // Right Hind Leg
  ["spineLow", "hindKneeR"], ["hindKneeR", "hindHockR"], ["hindHockR", "hindHoofR"],
  ["underbelly", "hindKneeR"],
  // Hip Support
  ["hip", "hindKneeR"], ["underbelly", "hip"],
  // Tail
  ["hip", "tailBase"], ["tailBase", "tailMid"], ["tailMid", "tailTip"], ["tailTip", "hindHockL"]
];

const nodeMap = new Map(potroNodes.map(n => [n.id, n]));

interface PotroLogoProps {
  className?: string;
  animated?: boolean;
}

export function PotroLogo({ className = "", animated = false }: PotroLogoProps) {
  return (
    <svg
      viewBox="50 30 280 270"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gold-teal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--teal)" />
          <stop offset="50%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--teal)" />
        </linearGradient>
        <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g className="links-group">
        {potroConnections.map(([fromId, toId], idx) => {
          const fromNode = nodeMap.get(fromId);
          const toNode = nodeMap.get(toId);
          if (!fromNode || !toNode) return null;
          return (
            <line
              key={`link-${idx}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              className={animated ? "graph-link" : "graph-link-static"}
            />
          );
        })}
      </g>

      <g className="nodes-group">
        {potroNodes.map((node) => {
          const isKeyNode =
            node.id === "nose" ||
            node.id === "hip" ||
            node.id === "frontShoulder" ||
            node.id === "earTip";
          return (
            <circle
              key={`node-${node.id}`}
              cx={node.x}
              cy={node.y}
              r={isKeyNode ? 4.5 : 2.5}
              className={animated ? `graph-node ${isKeyNode ? "key-node" : ""}` : `graph-node-static ${isKeyNode ? "key-node" : ""}`}
            />
          );
        })}
      </g>
    </svg>
  );
}
