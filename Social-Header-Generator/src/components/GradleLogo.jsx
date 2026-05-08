const LOGO = {
  dark:     { src: '/assets/gradle-logo.png',            ar: 3181 / 729, scale: 1.0  },
  gradient: { src: '/assets/gradle-logo-mono-light.png', ar: 3181 / 729, scale: 1.0  },
  light:    { src: '/assets/gradle-logo-light.jpg',      ar: 1910 / 685, scale: 1.55 },
};

export function GradleLogo({ height = 64, theme = 'dark' }) {
  const cfg = LOGO[theme] || LOGO.dark;
  const h = Math.round(height * cfg.scale);
  const w = Math.round(h * cfg.ar);
  return (
    <img
      src={cfg.src}
      width={w}
      height={h}
      alt="Gradle"
      style={{ display: 'block', userSelect: 'none' }}
      draggable={false}
    />
  );
}
