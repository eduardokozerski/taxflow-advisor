import { RootState } from "../store";

export const selectCurrentCompany = (state: RootState) => state.company.currentCompany;
export const selectCompanyLoading = (state: RootState) => state.company.loading;
export const selectCompanyError = (state: RootState) => state.company.error;
