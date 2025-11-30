// app/api/mermaid/route.ts

import { NextResponse } from "next/server";
import { stormingToMermaid } from "@/utils/stormingToMermaid";

export async function POST(req: Request) {
  const storming = await req.json();
  const mermaid = stormingToMermaid(storming);
  return NextResponse.json({ mermaid });
}
