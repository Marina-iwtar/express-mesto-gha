const { FORBIDDEN } = require('../utils/constants');

module.exports = class ErrrorForbidden extends Error {
  constructor(message) {
    super(message);
    this.status = FORBIDDEN;
  }
};
