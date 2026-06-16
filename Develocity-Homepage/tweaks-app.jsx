/* Tweaks island — accent, headline, usage meta for the hero/page. */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#1ec9f2",
  "headline": "Ship reliable AI software with context engineering"
}/*EDITMODE-END*/;

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: { accent: t.accent } }));
  }, [t.accent]);

  React.useEffect(() => {
    const h1 = document.querySelector('.hero h1');
    if (h1 && t.headline) {
      const parts = t.headline.split(/ with /i);
      if (parts.length === 2) h1.innerHTML = parts[0] + '<br/>with <span class="l2">' + parts[1] + '</span>';
      else h1.textContent = t.headline;
    }
  }, [t.headline]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Hero" />
      <TweakText label="Headline" value={t.headline}
        onChange={(v) => setTweak('headline', v)} />
      <TweakSection label="Brand" />
      <TweakColor label="Accent" value={t.accent}
        options={["#1ec9f2", "#3b82f6", "#8b6dff", "#41e486"]}
        onChange={(v) => setTweak('accent', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<TweaksApp />);
