import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Code2,
  Cuboid,
  Factory,
  FileSpreadsheet,
  Ruler,
  Sparkles,
  Upload
} from "lucide-react";
import { FlangeIsoPreview } from "@/components/FlangeIsoPreview";
import { FlangePreview } from "@/components/FlangePreview";
import { TechnicalValidationNotice } from "@/components/TechnicalValidationNotice";
import {
  defaultFlangeParameters,
  getFlangeCadSteps,
  getFlangeCncPlan,
  getFlangeInventorScript,
  getSetupSheetRows
} from "@/lib/flange";
import { defaultDrilledPlateParameters } from "@/lib/drilledPlate";
import { DrilledPlateIsoPreview } from "@/components/DrilledPlateIsoPreview";

const params = defaultFlangeParameters;
const cadSteps = getFlangeCadSteps(params);
const cncPlan = getFlangeCncPlan(params);
const setupRows = getSetupSheetRows(params);
const script = getFlangeInventorScript(params, "Flange de demonstracao");

const flow = [
  { title: "Escolher peca", text: "O aluno parte de uma familia parametrica, como flange, placa ou suporte.", icon: Cuboid },
  { title: "Inserir dimensoes", text: "Diametros, espessura, PCD, numero de furos, material e sobremetal.", icon: Ruler },
  { title: "Gerar outputs", text: "A app converte parametros em CAD, script, CNC e setup sheet.", icon: Factory }
];

const roadmap = [
  "Mais pecas: placa furada, suporte em L, eixo escalonado e tampas.",
  "Base de dados para turmas, projetos e historico de revisoes.",
  "Upload de desenho tecnico para comparar cotas e parametros.",
  "Exportacao DXF/SVG e templates de setup sheet por escola.",
  "Modo professor com rubricas de avaliacao e exemplos guiados."
];

export default function DemoPage() {
  return (
    <main className="min-h-screen px-5 py-6 text-graphite md:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-lg border border-slate-200 bg-white/94 p-5 shadow-panel md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-coolant">
                <ArrowLeft size={16} />
                Dashboard
              </Link>
              <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-coolant/25 bg-coolant/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-coolant">
                <Sparkles size={14} />
                Apresentacao do produto
              </div>
              <h1 className="mt-4 max-w-4xl text-3xl font-bold md:text-5xl">PartPilot mostra a ligacao entre CAD, CAM e fabrico sem sair do browser</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Para estudantes de CAD/CNC, o maior salto nao e desenhar um circulo: e perceber como uma geometria parametrica
                vira uma sequencia de modelacao, um script, uma estrategia CNC e uma folha de setup coerente.
              </p>
            </div>
            <Link href="/novo-projeto" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-graphite px-4 text-sm font-bold text-white hover:bg-slate-700">
              Abrir flange
              <ArrowRight size={17} />
            </Link>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <Panel title="Problema que resolve" icon={<CheckCircle2 size={20} />}>
            <div className="grid gap-3">
              <Problem text="Os alunos saltam entre teoria, Inventor, folhas de processo e CNC sem uma ponte clara." />
              <Problem text="Pequenas mudancas de cota obrigam a reescrever passos, scripts e plano de operacoes." />
              <Problem text="A documentacao de fabrico costuma aparecer tarde, quando devia acompanhar o raciocinio." />
            </div>
          </Panel>

          <Panel title="Como funciona" icon={<Factory size={20} />}>
            <div className="grid gap-3 md:grid-cols-3">
              {flow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-coolant/10 font-bold text-coolant">{index + 1}</span>
                      <Icon size={18} className="text-slate-600" />
                    </div>
                    <h3 className="mt-3 font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </Panel>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Panel title="Exemplo: flange parametrica" icon={<Cuboid size={20} />}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md border border-slate-200 bg-slate-50">
                <FlangePreview params={params} />
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50">
                <FlangeIsoPreview params={params} />
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <Spec label="OD" value={`${params.outerDiameter} mm`} />
              <Spec label="ID" value={`${params.innerDiameter} mm`} />
              <Spec label="Espessura" value={`${params.thickness} mm`} />
              <Spec label="Furacao" value={`${params.boltCount}x OD${params.boltHoleDiameter} em PCD ${params.boltCircleDiameter}`} />
            </div>
          </Panel>

          <Panel title="Outputs gerados" icon={<FileSpreadsheet size={20} />}>
            <div className="grid gap-3">
              <Output icon={<Cuboid size={18} />} title="Preview 2D e isometrica" text="A geometria reage a diametros, espessura, PCD e numero de furos." />
              <Output icon={<ClipboardList size={18} />} title="Passos Inventor" text={`${cadSteps.length} passos de modelacao com sketch, extrusao, furo central e padrao circular.`} />
              <Output icon={<Code2 size={18} />} title="Script Inventor" text="Codigo iLogic/VBA base com parametros claros e comentarios por bloco." />
              <Output icon={<Factory size={18} />} title="Plano CNC" text={`${cncPlan.length} operacoes com setup, ferramenta, estrategia, notas e tempo estimado.`} />
              <Output icon={<FileSpreadsheet size={18} />} title="Setup sheet" text="Resumo pronto para exportar em PDF pelo browser." />
            </div>
          </Panel>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <Panel title="Expansao: placa furada" icon={<Cuboid size={20} />}>
            <div className="rounded-md border border-slate-200 bg-slate-50">
              <DrilledPlateIsoPreview params={defaultDrilledPlateParameters} />
            </div>
          </Panel>
          <Panel title="Arquitetura preparada para varias pecas" icon={<Ruler size={20} />}>
            <div className="grid gap-3 md:grid-cols-3">
              <Spec label="Modulo" value="lib/drilledPlate" />
              <Spec label="Parametros" value="10 campos" />
              <Spec label="Outputs" value="CAD, script, CNC, setup" />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              A segunda peca usa o mesmo pipeline da flange: parametros, validacao, previews SVG, script Inventor,
              operacoes CNC e setup sheet. Isto mostra que o PartPilot e uma plataforma expansivel, nao uma demo unica.
            </p>
          </Panel>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)]">
          <Panel title="Trecho do script Inventor" icon={<Code2 size={20} />}>
            <TechnicalValidationNotice />
            <pre className="mt-3 max-h-[420px] min-w-0 overflow-auto rounded-md bg-[#111827] p-4 text-xs leading-5 text-slate-100">
              <code>{script}</code>
            </pre>
          </Panel>

          <Panel title="Plano CNC e setup sheet" icon={<Factory size={20} />}>
            <TechnicalValidationNotice />
            <div className="mt-3 space-y-3">
              {cncPlan.slice(0, 3).map((operation) => (
                <div key={operation.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.12em] text-coolant">{operation.id}</div>
                      <h3 className="font-bold">{operation.operation}</h3>
                    </div>
                    <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-600">{operation.estimatedMinutes} min</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{operation.strategy}</p>
                </div>
              ))}
            </div>
            <table className="mt-4 w-full border-collapse text-sm">
              <tbody>
                {setupRows.slice(0, 4).map(([label, value]) => (
                  <tr key={label} className="border-b border-slate-200">
                    <th className="py-3 pr-3 text-left font-semibold text-slate-500">{label}</th>
                    <td className="py-3 text-slate-800">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </section>

        <Panel title="Roadmap futuro" icon={<Upload size={20} />}>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {roadmap.map((item) => (
              <div key={item} className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </main>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white/94 p-5 shadow-panel">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-coolant">{icon}</span>
        <h2 className="font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Problem({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
      {text}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
      <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}

function Output({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
      <span className="mt-1 text-coolant">{icon}</span>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}
