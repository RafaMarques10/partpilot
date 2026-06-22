import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  Code2,
  Cuboid,
  Database,
  Factory,
  FileSpreadsheet,
  Hammer,
  Ruler,
  Sparkles,
  Upload,
} from "lucide-react";
import { DrilledPlateIsoPreview } from "@/components/DrilledPlateIsoPreview";
import { DrilledPlatePreview } from "@/components/DrilledPlatePreview";
import { FlangeIsoPreview } from "@/components/FlangeIsoPreview";
import { FlangePreview } from "@/components/FlangePreview";
import { TechnicalValidationNotice } from "@/components/TechnicalValidationNotice";
import { demoDrilledPlateParameters } from "@/lib/drilledPlate";
import { demoFlangeParameters } from "@/lib/flange";

const flowSteps = [
  {
    title: "Escolher peca",
    text: "Selecionar flange ou placa furada como familia parametrica.",
    icon: Cuboid,
  },
  {
    title: "Inserir dimensoes",
    text: "Editar cotas principais, furos, margens, espessura, material e chanfro.",
    icon: Ruler,
  },
  {
    title: "Gerar preview",
    text: "Ver a peca em 2D tecnico e numa vista isometrica simples.",
    icon: Boxes,
  },
  {
    title: "Gerar script Inventor",
    text: "Criar um script iLogic/VBA base com parametros claros.",
    icon: Code2,
  },
  {
    title: "Gerar CNC/setup",
    text: "Obter plano de operacoes e setup sheet pronta para PDF.",
    icon: FileSpreadsheet,
  },
];

const problems = [
  {
    title: "Da peca para CAD",
    text: "Alunos perdem tempo a traduzir cotas simples em sequencias de modelacao.",
    icon: Ruler,
  },
  {
    title: "Planeamento CNC",
    text: "Programacao CNC exige pensar em setups, ferramentas, operacoes e verificacao.",
    icon: Factory,
  },
  {
    title: "Setup sheets soltas",
    text: "Folhas de setup acabam muitas vezes em papel ou Excel, longe do modelo.",
    icon: FileSpreadsheet,
  },
  {
    title: "Conhecimento disperso",
    text: "CAD, CAM, processo e documentacao ficam separados em ferramentas diferentes.",
    icon: Database,
  },
];

const outputs = [
  {
    title: "Preview 2D/isometrica",
    text: "Visualizacao imediata da geometria e padrao de furos.",
    icon: Cuboid,
  },
  {
    title: "Passos Inventor",
    text: "Roteiro de modelacao para reproduzir a peca em aula.",
    icon: ClipboardList,
  },
  {
    title: "Script iLogic/VBA",
    text: "Codigo base organizado, com parametros e comentarios uteis.",
    icon: Code2,
  },
  {
    title: "Plano CNC",
    text: "Operacoes, setup, ferramentas, estrategia e tempos estimados.",
    icon: Factory,
  },
  {
    title: "Setup sheet PDF",
    text: "Resumo tecnico exportavel pelo browser, sem backend.",
    icon: FileSpreadsheet,
  },
];

const roadmap = [
  { title: "Suporte em L", icon: Hammer },
  { title: "Eixo simples", icon: Cuboid },
  { title: "Upload de desenho tecnico", icon: Upload },
  { title: "IA para leitura de desenho", icon: BrainCircuit },
  { title: "Biblioteca de ferramentas", icon: Factory },
  { title: "G-code assistido com validacao", icon: CheckCircle2 },
];

const currentLimitations = [
  "Suporta apenas pecas parametricas pre-definidas.",
  "Nao substitui validacao humana.",
  "Nao gera G-code final nesta versao.",
  "Scripts podem precisar de adaptacao conforme versao/configuracao do Inventor.",
];

