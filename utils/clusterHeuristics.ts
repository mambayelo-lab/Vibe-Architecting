import { AuraNode } from "./types";

export function clusterHeuristic(nodes: AuraNode[]) {
  const clusters: Record<string, AuraNode[]> = {};

  for (const n of nodes) {
    const lane = n.kind;
    if (!clusters[lane]) clusters[lane] = [];
    clusters[lane].push(n);
  }
  return clusters;
}
