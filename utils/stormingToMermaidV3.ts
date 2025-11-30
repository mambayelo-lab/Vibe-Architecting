// utils/stormingToMermaidV4-Lanes.ts
import { AuraNode, AuraEdge } from "./types";

/**
 * Auto-lane Event Storming Mermaid Generator
 * Reproduces EXACTLY the structure ACQ / SWITCH / BILL etc.
 */
export function graphToMermaidLanes(nodes: AuraNode[], edges: AuraEdge[]) {
  const lanes = clusterLanes(nodes, edges);

  let out = `flowchart LR
%% ==================================
%%  CLASS DEFINITIONS (Brandolini)
%% ==================================
classDef event fill:#ffa500,stroke:#333;
classDef command fill:#4da3ff,stroke:#333;
classDef actor fill:#6fd36f,stroke:#333;
classDef aggregate fill:#f9f871,stroke:#333;
classDef external fill:#cccccc,stroke:#333;
classDef issue fill:#ff4d4d,stroke:#333;
classDef policy fill:#d6b3ff,stroke:#333;
classDef process fill:#b3e6ff,stroke:#333;
classDef readmodel fill:#b0ffb0,stroke:#333;

`;

  // ======================
  // RENDER EACH LANE
  // ======================
  for (const lane of lanes) {
    out += `
subgraph ${lane.id}["${lane.label}"]
direction LR
`;

    lane.nodes.forEach(n => {
      out += `  ${safe(n.id)}(["${n.label}"]):::${kindToClass(n.kind)}\n`;
    });

    out += `end\n\n`;
  }

  // ======================
  // RENDER EDGES
  // ======================
  edges.forEach(e => {
    out += `${safe(e.from)} --> ${safe(e.to)}\n`;
  });

  return out;
}

/**
 * AUTO-CLUSTERING OF LANES
 */
function clusterLanes(nodes: AuraNode[], edges: AuraEdge[]) {
  const clusters = {
    ACQ: { id: "ACQ", label: "ACQ", score: 0, nodes: [] as AuraNode[] },
    SWITCH: { id: "SWITCH", label: "SWITCH", score: 0, nodes: [] as AuraNode[] },
    METER: { id: "METER", label: "METER", score: 0, nodes: [] as AuraNode[] },
    BILL: { id: "BILL", label: "BILL", score: 0, nodes: [] as AuraNode[] },
    CARE: { id: "CARE", label: "CARE", score: 0, nodes: [] as AuraNode[] },
    ENDING: { id: "ENDING", label: "ENDING", score: 0, nodes: [] as AuraNode[] }
  };

  for (const n of nodes) {
    const label = n.label.toLowerCase();

    // Acquisition
    if (label.match(/lead|quote|prospect|contract|acq|sign/i))
      clusters.ACQ.nodes.push(n);

    // Switch
    else if (label.match(/switch|grd|request|validation/i))
      clusters.SWITCH.nodes.push(n);

    // Metering
    else if (label.match(/meter|reading|index/i))
      clusters.METER.nodes.push(n);

    // Billing
    else if (label.match(/invoice|bill|payment|tariff|consumption/i))
      clusters.BILL.nodes.push(n);

    // Care
    else if (label.match(/incident|ticket|care|support/i))
      clusters.CARE.nodes.push(n);

    // Ending
    else if (label.match(/end|terminate|close/i))
      clusters.ENDING.nodes.push(n);

    // Otherwise try to infer from edges
    else {
      const e = edges.find(e => e.from === n.id || e.to === n.id);
      if (e) clusters.ACQ.nodes.push(n);
    }
  }

  // Remove empty lanes
  return Object.values(clusters).filter(l => l.nodes.length > 0);
}

function kindToClass(kind: string) {
  switch (kind) {
    case "Actor": return "actor";
    case "Command": return "command";
    case "DomainEvent": return "event";
    case "ProcessStep": return "process";
    case "Policy": return "policy";
    case "ExternalSystem": return "external";
    case "DataObject": return "readmodel";
    case "Issue": return "issue";
    case "Aggregate": return "aggregate";
    default: return "process";
  }
}

const safe = (id: string) => id.replace(/-/g, "_");
