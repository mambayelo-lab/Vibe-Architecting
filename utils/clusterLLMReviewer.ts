// utils/clusterLLMReviewer.ts
import OpenAI from "openai";
import { AuraNode } from "./types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Donne des noms plus explicites aux domaines via LLM
 */
export async function clusterLLMReviewer(clustered: {
  clusters: { id: string; nodes: AuraNode[] }[];
}) {
  const prompt = `
Tu es un expert en Domain-Driven Design.
Donne un nom clair à chaque domaine suivant.
Réponds en JSON strict.

Clusters :
${JSON.stringify(clustered.clusters, null, 2)}
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: prompt
    }],
    response_format: { type: "json_object" }
  });

  const response = completion.choices[0].message.content;
  if (!response) return clustered;

  const parsed = JSON.parse(response);

  // applique les noms recommandés
  for (let i = 0; i < clustered.clusters.length; i++) {
    clustered.clusters[i].id = parsed.clusters?.[i]?.name || clustered.clusters[i].id;
  }

  return clustered;
}
