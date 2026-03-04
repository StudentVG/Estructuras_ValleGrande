import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const SEMESTERS = [
     { num: 1, roman: "I", title: "Fundamentos", sub: "GAS · Ofimática · Análisis", available: true },
     { num: 2, roman: "II", title: "Desarrollo Web", sub: "Java · Flask · MySQL", available: true },
     { num: 3, roman: "III", title: "Backend", sub: "SpringBoot · Angular", available: true },
     { num: 4, roman: "IV", title: "Full Stack", sub: "WebFlux · React · MongoDB", available: true },
     { num: 5, roman: "V", title: "Microservicios", sub: "PRS · Enterprise", available: true },
];

export default function PlatformLayout() {
     const { user, logout } = useAuth();
     const navigate = useNavigate();
     const [open, setOpen] = useState(true);

     function handleLogout() {
          logout();
          navigate("/");
     }

     const sidebarContent = (
          <>
               <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/70 shrink-0">
                    <img src="/ValleGrande.jpg" alt="Valle Grande" className="w-9 h-9 rounded-lg object-contain border border-slate-700/50 shrink-0" />
                    <div className="min-w-0 flex-1">
                         <p className="text-white font-bold text-sm leading-tight truncate">Valle Grande</p>
                         <p className="text-slate-500 text-[11px] uppercase tracking-widest">Plataforma</p>
                    </div>
                    <button
                         onClick={() => setOpen(false)}
                         className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                         </svg>
                    </button>
               </div>

               {user && (
                    <div className="px-5 py-4 border-b border-slate-800/70 shrink-0">
                         <div className="flex items-center gap-3">
                              <img src={user.photoURL} alt={user.displayName || user.email} className="w-9 h-9 rounded-full border border-slate-700/50 shrink-0" />
                              <div className="min-w-0 flex-1">
                                   <p className="text-white text-sm font-semibold leading-tight truncate">{user.displayName || user.email}</p>
                                   <p className="text-slate-500 text-xs truncate">{user.email}</p>
                              </div>
                         </div>
                    </div>
               )}

               <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <p className="text-slate-600 text-[10px] uppercase tracking-widest px-2 mb-3">Semestres</p>
                    {SEMESTERS.map((sem) =>
                         sem.available ? (
                              <NavLink
                                   key={sem.num}
                                   to={`/plataforma/semestre/${sem.num}`}
                                   onClick={() => { if (window.innerWidth < 1024) setOpen(false); }}
                                   className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 border ${isActive
                                             ? "bg-blue-600/20 border-blue-600/40 text-white"
                                             : "border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white"
                                        }`
                                   }
                              >
                                   <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-xs font-black text-blue-400 shrink-0">{sem.roman}</span>
                                   <div className="min-w-0">
                                        <p className="text-sm font-semibold leading-tight">{sem.title}</p>
                                        <p className="text-[11px] text-slate-500 truncate">{sem.sub}</p>
                                   </div>
                              </NavLink>
                         ) : (
                              <div key={sem.num} className="flex items-center gap-3 px-3 py-2.5 rounded-xl opacity-40 cursor-not-allowed select-none">
                                   <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-xs font-black text-slate-500 shrink-0">{sem.roman}</span>
                                   <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-400 leading-tight">{sem.title}</p>
                                        <p className="text-[11px] text-slate-600 truncate">{sem.sub}</p>
                                   </div>
                                   <svg className="w-3.5 h-3.5 ml-auto shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0110 0v4" />
                                   </svg>
                              </div>
                         )
                    )}
                    <div className="mt-4 pt-4 border-t border-slate-800/50">
                         <p className="text-slate-600 text-[10px] uppercase tracking-widest px-2 mb-3">Recursos</p>
                         <NavLink
                              to="/plataforma/documentacion"
                              onClick={() => { if (window.innerWidth < 1024) setOpen(false); }}
                              className={({ isActive }) =>
                                   `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 border ${isActive
                                        ? "bg-amber-600/20 border-amber-600/40 text-white"
                                        : "border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white"
                                   }`
                              }
                         >
                              <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0">
                                   <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                   </svg>
                              </span>
                              <div className="min-w-0">
                                   <p className="text-sm font-semibold leading-tight">Documentación</p>
                                   <p className="text-[11px] text-slate-500 truncate">README · Code Review</p>
                              </div>
                         </NavLink>
                         <NavLink
                              to="/plataforma/convenciones"
                              onClick={() => { if (window.innerWidth < 1024) setOpen(false); }}
                              className={({ isActive }) =>
                                   `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 border ${isActive
                                        ? "bg-teal-600/20 border-teal-600/40 text-white"
                                        : "border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white"
                                   }`
                              }
                         >
                              <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0">
                                   <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m6 10V7M4 12h16" />
                                   </svg>
                              </span>
                              <div className="min-w-0">
                                   <p className="text-sm font-semibold leading-tight">Convenciones</p>
                                   <p className="text-[11px] text-slate-500 truncate">Base de Datos · Comentarios</p>
                              </div>
                         </NavLink>
                    </div>
               </nav>

               <div className="px-3 py-4 border-t border-slate-800/70 shrink-0">
                    <button
                         onClick={handleLogout}
                         className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/20 transition-all duration-150 text-sm"
                    >
                         <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                         </svg>
                         Cerrar sesión
                    </button>
               </div>
          </>
     );

     return (
          <div className="flex h-screen bg-slate-950 text-white antialiased overflow-hidden">

               {open && (
                    <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />
               )}

               <aside className={`fixed inset-y-0 left-0 z-30 w-72 flex flex-col bg-slate-900 border-r border-slate-800/70 transition-transform duration-300 ease-in-out lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
                    {sidebarContent}
               </aside>

               <aside className={`hidden lg:flex flex-col bg-slate-900 border-r border-slate-800/70 transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${open ? "w-72" : "w-0 border-r-0"}`}>
                    <div className="w-72">
                         {sidebarContent}
                    </div>
               </aside>

               <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <header className="shrink-0 h-12 flex items-center gap-3 px-4 border-b border-slate-800/70 bg-slate-950">
                         <button
                              onClick={() => setOpen(true)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${open ? "lg:hidden" : ""}`}
                         >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                              </svg>
                         </button>
                         <span className="text-slate-600 text-sm truncate">Valle Grande — Plataforma</span>
                    </header>

                    <main className="flex-1 overflow-y-auto">
                         <Outlet />
                    </main>
               </div>
          </div>
     );
}
