import { Request, Response } from "express";
import { z } from "zod";
import { taxSimulationService } from "./taxSimulation.service.js";

const simulateSchema = z.object({
  monthlyRevenue: z.number().positive()
});

const paramsSchema = z.object({
  analysisId: z.string().min(1)
});

export const taxSimulationController = {
  simulate(request: Request, response: Response) {
    const payload = simulateSchema.parse(request.body);
    const result = taxSimulationService.simulate(payload);

    return response.status(200).json({
      data: result
    });
  },

  async recalculateByAnalysisId(request: Request, response: Response) {
    const { analysisId } = paramsSchema.parse(request.params);
    const result = await taxSimulationService.recalculateByAnalysisId(analysisId);

    if (!result) {
      return response.status(404).json({
        errors: [{ message: "Análise não encontrada" }]
      });
    }

    return response.status(200).json({
      data: result
    });
  }
};
