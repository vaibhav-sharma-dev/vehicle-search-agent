import { Op } from "sequelize";
import { Vehicle } from "../models/vehicle.model.js";

const sortMap = {
  relevance: [["priceLakh", "ASC"]],
  price_asc: [["priceLakh", "ASC"]],
  price_desc: [["priceLakh", "DESC"]],
  year_desc: [["year", "DESC"]],
  kilometers_asc: [["kilometersDriven", "ASC"]],
};

export class VehicleRepository {
  async findAll() {
    return Vehicle.findAll({ order: [["brand", "ASC"], ["model", "ASC"]] });
  }

  async findByFilters(filters) {
    const where = {};

    if (filters.bodyType) where.bodyType = filters.bodyType;
    if (filters.fuelType) where.fuelType = filters.fuelType;
    if (filters.transmission) where.transmission = filters.transmission;
    if (filters.seats) where.seats = filters.seats;

    if (filters.brand) {
      where.brand = { [Op.iLike]: `%${filters.brand}%` };
    }

    if (filters.model) {
      where.model = { [Op.iLike]: `%${filters.model}%` };
    }

    if (filters.minPriceLakh !== null || filters.maxPriceLakh !== null) {
      where.priceLakh = {};
      if (filters.minPriceLakh !== null) {
        where.priceLakh[Op.gte] = filters.minPriceLakh;
      }
      if (filters.maxPriceLakh !== null) {
        where.priceLakh[Op.lte] = filters.maxPriceLakh;
      }
    }

    if (filters.maxKilometersDriven !== null) {
      where.kilometersDriven = { [Op.lte]: filters.maxKilometersDriven };
    }

    if (filters.minMileageKmpl !== null) {
      where.mileageKmpl = { [Op.gte]: filters.minMileageKmpl };
    }

    if (filters.minYear !== null) {
      where.year = { [Op.gte]: filters.minYear };
    }

    return Vehicle.findAll({
      where,
      order: sortMap[filters.sortBy] || sortMap.relevance,
      limit: 50,
    });
  }
}

export const vehicleRepository = new VehicleRepository();

