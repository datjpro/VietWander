export class HttpError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function notFound(message, details) {
  return new HttpError(404, message, details);
}

export function badRequest(message, details) {
  return new HttpError(400, message, details);
}
