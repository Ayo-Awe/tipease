import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "../../errors/httpErrors";
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from "jsonwebtoken";
import client from "../../db";

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    // Authenticate via bearer token or cookies
    const authHeader = req.headers.authorization;
    const sessionToken = req.cookies["__session"];

    if (!authHeader && !sessionToken) {
      return next(new Unauthorized("Missing auth token", "MISSING_AUTH_TOKEN"));
    }

    let payload: JwtPayload | undefined;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      if (!token) {
        return next(new Unauthorized("Missing Auth header", "MALFORMED_TOKEN"));
      }

      payload = jwt.verify(
        token,
        process.env.CLERK_PEM_PUBLIC_KEY
      ) as JwtPayload;
    } else {
      payload = jwt.verify(
        sessionToken,
        process.env.CLERK_PEM_PUBLIC_KEY
      ) as JwtPayload;
    }

    const user = await client.user.findFirst({
      where: { clerkId: payload.sub }, // sub is user's clerk id
    });

    if (!user) {
      return next(
        new Unauthorized(
          "User with this token no longer exists",
          "INVALID_TOKEN"
        )
      );
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      next(new Unauthorized("Token expired", "EXPIRED_TOKEN"));
    } else if (error instanceof JsonWebTokenError) {
      next(new Unauthorized("Token invalid", "INVALID_TOKEN"));
    } else {
      next(error);
    }
  }
}
