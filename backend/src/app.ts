import cors from "cors";
import express from "express";
import { analysisRoutes } from "./modules/analysis/analysis.routes.js";
import { companyRoutes } from "./modules/company/company.routes.js";
import { efficiencyScoreRoutes } from "./modules/efficiencyScore/efficiencyScore.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { leadRoutes } from "./modules/lead/lead.routes.js";
import { marketBenchmarkRoutes } from "./modules/marketBenchmark/marketBenchmark.routes.js";
import { reportRoutes } from "./modules/report/report.routes.js";
import { taxSimulationRoutes } from "./modules/taxSimulation/taxSimulation.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/analyses", analysisRoutes);
app.use("/api/v1/tax-simulations", taxSimulationRoutes);
app.use("/api/v1/efficiency-scores", efficiencyScoreRoutes);
app.use("/api/v1/market-benchmarks", marketBenchmarkRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/leads", leadRoutes);
