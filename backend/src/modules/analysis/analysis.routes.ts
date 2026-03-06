import { Router } from "express";
import { analysisController } from "./analysis.controller.js";

export const analysisRoutes = Router();

analysisRoutes.post("/", analysisController.create);
analysisRoutes.get("/:analysisId", analysisController.getById);
analysisRoutes.post("/:analysisId/recalculate", analysisController.recalculateById);
