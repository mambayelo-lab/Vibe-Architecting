// utils/normalize.ts

import { Storming } from "./types";

/**
 * Normalise en douceur le JSON "storming" renvoyé par le LLM :
 * - trim des chaînes
 * - supprime les vides
 * - NE TOUCHE PAS aux underscores ni aux accents
 */
function normalizeArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter((x) => x.length > 0);
}

export function normalizeStorming(raw: any): Storming {
  return {
    actors: normalizeArray(raw.actors),
    events: normalizeArray(raw.events),
    commands: normalizeArray(raw.commands),
    aggregates: normalizeArray(raw.aggregates),
    policies: normalizeArray(raw.policies),
    externalSystems: normalizeArray(raw.externalSystems),
    steps: normalizeArray(raw.steps),
    dataObjects: normalizeArray(raw.dataObjects),
    issues: normalizeArray(raw.issues),
  };
}
