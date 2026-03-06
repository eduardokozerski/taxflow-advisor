import { Request, Response } from "express";
import { z } from "zod";
import { efficiencyScoreService } from "./efficiencyScore.service.js";

const calculateSchema = z.object({
  effectiveTaxRate: z.number().nonnegative(),
  payrollRate: z.number().nonnegative(),
  operationalMargin: z.number()
});

const paramsSchema = z.object({
  analysisId: z.string().min(1)
});

export const efficiencyScoreController = {
  calculate(request: Request, response: Response) {
    const payload = calculateSchema.parse(request.body);
    const result = efficiencyScoreService.calculate(payload);

    return response.status(200).json({
      data: result
    });
  },

  async recalculateByAnalysisId(request: Request, response: Response) {
    const { analysisId } = paramsSchema.parse(request.params);
    const result = await efficiencyScoreService.recalculateByAnalysisId(analysisId);

    if (!result) {
      return response.status(404).json({
        errors: [{ message: "Análise não encontrada ou sem métricas financeiras" }]
      });
    }

    return response.status(200).json({
      data: result
    });
  }
};
