import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
     hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
     show: (i = 0) => ({
          opacity: 1, y: 0, filter: "blur(0px)",
          transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 },
     }),
};

const TABS = [
     { id: "database", label: "Base de Datos", icon: "🗄", accent: "teal" },
     { id: "comments", label: "Comentarios en Código", icon: "💬", accent: "violet" },
     { id: "reports", label: "Reportes y Exportación", icon: "🧾", accent: "amber" },
];


const DB_NAMING_SQL = [
     { element: "Base de datos", rule: "snake_case · prefijo vg_", good: "vg_users_db", bad: "UsersDB, vgUsersDb", color: "text-teal-400" },
     { element: "Tablas", rule: "snake_case · plural", good: "clients, purchase_orders", bad: "Client, tbl_clients, PurchaseOrder", color: "text-sky-400" },
     { element: "Columnas", rule: "snake_case", good: "first_name, created_at", bad: "firstName, FName, fch_creacion", color: "text-emerald-400" },
     { element: "Primary Key", rule: "Siempre id", good: "id", bad: "client_id, pk_client, idClient", color: "text-amber-400" },
     { element: "Foreign Key", rule: "{tabla_singular}_id", good: "client_id, order_id", bad: "fk_client, id_cliente, clientId", color: "text-pink-400" },
     { element: "Índices", rule: "idx_{tabla}_{columna}", good: "idx_clients_email", bad: "index1, clientEmailIdx", color: "text-violet-400" },
     { element: "Unique", rule: "uk_{tabla}_{columna}", good: "uk_clients_email", bad: "unique_email, uq1", color: "text-blue-400" },
     { element: "Check", rule: "chk_{tabla}_{regla}", good: "chk_clients_age", bad: "check1, ageCheck", color: "text-orange-400" },
     { element: "Booleanos (dominio, no ciclo de vida)", rule: "Prefijo is_ o has_", good: "is_verified, has_paid", bad: "is_active junto a status, verificado", color: "text-green-400" },
     { element: "Timestamps", rule: "created_at, updated_at, deleted_at", good: "created_at", bad: "fecha_creacion, createdAt, fch_crea", color: "text-cyan-400" },
     { element: "Estado lógico", rule: "Columna status — char(1)", good: "status ('A'=activo, 'I'=inactivo)", bad: "estado, activo, is_deleted", color: "text-rose-400" },
];

const DB_NAMING_MONGO = [
     { element: "Base de datos", rule: "snake_case · prefijo vg_", good: "vg_users_db", bad: "UsersDB, vgUsersDb", color: "text-teal-400" },
     { element: "Colecciones", rule: "snake_case · plural", good: "clients, purchase_orders", bad: "Client, tbl_clients", color: "text-sky-400" },
     { element: "Campos", rule: "camelCase", good: "firstName, createdAt", bad: "first_name, FirstName, fch_creacion", color: "text-emerald-400" },
     { element: "Primary Key", rule: "Auto-generado _id", good: "_id (ObjectId)", bad: "id, clientId como PK manual", color: "text-amber-400" },
     { element: "Referencia FK", rule: "camelCase · sufijo Id", good: "clientId, orderId", bad: "client_id, fk_client, id_cliente", color: "text-pink-400" },
     { element: "Índices", rule: "idx_{coleccion}_{campo}", good: "idx_clients_email", bad: "index1, emailIndex", color: "text-violet-400" },
     { element: "Booleanos (dominio, no ciclo de vida)", rule: "Prefijo is o has", good: "isVerified, hasPaid", bad: "isActive junto a status, verificado", color: "text-green-400" },
     { element: "Timestamps", rule: "createdAt, updatedAt", good: "createdAt", bad: "fecha_creacion, created_at", color: "text-cyan-400" },
     { element: "Estado lógico", rule: "Campo status — string", good: "status ('A', 'I')", bad: "estado, activo, isDeleted", color: "text-rose-400" },
];

