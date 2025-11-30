// utils/clusterLLMReviewer.ts
import OpenAI from "openai";

/**
 * Initialise le client OpenAI
 */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

/**
 * Appelle le LLM pour nommer les clusters.
 * Retourne : { cluster:number, name:string }[]
 */
export async function nameDomainsWithLLM(prompt: string) {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "Tu es un expert en architecture métier." },
      { role: "user", content: prompt }
    ],
  });

  const raw = res.choices?.[0]?.message?.content;
  if (!raw) {
    console.error("LLM returned empty result:", res);
    throw new Error("LLM returned null content");
  }

  const parsed = JSON.parse(raw);

  // Sécurisation du format
  return parsed.domains?.map((d: any) => ({
    cluster: Number(d.cluster),
    name: String(d.name)
  })) ?? [];
}
