import { createSlice } from "@reduxjs/toolkit";
import { Analysis } from "@/types/analysis";
import {
  createAnalysisAction,
  getAnalysisByIdAction,
  recalculateAnalysisByIdAction,
} from "./actions";

type AnalysisState = {
  currentAnalysis: Analysis | null;
  loading: boolean;
  recalculateLoading: boolean;
  error: string | null;
};

const initialState: AnalysisState = {
  currentAnalysis: null,
  loading: false,
  recalculateLoading: false,
  error: null,
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAnalysisAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnalysisAction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnalysis = action.payload;
      })
      .addCase(createAnalysisAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Não foi possível criar análise";
      })
      .addCase(getAnalysisByIdAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAnalysisByIdAction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnalysis = action.payload;
      })
      .addCase(getAnalysisByIdAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Não foi possível obter análise";
      })
      .addCase(recalculateAnalysisByIdAction.pending, (state) => {
        state.recalculateLoading = true;
        state.error = null;
      })
      .addCase(recalculateAnalysisByIdAction.fulfilled, (state, action) => {
        state.recalculateLoading = false;
        state.currentAnalysis = action.payload;
      })
      .addCase(recalculateAnalysisByIdAction.rejected, (state, action) => {
        state.recalculateLoading = false;
        state.error = action.error.message ?? "Não foi possível reprocessar análise";
      });
  },
});

export const analysisReducer = analysisSlice.reducer;
