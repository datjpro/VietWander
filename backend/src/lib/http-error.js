export class HttpError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function badRequest(message, details) {
  return new HttpError(400, message, details);
}

export function unauthorized(message = 'Chưa xác thực.', details) {
  return new HttpError(401, message, details);
}

export function forbidden(message = 'Bạn không có quyền thực hiện thao tác này.', details) {
  return new HttpError(403, message, details);
}

export function notFound(message, details) {
  return new HttpError(404, message, details);
}
