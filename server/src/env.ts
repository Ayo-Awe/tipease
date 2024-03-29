import { ZodError, z } from "zod";

export const envSchema = z.object({
  PORT: z.string().optional(),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_PEM_PUBLIC_KEY: z.string(),
  SPACES_KEY: z.string(),
  SPACES_SECRET: z.string(),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string(),
  SPACES_CDN_ENDPOINT: z.string(),
  PAYSTACK_SECRET: z.string(),
  MAILGUN_API_KEY: z.string(),
  MAILGUN_DOMAIN: z.string(),
  MAILGUN_SENDER_EMAIL: z.string().email(),
});

try {
  envSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    const missingEnvs = error.errors
      .map((e) => e.path)
      .reduce((acc, v) => acc.concat(v), [])
      .join("\n");

    console.error(`Missing or invalid environment variables: \n${missingEnvs}`);

    process.exit(1);
  }
}
