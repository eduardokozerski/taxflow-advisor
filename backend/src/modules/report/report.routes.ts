import { Router } from "express";
import { reportController } from "./report.controller.js";

export const reportRoutes = Router();

reportRoutes.post("/:analysisId/generate", reportController.generateByAnalysisId);
reportRoutes.get("/:analysisId", reportController.getByAnalysisId);
