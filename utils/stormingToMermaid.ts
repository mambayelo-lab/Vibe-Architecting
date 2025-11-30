// utils/stormingToMermaid.ts

export function stormingToMermaid(storming: any): string {
  if (!storming) return "flowchart LR";

  const events: string[] = storming.events || [];
  const commands: string[] = storming.commands || [];
  const actors: string[] = storming.actors || [];
  const steps: string[] = storming.steps || [];

  const sanitize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();

  let out = `flowchart LR\n\n`;

  // --- Actors
  actors.forEach((a: string) => {
    const id = sanitize(a);
    out += `  ${id}["${a}"]:::actor\n`;
  });

  // --- Commands
  commands.forEach((c: string) => {
    const id = sanitize(c);
    out += `  ${id}["${c}"]:::command\n`;
  });

  // --- Events
  events.forEach((e: string) => {
    const id = sanitize(e);
    out += `  ${id}["${e}"]:::event\n`;
  });

  // --- Steps
  steps.forEach((s: string) => {
    const id = sanitize(s);
    out += `  ${id}["${s}"]:::process\n`;
  });

  // --- Styles
  out += `
classDef actor fill:#6fd36f,stroke:#333;
classDef command fill:#4da3ff,stroke:#333;
classDef event fill:#ffa500,stroke:#333;
classDef process fill:#b3e6ff,stroke:#333;
`;

  return out;
}