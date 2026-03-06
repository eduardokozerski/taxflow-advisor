import { apiClient } from "@/lib/apiClient";
import { Analysis } from "@/types/analysis";

export type CreateAnalysisPayload = {
  companyId: string;
  monthlyRevenue: number;
  employeesCount: number;
  payrollAmount: number;
  taxesPaidAmount: number;
  operationalCostsAmount: number;
};

export const analysisServices = {
  createAnalysis(payload: CreateAnalysisPayload) {
    return apiClient.request<Analysis>("/analyses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getAnalysisById(analysisId: string) {
    return apiClient.request<Analysis>(`/analyses/${analysisId}`, {
      method: "GET",
    });
  },

  recalculateAnalysisById(analysisId: string) {
    return apiClient.request<Analysis>(`/analyses/${analysisId}/recalculate`, {
      method: "POST",
    });
  },
};
