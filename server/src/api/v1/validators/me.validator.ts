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
  });

  return validateRequestBody(schema, payload);
}

export function editPageStatus(payload: any) {
  const schema = z.object({
    status: z.enum(["enabled", "disabled"]),
  });
  return validateRequestBody(schema, payload);
}

export function editPage(payload: any) {
  const schema = z.object({
    slug: z
      .string({
        invalid_type_error: "Slug must be a string",
      })
      .optional(),
    pricePerToken: z.coerce
      .number({
        invalid_type_error: "Price per token must be a number",
      })
      .int("Price per token must be an integer")
      .min(1, "Price per token must be greater than zero")
      .optional(),
    tipCurrencyId: z.coerce
      .number({
        invalid_type_error: "Please provide a valid tip currency id",
      })
      .int("Please provide a valid tip currency id")
      .positive()
      .optional(),
  });

  return validateRequestBody(schema, payload);
}

export function createPageValidator(payload: any) {
  const schema = z.object({
    slug: z.string({
      invalid_type_error: "Slug must be a string",
      required_error: "Slug is required",
    }),
    pricePerToken: z.coerce
      .number({
        invalid_type_error: "Price per token must be a number",
        required_error: "Price per token is required",
      })
      .int("Price per token must be an integer")
      .min(1, "Price per token must be greater than zero"),
    tipCurrencyId: z.coerce
      .number({
        required_error: "Tip currency id is required",
        invalid_type_error: "Please provide a valid tip currency id",
      })
      .int("Please provide a valid tip currency id")
      .positive(),
  });

  return validateRequestBody(schema, payload);
}
