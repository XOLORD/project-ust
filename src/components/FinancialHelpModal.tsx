import React from 'react';
import { X, BookOpen, Calculator, HelpCircle } from 'lucide-react';

interface FinancialHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinancialHelpModal: React.FC<FinancialHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Guía Metodológica & Fórmulas Financieras Industriales
            </h3>
            <p className="text-xs text-slate-400">
              Modelos de Punto de Equilibrio y Estacionalidad Comercial aplicados a Colombia.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-5 text-xs text-slate-300">
          {/* 1. PE en Unidades */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4 text-emerald-400" />
              1. Punto de Equilibrio en Unidades (PEq)
            </h4>
            <div className="mt-2 rounded bg-slate-900 p-2 font-mono text-emerald-300 text-center text-xs">
              PE (unidades) = Costos Fijos Mensuales / (Precio de Venta - Costo Variable Unitario)
            </div>
            <p className="mt-2 text-slate-400 leading-relaxed">
              Determina la cantidad física exacta de productos o servicios que una empresa debe fabricar y vender al mes para que sus ingresos totales igualen exactamente sus costos totales (fijos + variables). En este volumen, la utilidad operativa es cero ($0 COP).
            </p>
          </div>

          {/* 2. PE en Pesos */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4 text-emerald-400" />
              2. Punto de Equilibrio en Pesos COP (PE$)
            </h4>
            <div className="mt-2 rounded bg-slate-900 p-2 font-mono text-emerald-300 text-center text-xs">
              PE ($ COP) = PE (unidades) × Precio de Venta = Costos Fijos / Razón de Margen de Contribución
            </div>
            <p className="mt-2 text-slate-400 leading-relaxed">
              Monto mínimo de facturación mensual en pesos colombianos indispensable para mantener la operación abierta sin perder capital ni endeudarse.
            </p>
          </div>

          {/* 3. Margen de Contribución */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4 text-emerald-400" />
              3. Margen de Contribución Unitario (MCU) y Porcentual
            </h4>
            <div className="mt-2 rounded bg-slate-900 p-2 font-mono text-emerald-300 text-center text-xs">
              MCU = Precio de Venta - Costo Variable Unitario | Razón MC = (MCU / Precio) × 100%
            </div>
            <p className="mt-2 text-slate-400 leading-relaxed">
              Es el aporte monetario residual que deja cada producto vendido para primero pagar la porción correspondiente de costos fijos (arriendo, nómina base, energía, seguros) y, una vez saldados estos, generar utilidad neta de ganancia.
            </p>
          </div>

          {/* 4. Estacionalidad */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4 text-emerald-400" />
              4. Modelo de Estacionalidad Comercial en Colombia
            </h4>
            <p className="mt-2 text-slate-400 leading-relaxed">
              En Colombia, la dinámica comercial no es lineal. Meses como Mayo (Día de la Madre), Junio (Prima Legal de Mitad de Año), Agosto (Feria de las Flores / Petronio) y Diciembre (Prima Navideña + Aguinaldos) generan sobre-demanda de +30% a +85%, mientras que Enero y Febrero suelen ser meses valle con contracción del gasto por pago de deudas y temporada escolar.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
