import assert from "node:assert/strict";
import test from "node:test";
import { AiService } from "../src/services/ai.service.js";

test("AI service keeps the provider error as the application error cause", async () => {
  const providerError = Object.assign(new Error("Invalid request"), {
    status: 400,
    code: "invalid_request_error",
    param: "text.format.schema",
  });
  const client = {
    responses: {
      parse: async () => {
        throw providerError;
      },
    },
  };

  const service = new AiService(client);

  await assert.rejects(
    service.extractVehicleFilters("show SUVs"),
    (error) => {
      assert.equal(error.statusCode, 502);
      assert.equal(error.cause, providerError);
      return true;
    },
  );
});
