import type { CncOperation, DrilledPlateParameters } from "@/lib/types";

export const defaultDrilledPlateParameters: DrilledPlateParameters = {
  length: 160,
  width: 100,
  thickness: 12,
  holeDiameter: 8,
  holesX: 4,
  holesY: 3,
  marginX: 25,
  marginY: 20,
  chamfer: 1,
  material: "Aluminio 6082-T6",
};

export const demoDrilledPlateParameters: DrilledPlateParameters = {
  length: 120,
  width: 80,
  thickness: 10,
  holeDiameter: 6,
  holesX: 4,
  holesY: 3,
  marginX: 15,
  marginY: 15,
  chamfer: 1,
  material: "Aluminio 6082-T6",
};

export function validateDrilledPlate(params: DrilledPlateParameters) {
  const errors: string[] = [];
  if (params.length <= 0) errors.push("O comprimento deve ser positivo.");
  if (params.width <= 0) errors.push("A largura deve ser positiva.");
  if (params.thickness <= 0) errors.push("A espessura deve ser positiva.");
  if (params.holeDiameter <= 0)
    errors.push("O diametro dos furos deve ser positivo.");
  if (params.holesX < 1)
    errors.push("O numero de furos em X deve ser pelo menos 1.");
  if (params.holesY < 1)
    errors.push("O numero de furos em Y deve ser pelo menos 1.");
  if (
    params.marginX < params.holeDiameter / 2 ||
    params.marginY < params.holeDiameter / 2
  ) {
    errors.push("As margens devem ser maiores que o raio do furo.");
  }
  if (params.marginX * 2 >= params.length)
    errors.push("A margem X ocupa todo o comprimento da placa.");
  if (params.marginY * 2 >= params.width)
    errors.push("A margem Y ocupa toda a largura da placa.");
  if (params.chamfer < 0 || params.chamfer > params.thickness / 3) {
    errors.push(
      "O chanfro deve ser positivo e menor que um terco da espessura.",
    );
  }
  return errors;
}

export function getDrilledPlateCadSteps(params: DrilledPlateParameters) {
  return [
    "Criar um novo ficheiro Part (.ipt) no Autodesk Inventor com unidades em milimetros.",
    `Iniciar um sketch no plano XY e desenhar um retangulo ${params.length} x ${params.width} mm centrado na origem.`,
    `Extrudir o perfil ${params.thickness} mm em modo Join para criar a placa base.`,
    `Criar um sketch na face superior e marcar uma grelha de ${params.holesX} x ${params.holesY} furos com margens ${params.marginX} mm em X e ${params.marginY} mm em Y.`,
    `Desenhar furos OD${params.holeDiameter} mm em todas as posicoes da grelha e cortar Through All.`,
    params.chamfer > 0
      ? `Aplicar chanfro de ${params.chamfer} mm no contorno exterior e nas entradas dos furos.`
      : "Sem chanfro solicitado; apenas remover rebarbas no acabamento.",
    "Atribuir material, verificar propriedades fisicas e guardar o ficheiro.",
  ];
}

