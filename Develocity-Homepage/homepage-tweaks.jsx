/* Homepage Tweaks island — accent + section toggles (no headline override). */
const HP_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#1ec9f2",
  "showNews": true
}/*EDITMODE-END*/;

function HomepageTweaks() {
  const [t, setTweak] = useTweaks(HP_TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: { accent: t.accent } }));
  }, [t.accent]);

  React.useEffect(() => {
    const news = document.getElementById('news');
    if (news) news.style.display = t.showNews ? '' : 'none';
  }, [t.showNews]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Brand" />
      <TweakColor label="Accent" value={t.accent}
        options={["#1ec9f2", "#3b82f6", "#8b6dff", "#41e486"]}
        onChange={(v) => setTweak('accent', v)} />
      <TweakSection label="Sections" />
      <TweakToggle label="Show “What’s new”" value={t.showNews}
        onChange={(v) => setTweak('showNews', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<HomepageTweaks />);