const DB_LANGUAGE_GLOSSARY = [
     { es: "cliente", en: "client", es2: "matrícula", en2: "enrollment" },
     { es: "usuario", en: "user", es2: "periodo académico", en2: "academic_period" },
     { es: "estudiante", en: "student", es2: "curso", en2: "course" },
     { es: "docente / profesor", en: "teacher", es2: "calificación", en2: "grade" },
     { es: "organización", en: "organization", es2: "asistencia", en2: "attendance" },
     { es: "rol", en: "role", es2: "pago / cuota", en2: "payment / installment" },
     { es: "producto", en: "product", es2: "comprobante", en2: "receipt" },
     { es: "pedido / orden", en: "order", es2: "estado", en2: "status" },
     { es: "dirección", en: "address", es2: "notificación", en2: "notification" },
];

const DB_GENERAL_RULES = [
     { rule: "Todo nombre en inglés — nunca en español ni mezclado", detail: "Tablas, columnas, colecciones, índices y constraints siempre en inglés. Es la validación principal del bot de code review: clientes, usuarios, fch_creacion descuentan puntos directamente." },
     { rule: "Nunca usar camelCase en tablas o columnas SQL", detail: "Java usa camelCase, la BD usa snake_case. JPA/Hibernate mapea automáticamente con @Column si es necesario." },
     { rule: "Nunca usar palabras reservadas como nombre", detail: "Prohibido: order, user, table, index, group, select. Usar: orders, users, etc." },
     { rule: "Prefijo vg_ solo en el nombre de la base de datos", detail: "Las tablas/colecciones NO llevan prefijo. Nada de tbl_clients ni col_users." },
     { rule: "Sin abreviaturas crípticas", detail: "Prohibido: cant, fch, nro, desc. Usar: quantity, date, number, description." },
     { rule: "Tablas siempre en plural", detail: "Una tabla almacena múltiples registros: clients, products, purchase_orders." },
     { rule: "Soft delete con columna status, no borrado físico", detail: "status = 'A' (activo) o 'I' (inactivo). Nunca DELETE FROM real en producción." },
     { rule: "El ciclo de vida del registro SIEMPRE usa status, nunca un booleano", detail: "Prohibido is_active / is_deleted junto a status — duplica la fuente de verdad y permite estados contradictorios. Booleanos is_/has_ son solo para atributos de dominio (is_verified, has_paid), nunca para saber si el registro está activo." },
     { rule: "Timestamps obligatorios en toda tabla", detail: "Toda tabla debe tener created_at y updated_at. Considerar deleted_at si aplica soft delete por fecha." },
     { rule: "Mapeo Java ↔ BD consistente", detail: "Java: firstName (camelCase) → BD SQL: first_name (snake_case). En Mongo el campo ya es camelCase." },
];

const DB_MAPPING_EXAMPLE = `// Entidad Java ↔ Tabla SQL
@Entity
@Table(name = "clients")        // tabla: snake_case, plural
public class Client {            // clase: PascalCase, singular

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;             // columna: id

    @Column(name = "first_name") // columna: snake_case
    private String firstName;    // campo Java: camelCase

    @Column(length = 1, columnDefinition = "CHAR(1) DEFAULT 'A'")
    private String status;       // único campo del ciclo de vida: 'A' activo / 'I' inactivo

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "category_id") // FK: {tabla_singular}_id
    private Category category;
}`;

const DB_MAPPING_MONGO = `// Entidad Java ↔ Colección MongoDB
@Document("clients")              // colección: snake_case, plural
public class Client {              // clase: PascalCase, singular

    @Id
    private ObjectId id;           // _id auto-generado

    private String firstName;      // campo Mongo: camelCase (igual que Java)
    private String email;
    private String status;         // único campo del ciclo de vida: "A" activo / "I" inactivo
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String categoryId;     // referencia FK: sufijo Id
}`;

const COMMENT_LEVELS = [
     {
          level: "Nivel de clase",
          required: true,
          rule: "Obligatorio · 5-8 palabras en inglés · describe la responsabilidad principal",
          color: "text-emerald-400",
          bg: "bg-emerald-500/8 border-emerald-500/20",
     },
     {
          level: "Nivel de método",
          required: false,
          rule: "Solo cuando la lógica NO es obvia · documenta comportamiento no evidente",
          color: "text-sky-400",
          bg: "bg-sky-500/8 border-sky-500/20",
     },
     {
          level: "Inline (dentro del método)",
          required: false,
          rule: "Solo para lógica compleja, regex o algoritmos · nunca para código obvio",
          color: "text-amber-400",
          bg: "bg-amber-500/8 border-amber-500/20",
     },
];

