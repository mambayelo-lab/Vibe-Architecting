"use client";

import { useState } from "react";
import MermaidViewer from "./components/MermaidViewer";

export default function Page() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [mermaid, setMermaid] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const newMsg = [...messages, { role: "user", content: input }];
    setMessages(newMsg);
    setInput("");

    const res = await fetch("/api/interviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMsg }),
    });

    const data = await res.json();

    setMessages((m) => [...m, { role: "assistant", content: data.reply }]);

    if (data.storming) {
      const mRes = await fetch("/api/mermaid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.storming),
      });

      const { mermaid } = await mRes.json();
      setMermaid(mermaid);
    }
  }

  async function finishInterview() {
    const res = await fetch("/api/interviews/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    const data = await res.json();

    setMessages((m) => [
      ...m,
      { role: "assistant", content: data.execSummary },
    ]);

    // Vue lanes auto
    const dRes = await fetch("/api/diagram/mermaid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ graph: data.semanticGraph }),
    });

    const { mermaid } = await dRes.json();
    setMermaid(mermaid);
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* PANEL CHAT */}
      <div
        style={{
          width: "35%",
          padding: 20,
          overflowY: "auto",
          borderRight: "1px solid #ccc",
        }}
      >
        <h2>Aura Architect Interview</h2>

        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <b>{m.role}</b> : {m.content}
          </div>
        ))}

        <input
          style={{ width: "100%", padding: 8, marginTop: 10 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Décrivez votre processus métier..."
        />

        <button onClick={sendMessage} style={{ marginTop: 10 }}>
          Envoyer
        </button>

        <button
          onClick={finishInterview}
          style={{
            marginTop: 8,
            background: "black",
            color: "white",
            padding: 8,
          }}
        >
          Terminer l’interview
        </button>
      </div>

      {/* PANEL DIAGRAM */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <MermaidViewer code={mermaid} />
      </div>
    </div>
  );
}
