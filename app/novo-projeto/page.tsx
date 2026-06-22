"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  ClipboardList,
  Code2,
  Cuboid,
  Download,
  Factory,
  Save,
  Sparkles,
  Wrench,
} from "lucide-react";
import { DrilledPlateIsoPreview } from "@/components/DrilledPlateIsoPreview";
import { DrilledPlatePreview } from "@/components/DrilledPlatePreview";
import { FlangeIsoPreview } from "@/components/FlangeIsoPreview";
import { FlangePreview } from "@/components/FlangePreview";
import { TechnicalValidationNotice } from "@/components/TechnicalValidationNotice";
import {
  defaultDrilledPlateParameters,
  demoDrilledPlateParameters,
  getDrilledPlateCadSteps,
  getDrilledPlateCncPlan,
  getDrilledPlateInventorScript,
  getDrilledPlateSetupSheetRows,
  validateDrilledPlate,
} from "@/lib/drilledPlate";
import {
  defaultFlangeParameters,
  demoFlangeParameters,
  getCncPlanText,
  getFlangeCadSteps,
  getFlangeCncPlan,
  getFlangeInventorScript,
  getSetupSheetRows,
  validateFlange,
} from "@/lib/flange";
import { createProjectId, saveProject } from "@/lib/storage";
import type {
  DrilledPlateParameters,
  FlangeParameters,
  PartParameters,
  PartType,
  Project,
} from "@/lib/types";

const partOptions: { value: PartType; label: string; enabled: boolean }[] = [
  { value: "flange", label: "Flange", enabled: true },
  { value: "drilled-plate", label: "Placa furada", enabled: true },
  { value: "l-bracket", label: "Suporte em L", enabled: false },
  { value: "simple-shaft", label: "Eixo simples", enabled: false },
];

