const { BAD_REQUEST } = require('../utils/constants');

module.exports = class ErrrorBadRequest extends Error {
  constructor(message) {
    super(message);
    this.status = BAD_REQUEST;
  }
};
