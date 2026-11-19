import { motion } from 'framer-motion';
import { Download, Mail, MapPin, Phone, GraduationCap, Briefcase, Palette, Code2 } from 'lucide-react';
import {
  PROFILE,
  EXPERIENCE,
  EDUCATION,
  SKILLS,
  TATTOO_STYLES,
} from '../data/portfolio';
import type { SuitTheme } from '../lib/theme';
import { themeBorderCard, themeText, themeBgStrong, themeChip } from '../lib/theme';

export function ScrollReports({ suitTheme }: { suitTheme: SuitTheme }) {
  const border = themeBorderCard(suitTheme);
  const t = themeText(suitTheme);
  const bg = themeBgStrong(suitTheme);
  const chip = themeChip(suitTheme);

  return (
    <div className="relative w-full z-20 pointer-events-none">
      {/* About + 10 years tattoo */}
      <div className="min-h-screen flex items-center justify-start px-6 sm:px-20 py-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className={`max-w-xl bg-black/65 border rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl pointer-events-auto ${border}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Palette size={12} className={t} />
            <h4 className={`font-mono text-[9px] uppercase tracking-[0.25em] font-bold ${t}`}>
              Sobre mí · Arte & cuerpo
            </h4>
          </div>
          <h2 className="text-2xl font-light tracking-tight text-white mb-3">
            10 años tatuando · artista plástico
          </h2>
          <p className="font-mono text-[10px] text-white/55 leading-relaxed uppercase tracking-wide mb-5">
            {PROFILE.summary}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/5 pt-4">
            {PROFILE.highlights.map((h) => (
              <div key={h.label}>
                <span className={`text-xl font-light tracking-tight ${t}`}>{h.value}</span>
                <p className="font-mono text-[7px] text-white/40 uppercase tracking-widest leading-none mt-1">
                  {h.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TATTOO_STYLES.map((s) => (
              <div key={s.id} className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                <p className={`font-mono text-[9px] font-bold uppercase tracking-wider ${t}`}>{s.name}</p>
                <p className="font-mono text-[8px] text-white/40 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Experience */}
      <div
        id="experiencia"
        className="min-h-screen flex items-center justify-end px-6 sm:px-20 py-20 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className={`max-w-xl w-full bg-black/65 border rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl pointer-events-auto ${border}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={12} className={t} />
            <h4 className={`font-mono text-[9px] uppercase tracking-[0.25em] font-bold ${t}`}>
              Experiencia profesional
            </h4>
          </div>
          <h2 className="text-2xl font-light tracking-tight text-white mb-5">
            SSOMA · Operaciones · Innovación
          </h2>
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
            {EXPERIENCE.map((job) => (
              <div key={job.company + job.period} className="border-t border-white/5 pt-3">
                <p className="text-[11px] text-white font-medium leading-snug">{job.role}</p>
                <p className={`font-mono text-[8px] uppercase tracking-wider mt-0.5 ${t}`}>{job.company}</p>
                <p className="font-mono text-[7px] text-white/35 uppercase mt-0.5">{job.period}</p>
                <ul className="mt-2 space-y-1">
                  {job.bullets.map((b) => (
                    <li key={b} className="font-mono text-[8px] text-white/50 leading-relaxed flex gap-2">
                      <span className={t}>▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Skills + Education */}
      <div
        id="skills"
        className="min-h-screen flex items-center justify-start px-6 sm:px-20 py-20 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className={`max-w-xl bg-black/65 border rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl pointer-events-auto ${border}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Code2 size={12} className={t} />
            <h4 className={`font-mono text-[9px] uppercase tracking-[0.25em] font-bold ${t}`}>
              Skills · Educación
            </h4>
          </div>
          <h2 className="text-2xl font-light tracking-tight text-white mb-5">
            Tech · Seguridad · Arte
          </h2>

          <p className="font-mono text-[8px] text-white/40 uppercase tracking-widest mb-2">Tecnología</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {SKILLS.tech.map((s) => (
              <span
                key={s}
                className="px-2 py-1 rounded-lg border border-white/10 bg-white/[0.03] font-mono text-[8px] text-white/70 uppercase tracking-wide"
              >
                {s}
              </span>
            ))}
          </div>
          <p className="font-mono text-[8px] text-white/40 uppercase tracking-widest mb-2">SSOMA / Ops</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {SKILLS.ssoma.map((s) => (
              <span
                key={s}
                className="px-2 py-1 rounded-lg border border-white/10 bg-white/[0.03] font-mono text-[8px] text-white/70 uppercase tracking-wide"
              >
                {s}
              </span>
            ))}
          </div>
          <p className="font-mono text-[8px] text-white/40 uppercase tracking-widest mb-2">Arte & tatuaje</p>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {SKILLS.art.map((s) => (
              <span
                key={s}
                className={`px-2 py-1 rounded-lg border font-mono text-[8px] uppercase tracking-wide ${chip}`}
              >
                {s}
              </span>
            ))}
          </div>

          <div className="border-t border-white/5 pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap size={12} className={t} />
              <span className="font-mono text-[8px] uppercase tracking-widest text-white/40">Formación</span>
            </div>
            {EDUCATION.map((e) => (
              <div key={e.school}>
                <p className="text-[11px] text-white font-medium">{e.school}</p>
                <p className="font-mono text-[8px] text-white/45 mt-0.5">{e.detail}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Contact — alineado a la izquierda */}
      <div
        id="contacto"
        className="min-h-screen flex items-center justify-start px-6 sm:px-20 py-20 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className={`max-w-lg w-full bg-black/70 border rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl pointer-events-auto text-left ${border}`}
        >
          <h4 className={`font-mono text-[9px] uppercase tracking-[0.25em] font-bold ${t} mb-2`}>
            Contacto · Citas · Proyectos
          </h4>
          <h2 className="text-2xl font-light tracking-tight text-white mb-2">{PROFILE.shortName}</h2>
          <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest mb-6">
            {PROFILE.alias} · {PROFILE.city}
          </p>

          <div className="space-y-3 text-left mb-8">
            <a
              href={`mailto:${PROFILE.email}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
            >
              <Mail size={14} className={t} />
              <span className="font-mono text-[10px] text-white/80">{PROFILE.email}</span>
            </a>
            <a
              href={`tel:+51${PROFILE.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
            >
              <Phone size={14} className={t} />
              <span className="font-mono text-[10px] text-white/80">{PROFILE.phone}</span>
            </a>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.03]">
              <MapPin size={14} className={t} />
              <span className="font-mono text-[9px] text-white/60">{PROFILE.address}</span>
            </div>
          </div>

          <a
            href={PROFILE.cvUrl}
            download
            className={`inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white font-mono text-[10px] font-bold uppercase tracking-widest transition-all active:scale-[0.98] ${bg} shadow-lg`}
          >
            <Download size={14} />
            Descargar CV 2026 (PDF)
          </a>
          <p className="font-mono text-[7px] text-white/25 uppercase tracking-widest mt-4 text-left">
            Portafolio 3D · Eduardo Sanchez · Zettafuego
          </p>
        </motion.div>
      </div>
    </div>
  );
}
