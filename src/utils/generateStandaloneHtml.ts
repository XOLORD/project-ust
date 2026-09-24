// Genera un archivo HTML autónomo completo que incluye Tailwind CSS por CDN,
// Chart.js por CDN, fuentes Google y la lógica JavaScript completa reactiva.

export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Equilibria Colombia - Punto de Equilibrio y Estacionalidad Comercial</title>
  <meta name="description" content="Estudio interactivo de Punto de Equilibrio y Estacionalidad Comercial en departamentos de Colombia.">
  
  <!-- CDN Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>

  <!-- CDN Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    body {
      background-color: #020617;
      color: #f8fafc;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }
    input[type=range] {
      accent-color: #10b981;
    }
  </style>
</head>
<body class="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">

  <!-- Top Bar -->
  <header class="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
          ⚡
        </div>
        <div>
          <a href="#" class="text-base font-bold tracking-tight text-white flex items-center gap-2">
            Equilibria Colombia
            <span class="text-[10px] uppercase font-semibold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
              Punto de Equilibrio
            </span>
          </a>
        </div>
      </div>

      <nav class="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <a href="#control-panel" class="hover:text-white transition-colors">Parámetros</a>
        <a href="#grafico-pe" class="hover:text-white transition-colors">Curva PE</a>
        <a href="#grafico-estacionalidad" class="hover:text-white transition-colors">Estacionalidad</a>
        <a href="#fechas-clave" class="hover:text-white transition-colors">Festividades</a>
      </nav>

      <div class="flex items-center gap-2">
        <button onclick="window.print()" class="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white">
          <span>🖨️ Imprimir Informe</span>
        </button>
      </div>
    </div>
  </header>

  <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
    
    <!-- Hero / Intro -->
    <div class="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/30 p-6">
      <div class="max-w-3xl">
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Estudio de Punto de Equilibrio y Estacionalidad Comercial en Colombia
        </h1>
        <p class="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          Simulador financiero para evaluar la viabilidad de proyectos industriales y comerciales adaptado al calendario comercial colombiano (Día de la Madre, Amor y Amistad, Feria de las Flores, Carnaval de Barranquilla, Prima Legal de Servicios y Navidad).
        </p>
      </div>
    </div>

    <!-- Panel de Control y Filtros -->
    <div id="control-panel" class="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
      <div class="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h2 class="text-sm font-semibold text-white">1. Parámetros de Simulación & Región</h2>
          <p class="text-xs text-slate-400">Selecciona el departamento de Colombia, preset de producto o ajusta las variables de costo en COP.</p>
        </div>
        <button onclick="resetDefaults()" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
          Restablecer Valores
        </button>
      </div>

      <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <!-- Selector Región -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Región / Departamento</label>
          <select id="regionSelect" onchange="onRegionChange()" class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none">
            <!-- Rellenado por JS -->
          </select>
          <div id="regionDescription" class="mt-1.5 text-[11px] text-slate-400"></div>
        </div>

        <!-- Selector Producto Preset -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Producto / Categoría</label>
          <select id="presetSelect" onchange="onPresetChange()" class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none">
            <!-- Rellenado por JS -->
          </select>
          <div id="presetDescription" class="mt-1.5 text-[11px] text-slate-400"></div>
        </div>

        <!-- Selector Mes / Temporalidad -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Temporalidad / Mes de Análisis</label>
          <select id="monthSelect" onchange="onMonthChange()" class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none">
            <option value="all">Vista Anual Completa (12 Meses)</option>
            <option value="0">Enero</option>
            <option value="1">Febrero</option>
            <option value="2">Marzo</option>
            <option value="3">Abril</option>
            <option value="4">Mayo (Día de la Madre)</option>
            <option value="5">Junio (Prima de Servicios)</option>
            <option value="6">Julio</option>
            <option value="7">Agosto (Feria de las Flores / Festivales)</option>
            <option value="8">Septiembre (Amor y Amistad)</option>
            <option value="9">Octubre</option>
            <option value="10">Noviembre (Black Friday)</option>
            <option value="11">Diciembre (Navidad & Prima)</option>
          </select>
          <div id="monthMultiplierLabel" class="mt-1.5 text-[11px] text-emerald-400"></div>
        </div>
      </div>

      <!-- Sliders Numéricos -->
      <div class="mt-5 border-t border-slate-800 pt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Precio de Venta -->
        <div class="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-300">Precio Venta (PV)</span>
            <span id="priceDisplay" class="font-mono font-bold text-emerald-400">$ 0 COP</span>
          </div>
          <input type="range" id="priceRange" min="1000" max="300000" step="500" oninput="onInputPrice(this.value)" class="w-full">
        </div>

        <!-- Costo Variable Unitario -->
        <div class="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-300">Costo Variable (CVU)</span>
            <span id="varCostDisplay" class="font-mono font-bold text-indigo-400">$ 0 COP</span>
          </div>
          <input type="range" id="varCostRange" min="500" max="200000" step="500" oninput="onInputVarCost(this.value)" class="w-full">
        </div>

        <!-- Costos Fijos Mensuales -->
        <div class="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-300">Costos Fijos (CF)</span>
            <span id="fixedCostDisplay" class="font-mono font-bold text-amber-400">$ 0 COP</span>
          </div>
          <input type="range" id="fixedCostRange" min="1000000" max="50000000" step="500000" oninput="onInputFixedCost(this.value)" class="w-full">
        </div>

        <!-- Volumen de Ventas Base -->
        <div class="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-300">Volumen Base (Q)</span>
            <span id="unitsDisplay" class="font-mono font-bold text-white">0 uds</span>
          </div>
          <input type="range" id="unitsRange" min="10" max="6000" step="20" oninput="onInputUnits(this.value)" class="w-full">
        </div>
      </div>
    </div>

    <!-- Tarjetas de KPIs Destacados -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- KPI 1 -->
      <div class="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
        <div class="text-xs text-slate-400">Punto de Equilibrio (PE)</div>
        <div id="kpiPEUnits" class="mt-2 text-2xl font-bold font-mono text-white">0 uds</div>
        <div class="mt-1 text-xs text-slate-400">
          Ingresos PE: <span id="kpiPERevenue" class="font-mono font-semibold text-slate-200">$ 0 COP</span>
        </div>
        <div class="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-500">Unidades para cubrir 100% de costos</div>
      </div>

      <!-- KPI 2 -->
      <div class="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
        <div class="text-xs text-slate-400">Margen de Contribución</div>
        <div id="kpiMarginUnit" class="mt-2 text-2xl font-bold font-mono text-emerald-400">$ 0 COP</div>
        <div class="mt-1 text-xs text-slate-400">
          Razón MC: <span id="kpiMarginRatio" class="font-mono font-semibold text-emerald-300">0%</span>
        </div>
        <div class="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-500">MCU = Precio de Venta - Costo Variable</div>
      </div>

      <!-- KPI 3 -->
      <div id="kpiProfitCard" class="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
        <div id="kpiProfitTitle" class="text-xs text-slate-400">Utilidad Operativa Estimada</div>
        <div id="kpiProfitValue" class="mt-2 text-2xl font-bold font-mono text-emerald-400">$ 0 COP</div>
        <div class="mt-1 text-xs text-slate-400">
          Margen Seguridad: <span id="kpiSafetyMargin" class="font-mono font-semibold text-slate-200">0%</span>
        </div>
        <div id="kpiProfitFootnote" class="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-500">Utilidad = IT - CT</div>
      </div>

      <!-- KPI 4 -->
      <div class="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
        <div class="text-xs text-slate-400">Rango Estacional Regional</div>
        <div class="mt-2 space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400">Pico:</span>
            <span id="kpiHighMonth" class="font-mono font-bold text-emerald-400">-</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Valle:</span>
            <span id="kpiLowMonth" class="font-mono font-bold text-slate-300">-</span>
          </div>
        </div>
        <div class="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
          <span>Meses sobre PE:</span>
          <span id="kpiMonthsAbovePE" class="font-mono font-bold text-slate-300">0 / 12</span>
        </div>
      </div>
    </div>

    <!-- Gráficos Interactivos -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Gráfico 1: Curva de Costos vs Ingresos (Punto de Equilibrio) -->
      <div id="grafico-pe" class="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
        <div class="border-b border-slate-800 pb-2">
          <h3 class="text-sm font-semibold text-white">Curva de Costos Totales vs. Ingresos Totales</h3>
          <p class="text-xs text-slate-400">Intersección en el Punto de Equilibrio (PE)</p>
        </div>
        <div class="relative h-72 w-full mt-4">
          <canvas id="chartBreakEven"></canvas>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <div class="text-rose-400">🔴 Zona izquierda: Pérdida (Q &lt; PE)</div>
          <div class="text-emerald-400">🟢 Zona derecha: Utilidad (Q &gt; PE)</div>
        </div>
      </div>

      <!-- Gráfico 2: Estacionalidad Comercial Mensual -->
      <div id="grafico-estacionalidad" class="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
        <div class="border-b border-slate-800 pb-2 flex justify-between items-center">
          <div>
            <h3 class="text-sm font-semibold text-white">Estacionalidad Comercial Mensual</h3>
            <p class="text-xs text-slate-400">Demanda (barras) vs Utilidad Mensual (línea azul)</p>
          </div>
        </div>
        <div class="relative h-72 w-full mt-4">
          <canvas id="chartSeasonality"></canvas>
        </div>
        <div class="mt-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          💡 La línea amarilla punteada indica el volumen mensual para no perder dinero.
        </div>
      </div>
    </div>

    <!-- Cronograma de Fechas Clave y Festivos -->
    <div id="fechas-clave" class="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
      <div class="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h3 class="text-sm font-semibold text-white">Cronograma de Fechas Clave & Festividades por Departamento</h3>
          <p class="text-xs text-slate-400">Haz clic en cualquier evento para proyectar el impacto en la demanda.</p>
        </div>
      </div>
      <div class="mt-3 overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-800 text-slate-400">
              <th class="py-2">Evento / Festividad</th>
              <th class="py-2">Mes</th>
              <th class="py-2 text-center">Alcance</th>
              <th class="py-2 text-right">Impacto Demanda</th>
              <th class="py-2 text-right">Venta Estimada</th>
              <th class="py-2 text-center">Acción</th>
            </tr>
          </thead>
          <tbody id="eventsTableBody" class="divide-y divide-slate-800/60">
            <!-- Rellenado dinámicamente -->
          </tbody>
        </table>
      </div>
    </div>

  </main>

  <footer class="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
    Equilibria Colombia · Simulador Financiero e Industrial de Punto de Equilibrio y Estacionalidad Regional
  </footer>

  <script>
    // --- DATOS REALISTAS DE COLOMBIA ---
    const REGIONS = [
      {
        id: 'bogota',
        name: 'Bogotá D.C. y Sabana',
        desc: 'Mercado de 8 millones de habitantes; alto consumo corporativo e impacto de primas laborales.',
        factors: [0.85, 0.95, 0.92, 0.90, 1.30, 1.22, 1.05, 0.98, 1.20, 1.02, 1.35, 1.70],
        events: [
          { name: 'Temporada Escolar', month: 0, scope: 'Nacional', impact: 35, tip: 'Uniformes, calzado y útiles' },
          { name: 'Día de la Madre', month: 4, scope: 'Nacional', impact: 55, tip: 'Pico masivo en vestuario, restaurantes y obsequios' },
          { name: 'Prima de Mitad de Año', month: 5, scope: 'Nacional', impact: 40, tip: 'Inyección de liquidez legal a empleados formales' },
          { name: 'Amor y Amistad', month: 8, scope: 'Nacional', impact: 38, tip: 'Confitería, licores, gastronomía y vestuario' },
          { name: 'Black Friday / Cyberlunes', month: 10, scope: 'Nacional', impact: 45, tip: 'Compras anticipadas de fin de año' },
          { name: 'Navidad y Prima Navideña', month: 11, scope: 'Nacional', impact: 75, tip: 'Pico comercial más alto del año en Colombia' }
        ]
      },
      {
        id: 'antioquia',
        name: 'Antioquia (Medellín / Oriente)',
        desc: 'Eje textil, confección y café; gran turismo en Feria de las Flores y Alumbrados.',
        factors: [0.82, 0.94, 0.90, 0.88, 1.28, 1.20, 1.25, 1.48, 1.18, 1.05, 1.30, 1.80],
        events: [
          { name: 'Colombiatex de las Américas', month: 0, scope: 'Regional', impact: 30, tip: 'Feria insumos textiles y compras mayoristas' },
          { name: 'Día de la Madre', month: 4, scope: 'Nacional', impact: 55, tip: 'Prendas de vestir y marroquinería' },
          { name: 'Colombiamoda', month: 6, scope: 'Regional', impact: 35, tip: 'Lanzamiento de colecciones segundo semestre' },
          { name: 'Feria de las Flores de Medellín', month: 7, scope: 'Regional', impact: 60, tip: 'Afluencia turística masiva y consumo de licores y alimentos' },
          { name: 'Alumbrados Navideños & Fin de Año', month: 11, scope: 'Regional', impact: 80, tip: 'Comercio nocturno extendido' }
        ]
      },
      {
        id: 'valle',
        name: 'Valle del Cauca (Cali / Yumbo)',
        desc: 'Agroindustria azucarera, confección, calzado y turismo ferial.',
        factors: [0.80, 0.90, 0.92, 0.88, 1.25, 1.18, 1.08, 1.35, 1.15, 1.02, 1.28, 1.85],
        events: [
          { name: 'Día de la Madre', month: 4, scope: 'Nacional', impact: 50, tip: 'Restaurantes y vestuario femenino' },
          { name: 'Festival Petronio Álvarez', month: 7, scope: 'Regional', impact: 50, tip: 'Gastronomía y bebidas tradicionales del Pacífico' },
          { name: 'Amor y Amistad', month: 8, scope: 'Nacional', impact: 35, tip: 'Vida nocturna y comercio' },
          { name: 'Feria de Cali', month: 11, scope: 'Regional', impact: 85, tip: 'Derrama comercial masiva de fin de año' }
        ]
      },
      {
        id: 'caribe',
        name: 'Costa Caribe (Barranquilla / Cartagena)',
        desc: 'Comercio portuario, logística y turismo en Carnaval.',
        factors: [0.90, 1.55, 1.15, 0.95, 1.22, 1.20, 1.15, 0.92, 0.98, 0.95, 1.30, 1.75],
        events: [
          { name: 'Carnaval de Barranquilla', month: 1, scope: 'Regional', impact: 80, tip: 'Consumo récord en bebidas, licores y suvenires' },
          { name: 'Semana Santa Turística', month: 3, scope: 'Nacional', impact: 30, tip: 'Ocupación hotelera y restaurantes' },
          { name: 'Fiestas de Independencia de Cartagena', month: 10, scope: 'Regional', impact: 40, tip: 'Desfiles y comercio popular' },
          { name: 'Temporada Decembrina', month: 11, scope: 'Nacional', impact: 75, tip: 'Compras familiares y vacaciones' }
        ]
      },
      {
        id: 'santander',
        name: 'Santander (Bucaramanga)',
        desc: 'Líder en calzado de cuero, confección infantil y avicultura.',
        factors: [0.82, 0.92, 0.88, 0.86, 1.32, 1.15, 1.02, 0.95, 1.35, 1.00, 1.28, 1.72],
        events: [
          { name: 'Temporada Escolar Calzado', month: 0, scope: 'Nacional', impact: 40, tip: 'Ventas de calzado colegial' },
          { name: 'Feria Bonita & ASOINDUCALS', month: 8, scope: 'Regional', impact: 45, tip: 'Exposición nacional de calzado' },
          { name: 'Día de la Madre', month: 4, scope: 'Nacional', impact: 50, tip: 'Moda y calzado femenino' },
          { name: 'Navidad Mayorista', month: 11, scope: 'Nacional', impact: 70, tip: 'Despachos a todo el país' }
        ]
      },
      {
        id: 'ejecafetero',
        name: 'Eje Cafetero (Caldas / Risaralda / Quindío)',
        desc: 'Cafés especiales, turismo de hacienda y Feria de Manizales.',
        factors: [1.25, 0.85, 0.88, 1.10, 1.20, 1.15, 1.12, 1.25, 1.05, 1.20, 1.25, 1.65],
        events: [
          { name: 'Feria de Manizales', month: 0, scope: 'Regional', impact: 55, tip: 'Pico turístico en pleno enero' },
          { name: 'Fiestas de la Cosecha Pereira', month: 7, scope: 'Regional', impact: 35, tip: 'Eventos masivos y comercio' },
          { name: 'Cosecha Cafetera Principal', month: 9, scope: 'Regional', impact: 40, tip: 'Jornales en efectivo y dinamismo comercial rural' }
        ]
      }
    ];

    const PRESETS = [
      { id: 'cafe', name: 'Café Especial Tostado (500g)', desc: 'Café arábica de origen en bolsa con válvula.', price: 38000, vCost: 19500, fCost: 13500000, units: 1100 },
      { id: 'jeans', name: 'Jean Denim Premium Colombiano', desc: 'Prenda confeccionada en tela índigo nacional.', price: 145000, vCost: 68000, fCost: 26000000, units: 550 },
      { id: 'calzado', name: 'Calzado en Cuero (Bucaramanga)', desc: 'Zapato de vestir en cuero legítimo.', price: 185000, vCost: 88000, fCost: 21500000, units: 380 },
      { id: 'arepas', name: 'Arepas de Maíz con Queso (x5)', desc: 'Alimento tradicional empacado al vacío.', price: 7200, vCost: 3400, fCost: 8800000, units: 3900 },
      { id: 'cerveza', name: 'Cerveza Artesanal (330ml)', desc: 'Botella de cerveza estilo IPA colombiana.', price: 14500, vCost: 6200, fCost: 16500000, units: 2800 }
    ];

    // ESTADO DE LA APP
    let currentRegion = REGIONS[0];
    let currentPreset = PRESETS[0];
    let price = currentPreset.price;
    let varCost = currentPreset.vCost;
    let fixedCost = currentPreset.fCost;
    let baselineUnits = currentPreset.units;
    let selectedMonth = 'all';

    let chartBEInstance = null;
    let chartSeasonInstance = null;

    function formatCOP(num) {
      return '$ ' + new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Math.round(num)) + ' COP';
    }

    function formatNum(num) {
      return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Math.round(num));
    }

    // INICIALIZACIÓN
    window.addEventListener('DOMContentLoaded', () => {
      // Poblar selects
      const regSelect = document.getElementById('regionSelect');
      REGIONS.forEach((r, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = r.name;
        regSelect.appendChild(opt);
      });

      const presetSelect = document.getElementById('presetSelect');
      PRESETS.forEach((p, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = p.name;
        presetSelect.appendChild(opt);
      });

      syncInputs();
      renderAll();
    });

    function syncInputs() {
      document.getElementById('priceRange').value = price;
      document.getElementById('varCostRange').value = varCost;
      document.getElementById('fixedCostRange').value = fixedCost;
      document.getElementById('unitsRange').value = baselineUnits;

      document.getElementById('priceDisplay').textContent = formatCOP(price);
      document.getElementById('varCostDisplay').textContent = formatCOP(varCost);
      document.getElementById('fixedCostDisplay').textContent = formatCOP(fixedCost);
      document.getElementById('unitsDisplay').textContent = formatNum(baselineUnits) + ' uds';

      document.getElementById('regionDescription').textContent = currentRegion.desc;
      document.getElementById('presetDescription').textContent = currentPreset.desc;
    }

    function onRegionChange() {
      const idx = document.getElementById('regionSelect').value;
      currentRegion = REGIONS[idx];
      document.getElementById('regionDescription').textContent = currentRegion.desc;
      renderAll();
    }

    function onPresetChange() {
      const idx = document.getElementById('presetSelect').value;
      currentPreset = PRESETS[idx];
      price = currentPreset.price;
      varCost = currentPreset.vCost;
      fixedCost = currentPreset.fCost;
      baselineUnits = currentPreset.units;
      syncInputs();
      renderAll();
    }

    function resetDefaults() {
      price = currentPreset.price;
      varCost = currentPreset.vCost;
      fixedCost = currentPreset.fCost;
      baselineUnits = currentPreset.units;
      selectedMonth = 'all';
      document.getElementById('monthSelect').value = 'all';
      syncInputs();
      renderAll();
    }

    function onMonthChange() {
      selectedMonth = document.getElementById('monthSelect').value;
      renderAll();
    }

    function onInputPrice(v) {
      price = Number(v);
      document.getElementById('priceDisplay').textContent = formatCOP(price);
      renderAll();
    }

    function onInputVarCost(v) {
      varCost = Number(v);
      document.getElementById('varCostDisplay').textContent = formatCOP(varCost);
      renderAll();
    }

    function onInputFixedCost(v) {
      fixedCost = Number(v);
      document.getElementById('fixedCostDisplay').textContent = formatCOP(fixedCost);
      renderAll();
    }

    function onInputUnits(v) {
      baselineUnits = Number(v);
      document.getElementById('unitsDisplay').textContent = formatNum(baselineUnits) + ' uds';
      renderAll();
    }

    // MOTOR FINANCIERO Y RENDERIZACIÓN
    function renderAll() {
      // 1. Cálculos de Punto de Equilibrio
      const marginUnit = price - varCost;
      const marginRatio = price > 0 ? (marginUnit / price) * 100 : 0;
      const beUnits = marginUnit > 0 ? fixedCost / marginUnit : Infinity;
      const beRevenue = isFinite(beUnits) ? beUnits * price : Infinity;

      // Mes activo
      let activeFactor = 1.0;
      if (selectedMonth !== 'all') {
        activeFactor = currentRegion.factors[Number(selectedMonth)] || 1.0;
        const diff = Math.round((activeFactor - 1) * 100);
        document.getElementById('monthMultiplierLabel').textContent = 
          'Factor estacional: ' + (diff >= 0 ? '+' : '') + diff + '% en este mes';
      } else {
        document.getElementById('monthMultiplierLabel').textContent = 'Promedio base mensual en vista consolidada';
      }

      const activeUnits = Math.round(baselineUnits * activeFactor);
      const totalRevenue = activeUnits * price;
      const totalCost = fixedCost + (activeUnits * varCost);
      const profit = totalRevenue - totalCost;
      const safetyMargin = activeUnits > 0 && isFinite(beUnits) ? ((activeUnits - beUnits) / activeUnits) * 100 : 0;

      // 2. Actualizar KPIs en el DOM
      document.getElementById('kpiPEUnits').textContent = isFinite(beUnits) ? formatNum(Math.ceil(beUnits)) + ' uds' : 'Inalcanzable';
      document.getElementById('kpiPERevenue').textContent = isFinite(beRevenue) ? formatCOP(beRevenue) : 'N/A';

      document.getElementById('kpiMarginUnit').textContent = formatCOP(marginUnit);
      document.getElementById('kpiMarginRatio').textContent = marginRatio.toFixed(1) + '%';

      const profitCard = document.getElementById('kpiProfitCard');
      const profitValue = document.getElementById('kpiProfitValue');
      profitValue.textContent = formatCOP(profit);
      if (profit >= 0) {
        profitValue.className = 'mt-2 text-2xl font-bold font-mono text-emerald-400';
        profitCard.className = 'rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-5';
      } else {
        profitValue.className = 'mt-2 text-2xl font-bold font-mono text-rose-400';
        profitCard.className = 'rounded-xl border border-rose-900/60 bg-rose-950/20 p-5';
      }
      document.getElementById('kpiSafetyMargin').textContent = safetyMargin.toFixed(1) + '% (' + formatNum(Math.round(activeUnits - beUnits)) + ' uds)';

      // Rango Estacional Anual
      let maxRev = -1, minRev = Infinity;
      let maxMonth = '', minMonth = '';
      let monthsAbovePE = 0;
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const monthlyUnits = [];
      const monthlyProfits = [];

      monthNames.forEach((m, idx) => {
        const factor = currentRegion.factors[idx];
        const mUnits = Math.round(baselineUnits * factor);
        const mRev = mUnits * price;
        const mProfit = mRev - (fixedCost + (mUnits * varCost));

        monthlyUnits.push(mUnits);
        monthlyProfits.push(mProfit);

        if (mUnits >= beUnits) monthsAbovePE++;
        if (mRev > maxRev) { maxRev = mRev; maxMonth = m; }
        if (mRev < minRev) { minRev = mRev; minMonth = m; }
      });

      document.getElementById('kpiHighMonth').textContent = maxMonth + ' (' + formatCOP(maxRev) + ')';
      document.getElementById('kpiLowMonth').textContent = minMonth + ' (' + formatCOP(minRev) + ')';
      document.getElementById('kpiMonthsAbovePE').textContent = monthsAbovePE + ' / 12 meses';

      // 3. Renderizar Gráfico de Punto de Equilibrio
      renderBreakEvenChart(beUnits, activeUnits);

      // 4. Renderizar Gráfico de Estacionalidad
      renderSeasonalityChart(monthNames, monthlyUnits, monthlyProfits, beUnits);

      // 5. Renderizar Tabla de Eventos
      renderEventsTable();
    }

    function renderBreakEvenChart(beUnits, activeUnits) {
      const maxUnits = isFinite(beUnits) ? Math.max(beUnits * 1.8, activeUnits * 1.3, 100) : activeUnits * 2;
      const steps = 10;
      const labels = [];
      const revData = [];
      const costData = [];
      const fixedData = [];

      for (let i = 0; i <= steps; i++) {
        const q = Math.round((i / steps) * maxUnits);
        labels.push(formatNum(q) + ' uds');
        revData.push(q * price);
        costData.push(fixedCost + (q * varCost));
        fixedData.push(fixedCost);
      }

      const ctx = document.getElementById('chartBreakEven').getContext('2d');
      if (chartBEInstance) chartBEInstance.destroy();

      chartBEInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Ingresos Totales (IT)',
              data: revData,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 3,
              fill: false,
              tension: 0.1
            },
            {
              label: 'Costos Totales (CT)',
              data: costData,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              borderWidth: 3,
              fill: false,
              tension: 0.1
            },
            {
              label: 'Costos Fijos (CF)',
              data: fixedData,
              borderColor: '#f59e0b',
              borderDash: [5, 5],
              borderWidth: 2,
              fill: false,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8' } },
            tooltip: {
              callbacks: {
                label: (ctx) => ' ' + ctx.dataset.label + ': ' + formatCOP(ctx.raw)
              }
            }
          },
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
            y: {
              ticks: {
                color: '#64748b',
                callback: (v) => '$' + (v >= 1000000 ? (v/1000000).toFixed(1) + 'M' : (v/1000).toFixed(0) + 'k')
              },
              grid: { color: '#1e293b' }
            }
          }
        }
      });
    }

    function renderSeasonalityChart(months, units, profits, beUnits) {
      const ctx = document.getElementById('chartSeasonality').getContext('2d');
      if (chartSeasonInstance) chartSeasonInstance.destroy();

      const beData = months.map(() => isFinite(beUnits) ? Math.round(beUnits) : 0);

      chartSeasonInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            {
              type: 'bar',
              label: 'Demanda Mensual (Uds)',
              data: units,
              backgroundColor: units.map(u => u >= beUnits ? '#10b981' : '#f43f5e'),
              borderRadius: 4,
              yAxisID: 'yU'
            },
            {
              type: 'line',
              label: 'Umbral Punto Equilibrio',
              data: beData,
              borderColor: '#fbbf24',
              borderDash: [4, 4],
              borderWidth: 2,
              pointRadius: 0,
              yAxisID: 'yU'
            },
            {
              type: 'line',
              label: 'Utilidad Mensual (COP)',
              data: profits,
              borderColor: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              borderWidth: 2,
              yAxisID: 'yP'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8' } },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  if (ctx.dataset.yAxisID === 'yP') return ' Utilidad: ' + formatCOP(ctx.raw);
                  return ' ' + ctx.dataset.label + ': ' + formatNum(ctx.raw) + ' uds';
                }
              }
            }
          },
          scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
            yU: {
              position: 'left',
              ticks: { color: '#94a3b8' },
              grid: { color: '#1e293b' },
              title: { display: true, text: 'Unidades', color: '#94a3b8' }
            },
            yP: {
              position: 'right',
              grid: { drawOnChartArea: false },
              ticks: {
                color: '#38bdf8',
                callback: (v) => '$' + (Math.abs(v) >= 1000000 ? (v/1000000).toFixed(1) + 'M' : (v/1000).toFixed(0) + 'k')
              },
              title: { display: true, text: 'Utilidad COP', color: '#38bdf8' }
            }
          }
        }
      });
    }

    function renderEventsTable() {
      const tbody = document.getElementById('eventsTableBody');
      tbody.innerHTML = '';
      const monthNamesFull = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

      currentRegion.events.forEach((ev) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-800/40 cursor-pointer';
        
        const mFactor = currentRegion.factors[ev.month];
        const estUnits = Math.round(baselineUnits * mFactor);
        const estRev = estUnits * price;

        tr.innerHTML = \`
          <td class="py-3 pr-2">
            <div class="font-semibold text-slate-100">\${ev.name}</div>
            <div class="text-[11px] text-emerald-400">💡 \${ev.tip}</div>
          </td>
          <td class="py-3 px-2 text-slate-300 font-medium">\${monthNamesFull[ev.month]}</td>
          <td class="py-3 px-2 text-center">
            <span class="\${ev.scope === 'Regional' ? 'text-amber-400' : 'text-slate-300'} font-medium">\${ev.scope}</span>
          </td>
          <td class="py-3 px-2 text-right font-mono font-bold text-emerald-400">+\${ev.impact}%</td>
          <td class="py-3 px-2 text-right font-mono text-slate-200">\${formatCOP(estRev)}</td>
          <td class="py-3 pl-2 text-center">
            <button onclick="selectEventMonth(\${ev.month})" class="bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-[11px] px-2.5 py-1 rounded transition-colors font-medium">
              Simular
            </button>
          </td>
        \`;
        tbody.appendChild(tr);
      });
    }

    function selectEventMonth(mIdx) {
      document.getElementById('monthSelect').value = mIdx;
      selectedMonth = mIdx.toString();
      renderAll();
      window.scrollTo({ top: document.getElementById('control-panel').offsetTop - 60, behavior: 'smooth' });
    }
  </script>
</body>
</html>`;
}
