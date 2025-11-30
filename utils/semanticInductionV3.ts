// utils/semanticInductionV3.ts

import { AuraNode, AuraEdge } from "./types";
import { clusterGraph } from "./clusterGraph";
import { buildDomainNamingPrompt } from "./buildDomainNamingPromptS";
import { nameDomainsWithLLM } from "./clusterLLMReviewer";
import { graphToMermaidDomains } from "./graphToMermaidDomains";

export async function semanticInductionV3(
  nodes: AuraNode[],
  edges: AuraEdge[]
) {
  // 1. Clustering
  const communities = clusterGraph(nodes, edges);

  // 2. Génération du prompt LLM
  const prompt = buildDomainNamingPrompt(nodes, communities);

  // 3. Appel LLM Naming
  const domainNames = await nameDomainsWithLLM(prompt);

  // 4. Diagramme
  const mermaid = graphToMermaidDomains(
    nodes,
    edges,
    domainNames,
    communities
  );

  return { mermaid, domains: domainNames, communities };
} 