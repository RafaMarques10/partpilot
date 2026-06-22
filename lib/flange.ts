import type { CncOperation, FlangeParameters } from "@/lib/types";

export const defaultFlangeParameters: FlangeParameters = {
  outerDiameter: 120,
  innerDiameter: 42,
  thickness: 16,
  boltCircleDiameter: 90,
  boltHoleDiameter: 10,
  boltCount: 6,
  chamfer: 1,
  material: "Aluminio 6082-T6",
  stockAllowance: 2
};

export const demoFlangeParameters: FlangeParameters = {
  outerDiameter: 100,
  innerDiameter: 30,
  thickness: 12,
  boltCircleDiameter: 70,
  boltHoleDiameter: 6.8,
  boltCount: 6,
  chamfer: 1,
  material: "Aluminio 6082-T6",
  stockAllowance: 2
};

export function validateFlange(params: FlangeParameters) {
  const errors: string[] = [];
  if (params.outerDiameter <= 0) errors.push("O diametro exterior deve ser positivo.");
  if (params.innerDiameter <= 0) errors.push("O diametro interior deve ser positivo.");
  if (params.thickness <= 0) errors.push("A espessura deve ser positiva.");
  if (params.boltHoleDiameter <= 0) errors.push("O diametro dos furos deve ser positivo.");
  if (params.boltCount < 3) errors.push("A flange precisa de pelo menos 3 furos.");
  if (params.innerDiameter >= params.outerDiameter) {
    errors.push("O furo central tem de ser menor que o diametro exterior.");
  }
  if (params.boltCircleDiameter >= params.outerDiameter - params.boltHoleDiameter) {
    errors.push("O circulo de furacao deixa os furos demasiado perto do bordo exterior.");
  }
  if (params.boltCircleDiameter <= params.innerDiameter + params.boltHoleDiameter) {
    errors.push("O circulo de furacao invade a zona do furo central.");
  }
  if (params.chamfer < 0 || params.chamfer > params.thickness / 3) {
    errors.push("O chanfro deve ser positivo e menor que um terco da espessura.");
  }
  return errors;
}

export function getFlangeCadSteps(params: FlangeParameters) {
  return [
    "Criar um novo ficheiro Part (.ipt) no Autodesk Inventor com unidades em milimetros.",
    `Iniciar um sketch no plano XY e desenhar dois circulos concentricos: OD ${params.outerDiameter} mm e ID ${params.innerDiameter} mm.`,
    `Extrudir o anel ${params.thickness} mm em modo Join, com origem no plano medio se quiseres simetria para maquinacao.`,
    `Criar um novo sketch na face frontal e desenhar uma circunferencia de construcao PCD ${params.boltCircleDiameter} mm para o circulo de furacao.`,
    `Colocar um furo ${params.boltHoleDiameter} mm sobre o circulo de construcao e aplicar padrao circular com ${params.boltCount} ocorrencias em torno do eixo central.`,
    `Aplicar chanfro de ${params.chamfer} mm nas duas arestas exteriores, nas arestas do furo central e nas entradas dos furos de fixacao.`,
    "Atribuir material, verificar massa/propriedades fisicas e guardar o ficheiro com o nome do projeto."
  ];
}

