import { prisma } from "../../lib/prisma.js";

type EfficiencyScoreInput = {
  effectiveTaxRate: number;
  payrollRate: number;
  operationalMargin: number;
};

type EfficiencyScoreResult = {
  scoreValue: number;
  classification: "baixa" | "media" | "alta";
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const efficiencyScoreService = {
  calculate(input: EfficiencyScoreInput): EfficiencyScoreResult {
    const taxScore = clamp(100 - input.effectiveTaxRate * 2, 0, 100);
    const payrollScore = clamp(100 - input.payrollRate * 1.2, 0, 100);
    const marginScore = clamp(input.operationalMargin * 2.2, 0, 100);
    const scoreValue = Math.round(taxScore * 0.4 + payrollScore * 0.25 + marginScore * 0.35);

    if (scoreValue < 40) {
      return { scoreValue, classification: "baixa" };
    }

    if (scoreValue <= 70) {
      return { scoreValue, classification: "media" };
    }

    return { scoreValue, classification: "alta" };
  },

  async recalculateByAnalysisId(analysisId: string) {
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        financialMetrics: true
      }
    });

    if (!analysis || !analysis.financialMetrics) {
      return null;
    }

    const result = efficiencyScoreService.calculate({
      effectiveTaxRate: analysis.financialMetrics.effectiveTaxRate,
      payrollRate: analysis.financialMetrics.payrollRate,
      operationalMargin: analysis.financialMetrics.operationalMargin
    });

    return prisma.scoreResult.upsert({
      where: {
        analysisId: analysis.id
      },
      update: {
        scoreValue: result.scoreValue,
        classification: result.classification,
        scoreBreakdown: {
          effectiveTaxRate: analysis.financialMetrics.effectiveTaxRate,
          payrollRate: analysis.financialMetrics.payrollRate,
          operationalMargin: analysis.financialMetrics.operationalMargin
        }
      },
      create: {
        analysisId: analysis.id,
        scoreValue: result.scoreValue,
        classification: result.classification,
        scoreBreakdown: {
          effectiveTaxRate: analysis.financialMetrics.effectiveTaxRate,
          payrollRate: analysis.financialMetrics.payrollRate,
          operationalMargin: analysis.financialMetrics.operationalMargin
        }
      }
    });
  }
};
