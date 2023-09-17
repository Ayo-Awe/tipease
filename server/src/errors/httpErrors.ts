export type ResourceNotFoundErrorCode =
  | "RESOURCE_NOT_FOUND"
  | "UNKNOWN_ENDPOINT";

export type BadRequestErrorCode =
  | "INVALID_REQUEST_PARAMETERS"
  | "MISSING_REQUIRED_FIELD"
  | "INVALID_JSON_FORMAT"
  | "EMAIL_ALREADY_VERIFIED"
  | "EMAIL_TOKEN_EXPIRED";

export type UnauthorizedErrorCode =
  | "EXPIRED_TOKEN"
  | "MISSING_AUTH_HEADER"
  | "MISSING_AUTH_TOKEN"
  | "MALFORMED_TOKEN"
  | "INVALID_TOKEN";

export type ForbiddenErrorCode =
  | "ACCESS_DENIED"
  | "INSUFFICIENT_PERMISSIONS"
  | "ACCOUNT_NOT_ACTIVATED";

export type ServerErrorCode =
  | "UNEXPECTED_ERROR"
  | "DATABASE_ERROR"
  | "THIRD_PARTY_API_FAILURE";

export type ConflictErrorCode = "EXISTING_USER_EMAIL" | "EXISTING_USER_PAGE";

export type UnprocessableErrorCode = "UNPROCESSABLE";

export type HttpErrorCode =
  | ResourceNotFoundErrorCode
  | BadRequestErrorCode
  | UnauthorizedErrorCode
  | ForbiddenErrorCode
  | ServerErrorCode
  | ConflictErrorCode
  | UnprocessableErrorCode;

export abstract class HttpError extends Error {
  errorCode: HttpErrorCode;
  statusCode: number;

  constructor(statusCode: number, message: string, errorCode: HttpErrorCode) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}

export class BadRequest extends HttpError {
  constructor(message: string, errorCode: BadRequestErrorCode) {
    super(400, message, errorCode);
  }
}

export class ResourceNotFound extends HttpError {
  constructor(message: string, errorCode: ResourceNotFoundErrorCode) {
    super(404, message, errorCode);
  }
}

export class Unauthorized extends HttpError {
  constructor(message: string, errorCode: UnauthorizedErrorCode) {
    super(401, message, errorCode);
  }
}
export class Unprocessable extends HttpError {
  constructor(message: string, errorCode: UnprocessableErrorCode) {
    super(422, message, errorCode);
  }
}

export class Forbidden extends HttpError {
  constructor(message: string, errorCode: ForbiddenErrorCode) {
    super(403, message, errorCode);
  }
}
export class Conflict extends HttpError {
  constructor(message: string, errorCode: ConflictErrorCode) {
    super(409, message, errorCode);
  }
}

export class ServerError extends HttpError {
  constructor(message: string, errorCode: ServerErrorCode) {
    super(500, message, errorCode);
  }
}
