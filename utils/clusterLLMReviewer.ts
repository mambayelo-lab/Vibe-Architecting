// utils/clusterLLMReviewer.ts

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
* Reçoit un prompt texte et renvoie du JSON :
* { domains: [ { cluster: number, name: string } ] }
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
  if (!raw) throw new Error("LLM returned empty response");

  const json = JSON.parse(raw);
  return json.domains ?? [];
} 