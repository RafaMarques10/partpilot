# PartPilot

PartPilot is a web application for CAD/CNC students that turns mechanical part parameters into technical manufacturing outputs: previews, Autodesk Inventor modelling steps, starter iLogic/VBA scripts, CNC operation plans, and setup sheets.

## Problem

Students often learn CAD, CAM, CNC planning, and setup documentation as separate activities. This creates friction:

- Moving from a mechanical part idea to a CAD model takes time.
- CNC programming requires process planning, not only geometry.
- Setup sheets often stay in paper documents or spreadsheets.
- Technical knowledge becomes scattered across tools and notes.

## Solution

PartPilot provides a guided parametric workflow. A student selects a predefined part family, enters dimensions, and immediately sees the connected CAD/CNC outputs. The goal is to make the relationship between design intent, CAD modelling, CNC planning, and documentation easier to understand and verify.

## Current Features

- Dashboard with local projects stored in the browser.
- Presentation mode for short demos to teachers: `/apresentacao`.
- Technical demo page: `/demo`.
- New project workflow: `/novo-projeto`.
- Parametric part families:
  - Flange.
  - Drilled plate / Placa Furada.
- 2D SVG previews.
- Simple isometric SVG previews.
- Autodesk Inventor modelling steps.
- Starter Inventor iLogic/VBA scripts.
- CNC operation plans with setup, tool, strategy, notes, and estimated time.
- Setup sheet section exportable as PDF through browser print.
- Quick demo examples through buttons and query params:
  - `/novo-projeto?example=flange`
  - `/novo-projeto?example=drilled-plate`
- No paid APIs.
- No backend in the current MVP.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- lucide-react icons
- Browser `localStorage` for local persistence

## How To Run

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

Useful routes:

- `/` - dashboard
- `/novo-projeto` - parametric project builder
- `/apresentacao` - teacher-facing presentation mode
- `/demo` - technical product demo

Run checks:

```bash
pnpm typecheck
pnpm build
```

## Current Limitations

- Supports only predefined parametric part families.
- Does not import or parse technical drawings yet.
- Does not generate final G-code in this version.
- Inventor scripts are starter scripts and may need adaptation depending on Inventor version, templates, units, feature naming, and API configuration.
- CNC operation plans are educational process plans, not certified manufacturing instructions.
- Persistence is local to the browser through `localStorage`.

## Roadmap

- Support in L / L-bracket.
- Simple shaft / eixo simples.
- Technical drawing upload.
- AI-assisted drawing reading.
- Tool library and machining presets.
- Assisted G-code generation with validation.
- Database-backed projects and classroom workflows.
- Teacher mode with evaluation rubrics and guided examples.

## CNC Safety And Validation Notice

PartPilot is an educational and planning tool. Always validate generated geometry, scripts, CNC plans, and setup sheets in Autodesk Inventor/CAM software, and simulate machining before any real-world use. PartPilot does not replace human technical validation, machine-specific setup checks, tooling verification, workholding review, or CNC operator responsibility.
