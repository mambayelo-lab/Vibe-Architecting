import { AuraNode, AuraEdge } from "./types";

export function graphCommunities(nodes: AuraNode[], edges: AuraEdge[]) {
  const adjacency: Record<string, string[]> = {};

  for (const n of nodes) adjacency[n.id] = [];
  for (const e of edges) {
    adjacency[e.from].push(e.to);
    adjacency[e.to].push(e.from);
  }

  const visited = new Set<string>();
  const communities: string[][] = [];

  for (const n of nodes) {
    if (visited.has(n.id)) continue;

    const stack = [n.id];
    const com: string[] = [];
    visited.add(n.id);

    while (stack.length) {
      const u = stack.pop()!;
      com.push(u);
      for (const v of adjacency[u] || []) {
        if (!visited.has(v)) {
          visited.add(v);
          stack.push(v);
        }
      }
    }

    communities.push(com);
  }

  return communities;
}
