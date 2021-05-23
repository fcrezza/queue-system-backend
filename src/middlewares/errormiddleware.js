import {
  HTTPBadRequestError,
  HTTPForbiddenError,
  HTTPNotFoundError,
  HTTPUnauthorizedError,
  HTTPInternalServerError
} from "../utils/errors";

function errorMiddleware(error, request, response, next) {
  switch (error.constructor) {
    case HTTPNotFoundError:
    case HTTPBadRequestError:
    case HTTPForbiddenError:
    case HTTPUnauthorizedError:
    case HTTPInternalServerError: {
      response.status(error.code).json({
        error: {
          code: error.code,
          status: error.status,
          message: error.message
        }
      });
      break;
    }

    default:
      next(error);
  }
}

export default errorMiddleware;
