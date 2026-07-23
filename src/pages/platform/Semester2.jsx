import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import java1 from "../../assets/segundo/Java1.png";

const fadeUp = {
     hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
     show: (i = 0) => ({
          opacity: 1, y: 0, filter: "blur(0px)",
          transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 },
     }),
};

const TRACKS = [
     {
          id: "desktop",
          label: "Track Desktop",
          color: "blue",
          accent: "text-blue-400",
          border: "border-blue-500/30",
          bg: "bg-blue-500/8",
          activeBg: "bg-blue-600/20 border-blue-500/50",
          badge: "bg-blue-500/15 border-blue-500/25 text-blue-400",
          tools: [
               { name: "Java", desc: "Lenguaje principal del track", icon: "☕" },
               { name: "Java Swing", desc: "Interfaces gráficas de escritorio", icon: "🖥" },
               { name: "MySQL", desc: "Base de datos relacional", icon: "🗄" },
               { name: "IntelliJ IDEA", desc: "IDE de desarrollo", icon: "⚡" },
          ],
     },
     {
          id: "web",
          label: "Track Web",
          color: "violet",
          accent: "text-violet-400",
          border: "border-violet-500/30",
          bg: "bg-violet-500/8",
          activeBg: "bg-violet-600/20 border-violet-500/50",
          badge: "bg-violet-500/15 border-violet-500/25 text-violet-400",
          tools: [
               { name: "HTML & CSS", desc: "Estructura y estilos base", icon: "🌐" },
               { name: "Tailwind CSS", desc: "Framework de utilidades CSS", icon: "🎨" },
               { name: "JavaScript", desc: "Lógica del frontend", icon: "JS" },
               { name: "Python + Flask", desc: "Backend ligero con Python", icon: "🐍" },
               { name: "MySQL", desc: "Base de datos relacional", icon: "🗄" },
          ],
     },
];

