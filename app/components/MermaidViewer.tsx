"use client";

import mermaid from "mermaid";
import { useEffect, useRef } from "react";

export default function MermaidViewer({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !code) return;
    mermaid.initialize({ startOnLoad: false });
    mermaid.render("graphDiv", code).then(({ svg }) => {
      ref.current!.innerHTML = svg;
    });
  }, [code]);

  return <div ref={ref} style={{ padding: 20 }} />;
}
