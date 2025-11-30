// utils/stormingToMermaidV4-Lanes.ts

import { AuraNode, AuraEdge } from "./types";

/** Regroupe automatiquement les nœuds en clusters ("lanes") */
function autoCluster(nodes: AuraNode[]) {
  const lanes: Record<string, AuraNode[]> = {};

  for (const n of nodes) {
    const lane =
      n.kind === "Actor" ? "ACTORS" :
      n.kind === "Command" ? "COMMANDS" :
      n.kind === "DomainEvent" ? "EVENTS" :
      n.kind === "ProcessStep" ? "PROCESS" :
      n.kind === "ExternalSystem" ? "EXTERNAL" :
      n.kind === "Policy" ? "POLICIES" :
      n.kind === "Issue" ? "ISSUES" :
      n.kind === "Aggregate" ? "AGGREGATES" :
      "OTHER";

    if (!lanes[lane]) lanes[lane] = [];
    lanes[lane].push(n);
  }

  return lanes;
}

/** Génération Mermaid final */
export function graphToMermaidLanes(nodes: AuraNode[], edges: AuraEdge[]) {
  const lanes = autoCluster(nodes);

  let out = `---
config:
  layout: dagre
---
flowchart LR
`;

  for (const laneName of Object.keys(lanes)) {
    out += `  subgraph ${laneName}["${laneName}"]\n`;

    for (const n of lanes[laneName]) {
      out += `    ${n.id}["${n.label}"]:::${n.kind.toLowerCase()}\n`;
    }

    out += `  end\n\n`;
  }

  // Liens
  for (const e of edges) {
    out += `  ${e.from} --> ${e.to}\n`;
  }

  // Styles
  out += `
classDef actor fill:#6fd36f,stroke:#333;
classDef command fill:#4da3ff,stroke:#333;
classDef event fill:#ffa500,stroke:#333;
classDef processstep fill:#b3e6ff,stroke:#333;
classDef external fill:#cccccc,stroke:#333;
classDef issue fill:#ff4d4d,stroke:#333;
classDef aggregate fill:#f9f871,stroke:#333;
classDef policies fill:#d6b3ff,stroke:#333;
classDef other fill:#dddddd,stroke:#333;
`;

  return out;
}
