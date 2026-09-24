import { FinancialMetrics, MonthlyFinancialRecord, RegionData } from '../types';
import { MONTH_NAMES } from '../data/colombiaData';

export function formatCOP(value: number, includeCurrency = true): string {
  if (isNaN(value) || !isFinite(value)) return '$ 0 COP';
  const rounded = Math.round(value);
  const formatted = new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(rounded);
  return includeCurrency ? `$ ${formatted} COP` : `$ ${formatted}`;
}

export function formatNumber(value: number, decimals = 0): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  if (isNaN(value) || !isFinite(value)) return '0%';
  return `${new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)}%`;
}

export function calculateFinancials(
  sellingPrice: number,
  variableCostUnit: number,
  fixedCosts: number,
  plannedUnits: number,
  region: RegionData,
  selectedMonthFilter: number | 'all' = 'all'
): {
  metrics: FinancialMetrics;
  monthlyRecords: MonthlyFinancialRecord[];
} {
  // Safe defaults
  const price = Math.max(1, sellingPrice);
  const vCost = Math.max(0, variableCostUnit);
  const fCosts = Math.max(0, fixedCosts);
  const units = Math.max(0, plannedUnits);

  const contributionMarginUnit = price - vCost;
  const contributionMarginRatio = price > 0 ? (contributionMarginUnit / price) * 100 : 0;

  let breakEvenUnits = 0;
  let breakEvenRevenue = 0;

  if (contributionMarginUnit > 0) {
    breakEvenUnits = fCosts / contributionMarginUnit;
    breakEvenRevenue = breakEvenUnits * price;
  } else {
    // Si el margen de contribución es <= 0, nunca se alcanza el punto de equilibrio
    breakEvenUnits = Infinity;
    breakEvenRevenue = Infinity;
  }

  // Monthly breakdown calculation
  const monthlyRecords: MonthlyFinancialRecord[] = MONTH_NAMES.map((mName, idx) => {
    const rawFactor = region.monthlyFactors[idx] ?? 1.0;
    // Si hay un mes seleccionado en particular, o todos los meses
    const factor = rawFactor;
    const projectedUnits = Math.round(units * factor);
    const revenue = projectedUnits * price;
    const variableCosts = projectedUnits * vCost;
    const totalCosts = fCosts + variableCosts;
    const operatingProfit = revenue - totalCosts;
    const isAboveBreakEven = projectedUnits >= breakEvenUnits;

    const events = region.keyEvents.filter((ev) => ev.month === idx + 1);

    return {
      monthIndex: idx,
      monthName: mName,
      factor,
      units: projectedUnits,
      revenue,
      variableCosts,
      fixedCosts: fCosts,
      totalCosts,
      operatingProfit,
      isAboveBreakEven,
      events,
    };
  });

  // Target month or aggregate
  let activeUnits = units;
  if (selectedMonthFilter !== 'all') {
    const target = monthlyRecords[selectedMonthFilter];
    if (target) {
      activeUnits = target.units;
    }
  }

  const totalRevenue = activeUnits * price;
  const totalVariableCosts = activeUnits * vCost;
  const totalCosts = fCosts + totalVariableCosts;
  const operatingProfit = totalRevenue - totalCosts;

  const safetyMarginUnits = isFinite(breakEvenUnits) ? activeUnits - breakEvenUnits : -Infinity;
  const safetyMarginPercent =
    activeUnits > 0 && isFinite(breakEvenUnits)
      ? ((activeUnits - breakEvenUnits) / activeUnits) * 100
      : 0;

  // Grado de Apalancamiento Operativo (GAO) = Margen de Contribución Total / Utilidad Operativa
  const totalContribution = activeUnits * contributionMarginUnit;
  let operatingLeverageDegree: number | null = null;
  if (operatingProfit > 0) {
    operatingLeverageDegree = totalContribution / operatingProfit;
  }

  // Identificar el mes con mayor y menor venta proyectada
  let highestMonth = {
    month: monthlyRecords[0].monthName,
    units: monthlyRecords[0].units,
    revenue: monthlyRecords[0].revenue,
    profit: monthlyRecords[0].operatingProfit,
  };

  let lowestMonth = {
    month: monthlyRecords[0].monthName,
    units: monthlyRecords[0].units,
    revenue: monthlyRecords[0].revenue,
    profit: monthlyRecords[0].operatingProfit,
  };

  let annualProjectedUnits = 0;
  let annualProjectedRevenue = 0;
  let annualProjectedProfit = 0;
  let breakEvenMetMonthsCount = 0;

  monthlyRecords.forEach((m) => {
    annualProjectedUnits += m.units;
    annualProjectedRevenue += m.revenue;
    annualProjectedProfit += m.operatingProfit;

    if (m.isAboveBreakEven) {
      breakEvenMetMonthsCount += 1;
    }

    if (m.revenue > highestMonth.revenue) {
      highestMonth = {
        month: m.monthName,
        units: m.units,
        revenue: m.revenue,
        profit: m.operatingProfit,
      };
    }

    if (m.revenue < lowestMonth.revenue) {
      lowestMonth = {
        month: m.monthName,
        units: m.units,
        revenue: m.revenue,
        profit: m.operatingProfit,
      };
    }
  });

  const metrics: FinancialMetrics = {
    sellingPrice: price,
    variableCostUnit: vCost,
    fixedCosts: fCosts,
    plannedUnits: activeUnits,
    contributionMarginUnit,
    contributionMarginRatio,
    breakEvenUnits,
    breakEvenRevenue,
    totalRevenue,
    totalVariableCosts,
    totalCosts,
    operatingProfit,
    safetyMarginUnits,
    safetyMarginPercent,
    operatingLeverageDegree,
    highestMonth,
    lowestMonth,
    annualProjectedUnits,
    annualProjectedRevenue,
    annualProjectedProfit,
    breakEvenMetMonthsCount,
  };

  return { metrics, monthlyRecords };
}

