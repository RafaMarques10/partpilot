"use client";

import type { DrilledPlateParameters } from "@/lib/types";

type DrilledPlatePreviewProps = {
  params: DrilledPlateParameters;
};

export function DrilledPlatePreview({ params }: DrilledPlatePreviewProps) {
  const width = 520;
  const height = 360;
  const padding = 54;
  const scale = Math.min(
    (width - padding * 2) / params.length,
    (height - padding * 2) / params.width,
  );
  const plateW = round(params.length * scale);
  const plateH = round(params.width * scale);
  const x0 = round((width - plateW) / 2);
  const y0 = round((height - plateH) / 2);
  const holeR = round((params.holeDiameter * scale) / 2);
  const holes = getHoleCenters(params).map((hole) => ({
    x: round(x0 + hole.x * scale),
    y: round(y0 + hole.y * scale),
  }));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      role="img"
      aria-label="Pre-visualizacao 2D da placa furada"
    >
      <defs>
        <linearGradient id="plate-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#eef4f5" />
          <stop offset="52%" stopColor="#b8c7cf" />
          <stop offset="100%" stopColor="#f8fbfc" />
        </linearGradient>
        <filter id="plate-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="10"
            floodColor="#14202b"
            floodOpacity="0.14"
          />
        </filter>
      </defs>
      <rect width={width} height={height} rx="6" fill="#f7fafb" />
      <path
        d={`M ${x0 - 18} ${height / 2} H ${x0 + plateW + 18} M ${width / 2} ${y0 - 18} V ${y0 + plateH + 18}`}
        stroke="#d4dee3"
        strokeWidth="1"
        strokeDasharray="5 7"
      />
      <rect
        x={x0}
        y={y0}
        width={plateW}
        height={plateH}
        rx="7"
        fill="url(#plate-top)"
        stroke="#475569"
        strokeWidth="2"
        filter="url(#plate-shadow)"
      />
      {holes.map((hole, index) => (
        <circle
          key={`${hole.x}-${hole.y}-${index}`}
          cx={hole.x}
          cy={hole.y}
          r={holeR}
          fill="#f7fafb"
          stroke="#273545"
          strokeWidth="1.8"
        />
      ))}
      <line
        x1={x0}
        y1={y0 + plateH + 26}
        x2={x0 + plateW}
        y2={y0 + plateH + 26}
        stroke="#d6502a"
        strokeWidth="2"
      />
      <text
        x={width / 2}
        y={y0 + plateH + 49}
        textAnchor="middle"
        fill="#334155"
        fontSize="15"
      >
        {params.length} x {params.width} mm
      </text>
      <text
        x={width / 2}
        y={y0 - 18}
        textAnchor="middle"
        fill="#334155"
        fontSize="13"
      >
        {params.holesX} x {params.holesY} furos OD{params.holeDiameter}
      </text>
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
      y: params.holesY === 1 ? params.width / 2 : params.marginY + iy * pitchY,
    };
  });
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}
