import { aiService } from "./ai.service.js";
import { vehicleRepository } from "../repositories/vehicle.repository.js";

export class VehicleService {
  constructor(ai = aiService, repository = vehicleRepository) {
    this.ai = ai;
    this.repository = repository;
  }

  async getCatalogue() {
    return this.repository.findAll();
  }

  async search(query) {
    const filters = await this.ai.extractVehicleFilters(query);
    const vehicles = await this.repository.findByFilters(filters);

    return { filters, vehicles };
  }
}

export const vehicleService = new VehicleService();

