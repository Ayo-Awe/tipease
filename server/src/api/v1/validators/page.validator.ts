import { z } from "zod";
import { validateRequestBody } from "../../../utils/zodHelpers";

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
    bio: z
      .string({
        invalid_type_error: "Bio must be a string",
        required_error: "Bio is required",
      })
      .optional(),
    websiteUrl: z
      .string({
        invalid_type_error: "Website url must be a string",
        required_error: "Website url is required",
      })
      .url("Website url must be a valid url")
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
    bio: z.string({
      invalid_type_error: "Bio must be a string",
      required_error: "Bio is required",
    }),
    websiteUrl: z
      .string({
        invalid_type_error: "Website url must be a string",
        required_error: "Website url is required",
      })
      .url("Website url must be a valid url")
      .optional(),
  });
  return validateRequestBody(schema, payload);
}
