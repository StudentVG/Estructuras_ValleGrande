import { motion } from "framer-motion";
import { useAuth } from "../../context/useAuth";

const fadeUp = {
     hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
     show: (i = 0) => ({
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.55, ease: "easeOut", delay: i * 0.1 },
     }),
};

const SUBJECTS = [
     { num: "01", label: "Análisis funcional", desc: "Relevamiento de procesos y requisitos de sistemas de información.", icon: "◈" },
     { num: "02", label: "Herramientas ofimáticas", desc: "Suite Google Workspace y Microsoft 365 aplicadas al entorno profesional.", icon: "⊞" },
     { num: "03", label: "Programación estructurada", desc: "Fundamentos de lógica, variables, condicionales y bucles con GAS.", icon: "{ }" },
     { num: "04", label: "Algoritmos y estructura de datos", desc: "Diseño de algoritmos, arrays, objetos y funciones en JavaScript.", icon: "⟳" },
     { num: "05", label: "Sistemas operativos y virtualización", desc: "Windows, Linux y entornos virtualizados para desarrollo.", icon: "⬡" },
     { num: "06", label: "Comunicación efectiva", desc: "Documentación técnica, presentaciones y comunicación en equipos de TI.", icon: "◎" },
     { num: "07", label: "Creatividad y disrupción digital", desc: "Metodologías ágiles, design thinking e innovación tecnológica.", icon: "✦" },
     { num: "08", label: "Inglés elemental", desc: "Lectura técnica y vocabulario esencial para el entorno IT.", icon: "A" },
];

const GAS_TOOLS = [
     {
          label: "Google Sheets", desc: "Hojas de cálculo con lógica avanzada", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: (
               <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M19.267 0H4.732C2.636 0 .938 1.698.938 3.794v16.412C.938 22.302 2.636 24 4.732 24h14.535C21.363 24 23.061 22.302 23.061 20.206V3.794C23.061 1.698 21.363 0 19.267 0zm-1.4 18.9H6.133V5.1h11.734v13.8zm-8.8-10.4h2.267v1.4H9.067V8.5zm0 2.8h2.267v1.4H9.067v-1.4zm0 2.8h2.267v1.4H9.067v-1.4zm3.6-5.6h2.267v1.4h-2.267V8.5zm0 2.8h2.267v1.4h-2.267v-1.4zm0 2.8h2.267v1.4h-2.267v-1.4z" /></svg>
          )
     },
     {
          label: "Google Forms", desc: "Formularios y recolección de datos", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", icon: (
               <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M19.267 0H4.732C2.636 0 .938 1.698.938 3.794v16.412C.938 22.302 2.636 24 4.732 24h14.535C21.363 24 23.061 22.302 23.061 20.206V3.794C23.061 1.698 21.363 0 19.267 0zM8.5 17H6.5v-2h2v2zm0-4H6.5v-2h2v2zm0-4H6.5V7h2v2zm9 8h-6.5v-2H17.5v2zm0-4h-6.5v-2H17.5v2zm0-4h-6.5V7H17.5v2z" /></svg>
          )
     },
     {
          label: "Google Drive", desc: "Gestión y organización de archivos", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: (
               <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M4.651 20.687L1.886 15.9 7.418 6.3h4.898l-5.532 9.6 2.765 4.787H4.651zm6.583 0l2.765-4.787h11.064l-2.765 4.787H11.234zm1.532-6.537L7.234 5.313h5.532l5.532 9.6-.766 1.237H13.532l-.766-1.387z" /></svg>
          )
     },
     {
          label: "Gmail", desc: "Automatización de correos y alertas", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: (
               <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-.61.352-1.145.878-1.409l10.243 7.68 1.757-1.318 1.757 1.318 10.243-7.68c.526.264.878.8.878 1.41l-.757-.002z" /></svg>
          )
     },
     {
          label: "Google Docs", desc: "Documentación técnica automática", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20", icon: (
               <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M14.727 0H3.636C2.732 0 2 .732 2 1.636v20.728C2 23.268 2.732 24 3.636 24h16.728C21.268 24 22 23.268 22 22.364V7.273L14.727 0zm-.909 1.636l6.546 6.546h-6.546V1.636zM7.273 17.455h9.454v1.636H7.273v-1.636zm0-3.273h9.454v1.636H7.273v-1.636zm0-3.273h9.454v1.637H7.273V10.91zm0-3.273h4.09v1.636H7.274V7.636z" /></svg>
          )
     },
     {
          label: "Apps Script", desc: "JavaScript en la nube de Google", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: (
               <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M0 12l11.061-11.06 2.829 2.828-11.061 11.06L0 12zm22.243 1.172l-11.06 11.061-2.829-2.829 11.061-11.06 2.828 2.828zM6.172 12l5.657-5.657 1.415 1.414-5.657 5.657-1.415-1.414zm5.656 0l5.657 5.657-1.414 1.415-5.657-5.657 1.414-1.415z" /></svg>
          )
     },
];

