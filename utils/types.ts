// utils/types.ts

export type AuraNode = {
  id: string;
  label: string;
  kind:
    | "Actor"
    | "Command"
    | "DomainEvent"
    | "Aggregate"
    | "Policy"
    | "ExternalSystem"
    | "ProcessStep"
    | "DataObject"
    | "Issue";
};

export type AuraEdge = {
  id: string;
  from: string;
  to: string;
  relation: string;
};

export type Storming = {
  actors: string[];
  events: string[];
  commands: string[];
  aggregates: string[];
  policies: string[];
  externalSystems: string[];
  steps: string[];
  dataObjects: string[];
  issues: string[];
};
