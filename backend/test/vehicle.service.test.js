import assert from "node:assert/strict";
import test from "node:test";
import { VehicleService } from "../src/services/vehicle.service.js";

test("search converts the query to filters before querying the repository", async () => {
  const filters = {
    bodyType: "SUV",
    fuelType: null,
    transmission: null,
    brand: null,
    model: null,
    minPriceLakh: null,
    maxPriceLakh: 15,
    maxKilometersDriven: null,
    minMileageKmpl: null,
    minYear: null,
    seats: null,
    sortBy: "relevance",
  };

  const ai = {
    extractVehicleFilters: async (query) => {
      assert.equal(query, "show SUVs under 15 lakh");
      return filters;
    },
  };
  const repository = {
    findByFilters: async (receivedFilters) => {
      assert.deepEqual(receivedFilters, filters);
      return [{ id: "vehicle-1" }];
    },
  };

  const service = new VehicleService(ai, repository);
  const result = await service.search("show SUVs under 15 lakh");

  assert.deepEqual(result, {
    filters,
    vehicles: [{ id: "vehicle-1" }],
  });
});

