class ServerError extends Error { //custom error class
    constructor(message, httpStatus) {
      super(message);
      this.name = this.constructor.name;
      this.httpStatus = httpStatus;
      Error.captureStackTrace(this, this.constructor);
    }

    getMessage() {
      return this.message;
    }
  }
  
  module.exports = {
    ServerError,
  };