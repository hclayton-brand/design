import { useState } from 'react';

export function ChromeInput({ value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      style={{
        width: '100%',
        height: 44,
        padding: '0 16px',
        borderRadius: 8,
        background: 'transparent',
        border: `1px solid ${focused ? '#1FB6C1' : 'rgba(255,255,255,0.10)'}`,
        color: '#FFFFFF',
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        outline: 'none',
        transition: 'border-color 120ms',
        boxSizing: 'border-box',
      }}
    />
  );
}
