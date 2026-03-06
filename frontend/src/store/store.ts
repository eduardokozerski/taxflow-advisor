import { configureStore } from "@reduxjs/toolkit";
import { analysisReducer } from "./analysis/reducers";
import { companyReducer } from "./company/reducers";

export const store = configureStore({
  reducer: {
    company: companyReducer,
    analysis: analysisReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
