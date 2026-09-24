export interface RegionData {
  id: string;
  name: string;
  department: string;
  capital: string;
  economicProfile: string;
  seasonalMultiplierBonus: number; // Factor extra de consumo regional
  keyEvents: KeyEvent[];
  monthlyFactors: number[]; // 12 factors for Jan-Dec (1.0 = baseline)
}

export interface KeyEvent {
  id: string;
  name: string;
  month: number; // 1-12
  monthName: string;
  datesDescription: string;
  scope: 'Nacional' | 'Regional';
  demandImpactPercent: number; // e.g., +45
  affectedCategories: string[];
  description: string;
  businessTip: string;
}

export interface ProductPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultPrice: number; // COP
  defaultVariableCost: number; // COP
  defaultFixedCosts: number; // COP monthly
  defaultBaselineUnits: number; // monthly expected units
  unitOfMeasure: string;
}

export interface FinancialMetrics {
  sellingPrice: number;
  variableCostUnit: number;
  fixedCosts: number;
  plannedUnits: number;
  
  // Calculated metrics
  contributionMarginUnit: number;
  contributionMarginRatio: number; // percentage (0 - 100)
  breakEvenUnits: number;
  breakEvenRevenue: number;
  
  totalRevenue: number;
  totalVariableCosts: number;
  totalCosts: number;
  operatingProfit: number;
  
  safetyMarginUnits: number;
  safetyMarginPercent: number;
  operatingLeverageDegree: number | null; // GAO
  
  // Seasonality outputs
  highestMonth: { month: string; units: number; revenue: number; profit: number };
  lowestMonth: { month: string; units: number; revenue: number; profit: number };
  annualProjectedUnits: number;
  annualProjectedRevenue: number;
  annualProjectedProfit: number;
  breakEvenMetMonthsCount: number;
}

export interface MonthlyFinancialRecord {
  monthIndex: number; // 0-11
  monthName: string;
  factor: number;
  units: number;
  revenue: number;
  variableCosts: number;
  fixedCosts: number;
  totalCosts: number;
  operatingProfit: number;
  isAboveBreakEven: boolean;
  events: KeyEvent[];
}