export default function PresentationPage() {
  return (
    <main className="min-h-screen px-5 py-6 text-graphite md:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="overflow-hidden rounded-lg border border-slate-200 bg-white/94 shadow-panel">
          <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="p-5 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-md border border-coolant/25 bg-coolant/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-coolant">
                <Sparkles size={14} />
                Modo apresentacao
              </div>
              <h1 className="mt-5 text-4xl font-bold md:text-6xl">PartPilot</h1>
              <p className="mt-4 max-w-3xl text-xl font-semibold leading-8 text-slate-700">
                De parâmetros mecânicos a CAD, CNC e setup sheet em segundos.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Uma demo curta para mostrar como parametros de uma peca viram
                geometria, roteiro Inventor, script, plano CNC e documentacao de
                setup no mesmo fluxo.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#demo-interativa"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-graphite px-5 text-sm font-bold text-white hover:bg-slate-700"
                >
                  Iniciar demo
                  <ArrowRight size={18} />
                </a>
                <Link
                  href="/novo-projeto"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 hover:border-coolant hover:text-coolant"
                >
                  Criar projeto
                  <Cuboid size={18} />
                </Link>
              </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0">
              <div className="grid h-full min-h-[360px] gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-white">
                  <FlangeIsoPreview params={demoFlangeParameters} />
                </div>
                <div className="rounded-md border border-slate-200 bg-white">
                  <DrilledPlateIsoPreview params={demoDrilledPlateParameters} />
                </div>
              </div>
            </div>
          </div>
        </header>

        <SectionHeader
          eyebrow="01"
          title="Problema"
          text="A dificuldade nao esta so em desenhar: esta em ligar CAD, CNC e documentacao tecnica."
        />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {problems.map((problem) => {
            const Icon = problem.icon;
            return (
              <Card key={problem.title}>
                <Icon className="text-coolant" size={22} />
                <h3 className="mt-4 font-bold">{problem.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {problem.text}
                </p>
              </Card>
            );
          })}
        </section>

        <SectionHeader
          eyebrow="02"
          title="Fluxo"
          text="Cinco passos para mostrar a transformacao completa de parametros em outputs tecnicos."
        />
        <section className="grid gap-3 lg:grid-cols-5">
          {flowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.title}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-coolant/10 font-bold text-coolant">
                    {index + 1}
                  </span>
                  <Icon size={19} className="text-slate-600" />
                </div>
                <h3 className="mt-4 font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.text}
                </p>
              </Card>
            );
          })}
        </section>

        <SectionHeader
          eyebrow="03"
          title="Demo interativa"
          text="Dois exemplos lado a lado para provar que o PartPilot e expansivel."
        />
        <section
          id="demo-interativa"
          className="grid scroll-mt-6 gap-5 lg:grid-cols-2"
        >
          <PartDemo
            title="Flange"
            href="/novo-projeto?example=flange"
            preview={<FlangePreview params={demoFlangeParameters} />}
            params={[
              `OD ${demoFlangeParameters.outerDiameter} mm`,
              `ID ${demoFlangeParameters.innerDiameter} mm`,
              `${demoFlangeParameters.boltCount} furos OD${demoFlangeParameters.boltHoleDiameter}`,
              `PCD ${demoFlangeParameters.boltCircleDiameter} mm`,
            ]}
          />
          <PartDemo
            title="Placa Furada"
            href="/novo-projeto?example=drilled-plate"
            preview={
              <DrilledPlatePreview params={demoDrilledPlateParameters} />
            }
            params={[
              `${demoDrilledPlateParameters.length} x ${demoDrilledPlateParameters.width} mm`,
              `Esp. ${demoDrilledPlateParameters.thickness} mm`,
              `${demoDrilledPlateParameters.holesX} x ${demoDrilledPlateParameters.holesY} furos`,
              `Margens ${demoDrilledPlateParameters.marginX}/${demoDrilledPlateParameters.marginY} mm`,
            ]}
          />
        </section>

        <SectionHeader
          eyebrow="04"
          title="Outputs"
          text="Os mesmos parametros alimentam visualizacao, modelacao, automacao, processo CNC e documentacao."
        />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {outputs.map((output) => {
            const Icon = output.icon;
            return (
              <Card key={output.title}>
                <Icon className="text-coolant" size={22} />
                <h3 className="mt-4 font-bold">{output.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {output.text}
                </p>
              </Card>
            );
          })}
        </section>
        <TechnicalValidationNotice />

        <SectionHeader
          eyebrow="05"
          title="Limitacoes atuais"
          text="O MVP e intencionalmente controlado para ser demonstravel, verificavel e seguro em contexto educativo."
        />
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {currentLimitations.map((limitation) => (
            <Card key={limitation}>
              <CheckCircle2 className="text-coolant" size={22} />
              <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">
                {limitation}
              </p>
            </Card>
          ))}
        </section>

        <SectionHeader
          eyebrow="06"
          title="Roadmap"
          text="O MVP fica pronto para crescer para pecas, ferramentas e validacoes mais avancadas."
        />
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {roadmap.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <Icon className="text-coolant" size={22} />
                <h3 className="mt-4 text-sm font-bold leading-6">
                  {item.title}
                </h3>
              </Card>
            );
          })}
        </section>

        <section className="rounded-lg border border-slate-200 bg-graphite p-6 text-white shadow-panel md:p-8">
          <div className="max-w-5xl text-2xl font-bold leading-9 md:text-4xl md:leading-[1.18]">
            O objetivo não é substituir o programador CNC, é dar-lhe uma base
            técnica mais rápida, organizada e verificável.
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/novo-projeto"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-bold text-graphite hover:bg-slate-100"
            >
              Criar projeto
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/demo"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/25 px-4 text-sm font-bold text-white hover:border-coolant hover:text-coolant"
            >
              Ver demo tecnica
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-coolant">
          {eyebrow}
        </div>
        <h2 className="mt-1 text-2xl font-bold md:text-3xl">{title}</h2>
      </div>
      <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-right">
        {text}
      </p>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <article className="min-w-0 rounded-lg border border-slate-200 bg-white/94 p-5 shadow-panel">
      {children}
    </article>
  );
}

function PartDemo({
  title,
  href,
  preview,
  params,
}: {
  title: string;
  href: string;
  preview: React.ReactNode;
  params: string[];
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white/94 p-5 shadow-panel">
      <div className="flex flex-col gap-4 xl:flex-row">
        <div className="min-h-[260px] flex-1 rounded-md border border-slate-200 bg-slate-50">
          {preview}
        </div>
        <div className="flex min-w-[220px] flex-col gap-3 xl:w-64">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-coolant">
              Exemplo
            </div>
            <h3 className="mt-1 text-xl font-bold">{title}</h3>
          </div>
          <div className="grid gap-2">
            {params.map((param) => (
              <div
                key={param}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
              >
                {param}
              </div>
            ))}
          </div>
          <div className="rounded-md border border-coolant/25 bg-coolant/10 p-3 text-sm leading-6 text-slate-700">
            Outputs: preview, passos Inventor, script iLogic/VBA, plano CNC e
            setup sheet.
          </div>
          <Link
            href={href}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-graphite px-4 text-sm font-bold text-white hover:bg-slate-700"
          >
            Abrir exemplo
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
