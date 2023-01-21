class GeneralError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }

  getCode() {
    if (this instanceof BadRequest) {
      return 400;
    }
    if (this instanceof NotFound) {
      return 404;
    }
    if (this instanceof Unauthorized) {
      return 401;
    }
    if (this instanceof ApplicationError) {
      return 400;
    }
    if (this instanceof InsufficientAccessError) {
      return 403;
    }
    return 400;
  }
}

class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}
class Unauthorized extends GeneralError {}
class ApplicationError extends GeneralError {}
class InsufficientAccessError extends GeneralError {}

const useErrorHandler = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(400).json({
    status: "error",
    message: err.message,
  });
};

module.exports = {
  GeneralError,
  BadRequest,
  NotFound,
  Unauthorized,
  ApplicationError,
  InsufficientAccessError,
  useErrorHandler,
};

process.on("uncaughtException", (err) => {
  console.log(err);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
});