const COMMENT_JAVA = `/** Handles client CRUD REST operations. */
@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientRest {

    private final ClientService service;

    @GetMapping
    public Flux<Client> findAll() {
        return service.findAll();
    }

    /** Soft-deletes client by toggling status to inactive. */
    @PatchMapping("/{id}/deactivate")
    public Mono<Client> deactivate(@PathVariable Long id) {
        return service.deactivate(id);
    }
}

/** Manages client business logic and validation. */
@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository repository;

    public Flux<Client> findAll() {
        return repository.findAll();
    }

    /** Toggles status to 'I' instead of deleting the record. */
    public Mono<Client> deactivate(Long id) {
        return repository.findById(id)
            .map(client -> {
                client.setStatus("I");
                return client;
            })
            .flatMap(repository::save);
    }
}

/** Provides reactive data access for client entity. */
public interface ClientRepository
        extends ReactiveCrudRepository<Client, Long> {
}`;

const COMMENT_PYTHON = `"""Handles client HTTP route endpoints."""

from flask import Blueprint, request, jsonify
from app.services import client_service

bp = Blueprint("clients", __name__)


@bp.route("/clients", methods=["GET"])
def list_clients():
    return jsonify(client_service.get_all())


@bp.route("/clients", methods=["POST"])
def add_client():
    """Validates payload and creates a new client record."""
    data = request.json
    client_service.create(data)
    return jsonify({"ok": True}), 201


"""Manages client database operations with SQLite."""

import sqlite3
from app import settings


def get_all():
    conn = sqlite3.connect(settings.DATABASE)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM clients WHERE status = 'A'").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def create(data):
    conn = sqlite3.connect(settings.DATABASE)
    conn.execute(
        "INSERT INTO clients (first_name, email, status) VALUES (?, ?, 'A')",
        (data["first_name"], data["email"]),
    )
    conn.commit()
    conn.close()`;

const COMMENT_JS_TS = `/** Displays client list with search and filter. */
export default function ClientPage() {
  const { clients, loading } = useClients();

  return (
    <div>
      {loading ? <Spinner /> : <ClientTable data={clients} />}
    </div>
  );
}

/** Reusable data table with sorting and pagination. */
export function DataTable({ columns, rows, onSort }) {
  // Complex sort: multi-column with priority queue
  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      for (const col of columns) {
        const diff = compare(a[col.key], b[col.key]);
        if (diff !== 0) return diff;
      }
      return 0;
    });
  }, [rows, columns]);

  return <table>{/* render */}</table>;
}

/** Fetches and caches client list from the API. */
export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAll()
      .then(res => setClients(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { clients, loading };
}

// Angular — Service
/** Provides HTTP operations for client entity. */
@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly apiUrl = environment.apiUrl + '/clients';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  /** Soft-deletes by sending PATCH to toggle status. */
  deactivate(id: number): Observable<Client> {
    return this.http.patch<Client>(\`\${this.apiUrl}/\${id}/deactivate\`, {});
  }
}`;

const COMMENT_DO = [
     { rule: "Clase: siempre un Javadoc/docstring de 5-8 palabras", example: "/** Handles client CRUD REST operations. */", color: "text-emerald-400" },
     { rule: "Método con lógica no obvia", example: "/** Soft-deletes client by toggling status. */", color: "text-sky-400" },
     { rule: "Regex o algoritmos complejos", example: "// Match email format: user@domain.tld", color: "text-amber-400" },
     { rule: "TODO/FIXME con ticket o fecha", example: "// TODO(#42): implement pagination", color: "text-orange-400" },
     { rule: "Configuraciones no evidentes", example: "// CORS: allow only frontend origin in production", color: "text-violet-400" },
];

const COMMENT_DONT = [
     { rule: "Getters, setters, constructores", example: "// Returns the name ← NUNCA", color: "text-red-400" },
     { rule: "Imports", example: "// Import React ← NUNCA", color: "text-red-400" },
     { rule: "Código que se explica solo", example: "// Find all clients ← sobre findAll()", color: "text-red-400" },
     { rule: "Comentarios en español dentro del código", example: "// Obtener todos los clientes ← NUNCA", color: "text-red-400" },
     { rule: "Bloques de comentarios decorativos", example: "// ============================== ← NUNCA", color: "text-red-400" },
     { rule: "Código comentado (muerto)", example: "// const old = fetchOld(); ← eliminar, no comentar", color: "text-red-400" },
     { rule: "Comentarios auto-generados por IA sin revisar", example: "// This function handles... ← genérico, eliminar", color: "text-red-400" },
];

