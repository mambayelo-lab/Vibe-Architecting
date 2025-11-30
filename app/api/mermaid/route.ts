import { NextResponse } from "next/server";
import { semanticInductionV3 } from "@/utils/semanticInductionV3";

export async function POST(req: Request) {
  const storming = await req.json();

  // Extraction des nodes et edges depuis le storming envoyé
  const nodes = storming.nodes ?? [];
  const edges = storming.edges ?? [];

  // Semantic Induction complet
  const result = await semanticInductionV3(nodes, edges);

  return NextResponse.json({
    mermaid: result.mermaid,
    domains: result.domains,
    communities: result.communities,
  });
} 