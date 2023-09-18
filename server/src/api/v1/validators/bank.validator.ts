import { z } from "zod";
import { validateRequestBody } from "../../../utils/zodHelpers";

export function resolveBankValidator(payload: any) {
  const schema = z.object({
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
