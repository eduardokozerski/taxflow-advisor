import { Request, Response } from "express";
import { z } from "zod";
import { companyService } from "./company.service.js";

const createCompanySchema = z.object({
  legalName: z.string().min(2),
  businessSector: z.string().min(2),
  companySize: z.string().min(2)
});

export const companyController = {
  async create(request: Request, response: Response) {
    const payload = createCompanySchema.parse(request.body);
    const company = await companyService.createCompany(payload);

    return response.status(201).json({ data: company });
  },

  async getById(request: Request, response: Response) {
    const paramsSchema = z.object({ companyId: z.string().min(1) });
    const { companyId } = paramsSchema.parse(request.params);
    const company = await companyService.getCompanyById(companyId);

    if (!company) {
      return response.status(404).json({
        errors: [{ message: "Empresa não encontrada" }]
      });
    }

    return response.status(200).json({ data: company });
  }
};
