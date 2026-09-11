import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import {
  BODY_TYPES,
  FUEL_TYPES,
  TRANSMISSIONS,
} from "../constants/vehicle.constants.js";

const SearchFiltersSchema = z.object({
  bodyType: z.enum(BODY_TYPES).nullable(),
  fuelType: z.enum(FUEL_TYPES).nullable(),
  transmission: z.enum(TRANSMISSIONS).nullable(),
  brand: z.string().nullable(),
  model: z.string().nullable(),
  minPriceLakh: z.number().nonnegative().nullable(),
  maxPriceLakh: z.number().positive().nullable(),
  maxKilometersDriven: z.number().int().nonnegative().nullable(),
  minMileageKmpl: z.number().nonnegative().nullable(),
  minYear: z.number().int().min(1990).nullable(),
  seats: z.number().int().positive().nullable(),
  sortBy: z.enum([
    "relevance",
    "price_asc",
    "price_desc",
    "year_desc",
    "kilometers_asc",
  ]),
});

const FILTER_INSTRUCTIONS = `
Convert an Indian used-vehicle search into catalogue filters.

Rules:
- Prices are in lakh rupees. "15 lakh" means 15, not 1500000.
- kilometersDriven is the odometer reading. Convert "80k km" or "80 thousand km" to 80000.
- In a used-car query, treat a bare shorthand such as "below 80 km" as 80000 km. Numbers of 1000 or more remain literal.
- mileageKmpl means fuel efficiency. Only use minMileageKmpl for phrases such as "at least 20 kmpl" or "good mileage above 20".
- Automatic includes requests for automatic, AMT, CVT, DCT, or torque converter.
- Keep a field null when the user did not specify it.
- Use relevance for sortBy unless the user asks for cheapest, newest, least driven, or most expensive.
- Do not invent preferences.
`;

export class AiService {
  constructor(client = null) {
    this.client = client;
  }

  getClient() {
    if (this.client) return this.client;

    if (!env.openAiApiKey) {
      throw new AppError(
        "OpenAI API key is not configured. Add OPENAI_API_KEY to backend/.env.",
        503,
      );
    }

    this.client = new OpenAI({ apiKey: env.openAiApiKey });

    return this.client;
  }

  async extractVehicleFilters(query) {
    try {
      const response = await this.getClient().responses.parse({
        model: env.openAiModel,
        reasoning: { effort: "low" },
        input: [
          { role: "system", content: FILTER_INSTRUCTIONS },
          { role: "user", content: query },
        ],
        text: {
          format: zodTextFormat(SearchFiltersSchema, "vehicle_search_filters"),
        },
      });

      if (!response.output_parsed) {
        throw new AppError("The search request could not be understood.", 422);
      }

      return response.output_parsed;
    } catch (error) {
      if (error instanceof AppError) throw error;

      let statusCode = 502;
      let message = "The AI search service is temporarily unavailable.";

      if (error.status === 401 || error.status === 403) {
        statusCode = 503;
        message = "The configured OpenAI API credentials are invalid or unauthorized.";
      } else if (error.status === 429) {
        statusCode = 429;
        message = "The AI search service rate limit was reached. Please try again shortly.";
      }

      const details =
        env.nodeEnv === "development"
          ? {
              provider: "OpenAI",
              status: error.status,
              code: error.code,
              param: error.param,
              reason: error.message,
            }
          : undefined;

      throw new AppError(message, statusCode, details, error);
    }
  }
}

export const aiService = new AiService();
