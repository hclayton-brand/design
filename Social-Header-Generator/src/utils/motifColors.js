export function motifColors(theme) {
  if (theme === 'light') return {
    bg: '#FFFFFF',
    ink: '#0A0F12',
    sub: '#5A6770',
    line: 'rgba(10,15,18,0.08)',
    lineStrong: 'rgba(10,15,18,0.14)',
    accent: '#1FB6C1',
    accentSoft: 'rgba(31,182,193,0.12)',
  };
  if (theme === 'gradient') return {
    bg: 'linear-gradient(90deg, #27A0C4 0%, #46C1C1 100%)',
    ink: '#FFFFFF',
    sub: 'rgba(255,255,255,0.85)',
    line: 'rgba(255,255,255,0.14)',
    lineStrong: 'rgba(255,255,255,0.24)',
    accent: '#FFFFFF',
    accentSoft: 'rgba(255,255,255,0.20)',
  };
  return {
    bg: '#0A0F12',
    ink: '#FFFFFF',
    sub: 'rgba(255,255,255,0.62)',
    line: 'rgba(255,255,255,0.06)',
    lineStrong: 'rgba(255,255,255,0.12)',
    accent: '#5DE7F0',
    accentSoft: 'rgba(93,231,240,0.10)',
  };
}
