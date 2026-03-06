import { RootState } from "../store";

export const selectCurrentAnalysis = (state: RootState) => state.analysis.currentAnalysis;
export const selectAnalysisLoading = (state: RootState) => state.analysis.loading;
export const selectAnalysisRecalculateLoading = (state: RootState) => state.analysis.recalculateLoading;
export const selectAnalysisError = (state: RootState) => state.analysis.error;
