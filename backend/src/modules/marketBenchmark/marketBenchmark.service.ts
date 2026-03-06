import { prisma } from "../../lib/prisma.js";

type BenchmarkResult = {
  taxRateCompany: number;
  taxRateMarket: number;
  payrollRateCompany: number;
  payrollRateMarket: number;
  marginCompany: number;
  marginMarket: number;
};

const marketDefaults = {
  taxRate: 13,
  payrollRate: 32,
  margin: 28
};

const buildBenchmark = (
  effectiveTaxRate: number,
  payrollRate: number,
  operationalMargin: number
): BenchmarkResult => {
  return {
    taxRateCompany: effectiveTaxRate,
    taxRateMarket: marketDefaults.taxRate,
    payrollRateCompany: payrollRate,
    payrollRateMarket: marketDefaults.payrollRate,
    marginCompany: operationalMargin,
    marginMarket: marketDefaults.margin
  };
};

export const marketBenchmarkService = {
  async recalculateByAnalysisId(analysisId: string) {
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        company: true,
        financialMetrics: true
      }
    });

    if (!analysis || !analysis.financialMetrics) {
      return null;
    }

    const benchmark = buildBenchmark(
      analysis.financialMetrics.effectiveTaxRate,
      analysis.financialMetrics.payrollRate,
      analysis.financialMetrics.operationalMargin
    );

    return prisma.marketBenchmark.upsert({
      where: { analysisId: analysis.id },
      update: {
        sectorReference: analysis.company.businessSector,
        taxRateCompany: benchmark.taxRateCompany,
        taxRateMarket: benchmark.taxRateMarket,
        payrollRateCompany: benchmark.payrollRateCompany,
        payrollRateMarket: benchmark.payrollRateMarket,
        marginCompany: benchmark.marginCompany,
        marginMarket: benchmark.marginMarket,
        dataset: {
          taxRate: {
            company: benchmark.taxRateCompany,
            market: benchmark.taxRateMarket
          },
          payrollRate: {
            company: benchmark.payrollRateCompany,
            market: benchmark.payrollRateMarket
          },
          margin: {
            company: benchmark.marginCompany,
            market: benchmark.marginMarket
          }
        }
      },
      create: {
        analysisId: analysis.id,
        sectorReference: analysis.company.businessSector,
        taxRateCompany: benchmark.taxRateCompany,
        taxRateMarket: benchmark.taxRateMarket,
        payrollRateCompany: benchmark.payrollRateCompany,
        payrollRateMarket: benchmark.payrollRateMarket,
        marginCompany: benchmark.marginCompany,
        marginMarket: benchmark.marginMarket,
        dataset: {
          taxRate: {
            company: benchmark.taxRateCompany,
            market: benchmark.taxRateMarket
          },
          payrollRate: {
            company: benchmark.payrollRateCompany,
            market: benchmark.payrollRateMarket
          },
          margin: {
            company: benchmark.marginCompany,
            market: benchmark.marginMarket
          }
        }
      }
    });
  },

  async getByAnalysisId(analysisId: string) {
    return prisma.marketBenchmark.findUnique({
      where: { analysisId }
    });
  }
};
