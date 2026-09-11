import { AppError } from "../errors/app-error.js";
import { vehicleService } from "../services/vehicle.service.js";
import { asyncHandler } from "../utils/async-handler.js";

const validateQuery = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError("query is required and must be a non-empty string", 400);
  }

  const query = value.trim();
  if (query.length > 500) {
    throw new AppError("query must be 500 characters or fewer", 400);
  }

  return query;
};

export const listVehicles = asyncHandler(async (req, res) => {
  const vehicles = await vehicleService.getCatalogue();

  return res.success({
    message: "Vehicle catalogue fetched",
    data: vehicles,
    meta: { count: vehicles.length },
  });
});

export const searchVehicles = asyncHandler(async (req, res) => {
  const query = validateQuery(req.body?.query);
  const { filters, vehicles } = await vehicleService.search(query);

  return res.success({
    message: vehicles.length
      ? "Matching vehicles found"
      : "No vehicles matched your search",
    data: vehicles,
    meta: {
      count: vehicles.length,
      query,
      filters,
    },
  });
});

