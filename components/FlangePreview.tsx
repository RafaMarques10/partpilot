"use client";

import type { FlangeParameters } from "@/lib/types";

type FlangePreviewProps = {
  params: FlangeParameters;
};

export function FlangePreview({ params }: FlangePreviewProps) {
  const size = 420;
  const center = size / 2;
  const maxDiameter = Math.max(params.outerDiameter, 1);
  const scale = 310 / maxDiameter;
  const outerR = round((params.outerDiameter * scale) / 2);
  const innerR = round((params.innerDiameter * scale) / 2);
  const pcdR = round((params.boltCircleDiameter * scale) / 2);
  const boltR = round((params.boltHoleDiameter * scale) / 2);
  const boltAngles = Array.from({ length: params.boltCount }, (_, index) => (Math.PI * 2 * index) / params.boltCount);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" role="img" aria-label="Pre-visualizacao 2D da flange">
      <defs>
        <linearGradient id="flange-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d9e3e7" />
          <stop offset="48%" stopColor="#aebdc5" />
          <stop offset="100%" stopColor="#eef4f5" />
        </linearGradient>
        <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#14202b" floodOpacity="0.16" />
        </filter>
      </defs>
      <rect width={size} height={size} rx="6" fill="#f7fafb" />
      <path d={`M ${center} 36 V ${size - 36} M 36 ${center} H ${size - 36}`} stroke="#d4dee3" strokeWidth="1" strokeDasharray="5 7" />
      <circle cx={center} cy={center} r={outerR} fill="url(#flange-metal)" stroke="#475569" strokeWidth="2" filter="url(#soft-shadow)" />
      <circle cx={center} cy={center} r={pcdR} fill="none" stroke="#00a7b5" strokeWidth="2" strokeDasharray="7 7" />
      <circle cx={center} cy={center} r={innerR} fill="#f7fafb" stroke="#273545" strokeWidth="2" />
      {boltAngles.map((angle) => {
        const x = round(center + Math.cos(angle) * pcdR);
        const y = round(center + Math.sin(angle) * pcdR);
        return <circle key={angle} cx={x} cy={y} r={boltR} fill="#f7fafb" stroke="#273545" strokeWidth="1.8" />;
      })}
      <line x1={center - outerR} y1={center + outerR + 24} x2={center + outerR} y2={center + outerR + 24} stroke="#d6502a" strokeWidth="2" />
      <text x={center} y={center + outerR + 47} textAnchor="middle" fill="#334155" fontSize="15">
        OD{params.outerDiameter} mm
      </text>
      <text x={center} y={center - 10} textAnchor="middle" fill="#14202b" fontSize="15" fontWeight="700">
        ID{params.innerDiameter}
      </text>
      <text x={center} y={center + 15} textAnchor="middle" fill="#334155" fontSize="13">
        {params.thickness} mm esp.
      </text>
    </svg>
  );
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}
