import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode2 } from 'lucide-react';
import { generateStandaloneHtml } from '../utils/generateStandaloneHtml';

interface StandaloneHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneHtmlModal: React.FC<StandaloneHtmlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlContent = generateStandaloneHtml();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error al copiar al portapapeles', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'equilibria_colombia_standalone.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileCode2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Código HTML Autónomo Completo (Single File)
            </h3>
            <p className="text-xs text-slate-400">
              Archivo HTML listo para ejecutar sin dependencias locales (con Tailwind CSS y Chart.js integrados vía CDN).
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-300">
            Puedes copiar este código o descargarlo para abrirlo en cualquier navegador (Chrome, Edge, Safari, Firefox).
          </span>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Descargar .html</span>
            </button>
          </div>
        </div>

        <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <pre className="h-96 overflow-y-auto p-4 font-mono text-[11px] text-emerald-400/90 leading-relaxed selection:bg-emerald-800 selection:text-white">
            {htmlContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
