// utils/graphToMermaidDomains.ts

import { AuraNode, AuraEdge } from "./types";

export type DomainName = {
  cluster: number;
  name: string;
};

/**
 * Petit helper pour échapper les guillemets dans les labels Mermaid.
 */
function escapeLabel(label: string): string {
  return label.replace(/"/g, '\\"');
}

/**
 * Génère un diagramme Mermaid avec :
 * - un subgraph par domaine métier
 * - les nœuds du cluster à l’intérieur
 * - les liens entre nœuds
 *
 * @param nodes       Liste des nœuds sémantiques Aura
 * @param edges       Liens entre nœuds
 * @param domains     [{ cluster:number, name:string }]
 * @param communities string[][]  → communities[i] = liste des node.id dans le cluster i
 */
export function graphToMermaidDomains(
  nodes: AuraNode[],
  edges: AuraEdge[],
  domains: DomainName[],
  communities: string[][]
): string {
  // Index domaine par n° de cluster
  const domainByCluster = new Map<number, string>();
  for (const d of domains) {
    domainByCluster.set(d.cluster, d.name);
  }

  let out = `---
config:
  layout: dagre
---
flowchart LR
`;

  // --- Subgraphs par domaine / cluster ---
  communities.forEach((clusterNodeIds, i) => {
    const domainLabel = domainByCluster.get(i) || `Cluster ${i + 1}`;
    const subgraphId = `DOMAIN_${i}`;

    out += `  subgraph ${subgraphId}["${escapeLabel(domainLabel)}"]\n`;

    const clusterNodes = nodes.filter(n => clusterNodeIds.includes(n.id));

    for (const n of clusterNodes) {
      const cssClass = n.kind.toLowerCase(); // actor, commande, domainevent, etc.
      out += `    ${n.id}["${escapeLabel(n.label)}"]:::${cssClass}\n`;
    }

    out += `  end\n\n`;
  });

  // --- Liens entre nœuds ---
  for (const e of edges) {
    out += `  ${e.from} --> ${e.to}\n`;
  }

  // --- Styles Mermaid basés sur n.kind ---
  out += `
classDef actor fill:#6fd36f,stroke:#333;
classDef command fill:#4da3ff,stroke:#333;
classDef domainevent fill:#ffa500,stroke:#333;
classDef processstep fill:#b3e6ff,stroke:#333;
classDef externalsystem fill:#cccccc,stroke:#333;
classDef policy fill:#d6b3ff,stroke:#333;
classDef issue fill:#ff4d4d,stroke:#333;
classDef aggregate fill:#f9f871,stroke:#333;
`;

  return out;
}
