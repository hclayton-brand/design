import { GradleLogo } from './GradleLogo.jsx';

export function GeneratorHeader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '20px 32px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0,
    }}>
      <button type="button" style={{
        width: 32, height: 32, borderRadius: 6,
        background: 'transparent', border: '1px solid rgba(255,255,255,0.10)',
        color: '#FFFFFF', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <GradleLogo height={28} theme="dark" />
      <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.10)' }} />
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 16,
        fontWeight: 600,
        color: '#FFFFFF',
        letterSpacing: '-0.01em',
      }}>
        Social Header Generator
      </div>
    </div>
  );
}
