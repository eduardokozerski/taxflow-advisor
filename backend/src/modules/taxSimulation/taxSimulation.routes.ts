import { Router } from "express";
import { taxSimulationController } from "./taxSimulation.controller.js";

export const taxSimulationRoutes = Router();

taxSimulationRoutes.post("/", taxSimulationController.simulate);
taxSimulationRoutes.post("/:analysisId/recalculate", taxSimulationController.recalculateByAnalysisId);
