export type Company = {
  id: string;
  legalName: string;
  businessSector: string;
  companySize: string;
};

export type FinancialMetrics = {
  effectiveTaxRate: number;
  payrollRate: number;
  operationalMargin: number;
};

export type TaxSimulation = {
  regime: "simplesNacional" | "lucroPresumido" | "lucroReal";
  rateMin: number;
  rateMax: number;
  monthlyTaxEstimate: number;
  annualTaxEstimate: number;
  disclaimer: string;
};

export type ScoreResult = {
  scoreValue: number;
  classification: "baixa" | "media" | "alta";
};

export type MarketBenchmark = {
  sectorReference: string;
  taxRateCompany: number;
  taxRateMarket: number;
  payrollRateCompany: number;
  payrollRateMarket: number;
  marginCompany: number;
  marginMarket: number;
  dataset?: {
    metadata?: {
      source?: string;
      sources?: Array<{
        url: string;
        dataset: string;
        updatedAt: string | null;
      }>;
    };
  } | null;
};

export type Report = {
  filePath: string;
  version: string;
};

export type Lead = {
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  preferredChannel: "whatsapp" | "formulario" | "email" | "crm";
  message?: string | null;
};

export type Analysis = {
  id: string;
  companyId: string;
  monthlyRevenue: number;
  employeesCount: number;
  payrollAmount: number;
  taxesPaidAmount: number;
  operationalCostsAmount: number;
  recommendedServices: string[] | null;
  company: Company;
  financialMetrics: FinancialMetrics | null;
  taxSimulations: TaxSimulation[];
  scoreResult: ScoreResult | null;
  marketBenchmark: MarketBenchmark | null;
  report: Report | null;
  lead: Lead | null;
};
