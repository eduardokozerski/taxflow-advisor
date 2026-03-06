import { LeadChannel } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

type UpsertLeadInput = {
  analysisId: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  preferredChannel: LeadChannel;
  message?: string;
};

export const leadService = {
  async upsertByAnalysisId(input: UpsertLeadInput) {
    const analysis = await prisma.analysis.findUnique({
      where: { id: input.analysisId },
      select: { id: true }
    });

    if (!analysis) {
      return null;
    }

    return prisma.lead.upsert({
      where: { analysisId: input.analysisId },
      update: {
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        preferredChannel: input.preferredChannel,
        message: input.message
      },
      create: {
        analysisId: input.analysisId,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        preferredChannel: input.preferredChannel,
        message: input.message
      }
    });
  },

  async getByAnalysisId(analysisId: string) {
    return prisma.lead.findUnique({
      where: { analysisId }
    });
  }
};
