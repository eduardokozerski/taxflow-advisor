type FinancialMetricsInput = {
  monthlyRevenue: number;
  payrollAmount: number;
  taxesPaidAmount: number;
  operationalCostsAmount: number;
};

type FinancialMetricsResult = {
  effectiveTaxRate: number;
  payrollRate: number;
  operationalMargin: number;
};

const toPercent = (value: number) => Number((value * 100).toFixed(2));

export const financialMetricsService = {
  calculate(input: FinancialMetricsInput): FinancialMetricsResult {
    const revenue = Math.max(input.monthlyRevenue, 1);
    const effectiveTaxRate = toPercent(input.taxesPaidAmount / revenue);
    const payrollRate = toPercent(input.payrollAmount / revenue);
    const operationalMargin = toPercent(
      (revenue - input.taxesPaidAmount - input.payrollAmount - input.operationalCostsAmount) / revenue
    );

    return {
      effectiveTaxRate,
      payrollRate,
      operationalMargin
    };
  }
};
