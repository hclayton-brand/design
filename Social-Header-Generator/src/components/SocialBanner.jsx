import { PLATFORMS } from '../utils/platforms.js';
import { motifColors } from '../utils/motifColors.js';
import { ROLES } from './motifs.jsx';
import { GradleLogo } from './GradleLogo.jsx';

export function SocialBanner({
  platform = 'linkedin',
  theme = 'dark',
  role = 'none',
  badge = '',
  intensity = 0.6,
  showGrid = false,
  accent,
  fit,
}) {
  const p = PLATFORMS[platform];
  const c = { ...motifColors(theme) };
  if (accent) c.accent = accent;

  const RoleObj = ROLES.find((r) => r.id === role) || ROLES[0];
  const Motif = RoleObj.Motif;

  const isYoutube = platform === 'youtube';
  const safe = isYoutube
    ? { x: (p.w - 1546) / 2, y: (p.h - 423) / 2, w: 1546, h: 423 }
    : { x: 0, y: 0, w: p.w, h: p.h };

  const pad = Math.round(p.h * 0.08);
  const microSize = Math.round(p.h * (isYoutube ? 0.022 : 0.04));
  const logoH = Math.round(p.h * (isYoutube ? 0.13 : 0.26));

  const scale = fit ? fit / p.w : 1;

  const bgStyle = c.bg.startsWith('linear')
    ? { background: c.bg }
    : { background: c.bg };

  return (
    <div style={{
      width: p.w * scale,
      height: p.h * scale,
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <div
        className="banner-canvas"
        data-platform={p.id}
        data-theme={theme}
        data-role={role}
        style={{
          width: p.w,
          height: p.h,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          color: c.ink,
          ...bgStyle,
        }}
      >
        {showGrid && (
          <svg width="100%" height="100%" viewBox={`0 0 ${p.w} ${p.h}`}
            preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <pattern id={`bg-${p.id}-${theme}`} width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke={c.line} strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={p.w} height={p.h} fill={`url(#bg-${p.id}-${theme})`} />
          </svg>
        )}

        <Motif w={p.w} h={p.h} c={c} intensity={intensity} />

        {!isYoutube && badge && (
          <div style={{
            position: 'absolute',
            top: pad,
            right: pad,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: microSize,
            letterSpacing: 3,
            color: c.ink,
            textTransform: 'uppercase',
            padding: `${microSize * 0.5}px ${microSize * 0.9}px`,
            border: `1px solid ${c.lineStrong}`,
            borderRadius: 999,
            background: c.accentSoft,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 999,
              background: c.accent, boxShadow: `0 0 0 3px ${c.accentSoft}`,
              flexShrink: 0,
            }} />
            <span style={{ fontWeight: 700 }}>{badge}</span>
          </div>
        )}

        <div style={{
          position: 'absolute',
          left: isYoutube ? safe.x : pad,
          top: isYoutube ? safe.y : pad,
          width: isYoutube ? safe.w : p.w - pad * 2,
          height: isYoutube ? safe.h : p.h - pad * 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <GradleLogo height={logoH} theme={theme} />

          {!isYoutube && role !== 'none' && (
            <div style={{
              marginTop: p.h * 0.025,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: microSize,
              color: c.sub,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              <span style={{ color: c.accent }}>{RoleObj.blurb}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
