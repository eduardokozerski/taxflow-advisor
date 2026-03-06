import { Request, Response } from "express";
import { z } from "zod";
import { analysisService } from "./analysis.service.js";

const createAnalysisSchema = z.object({
  companyId: z.string().min(1),
  monthlyRevenue: z.number().positive(),
  employeesCount: z.number().int().nonnegative(),
  payrollAmount: z.number().nonnegative(),
  taxesPaidAmount: z.number().nonnegative(),
  operationalCostsAmount: z.number().nonnegative(),
});

export const analysisController = {
  async create(request: Request, response: Response) {
    const payload = createAnalysisSchema.parse(request.body);
    const analysis = await analysisService.createCompleteAnalysis(payload);

    return response.status(201).json({ data: analysis });
  },

  async getById(request: Request, response: Response) {
    const paramsSchema = z.object({ analysisId: z.string().min(1) });
    const { analysisId } = paramsSchema.parse(request.params);
    const analysis = await analysisService.getAnalysisById(analysisId);

    if (!analysis) {
      return response.status(404).json({
        errors: [{ message: "Análise não encontrada" }],
      });
    }

    return response.status(200).json({ data: analysis });
  },

  async recalculateById(request: Request, response: Response) {
    const paramsSchema = z.object({ analysisId: z.string().min(1) });
    const { analysisId } = paramsSchema.parse(request.params);
    const analysis = await analysisService.recalculateByAnalysisId(analysisId);

    if (!analysis) {
      return response.status(404).json({
        errors: [{ message: "Análise não encontrada" }],
      });
    }

    return response.status(200).json({ data: analysis });
  },
};
