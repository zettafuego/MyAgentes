import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TATTOOS, type TattooWork } from '../data/portfolio';
import type { SuitTheme } from '../lib/theme';
import { themeText } from '../lib/theme';

export function TattooGallery({ suitTheme }: { suitTheme: SuitTheme }) {
  const [active, setActive] = useState<TattooWork | null>(null);
  const t = themeText(suitTheme);

  const openAt = (work: TattooWork) => setActive(work);
  const idx = active ? TATTOOS.findIndex((w) => w.id === active.id) : -1;

  const prev = () => {
    if (idx < 0) return;
    setActive(TATTOOS[(idx - 1 + TATTOOS.length) % TATTOOS.length]);
  };
  const next = () => {
    if (idx < 0) return;
    setActive(TATTOOS[(idx + 1) % TATTOOS.length]);
  };

  return (
    <section id="galeria" className="relative z-20 w-full px-4 sm:px-10 py-24 pointer-events-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center sm:text-left">
          <p className={`font-mono text-[9px] uppercase tracking-[0.35em] font-bold ${t} mb-2`}>
            Portafolio de tatuaje · 10 años
          </p>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-3">
            Galería <span className={t}>Zettafuego</span>
          </h2>
          <p className="font-mono text-[10px] text-white/45 uppercase tracking-wide max-w-2xl leading-relaxed">
            Selección de trabajos reales. Línea fina, neotradicional y color. Clic en cualquier pieza para ampliar.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {TATTOOS.map((work, i) => (
            <motion.button
              key={work.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: (i % 8) * 0.04, duration: 0.45 }}
              onClick={() => openAt(work)}
              className={`group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-black/40 text-left focus:outline-none focus:ring-2 ${
                suitTheme === 'punk' ? 'focus:ring-fuchsia-400/50' : 'focus:ring-sky-400/40'
              }`}
            >
              <img
                src={work.src}
                alt={work.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-mono text-[8px] uppercase tracking-widest text-white/50">{work.style}</p>
                <p className="text-xs text-white font-medium tracking-wide">{work.title}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute top-5 right-5 p-2 rounded-full border border-white/10 bg-black/60 text-white/70 hover:text-white z-10"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 sm:left-6 p-2 rounded-full border border-white/10 bg-black/60 text-white/70 hover:text-white z-10"
              aria-label="Anterior"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 sm:right-6 p-2 rounded-full border border-white/10 bg-black/60 text-white/70 hover:text-white z-10"
              aria-label="Siguiente"
            >
              <ChevronRight size={22} />
            </button>
            <motion.div
              key={active.id}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
            >
              <img
                src={active.src}
                alt={active.alt}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
              />
              <div className="mt-4 text-center">
                <p className={`font-mono text-[9px] uppercase tracking-[0.3em] ${t}`}>{active.style}</p>
                <h3 className="text-lg text-white font-light tracking-tight">{active.title}</h3>
                <p className="font-mono text-[8px] text-white/35 mt-1 uppercase tracking-widest">
                  {idx + 1} / {TATTOOS.length} · Eduardo Sanchez · Zettafuego
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
