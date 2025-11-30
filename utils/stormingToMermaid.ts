// utils/stormingToMermaid.ts

export function stormingToMermaid(storming: any): string {
  if (!storming) return "flowchart LR";

  const events: string[] = storming.events || [];
  const commands: string[] = storming.commands || [];
  const actors: string[] = storming.actors || [];
  const steps: string[] = storming.steps || [];

  let out = "flowchart LR\n\n";

  // Actors
  actors.forEach((a: string) => {
    out += `${sanitize(a)}[${a}]:::actor\n`;
  });

  // Commands
  commands.forEach((c: string) => {
    out += `${sanitize(c)}([${c}]):::command\n`;
  });

  // Events
  events.forEach((e: string) => {
    out += `${sanitize(e)}([${e}]):::event\n`;
  });

  // Steps
  steps.forEach((s: string) => {
    out += `${sanitize(s)}([${s}]):::process\n`;
  });

  out += "\n";

  // Simple chaining (events timeline)
  for (let i = 0; i < events.length - 1; i++) {
    out += `${sanitize(events[i])} --> ${sanitize(events[i + 1])}\n`;
  }

  // Mermaid class definitions
  out += `
classDef actor fill:#6fd36f,stroke:#333;
classDef command fill:#4da3ff,stroke:#333;
classDef event fill:#ffa500,stroke:#333;
classDef process fill:#b3e6ff,stroke:#333;
`;

  return out;
}

function sanitize(label: string): string {
  return label.replace(/\W+/g, "").toLowerCase();
}
