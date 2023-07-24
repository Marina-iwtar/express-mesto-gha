const { UNAUTHORIZED } = require('../utils/constants');

module.exports = class ErrorUnauthorized extends Error {
  constructor(message) {
    super(message);
    this.status = UNAUTHORIZED;
  }
};
