"use client";

import type { FlangeParameters } from "@/lib/types";

type FlangeIsoPreviewProps = {
  params: FlangeParameters;
};

export function FlangeIsoPreview({ params }: FlangeIsoPreviewProps) {
  const width = 560;
  const height = 390;
  const cx = width / 2;
  const cy = 168;
  const outerRx = 170;
  const outerRy = 76;
  const thickness = round(Math.max(18, Math.min(70, params.thickness * 2.1)));
  const innerRatio = params.innerDiameter / Math.max(params.outerDiameter, 1);
  const pcdRatio = params.boltCircleDiameter / Math.max(params.outerDiameter, 1);
  const boltRatio = params.boltHoleDiameter / Math.max(params.outerDiameter, 1);
  const innerRx = round(Math.max(22, outerRx * innerRatio));
  const innerRy = round(Math.max(10, outerRy * innerRatio));
  const pcdRx = round(outerRx * pcdRatio);
  const pcdRy = round(outerRy * pcdRatio);
  const boltRx = round(Math.max(6, outerRx * boltRatio));
  const boltRy = round(Math.max(3, outerRy * boltRatio));
  const bottomY = round(cy + thickness);
  const boreWallY = round(cy + thickness * 0.45);
  const boltAngles = Array.from({ length: params.boltCount }, (_, index) => (Math.PI * 2 * index) / params.boltCount);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label="Pre-visualizacao isometrica da flange">
      <defs>
        <linearGradient id="iso-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#edf5f6" />
          <stop offset="45%" stopColor="#b8c7cf" />
          <stop offset="100%" stopColor="#f8fbfc" />
        </linearGradient>
        <linearGradient id="iso-wall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8ea0aa" />
          <stop offset="100%" stopColor="#536575" />
        </linearGradient>
        <filter id="iso-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#111827" floodOpacity="0.18" />
        </filter>
      </defs>

      <rect width={width} height={height} rx="8" fill="#f7fafb" />
      <path d="M 46 308 H 514 M 82 340 H 478 M 122 282 H 438" stroke="#d7e1e6" strokeWidth="1" strokeDasharray="8 8" />

      <g filter="url(#iso-shadow)">
        <ellipse cx={cx} cy={bottomY} rx={outerRx} ry={outerRy} fill="#536575" opacity="0.9" />
        <path
          d={`M ${cx - outerRx} ${cy} A ${outerRx} ${outerRy} 0 0 0 ${cx + outerRx} ${cy} L ${cx + outerRx} ${bottomY} A ${outerRx} ${outerRy} 0 0 1 ${cx - outerRx} ${bottomY} Z`}
          fill="url(#iso-wall)"
        />
        <ellipse cx={cx} cy={cy} rx={outerRx} ry={outerRy} fill="url(#iso-top)" stroke="#475569" strokeWidth="2" />
        <ellipse cx={cx} cy={cy} rx={pcdRx} ry={pcdRy} fill="none" stroke="#00a7b5" strokeWidth="2" strokeDasharray="8 8" />
        {boltAngles.map((angle) => {
          const x = round(cx + Math.cos(angle) * pcdRx);
          const y = round(cy + Math.sin(angle) * pcdRy);
          return <ellipse key={angle} cx={x} cy={y} rx={boltRx} ry={boltRy} fill="#f7fafb" stroke="#273545" strokeWidth="1.6" />;
        })}
        <ellipse cx={cx} cy={cy} rx={innerRx} ry={innerRy} fill="#f7fafb" stroke="#273545" strokeWidth="2" />
        <path
          d={`M ${round(cx - innerRx)} ${cy} A ${innerRx} ${innerRy} 0 0 0 ${round(cx + innerRx)} ${cy} L ${round(cx + innerRx)} ${boreWallY} A ${innerRx} ${innerRy} 0 0 1 ${round(cx - innerRx)} ${boreWallY} Z`}
          fill="#dce6ea"
          opacity="0.85"
        />
      </g>

      <g fill="#334155" fontSize="13">
        <text x="34" y="38" fontWeight="700" fill="#00a7b5">
          ISOMETRICO PARAMETRICO
        </text>
        <text x="34" y="61">
          OD {params.outerDiameter} mm
        </text>
        <text x="34" y="82">
          ID {params.innerDiameter} mm
        </text>
        <text x="34" y="103">
          Esp. {params.thickness} mm
        </text>
        <text x="360" y="338" textAnchor="middle">
          {params.boltCount} furos OD{params.boltHoleDiameter} em PCD {params.boltCircleDiameter}
        </text>
      </g>
    </svg>
  );
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}
