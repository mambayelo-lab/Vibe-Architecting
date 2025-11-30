// app/api/interviews/complete/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { normalizeStorming } from "@/utils/normalize";
import { upsertStormingIntoGraph } from "@/utils/semanticGraph";


const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { messages } = await req.json();

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
Tu es Aura Exec Analyst (style McKinsey).
Résume l'interview dans ce format JSON :

{
  "execSummary": "texte",
  "painPoints": [],
  "keyOpportunities": [],
  "costImpacts": [],
  "risks": [],
  "recommendations": [],
  "storming": {
    "actors": [],
    "events": [],
    "commands": [],
    "policies": [],
    "aggregates": [],
    "externalSystems": [],
    "steps": [],
    "dataObjects": [],
    "issues": []
  }
}
`
      },
      ...messages
        .filter((m: any) => m.role === "user")
        .map((m: any) => ({ role: "user", content: m.content }))

    ]
  });

  const raw = completion.choices[0].message.content;
  const parsed = JSON.parse(raw || "{}");

  const execSummary = parsed.execSummary ?? "Résumé non disponible.";

  const normalizedStorming = normalizeStorming(parsed.storming || {});

  const semanticGraph = upsertStormingIntoGraph(normalizedStorming);


  return NextResponse.json({
    execSummary,
    storming: normalizedStorming,
    semanticGraph
  });
}
