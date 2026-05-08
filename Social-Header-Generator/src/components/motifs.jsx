function MotifNone() { return null; }

function MotifDesigner({ w, h, c, intensity = 0.6 }) {
  const op = 0.5 + intensity * 0.5;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern id="dgrid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke={c.line} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#dgrid)" opacity={op} />
      <g opacity={op * 0.9}>
        <path d={`M ${w*0.55} ${h*0.78} C ${w*0.66} ${h*0.30}, ${w*0.82} ${h*0.30}, ${w*0.96} ${h*0.55}`}
          stroke={c.accent} strokeWidth="1.2" fill="none" />
        <line x1={w*0.55} y1={h*0.78} x2={w*0.66} y2={h*0.30} stroke={c.lineStrong} strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1={w*0.96} y1={h*0.55} x2={w*0.82} y2={h*0.30} stroke={c.lineStrong} strokeWidth="0.8" strokeDasharray="3 3" />
        <circle cx={w*0.55} cy={h*0.78} r="3" fill={c.bg.startsWith('#') ? c.bg : '#0A0F12'} stroke={c.accent} strokeWidth="1.2" />
        <circle cx={w*0.96} cy={h*0.55} r="3" fill={c.bg.startsWith('#') ? c.bg : '#0A0F12'} stroke={c.accent} strokeWidth="1.2" />
        <circle cx={w*0.66} cy={h*0.30} r="2" fill={c.accent} />
        <circle cx={w*0.82} cy={h*0.30} r="2" fill={c.accent} />
      </g>
      <g opacity={op * 0.7}>
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1={i * (w / 24)} y1="0" x2={i * (w / 24)} y2={i % 5 === 0 ? 8 : 4} stroke={c.lineStrong} strokeWidth="1" />
        ))}
      </g>
    </svg>
  );
}

function MotifEngineer({ w, h, c, intensity = 0.6 }) {
  const op = 0.5 + intensity * 0.5;
  const lines = ['src/', '├── components/', '│   ├── Header.tsx', '│   └── Banner.tsx', '├── lib/', '│   └── render.ts', '└── index.ts'];
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern id="scan" width="3" height="3" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="3" stroke={c.line} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#scan)" opacity={op * 0.6} />
      <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize={Math.max(11, h * 0.034)} fill={c.sub} opacity={op * 0.85}>
        {lines.map((line, i) => (
          <text key={i} x={w * 0.58} y={h * 0.20 + i * Math.max(15, h * 0.07)}>{line}</text>
        ))}
      </g>
      <g opacity={op * 0.7}>
        <rect x={w * 0.04} y={h * 0.78} width={w * 0.08} height="2" fill="#3FB950" />
        <rect x={w * 0.04} y={h * 0.84} width={w * 0.05} height="2" fill="#F85149" />
        <rect x={w * 0.04} y={h * 0.90} width={w * 0.10} height="2" fill={c.accent} />
      </g>
    </svg>
  );
}

function MotifMarketer({ w, h, c, intensity = 0.6 }) {
  const op = 0.5 + intensity * 0.5;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="mkfade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={c.accent} stopOpacity="0" />
          <stop offset="1" stopColor={c.accent} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <g opacity={op}>
        {[0.55, 0.70, 0.85, 1.0].map((r, i) => (
          <circle key={i} cx={w * 1.05} cy={h * 0.5} r={h * r} fill="none" stroke={c.line} strokeWidth="1" />
        ))}
      </g>
      <g opacity={op * 0.85}>
        {[0.92, 0.74, 0.58, 0.44, 0.32].map((pct, i) => (
          <rect key={i} x={w * 0.55} y={h * 0.18 + i * h * 0.13} width={w * 0.30 * pct} height={h * 0.06} fill="url(#mkfade)" rx="2" />
        ))}
      </g>
      <g opacity={op * 0.9} stroke={c.accent} strokeWidth="1.2" fill="none">
        <polyline points={`${w*0.04},${h*0.86} ${w*0.10},${h*0.74} ${w*0.16},${h*0.80} ${w*0.24},${h*0.62}`} />
      </g>
    </svg>
  );
}

