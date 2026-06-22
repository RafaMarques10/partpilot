export type PartType =
  | "flange"
  | "drilled-plate"
  | "l-bracket"
  | "simple-shaft";

export type ProjectStatus = "draft" | "ready";

export type FlangeParameters = {
  outerDiameter: number;
  innerDiameter: number;
  thickness: number;
  boltCircleDiameter: number;
  boltHoleDiameter: number;
  boltCount: number;
  chamfer: number;
  material: string;
  stockAllowance: number;
};

export type DrilledPlateParameters = {
  length: number;
  width: number;
  thickness: number;
  holeDiameter: number;
  holesX: number;
  holesY: number;
  marginX: number;
  marginY: number;
  chamfer: number;
  material: string;
};

export type PartParameters = FlangeParameters | DrilledPlateParameters;

export type Project = {
  id: string;
  name: string;
  partType: PartType;
  status: ProjectStatus;
  updatedAt: string;
  parameters: PartParameters;
};

export type CncOperation = {
  id: string;
  setup: string;
  operation: string;
  tool: string;
  strategy: string;
  notes: string;
  estimatedMinutes: number;
};
