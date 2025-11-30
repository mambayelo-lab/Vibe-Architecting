// utils/clusterGraph.ts
import { AuraNode, AuraEdge } from "./types";

type Graph = {
  nodes: AuraNode[];
  edges: AuraEdge[];
};

/**
 * Simple connected-components clustering
 */
export function clusterGraph(graph: Graph) {
  const { nodes, edges } = graph;

  const adjacency: Record<string, string[]> = {};

  for (const n of nodes) adjacency[n.id] = [];
  for (const e of edges) {
    adjacency[e.from].push(e.to);
    adjacency[e.to].push(e.from);
  }

  const visited = new Set<string>();
  const clusters: { id: string; nodes: AuraNode[] }[] = [];

  for (const n of nodes) {
    if (visited.has(n.id)) continue;

    const stack = [n.id];
    const groupIds: string[] = [];
    visited.add(n.id);

    while (stack.length) {
      const u = stack.pop()!;
      groupIds.push(u);
      for (const v of adjacency[u]) {
        if (!visited.has(v)) {
          visited.add(v);
          stack.push(v);
        }
      }
    }

    const clusterNodes = nodes.filter(nd => groupIds.includes(nd.id));

    clusters.push({
      id: `cluster_${clusters.length + 1}`,
      nodes: clusterNodes
    });
  }

  return { clusters };
}