export function getDrilledPlateInventorScript(
  params: DrilledPlateParameters,
  projectName: string,
) {
  const pitchX =
    params.holesX > 1
      ? (params.length - params.marginX * 2) / (params.holesX - 1)
      : 0;
  const pitchY =
    params.holesY > 1
      ? (params.width - params.marginY * 2) / (params.holesY - 1)
      : 0;
  const chamferBlock =
    params.chamfer > 0
      ? `
' --- Chamfer guidance ---
Dim plateChamferCm As Double = ${toCm(params.chamfer)}
MessageBox.Show("Apply a ${params.chamfer} mm chamfer to the outer contour and hole entries.", "PartPilot - chamfer")
`
      : `
' --- Chamfer guidance ---
' Chamfer parameter is 0 mm. No chamfer requested.
`;

  return `' PartPilot - Inventor iLogic / VBA starter script
' Project: ${escapeVbString(projectName)}
' Part: drilled rectangular plate
' Input units: mm
' Inventor API geometry values below are converted to cm.

' --- User parameters ---
Dim plateLengthMm As Double = ${params.length}
Dim plateWidthMm As Double = ${params.width}
Dim plateThicknessMm As Double = ${params.thickness}
Dim holeDiameterMm As Double = ${params.holeDiameter}
Dim holesInX As Integer = ${params.holesX}
Dim holesInY As Integer = ${params.holesY}
Dim marginXmm As Double = ${params.marginX}
Dim marginYmm As Double = ${params.marginY}
Dim chamferMm As Double = ${params.chamfer}

' --- Converted modelling dimensions ---
Dim halfLengthCm As Double = ${toCm(params.length / 2)}
Dim halfWidthCm As Double = ${toCm(params.width / 2)}
Dim thicknessCm As Double = ${toCm(params.thickness)}
Dim holeRadiusCm As Double = ${toCm(params.holeDiameter / 2)}
Dim firstHoleXCm As Double = ${toCm(-params.length / 2 + params.marginX)}
Dim firstHoleYCm As Double = ${toCm(-params.width / 2 + params.marginY)}
Dim pitchXCm As Double = ${toCm(pitchX)}
Dim pitchYCm As Double = ${toCm(pitchY)}

' --- Document setup ---
Dim partDoc As PartDocument
partDoc = ThisApplication.Documents.Add(DocumentTypeEnum.kPartDocumentObject, , True)

Dim partDef As PartComponentDefinition
partDef = partDoc.ComponentDefinition

Dim transientGeometry As TransientGeometry
transientGeometry = ThisApplication.TransientGeometry

' --- Base sketch: centered rectangle ---
Dim baseSketch As PlanarSketch
baseSketch = partDef.Sketches.Add(partDef.WorkPlanes.Item(3))

Dim p2 As Point2d = transientGeometry.CreatePoint2d(halfLengthCm, halfWidthCm)
baseSketch.SketchLines.AddAsTwoPointCenteredRectangle(transientGeometry.CreatePoint2d(0, 0), p2)

Dim plateProfile As Profile
plateProfile = baseSketch.Profiles.AddForSolid

' --- Plate thickness extrusion ---
Dim plateExtrudeDefinition As ExtrudeDefinition
plateExtrudeDefinition = partDef.Features.ExtrudeFeatures.CreateExtrudeDefinition(plateProfile, PartFeatureOperationEnum.kJoinOperation)
plateExtrudeDefinition.SetDistanceExtent(thicknessCm, PartFeatureExtentDirectionEnum.kPositiveExtentDirection)

Dim plateBody As ExtrudeFeature
plateBody = partDef.Features.ExtrudeFeatures.Add(plateExtrudeDefinition)

' --- Rectangular hole pattern ---
Dim holeSketch As PlanarSketch
holeSketch = partDef.Sketches.Add(plateBody.EndFaces.Item(1))

For ix = 0 To holesInX - 1
    For iy = 0 To holesInY - 1
        Dim holeX As Double = firstHoleXCm + (ix * pitchXCm)
        Dim holeY As Double = firstHoleYCm + (iy * pitchYCm)
        Dim holeCenter As Point2d
        holeCenter = transientGeometry.CreatePoint2d(holeX, holeY)
        holeSketch.SketchCircles.AddByCenterRadius(holeCenter, holeRadiusCm)
    Next
Next

Dim holeProfile As Profile
holeProfile = holeSketch.Profiles.AddForSolid

Dim holeCutDefinition As ExtrudeDefinition
holeCutDefinition = partDef.Features.ExtrudeFeatures.CreateExtrudeDefinition(holeProfile, PartFeatureOperationEnum.kCutOperation)
holeCutDefinition.SetThroughAllExtent(PartFeatureExtentDirectionEnum.kNegativeExtentDirection)
partDef.Features.ExtrudeFeatures.Add(holeCutDefinition)
${chamferBlock}
' --- Finish ---
partDoc.DisplayName = "${escapeVbString(projectName)}"
MessageBox.Show("Drilled plate created: " & plateLengthMm & " x " & plateWidthMm & " x " & plateThicknessMm & " mm, " & holesInX & " x " & holesInY & " holes.", "PartPilot")
`;
}

export function getDrilledPlateCncPlan(
  params: DrilledPlateParameters,
): CncOperation[] {
  const operations: CncOperation[] = [
    {
      id: "op10",
      setup: "Setup 1 - Centro CNC com mordentes paralelos",
      operation: "Facear materia-prima",
      tool: "Fresa de facear OD40",
      strategy: `Facear a primeira face e preparar espessura bruta para acabamento a ${params.thickness} mm.`,
      notes:
        "Confirmar apoio plano e limpar rebarbas antes de virar, se necessario.",
      estimatedMinutes: 7,
    },
    {
      id: "op20",
      setup: "Setup 1",
      operation: "Contornar placa",
      tool: "Fresa topo OD10",
      strategy: `Desbastar e acabar contorno ${params.length} x ${params.width} mm.`,
      notes: "Usar tabs ou mordentes adequados conforme fixacao.",
      estimatedMinutes: 10,
    },
    {
      id: "op30",
      setup: "Setup 1",
      operation: "Furar padrao retangular",
      tool: `Broca OD${params.holeDiameter} mm`,
      strategy: `${params.holesX * params.holesY} furos em grelha ${params.holesX} x ${params.holesY}, margens ${params.marginX}/${params.marginY} mm.`,
      notes: "Usar ciclo G81/G83 conforme material e profundidade.",
      estimatedMinutes: Math.max(8, params.holesX * params.holesY),
    },
  ];

  if (params.chamfer > 0) {
    operations.push({
      id: "op40",
      setup: "Setup 1",
      operation: "Chanfrar contorno e furos",
      tool: `Fresa de chanfro 90 deg / ${params.chamfer} mm`,
      strategy: `Aplicar chanfro ${params.chamfer} mm no contorno exterior e entradas dos furos.`,
      notes: "Inspecionar rebarbas nas duas faces.",
      estimatedMinutes: 8,
    });
  }

  return operations;
}

export function getDrilledPlateSetupSheetRows(params: DrilledPlateParameters) {
  return [
    ["Material", params.material],
    [
      "Dimensao final",
      `${params.length} x ${params.width} x ${params.thickness} mm`,
    ],
    [
      "Padrao de furos",
      `${params.holesX} x ${params.holesY} furos OD${params.holeDiameter} mm`,
    ],
    ["Margens", `X ${params.marginX} mm / Y ${params.marginY} mm`],
    [
      "Acabamento",
      params.chamfer > 0
        ? `Chanfro ${params.chamfer} mm e rebarba removida`
        : "Rebarba removida",
    ],
  ];
}

function toCm(mm: number) {
  return (mm / 10).toFixed(4);
}

function escapeVbString(value: string) {
  return value.replaceAll('"', '""');
}
