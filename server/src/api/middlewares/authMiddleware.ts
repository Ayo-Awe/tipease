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
    const payload = checkAuth(req);

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
    console.log(error);
    if (error instanceof TokenExpiredError) {
      next(new Unauthorized("Token expired", "EXPIRED_TOKEN"));
    } else if (error instanceof JsonWebTokenError) {
      next(new Unauthorized("Token invalid", "INVALID_TOKEN"));
    } else {
      next(error);
    }
  }
}

/**
 * Checks if a request is authenticated and returns the decoded jwt otherwise
 * throws an error
 * @param req Request object
 * @returns payload
 */
function checkAuth(req: Request) {
  const authHeader = req.headers.authorization;
  const sessionToken = req.cookies["__session"];

  // Auth token was not via header or cookie
  if (!authHeader && !sessionToken) {
    throw new Unauthorized("Missing auth token", "MISSING_AUTH_TOKEN");
  }

  let payload: JwtPayload | undefined;

  if (authHeader) {
    // auth token was passed via header
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new Unauthorized("Missing Auth header", "MALFORMED_TOKEN");
    }

    payload = jwt.verify(token, process.env.CLERK_PEM_PUBLIC_KEY) as JwtPayload;
  } else {
    // auth token was passed via cookie
    payload = jwt.verify(
      sessionToken,
      process.env.CLERK_PEM_PUBLIC_KEY
    ) as JwtPayload;
  }

  return payload;
}
