import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Palette, Play, Zap } from 'lucide-react';
import { audio } from '../lib/audio';
import { PROFILE } from '../data/portfolio';

interface Props {
  open: boolean;
  onInit: () => void;
}

export function InitModal({ open, onInit }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(232,121,249,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="max-w-md w-full bg-black/70 border border-white/15 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl text-center relative overflow-hidden"
          >
            <div className="theme-card-top absolute top-0 left-0 right-0 h-[2px]" />
            <div className="flex justify-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/30 text-fuchsia-300">
                <Zap size={22} />
              </div>
              <div className="p-3 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300">
                <Building2 size={22} />
              </div>
            </div>
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 font-bold mb-2">
              Portafolio · {PROFILE.alias}
            </h2>
            <h1 className="text-2xl font-light tracking-tight text-white mb-2">{PROFILE.shortName}</h1>
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest mb-4">
              2 versiones · Neo-Punk · Corporativo
            </p>
            <div className="grid grid-cols-2 gap-2 mb-6 text-left">
              <div className="rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/5 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Palette size={10} className="text-fuchsia-400" />
                  <span className="font-mono text-[8px] font-bold text-fuchsia-300 uppercase tracking-wider">
                    Neo-Punk
                  </span>
                </div>
                <p className="font-mono text-[7px] text-white/45 leading-relaxed uppercase">
                  Magenta · cian · glitch · arte
                </p>
              </div>
              <div className="rounded-xl border border-sky-400/25 bg-slate-500/10 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Building2 size={10} className="text-sky-300" />
                  <span className="font-mono text-[8px] font-bold text-sky-200 uppercase tracking-wider">
                    Corporativo
                  </span>
                </div>
                <p className="font-mono text-[7px] text-white/45 leading-relaxed uppercase">
                  Navy · plata · CV · ops
                </p>
              </div>
            </div>
            <p className="font-mono text-[10px] text-white/50 leading-relaxed mb-8 uppercase tracking-wide">
              Galería de tatuajes, experiencia profesional, skills y CV 2026. Música de fondo: Algunas veces.
            </p>
            <button
              onClick={() => {
                audio.playClickTick();
                audio.playTrack(0);
                onInit();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-slate-700 to-sky-600 hover:brightness-110 text-white font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <Play size={12} className="fill-current" />
              Entrar al portafolio
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
