import React, { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { MonthlyFinancialRecord, FinancialMetrics, RegionData } from '../types';
import { MONTH_NAMES_SHORT } from '../data/colombiaData';
import { formatCOP, formatNumber } from '../utils/finance';
import { CalendarRange, Sparkles } from 'lucide-react';

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

interface SeasonalityChartProps {
  records: MonthlyFinancialRecord[];
  metrics: FinancialMetrics;
  region: RegionData;
  onSelectMonth: (monthIndex: number) => void;
  selectedMonthFilter: number | 'all';
}

export const SeasonalityChart: React.FC<SeasonalityChartProps> = ({
  records,
  metrics,
  region,
  onSelectMonth,
  selectedMonthFilter,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const unitsData = records.map((r) => r.units);
    const profitData = records.map((r) => r.operatingProfit);
    const beLineData = records.map(() =>
      isFinite(metrics.breakEvenUnits) ? Math.round(metrics.breakEvenUnits) : 0
    );

    // Dynamic bar colors: highlight if above break even or selected
    const barColors = records.map((r, idx) => {
      if (selectedMonthFilter === idx) {
        return '#38bdf8'; // sky-400 for focused
      }
      return r.isAboveBreakEven ? '#10b981' : '#f43f5e';
    });

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: MONTH_NAMES_SHORT,
        datasets: [
          {
            type: 'bar',
            label: 'Demanda Estimada (Unidades)',
            data: unitsData,
            backgroundColor: barColors,
            borderRadius: 6,
            yAxisID: 'yUnits',
            order: 2,
          },
          {
            type: 'line',
            label: 'Umbral Punto de Equilibrio',
            data: beLineData,
            borderColor: '#fbbf24', // amber-400
            borderDash: [5, 4],
            borderWidth: 2,
            pointRadius: 0,
            yAxisID: 'yUnits',
            order: 1,
          },
          {
            type: 'line',
            label: 'Utilidad Operativa Proyectada (COP)',
            data: profitData,
            borderColor: '#60a5fa', // blue-400
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#60a5fa',
            pointHoverRadius: 6,
            tension: 0.2,
            yAxisID: 'yProfit',
            order: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            onSelectMonth(index);
          }
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans',
                size: 11,
              },
              usePointStyle: true,
              boxWidth: 8,
              boxHeight: 8,
            },
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 10,
            titleFont: {
              family: 'Plus Jakarta Sans',
              size: 12,
              weight: 'bold',
            },
            bodyFont: {
              family: 'JetBrains Mono',
              size: 11,
            },
            callbacks: {
              title: (items) => {
                const idx = items[0].dataIndex;
                const rec = records[idx];
                const eventNames = rec.events.map((e) => e.name).join(', ');
                return `${rec.monthName} ${eventNames ? `— [${eventNames}]` : ''}`;
              },
              label: (context) => {
                const label = context.dataset.label || '';
                const val = Number(context.raw);
                if (context.dataset.yAxisID === 'yProfit') {
                  return ` ${label}: ${formatCOP(val)}`;
                }
                return ` ${label}: ${formatNumber(val)} unidades`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(51, 65, 85, 0.2)',
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans',
                size: 11,
              },
            },
          },
          yUnits: {
            type: 'linear',
            position: 'left',
            grid: {
              color: 'rgba(51, 65, 85, 0.25)',
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'JetBrains Mono',
                size: 10,
              },
            },
            title: {
              display: true,
              text: 'Unidades Vendidas',
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans',
                size: 11,
              },
            },
          },
          yProfit: {
            type: 'linear',
            position: 'right',
            grid: {
              drawOnChartArea: false, // Don't clutter grid
            },
            ticks: {
              color: '#60a5fa',
              font: {
                family: 'JetBrains Mono',
                size: 10,
              },
              callback: (val) => {
                const num = Number(val);
                if (Math.abs(num) >= 1000000) {
                  return `$${(num / 1000000).toFixed(1)}M`;
                }
                return `$${(num / 1000).toFixed(0)}k`;
              },
            },
            title: {
              display: true,
              text: 'Utilidad Operativa (COP)',
              color: '#60a5fa',
              font: {
                family: 'Plus Jakarta Sans',
                size: 11,
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [records, metrics, selectedMonthFilter]);

  return (
    <div
      id="estacionalidad"
      className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-amber-400" />
            Curva de Estacionalidad Comercial Mensual ({region.name})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comportamiento mes a mes proyectando los picos de ferias, festividades y primas legales.
            Haz clic en cualquier mes para enfocarlo.
          </p>
        </div>

        <div className="mt-2 sm:mt-0 flex items-center gap-2 text-xs">
          <span className="text-slate-400">Proyección Anual Acumulada:</span>
          <span className="font-bold text-emerald-400 tabular-nums font-mono">
            {formatCOP(metrics.annualProjectedProfit)}
          </span>
        </div>
      </div>

      <div className="relative mt-4 h-72 sm:h-80 w-full">
        <canvas ref={canvasRef} />
      </div>

      {/* Mini resumen de meses destacados */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-emerald-500" />
            <span className="text-slate-300">Mes con Utilidad (&gt; PE)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-rose-500" />
            <span className="text-slate-300">Mes en Pérdida (&lt; PE)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-4 bg-amber-400 border-dashed" />
            <span className="text-slate-300">Umbral PE ({formatNumber(Math.ceil(metrics.breakEvenUnits))} uds)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
          Tip: Los meses verdes subsidian los valles estacionales del primer trimestre.
        </div>
      </div>
    </div>
  );
};
