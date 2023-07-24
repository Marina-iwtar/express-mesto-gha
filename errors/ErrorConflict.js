const { CONFLICT } = require('../utils/constants');

module.exports = class ErrrorConflict extends Error {
  constructor(message) {
    super(message);
    this.status = CONFLICT;
  }
};
