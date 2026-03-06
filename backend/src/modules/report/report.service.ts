import { prisma } from "../../lib/prisma.js";

export const reportService = {
  async generateByAnalysisId(analysisId: string) {
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        company: true,
        financialMetrics: true,
        scoreResult: true,
        taxSimulations: true,
        marketBenchmark: true
      }
    });

    if (!analysis) {
      return null;
    }

    const version = `v${new Date().toISOString()}`;
    const filePath = `reports/${analysis.id}.pdf`;

    return prisma.report.upsert({
      where: { analysisId: analysis.id },
      update: {
        filePath,
        version
      },
      create: {
        analysisId: analysis.id,
        filePath,
        version
      }
    });
  },

  async getByAnalysisId(analysisId: string) {
    return prisma.report.findUnique({
      where: { analysisId }
    });
  }
};
