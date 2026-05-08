export function FieldLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 2,
      color: 'rgba(255,255,255,0.55)',
      textTransform: 'uppercase',
      marginBottom: 10,
    }}>
      {children}
    </div>
  );
}
