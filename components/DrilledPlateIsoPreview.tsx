"use client";

import type { DrilledPlateParameters } from "@/lib/types";

type DrilledPlateIsoPreviewProps = {
  params: DrilledPlateParameters;
};

export function DrilledPlateIsoPreview({ params }: DrilledPlateIsoPreviewProps) {
  const width = 560;
  const height = 390;
  const cx = 280;
  const cy = 116;
  const scale = Math.min(300 / params.length, 150 / params.width);
  const plateW = round(params.length * scale);
  const plateD = round(params.width * scale);
  const depthX = round(plateD * 0.52);
  const depthY = round(plateD * 0.34);
  const thick = round(Math.max(18, Math.min(58, params.thickness * 2.2)));
  const x0 = round(cx - plateW / 2);
  const x1 = round(cx + plateW / 2);
  const y0 = cy;
  const y1 = round(cy + depthY);
  const holes = getHoleCenters(params).map((hole) => {
    const localX = (hole.x / params.length - 0.5) * plateW;
    const localY = (hole.y / params.width) * 1;
    return {
      x: round(cx + localX + localY * depthX),
      y: round(y0 + localY * depthY),
      rx: round(Math.max(5, (params.holeDiameter * scale) / 2)),
      ry: round(Math.max(2.5, (params.holeDiameter * scale) / 4))
    };
  });

  const top = `${x0} ${y0} ${x1} ${y0} ${round(x1 + depthX)} ${y1} ${round(x0 + depthX)} ${y1}`;
  const front = `${round(x0 + depthX)} ${y1} ${round(x1 + depthX)} ${y1} ${round(x1 + depthX)} ${round(y1 + thick)} ${round(x0 + depthX)} ${round(y1 + thick)}`;
  const side = `${x1} ${y0} ${round(x1 + depthX)} ${y1} ${round(x1 + depthX)} ${round(y1 + thick)} ${x1} ${round(y0 + thick)}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label="Pre-visualizacao isometrica da placa furada">
      <defs>
        <linearGradient id="plate-iso-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#edf5f6" />
          <stop offset="48%" stopColor="#bccbd2" />
          <stop offset="100%" stopColor="#f8fbfc" />
        </linearGradient>
        <filter id="plate-iso-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#111827" floodOpacity="0.16" />
        </filter>
      </defs>

      <rect width={width} height={height} rx="8" fill="#f7fafb" />
      <path d="M 66 305 H 506 M 96 334 H 476 M 126 278 H 446" stroke="#d7e1e6" strokeWidth="1" strokeDasharray="8 8" />
      <g filter="url(#plate-iso-shadow)">
        <polygon points={front} fill="#536575" opacity="0.94" />
        <polygon points={side} fill="#667887" />
        <polygon points={top} fill="url(#plate-iso-top)" stroke="#475569" strokeWidth="2" />
        {holes.map((hole, index) => (
          <ellipse key={`${hole.x}-${hole.y}-${index}`} cx={hole.x} cy={hole.y} rx={hole.rx} ry={hole.ry} fill="#f7fafb" stroke="#273545" strokeWidth="1.5" />
        ))}
      </g>
      <g fill="#334155" fontSize="13">
        <text x="34" y="38" fontWeight="700" fill="#00a7b5">
          PLACA ISOMETRICA
        </text>
        <text x="34" y="61">
          {params.length} x {params.width} mm
        </text>
        <text x="34" y="82">
          Esp. {params.thickness} mm
        </text>
        <text x="330" y="332" textAnchor="middle">
          {params.holesX} x {params.holesY} furos OD{params.holeDiameter}
        </text>
      </g>
    </svg>
  );
}

function getHoleCenters(params: DrilledPlateParameters) {
  const usableX = params.length - params.marginX * 2;
  const usableY = params.width - params.marginY * 2;
  const pitchX = params.holesX > 1 ? usableX / (params.holesX - 1) : 0;
  const pitchY = params.holesY > 1 ? usableY / (params.holesY - 1) : 0;

  return Array.from({ length: params.holesX * params.holesY }, (_, index) => {
    const ix = index % params.holesX;
    const iy = Math.floor(index / params.holesX);
    return {
      x: params.holesX === 1 ? params.length / 2 : params.marginX + ix * pitchX,
      y: params.holesY === 1 ? params.width / 2 : params.marginY + iy * pitchY
    };
  });
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}