export default function NewProjectPage() {
  const [projectName, setProjectName] = useState("Flange de treino CNC");
  const [partType, setPartType] = useState<PartType>("flange");
  const [params, setParams] = useState<PartParameters>(defaultFlangeParameters);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [copied, setCopied] = useState<"script" | "cnc" | null>(null);

  const output = useMemo(
    () => buildOutputs(partType, params, projectName),
    [partType, params, projectName],
  );
  const totalMinutes = output.cncPlan.reduce(
    (sum, operation) => sum + operation.estimatedMinutes,
    0,
  );

  useEffect(() => {
    const example = new URLSearchParams(window.location.search).get("example");
    if (example === "flange") {
      applyExample("flange");
    }
    if (example === "drilled-plate") {
      applyExample("drilled-plate");
    }
  }, []);

  function handlePartTypeChange(nextType: PartType) {
    setPartType(nextType);
    setSavedAt(null);
    setCopied(null);
    if (nextType === "flange") {
      setProjectName("Flange de treino CNC");
      setParams(defaultFlangeParameters);
    }
    if (nextType === "drilled-plate") {
      setProjectName("Placa furada de treino CNC");
      setParams(defaultDrilledPlateParameters);
    }
  }

  function applyExample(exampleType: "flange" | "drilled-plate") {
    setSavedAt(null);
    setCopied(null);
    if (exampleType === "flange") {
      setPartType("flange");
      setProjectName("Exemplo de flange PartPilot");
      setParams(demoFlangeParameters);
    }
    if (exampleType === "drilled-plate") {
      setPartType("drilled-plate");
      setProjectName("Exemplo de placa furada PartPilot");
      setParams(demoDrilledPlateParameters);
    }
  }

  function updateParam(key: string, value: string) {
    setParams((current) => ({
      ...current,
      [key]: key === "material" ? value : Number(value),
    }));
  }

  function handleSave() {
    const project: Project = {
      id: createProjectId(),
      name: projectName.trim() || "Projeto sem nome",
      partType,
      status: output.errors.length ? "draft" : "ready",
      updatedAt: new Date().toISOString(),
      parameters: params,
    };
    saveProject(project);
    setSavedAt(
      new Date().toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  }

  async function copyToClipboard(type: "script" | "cnc", value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <main className="min-h-screen px-4 py-5 text-graphite md:px-7">
      <div className="mx-auto max-w-7xl">
        <header className="no-print mb-5 rounded-lg border border-slate-200 bg-white/92 p-4 shadow-panel">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:border-coolant hover:text-coolant"
                aria-label="Voltar"
              >
                <ArrowLeft size={18} />
              </Link>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-coolant">
                  Novo projeto
                </div>
                <h1 className="text-2xl font-bold md:text-3xl">
                  {output.title}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/demo"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:border-coolant hover:text-coolant"
              >
                <Cuboid size={17} />
                Demo tecnica
              </Link>
              <button
                onClick={handleSave}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-graphite px-4 text-sm font-bold text-white hover:bg-slate-700"
              >
                <Save size={17} />
                Guardar
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:border-coolant hover:text-coolant"
              >
                <Download size={17} />
                Exportar PDF
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <Metric
              label="Outputs"
              value="5"
              detail="Preview, CAD, script, CNC, PDF"
            />
            <Metric
              label="Estado"
              value={output.errors.length ? "Rever" : "Valido"}
              detail={
                output.errors.length
                  ? `${output.errors.length} alerta(s)`
                  : "Pronto para apresentar"
              }
            />
            <Metric
              label="Tempo CNC"
              value={`${totalMinutes} min`}
              detail="Estimativa didatica"
            />
            <Metric
              label="Peca ativa"
              value={output.shortName}
              detail="Modulo parametrico"
            />
          </div>
        </header>

        <div className="no-print grid items-start gap-5 xl:grid-cols-[360px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white/94 p-5 shadow-panel">
            <label
              className="block text-sm font-bold text-slate-700"
              htmlFor="projectName"
            >
              Nome do projeto
            </label>
            <input
              id="projectName"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-coolant focus:ring-2 focus:ring-coolant/20"
            />

            <label
              className="mt-5 block text-sm font-bold text-slate-700"
              htmlFor="partType"
            >
              Tipo de peca
            </label>
            <select
              id="partType"
              value={partType}
              onChange={(event) =>
                handlePartTypeChange(event.target.value as PartType)
              }
              className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-coolant focus:ring-2 focus:ring-coolant/20"
            >
              {partOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={!option.enabled}
                >
                  {option.label}
                  {option.enabled ? "" : " (em breve)"}
                </option>
              ))}
            </select>

            <div className="mt-5 rounded-md border border-coolant/20 bg-coolant/10 p-3">
              <div className="flex items-center gap-2 text-sm font-bold text-graphite">
                <Sparkles size={16} className="text-coolant" />
                Exemplos de demonstracao
              </div>
              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={() => applyExample("flange")}
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 hover:border-coolant hover:text-coolant"
                >
                  Usar exemplo de flange
                </button>
                <button
                  type="button"
                  onClick={() => applyExample("drilled-plate")}
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 hover:border-coolant hover:text-coolant"
                >
                  Usar exemplo de placa furada
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {partType === "flange" ? (
                <FlangeFields
                  params={params as FlangeParameters}
                  updateParam={updateParam}
                />
              ) : (
                <DrilledPlateFields
                  params={params as DrilledPlateParameters}
                  updateParam={updateParam}
                />
              )}
            </div>

            <label
              className="mt-5 block text-sm font-bold text-slate-700"
              htmlFor="material"
            >
              Material
            </label>
            <input
              id="material"
              value={params.material}
              onChange={(event) => updateParam("material", event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-coolant focus:ring-2 focus:ring-coolant/20"
            />

            <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
              {output.errors.length === 0 ? (
                <div className="flex items-center gap-2 font-semibold text-emerald-700">
                  <CheckCircle2 size={18} />
                  Parametros validos
                </div>
              ) : (
                <ul className="space-y-2 text-oxide">
                  {output.errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              )}
              {savedAt ? (
                <div className="mt-2 text-slate-500">Guardado as {savedAt}</div>
              ) : null}
            </div>
          </aside>

          <section className="grid items-start gap-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <Panel title="Preview 2D tecnica" icon={<Wrench size={20} />}>
                <div className="aspect-square min-h-[320px] overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                  {output.preview2d}
                </div>
              </Panel>

              <Panel title="Preview isometrica" icon={<Cuboid size={20} />}>
                <div className="aspect-[1.43] min-h-[320px] overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                  {output.previewIso}
                </div>
              </Panel>
            </div>

            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <Panel
                title="Passos CAD para Inventor"
                icon={<ClipboardList size={20} />}
              >
                <ol className="space-y-3">
                  {output.cadSteps.map((step, index) => (
                    <li
                      key={step}
                      className="grid grid-cols-[32px_1fr] gap-3 text-sm leading-6 text-slate-700"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-coolant/10 font-bold text-coolant">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </Panel>

              <Panel
                title="Script Inventor"
                icon={<Code2 size={20} />}
                action={
                  <CopyButton
                    active={copied === "script"}
                    label="Copiar script Inventor"
                    onClick={() =>
                      copyToClipboard("script", output.inventorScript)
                    }
                  />
                }
              >
                <TechnicalValidationNotice />
                <pre className="mt-3 max-h-[420px] min-w-0 overflow-auto rounded-md bg-[#111827] p-4 text-xs leading-5 text-slate-100">
                  <code>{output.inventorScript}</code>
                </pre>
              </Panel>
            </div>

            <Panel
              title="Plano CNC por operacoes"
              icon={<Factory size={20} />}
              action={
                <CopyButton
                  active={copied === "cnc"}
                  label="Copiar plano CNC"
                  onClick={() => copyToClipboard("cnc", output.cncPlanText)}
                />
              }
            >
              <TechnicalValidationNotice />
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {output.cncPlan.map((operation) => (
                  <article
                    key={operation.id}
                    className="rounded-md border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-[0.12em] text-coolant">
                          {operation.id} - {operation.setup}
                        </div>
                        <h3 className="mt-1 font-bold">
                          {operation.operation}
                        </h3>
                      </div>
                      <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-600">
                        {operation.estimatedMinutes} min
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {operation.tool}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      {operation.strategy}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {operation.notes}
                    </p>
                  </article>
                ))}
              </div>
            </Panel>
          </section>
        </div>

        <section className="print-sheet mt-5 rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
          <TechnicalValidationNotice />
          <div className="mt-4 flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.16em] text-coolant">
                Setup sheet
              </div>
              <h2 className="mt-1 text-2xl font-bold">{projectName}</h2>
              <p className="mt-2 text-sm text-slate-500">
                Peca: {output.sheetPartName} - Gerado pelo PartPilot
              </p>
            </div>
            <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-600">
              <div>
                Tempo estimado: <strong>{totalMinutes} min</strong>
              </div>
              <div>
                Estado:{" "}
                <strong>
                  {output.errors.length ? "Rascunho" : "Pronto para revisao"}
                </strong>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h3 className="mb-3 font-bold">Dados principais</h3>
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {output.setupRows.map(([label, value]) => (
                    <tr key={label} className="border-b border-slate-200">
                      <th className="w-44 py-3 pr-4 text-left font-semibold text-slate-500">
                        {label}
                      </th>
                      <td className="py-3 text-slate-800">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="mb-3 font-bold">Operacoes</h3>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-300 text-left text-slate-500">
                    <th className="py-2 pr-3">Op.</th>
                    <th className="py-2 pr-3">Operacao</th>
                    <th className="py-2 pr-3">Ferramenta</th>
                    <th className="py-2">Tempo</th>
                  </tr>
                </thead>
                <tbody>
                  {output.cncPlan.map((operation) => (
                    <tr
                      key={operation.id}
                      className="border-b border-slate-200"
                    >
                      <td className="py-3 pr-3 font-bold text-coolant">
                        {operation.id.toUpperCase()}
                      </td>
                      <td className="py-3 pr-3">{operation.operation}</td>
                      <td className="py-3 pr-3 text-slate-600">
                        {operation.tool}
                      </td>
                      <td className="py-3">{operation.estimatedMinutes} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function buildOutputs(
  partType: PartType,
  params: PartParameters,
  projectName: string,
) {
  if (partType === "drilled-plate") {
    const plateParams = params as DrilledPlateParameters;
    const cncPlan = getDrilledPlateCncPlan(plateParams);
    return {
      title: "Configurador de placa furada",
      shortName: "Placa",
      sheetPartName: "placa furada parametrica",
      errors: validateDrilledPlate(plateParams),
      cadSteps: getDrilledPlateCadSteps(plateParams),
      inventorScript: getDrilledPlateInventorScript(plateParams, projectName),
      cncPlan,
      cncPlanText: getCncPlanText(cncPlan),
      setupRows: getDrilledPlateSetupSheetRows(plateParams),
      preview2d: <DrilledPlatePreview params={plateParams} />,
      previewIso: <DrilledPlateIsoPreview params={plateParams} />,
    };
  }

  const flangeParams = params as FlangeParameters;
  const cncPlan = getFlangeCncPlan(flangeParams);
  return {
    title: "Configurador de flange",
    shortName: "Flange",
    sheetPartName: "flange parametrica",
    errors: validateFlange(flangeParams),
    cadSteps: getFlangeCadSteps(flangeParams),
    inventorScript: getFlangeInventorScript(flangeParams, projectName),
    cncPlan,
    cncPlanText: getCncPlanText(cncPlan),
    setupRows: getSetupSheetRows(flangeParams),
    preview2d: <FlangePreview params={flangeParams} />,
    previewIso: <FlangeIsoPreview params={flangeParams} />,
  };
}

function FlangeFields({
  params,
  updateParam,
}: {
  params: FlangeParameters;
  updateParam: (key: string, value: string) => void;
}) {
  return (
    <>
      <NumberField
        label="Diametro exterior"
        unit="mm"
        value={params.outerDiameter}
        onChange={(value) => updateParam("outerDiameter", value)}
        min={40}
        max={500}
      />
      <NumberField
        label="Diametro interior"
        unit="mm"
        value={params.innerDiameter}
        onChange={(value) => updateParam("innerDiameter", value)}
        min={5}
        max={300}
      />
      <NumberField
        label="Espessura"
        unit="mm"
        value={params.thickness}
        onChange={(value) => updateParam("thickness", value)}
        min={3}
        max={100}
      />
      <NumberField
        label="PCD furacao"
        unit="mm"
        value={params.boltCircleDiameter}
        onChange={(value) => updateParam("boltCircleDiameter", value)}
        min={20}
        max={450}
      />
      <NumberField
        label="Diametro dos furos"
        unit="mm"
        value={params.boltHoleDiameter}
        onChange={(value) => updateParam("boltHoleDiameter", value)}
        min={2}
        max={50}
      />
      <NumberField
        label="Numero de furos"
        unit="x"
        value={params.boltCount}
        onChange={(value) => updateParam("boltCount", value)}
        min={3}
        max={16}
        step={1}
      />
      <NumberField
        label="Chanfro"
        unit="mm"
        value={params.chamfer}
        onChange={(value) => updateParam("chamfer", value)}
        min={0}
        max={10}
        step={0.5}
      />
      <NumberField
        label="Sobremetal"
        unit="mm"
        value={params.stockAllowance}
        onChange={(value) => updateParam("stockAllowance", value)}
        min={0}
        max={10}
        step={0.5}
      />
    </>
  );
}

function DrilledPlateFields({
  params,
  updateParam,
}: {
  params: DrilledPlateParameters;
  updateParam: (key: string, value: string) => void;
}) {
  return (
    <>
      <NumberField
        label="Comprimento"
        unit="mm"
        value={params.length}
        onChange={(value) => updateParam("length", value)}
        min={30}
        max={800}
      />
      <NumberField
        label="Largura"
        unit="mm"
        value={params.width}
        onChange={(value) => updateParam("width", value)}
        min={20}
        max={500}
      />
      <NumberField
        label="Espessura"
        unit="mm"
        value={params.thickness}
        onChange={(value) => updateParam("thickness", value)}
        min={3}
        max={80}
      />
      <NumberField
        label="Diametro dos furos"
        unit="mm"
        value={params.holeDiameter}
        onChange={(value) => updateParam("holeDiameter", value)}
        min={2}
        max={50}
      />
      <NumberField
        label="Furos em X"
        unit="x"
        value={params.holesX}
        onChange={(value) => updateParam("holesX", value)}
        min={1}
        max={12}
        step={1}
      />
      <NumberField
        label="Furos em Y"
        unit="x"
        value={params.holesY}
        onChange={(value) => updateParam("holesY", value)}
        min={1}
        max={12}
        step={1}
      />
      <NumberField
        label="Margem X"
        unit="mm"
        value={params.marginX}
        onChange={(value) => updateParam("marginX", value)}
        min={1}
        max={200}
      />
      <NumberField
        label="Margem Y"
        unit="mm"
        value={params.marginY}
        onChange={(value) => updateParam("marginY", value)}
        min={1}
        max={200}
      />
      <NumberField
        label="Chanfro opcional"
        unit="mm"
        value={params.chamfer}
        onChange={(value) => updateParam("chamfer", value)}
        min={0}
        max={10}
        step={0.5}
      />
    </>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-bold text-graphite">{value}</div>
      <div className="text-xs text-slate-500">{detail}</div>
    </div>
  );
}

function NumberField({
  label,
  unit,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm font-bold text-slate-700">
        {label}
        <span className="text-xs font-semibold text-slate-400">{unit}</span>
      </span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-coolant focus:ring-2 focus:ring-coolant/20"
      />
    </label>
  );
}

function CopyButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  const Icon = active ? ClipboardCheck : Clipboard;
  return (
    <button
      onClick={onClick}
      className="inline-flex min-h-8 items-center gap-2 rounded-md border border-slate-300 px-3 py-1 text-xs font-bold hover:border-coolant hover:text-coolant"
    >
      <Icon size={14} />
      {active ? "Copiado" : label}
    </button>
  );
}

function Panel({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white/94 p-5 shadow-panel">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-coolant">{icon}</span>
          <h2 className="font-bold">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
