import { Router } from "express";
import { leadController } from "./lead.controller.js";

export const leadRoutes = Router();

leadRoutes.post("/:analysisId", leadController.upsertByAnalysisId);
leadRoutes.get("/:analysisId", leadController.getByAnalysisId);
