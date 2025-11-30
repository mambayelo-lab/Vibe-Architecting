// utils/clusterGraph.ts

import { AuraNode, AuraEdge } from "./types";

/**
* Retourne une liste de clusters : string[][]
* Basé sur un BFS simple.
*/
export function clusterGraph(
  nodes: AuraNode[],
  edges: AuraEdge[]
): string[][] {
  const adjacency = new Map<string, string[]>();

  for (const n of nodes) adjacency.set(n.id, []);

  for (const e of edges) {
    adjacency.get(e.from)?.push(e.to);
    adjacency.get(e.to)?.push(e.from);
  }

  const visited = new Set<string>();
  const clusters: string[][] = [];

  for (const n of nodes) {
    if (visited.has(n.id)) continue;

    const queue = [n.id];
    const group: string[] = [];

    while (queue.length > 0) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      group.push(id);

      for (const neigh of adjacency.get(id) || []) {
        if (!visited.has(neigh)) queue.push(neigh);
      }
    }

    clusters.push(group);
  }

  return clusters;
} 