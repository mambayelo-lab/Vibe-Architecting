// app/api/diagram/mermaid/route.ts

import { NextResponse } from "next/server";
import { graphToMermaidLanes } from "@/utils/stormingToMermaidV4-Lanes";

export async function POST(req: Request) {
  const { graph } = await req.json();

  if (!graph || !graph.nodes || !graph.edges) {
    return NextResponse.json({ mermaid: "flowchart LR\n" });
  }

  const mermaid = graphToMermaidLanes(graph.nodes, graph.edges);
  return NextResponse.json({ mermaid });
}
