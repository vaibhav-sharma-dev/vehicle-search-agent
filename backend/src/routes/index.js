import { Router } from "express";
import vehicleRoutes from "./vehicle.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.success({ message: "API is healthy", data: { status: "ok" } });
});

router.use("/vehicles", vehicleRoutes);

export default router;
