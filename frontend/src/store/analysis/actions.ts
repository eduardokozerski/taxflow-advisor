import { createAsyncThunk } from "@reduxjs/toolkit";
import { analysisServices, CreateAnalysisPayload } from "./services";

export const createAnalysisAction = createAsyncThunk(
  "analysis/createAnalysis",
  async (payload: CreateAnalysisPayload) => {
    return analysisServices.createAnalysis(payload);
  },
);

export const getAnalysisByIdAction = createAsyncThunk(
  "analysis/getAnalysisById",
  async (analysisId: string) => {
    return analysisServices.getAnalysisById(analysisId);
  },
);

export const recalculateAnalysisByIdAction = createAsyncThunk(
  "analysis/recalculateAnalysisById",
  async (analysisId: string) => {
    return analysisServices.recalculateAnalysisById(analysisId);
  },
);
