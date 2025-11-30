// utils/buildDomainNamingPromptS.ts

import { AuraNode } from "./types";

/**
 * Construit un prompt propre pour nommer les domaines.
 */
export function buildDomainNamingPrompt(
  nodes: AuraNode[],
  communities: string[][]
) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  const clusters = communities.map(group =>
    group.map(id => nodeMap.get(id)).filter(Boolean) as AuraNode[]
  );

  let prompt = `
Tu es un expert en architecture métier.

Objectif :
Proposer un nom de domaine fonctionnel métier pour chaque cluster.

Format strict JSON :
{
 "domains": [
   { "cluster": 0, "name": "NomDuDomaine" }
 ]
}

Clusters :
`;

  clusters.forEach((cluster, i) => {
    prompt += `\n# Cluster ${i}\n`;
    cluster.forEach(n => {
      prompt += `- ${n.label} (${n.kind})\n`;
    });
  });

  return prompt;
}
