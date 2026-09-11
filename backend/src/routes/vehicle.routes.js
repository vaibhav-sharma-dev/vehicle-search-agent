import { Router } from "express";
import {
  listVehicles,
  searchVehicles,
} from "../controllers/vehicle.controller.js";

const router = Router();

router.get("/", listVehicles);
router.post("/search", searchVehicles);

export default router;

