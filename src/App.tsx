import React, { useState, useMemo } from 'react';
import { RegionData, ProductPreset } from './types';
import { COLOMBIA_REGIONS, PRODUCT_PRESETS, MONTH_NAMES } from './data/colombiaData';
import { calculateFinancials, exportToCSV, formatCOP, formatNumber, formatPercent } from './utils/finance';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { ControlPanel } from './components/ControlPanel';
import { BreakEvenChart } from './components/BreakEvenChart';
import { SeasonalityChart } from './components/SeasonalityChart';
import { KeyDatesTable } from './components/KeyDatesTable';
import { SensitivityMatrix } from './components/SensitivityMatrix';
import { FinancialHelpModal } from './components/FinancialHelpModal';
import { StandaloneHtmlModal } from './components/StandaloneHtmlModal';
import {
  TrendingUp,
  MapPin,
  CalendarCheck,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  Award,
} from 'lucide-react';

export default function App() {
  // Estado principal
  const [selectedRegion, setSelectedRegion] = useState<RegionData>(COLOMBIA_REGIONS[0]); // Bogotá
  const [selectedPreset, setSelectedPreset] = useState<ProductPreset>(PRODUCT_PRESETS[0]); // Café Especial

  const [sellingPrice, setSellingPrice] = useState<number>(PRODUCT_PRESETS[0].defaultPrice);
  const [variableCost, setVariableCost] = useState<number>(PRODUCT_PRESETS[0].defaultVariableCost);
  const [fixedCosts, setFixedCosts] = useState<number>(PRODUCT_PRESETS[0].defaultFixedCosts);
  const [plannedUnits, setPlannedUnits] = useState<number>(PRODUCT_PRESETS[0].defaultBaselineUnits);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<number | 'all'>('all');

  // Modales
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isStandaloneModalOpen, setIsStandaloneModalOpen] = useState(false);

  // Cambio de Preset de Producto
  const handleSelectPreset = (preset: ProductPreset) => {
    setSelectedPreset(preset);
    setSellingPrice(preset.defaultPrice);
    setVariableCost(preset.defaultVariableCost);
    setFixedCosts(preset.defaultFixedCosts);
    setPlannedUnits(preset.defaultBaselineUnits);
  };

  // Restablecer a valores por defecto del preset actual
  const handleResetDefaults = () => {
    setSellingPrice(selectedPreset.defaultPrice);
    setVariableCost(selectedPreset.defaultVariableCost);
    setFixedCosts(selectedPreset.defaultFixedCosts);
    setPlannedUnits(selectedPreset.defaultBaselineUnits);
    setSelectedMonthFilter('all');
  };

  // Cálculo financiero reactivo
  const { metrics, monthlyRecords } = useMemo(() => {
    return calculateFinancials(
      sellingPrice,
      variableCost,
      fixedCosts,
      plannedUnits,
      selectedRegion,
      selectedMonthFilter
    );
  }, [sellingPrice, variableCost, fixedCosts, plannedUnits, selectedRegion, selectedMonthFilter]);

  // Manejo de exportación CSV
  const handleExportCSV = () => {
    exportToCSV(metrics, monthlyRecords, selectedRegion, selectedPreset.name);
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedMonthName =
    selectedMonthFilter === 'all'
      ? 'Vista Anual'
      : MONTH_NAMES[selectedMonthFilter];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white flex flex-col font-sans">
      {/* Top Bar Contract (1 Row, 3 Zones) */}
      <Header
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
        onOpenStandaloneModal={() => setIsStandaloneModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Banner de Contexto Regional & Financiero */}
        <section className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-emerald-950/25 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span>Ingeniería Financiera & Industrial</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-medium">{selectedRegion.name}</span>
                <span aria-hidden="true">·</span>
                <span>Moneda: Pesos Colombianos (COP)</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                Estudio de Punto de Equilibrio y Estacionalidad Comercial
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Determina con rigor financiero las unidades y facturación mínima requerida para no incurrir en pérdidas operativas, simulando las fluctuaciones de demanda generadas por festivos patrios, ferias regionales (Feria de las Flores, Carnaval de Barranquilla, Feria de Cali) y el pago de primas legales en Colombia.
              </p>
            </div>

            <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-xs">
                <div className="text-[11px] text-slate-400">Facturación Anual Estimada</div>
                <div className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
                  {formatCOP(metrics.annualProjectedRevenue)}
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-xs">
                <div className="text-[11px] text-slate-400">Utilidad Anual Proyectada</div>
                <div
                  className={`text-sm font-bold font-mono tabular-nums ${
                    metrics.annualProjectedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCOP(metrics.annualProjectedProfit)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tarjetas de KPIs Destacados */}
        <section aria-label="Indicadores Clave">
          <KPICards metrics={metrics} selectedMonthName={selectedMonthName} />
        </section>

        {/* Panel de Control y Filtros */}
        <section aria-label="Panel de Control y Supuestos">
          <ControlPanel
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            selectedPreset={selectedPreset}
            onSelectPreset={handleSelectPreset}
            sellingPrice={sellingPrice}
            onChangePrice={setSellingPrice}
            variableCost={variableCost}
            onChangeVariableCost={setVariableCost}
            fixedCosts={fixedCosts}
            onChangeFixedCosts={setFixedCosts}
            plannedUnits={plannedUnits}
            onChangePlannedUnits={setPlannedUnits}
            selectedMonthFilter={selectedMonthFilter}
            onSelectMonthFilter={setSelectedMonthFilter}
            onResetDefaults={handleResetDefaults}
          />
        </section>

        {/* Visualización de Gráficos (Dashboard) */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Gráfico 1: Curva de Ingresos vs Costos Totales */}
          <BreakEvenChart metrics={metrics} />

          {/* Gráfico 2: Estacionalidad Anual Comercial */}
          <SeasonalityChart
            records={monthlyRecords}
            metrics={metrics}
            region={selectedRegion}
            onSelectMonth={(m) => setSelectedMonthFilter(m)}
            selectedMonthFilter={selectedMonthFilter}
          />
        </section>

        {/* Cronograma de Fechas Clave por Departamento */}
        <section aria-label="Fechas Clave y Festividades">
          <KeyDatesTable
            region={selectedRegion}
            metrics={metrics}
            monthlyRecords={monthlyRecords}
            onSelectMonth={(m) => setSelectedMonthFilter(m)}
            selectedMonthFilter={selectedMonthFilter}
          />
        </section>

        {/* Módulo de Sensibilidad / What-If */}
        <section aria-label="Análisis de Sensibilidad">
          <SensitivityMatrix metrics={metrics} />
        </section>

        {/* Dictamen Ejecutivo de Viabilidad Financiera */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Award className="h-4 w-4 text-emerald-400" />
            Dictamen Ejecutivo de Viabilidad Comercial ({selectedRegion.name})
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3.5 space-y-1.5">
              <span className="font-semibold text-slate-200">1. Esfuerzo de Equilibrio</span>
              <p className="text-slate-400 leading-relaxed">
                El proyecto requiere colocar mensualmente{' '}
                <strong className="text-white font-mono">{formatNumber(Math.ceil(metrics.breakEvenUnits))} unidades</strong>{' '}
                de {selectedPreset.unitOfMeasure} ({formatCOP(metrics.breakEvenRevenue)}) para neutralizar costos. Con el volumen proyectado base de {formatNumber(plannedUnits)} unidades, el negocio{' '}
                {plannedUnits >= metrics.breakEvenUnits ? (
                  <span className="text-emerald-400 font-medium">es autosostenible</span>
                ) : (
                  <span className="text-rose-400 font-medium">requiere financiamiento para amortizar costos</span>
                )}
                .
              </p>
            </div>

            <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3.5 space-y-1.5">
              <span className="font-semibold text-slate-200">2. Estrategia de Liquidez Estacional</span>
              <p className="text-slate-400 leading-relaxed">
                La estacionalidad de {selectedRegion.name} alcanza su pico en{' '}
                <strong className="text-emerald-400">{metrics.highestMonth.month}</strong> ({formatCOP(metrics.highestMonth.revenue, false)}), mientras que el mes valle es{' '}
                <strong className="text-slate-300">{metrics.lowestMonth.month}</strong> ({formatCOP(metrics.lowestMonth.revenue, false)}). Se recomienda provisionar el 30% del excedente de caja de Diciembre y Junio para amortizar nómina y arriendo en los meses valle.
              </p>
            </div>

            <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3.5 space-y-1.5">
              <span className="font-semibold text-slate-200">3. Protección ante Inflación de Insumos</span>
              <p className="text-slate-400 leading-relaxed">
                Con una razón de margen de contribución del{' '}
                <strong className="text-emerald-400 font-mono">{formatPercent(metrics.contributionMarginRatio)}</strong>, cada incremento del 5% en materias primas exige elevar la producción en aproximadamente{' '}
                <strong className="text-white font-mono">
                  {formatNumber(Math.round(metrics.breakEvenUnits * 0.06))} unidades
                </strong>{' '}
                adicionales o trasladar 1.8% al precio final.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Equilibria Colombia</span>
            <span aria-hidden="true">·</span>
            <span>Estudio Financiero & Estacionalidad Regional</span>
          </div>
          <div>
            Cálculos formulados con rigor de Finanzas Corporativas e Ingeniería Industrial
          </div>
        </div>
      </footer>

      {/* Modales */}
      <FinancialHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <StandaloneHtmlModal
        isOpen={isStandaloneModalOpen}
        onClose={() => setIsStandaloneModalOpen(false)}
      />
    </div>
  );
}
