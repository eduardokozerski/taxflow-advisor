import { Router } from "express";
import { efficiencyScoreController } from "./efficiencyScore.controller.js";

export const efficiencyScoreRoutes = Router();

efficiencyScoreRoutes.post("/", efficiencyScoreController.calculate);
efficiencyScoreRoutes.post(
  "/:analysisId/recalculate",
  efficiencyScoreController.recalculateByAnalysisId,
);