function MotifPM({ w, h, c, intensity = 0.6 }) {
  const op = 0.5 + intensity * 0.5;
  const rows = [{ x: 0.55, len: 0.20 }, { x: 0.62, len: 0.14 }, { x: 0.68, len: 0.22 }, { x: 0.58, len: 0.18 }, { x: 0.74, len: 0.18 }];
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <g opacity={op * 0.6}>
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={w * (0.55 + i * 0.05)} y1={h * 0.12} x2={w * (0.55 + i * 0.05)} y2={h * 0.88}
            stroke={c.line} strokeWidth="1" strokeDasharray="2 4" />
        ))}
      </g>
      <g opacity={op}>
        {rows.map((r, i) => (
          <rect key={i} x={w * r.x} y={h * (0.18 + i * 0.14)} width={w * r.len} height={h * 0.07}
            rx="3" fill={i === 2 ? c.accent : c.lineStrong} />
        ))}
      </g>
      <g opacity={op} transform={`translate(${w*0.04} ${h*0.78})`}>
        <polygon points="0,-6 6,0 0,6 -6,0" fill={c.accent} />
        <line x1="6" y1="0" x2={w * 0.10} y2="0" stroke={c.lineStrong} strokeWidth="1" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}

function MotifData({ w, h, c, intensity = 0.6 }) {
  const op = 0.5 + intensity * 0.5;
  const pts = [];
  let s = 7;
  for (let i = 0; i < 38; i++) {
    s = (s * 9301 + 49297) % 233280;
    const rx = s / 233280;
    s = (s * 9301 + 49297) % 233280;
    const ry = s / 233280;
    const x = 0.55 + rx * 0.42;
    const trend = 0.78 - (x - 0.55) * 1.2;
    const y = trend + (ry - 0.5) * 0.18;
    pts.push([w * x, h * y]);
  }
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <g opacity={op * 0.7}>
        <line x1={w * 0.55} y1={h * 0.85} x2={w * 0.97} y2={h * 0.85} stroke={c.line} strokeWidth="1" />
        <line x1={w * 0.55} y1={h * 0.15} x2={w * 0.55} y2={h * 0.85} stroke={c.line} strokeWidth="1" />
        {[0.30, 0.50, 0.70].map((y, i) => (
          <line key={i} x1={w * 0.55} y1={h * y} x2={w * 0.97} y2={h * y} stroke={c.line} strokeWidth="0.5" strokeDasharray="2 4" />
        ))}
      </g>
      <line x1={w * 0.55} y1={h * 0.78} x2={w * 0.97} y2={h * 0.28} stroke={c.accent} strokeWidth="1.2" opacity={op} />
      <g opacity={op}>
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="2" fill={c.accent} opacity={0.5 + (i % 5) / 10} />
        ))}
      </g>
    </svg>
  );
}

function MotifFounder({ w, h, c, intensity = 0.6 }) {
  const op = 0.5 + intensity * 0.5;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <line x1="0" y1={h * 0.62} x2={w} y2={h * 0.62} stroke={c.line} strokeWidth="1" opacity={op} />
      <g transform={`translate(${w * 0.82} ${h * 0.45})`} opacity={op * 0.9}>
        <circle r={h * 0.32} fill="none" stroke={c.line} strokeWidth="1" />
        <circle r={h * 0.22} fill="none" stroke={c.line} strokeWidth="0.6" strokeDasharray="2 3" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          const r = h * 0.32;
          return (
            <line key={i} x1="0" y1="0" x2={Math.cos(rad) * r} y2={Math.sin(rad) * r}
              stroke={i % 2 === 0 ? c.lineStrong : c.line} strokeWidth={i % 2 === 0 ? 1 : 0.5} />
          );
        })}
        <polygon points={`0,${-h*0.30} 4,0 0,${h*0.30} -4,0`} fill={c.accent} opacity="0.8" />
      </g>
      <g opacity={op * 0.7}>
        {[[0.06,0.18],[0.14,0.32],[0.22,0.12],[0.30,0.40],[0.42,0.22],[0.48,0.50],[0.56,0.28]].map(([x,y],i) => (
          <circle key={i} cx={w*x} cy={h*y} r={i%2===0?1.5:1} fill={c.sub} />
        ))}
      </g>
    </svg>
  );
}

