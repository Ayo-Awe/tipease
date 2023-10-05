import { z } from "zod";
import { validateRequestBody } from "../../../utils/zodHelpers";

export function createTipValidator(payload: any) {
  const schema = z.object({
    reference: z
      .string({
        invalid_type_error: "Reference must be a string",
        required_error: "Reference is required",
      })
      .min(10, "Reference must be at least 10 characters"),
    email: z
      .string({
        invalid_type_error: "Email must be a string",
        required_error: "Email is required",
      })
      .email("Please provide a valid email"),
    tokenCount: z
      .number({
        invalid_type_error: "Token count must be a number",
        required_error: "Token count is required",
      })
      .positive("Token count must be positive")
      .int("Token count must be an integer")
      .min(1, "Token count must be greater than 0"),
    message: z
      .string({
        invalid_type_error: "Message must be a string",
      })
      .optional(),
    redirectUrl: z
      .string({
        invalid_type_error: "Redirect url must be a string",
      })
      .url("Redirect url must be a valid url")
      .optional(),
  });

  return validateRequestBody(schema, payload);
}
