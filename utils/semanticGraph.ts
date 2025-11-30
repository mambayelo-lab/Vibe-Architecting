// utils/semanticGraph.ts

import { AuraNode, AuraEdge, Storming } from "./types";

/**
 * Graph sémantique en mémoire (pour l’instant un simple objet).
 * Tu pourras remplacer ça par une vraie DB graph plus tard.
 */
const graph = {
  nodes: [] as AuraNode[],
  edges: [] as AuraEdge[],
};

/** ID technique : slug safe pour Mermaid (pas d'accents, pas d'espaces) */
function makeId(prefix: string, raw: string): string {
  const base = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // enlève ACCENTS seulement pour l'ID
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .toLowerCase();

  return `${prefix}_${base}`;
}

/** Label affiché : on garde les accents, on remplace les underscores par des espaces */
function makeLabel(raw: string): string {
  const withSpaces = raw.replace(/_/g, " ").trim();
  // On laisse en minuscules pour l’instant (plus naturel dans un flux Event Storming)
  return withSpaces;
}

/** Récupère ou crée un nœud unique pour un (kind, rawLabel) donné */
function ensureNode(kind: AuraNode["kind"], rawLabel: string): AuraNode {
  const id = makeId(kind.toLowerCase(), rawLabel);

  let existing = graph.nodes.find((n) => n.id === id);
  if (existing) return existing;

  const node: AuraNode = {
    id,
    label: makeLabel(rawLabel),
    kind,
  };
  graph.nodes.push(node);
  return node;
}

/**
 * Construit / met à jour le graphe sémantique à partir d’un Storming.
 * Pour l’instant on crée un flow simple :
 *   - steps -> events (séquentiel)
 *   - actors -> première commande
 *   - commandes -> events
 */
export function upsertStormingIntoGraph(storming: Storming) {
  const edges: AuraEdge[] = [];

  // 1) Création des nœuds par type
  const actorNodes = storming.actors.map((a) => ensureNode("Actor", a));
  const commandNodes = storming.commands.map((c) => ensureNode("Command", c));
  const eventNodes = storming.events.map((e) => ensureNode("DomainEvent", e));
  const stepNodes = storming.steps.map((s) => ensureNode("ProcessStep", s));
  const policyNodes = storming.policies.map((p) => ensureNode("Policy", p));
  const externalNodes = storming.externalSystems.map((e) =>
    ensureNode("ExternalSystem", e),
  );
  const aggNodes = storming.aggregates.map((a) =>
    ensureNode("Aggregate", a),
  );
  const dataNodes = storming.dataObjects.map((d) =>
    ensureNode("DataObject", d),
  );
  const issueNodes = storming.issues.map((i) => ensureNode("Issue", i));

  // 2) Séquence principale : steps + events (si steps non vides)
  const mainFlow: AuraNode[] = [];
  if (stepNodes.length) mainFlow.push(...stepNodes);
  if (eventNodes.length) mainFlow.push(...eventNodes);

  for (let i = 0; i < mainFlow.length - 1; i++) {
    const from = mainFlow[i];
    const to = mainFlow[i + 1];
    edges.push({
      id: `flow_${from.id}_${to.id}`,
      from: from.id,
      to: to.id,
      relation: "FLOW",
    });
  }

  // 3) Actors → première commande
  if (commandNodes.length && actorNodes.length) {
    const firstCmd = commandNodes[0];
    for (const actor of actorNodes) {
      edges.push({
        id: `actor_${actor.id}_${firstCmd.id}`,
        from: actor.id,
        to: firstCmd.id,
        relation: "ACTOR_TRIGGERS_COMMAND",
      });
    }
  }

  // 4) Commandes → events (simple mapping séquentiel)
  const len = Math.min(commandNodes.length, eventNodes.length);
  for (let i = 0; i < len; i++) {
    const cmd = commandNodes[i];
    const evt = eventNodes[i];
    edges.push({
      id: `cmd_${cmd.id}_${evt.id}`,
      from: cmd.id,
      to: evt.id,
      relation: "COMMAND_CAUSES_EVENT",
    });
  }

  // 5) Policies / External / Aggregates / Data / Issues : on les laisse comme satellites (pour l’instant)
  // Tu pourras enrichir plus tard (EVENT_USES_DATAOBJECT, POLICY_REACTS_TO_EVENT, etc.)

  // 6) Merge edges sans doublons
  for (const e of edges) {
    const exists = graph.edges.some(
      (x) => x.from === e.from && x.to === e.to && x.relation === e.relation,
    );
    if (!exists) {
      graph.edges.push(e);
    }
  }

  // On renvoie une vue immuable du graphe
  return {
    nodes: graph.nodes,
    edges: graph.edges,
  };
}
