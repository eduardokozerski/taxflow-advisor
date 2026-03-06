import { createSlice } from "@reduxjs/toolkit";
import { Company } from "@/types/analysis";
import { createCompanyAction } from "./actions";

type CompanyState = {
  currentCompany: Company | null;
  loading: boolean;
  error: string | null;
};

const initialState: CompanyState = {
  currentCompany: null,
  loading: false,
  error: null
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCompanyAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompanyAction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCompany = action.payload;
      })
      .addCase(createCompanyAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Não foi possível criar empresa";
      });
  }
});

export const companyReducer = companySlice.reducer;
