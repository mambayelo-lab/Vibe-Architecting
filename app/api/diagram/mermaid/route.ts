// app/api/diagram/mermaid/route.ts

import { NextResponse } from "next/server";
import { upsertStormingIntoGraph } from "@/utils/semanticGraph";
import { semanticInductionV3 } from "@/utils/semanticInductionV3";

export async function POST(req: Request) {
  const { storming } = await req.json();

  if (!storming) {
    return NextResponse.json({ mermaid: "flowchart LR\n" });
  }

  // 1. Storming → Graphe sémantique
  const semantic = upsertStormingIntoGraph(storming);

  // 2. Clustering + naming + conversion → Mermaid multi-domaines
  const { mermaid } = await semanticInductionV3(
    semantic.nodes,
    semantic.edges
  );

  // 3. Retour réponse API
  return NextResponse.json({ mermaid });
}