export function getFlangeInventorScript(params: FlangeParameters, projectName: string) {
  const chamferBlock =
    params.chamfer > 0
      ? `
' --- Chamfer guidance ---
' Edge ordering can vary between Inventor versions and feature histories.
' The chamfer parameter is declared here and the user is prompted to select:
' outer edges, central bore edges, and bolt-hole entry edges.
Dim flangeChamferCm As Double = ${toCm(params.chamfer)}
MessageBox.Show("Apply a ${params.chamfer} mm chamfer to outer edges, central bore and bolt-hole entries.", "PartPilot - chamfer")
`
      : `
' --- Chamfer guidance ---
' Chamfer parameter is 0 mm. No chamfer requested.
`;

  return `' PartPilot - Inventor iLogic / VBA starter script
' Project: ${escapeVbString(projectName)}
' Part: parametric flange
' Input units: mm
' Inventor API geometry values below are converted to cm.

' --- User parameters ---
Dim flangeOuterDiameterMm As Double = ${params.outerDiameter}
Dim flangeInnerDiameterMm As Double = ${params.innerDiameter}
Dim flangeThicknessMm As Double = ${params.thickness}
Dim boltCircleDiameterMm As Double = ${params.boltCircleDiameter}
Dim boltHoleDiameterMm As Double = ${params.boltHoleDiameter}
Dim boltHoleCount As Integer = ${params.boltCount}
Dim flangeChamferMm As Double = ${params.chamfer}

' --- Converted modelling dimensions ---
Dim outerRadiusCm As Double = ${toCm(params.outerDiameter / 2)}
Dim innerRadiusCm As Double = ${toCm(params.innerDiameter / 2)}
Dim thicknessCm As Double = ${toCm(params.thickness)}
Dim boltCircleRadiusCm As Double = ${toCm(params.boltCircleDiameter / 2)}
Dim boltHoleRadiusCm As Double = ${toCm(params.boltHoleDiameter / 2)}

' --- Document setup ---
Dim partDoc As PartDocument
partDoc = ThisApplication.Documents.Add(DocumentTypeEnum.kPartDocumentObject, , True)

Dim partDef As PartComponentDefinition
partDef = partDoc.ComponentDefinition

Dim transientGeometry As TransientGeometry
transientGeometry = ThisApplication.TransientGeometry

' --- Base sketch: outside diameter and central bore ---
Dim baseSketch As PlanarSketch
baseSketch = partDef.Sketches.Add(partDef.WorkPlanes.Item(3))

Dim origin2d As Point2d
origin2d = transientGeometry.CreatePoint2d(0, 0)

baseSketch.SketchCircles.AddByCenterRadius(origin2d, outerRadiusCm)
baseSketch.SketchCircles.AddByCenterRadius(origin2d, innerRadiusCm)

Dim ringProfile As Profile
ringProfile = baseSketch.Profiles.AddForSolid

' --- Flange thickness extrusion ---
Dim ringExtrudeDefinition As ExtrudeDefinition
ringExtrudeDefinition = partDef.Features.ExtrudeFeatures.CreateExtrudeDefinition(ringProfile, PartFeatureOperationEnum.kJoinOperation)
ringExtrudeDefinition.SetDistanceExtent(thicknessCm, PartFeatureExtentDirectionEnum.kPositiveExtentDirection)

Dim ringBody As ExtrudeFeature
ringBody = partDef.Features.ExtrudeFeatures.Add(ringExtrudeDefinition)

' --- Bolt holes on circular pitch diameter ---
Dim boltSketch As PlanarSketch
boltSketch = partDef.Sketches.Add(ringBody.EndFaces.Item(1))

For holeIndex = 0 To boltHoleCount - 1
    Dim holeAngle As Double = 2 * Math.PI * holeIndex / boltHoleCount
    Dim holeCenter As Point2d
    holeCenter = transientGeometry.CreatePoint2d(Math.Cos(holeAngle) * boltCircleRadiusCm, Math.Sin(holeAngle) * boltCircleRadiusCm)
    boltSketch.SketchCircles.AddByCenterRadius(holeCenter, boltHoleRadiusCm)
Next

Dim boltProfile As Profile
boltProfile = boltSketch.Profiles.AddForSolid

Dim boltCutDefinition As ExtrudeDefinition
boltCutDefinition = partDef.Features.ExtrudeFeatures.CreateExtrudeDefinition(boltProfile, PartFeatureOperationEnum.kCutOperation)
boltCutDefinition.SetThroughAllExtent(PartFeatureExtentDirectionEnum.kNegativeExtentDirection)
partDef.Features.ExtrudeFeatures.Add(boltCutDefinition)
${chamferBlock}
' --- Finish ---
partDoc.DisplayName = "${escapeVbString(projectName)}"
MessageBox.Show("Flange created: OD " & flangeOuterDiameterMm & " mm, ID " & flangeInnerDiameterMm & " mm, thickness " & flangeThicknessMm & " mm, " & boltHoleCount & " holes on PCD " & boltCircleDiameterMm & " mm.", "PartPilot")
`;
}

