import { createAsyncThunk } from "@reduxjs/toolkit";
import { companyServices, CreateCompanyPayload } from "./services";

export const createCompanyAction = createAsyncThunk(
  "company/createCompany",
  async (payload: CreateCompanyPayload) => {
    return companyServices.createCompany(payload);
  }
);
