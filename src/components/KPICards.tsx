import React from 'react';
import { FinancialMetrics } from '../types';
import { formatCOP, formatNumber, formatPercent } from '../utils/finance';
import { Target, DollarSign, PieChart, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';

interface KPICardsProps {
  metrics: FinancialMetrics;
  selectedMonthName: string;
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics, selectedMonthName }) => {
  const isLoss = metrics.operatingProfit < 0;
  const isBreakEvenFinite = isFinite(metrics.breakEvenUnits) && metrics.breakEvenUnits > 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* KPI 1: Punto de Equilibrio en Unidades y Pesos */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Punto de Equilibrio (PE)</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Target className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-white tabular-nums font-mono">
            {isBreakEvenFinite ? `${formatNumber(Math.ceil(metrics.breakEvenUnits))} uds` : 'No alcanzable'}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Ingresos PE:</span>
            <span className="font-semibold text-slate-200 tabular-nums font-mono">
              {isBreakEvenFinite ? formatCOP(metrics.breakEvenRevenue) : 'N/A'}
            </span>
          </div>
        </div>
        <div className="mt-3 border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
          Cubre costos fijos de {formatCOP(metrics.fixedCosts, false)}
        </div>
      </div>

      {/* KPI 2: Margen de Contribución Unitario y % */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Margen de Contribución</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <PieChart className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-emerald-400 tabular-nums font-mono">
            {formatCOP(metrics.contributionMarginUnit)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Razón de Margen:</span>
            <span className="font-semibold text-emerald-300 tabular-nums font-mono">
              {formatPercent(metrics.contributionMarginRatio)} del precio
            </span>
          </div>
        </div>
        <div className="mt-3 border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
          Por cada unidad vendida se absorben costos fijos
        </div>
      </div>

      {/* KPI 3: Utilidad o Pérdida Estimada & Margen de Seguridad */}
      <div
        className={`rounded-xl border p-5 backdrop-blur-sm transition-all ${
          isLoss
            ? 'border-rose-900/60 bg-rose-950/20'
            : 'border-emerald-900/50 bg-emerald-950/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">
            {isLoss ? 'Pérdida Operativa' : 'Utilidad Operativa'} ({selectedMonthName})
          </span>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
              isLoss
                ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
            }`}
          >
            {isLoss ? <AlertCircle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
          </div>
        </div>
        <div className="mt-3">
          <div
            className={`text-2xl font-bold tracking-tight tabular-nums font-mono ${
              isLoss ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {formatCOP(metrics.operatingProfit)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Margen de Seguridad:</span>
            <span
              className={`font-semibold tabular-nums font-mono ${
                metrics.safetyMarginPercent < 0 ? 'text-rose-300' : 'text-slate-200'
              }`}
            >
              {isBreakEvenFinite ? formatPercent(metrics.safetyMarginPercent) : '0%'} (
              {formatNumber(Math.round(metrics.safetyMarginUnits))} uds)
            </span>
          </div>
        </div>
        <div className="mt-3 border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
          {metrics.operatingLeverageDegree
            ? `Grado Apalancamiento Operativo (GAO): ${formatNumber(metrics.operatingLeverageDegree, 2)}x`
            : isLoss
            ? 'Operando por debajo del punto de equilibrio'
            : 'Operación en punto neutro'}
        </div>
      </div>

      {/* KPI 4: Venta Más Alta vs Más Baja Proyectada (Rango Estacional) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Rango Estacional Regional</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-slate-400">Pico ({metrics.highestMonth.month}):</span>
            <span className="font-bold text-emerald-400 tabular-nums font-mono">
              {formatCOP(metrics.highestMonth.revenue, false)} ({formatNumber(metrics.highestMonth.units)} uds)
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-slate-400">Valle ({metrics.lowestMonth.month}):</span>
            <span className="font-bold text-slate-300 tabular-nums font-mono">
              {formatCOP(metrics.lowestMonth.revenue, false)} ({formatNumber(metrics.lowestMonth.units)} uds)
            </span>
          </div>
        </div>
        <div className="mt-3 border-t border-slate-800/80 pt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>Meses sobre PE:</span>
          <span className="font-semibold text-slate-200 tabular-nums font-mono">
            {metrics.breakEvenMetMonthsCount} de 12 meses
          </span>
        </div>
      </div>
    </div>
  );
};