// Generate data points for Break-Even Curve Chart
export function generateBreakEvenCurveData(
  metrics: FinancialMetrics,
  pointsCount = 12
) {
  const { breakEvenUnits, plannedUnits, sellingPrice, variableCostUnit, fixedCosts } = metrics;
  
  // Si breakEvenUnits no es finito, usar 1000
  const maxRefUnits = isFinite(breakEvenUnits)
    ? Math.max(breakEvenUnits * 1.8, plannedUnits * 1.4, 100)
    : Math.max(plannedUnits * 2, 1000);

  const step = maxRefUnits / (pointsCount - 1);
  const labels: number[] = [];
  const totalRevenues: number[] = [];
  const totalCosts: number[] = [];
  const fixedCostsLine: number[] = [];
  const variableCostsLine: number[] = [];

  for (let i = 0; i < pointsCount; i++) {
    const q = Math.round(i * step);
    labels.push(q);
    totalRevenues.push(q * sellingPrice);
    const varC = q * variableCostUnit;
    variableCostsLine.push(varC);
    totalCosts.push(fixedCosts + varC);
    fixedCostsLine.push(fixedCosts);
  }

  return {
    labels,
    totalRevenues,
    totalCosts,
    fixedCostsLine,
    variableCostsLine,
  };
}

// Exportar CSV
export function exportToCSV(
  metrics: FinancialMetrics,
  monthlyRecords: MonthlyFinancialRecord[],
  region: RegionData,
  productName: string
) {
  const headers = [
    'Mes',
    'Factor Estacional',
    'Unidades Proyectadas',
    'Ingresos (COP)',
    'Costos Variables (COP)',
    'Costos Fijos (COP)',
    'Costos Totales (COP)',
    'Utilidad Operativa (COP)',
    'Supera Punto de Equilibrio',
    'Eventos Comerciales',
  ];

  const rows = monthlyRecords.map((r) => [
    r.monthName,
    r.factor.toFixed(2),
    r.units,
    Math.round(r.revenue),
    Math.round(r.variableCosts),
    Math.round(r.fixedCosts),
    Math.round(r.totalCosts),
    Math.round(r.operatingProfit),
    r.isAboveBreakEven ? 'SÍ' : 'NO',
    r.events.map((e) => e.name).join(' | '),
  ]);

  const summaryHeader = [
    ['--- ESTUDIO DE PUNTO DE EQUILIBRIO Y ESTACIONALIDAD COMERCIAL ---'],
    ['Región / Departamento', region.name],
    ['Producto / Categoría', productName],
    ['Precio de Venta Unitario', formatCOP(metrics.sellingPrice)],
    ['Costo Variable Unitario', formatCOP(metrics.variableCostUnit)],
    ['Margen de Contribución Unitario', formatCOP(metrics.contributionMarginUnit)],
    ['Margen de Contribución (%)', formatPercent(metrics.contributionMarginRatio)],
    ['Costos Fijos Mensuales', formatCOP(metrics.fixedCosts)],
    ['Punto de Equilibrio (Unidades)', isFinite(metrics.breakEvenUnits) ? Math.ceil(metrics.breakEvenUnits).toString() : 'Inalcanzable'],
    ['Punto de Equilibrio (Pesos COP)', isFinite(metrics.breakEvenRevenue) ? formatCOP(metrics.breakEvenRevenue) : 'Inalcanzable'],
    ['Mes con Mayor Venta', `${metrics.highestMonth.month} (${formatCOP(metrics.highestMonth.revenue)})`],
    ['Mes con Menor Venta', `${metrics.lowestMonth.month} (${formatCOP(metrics.lowestMonth.revenue)})`],
    ['--- DESGLOSE MES A MES ---'],
  ];

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    summaryHeader.map((e) => e.join(',')).join('\n') +
    '\n' +
    headers.join(',') +
    '\n' +
    rows.map((e) => e.map((val) => `"${val}"`).join(',')).join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `Equilibria_Estudio_${region.id}_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
