import { AnimatePresence, motion } from 'framer-motion';
import { X, Briefcase } from 'lucide-react';
import { audio } from '../lib/audio';
import type { SuitTheme } from '../lib/theme';
import { themeText, themeBgStrong } from '../lib/theme';

interface Props {
  open: boolean;
  onClose: () => void;
  suitTheme: SuitTheme;
}

export function ChambaPopup({ open, onClose, suitTheme }: Props) {
  const t = themeText(suitTheme);
  const btn = themeBgStrong(suitTheme);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:justify-end p-4 sm:p-8 pointer-events-none"
        >
          {/* soft dim behind popup only */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px] pointer-events-auto"
            onClick={() => {
              audio.playClickTick();
              onClose();
            }}
          />

          <motion.div
            role="dialog"
            aria-label="Aviso Chambeador 3000"
            initial={{ opacity: 0, y: 40, scale: 0.92, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 30, scale: 0.95, x: 10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 160 }}
            className="relative pointer-events-auto w-full max-w-[340px] sm:max-w-[360px] bg-black/85 border border-white/15 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <div className="theme-card-top absolute top-0 left-0 right-0 h-[2px] z-10" />

            {/* Windows-style title bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-2 min-w-0">
                <Briefcase size={12} className={t} />
                <span className={`font-mono text-[8px] font-bold uppercase tracking-widest truncate ${t}`}>
                  Aviso · Chambeador 3000
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  audio.playClickTick();
                  onClose();
                }}
                className="p-1 rounded-md border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cerrar aviso"
              >
                <X size={12} />
              </button>
            </div>

            <div className="px-3 pt-3">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-amber-300/90 font-bold text-center mb-2 animate-pulse">
                ⚠ Piensen en los niños… o sea, en Eduardo
              </p>
              <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                <img
                  src="/dame-chamba.png"
                  alt="Eduardo busca chamba — Chambeador 3000"
                  className="w-full h-auto max-h-[280px] object-contain object-bottom select-none"
                  draggable={false}
                />
              </div>
            </div>

            <div className="p-4 space-y-2 text-center">
              <h3 className="text-lg font-semibold tracking-tight text-white leading-none">BUSCO CHAMBA</h3>
              <p className={`font-mono text-[11px] font-bold uppercase tracking-[0.2em] ${t}`}>
                Chambeador 3000
              </p>
              <p className="font-mono text-[9px] text-white/55 leading-relaxed uppercase tracking-wide">
                Las ganas de trabajar se venden por separado.
              </p>
              <p className="font-mono text-[7px] text-white/30 uppercase tracking-widest pt-1">
                Portafolio · CV 2026 · Disponible en Lima
              </p>
              <button
                type="button"
                onClick={() => {
                  audio.playClickTick();
                  onClose();
                  document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full mt-2 py-2.5 rounded-xl text-white font-mono text-[9px] font-bold uppercase tracking-widest ${btn} active:scale-[0.98] transition-all`}
              >
                Contrátame / Contacto
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
