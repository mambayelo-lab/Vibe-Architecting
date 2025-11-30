// utils/graphToMermaidDomains.ts
import { AuraNode } from "./types";

export type AuraCluster = {
  id: string;
  nodes: AuraNode[];
};

export type ClusteredGraph = {
  clusters: AuraCluster[];
};

/**
 * Transforme les clusters en diagramme Mermaid multi-domaines
 */
export function graphToMermaidDomains(clustered: ClusteredGraph): string {
  let out = `flowchart LR
%% ==================================
%%  CLASS DEFINITIONS (Brandolini)
%% ==================================
classDef event fill:#ffa500,stroke:#333;
classDef command fill:#4da3ff,stroke:#333;
classDef actor fill:#6fd36f,stroke:#333;
classDef aggregate fill:#f9f871,stroke:#333;
classDef external fill:#cccccc,stroke:#333;
classDef issue fill:#ff4d4d,stroke:#333;
classDef policy fill:#d6b3ff,stroke:#333;
classDef process fill:#b3e6ff,stroke:#333;
classDef readmodel fill:#b0ffb0,stroke:#333;

`;

  for (const cluster of clustered.clusters) {
    out += `
subgraph ${safe(cluster.id)}["${cluster.id}"]
direction LR
`;
    for (const n of cluster.nodes) {
      out += `  ${safe(n.id)}(["${n.label}"]):::${kindToClass(n.kind)}\n`;
    }
    out += "end\n\n";
  }

  return out;
}

function kindToClass(kind: AuraNode["kind"]): string {
  switch (kind) {
    case "Actor": return "actor";
    case "Command": return "command";
    case "DomainEvent": return "event";
    case "ProcessStep": return "process";
    case "Policy": return "policy";
    case "ExternalSystem": return "external";
    case "DataObject": return "readmodel";
    case "Issue": return "issue";
    case "Aggregate": return "aggregate";
    default: return "process";
  }
}

const safe = (id: string) =>
  id.replace(/[^a-zA-Z0-9_]/g, "_");
