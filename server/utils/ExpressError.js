class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message); // pass the message to the base Error
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
