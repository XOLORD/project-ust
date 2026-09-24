import React from 'react';
import { Download, Printer, Code2, TrendingUp, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onExportCSV: () => void;
  onPrint: () => void;
  onOpenStandaloneModal: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExportCSV,
  onPrint,
  onOpenStandaloneModal,
  onOpenHelp,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <a href="/" className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              Equilibria Colombia
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                Finanzas & Regiones
              </span>
            </a>
          </div>
        </div>

        {/* Zone 2: Clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <a href="#control-panel" className="hover:text-white transition-colors">
            Parámetros & Costos
          </a>
          <a href="#graficos" className="hover:text-white transition-colors">
            Curva de Equilibrio
          </a>
          <a href="#estacionalidad" className="hover:text-white transition-colors">
            Estacionalidad Mensual
          </a>
          <a href="#fechas-clave" className="hover:text-white transition-colors">
            Fechas Clave & Festivos
          </a>
          <a href="#sensibilidad" className="hover:text-white transition-colors">
            Análisis de Sensibilidad
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHelp}
            title="Guía de fórmulas financieras"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden lg:inline">Fórmulas</span>
          </button>

          <button
            onClick={onPrint}
            title="Imprimir o guardar como PDF"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
          >
            <Printer className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>

          <button
            onClick={onExportCSV}
            title="Exportar datos a archivo CSV"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-900/50 bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-900/40 hover:text-emerald-200 transition-colors whitespace-nowrap"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={onOpenStandaloneModal}
            title="Ver o copiar el código HTML autónomo completo"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm whitespace-nowrap"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>HTML Autónomo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
