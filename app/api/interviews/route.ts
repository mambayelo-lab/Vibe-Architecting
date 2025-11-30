import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Storming } from "@/utils/types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const SYSTEM_PROMPT = `
Tu es "Aura Architect Interview".

Objectif :
- Poser des questions d'architecture d'entreprise (style consultant McKinsey).
- Extraire un Event Storming structuré à partir de ce que décrit l'utilisateur.
- Ne JAMAIS inventer de faits non mentionnés.

Tu dois répondre STRICTEMENT au format JSON suivant :

{
  "reply": "ta réponse textuelle à afficher à l'utilisateur",
  "storming": {
    "actors": [],
    "events": [],
    "commands": [],
    "aggregates": [],
    "policies": [],
    "externalSystems": [],
    "dataObjects": [],
    "issues": [],
    "steps": [],
    "contexts": []
  }
}

Règles :
- "reply" = une phrase courte qui continue l'interview.
- Dans "storming", ne mets que des éléments explicitement mentionnés ou déduits très directement.
- Si tu n'as rien pour une catégorie, laisse un tableau vide.
`;

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY manquant dans .env.local" },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...(messages || []),
      ],
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("Réponse vide d'OpenAI");
    }

    const parsed = JSON.parse(content) as {
      reply: string;
      storming: Storming;
    };

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("Interview API error:", err);
    return NextResponse.json(
      { error: "Interview failed", details: err?.message },
      { status: 500 }
    );
  }
}
