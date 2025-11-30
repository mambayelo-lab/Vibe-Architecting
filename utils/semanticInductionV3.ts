// utils/semanticInductionV3.ts

import { AuraNode, AuraEdge } from "./types";
import { nameDomainsWithLLM } from "./clusterLLMReviewer";
import { graphToMermaidDomains } from "./graphToMermaidDomains";
import { buildDomainNamingPrompt } from "./buildDomainNamingPromptS";

/**
 * Version optimisée : un seul cluster, 1 seul appel LLM.
 */
export async function semanticInductionV3(
  nodes: AuraNode[],
  edges: AuraEdge[]
) {
  // 1) Un cluster unique
  const communities: string[][] = [
    nodes.map(n => n.id)
  ];

  // 2) Prompt propre
  const prompt = buildDomainNamingPrompt(nodes, communities);

  // 3) Une seule requête LLM
  const domainNames = await nameDomainsWithLLM(prompt); 
  // format : [{ cluster:0, name:"..." }]

  // 4) Diagramme final
  const mermaid = graphToMermaidDomains(
    nodes,
    edges,
    domainNames,
    communities
  );

  return { mermaid, domains: domainNames, communities };
}