const COMMENT_FORMAT = [
     { lang: "Java", syntax: "Javadoc", format: "/** Single-line description. */", multiline: "/**\\n * Multiline description.\\n * @param id the client identifier\\n * @return reactive client stream\\n */", color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
     { lang: "Python", syntax: "Docstring", format: "\"\"\"Single-line description.\"\"\"", multiline: "\"\"\"\\nMultiline description.\\n\\nArgs:\\n    data: client payload dict\\n\\nReturns:\\n    Created client dict\\n\"\"\"", color: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20" },
     { lang: "JavaScript", syntax: "JSDoc", format: "/** Single-line description. */", multiline: "/**\\n * Multiline description.\\n * @param {Object} props - Component props\\n * @returns {JSX.Element}\\n */", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
     { lang: "TypeScript", syntax: "TSDoc", format: "/** Single-line description. */", multiline: "/**\\n * Multiline description.\\n * @param id - The client identifier\\n * @returns Observable of client\\n */", color: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/20" },
];

const REPORT_OPTIONS = [
     {
          name: "JasperReports",
          side: "Backend (Java)",
          accent: "orange",
          desc: "Genera el PDF en el servidor a partir de una plantilla .jrxml diseñada visualmente (Jaspersoft Studio) y datos que le pasa el microservicio.",
          pros: ["Plantillas visuales reutilizables (logo, cabecera, pie de página fijos)", "Formato idéntico sin importar el navegador del cliente", "Ideal para documentos formales: boletas, facturas, constancias"],
          cons: ["Requiere diseñar el .jrxml (curva de aprendizaje adicional)", "Más pesado de configurar que una librería frontend", "El backend carga con el trabajo de renderizado"],
          when: "Documentos legales/fiscales (boletas, facturas) donde el formato debe ser exacto y consistente — típico en Semestre V·VI.",
     },
     {
          name: "jsPDF + autoTable / pdfmake",
          side: "Frontend (React / Angular)",
          accent: "sky",
          desc: "Genera el PDF directamente en el navegador a partir de los datos ya cargados en la vista (tabla, formulario), sin ida y vuelta al backend.",
          pros: ["Cero carga extra en el backend", "Rápido de implementar para reportes simples", "El usuario descarga el archivo al instante"],
          cons: ["Formato depende de cómo lo armes en JS — más manual", "No es ideal para documentos legales/fiscales complejos", "Cada frontend (Angular/React) repite su propia lógica de exportación"],
          when: "Reportes internos rápidos: exportar una tabla, un listado, un resumen — común en Semestre II al IV.",
     },
];

const REPORT_SNIPPET_JASPER = `// report/InvoiceReportService.java — Backend Java (Semestre III/IV/V·VI)
@Service
@RequiredArgsConstructor
public class InvoiceReportService {

    public byte[] generateInvoicePdf(Long clientId) throws JRException, IOException {
        InputStream template = getClass().getResourceAsStream("/reports/invoice.jrxml");
        JasperReport report = JasperCompileManager.compileReport(template);

        Map<String, Object> params = new HashMap<>();
        params.put("clientId", clientId);

        JasperPrint print = JasperFillManager.fillReport(report, params, dataSource);
        return JasperExportManager.exportReportToPdf(print);
    }
}

// rest/InvoiceRest.java
@GetMapping("/{clientId}/invoice")
public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long clientId) throws Exception {
    byte[] pdf = invoiceReportService.generateInvoicePdf(clientId);
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice.pdf")
        .contentType(MediaType.APPLICATION_PDF)
        .body(pdf);
}`;

const REPORT_SNIPPET_FRONTEND = `// utils/exportClientsPdf.js — Frontend (React / Angular, JS puro)
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportClientsPdf(clients) {
  const doc = new jsPDF();
  doc.text('Reporte de Clientes', 14, 15);

  autoTable(doc, {
    startY: 20,
    head: [['ID', 'Nombre', 'Email', 'Estado']],
    body: clients.map(c => [c.id, c.fullName, c.email, c.status]),
  });

  doc.save('clientes.pdf');
}

// ClientListPage.jsx — uso en un botón
<button onClick={() => exportClientsPdf(clients)}>Exportar PDF</button>`;

const ACCENT = {
     teal: { active: "bg-teal-600/20 border-teal-500/50 text-teal-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300", bar: "bg-teal-500", dot: "text-teal-400", badge: "bg-teal-500/15 border-teal-500/25 text-teal-400" },
     violet: { active: "bg-violet-600/20 border-violet-500/50 text-violet-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300", bar: "bg-violet-500", dot: "text-violet-400", badge: "bg-violet-500/15 border-violet-500/25 text-violet-400" },
     amber: { active: "bg-amber-600/20 border-amber-500/50 text-amber-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300", bar: "bg-amber-500", dot: "text-amber-400", badge: "bg-amber-500/15 border-amber-500/25 text-amber-400" },
};

function SectionHeader({ color, title, badge, badgeColor }) {
     return (
          <div className="flex items-center gap-3 mb-2">
               <div className={`w-1 h-5 ${color} rounded-full`} />
               <h2 className="text-white font-bold text-lg">{title}</h2>
               {badge && (
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest border ${badgeColor}`}>
                         {badge}
                    </span>
               )}
          </div>
     );
}

function CodeBlock({ filename, code }) {
     return (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
               <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                    <div className="flex gap-1.5">
                         <span className="w-3 h-3 rounded-full bg-red-500/60" />
                         <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                         <span className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-slate-500 text-xs font-mono ml-2">{filename}</span>
               </div>
               <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-slate-300 whitespace-pre max-h-128 overflow-y-auto">{code}</pre>
          </div>
     );
}

function RuleCard({ index, rule, detail, accent = "emerald" }) {
     const colors = {
          emerald: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
          teal: "bg-teal-500/15 border-teal-500/30 text-teal-400",
          violet: "bg-violet-500/15 border-violet-500/30 text-violet-400",
     };
     return (
          <div className="flex gap-4 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
               <span className={`shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-black font-mono mt-0.5 ${colors[accent]}`}>
                    {index}
               </span>
               <div>
                    <p className={`text-sm font-semibold mb-0.5 ${accent === "teal" ? "text-teal-300" : accent === "violet" ? "text-violet-300" : "text-emerald-300"}`}>{rule}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{detail}</p>
               </div>
          </div>
     );
}

function DatabaseTab() {
     const [dbType, setDbType] = useState("sql");

     const namingData = dbType === "sql" ? DB_NAMING_SQL : DB_NAMING_MONGO;
     const mappingCode = dbType === "sql" ? DB_MAPPING_EXAMPLE : DB_MAPPING_MONGO;
     const mappingFile = dbType === "sql" ? "Client.java — JPA + SQL" : "Client.java — MongoDB";

     return (
          <div className="space-y-10">
               <div className="rounded-2xl border border-teal-500/25 bg-teal-500/5 p-5">
                    <div className="flex items-center gap-2 mb-2">
                         <span className="text-teal-400 text-sm">🌐</span>
                         <p className="text-teal-300 font-bold text-sm uppercase tracking-widest">Regla crítica — Idioma obligatorio: Inglés</p>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                         Toda tabla, columna, colección, entidad y campo debe nombrarse en <span className="text-teal-300 font-semibold">inglés</span>, sin excepción, en todos los semestres (II al V·VI) y motores de base de datos. No se acepta español ni mezcla de ambos idiomas — es la validación principal que aplica el bot de code review.
                    </p>
                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-2">Glosario de dominio — español → inglés</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                         {DB_LANGUAGE_GLOSSARY.map((g, i) => (
                              <div key={i} className="flex items-center justify-between gap-3 text-xs bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2">
                                   <span className="text-slate-500">{g.es} → <span className="text-teal-300 font-mono">{g.en}</span></span>
                                   <span className="text-slate-500">{g.es2} → <span className="text-teal-300 font-mono">{g.en2}</span></span>
                              </div>
                         ))}
                    </div>
               </div>

               <div>
                    <SectionHeader color="bg-teal-500" title="Motor de base de datos" />
                    <p className="text-slate-500 text-sm mb-4">Selecciona el motor para ver las convenciones de naming específicas.</p>
                    <div className="flex rounded-xl border border-slate-800 overflow-hidden w-fit">
                         <button
                              onClick={() => setDbType("sql")}
                              className={`px-5 py-2 text-xs font-bold transition-all border-r border-slate-800 ${dbType === "sql" ? "bg-teal-500/15 text-teal-300" : "text-slate-500 hover:text-slate-300"}`}
                         >
                              SQL (MySQL · SQL Server · Oracle)
                         </button>
                         <button
                              onClick={() => setDbType("mongo")}
                              className={`px-5 py-2 text-xs font-bold transition-all ${dbType === "mongo" ? "bg-green-500/15 text-green-300" : "text-slate-500 hover:text-slate-300"}`}
                         >
                              MongoDB
                         </button>
                    </div>
               </div>

               <AnimatePresence mode="wait">
                    <motion.div
                         key={dbType}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         transition={{ duration: 0.2 }}
                         className="space-y-10"
                    >
                         <div>
                              <SectionHeader
                                   color="bg-sky-500"
                                   title={`Nomenclatura — ${dbType === "sql" ? "SQL" : "MongoDB"}`}
                                   badge={dbType === "sql" ? "Relacional" : "NoSQL"}
                                   badgeColor={dbType === "sql" ? "bg-sky-500/15 border-sky-500/25 text-sky-400" : "bg-green-500/15 border-green-500/25 text-green-400"}
                              />
                              <p className="text-slate-500 text-sm mb-4">Cada fila muestra el elemento, la regla, un ejemplo correcto y uno incorrecto.</p>
                              <div className="rounded-2xl border border-slate-800 overflow-hidden">
                                   <div className="grid grid-cols-4 bg-slate-900/80 border-b border-slate-800 px-4 py-2">
                                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Elemento</span>
                                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Regla</span>
                                        <span className="text-emerald-400/70 text-xs font-bold uppercase tracking-widest">Correcto ✓</span>
                                        <span className="text-red-400/70 text-xs font-bold uppercase tracking-widest">Incorrecto ✗</span>
                                   </div>
                                   {namingData.map((row) => (
                                        <div key={row.element} className="grid grid-cols-4 px-4 py-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors">
                                             <span className={`text-xs font-semibold ${row.color}`}>{row.element}</span>
                                             <span className="text-slate-400 text-xs">{row.rule}</span>
                                             <span className="text-emerald-300 text-xs font-mono">{row.good}</span>
                                             <span className="text-red-400/70 text-xs font-mono line-through">{row.bad}</span>
                                        </div>
                                   ))}
                              </div>
                         </div>

                         <div>
                              <SectionHeader color="bg-amber-500" title={`Mapeo Java ↔ ${dbType === "sql" ? "SQL" : "MongoDB"}`} />
                              <p className="text-slate-500 text-sm mb-4">Cómo se conecta el naming de Java con el naming de la base de datos.</p>
                              <CodeBlock filename={mappingFile} code={mappingCode} />
                         </div>
                    </motion.div>
               </AnimatePresence>

               <div>
                    <SectionHeader color="bg-emerald-500" title="Reglas generales" badge="Todos los motores" badgeColor="bg-emerald-500/15 border-emerald-500/25 text-emerald-400" />
                    <div className="space-y-2">
                         {DB_GENERAL_RULES.map((r, i) => (
                              <RuleCard key={i} index={i + 1} rule={r.rule} detail={r.detail} accent="teal" />
                         ))}
                    </div>
               </div>
          </div>
     );
}

function CommentsTab() {
     const [lang, setLang] = useState("java");

     const codeMap = { java: COMMENT_JAVA, python: COMMENT_PYTHON, js: COMMENT_JS_TS };
     const fileMap = { java: "ClientRest.java · ClientService.java · ClientRepository.java", python: "clientes.py · cliente_service.py", js: "ClientPage.jsx · DataTable.jsx · useClients.js · client.service.ts" };
     const langLabels = [
          { id: "java", label: "Java", color: "bg-orange-500/15 text-orange-300" },
          { id: "python", label: "Python", color: "bg-yellow-500/15 text-yellow-300" },
          { id: "js", label: "JS / TS", color: "bg-sky-500/15 text-sky-300" },
     ];

     return (
          <div className="space-y-10">
               <div>
                    <SectionHeader color="bg-violet-500" title="Niveles de comentario" />
                    <p className="text-slate-500 text-sm mb-4">Solo hay tres niveles válidos. Cada uno tiene reglas claras sobre cuándo aplicarlo.</p>
                    <div className="space-y-2">
                         {COMMENT_LEVELS.map((lvl) => (
                              <div key={lvl.level} className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${lvl.bg}`}>
                                   <div className="flex items-center gap-2 sm:w-48 shrink-0">
                                        <span className={`text-sm font-bold ${lvl.color}`}>{lvl.level}</span>
                                        {lvl.required && (
                                             <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">Obligatorio</span>
                                        )}
                                   </div>
                                   <p className="text-slate-400 text-xs leading-relaxed">{lvl.rule}</p>
                              </div>
                         ))}
                    </div>
               </div>

               <div>
                    <SectionHeader color="bg-sky-500" title="Formato por lenguaje" />
                    <div className="space-y-2 mb-6">
                         {COMMENT_FORMAT.map((f) => (
                              <div key={f.lang} className={`rounded-xl border px-4 py-3 ${f.bg}`}>
                                   <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-sm font-bold ${f.color}`}>{f.lang}</span>
                                        <span className="text-slate-500 text-xs font-mono">{f.syntax}</span>
                                   </div>
                                   <div className="space-y-1">
                                        <p className="text-slate-300 text-xs font-mono">{f.format}</p>
                                        <p className="text-slate-500 text-[11px] font-mono whitespace-pre-line">{f.multiline}</p>
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>

               <div>
                    <SectionHeader color="bg-emerald-500" title="Qué SÍ comentar" badge="Permitido" badgeColor="bg-emerald-500/15 border-emerald-500/25 text-emerald-400" />
                    <div className="space-y-1.5 mb-8">
                         {COMMENT_DO.map((r, i) => (
                              <div key={i} className="flex items-start gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3">
                                   <span className="text-emerald-400 text-sm mt-0.5 shrink-0">✓</span>
                                   <div className="min-w-0">
                                        <p className={`text-sm font-semibold ${r.color}`}>{r.rule}</p>
                                        <p className="text-slate-500 text-xs font-mono mt-0.5">{r.example}</p>
                                   </div>
                              </div>
                         ))}
                    </div>

                    <SectionHeader color="bg-red-500" title="Qué NO comentar" badge="Prohibido" badgeColor="bg-red-500/15 border-red-500/25 text-red-400" />
                    <div className="space-y-1.5">
                         {COMMENT_DONT.map((r, i) => (
                              <div key={i} className="flex items-start gap-3 rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-3">
                                   <span className="text-red-400 text-sm mt-0.5 shrink-0">✗</span>
                                   <div className="min-w-0">
                                        <p className={`text-sm font-semibold ${r.color}`}>{r.rule}</p>
                                        <p className="text-slate-500 text-xs font-mono mt-0.5 line-through">{r.example}</p>
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>

               <div>
                    <SectionHeader color="bg-orange-500" title="Ejemplo completo por lenguaje" />
                    <p className="text-slate-500 text-sm mb-4">Selecciona el lenguaje para ver un ejemplo real con comentarios aplicados correctamente.</p>
                    <div className="flex rounded-xl border border-slate-800 overflow-hidden w-fit mb-5">
                         {langLabels.map((l) => (
                              <button
                                   key={l.id}
                                   onClick={() => setLang(l.id)}
                                   className={`px-5 py-2 text-xs font-bold transition-all border-r border-slate-800 last:border-r-0 ${lang === l.id ? l.color : "text-slate-500 hover:text-slate-300"}`}
                              >
                                   {l.label}
                              </button>
                         ))}
                    </div>
                    <AnimatePresence mode="wait">
                         <motion.div
                              key={lang}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                         >
                              <CodeBlock filename={fileMap[lang]} code={codeMap[lang]} />
                         </motion.div>
                    </AnimatePresence>
               </div>
          </div>
     );
}

function ReportsTab() {
     return (
          <div className="space-y-10">
               <div>
                    <SectionHeader color="bg-amber-500" title="¿Backend o Frontend para generar reportes?" />
                    <p className="text-slate-500 text-sm mb-4">Ambos enfoques son válidos — la elección depende del tipo de documento. No hay una única forma correcta, pero sí un criterio claro para decidir.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {REPORT_OPTIONS.map((opt) => (
                              <div key={opt.name} className={`rounded-2xl border p-5 space-y-3 ${opt.accent === "orange" ? "border-orange-500/20 bg-orange-500/5" : "border-sky-500/20 bg-sky-500/5"}`}>
                                   <div className="flex items-center justify-between gap-2">
                                        <h3 className={`font-bold text-base ${opt.accent === "orange" ? "text-orange-400" : "text-sky-400"}`}>{opt.name}</h3>
                                        <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">{opt.side}</span>
                                   </div>
                                   <p className="text-slate-400 text-xs leading-relaxed">{opt.desc}</p>
                                   <div>
                                        <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">Ventajas</p>
                                        <ul className="space-y-0.5">
                                             {opt.pros.map((p) => <li key={p} className="text-slate-400 text-xs">✓ {p}</li>)}
                                        </ul>
                                   </div>
                                   <div>
                                        <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mb-1">Desventajas</p>
                                        <ul className="space-y-0.5">
                                             {opt.cons.map((c) => <li key={c} className="text-slate-400 text-xs">✗ {c}</li>)}
                                        </ul>
                                   </div>
                                   <div className="rounded-lg border border-slate-800 px-3 py-2 bg-slate-900/40">
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Ideal para</p>
                                        <p className="text-slate-300 text-xs">{opt.when}</p>
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>

               <div>
                    <SectionHeader color="bg-orange-500" title="Backend — JasperReports" badge="Boletas / Facturas" badgeColor="bg-orange-500/15 border-orange-500/25 text-orange-400" />
                    <p className="text-slate-500 text-sm mb-4 max-w-2xl">La plantilla <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">.jrxml</code> vive en <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">resources/reports/</code>. El servicio compila la plantilla, la rellena con datos y expone el PDF por un endpoint REST.</p>
                    <CodeBlock filename="report/InvoiceReportService.java · rest/InvoiceRest.java" code={REPORT_SNIPPET_JASPER} />
               </div>

               <div>
                    <SectionHeader color="bg-sky-500" title="Frontend — jsPDF + autoTable" badge="Reportes internos" badgeColor="bg-sky-500/15 border-sky-500/25 text-sky-400" />
                    <p className="text-slate-500 text-sm mb-4 max-w-2xl">Sirve igual en React o Angular (es JavaScript puro). Para tablas grandes también se puede exportar a Excel con <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">exceljs</code> o <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">xlsx</code> siguiendo el mismo patrón: una función en <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">utils/</code>.</p>
                    <CodeBlock filename="utils/exportClientsPdf.js" code={REPORT_SNIPPET_FRONTEND} />
               </div>
          </div>
     );
}


export default function Conventions() {
     const [activeTab, setActiveTab] = useState("database");

     return (
          <div className="min-h-full px-6 md:px-10 py-10 max-w-5xl mx-auto space-y-14">

               <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                         <span className="bg-teal-600/20 border border-teal-600/40 text-teal-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                              Convenciones
                         </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
                         Base de Datos y Comentarios
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                         Estándares de <span className="text-teal-400 font-semibold">nomenclatura de base de datos en inglés</span> (tablas, columnas, índices, constraints) y{" "}
                         <span className="text-violet-400 font-semibold">comentarios en código</span> (Javadoc, docstrings, JSDoc) para todos los proyectos del semestre II al VI.
                    </p>
               </motion.div>

               <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex flex-wrap gap-2 mb-8">
                         {TABS.map((tab) => {
                              const a = ACCENT[tab.accent];
                              return (
                                   <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 ${activeTab === tab.id ? a.active : a.inactive}`}
                                   >
                                        <span>{tab.icon}</span>
                                        <span>{tab.label}</span>
                                   </button>
                              );
                         })}
                    </div>

                    <AnimatePresence mode="wait">
                         {activeTab === "database" && (
                              <motion.div key="db" custom={2} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }}>
                                   <DatabaseTab />
                              </motion.div>
                         )}
                         {activeTab === "comments" && (
                              <motion.div key="comments" custom={2} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }}>
                                   <CommentsTab />
                              </motion.div>
                         )}
                         {activeTab === "reports" && (
                              <motion.div key="reports" custom={2} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }}>
                                   <ReportsTab />
                              </motion.div>
                         )}
                    </AnimatePresence>
               </motion.div>
          </div>
     );
}
