import { LeadChannel } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import { leadService } from "./lead.service.js";

const paramsSchema = z.object({
  analysisId: z.string().min(1)
});

const leadSchema = z.object({
  contactName: z.string().min(2).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().min(8).optional(),
  preferredChannel: z.nativeEnum(LeadChannel),
  message: z.string().min(2).optional()
});

export const leadController = {
  async upsertByAnalysisId(request: Request, response: Response) {
    const { analysisId } = paramsSchema.parse(request.params);
    const payload = leadSchema.parse(request.body);
    const result = await leadService.upsertByAnalysisId({
      analysisId,
      ...payload
    });

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
    const result = await leadService.getByAnalysisId(analysisId);

    if (!result) {
      return response.status(404).json({
        errors: [{ message: "Lead não encontrado" }]
      });
    }

    return response.status(200).json({
      data: result
    });
  }
};
