import { sequelize } from "../config/database.js";
import { vehicleCatalogue } from "./catalogue.js";
import { Vehicle } from "../models/vehicle.model.js";

export const seedVehiclesIfEmpty = async () => {
  const count = await Vehicle.count();
  if (count > 0) return count;

  await Vehicle.bulkCreate(vehicleCatalogue);
  return vehicleCatalogue.length;
};

const runFromCommandLine = process.argv[1]?.endsWith("seed.js");

if (runFromCommandLine) {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    const count = await seedVehiclesIfEmpty();
    console.log(`Vehicle catalogue is ready (${count} vehicles).`);
  } catch (error) {
    console.error("Could not seed the vehicle catalogue:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

