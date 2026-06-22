"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Clock3,
  Code2,
  Cuboid,
  Factory,
  FileSpreadsheet,
  Plus,
  Ruler,
  Sparkles
} from "lucide-react";
import { DrilledPlateIsoPreview } from "@/components/DrilledPlateIsoPreview";
import { FlangeIsoPreview } from "@/components/FlangeIsoPreview";
import { defaultFlangeParameters } from "@/lib/flange";
import { loadProjects } from "@/lib/storage";
import type { DrilledPlateParameters, FlangeParameters, Project } from "@/lib/types";

const partTypes = [
  { name: "Flange", status: "Completa", icon: Ruler, tone: "bg-coolant/10 text-coolant" },
  { name: "Placa furada", status: "Completa", icon: Boxes, tone: "bg-signal/15 text-amber-700" },
  { name: "Suporte em L", status: "Proximo modulo", icon: Factory, tone: "bg-oxide/10 text-oxide" },
  { name: "Eixo simples", status: "Proximo modulo", icon: Cuboid, tone: "bg-slate-200 text-slate-700" }
];

const outputs = [
  { label: "Preview 2D/iso", icon: Cuboid },
  { label: "Passos Inventor", icon: Ruler },
  { label: "Script iLogic", icon: Code2 },
  { label: "Plano CNC", icon: Factory },
  { label: "Setup sheet", icon: FileSpreadsheet }
];

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const latestProject = projects[0];
  const readyCount = useMemo(() => projects.filter((project) => project.status === "ready").length, [projects]);

  return (
    <main className="min-h-screen px-5 py-6 text-graphite md:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="overflow-hidden rounded-lg border border-slate-200 bg-white/92 shadow-panel">
          <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-5 md:p-7">
              <div className="inline-flex items-center gap-2 rounded-md border border-coolant/25 bg-coolant/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-coolant">
                <Sparkles size={14} />
                PartPilot MVP
              </div>
              <h1 className="mt-4 text-3xl font-bold text-graphite md:text-5xl">Assistente CAD/CNC para aulas tecnicas</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Uma ferramenta gratuita para transformar parametros de uma peca em visualizacao, roteiro de modelacao no Inventor,
                script base, plano CNC e setup sheet exportavel.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/novo-projeto"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-graphite px-5 text-sm font-bold text-white transition hover:bg-slate-700"
                >
                  <Plus size={18} />
                  Novo projeto
                </Link>
                <Link
                  href="/apresentacao"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-coolant hover:text-coolant"
                >
                  Modo apresentacao
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-coolant hover:text-coolant"
                >
                  Demo tecnica
                </Link>
              </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0">
              <div className="h-full min-h-[320px] rounded-md border border-slate-200 bg-white">
                {latestProject?.partType === "drilled-plate" ? (
                  <DrilledPlateIsoPreview params={latestProject.parameters as DrilledPlateParameters} />
                ) : (
                  <FlangeIsoPreview params={(latestProject?.parameters as FlangeParameters | undefined) ?? defaultFlangeParameters} />
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-4">
          <Stat label="Projetos locais" value={String(projects.length)} detail="localStorage" />
          <Stat label="Prontos" value={String(readyCount)} detail="sem backend" />
          <Stat label="Pecas completas" value="2" detail="flange + placa" />
          <Stat label="Outputs" value="5" detail="CAD/CNC/PDF" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-lg border border-slate-200 bg-white/94 p-5 shadow-panel">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Projetos recentes</h2>
                <p className="text-sm text-slate-500">Guardados no browser para uma demo rapida em sala.</p>
              </div>
              <Clock3 className="text-coolant" size={22} />
            </div>
            <div className="mt-5 divide-y divide-slate-200">
              {projects.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
                  Ainda nao ha projetos. Cria uma flange e o PartPilot guarda o rascunho localmente.
                </div>
              ) : (
                projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <div className="font-semibold">{project.name}</div>
                      <div className="text-sm text-slate-500">
                        {formatProjectSummary(project)} - atualizado {new Date(project.updatedAt).toLocaleString("pt-PT")}
                      </div>
                    </div>
                    <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{project.status}</span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white/94 p-5 shadow-panel">
            <h2 className="text-xl font-bold">Pipeline de outputs</h2>
            <p className="mt-1 text-sm text-slate-500">Do parametro ao documento de fabrico, sem APIs pagas.</p>
            <div className="mt-5 grid gap-3">
              {outputs.map((output, index) => {
                const Icon = output.icon;
                return (
                  <div key={output.label} className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-coolant/10 text-sm font-bold text-coolant">{index + 1}</span>
                    <Icon size={18} className="text-slate-600" />
                    <span className="font-semibold">{output.label}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white/94 p-5 shadow-panel">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Biblioteca de pecas</h2>
              <p className="mt-1 text-sm text-slate-500">A arquitetura ja separa tipos de peca, parametros e geradores.</p>
            </div>
            <Link href="/novo-projeto" className="inline-flex items-center gap-2 text-sm font-bold text-graphite hover:text-coolant">
              Abrir configurador
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {partTypes.map((part) => {
              const Icon = part.icon;
              return (
                <div key={part.name} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-md ${part.tone}`}>
                    <Icon size={21} />
                  </span>
                  <div className="mt-3 font-semibold">{part.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{part.status}</div>
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}

function formatProjectSummary(project: Project) {
  if (project.partType === "drilled-plate") {
    const params = project.parameters as DrilledPlateParameters;
    return `Placa furada - ${params.length} x ${params.width} x ${params.thickness} mm - ${params.holesX}x${params.holesY} furos`;
  }

  const params = project.parameters as FlangeParameters;
  return `Flange - OD${params.outerDiameter} - ${params.boltCount} furos`;
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/94 p-4 shadow-panel">
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-bold text-graphite">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{detail}</div>
    </div>
  );
}
