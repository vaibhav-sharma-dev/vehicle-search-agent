import { app } from "./app.js";
import { sequelize } from "./config/database.js";
import { env } from "./config/env.js";
import { seedVehiclesIfEmpty } from "./database/seed.js";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    const vehicleCount = await seedVehiclesIfEmpty();

    app.listen(env.port, () => {
      console.log(`API running at http://localhost:${env.port}`);
      console.log(`Vehicle catalogue contains ${vehicleCount} records.`);
    });
  } catch (error) {
    console.error("Could not start the server:", error.message);
    process.exit(1);
  }
};

startServer();

