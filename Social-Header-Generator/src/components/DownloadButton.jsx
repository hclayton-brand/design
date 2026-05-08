import { useState } from 'react';
import { toPng } from 'html-to-image';

export function DownloadButton({ targetRef, platform, fileHint }) {
  const [busy, setBusy] = useState(false);

  const handle = async () => {
    if (!targetRef.current || busy) return;
    setBusy(true);
    try {
      const inner = targetRef.current.querySelector('.banner-canvas');
      if (!inner) throw new Error('no canvas');

      const oldTransform = inner.style.transform;
      inner.style.transform = 'none';

      const png = await toPng(inner, {
        width: inner.offsetWidth,
        height: inner.offsetHeight,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: getComputedStyle(inner).backgroundColor,
      });

      inner.style.transform = oldTransform;

      const safeName = (fileHint || 'gradle')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 40) || 'gradle';

      const a = document.createElement('a');
      a.download = `${safeName}-${platform}.png`;
      a.href = png;
      a.click();
    } catch (err) {
      console.error('Download failed', err);
      alert('Download failed: ' + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={busy}
      style={{
        height: 44,
        padding: '0 22px',
        borderRadius: 8,
        background: '#1FB6C1',
        border: '1px solid #1FB6C1',
        color: '#0A0F12',
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: '-0.005em',
        cursor: busy ? 'wait' : 'pointer',
        opacity: busy ? 0.7 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        transition: 'all 140ms',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {busy ? 'Exporting…' : 'Download PNG'}
    </button>
  );
}
