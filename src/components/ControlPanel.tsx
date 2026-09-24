import React from 'react';
import { RegionData, ProductPreset } from '../types';
import { COLOMBIA_REGIONS, PRODUCT_PRESETS, MONTH_NAMES } from '../data/colombiaData';
import { formatCOP, formatNumber } from '../utils/finance';
import { MapPin, Package, Calendar, DollarSign, RefreshCw, Sparkles, Building2, Sliders } from 'lucide-react';

interface ControlPanelProps {
  selectedRegion: RegionData;
  onSelectRegion: (region: RegionData) => void;
  selectedPreset: ProductPreset;
  onSelectPreset: (preset: ProductPreset) => void;
  sellingPrice: number;
  onChangePrice: (price: number) => void;
  variableCost: number;
  onChangeVariableCost: (cost: number) => void;
  fixedCosts: number;
  onChangeFixedCosts: (costs: number) => void;
  plannedUnits: number;
  onChangePlannedUnits: (units: number) => void;
  selectedMonthFilter: number | 'all';
  onSelectMonthFilter: (m: number | 'all') => void;
  onResetDefaults: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedRegion,
  onSelectRegion,
  selectedPreset,
  onSelectPreset,
  sellingPrice,
  onChangePrice,
  variableCost,
  onChangeVariableCost,
  fixedCosts,
  onChangeFixedCosts,
  plannedUnits,
  onChangePlannedUnits,
  selectedMonthFilter,
  onSelectMonthFilter,
  onResetDefaults,
}) => {
  const currentMargin = sellingPrice - variableCost;
  const isMarginNegative = currentMargin <= 0;

  return (
    <div
      id="control-panel"
      className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-emerald-400" />
            Panel de Control y Supuestos Financieros
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configura región de Colombia, estructura de costos e insumos en pesos colombianos (COP).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetDefaults}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Restablecer Preset</span>
          </button>
        </div>
      </div>

      {/* Selectores Primarios: Región, Categoría, Mes */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Selector de Región */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span>1. Región / Departamento de Colombia</span>
          </label>
          <select
            value={selectedRegion.id}
            onChange={(e) => {
              const r = COLOMBIA_REGIONS.find((reg) => reg.id === e.target.value);
              if (r) onSelectRegion(r);
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {COLOMBIA_REGIONS.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name} ({region.capital})
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {selectedRegion.economicProfile}
          </p>
        </div>

        {/* Selector de Producto / Categoría Preset */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 text-indigo-400" />
            <span>2. Producto o Categoría Comercial</span>
          </label>
          <select
            value={selectedPreset.id}
            onChange={(e) => {
              const p = PRODUCT_PRESETS.find((preset) => preset.id === e.target.value);
              if (p) onSelectPreset(p);
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {PRODUCT_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name} — {preset.category}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {selectedPreset.description}
          </p>
        </div>

        {/* Selector de Temporalidad / Mes */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-amber-400" />
            <span>3. Temporalidad / Mes Específico</span>
          </label>
          <select
            value={selectedMonthFilter}
            onChange={(e) => {
              const val = e.target.value;
              onSelectMonthFilter(val === 'all' ? 'all' : parseInt(val, 10));
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Vista Anual Consolidada (12 Meses)</option>
            {MONTH_NAMES.map((mName, idx) => {
              const factor = selectedRegion.monthlyFactors[idx];
              const diffPct = Math.round((factor - 1.0) * 100);
              const sign = diffPct >= 0 ? `+${diffPct}%` : `${diffPct}%`;
              return (
                <option key={idx} value={idx}>
                  {mName} (Factor estacional: {sign})
                </option>
              );
            })}
          </select>
          <p className="mt-1.5 text-[11px] text-slate-400">
            {selectedMonthFilter === 'all'
              ? 'Calculando volumen base mensual y estacionalidad anual.'
              : `Enfocado en ${MONTH_NAMES[selectedMonthFilter]} con multiplicador de ${
                  selectedRegion.monthlyFactors[selectedMonthFilter]
                }x`}
          </p>
        </div>
      </div>

      {/* Campos de Costos e Ingresos con Sliders y Moneda */}
      <div className="mt-6 border-t border-slate-800/80 pt-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Precio de Venta */}
          <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/40 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Precio de Venta (PV)</span>
              <span className="text-xs font-bold text-emerald-400 tabular-nums font-mono">
                {formatCOP(sellingPrice)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">$</span>
              <input
                type="number"
                min="100"
                step="500"
                value={sellingPrice}
                onChange={(e) => onChangePrice(Math.max(1, Number(e.target.value)))}
                className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white tabular-nums font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <input
              type="range"
              min="1000"
              max={Math.max(sellingPrice * 2.5, 300000)}
              step="500"
              value={sellingPrice}
              onChange={(e) => onChangePrice(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="text-[10px] text-slate-400">Por {selectedPreset.unitOfMeasure}</div>
          </div>

          {/* Costo Variable Unitario */}
          <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/40 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Costo Variable (CVU)</span>
              <span
                className={`text-xs font-bold tabular-nums font-mono ${
                  isMarginNegative ? 'text-rose-400' : 'text-slate-300'
                }`}
              >
                {formatCOP(variableCost)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">$</span>
              <input
                type="number"
                min="0"
                step="500"
                value={variableCost}
                onChange={(e) => onChangeVariableCost(Math.max(0, Number(e.target.value)))}
                className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white tabular-nums font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(sellingPrice * 1.5, 200000)}
              step="500"
              value={variableCost}
              onChange={(e) => onChangeVariableCost(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="text-[10px] text-slate-400">
              Materia prima, empaque, comisión, flete
            </div>
          </div>

          {/* Costos Fijos Mensuales */}
          <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/40 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Costos Fijos (CF)</span>
              <span className="text-xs font-bold text-slate-200 tabular-nums font-mono">
                {formatCOP(fixedCosts)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">$</span>
              <input
                type="number"
                min="100000"
                step="500000"
                value={fixedCosts}
                onChange={(e) => onChangeFixedCosts(Math.max(0, Number(e.target.value)))}
                className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white tabular-nums font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <input
              type="range"
              min="1000000"
              max={Math.max(fixedCosts * 3, 50000000)}
              step="500000"
              value={fixedCosts}
              onChange={(e) => onChangeFixedCosts(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="text-[10px] text-slate-400">
              Arriendo, nómina fija, servicios, Invima
            </div>
          </div>

          {/* Unidades Estimadas de Venta */}
          <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/40 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Volumen Esperado</span>
              <span className="text-xs font-bold text-emerald-400 tabular-nums font-mono">
                {formatNumber(plannedUnits)} uds
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Q</span>
              <input
                type="number"
                min="10"
                step="25"
                value={plannedUnits}
                onChange={(e) => onChangePlannedUnits(Math.max(1, Number(e.target.value)))}
                className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white tabular-nums font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <input
              type="range"
              min="10"
              max={Math.max(plannedUnits * 3, 5000)}
              step="25"
              value={plannedUnits}
              onChange={(e) => onChangePlannedUnits(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="text-[10px] text-slate-400">
              Venta mensual base antes de estacionalidad
            </div>
          </div>
        </div>

        {/* Advertencia si el margen es negativo */}
        {isMarginNegative && (
          <div className="mt-4 rounded-lg border border-rose-800/80 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-start gap-2">
            <span className="font-bold">¡Alerta Financiera!</span>
            <span>
              El Costo Variable Unitario ({formatCOP(variableCost)}) es mayor o igual al Precio de Venta ({formatCOP(sellingPrice)}). El margen de contribución es negativo ({formatCOP(currentMargin)}). En esta condición es matemáticamente imposible alcanzar el punto de equilibrio; cada unidad vendida incrementa las pérdidas operativas.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
