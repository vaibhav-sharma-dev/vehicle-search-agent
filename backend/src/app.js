import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import { responseMiddleware } from "./middlewares/response.middleware.js";
import apiRoutes from "./routes/index.js";

export const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: env.frontendUrl }));
app.use(express.json({ limit: "20kb" }));
app.use(responseMiddleware);

app.use("/api/v1", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

