import { Router } from "express";
import { companyController } from "./company.controller.js";

export const companyRoutes = Router();

companyRoutes.post("/", companyController.create);
companyRoutes.get("/:companyId", companyController.getById);
