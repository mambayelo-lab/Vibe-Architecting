// utils/semanticGraph.ts

import { AuraNode, AuraEdge, Storming } from "./types";

export function upsertStormingIntoGraph(storming: Storming) {
  const graph = { nodes: [] as AuraNode[], edges: [] as AuraEdge[] };

  function ensureNode(kind: AuraNode["kind"], rawLabel: string): AuraNode {
    const node: AuraNode = {
      id: `${kind}_${rawLabel.replace(/\s+/g, "_")}`,
      label: rawLabel,
      kind
    };
    graph.nodes.push(node);
    return node;
  }

  // 1) Création des nœuds
  storming.actors.forEach(a => ensureNode("Actor", a));
  storming.commands.forEach(c => ensureNode("Command", c));
  storming.events.forEach(e => ensureNode("DomainEvent", e));
  storming.steps.forEach(s => ensureNode("ProcessStep", s));
  storming.policies.forEach(p => ensureNode("Policy", p));
  storming.externalSystems.forEach(e => ensureNode("ExternalSystem", e));
  storming.aggregates.forEach(a => ensureNode("Aggregate", a));
  storming.dataObjects.forEach(d => ensureNode("DataObject", d));
  storming.issues.forEach(i => ensureNode("Issue", i));

  return graph;
}
