import { HttpErrorCode } from "../errors/httpErrors";
import { envSchema } from "../env";
import { z } from "zod";
import type { User } from "@prisma/client";

declare global {
  namespace Express {
    export interface Response {
      ok(payload: any, meta?: any): Response;
      created(payload: any): Response;
      noContent(): Response;
      error(
        statusCode: number,
        message: string,
        errorCode: HttpErrorCode
      ): Response;
    }
    export interface Request {
      user?: User;
    }
  }
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
