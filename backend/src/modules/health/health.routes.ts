import { Router } from "express";

export const healthRoutes = Router();

healthRoutes.get("/", (_request, response) => {
  response.status(200).json({
    data: {
      service: "taxflow-advisor-backend",
      status: "ok",
    },
  });
});
