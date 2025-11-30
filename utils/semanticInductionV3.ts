// utils/semanticInductionV3.ts

import { AuraNode, AuraEdge } from "./types";

// Import en "nommé" (car tes modules n'ont PAS d'export default)
import { clusterGraph } from "./clusterGraph";
import { clusterLLMReviewer } from "./clusterLLMReviewer";
import { graphToMermaidDomains } from "./graphToMermaidDomains";
export async function semanticInductionV3(
  nodes: AuraNode[],
  edges: AuraEdge[]
) {
  // 1. Clustering brut
  const clustered = clusterGraph({ nodes, edges });

  // 2. Amélioration des noms de domaines par LLM
  const reviewed = await clusterLLMReviewer(clustered);

  // 3. Conversion → Mermaid multi-domaines
  const mermaid = graphToMermaidDomains(reviewed);

  return { mermaid };
}
