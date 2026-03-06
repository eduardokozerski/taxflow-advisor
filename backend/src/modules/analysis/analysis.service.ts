import { prisma } from "../../lib/prisma.js";
import { efficiencyScoreService } from "../efficiencyScore/efficiencyScore.service.js";
import { financialMetricsService } from "../financialMetrics/financialMetrics.service.js";
import { marketBenchmarkService } from "../marketBenchmark/marketBenchmark.service.js";
import { reportService } from "../report/report.service.js";
import { taxSimulationService } from "../taxSimulation/taxSimulation.service.js";

type CreateAnalysisInput = {
  companyId: string;
  monthlyRevenue: number;
  employeesCount: number;
  payrollAmount: number;
  taxesPaidAmount: number;
  operationalCostsAmount: number;
};

const buildRecommendedServices = (
  effectiveTaxRate: number,
  payrollRate: number,
  operationalMargin: number
) => {
  const services: string[] = [];

  if (effectiveTaxRate >= 15) {
    services.push("Planejamento Tributário");
  }

  if (payrollRate >= 35) {
    services.push("Gestão de Folha e Encargos");
  }

  if (operationalMargin <= 20) {
    services.push("Redução de Custos");
  }

  if (services.length === 0) {
    services.push("Revisão Fiscal Preventiva");
  }

  return services;
};

export const analysisService = {
  async createCompleteAnalysis(input: CreateAnalysisInput) {
    const financialMetrics = financialMetricsService.calculate({
      monthlyRevenue: input.monthlyRevenue,
      payrollAmount: input.payrollAmount,
      taxesPaidAmount: input.taxesPaidAmount,
      operationalCostsAmount: input.operationalCostsAmount,
    });
    const recommendedServices = buildRecommendedServices(
      financialMetrics.effectiveTaxRate,
      financialMetrics.payrollRate,
      financialMetrics.operationalMargin
    );

    const scoreResult = efficiencyScoreService.calculate(financialMetrics);
    const taxSimulations = taxSimulationService.simulate({
      monthlyRevenue: input.monthlyRevenue,
    });

    const analysis = await prisma.analysis.create({
      data: {
        companyId: input.companyId,
        status: "completed",
        monthlyRevenue: input.monthlyRevenue,
        employeesCount: input.employeesCount,
        payrollAmount: input.payrollAmount,
        taxesPaidAmount: input.taxesPaidAmount,
        operationalCostsAmount: input.operationalCostsAmount,
        recommendedServices,
        completedAt: new Date(),
        financialMetrics: {
          create: financialMetrics,
        },
        scoreResult: {
          create: {
            scoreValue: scoreResult.scoreValue,
            classification: scoreResult.classification,
            scoreBreakdown: {
              effectiveTaxRate: financialMetrics.effectiveTaxRate,
              payrollRate: financialMetrics.payrollRate,
              operationalMargin: financialMetrics.operationalMargin,
            },
          },
        },
        taxSimulations: {
          create: taxSimulations,
        },
      },
      include: {
        company: true,
        financialMetrics: true,
        scoreResult: true,
        taxSimulations: true,
        marketBenchmark: true,
        report: true,
        lead: true,
      },
    });

    await Promise.all([
      marketBenchmarkService.recalculateByAnalysisId(analysis.id),
      reportService.generateByAnalysisId(analysis.id),
    ]);

    return analysisService.getAnalysisById(analysis.id);
  },

  async recalculateByAnalysisId(analysisId: string) {
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        financialMetrics: true,
      },
    });

    if (!analysis) {
      return null;
    }

    const financialMetrics = financialMetricsService.calculate({
      monthlyRevenue: analysis.monthlyRevenue,
      payrollAmount: analysis.payrollAmount,
      taxesPaidAmount: analysis.taxesPaidAmount,
      operationalCostsAmount: analysis.operationalCostsAmount,
    });
    const recommendedServices = buildRecommendedServices(
      financialMetrics.effectiveTaxRate,
      financialMetrics.payrollRate,
      financialMetrics.operationalMargin
    );

    await prisma.financialMetrics.upsert({
      where: {
        analysisId: analysis.id,
      },
      update: financialMetrics,
      create: {
        analysisId: analysis.id,
        ...financialMetrics,
      },
    });

    await Promise.all([
      taxSimulationService.recalculateByAnalysisId(analysis.id),
      efficiencyScoreService.recalculateByAnalysisId(analysis.id),
      marketBenchmarkService.recalculateByAnalysisId(analysis.id),
      reportService.generateByAnalysisId(analysis.id),
      prisma.analysis.update({
        where: { id: analysis.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          recommendedServices,
        },
      }),
    ]);

    return analysisService.getAnalysisById(analysis.id);
  },

  async getAnalysisById(analysisId: string) {
    return prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        company: true,
        financialMetrics: true,
        scoreResult: true,
        taxSimulations: true,
        marketBenchmark: true,
        report: true,
        lead: true,
      },
    });
  },
};
