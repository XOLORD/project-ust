import React, { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { FinancialMetrics } from '../types';
import { generateBreakEvenCurveData, formatCOP, formatNumber } from '../utils/finance';
import { Info } from 'lucide-react';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface BreakEvenChartProps {
  metrics: FinancialMetrics;
}

export const BreakEvenChart: React.FC<BreakEvenChartProps> = ({ metrics }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const curveData = generateBreakEvenCurveData(metrics, 14);

    // Destruir instancia previa si existe
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const isBreakEvenFinite = isFinite(metrics.breakEvenUnits) && metrics.breakEvenUnits > 0;
    const beQ = Math.round(metrics.breakEvenUnits);
    const beRev = Math.round(metrics.breakEvenRevenue);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: curveData.labels.map((q) => `${formatNumber(q)} uds`),
        datasets: [
          {
            label: 'Ingresos Totales (IT)',
            data: curveData.totalRevenues,
            borderColor: '#10b981', // emerald-500
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            borderWidth: 3,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#10b981',
            tension: 0.1,
          },
          {
            label: 'Costos Totales (CT = CF + CV)',
            data: curveData.totalCosts,
            borderColor: '#ef4444', // red-500
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            borderWidth: 3,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#ef4444',
            tension: 0.1,
          },
          {
            label: 'Costos Fijos (CF)',
            data: curveData.fixedCostsLine,
            borderColor: '#f59e0b', // amber-500
            borderDash: [6, 4],
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 350,
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
              label: (context) => {
                const label = context.dataset.label || '';
                const val = Number(context.raw);
                return ` ${label}: ${formatCOP(val)}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(51, 65, 85, 0.3)',
            },
            ticks: {
              color: '#64748b',
              font: {
                family: 'JetBrains Mono',
                size: 10,
              },
              maxRotation: 45,
            },
            title: {
              display: true,
              text: 'Volumen de Producción / Ventas (Unidades)',
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans',
                size: 11,
              },
            },
          },
          y: {
            grid: {
              color: 'rgba(51, 65, 85, 0.3)',
            },
            ticks: {
              color: '#64748b',
              font: {
                family: 'JetBrains Mono',
                size: 10,
              },
              callback: (val) => {
                const num = Number(val);
                if (num >= 1000000) {
                  return `$${(num / 1000000).toFixed(1)}M`;
                }
                if (num >= 1000) {
                  return `$${(num / 1000).toFixed(0)}k`;
                }
                return `$${num}`;
              },
            },
            title: {
              display: true,
              text: 'Valores en Pesos Colombianos (COP)',
              color: '#94a3b8',
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
  }, [metrics]);

  return (
    <div id="graficos" className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Curva de Punto de Equilibrio (Ingresos vs. Costos Totales)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Intersección exacta donde los ingresos operativos cubren el 100% de los costos fijos y variables.
          </p>
        </div>

        {isFinite(metrics.breakEvenUnits) && metrics.breakEvenUnits > 0 && (
          <div className="mt-2 sm:mt-0 flex items-center gap-2 text-xs bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="text-slate-400">Punto Intersección:</span>
            <span className="font-bold text-emerald-400 tabular-nums font-mono">
              {formatNumber(Math.ceil(metrics.breakEvenUnits))} uds
            </span>
            <span className="text-slate-500">·</span>
            <span className="font-bold text-white tabular-nums font-mono">
              {formatCOP(metrics.breakEvenRevenue)}
            </span>
          </div>
        )}
      </div>

      <div className="relative mt-4 h-72 sm:h-80 w-full">
        <canvas ref={canvasRef} />
      </div>

      {/* Explicación de Zonas: Pérdida vs Ganancia */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-start gap-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 p-2.5 text-xs text-rose-300">
          <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500 shrink-0" />
          <div>
            <span className="font-semibold text-rose-200">Zona de Pérdida (Q &lt; PE):</span> A volúmenes inferiores a{' '}
            {isFinite(metrics.breakEvenUnits) ? formatNumber(Math.ceil(metrics.breakEvenUnits)) : '0'} unidades, el margen de contribución generado no es suficiente para absorber los costos fijos mensuales.
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 p-2.5 text-xs text-emerald-300">
          <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          <div>
            <span className="font-semibold text-emerald-200">Zona de Ganancia (Q &gt; PE):</span> Superado el punto de equilibrio, cada unidad adicional vendida genera{' '}
            {formatCOP(metrics.contributionMarginUnit)} netos de utilidad operativa pura.
          </div>
        </div>
      </div>
    </div>
  );
};