function MotifSales({ w, h, c, intensity = 0.6 }) {
  const op = 0.5 + intensity * 0.5;
  const stages = ['LEAD', 'QUAL', 'PROP', 'NEG', 'WIN'];
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <g opacity={op * 0.85}>
        <line x1={w * 0.55} y1={h * 0.55} x2={w * 0.96} y2={h * 0.55} stroke={c.line} strokeWidth="1" />
        {stages.map((s, i) => {
          const x = w * (0.56 + i * 0.085);
          const isActive = i < 3;
          return (
            <g key={i}>
              <circle cx={x} cy={h * 0.55} r={isActive ? 5 : 4}
                fill={isActive ? c.accent : 'none'} stroke={c.lineStrong} strokeWidth="1" />
              <text x={x} y={h * 0.78} textAnchor="middle"
                fontFamily="ui-sans-serif, system-ui" fontSize={Math.max(9, h * 0.028)}
                letterSpacing="2" fill={c.sub}>{s}</text>
            </g>
          );
        })}
      </g>
      <g opacity={op * 0.7} stroke={c.lineStrong} strokeWidth="1.2">
        {[0,1,2,3].map(i => <line key={i} x1={w*0.04 + i*8} y1={h*0.78} x2={w*0.04 + i*8} y2={h*0.88} />)}
        <line x1={w*0.04 - 4} y1={h*0.88} x2={w*0.04 + 30} y2={h*0.78} />
      </g>
    </svg>
  );
}

function MotifRecruiter({ w, h, c, intensity = 0.6 }) {
  const op = 0.5 + intensity * 0.5;
  const nodes = [[0.58,0.30],[0.66,0.55],[0.62,0.78],[0.74,0.22],[0.78,0.50],[0.74,0.74],[0.86,0.32],[0.90,0.60],[0.94,0.40]];
  const edges = [[0,1],[1,2],[1,3],[3,4],[1,4],[4,5],[4,6],[6,7],[7,8],[6,8]];
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <g opacity={op * 0.85}>
        {edges.map(([a, b], i) => (
          <line key={i} x1={w * nodes[a][0]} y1={h * nodes[a][1]} x2={w * nodes[b][0]} y2={h * nodes[b][1]}
            stroke={c.line} strokeWidth="1" />
        ))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={w * x} cy={h * y} r={i === 4 ? 5 : 3.5}
            fill={i === 4 ? c.accent : 'none'} stroke={c.lineStrong} strokeWidth="1" />
        ))}
      </g>
    </svg>
  );
}

export const ROLES = [
  { id: 'none',      label: 'Brand only',      Motif: MotifNone,      blurb: 'clean · no motif' },
  { id: 'designer',  label: 'Designer',        Motif: MotifDesigner,  blurb: 'grids · béziers' },
  { id: 'engineer',  label: 'Engineer',        Motif: MotifEngineer,  blurb: 'trees · diffs' },
  { id: 'marketer',  label: 'Marketer',        Motif: MotifMarketer,  blurb: 'signal · funnel' },
  { id: 'pm',        label: 'Product Manager', Motif: MotifPM,        blurb: 'roadmap · gantt' },
  { id: 'data',      label: 'Data Scientist',  Motif: MotifData,      blurb: 'scatter · regression' },
  { id: 'founder',   label: 'Founder / Exec',  Motif: MotifFounder,   blurb: 'compass · horizon' },
  { id: 'sales',     label: 'Sales',           Motif: MotifSales,     blurb: 'pipeline · tally' },
  { id: 'recruiter', label: 'Recruiter',       Motif: MotifRecruiter, blurb: 'network · graph' },
];
