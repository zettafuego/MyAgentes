/** Dos estéticas del portafolio */
export type SuitTheme = 'punk' | 'corp';

export const THEME_META: Record<
  SuitTheme,
  { label: string; subtitle: string; activeClass: string }
> = {
  punk: {
    label: 'NEO-PUNK',
    subtitle: 'Magenta · cian · glitch',
    activeClass: 'bg-fuchsia-600/20 border-fuchsia-400/50 text-fuchsia-300 shadow-[0_0_20px_rgba(232,121,249,0.25)]',
  },
  corp: {
    label: 'CORPORATIVO',
    subtitle: 'Navy · plata · limpio',
    activeClass: 'bg-slate-500/20 border-sky-400/40 text-sky-200 shadow-[0_0_16px_rgba(148,163,184,0.15)]',
  },
};

export function themeText(theme: SuitTheme) {
  return theme === 'punk' ? 'text-fuchsia-400' : 'text-sky-300';
}

export function themeTextSoft(theme: SuitTheme) {
  return theme === 'punk' ? 'text-cyan-300' : 'text-slate-300';
}

export function themeBg(theme: SuitTheme) {
  return theme === 'punk' ? 'bg-fuchsia-500' : 'bg-slate-600';
}

export function themeBgStrong(theme: SuitTheme) {
  return theme === 'punk'
    ? 'bg-fuchsia-600 hover:bg-fuchsia-500'
    : 'bg-slate-700 hover:bg-slate-600';
}

export function themeBorderCard(theme: SuitTheme) {
  return theme === 'punk'
    ? 'border-fuchsia-500/40 shadow-[0_0_40px_rgba(232,121,249,0.12)] text-fuchsia-300'
    : 'border-slate-500/40 shadow-[0_0_30px_rgba(100,116,139,0.12)] text-sky-300';
}

export function themePanel(theme: SuitTheme) {
  return theme === 'punk'
    ? 'shadow-[0_0_80px_rgba(232,121,249,0.2)] hover:border-fuchsia-400/40 border-fuchsia-500/25'
    : 'shadow-[0_0_60px_rgba(71,85,105,0.25)] hover:border-sky-400/30 border-slate-500/30';
}

export function themeHoverBorder(theme: SuitTheme) {
  return theme === 'punk' ? 'hover:border-fuchsia-400/40' : 'hover:border-sky-400/30';
}

export function themeChip(theme: SuitTheme) {
  return theme === 'punk'
    ? 'border-fuchsia-500/35 bg-fuchsia-500/10 text-fuchsia-200'
    : 'border-slate-500/40 bg-slate-500/10 text-sky-200';
}

export function themeScrollHint(theme: SuitTheme) {
  return theme === 'punk' ? 'text-fuchsia-400/70' : 'text-sky-400/70';
}

export function themeFab(theme: SuitTheme) {
  return theme === 'punk'
    ? 'border-fuchsia-400/50 text-fuchsia-300 shadow-[0_0_20px_rgba(232,121,249,0.35)]'
    : 'border-slate-400/40 text-sky-200 shadow-[0_0_16px_rgba(100,116,139,0.3)]';
}

export function themeHex(theme: SuitTheme): number {
  // neon magenta vs corporate steel-blue
  return theme === 'punk' ? 0xe879f9 : 0x7dd3fc;
}

export function themeParticleHex(theme: SuitTheme): number {
  return theme === 'punk' ? 0x22d3ee : 0xcbd5e1;
}

export function themeSecondaryHex(theme: SuitTheme): number {
  return theme === 'punk' ? 0x22d3ee : 0x94a3b8;
}

/** Pitch bias for 3D model lean */
export function themePitch(theme: SuitTheme): number {
  return theme === 'punk' ? 0.28 : -0.06;
}

export function applyThemeToDocument(theme: SuitTheme) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;
}

export function hexPoints(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return pts.join(' ');
}
