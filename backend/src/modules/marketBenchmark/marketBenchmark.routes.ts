import { Router } from "express";
import { marketBenchmarkController } from "./marketBenchmark.controller.js";

export const marketBenchmarkRoutes = Router();

marketBenchmarkRoutes.post("/:analysisId/recalculate", marketBenchmarkController.recalculateByAnalysisId);
marketBenchmarkRoutes.get("/:analysisId", marketBenchmarkController.getByAnalysisId);
