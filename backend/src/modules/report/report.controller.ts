import { Request, Response } from "express";
import { z } from "zod";
import { reportService } from "./report.service.js";

const paramsSchema = z.object({
  analysisId: z.string().min(1)
});

export const reportController = {
  async generateByAnalysisId(request: Request, response: Response) {
    const { analysisId } = paramsSchema.parse(request.params);
    const result = await reportService.generateByAnalysisId(analysisId);

    if (!result) {
      return response.status(404).json({
        errors: [{ message: "Análise não encontrada" }]
      });
    }

    return response.status(200).json({
      data: result
    });
  },

  async getByAnalysisId(request: Request, response: Response) {
    const { analysisId } = paramsSchema.parse(request.params);
    const result = await reportService.getByAnalysisId(analysisId);

    if (!result) {
      return response.status(404).json({
        errors: [{ message: "Relatório não encontrado" }]
      });
    }

    return response.status(200).json({
      data: result
    });
  }
};
