import { Request, Response } from "express";
import { z } from "zod";
import { marketBenchmarkService } from "./marketBenchmark.service.js";

const paramsSchema = z.object({
  analysisId: z.string().min(1),
});

export const marketBenchmarkController = {
  async recalculateByAnalysisId(request: Request, response: Response) {
    const { analysisId } = paramsSchema.parse(request.params);
    const result =
      await marketBenchmarkService.recalculateByAnalysisId(analysisId);

    if (!result) {
      return response.status(404).json({
        errors: [
          { message: "Análise não encontrada ou sem métricas financeiras" },
        ],
      });
    }

    return response.status(200).json({
      data: result,
    });
  },

  async getByAnalysisId(request: Request, response: Response) {
    const { analysisId } = paramsSchema.parse(request.params);
    const result = await marketBenchmarkService.getByAnalysisId(analysisId);

    if (!result) {
      return response.status(404).json({
        errors: [{ message: "Benchmark não encontrado" }],
      });
    }

    return response.status(200).json({
      data: result,
    });
  },
};
