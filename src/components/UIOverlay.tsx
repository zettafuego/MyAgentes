import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Palette,
  Zap,
  Glasses,
  Image as ImageIcon,
  Briefcase,
  Code2,
  Mail,
  Download,
  ArrowUpRight,
  RotateCw,
} from 'lucide-react';
import { audio } from '../lib/audio';
import type { SuitTheme } from '../lib/theme';
import { themeText, themeBg, themeHoverBorder, THEME_META } from '../lib/theme';
import { PROFILE } from '../data/portfolio';

export type PanelId = 'galeria' | 'experiencia' | 'skills' | 'contacto';

interface Props {
  onOpenPanel: (id: PanelId) => void;
  suitTheme: SuitTheme;
  onChangeTheme: (t: SuitTheme) => void;
  warpSpeed: number;
  onChangeWarpSpeed: (n: number) => void;
  isFirstPerson: boolean;
  onChangeFirstPerson: (v: boolean) => void;
  modelSpinning: boolean;
  onToggleModelSpin: () => void;
  tourStep: number | null;
  onNextStep: () => void;
  onSkipTour: () => void;
}

const PANELS: { id: PanelId; name: string; desc: string; icon: typeof ImageIcon }[] = [
  { id: 'galeria', name: 'Galería de tatuajes', desc: '10 años · 16 piezas', icon: ImageIcon },
  { id: 'experiencia', name: 'Experiencia', desc: 'SSOMA · Minería · HVAC', icon: Briefcase },
  { id: 'skills', name: 'Skills & formación', desc: 'Tech · IA · Bellas artes', icon: Code2 },
  { id: 'contacto', name: 'Contacto & CV', desc: 'WhatsApp · PDF 2026', icon: Mail },
];

function TourTip({
  step,
  title,
  body,
  theme,
  onNext,
  onSkip,
  last,
}: {
  step: number;
  title: string;
  body: string;
  theme: SuitTheme;
  onNext: () => void;
  onSkip: () => void;
  last?: boolean;
}) {
  const t = themeText(theme);
  const bg = themeBg(theme);
  return (
    <div className="absolute bottom-full left-0 mb-3 w-[300px] max-w-[calc(100vw-32px)] bg-black/90 border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-xl pointer-events-auto z-50">
      <div className="flex justify-between items-center mb-2 font-mono">
        <span className={`text-[8px] uppercase tracking-widest font-bold ${t}`}>Guía rápida</span>
        <span className="text-[8px] text-white/50">Paso {step}/4</span>
      </div>
      <h3 className={`font-mono text-[9px] uppercase font-bold tracking-wider mb-1.5 ${t}`}>{title}</h3>
      <p className="font-mono text-[8px] text-white/60 leading-relaxed mb-3 uppercase tracking-wide">{body}</p>
      <div className="flex justify-between items-center pt-2 border-t border-white/5">
        <button onClick={onSkip} className="text-[7.5px] font-bold text-white/40 hover:text-white/80 uppercase">
          Omitir
        </button>
        <button
          onClick={onNext}
          className={`py-1 px-2.5 rounded-lg text-white text-[7.5px] font-bold uppercase flex items-center gap-1 ${bg}`}
        >
          {last ? 'Listo' : 'Siguiente'}
          <ChevronRight size={8} />
        </button>
      </div>
    </div>
  );
}

