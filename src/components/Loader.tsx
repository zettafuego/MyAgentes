import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PROFILE } from '../data/portfolio';

const LINES = [
  'CARGANDO PORTAFOLIO DE EDUARDO SANCHEZ...',
  'SINCRONIZANDO GALERÍA DE TATUAJES (10 AÑOS)...',
  'MONTANDO EXPERIENCIA PROFESIONAL SSOMA / TECH...',
  'CARGANDO MODELO 3D Y ENTORNO VISUAL...',
  'ENLAZANDO CV 2026 Y CONTACTO...',
  'LISTO: ZETTAFUEGO ONLINE',
];

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [pct, setPct] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const done = useRef(onComplete);
  useEffect(() => {
    done.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const start = Date.now();
    const duration = 2400;
    const tick = () => {
      let t = (Date.now() - start) / duration;
      if (t > 1) t = 1;
      setPct(Math.round(t * 100));
      setLineIdx(Math.min(Math.floor(t * LINES.length), LINES.length - 1));
      if (t < 1) timer = setTimeout(tick, 30);
      else
        setTimeout(() => {
          setVisible(false);
          done.current();
        }, 800);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#050505] text-white"
        >
          <div className="relative mb-10 h-36 w-[1.5px] overflow-hidden bg-white/10">
            <motion.div
              initial={{ top: '-100%' }}
              animate={{ top: '100%' }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-fuchsia-500 to-transparent shadow-[0_0_12px_rgba(232,121,249,0.7)]"
            />
          </div>
          <div className="flex flex-col items-center max-w-sm px-6">
            <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-sky-300 mb-1 text-center font-semibold">
              {PROFILE.shortName.toUpperCase()} · {PROFILE.alias.toUpperCase()}
            </div>
            <div className="font-mono text-[7px] tracking-[0.35em] uppercase text-fuchsia-400/70 mb-3">
              Neo-Punk · Corporativo
            </div>
            <div className="flex items-baseline gap-1 select-none">
              <span className="text-6xl font-light tracking-tighter text-white font-sans">{pct}</span>
              <span className="text-sm font-mono text-fuchsia-400/80">%</span>
            </div>
            <div className="mt-8 w-80 h-28 bg-black/40 border border-white/5 rounded p-3 font-mono text-[8px] text-white/50 space-y-1.5 overflow-hidden">
              {LINES.slice(0, lineIdx + 1).map((line, i) => (
                <div
                  key={i}
                  className={`flex gap-2 items-center ${i === lineIdx ? 'text-fuchsia-400 animate-pulse font-medium' : 'text-white/30'}`}
                >
                  <span className="text-[6px] opacity-40">●</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-6 right-8 pointer-events-none text-right font-mono text-[8px] text-white/20 select-none hidden sm:block">
            PORTAFOLIO 3D // LIMA, PERÚ
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
