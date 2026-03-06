import { prisma } from "../../lib/prisma.js";

type CreateCompanyInput = {
  legalName: string;
  businessSector: string;
  companySize: string;
};

export const companyService = {
  async createCompany(input: CreateCompanyInput) {
    return prisma.company.create({
      data: input
    });
  },

  async getCompanyById(companyId: string) {
    return prisma.company.findUnique({
      where: { id: companyId }
    });
  }
};
