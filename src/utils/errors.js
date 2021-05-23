const errors = {
  BAD_REQUEST: {
    status: "BAD_REQUEST",
    code: 400
  },
  UNAUTHORIZED: {
    status: "UNAUTHORIZED",
    code: 401
  },
  FORBIDDEN: {
    status: "FORBIDDEN",
    code: 403
  },
  NOT_FOUND: {
    status: "NOT_FOUND",
    code: 404
  },
  INTERNAL_SERVER_ERROR: {
    status: "INTERNAL_SERVER_ERROR",
    code: 500
  }
};

export class HTTPNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.code = errors.NOT_FOUND.code;
    this.status = errors.NOT_FOUND.status;
  }
}

export class HTTPBadRequestError extends Error {
  constructor(message) {
    super(message);
    this.code = errors.BAD_REQUEST.code;
    this.status = errors.BAD_REQUEST.status;
  }
}

export class HTTPForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.code = errors.FORBIDDEN.code;
    this.status = errors.FORBIDDEN.status;
  }
}

export class HTTPUnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.code = errors.UNAUTHORIZED.code;
    this.status = errors.UNAUTHORIZED.status;
  }
}

export class HTTPInternalServerError extends Error {
  constructor(message) {
    super(message);
    this.code = errors.UNAUTHORIZED.code;
    this.status = errors.UNAUTHORIZED.status;
  }
}