const TIPS = [
     { icon: "◈", title: "Documenta cada función en Apps Script", desc: "Usa comentarios JSDoc en cada función (@param, @return) para que el equipo entienda el flujo sin leer todo el código." },
     { icon: "⊞", title: "Versiona tus scripts", desc: "Guarda copias en Git aunque el proyecto viva en Apps Script — exporta el código con clasp para no perder cambios." },
     { icon: "⟳", title: "Valida antes de automatizar", desc: "Prueba la lógica con datos de ejemplo pequeños antes de correrla sobre la hoja de cálculo completa en producción." },
     { icon: "◎", title: "Comunica cambios de proceso", desc: "Si tu automatización modifica un flujo que otros usan, avisa antes de desplegar; un Form o Sheet roto afecta a todo el equipo." },
];

export default function Semester1() {
     const { user } = useAuth();

     return (
          <div className="min-h-full px-6 md:px-10 py-10 max-w-5xl mx-auto space-y-10">

               <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-2 mb-4">
                         <span className="bg-blue-600/20 border border-blue-600/40 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                              Semestre I
                         </span>
                         <span className="text-slate-600 text-xs">· Activo</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
                         Diseño Funcional de Sistemas de Información
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                         {user ? `Bienvenido, ${user.displayName || user.email}. ` : ""}
                         Semestre  base del programa. Se aprenden los fundamentos de análisis, ofimática avanzada y programación
                         mediante proyectos reales de automatización con <span className="text-blue-400 font-medium">Google Apps Script</span>.
                    </p>
               </motion.div>

               <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-2 mb-5">
                         <div className="w-1 h-5 bg-blue-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Malla curricular — Ciclo I</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {SUBJECTS.map((s, i) => (
                              <motion.div
                                   key={i}
                                   className="flex gap-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4"
                                   whileHover={{ borderColor: "rgba(59,130,246,0.35)", y: -2 }}
                                   transition={{ type: "spring", stiffness: 300, damping: 22 }}
                              >
                                   <div className="shrink-0 w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-sm font-mono">
                                        {s.icon}
                                   </div>
                                   <div className="min-w-0">
                                        <p className="text-slate-200 font-semibold text-sm leading-tight">{s.label}</p>
                                        <p className="text-slate-500 text-xs mt-1 leading-relaxed">{s.desc}</p>
                                   </div>
                              </motion.div>
                         ))}
                    </div>
               </motion.div>

               <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="w-1 h-5 bg-green-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Automatización con Google Workspace</h2>
                         <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                              Apps Script
                         </span>
                    </div>
                    <p className="text-slate-500 text-sm mb-5 leading-relaxed max-w-2xl">
                         Los proyectos del semestre se desarrollan sobre el ecosistema de Google usando
                         <span className="text-slate-300"> JavaScript</span> directamente desde Apps Script,
                         integrando las siguientes herramientas:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                         {GAS_TOOLS.map((t, i) => (
                              <motion.div
                                   key={i}
                                   className={`flex items-center gap-3 border rounded-xl p-4 ${t.bg}`}
                                   whileHover={{ y: -2 }}
                                   transition={{ type: "spring", stiffness: 300, damping: 22 }}
                              >
                                   <span className={`shrink-0 ${t.color}`}>{t.icon}</span>
                                   <div className="min-w-0">
                                        <p className={`text-sm font-semibold leading-tight ${t.color}`}>{t.label}</p>
                                        <p className="text-slate-500 text-[11px] mt-0.5 leading-tight">{t.desc}</p>
                                   </div>
                              </motion.div>
                         ))}
                    </div>
               </motion.div>

               <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-2 mb-5">
                         <div className="w-1 h-5 bg-amber-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Consejos del semestre</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {TIPS.map((t, i) => (
                              <div key={i} className="flex gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                                   <span className="shrink-0 text-amber-400 text-sm mt-0.5">{t.icon}</span>
                                   <div className="min-w-0">
                                        <p className="text-slate-200 font-semibold text-sm leading-tight">{t.title}</p>
                                        <p className="text-slate-500 text-xs mt-1 leading-relaxed">{t.desc}</p>
                                   </div>
                              </div>
                         ))}
                    </div>
               </motion.div>

          </div>
     );
}
