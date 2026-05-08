export function ChromeButton({ active, children, onClick, full }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 44,
        flex: full ? 1 : undefined,
        padding: '0 18px',
        borderRadius: 8,
        background: 'transparent',
        border: `1px solid ${active ? '#1FB6C1' : 'rgba(255,255,255,0.10)'}`,
        boxShadow: active ? 'inset 0 0 0 1px rgba(31,182,193,0.55)' : 'none',
        color: '#FFFFFF',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: '-0.005em',
        cursor: 'pointer',
        transition: 'border-color 120ms, background 120ms',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; }}
    >
      {children}
    </button>
  );
}
