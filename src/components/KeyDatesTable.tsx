import React, { useState } from 'react';
import { RegionData, KeyEvent, FinancialMetrics, MonthlyFinancialRecord } from '../types';
import { formatCOP, formatNumber } from '../utils/finance';
import { Calendar, ArrowUpRight, Zap, Filter, CheckCircle2 } from 'lucide-react';

interface KeyDatesTableProps {
  region: RegionData;
  metrics: FinancialMetrics;
  monthlyRecords: MonthlyFinancialRecord[];
  onSelectMonth: (monthIndex: number) => void;
  selectedMonthFilter: number | 'all';
}

export const KeyDatesTable: React.FC<KeyDatesTableProps> = ({
  region,
  metrics,
  monthlyRecords,
  onSelectMonth,
  selectedMonthFilter,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'regional' | 'nacional'>('all');

  // Obtener todos los eventos combinados para la región
  const allEvents = region.keyEvents;

  const filteredEvents = allEvents.filter((ev) => {
    if (filterType === 'regional') return ev.scope === 'Regional';
    if (filterType === 'nacional') return ev.scope === 'Nacional';
    return true;
  });

  return (
    <div
      id="fechas-clave"
      className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3 gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-400" />
            Cronograma de Fechas Clave, Festivos y Temporadas Comerciales ({region.name})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Haz clic en cualquier evento o festividad para proyectar automáticamente el impacto en la demanda y finanzas.
          </p>
        </div>

        {/* Filtro de Alcance */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-950/60 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({allEvents.length})
          </button>
          <button
            onClick={() => setFilterType('regional')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filterType === 'regional'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Regionales
          </button>
          <button
            onClick={() => setFilterType('nacional')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filterType === 'nacional'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Nacionales
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-2.5 font-medium">Evento / Temporada Comercial</th>
              <th className="pb-2.5 font-medium">Mes / Fechas</th>
              <th className="pb-2.5 font-medium text-center">Alcance</th>
              <th className="pb-2.5 font-medium text-right">Impacto en Demanda</th>
              <th className="pb-2.5 font-medium text-right">Venta Proyectada</th>
              <th className="pb-2.5 font-medium text-right">Utilidad del Mes</th>
              <th className="pb-2.5 font-medium text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredEvents.map((ev) => {
              const monthIdx = ev.month - 1;
              const monthRecord = monthlyRecords[monthIdx];
              const isSelected = selectedMonthFilter === monthIdx;

              return (
                <tr
                  key={ev.id}
                  onClick={() => onSelectMonth(monthIdx)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-950/30 text-white'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="py-3 pr-3">
                    <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                      {ev.name}
                      {isSelected && (
                        <span className="text-[10px] text-emerald-400 font-medium">
                          (Activo en Simulación)
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {ev.description}
                    </div>
                    <div className="text-[10px] text-emerald-400/90 mt-0.5">
                      💡 Tip: {ev.businessTip}
                    </div>
                  </td>

                  <td className="py-3 px-2 whitespace-nowrap">
                    <div className="font-medium text-slate-200">{ev.monthName}</div>
                    <div className="text-[11px] text-slate-400">{ev.datesDescription}</div>
                  </td>

                  <td className="py-3 px-2 text-center whitespace-nowrap">
                    <span
                      className={`text-[11px] font-medium ${
                        ev.scope === 'Regional' ? 'text-amber-400' : 'text-slate-300'
                      }`}
                    >
                      {ev.scope}
                    </span>
                  </td>

                  <td className="py-3 px-2 text-right whitespace-nowrap font-mono tabular-nums">
                    <span className="font-semibold text-emerald-400">
                      +{ev.demandImpactPercent}%
                    </span>
                  </td>

                  <td className="py-3 px-2 text-right whitespace-nowrap font-mono tabular-nums">
                    <div className="font-semibold text-slate-100">
                      {formatCOP(monthRecord?.revenue ?? 0, false)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatNumber(monthRecord?.units ?? 0)} uds
                    </div>
                  </td>

                  <td className="py-3 px-2 text-right whitespace-nowrap font-mono tabular-nums">
                    <span
                      className={`font-semibold ${
                        (monthRecord?.operatingProfit ?? 0) >= 0
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {formatCOP(monthRecord?.operatingProfit ?? 0, false)}
                    </span>
                  </td>

                  <td className="py-3 pl-2 text-center whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMonth(monthIdx);
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-semibold'
                          : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Seleccionado' : 'Simular'}
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
