import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import {
  BODY_TYPES,
  FUEL_TYPES,
  TRANSMISSIONS,
} from "../constants/vehicle.constants.js";

export const Vehicle = sequelize.define(
  "Vehicle",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    brand: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    variant: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1990 },
    },
    priceLakh: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      field: "price_lakh",
    },
    bodyType: {
      type: DataTypes.ENUM(...BODY_TYPES),
      allowNull: false,
      field: "body_type",
    },
    fuelType: {
      type: DataTypes.ENUM(...FUEL_TYPES),
      allowNull: false,
      field: "fuel_type",
    },
    transmission: {
      type: DataTypes.ENUM(...TRANSMISSIONS),
      allowNull: false,
    },
    kilometersDriven: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "kilometers_driven",
      validate: { min: 0 },
    },
    mileageKmpl: {
      type: DataTypes.DECIMAL(5, 1),
      allowNull: true,
      field: "mileage_kmpl",
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
  },
  {
    tableName: "vehicles",
    indexes: [
      { fields: ["price_lakh"] },
      { fields: ["body_type"] },
      { fields: ["fuel_type", "transmission"] },
      { fields: ["kilometers_driven"] },
    ],
  },
);

