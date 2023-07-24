const OK = 200;
const CREATE = 201;
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const CONFLICT = 409;
const INTERNAL_SERVER_ERROR = 500;
const regexLink = /(?:https?):\/\/(w{3}\.)?\w+([.|-]{1}\w+)*\.[0-9a-zA-Z-]+(\/[\w\-.~:/?#[\]@!$&'()*+,;=]*#?)?/;
module.exports = {
  OK,
  CREATE,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
  FORBIDDEN,
  regexLink,
};
