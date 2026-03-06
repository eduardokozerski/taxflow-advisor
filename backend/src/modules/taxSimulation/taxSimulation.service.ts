import { prisma } from "../../lib/prisma.js";

type TaxSimulationInput = {
  monthlyRevenue: number;
};

type Regime = "simplesNacional" | "lucroPresumido" | "lucroReal";

type TaxSimulationResult = {
  regime: Regime;
  rateMin: number;
  rateMax: number;
  monthlyTaxEstimate: number;
  annualTaxEstimate: number;
  disclaimer: string;
};

const calculateTaxByRate = (revenue: number, rate: number) => revenue * rate;

export const taxSimulationService = {
  simulate(input: TaxSimulationInput): TaxSimulationResult[] {
    const revenue = input.monthlyRevenue;
    const disclaimer = "Simulação estimada para fins informativos.";

    const scenarios: Array<{
      regime: Regime;
      rateMin: number;
      rateMax: number;
    }> = [
      { regime: "simplesNacional", rateMin: 0.08, rateMax: 0.12 },
      { regime: "lucroPresumido", rateMin: 0.13, rateMax: 0.16 },
      { regime: "lucroReal", rateMin: 0.1, rateMax: 0.2 },
    ];

    return scenarios.map((scenario) => {
      const averageRate = (scenario.rateMin + scenario.rateMax) / 2;
      const monthlyTaxEstimate = calculateTaxByRate(revenue, averageRate);

      return {
        regime: scenario.regime,
        rateMin: scenario.rateMin,
        rateMax: scenario.rateMax,
        monthlyTaxEstimate,
        annualTaxEstimate: monthlyTaxEstimate * 12,
        disclaimer,
      };
    });
  },

  async recalculateByAnalysisId(analysisId: string) {
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      select: {
        id: true,
        monthlyRevenue: true,
      },
    });

    if (!analysis) {
      return null;
    }

    const simulations = taxSimulationService.simulate({
      monthlyRevenue: analysis.monthlyRevenue,
    });

    await prisma.$transaction([
      prisma.taxSimulation.deleteMany({
        where: { analysisId: analysis.id },
      }),
      prisma.analysis.update({
        where: { id: analysis.id },
        data: {
          taxSimulations: {
            create: simulations,
          },
        },
        include: {
          taxSimulations: true,
        },
      }),
    ]);

    return prisma.taxSimulation.findMany({
      where: { analysisId: analysis.id },
      orderBy: { createdAt: "asc" },
    });
  },
};