export function UIOverlay({
  onOpenPanel,
  suitTheme,
  onChangeTheme,
  warpSpeed,
  onChangeWarpSpeed,
  isFirstPerson,
  onChangeFirstPerson,
  modelSpinning,
  onToggleModelSpin,
  tourStep,
  onNextStep,
  onSkipTour,
}: Props) {
  const [showHero, setShowHero] = useState(true);
  const t = themeText(suitTheme);
  const bg = themeBg(suitTheme);
  const cardHover = themeHoverBorder(suitTheme);

  useEffect(() => {
    const onScroll = () => setShowHero(window.scrollY <= 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const parent = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };
  const child = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
  };

  return (
    <motion.div
      variants={parent}
      initial="hidden"
      animate="visible"
      className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 sm:p-12 font-mono text-white"
    >
      <div className="flex justify-between items-start w-full">
        <motion.div variants={child} className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${bg}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${bg}`} />
            </span>
            <span className="font-light tracking-[0.2em] text-xl sm:text-2xl lowercase text-white">
              {PROFILE.shortName}
            </span>
          </div>
          <p className="text-[9px] uppercase tracking-widest font-semibold opacity-80">
            {PROFILE.alias} · <span className={t}>10 años tatuando</span>
          </p>
        </motion.div>
        <motion.div variants={child} className="flex flex-col items-end gap-3 pointer-events-auto">
          <div className="hidden md:block text-right">
            <p className="text-white/40 text-[9px] uppercase tracking-tighter">{PROFILE.city}</p>
            <p className="text-xs tracking-widest uppercase text-white/90">{PROFILE.title}</p>
          </div>

          {/* Controles siempre visibles: versión + girar modelo */}
          {!isFirstPerson && (
            <div className="flex flex-col items-end gap-2">
              <div className="flex rounded-xl border border-white/15 bg-black/70 backdrop-blur-md p-1 shadow-2xl gap-1">
                {(['punk', 'corp'] as const).map((id) => {
                  const meta = THEME_META[id];
                  const active = suitTheme === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      title={meta.subtitle}
                      onClick={() => {
                        audio.playClickTick();
                        onChangeTheme(id);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[8px] font-bold tracking-wider uppercase transition-all ${
                        active
                          ? meta.activeClass
                          : 'text-white/45 hover:text-white/90 hover:bg-white/10'
                      }`}
                    >
                      {meta.label}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => {
                  audio.playClickTick();
                  onToggleModelSpin();
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-md text-[8px] font-bold tracking-wider uppercase transition-all shadow-2xl ${
                  modelSpinning
                    ? suitTheme === 'punk'
                      ? 'bg-fuchsia-600/25 border-fuchsia-400/50 text-fuchsia-200'
                      : 'bg-sky-600/25 border-sky-400/50 text-sky-200'
                    : 'bg-black/70 border-white/15 text-white/70 hover:text-white hover:bg-black/85'
                }`}
                aria-pressed={modelSpinning}
              >
                <RotateCw size={12} className={modelSpinning ? 'animate-spin' : ''} style={modelSpinning ? { animationDuration: '1.2s' } : undefined} />
                {modelSpinning ? 'Detener giro' : 'Girar modelo'}
              </button>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showHero && !isFirstPerson && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col md:flex-row justify-between items-end w-full gap-8 my-auto pointer-events-auto"
          >
            <div className="max-w-[320px] w-full space-y-4 bg-black/50 border border-white/5 backdrop-blur-md rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-2">
                <div className={`h-[1px] w-6 ${bg}`} />
                <span className="text-[9px] uppercase tracking-wider font-bold text-white/50">Portafolio</span>
              </div>
              <p className="text-[11px] leading-relaxed text-white/55 lowercase tracking-tight">
                ingeniería, ssoma e innovación tecnológica — y{' '}
                <span className="text-white font-medium">diez años de tatuaje</span> como artista plástico y tatuador
                (línea fina, neotradicional y color).
              </p>

              <div className="space-y-2 relative">
                {tourStep === 1 && (
                  <TourTip
                    step={1}
                    theme={suitTheme}
                    title="1. Dos versiones visuales"
                    body="NEO-PUNK: magenta, cian y energía glitch. CORPORATIVO: navy, plata y look ejecutivo limpio. Toda la UI y la escena 3D se recalibran."
                    onNext={onNextStep}
                    onSkip={onSkipTour}
                  />
                )}
                <span className="text-[8px] uppercase tracking-widest text-white/40 flex items-center gap-1.5 font-bold">
                  <Palette size={8} className={t} /> Versión visual
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['punk', 'corp'] as const).map((id) => {
                    const meta = THEME_META[id];
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          audio.playClickTick();
                          onChangeTheme(id);
                        }}
                        className={`text-left px-2.5 py-2 rounded-lg border transition-all cursor-pointer ${
                          suitTheme === id
                            ? meta.activeClass
                            : 'bg-white/5 border-white/5 text-white/40 hover:text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <span className="block text-[8px] font-bold tracking-wider">{meta.label}</span>
                        <span className="block text-[7px] opacity-70 mt-0.5 font-mono normal-case tracking-normal">
                          {meta.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    audio.playClickTick();
                    onToggleModelSpin();
                  }}
                  className={`w-full mt-1 py-2 rounded-lg border text-[8px] font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    modelSpinning
                      ? suitTheme === 'punk'
                        ? 'bg-fuchsia-600/20 border-fuchsia-400/40 text-fuchsia-300'
                        : 'bg-sky-600/20 border-sky-400/40 text-sky-200'
                      : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                  }`}
                  aria-pressed={modelSpinning}
                >
                  <RotateCw size={10} className={modelSpinning ? 'animate-spin' : ''} />
                  {modelSpinning ? 'Detener giro del modelo' : 'Girar modelo en su eje'}
                </button>
              </div>

              <div className="space-y-1.5 relative">
                {tourStep === 2 && (
                  <TourTip
                    step={2}
                    theme={suitTheme}
                    title="2. Velocidad warp"
                    body="Acelera las partículas del fondo. Es solo estética: el portafolio sigue a tu ritmo."
                    onNext={onNextStep}
                    onSkip={onSkipTour}
                  />
                )}
                <div className="flex justify-between text-[8px] uppercase tracking-widest text-white/40 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Zap size={8} className={t} /> Warp
                  </span>
                  <span className={t}>{warpSpeed}X</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={warpSpeed}
                  onChange={(e) => onChangeWarpSpeed(Number(e.target.value))}
                  className={`w-full h-4 appearance-none bg-transparent cursor-pointer
                    [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-runnable-track]:h-1
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:mt-[-4px]
                    ${suitTheme === 'punk' ? '[&::-webkit-slider-thumb]:bg-fuchsia-500' : '[&::-webkit-slider-thumb]:bg-sky-400'}`}
                />
              </div>

              <div className="space-y-1.5 relative">
                {tourStep === 4 && (
                  <TourTip
                    step={4}
                    theme={suitTheme}
                    title="4. Visor AR"
                    body="Modo inmersivo con radar. Opcional: para explorar la escena en primera persona."
                    onNext={onNextStep}
                    onSkip={onSkipTour}
                    last
                  />
                )}
                <button
                  onClick={() => {
                    audio.playUplinkSweep();
                    onChangeFirstPerson(!isFirstPerson);
                  }}
                  className={`w-full py-2 rounded-lg border text-[8px] font-bold tracking-wider uppercase flex items-center justify-center gap-2 ${
                    isFirstPerson
                      ? 'bg-rose-600/10 border-rose-500/40 text-rose-400'
                      : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <Glasses size={10} />
                  {isFirstPerson ? 'Salir visor AR' : 'Activar visor AR'}
                </button>
              </div>

              <a
                href={PROFILE.cvUrl}
                download
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-white/10 bg-white/5 text-[8px] font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/10"
              >
                <Download size={10} /> CV PDF 2026
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 pointer-events-auto max-w-lg w-full sm:w-auto relative">
              {tourStep === 3 && (
                <div className="absolute -top-2 left-0 right-0 z-50">
                  <TourTip
                    step={3}
                    theme={suitTheme}
                    title="3. Navegación"
                    body="Usa las tarjetas o el scroll: galería de tatuajes, experiencia, skills y contacto."
                    onNext={onNextStep}
                    onSkip={onSkipTour}
                  />
                </div>
              )}
              {PANELS.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      audio.playClickTick();
                      onOpenPanel(p.id);
                    }}
                    className={`group flex flex-col justify-between items-start text-left p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md transition-all ${cardHover} hover:bg-white/[0.06] shadow-xl min-h-[100px]`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <Icon size={14} className="text-white/70 group-hover:text-white" />
                      <ArrowUpRight size={10} className="text-white/30 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <div className="mt-3">
                      <h4 className="text-[10px] text-white tracking-wider uppercase font-semibold leading-snug">
                        {p.name}
                      </h4>
                      <p className="text-[8px] text-white/40 mt-1 uppercase tracking-tight">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end w-full">
        <motion.div variants={child} className="space-y-2">
          <nav className="flex gap-6 text-[9px] text-white/30 uppercase tracking-[0.2em] pointer-events-auto">
            <a href="#galeria" className={`hover:opacity-100 opacity-70 transition-colors ${t}`}>
              Galería
            </a>
            <a href="#contacto" className={`hover:opacity-100 opacity-70 transition-colors ${t}`}>
              Contacto
            </a>
            <a href={PROFILE.cvUrl} download className={`hover:opacity-100 opacity-70 transition-colors ${t}`}>
              CV
            </a>
          </nav>
          <p className="text-[8px] text-white/10 uppercase tracking-[0.4em]">{PROFILE.email}</p>
        </motion.div>
        <motion.div
          variants={child}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.8 }}
          className="hidden sm:flex flex-col items-center gap-3 select-none mr-6 pointer-events-none"
        >
          <p className="text-white/40 text-[9px] uppercase tracking-[0.3em] vertical-text">Scroll · galería</p>
          <div className="w-[1px] h-14 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </div>
    </motion.div>
  );
}
