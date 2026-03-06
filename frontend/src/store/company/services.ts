import { apiClient } from "@/lib/apiClient";
import { Company } from "@/types/analysis";

export type CreateCompanyPayload = {
  legalName: string;
  businessSector: string;
  companySize: string;
};

export const companyServices = {
  createCompany(payload: CreateCompanyPayload) {
    return apiClient.request<Company>("/companies", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
};
