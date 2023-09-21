import { z } from "zod";
import { validateRequestBody } from "../../../utils/zodHelpers";

export function editProfileValidator(payload: any) {
  const schema = z.object({
    firstName: z
      .string({ invalid_type_error: "First name must be a string" })
      .optional(),
    lastName: z
      .string({ invalid_type_error: "Last name must be a string" })
      .optional(),
    pricePerToken: z
      .number({
        invalid_type_error: "Price per token must be a number",
      })
      .int("Price per token must be an integer")
      .positive("Price per token must be positive")
      .optional(),
  });

  return validateRequestBody(schema, payload);
}

export function connectBankValidator(payload: any) {
  const schema = z.object({
    currency: z
      .string({
        invalid_type_error: "currency must be a string",
        required_error: "currency is required",
      })
      .toLowerCase(),
    bankCode: z.string({
      invalid_type_error: "Bank code must be a string",
      required_error: "Bank code is required",
    }),
    accountNumber: z
      .string({
        invalid_type_error: "Account number must be a string",
        required_error: "Account number is required",
      })
      .min(6, "Account number must be at least 6 characters"),
  });

  return validateRequestBody(schema, payload);
}
