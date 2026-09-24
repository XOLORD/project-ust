import React, { useState } from 'react';
import { FinancialMetrics } from '../types';
import { formatCOP, formatNumber, formatPercent } from '../utils/finance';
import { SlidersHorizontal, ArrowDown, ArrowUp, Activity } from 'lucide-react';

interface SensitivityMatrixProps {
  metrics: FinancialMetrics;
}

export const SensitivityMatrix: React.FC<SensitivityMatrixProps> = ({ metrics }) => {
  const [priceDeltaPercent, setPriceDeltaPercent] = useState<number>(0);
  const [variableCostDeltaPercent, setVariableCostDeltaPercent] = useState<number>(0);
  const [fixedCostDeltaPercent, setFixedCostDeltaPercent] = useState<number>(0);

  // Simulación dinámica con deltas
  const simulatedPrice = metrics.sellingPrice * (1 + priceDeltaPercent / 100);
  const simulatedVarCost = metrics.variableCostUnit * (1 + variableCostDeltaPercent / 100);
  const simulatedFixedCost = metrics.fixedCosts * (1 + fixedCostDeltaPercent / 100);

  const simMarginUnit = simulatedPrice - simulatedVarCost;
  const simMarginRatio = simulatedPrice > 0 ? (simMarginUnit / simulatedPrice) * 100 : 0;

  const simBreakEvenUnits = simMarginUnit > 0 ? simulatedFixedCost / simMarginUnit : Infinity;
  const simBreakEvenRevenue = isFinite(simBreakEvenUnits) ? simBreakEvenUnits * simulatedPrice : Infinity;

  const deltaBreakEvenUnits = isFinite(simBreakEvenUnits) && isFinite(metrics.breakEvenUnits)
    ? simBreakEvenUnits - metrics.breakEvenUnits
    : 0;

  const deltaBreakEvenPercent = isFinite(metrics.breakEvenUnits) && metrics.breakEvenUnits > 0
    ? (deltaBreakEvenUnits / metrics.breakEvenUnits) * 100
    : 0;

  // Grilla de sensibilidad para Precio vs Costo Variable
  const priceVariations = [-15, -10, -5, 0, 5, 10, 15];
  const varCostVariations = [-10, 0, 10];

  return (
    <div
      id="sensibilidad"
      className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3 gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-sky-400" />
            Análisis de Sensibilidad y Grado de Apalancamiento Operativo (GAO)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Evalúa el impacto de la inflación de insumos, variaciones de precio o aumentos de costos fijos en el Punto de Equilibrio.
          </p>
        </div>

        {metrics.operatingLeverageDegree && (
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Activity className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-slate-400">GAO Actual:</span>
            <span className="font-bold text-indigo-300 font-mono">
              {formatNumber(metrics.operatingLeverageDegree, 2)}x
            </span>
          </div>
        )}
      </div>

      {/* Controles de Simulación de Estrés */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Variación de Precio */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Sensibilidad en Precio</span>
            <span className={`font-mono font-bold ${priceDeltaPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {priceDeltaPercent > 0 ? `+${priceDeltaPercent}%` : `${priceDeltaPercent}%`}
            </span>
          </div>
          <input
            type="range"
            min="-25"
            max="25"
            step="5"
            value={priceDeltaPercent}
            onChange={(e) => setPriceDeltaPercent(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            Nuevo PV: {formatCOP(simulatedPrice)}
          </div>
        </div>

        {/* Variación en Costo Variable */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Inflación Insumos (CVU)</span>
            <span className={`font-mono font-bold ${variableCostDeltaPercent > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {variableCostDeltaPercent > 0 ? `+${variableCostDeltaPercent}%` : `${variableCostDeltaPercent}%`}
            </span>
          </div>
          <input
            type="range"
            min="-25"
            max="25"
            step="5"
            value={variableCostDeltaPercent}
            onChange={(e) => setVariableCostDeltaPercent(Number(e.target.value))}
            className="w-full accent-indigo-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            Nuevo CVU: {formatCOP(simulatedVarCost)}
          </div>
        </div>

        {/* Variación en Costos Fijos */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Aumento Costos Fijos (CF)</span>
            <span className={`font-mono font-bold ${fixedCostDeltaPercent > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {fixedCostDeltaPercent > 0 ? `+${fixedCostDeltaPercent}%` : `${fixedCostDeltaPercent}%`}
            </span>
          </div>
          <input
            type="range"
            min="-20"
            max="30"
            step="5"
            value={fixedCostDeltaPercent}
            onChange={(e) => setFixedCostDeltaPercent(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            Nuevos CF: {formatCOP(simulatedFixedCost)}
          </div>
        </div>
      </div>

      {/* Resultados de la Simulación de Estrés */}
      <div className="mt-4 rounded-lg bg-slate-950/70 border border-slate-800 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400">Nuevo Punto de Equilibrio:</span>
            <div className="mt-1 text-base font-bold text-white font-mono tabular-nums">
              {isFinite(simBreakEvenUnits)
                ? `${formatNumber(Math.ceil(simBreakEvenUnits))} unidades`
                : 'No alcanzable'}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {isFinite(simBreakEvenRevenue) ? formatCOP(simBreakEvenRevenue) : 'N/A'}
            </div>
          </div>

          <div>
            <span className="text-slate-400">Variación de Exigencia Operativa:</span>
            <div
              className={`mt-1 text-base font-bold font-mono tabular-nums flex items-center gap-1 ${
                deltaBreakEvenUnits > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {deltaBreakEvenUnits > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {deltaBreakEvenUnits > 0 ? `+${formatNumber(Math.round(deltaBreakEvenUnits))} uds` : `${formatNumber(Math.round(deltaBreakEvenUnits))} uds`}
              <span className="text-xs font-normal">
                ({formatPercent(deltaBreakEvenPercent)})
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {deltaBreakEvenUnits > 0
                ? 'Se requiere vender más volumen para no incurrir en pérdidas.'
                : 'Se reduce el esfuerzo de ventas necesario para estar a salvo.'}
            </div>
          </div>

          <div>
            <span className="text-slate-400">Nuevo Margen de Contribución:</span>
            <div className="mt-1 text-base font-bold text-emerald-400 font-mono tabular-nums">
              {formatCOP(simMarginUnit)} ({formatPercent(simMarginRatio)})
            </div>
            <div className="text-[11px] text-slate-400">
              Absorción unitaria de costos fijos
            </div>
          </div>
        </div>
      </div>

      {/* Matriz rápida de sensibilidad: Precios vs Variación de Costo */}
      <div className="mt-5">
        <h4 className="text-xs font-semibold text-slate-300 mb-2">
          Matriz de Punto de Equilibrio (Unidades necesarias según variación de Precio vs Insumos)
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono tabular-nums">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 text-left font-sans font-medium">Variación Insumos \ Precio</th>
                {priceVariations.map((pVar) => (
                  <th key={pVar} className={`py-2 px-2 font-medium ${pVar === 0 ? 'text-emerald-400' : ''}`}>
                    {pVar >= 0 ? `+${pVar}%` : `${pVar}%`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {varCostVariations.map((cVar) => {
                const testVCost = metrics.variableCostUnit * (1 + cVar / 100);
                return (
                  <tr key={cVar} className="hover:bg-slate-800/30">
                    <td className="py-2.5 text-left font-sans text-slate-300">
                      Costo Insumos {cVar >= 0 ? `+${cVar}%` : `${cVar}%`}
                    </td>
                    {priceVariations.map((pVar) => {
                      const testPrice = metrics.sellingPrice * (1 + pVar / 100);
                      const testMargin = testPrice - testVCost;
                      const testPE = testMargin > 0 ? metrics.fixedCosts / testMargin : Infinity;
                      const isBase = pVar === 0 && cVar === 0;

                      return (
                        <td
                          key={pVar}
                          className={`py-2.5 px-2 ${
                            isBase
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                              : isFinite(testPE)
                              ? 'text-slate-200'
                              : 'text-rose-400 font-semibold'
                          }`}
                        >
                          {isFinite(testPE) ? formatNumber(Math.ceil(testPE)) : 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
