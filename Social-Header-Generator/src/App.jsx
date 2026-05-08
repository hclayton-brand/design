import { useState, useRef } from 'react';
import { GeneratorHeader } from './components/GeneratorHeader.jsx';
import { ChromeButton } from './components/ChromeButton.jsx';
import { ChromeInput } from './components/ChromeInput.jsx';
import { FieldLabel } from './components/FieldLabel.jsx';
import { DownloadButton } from './components/DownloadButton.jsx';
import { SocialBanner } from './components/SocialBanner.jsx';
import { PLATFORMS, PLATFORM_LIST, THEME_LIST } from './utils/platforms.js';

const DEFAULT_STATE = {
  platform: 'linkedin',
  theme: 'dark',
  role: 'none',
  badge: '',
  intensity: 0.6,
  showGrid: false,
  accent: '',
};

export default function App() {
  const [state, setState] = useState(DEFAULT_STATE);
  const previewRef = useRef(null);

  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  const platform = PLATFORMS[state.platform];

  // Compute preview scale to fit the available space.
  // The preview panel takes up the right column; we approximate the available
  // width as the viewport minus the 520px controls column, gap, and padding.
  const controlsW = 520;
  const gap = 28;
  const outerPad = 64; // 32px each side
  const panelPad = 48; // 24px each side
  const headerH = 68;
  const bodyPadV = 56; // 28px top + bottom
  const panelChrome = 100; // panel header/footer rows

  // We don't know the exact container width at render time, so we use a
  // reasonable estimate based on the design spec (1280px canvas width).
  // In practice the layout is fluid, so this will be "good enough" for preview.
  const estimatedViewW = Math.min(window.innerWidth, 1600);
  const availW = estimatedViewW - controlsW - gap - outerPad - panelPad;
  const availH = window.innerHeight - headerH - bodyPadV - panelChrome;
  const scaleW = availW / platform.w;
  const scaleH = availH / platform.h;
  const scale = Math.min(scaleW, scaleH, 1);
  const fit = platform.w * scale;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F12',
      color: '#FFFFFF',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Page grid overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <GeneratorHeader />

        <div style={{
          flex: 1,
          padding: '28px 32px',
          display: 'grid',
          gridTemplateColumns: '520px 1fr',
          gap: 28,
          minHeight: 0,
        }}>
          {/* CONTROLS COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.62)', lineHeight: 1.5, margin: 0 }}>
              Create sized headers for social platforms.
            </p>

            <div>
              <FieldLabel>Platform</FieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {PLATFORM_LIST.map((p) => (
                  <ChromeButton
                    key={p.id}
                    active={state.platform === p.id}
                    onClick={() => set({ platform: p.id })}
                  >
                    {p.label}
                  </ChromeButton>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel>Theme</FieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {THEME_LIST.map((t) => (
                  <ChromeButton
                    key={t.id}
                    active={state.theme === t.id}
                    onClick={() => set({ theme: t.id })}
                  >
                    {t.label}
                  </ChromeButton>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel>
                Badge{' '}
                <span style={{ opacity: 0.5, fontWeight: 400, marginLeft: 6 }}>· optional</span>
              </FieldLabel>
              <ChromeInput
                value={state.badge}
                onChange={(v) => set({ badge: v })}
                placeholder="e.g. GradleCon 2026"
              />
            </div>

            <div style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.42)',
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {platform.w} × {platform.h}px
            </div>
          </div>

          {/* PREVIEW PANEL */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            minWidth: 0,
            minHeight: 0,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              flexShrink: 0,
            }}>
              <span>Preview — {platform.label}</span>
              {state.role !== 'none' && (
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>{state.role}</span>
              )}
            </div>

            <div
              ref={previewRef}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: state.theme === 'light' ? '#F5F6F8' : '#000',
                borderRadius: 10,
                padding: 16,
                minHeight: 0,
                overflow: 'hidden',
              }}
            >
              <SocialBanner
                platform={state.platform}
                theme={state.theme}
                role={state.role}
                badge={state.badge}
                intensity={state.intensity}
                showGrid={state.showGrid}
                accent={state.accent || undefined}
                fit={fit}
              />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
            }}>
              <div style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.42)',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
                Brand only
              </div>
              <DownloadButton
                targetRef={previewRef}
                platform={state.platform}
                fileHint={state.badge}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