export function getFlangeCncPlan(params: FlangeParameters): CncOperation[] {
  const stockDiameter = params.outerDiameter + params.stockAllowance * 2;
  const stockThickness = params.thickness + params.stockAllowance;

  return [
    {
      id: "op10",
      setup: "Setup 1 - Torno ou centro CNC com mordentes macios",
      operation: "Facear materia-prima",
      tool: "Fresa de facear OD40 ou ferramenta de faceamento",
      strategy: `Facear ate espessura bruta controlada (${stockThickness.toFixed(1)} mm antes do acabamento).`,
      notes: "Garantir paralelismo da primeira face antes de virar a peca.",
      estimatedMinutes: 6
    },
    {
      id: "op20",
      setup: "Setup 1",
      operation: "Contornar diametro exterior",
      tool: "Fresa topo OD10 ou ferramenta de torneamento exterior",
      strategy: `Desbastar e acabar OD${params.outerDiameter} mm a partir de stock OD${stockDiameter.toFixed(1)} mm.`,
      notes: "Usar passes leves no acabamento para circularidade.",
      estimatedMinutes: 9
    },
    {
      id: "op30",
      setup: "Setup 1",
      operation: "Abrir furo central",
      tool: "Broca piloto + mandriladora/fresa topo OD8",
      strategy: `Interpolar ou mandrilar o furo central ate ID${params.innerDiameter} mm.`,
      notes: "Medir diametro interno antes do passe final.",
      estimatedMinutes: 12
    },
    {
      id: "op40",
      setup: "Setup 1",
      operation: "Furar padrao circular",
      tool: `Broca OD${params.boltHoleDiameter} mm`,
      strategy: `${params.boltCount} furos igualmente espacados em PCD ${params.boltCircleDiameter} mm.`,
      notes: "Usar ciclo G81/G83 conforme profundidade e material.",
      estimatedMinutes: Math.max(8, params.boltCount * 2)
    },
    {
      id: "op50",
      setup: "Setup 2 - Virar peca",
      operation: "Facear a espessura final e chanfrar",
      tool: `Fresa de chanfro 90 deg / chanfrador ${params.chamfer} mm`,
      strategy: `Acabar espessura ${params.thickness} mm e chanfrar arestas ${params.chamfer} mm.`,
      notes: "Quebrar arestas dos furos e validar rebarbas.",
      estimatedMinutes: 10
    }
  ];
}

export function getSetupSheetRows(params: FlangeParameters) {
  return [
    ["Material", params.material],
    ["Stock recomendado", `OD${params.outerDiameter + params.stockAllowance * 2} x ${(params.thickness + params.stockAllowance).toFixed(1)} mm`],
    ["Dimensao final", `OD${params.outerDiameter} x ${params.thickness} mm`],
    ["Furo central", `ID${params.innerDiameter} mm`],
    ["Padrao de furos", `${params.boltCount}x OD${params.boltHoleDiameter} em PCD ${params.boltCircleDiameter} mm`],
    ["Acabamento", `Chanfro ${params.chamfer} mm e rebarba removida`]
  ];
}

export function getCncPlanText(operations: CncOperation[]) {
  return operations
    .map(
      (operation) => `${operation.id.toUpperCase()} - ${operation.operation}
Setup: ${operation.setup}
Ferramenta: ${operation.tool}
Estrategia: ${operation.strategy}
Notas: ${operation.notes}
Tempo estimado: ${operation.estimatedMinutes} min`
    )
    .join("\n\n");
}

function toCm(mm: number) {
  return (mm / 10).toFixed(4);
}

function escapeVbString(value: string) {
  return value.replaceAll('"', '""');
}
