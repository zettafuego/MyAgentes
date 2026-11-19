import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Mock mínimo de /api/health y /api/chat (modo local sin backend Gemini). */
function localApiPlugin(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'alive', latency: 12 }));
          return;
        }
        if (req.url === '/api/chat' && req.method === 'POST') {
          let body = '';
          req.on('data', (c) => (body += c));
          req.on('end', () => {
            let messages: { role: string; content: string }[] = [];
            try {
              messages = JSON.parse(body).messages ?? [];
            } catch {
              /* ignore */
            }
            const last = messages.filter((m) => m.role === 'user').pop()?.content ?? '';
            const text = buildLocalReply(last);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ text }));
          });
          return;
        }
        next();
      });
    },
  };
}

function buildLocalReply(q: string): string {
  const lower = q.toLowerCase();
  if (
    lower.includes('tatu') ||
    lower.includes('cita') ||
    lower.includes('flash') ||
    lower.includes('zetta') ||
    lower.includes('arte')
  ) {
    return `**Tatuaje · Zettafuego**\n\nEduardo lleva **10 años tatuando** (línea fina, neotradicional, color). Galería al hacer scroll en el portafolio.\n\nCitas Lima: **977 740 994** · **eduardoxstrange@gmail.com**\n\nIndica estilo, zona y tamaño si quieres una orientación.`;
  }
  if (
    lower.includes('ssoma') ||
    lower.includes('experiencia') ||
    lower.includes('trabajo') ||
    lower.includes('minería') ||
    lower.includes('mineria') ||
    lower.includes('hvac')
  ) {
    return `**Experiencia**\n\n- Coordinador Técnico SSOMA/Tech en Sinba Sura\n- Minería subterránea, HVAC retail, logística\n- Innovación en Waffles Tech (Unity, Scrum)\n\nCV completo: botón **Descargar CV 2026** del portafolio.`;
  }
  if (
    lower.includes('skill') ||
    lower.includes('python') ||
    lower.includes('react') ||
    lower.includes('ia') ||
    lower.includes('tech') ||
    lower.includes('formación') ||
    lower.includes('formacion')
  ) {
    return `**Skills & formación**\n\nTech: Python, React, JS, Kotlin, Unity, Blender, OpenCV, IA.\nSSOMA: ISO, IPERC, PETS, alto riesgo.\nArte: Bellas Artes (pintura) + **10 años de tatuaje**.\nEstudios: Ingeniería de Minas (UNC), Maestría en IA en curso.`;
  }
  if (lower.includes('contacto') || lower.includes('cv') || lower.includes('email') || lower.includes('whatsapp')) {
    return `**Contacto**\n\n- eduardoxstrange@gmail.com\n- 977 740 994\n- Lima, Perú\n- Alias: Zettafuego\n\nPDF: /EduardoSanchezCV2026.pdf`;
  }
  return `Portafolio de **Eduardo Sanchez (Zettafuego)**:\n\n- **10 años** tatuando\n- Ingeniería · SSOMA · Innovación tech\n- Galería de piezas + CV 2026\n\nPrueba: *tatuaje*, *experiencia*, *skills* o *contacto*.`;
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApiPlugin()],
  server: {
    port: 5173,
  },
});
