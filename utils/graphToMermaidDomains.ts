// utils/graphToMermaidDomains.ts

import { AuraNode, AuraEdge } from "./types";

export function graphToMermaidDomains(
  nodes: AuraNode[],
  edges: AuraEdge[],
  domainNames: { cluster: number; name: string }[],
  communities: string[][]
) {
  let out = `flowchart LR\n\n`;

  communities.forEach((group, i) => {
    const title = domainNames.find(d => d.cluster === i)?.name ?? `Cluster ${i}`;
    out += `subgraph ${i}["${title}"]\n`;

    group.forEach(id => {
      const n = nodes.find(x => x.id === id);
      if (!n) return;
      out += `  ${n.id}["${n.label}"]\n`;
    });

    out += "end\n\n";
  });

  edges.forEach(e => {
    out += `${e.from} --> ${e.to}\n`;
  });

  return out;
} 