const JAVA_PACKAGES = [
     { pkg: "view", accent: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/20", desc: "Interfaces gráficas Swing.", suffix: "Sufijo View", example: "ClientCrudView, ClientEditView" },
     { pkg: "controller", accent: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20", desc: "Lógica de eventos de la UI.", suffix: "Sufijo Controller", example: "ClientCrudController" },
     { pkg: "service", accent: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20", desc: "Lógica de negocio.", suffix: "Sufijo Service", example: "ClientCrudService" },
     { pkg: "dto", accent: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20", desc: "Objetos de transferencia de datos.", suffix: "Sufijo Dto", example: "ClientDto" },
     { pkg: "model", accent: "text-indigo-400", bg: "bg-indigo-500/8 border-indigo-500/20", desc: "Clases de dominio (entidades).", suffix: "", example: "Client, Producto" },
     { pkg: "dao", accent: "text-cyan-400", bg: "bg-cyan-500/8 border-cyan-500/20", desc: "Persistencia y consultas SQL.", suffix: "Sufijo DAO", example: "ClientDAO" },
     { pkg: "db", accent: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20", desc: "Clase de conexión a la BD.", suffix: "AccessDB.java", example: "AccessDB" },
     { pkg: "util", accent: "text-green-400", bg: "bg-green-500/8 border-green-500/20", desc: "Clases utilitarias del proyecto.", suffix: "", example: "DateUtil, Validator" },
     { pkg: "exception", accent: "text-red-400", bg: "bg-red-500/8 border-red-500/20", desc: "Excepciones personalizadas.", suffix: "", example: "NegocioException" },
     { pkg: "prueba", accent: "text-slate-400", bg: "bg-slate-500/8 border-slate-500/20", desc: "Casos de prueba unitaria.", suffix: "", example: "ClientServiceTest" },
];

const JAVA_STRUCTURE = `mi-proyecto/          ← nombre del proyecto en minúsculas
└── src/
    └── pe/
        └── edu/
            └── vallegrande/
                └── miproyecto/
                    ├── view/
                    │   ├── ClientCrudView.java
                    │   └── ClientEditView.java
                    ├── controller/
                    │   └── ClientCrudController.java
                    ├── service/
                    │   └── ClientCrudService.java
                    ├── dto/
                    │   └── ClientDto.java
                    ├── model/
                    │   └── Client.java
                    ├── dao/
                    │   └── ClientDAO.java
                    ├── db/
                    │   └── AccessDB.java
                    ├── util/
                    └── exception/`;

const FLASK_STRUCTURE = `mi-proyecto/
├── app/                        ← paquete principal
│   ├── __init__.py             ← create_app() — factory function
│   ├── config.py               ← configuración por entorno
│   ├── database.py             ← conexión MySQL / SQLAlchemy
│   ├── models/                 ← clases ORM (tablas)
│   │   ├── __init__.py
│   │   └── cliente.py
│   ├── routes/                 ← blueprints por módulo
│   │   ├── __init__.py
│   │   └── clientes.py
│   ├── services/               ← lógica de negocio
│   │   └── cliente_service.py
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   │   └── main.js
│   │   └── img/
│   └── templates/
│       ├── base.html           ← incluye CDN de Tailwind
│       └── clientes/
│           ├── index.html
│           └── form.html
├── .env                        ← variables de entorno (no subir a Git)
├── .gitignore
├── app.py                      ← punto de entrada
└── requirements.txt`;

const TAILWIND_CDN = `<!-- base.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>{% block title %}Mi Proyecto{% endblock %}</title>
</head>
<body class="bg-gray-100">
  {% block content %}{% endblock %}
</body>
</html>`;

const TECH_STACK = [
     {
          track: "Track Desktop",
          accent: "blue",
          techs: [
               { name: "Java 17+", role: "Lenguaje principal", color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
               { name: "Java Swing", role: "Interfaces gráficas de escritorio", color: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/20" },
               { name: "MySQL", role: "Base de datos relacional", color: "text-cyan-400", bg: "bg-cyan-500/8 border-cyan-500/20" },
               { name: "JDBC", role: "Conexión Java → MySQL", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
               { name: "IntelliJ IDEA", role: "IDE de desarrollo", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20" },
          ],
     },
     {
          track: "Track Web",
          accent: "violet",
          techs: [
               { name: "Python 3", role: "Lenguaje del backend", color: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20" },
               { name: "Flask", role: "Framework web ligero", color: "text-green-400", bg: "bg-green-500/8 border-green-500/20" },
               { name: "MySQL", role: "Base de datos relacional", color: "text-cyan-400", bg: "bg-cyan-500/8 border-cyan-500/20" },
               { name: "HTML & CSS", role: "Estructura y estilos base", color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
               { name: "Tailwind 4", role: "Framework CSS vía CDN", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
               { name: "JavaScript", role: "Interactividad del frontend", color: "text-yellow-300", bg: "bg-yellow-400/8 border-yellow-400/20" },
               { name: "VS Code", role: "Editor de código", color: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/20" },
          ],
     },
];

const COMMITS = [
     { type: "feat", color: "text-green-400 bg-green-500/10 border-green-500/25", desc: "Nueva funcionalidad", ex: "feat: agregar formulario de registro" },
     { type: "fix", color: "text-red-400 bg-red-500/10 border-red-500/25", desc: "Corrección de bug", ex: "fix: corregir validación de campos vacíos" },
     { type: "style", color: "text-pink-400 bg-pink-500/10 border-pink-500/25", desc: "Cambios de estilos (CSS/Tailwind)", ex: "style: ajustar padding del navbar" },
     { type: "refactor", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/25", desc: "Reestructura sin cambiar comportamiento", ex: "refactor: separar lógica de conexión a Conexion.java" },
     { type: "docs", color: "text-sky-400 bg-sky-500/10 border-sky-500/25", desc: "Cambios en documentación", ex: "docs: actualizar README con instrucciones de instalación" },
     { type: "chore", color: "text-slate-400 bg-slate-500/10 border-slate-500/25", desc: "Tareas de mantenimiento", ex: "chore: agregar .gitignore" },
     { type: "test", color: "text-violet-400 bg-violet-500/10 border-violet-500/25", desc: "Pruebas unitarias o de integración", ex: "test: agregar test a EntidadDAO" },
     { type: "perf", color: "text-orange-400 bg-orange-500/10 border-orange-500/25", desc: "Mejoras de rendimiento", ex: "perf: optimizar consulta SQL con índice" },
];


const TIPS = [
     { icon: "☕", title: "No mezcles capas", desc: "La vista (Swing) nunca debe hablar directo con el DAO. Siempre pasa por controller → service para mantener el bajo acoplamiento." },
     { icon: "🗄", title: "Cierra siempre las conexiones", desc: "Usa try-with-resources con Connection, PreparedStatement y ResultSet para evitar fugas de conexiones a MySQL." },
     { icon: "🐍", title: "Un blueprint por módulo", desc: "En Flask, agrupa las rutas relacionadas en su propio blueprint (clientes, productos...) en vez de un único archivo de rutas gigante." },
     { icon: "🎨", title: "Tailwind por CDN solo para prácticas", desc: "El CDN es rápido para el semestre, pero en un proyecto real conviene instalar Tailwind vía npm para purgar CSS no usado." },
];

function FileIcon({ name, accentColor }) {
     const clean = name.replace(/\s*←.*$/, '').trim();
     const isDir = clean.endsWith('/');
     const ext = clean.includes('.') ? clean.split('.').pop() : '';
     if (isDir) return (
          <svg style={{ width: 13, height: 13, marginRight: 5, display: 'inline-block', verticalAlign: 'middle', marginTop: -2, flexShrink: 0 }} viewBox="0 0 16 16" fill="none">
               <path d="M1 4a1 1 0 011-1h3.586a1 1 0 01.707.293L7.414 4.5H14a1 1 0 011 1V12a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" fill={accentColor === 'violet' ? '#7c3aed' : '#2563eb'} opacity="0.85" />
          </svg>
     );
     const badges = {
          java: { bg: '#1d4ed8', color: '#bfdbfe', text: 'J' },
          jar: { bg: '#1e3a5f', color: '#7dd3fc', text: 'JAR' },
          html: { bg: '#7c2d12', color: '#fdba74', text: 'H' },
          md: { bg: '#134e4a', color: '#5eead4', text: 'MD' },
          txt: { bg: '#1e293b', color: '#94a3b8', text: 'TXT' },
          js: { bg: '#713f12', color: '#fde68a', text: 'JS' },
          css: { bg: '#1e1b4b', color: '#a5b4fc', text: 'CSS' },
          py: null,
     };
     if (clean === '__init__.py') return <span style={{ fontSize: 10, marginRight: 5, color: '#a3e635', fontFamily: 'monospace', verticalAlign: 'middle' }}>⚙</span>;
     if (clean === '.env') return <span style={{ fontSize: 9, marginRight: 5, background: '#14532d', color: '#86efac', fontWeight: 900, fontFamily: 'monospace', padding: '0 3px', borderRadius: 3, verticalAlign: 'middle' }}>ENV</span>;
     if (clean === '.gitignore') return <span style={{ fontSize: 10, marginRight: 5, color: '#f97316', verticalAlign: 'middle' }}>⊘</span>;
     if (ext === 'py') return <span style={{ fontSize: 10, marginRight: 5, color: '#facc15', verticalAlign: 'middle' }}>🐍</span>;
     const b = badges[ext];
     if (b) return <span style={{ fontSize: 9, marginRight: 5, background: b.bg, color: b.color, fontWeight: 900, fontFamily: 'monospace', padding: '0 3px', borderRadius: 3, verticalAlign: 'middle' }}>{b.text}</span>;
     return <span style={{ fontSize: 10, marginRight: 5, color: '#475569', verticalAlign: 'middle' }}>◦</span>;
}

function FileTree({ content, accentColor }) {
     const colorForName = (clean) => {
          const ext = clean.includes('.') ? clean.split('.').pop() : '';
          if (clean.endsWith('/')) return accentColor === 'violet' ? 'text-violet-400' : 'text-blue-400';
          if (ext === 'java') return 'text-blue-300';
          if (ext === 'py') return 'text-yellow-300';
          if (ext === 'html') return 'text-orange-300';
          if (ext === 'md') return 'text-teal-300';
          if (ext === 'js') return 'text-yellow-200';
          if (ext === 'css') return 'text-indigo-300';
          if (clean === '.env') return 'text-green-300';
          return 'text-slate-400';
     };
     return (
          <div className="text-sm font-mono leading-loose p-5 overflow-x-auto">
               {content.split('\n').map((line, i) => {
                    const treeChars = line.match(/^[│├└─\s]+/)?.[0] || '';
                    const rest = line.slice(treeChars.length);
                    const clean = rest.replace(/\s*←.*$/, '').trim();
                    const comment = rest.match(/\s*(←.*)$/)?.[1] || '';
                    return (
                         <div key={i} className="flex items-center">
                              <span className="text-slate-700 select-none whitespace-pre">{treeChars}</span>
                              {rest && (
                                   <>
                                        <FileIcon name={rest} accentColor={accentColor} />
                                        <span className={colorForName(clean)}>{clean}</span>
                                        {comment && <span className="text-slate-600 ml-3 text-xs italic">{comment}</span>}
                                   </>
                              )}
                         </div>
                    );
               })}
          </div>
     );
}

export default function Semester2() {
     const [activeTrack, setActiveTrack] = useState("desktop");
     const track = TRACKS.find((t) => t.id === activeTrack);

     return (
          <div className="min-h-full px-6 md:px-10 py-10 max-w-5xl mx-auto space-y-12">

               <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                         <span className="bg-violet-600/20 border border-violet-600/40 text-violet-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                              Semestre II
                         </span>
                         <span className="text-slate-600 text-xs">·</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
                         Desarrollo Web Fundamental
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                         Semestre dividido en dos tracks paralelos:{" "}
                         <span className="text-blue-400 font-medium">aplicaciones de escritorio con Java Swing</span>{" "}
                         y{" "}
                         <span className="text-violet-400 font-medium">desarrollo web con Flask y Tailwind CSS</span>.
                         Ambos comparten MySQL como capa de datos.
                    </p>
               </motion.div>

               <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-5">
                         <div className="w-1 h-5 bg-slate-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Stack tecnológico</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {TECH_STACK.map((group, gi) => (
                              <div key={gi} className={`rounded-2xl border p-5 ${group.accent === 'blue' ? 'border-blue-500/20 bg-blue-500/5' : 'border-violet-500/20 bg-violet-500/5'}`}>
                                   <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${group.accent === 'blue' ? 'text-blue-400' : 'text-violet-400'}`}>
                                        {group.track}
                                   </p>
                                   <div className="flex flex-wrap gap-2">
                                        {group.techs.map((t, ti) => (
                                             <div key={ti} className={`flex items-center gap-2 border rounded-xl px-3 py-2 ${t.bg}`}>
                                                  <span className={`text-xs font-black font-mono ${t.color}`}>{t.name}</span>
                                                  <span className="text-slate-600 text-[11px] hidden sm:block">{t.role}</span>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         ))}
                    </div>
               </motion.div>

               <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex gap-2 mb-5">
                         {TRACKS.map((t) => (
                              <button
                                   key={t.id}
                                   onClick={() => setActiveTrack(t.id)}
                                   className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${activeTrack === t.id ? t.activeBg : "border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"}`}
                              >
                                   {t.label}
                              </button>
                         ))}
                    </div>

                    <AnimatePresence mode="wait">
                         <motion.div
                              key={activeTrack}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.25 }}
                         >
                              <div className={`rounded-2xl border p-6 ${track.border} ${track.bg}`}>
                                   <div className="flex items-center gap-2 mb-5">
                                        <div className="w-1 h-5 bg-current rounded-full opacity-70" />
                                        <h2 className={`font-bold text-base ${track.accent}`}>{track.label}</h2>
                                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-widest ${track.badge}`}>
                                             {track.tools.length} tecnologías
                                        </span>
                                   </div>
                                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {track.tools.map((tool, i) => (
                                             <motion.div
                                                  key={i}
                                                  className="bg-slate-900/70 border border-slate-800 rounded-xl p-4"
                                                  whileHover={{ y: -2, borderColor: "rgba(139,92,246,0.3)" }}
                                                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                             >
                                                  <div className={`text-xl mb-2 ${track.accent}`}>{tool.icon}</div>
                                                  <p className="text-slate-200 font-semibold text-sm leading-tight">{tool.name}</p>
                                                  <p className="text-slate-500 text-xs mt-0.5">{tool.desc}</p>
                                             </motion.div>
                                        ))}
                                   </div>
                              </div>
                         </motion.div>
                    </AnimatePresence>
               </motion.div>

               <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="w-1 h-5 bg-blue-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Arquitectura de paquetes Java</h2>
                         <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">IntelliJ · Swing</span>
                    </div>
                    <p className="text-slate-500 text-sm mb-1 leading-relaxed max-w-2xl">
                         Las soluciones se plantean bajo enfoque de servicios por capas. El artifact base es:
                    </p>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 mb-6 font-mono text-sm inline-flex items-center gap-2">
                         <span className="text-slate-500">artifact:</span>
                         <span className="text-blue-400">pe.edu.vallegrande</span>
                         <span className="text-slate-600">.</span>
                         <span className="text-yellow-400">&lt;nombre-proyecto&gt;</span>
                         <span className="text-slate-600">.</span>
                         <span className="text-violet-400">&lt;paquete&gt;</span>
                    </div>

                    <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 overflow-hidden mb-6">
                         <div className="flex items-center gap-2 px-4 py-2.5 border-b border-blue-500/15">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">IntelliJ — New Project</span>
                         </div>
                         <img src={java1} alt="IntelliJ New Project — GroupId pe.edu.vallegrande" className="w-full object-cover" />
                    </div>

                    <div className="space-y-2 mb-6">
                         {JAVA_PACKAGES.map((p, i) => (
                              <div key={i} className={`flex items-start gap-4 border rounded-xl px-4 py-3 ${p.bg}`}>
                                   <span className={`shrink-0 font-mono text-xs font-black w-24 pt-0.5 ${p.accent}`}>{p.pkg}</span>
                                   <div className="flex-1 min-w-0">
                                        <p className="text-slate-300 text-sm leading-tight">{p.desc}</p>
                                        {p.example && <p className="text-slate-600 text-xs mt-0.5 font-mono">{p.example}</p>}
                                   </div>
                                   {p.suffix && <span className="shrink-0 text-slate-600 text-xs font-mono hidden sm:block">{p.suffix}</span>}
                              </div>
                         ))}
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                         <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">estructura-java/</span>
                         </div>
                         <FileTree content={JAVA_STRUCTURE} accentColor="blue" />
                    </div>

                    <div className="mt-6">
                         <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Arquitectura en capas — flujo de error</p>
                         <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden p-6 overflow-x-auto">
                              <svg viewBox="0 0 720 260" className="w-full min-w-130" xmlns="http://www.w3.org/2000/svg">
                                   <text x="140" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2" fontFamily="monospace">VIEW</text>
                                   <text x="360" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2" fontFamily="monospace">CONTROLLER</text>
                                   <text x="570" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" letterSpacing="2" fontFamily="monospace">SERVICE</text>

                                   <line x1="140" y1="30" x2="140" y2="260" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                                   <line x1="360" y1="30" x2="360" y2="260" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                                   <line x1="570" y1="30" x2="570" y2="260" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

                                   <circle cx="40" cy="70" r="16" fill="none" stroke="#475569" strokeWidth="1.5" />
                                   <circle cx="40" cy="64" r="5" fill="none" stroke="#475569" strokeWidth="1.5" />
                                   <path d="M28 78 Q40 90 52 78" fill="none" stroke="#475569" strokeWidth="1.5" />

                                   <rect x="80" y="42" width="118" height="72" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
                                   <rect x="80" y="42" width="118" height="16" rx="4" fill="#1e3a5f" />
                                   <rect x="80" y="50" width="118" height="8" fill="#1e3a5f" />
                                   <text x="110" y="53" fontSize="8" fill="#93c5fd" fontFamily="monospace">VentanaPrincipal</text>
                                   <line x1="186" y1="42" x2="186" y2="58" stroke="#60a5fa" strokeWidth="1.2" />
                                   <text x="188" y="54" fontSize="9" fill="#60a5fa" fontFamily="sans-serif">✕</text>

                                   <line x1="56" y1="70" x2="78" y2="70" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrowGray)" />

                                   <line x1="198" y1="70" x2="290" y2="70" stroke="#a78bfa" strokeWidth="1.8" markerEnd="url(#arrowPurple)" />

                                   <rect x="292" y="42" width="118" height="56" rx="4" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.5" />
                                   <rect x="292" y="42" width="118" height="14" rx="4" fill="#2e1065" />
                                   <rect x="292" y="48" width="118" height="8" fill="#2e1065" />
                                   <text x="316" y="53" fontSize="8" fill="#c4b5fd" fontFamily="monospace">ClientController</text>
                                   <line x1="396" y1="42" x2="396" y2="56" stroke="#a78bfa" strokeWidth="1.2" />
                                   <text x="398" y="54" fontSize="9" fill="#a78bfa" fontFamily="sans-serif">✕</text>

                                   <line x1="410" y1="70" x2="504" y2="70" stroke="#a78bfa" strokeWidth="1.8" markerEnd="url(#arrowPurple)" />

                                   <rect x="506" y="42" width="118" height="56" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                                   <rect x="506" y="42" width="118" height="14" rx="4" fill="#022c22" />
                                   <rect x="506" y="48" width="118" height="8" fill="#022c22" />
                                   <text x="530" y="53" fontSize="8" fill="#6ee7b7" fontFamily="monospace">ClientService</text>
                                   <line x1="610" y1="42" x2="610" y2="56" stroke="#34d399" strokeWidth="1.2" />
                                   <text x="612" y="54" fontSize="9" fill="#34d399" fontFamily="sans-serif">✕</text>

                                   <path d="M565 98 L565 130 L351 130 L351 100" fill="none" stroke="#f43f5e" strokeWidth="1.4" strokeDasharray="5 3" markerEnd="url(#arrowRed)" />
                                   <text x="410" y="125" fontSize="8" fill="#f43f5e" fontFamily="monospace">throw new RuntimeException(&quot;msg&quot;);</text>
                                   <text x="450" y="140" fontSize="8" fill="#fb7185" fontWeight="bold" fontFamily="monospace">Error</text>

                                   <path d="M351 98 L351 160 L140 160 L140 116" fill="none" stroke="#f43f5e" strokeWidth="1.4" strokeDasharray="5 3" markerEnd="url(#arrowRed)" />
                                   <text x="188" y="155" fontSize="8" fill="#f43f5e" fontFamily="monospace">throw new RuntimeException(&quot;msg&quot;);</text>

                                   <rect x="80" y="182" width="100" height="62" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
                                   <rect x="80" y="182" width="100" height="14" rx="4" fill="#450a0a" />
                                   <rect x="80" y="188" width="100" height="8" fill="#450a0a" />
                                   <text x="104" y="193" fontSize="8" fill="#fca5a5" fontFamily="monospace">Error</text>
                                   <line x1="168" y1="182" x2="168" y2="196" stroke="#f43f5e" strokeWidth="1.2" />
                                   <text x="170" y="194" fontSize="9" fill="#f43f5e" fontFamily="sans-serif">✕</text>

                                   <circle cx="40" cy="210" r="16" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                                   <circle cx="40" cy="204" r="5" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                                   <path d="M28 220 Q40 210 52 220" fill="none" stroke="#ef4444" strokeWidth="1.5" />

                                   <line x1="56" y1="210" x2="78" y2="210" stroke="#ef4444" strokeWidth="1.2" markerEnd="url(#arrowRed)" />

                                   <defs>
                                        <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                                             <path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" />
                                        </marker>
                                        <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                                             <path d="M0,0 L0,6 L8,3 z" fill="#f43f5e" />
                                        </marker>
                                        <marker id="arrowGray" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                                             <path d="M0,0 L0,6 L8,3 z" fill="#475569" />
                                        </marker>
                                   </defs>
                              </svg>
                         </div>
                    </div>
               </motion.div>

               <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="w-1 h-5 bg-violet-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Estándar de proyecto Python + Flask</h2>
                         <span className="bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">VS Code</span>
                    </div>
                    <p className="text-slate-500 text-sm mb-4 leading-relaxed max-w-2xl">
                         Arquitectura por <span className="text-violet-400 font-medium">Blueprints</span> con separación en capas: rutas, servicios y modelos. Tailwind CSS integrado vía <span className="text-sky-400 font-medium">CDN</span> directamente en <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">base.html</code>, sin npm ni herramientas de compilación.
                    </p>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-4">
                         <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">app/templates/base.html</span>
                         </div>
                         <pre className="text-xs font-mono leading-relaxed p-5 overflow-x-auto">
                              <code>
                                   {TAILWIND_CDN.split('\n').map((line, i) => {
                                        const isTag = line.trim().startsWith('<');
                                        const isComment = line.trim().startsWith('<!--');
                                        const isScript = line.includes('cdn.tailwindcss');
                                        return (
                                             <div key={i}>
                                                  <span className={isComment ? 'text-slate-500 italic' : isScript ? 'text-sky-400' : isTag ? 'text-violet-400' : 'text-slate-400'}>{line}</span>
                                             </div>
                                        );
                                   })}
                              </code>
                         </pre>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                         <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">estructura-flask/</span>
                         </div>
                         <FileTree content={FLASK_STRUCTURE} accentColor="violet" />
                    </div>
               </motion.div>

               <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="w-1 h-5 bg-green-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Conventional Commits</h2>
                         <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Git</span>
                    </div>
                    <p className="text-slate-500 text-sm mb-2 leading-relaxed max-w-2xl">
                         Formato estándar para mensajes de commit. Facilita el historial de cambios y la colaboración en equipo.
                    </p>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 mb-5 font-mono text-sm">
                         <span className="text-slate-500">$ git commit -m &quot;</span>
                         <span className="text-green-400">tipo</span>
                         <span className="text-slate-500">(</span>
                         <span className="text-yellow-400">alcance</span>
                         <span className="text-slate-500">): </span>
                         <span className="text-slate-300">descripción corta en minúsculas</span>
                         <span className="text-slate-500">&quot;</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {COMMITS.map((c, i) => (
                              <div key={i} className={`flex items-start gap-3 border rounded-xl p-4 ${c.color}`}>
                                   <span className={`shrink-0 font-mono text-xs font-black px-2 py-1 rounded-lg border ${c.color}`}>{c.type}</span>
                                   <div className="min-w-0">
                                        <p className="text-slate-300 text-sm font-medium leading-tight">{c.desc}</p>
                                        <p className="text-slate-600 text-xs mt-1 font-mono truncate">{c.ex}</p>
                                   </div>
                              </div>
                         ))}
                    </div>
               </motion.div>

               <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-5">
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
