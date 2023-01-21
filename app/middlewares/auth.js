const jwt = require("jsonwebtoken");
const error = require("../middlewares/errorHandler");

module.exports.verifyToken = function (req, res, next) {
  //get the token from the header if present
  token = req.headers.authorization;
  //if no token found, return response (without going to the next middelware)
  if (!token) {
    throw new error.Unauthorized("Unauthorzied");
  }
  try {
    if (token.includes("Bearer")) {
      token = token.substr(7);
    }
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    throw new error.Unauthorized(ex);
  }
};

module.exports.isAdmin = function (req, res, next) {
  try {
    if (req.user.roles.indexOf("admin") !== -1) {
      next();
    } else {
      throw new error.Unauthorized("Unauthorzied");
    }
  } catch (ex) {
    throw new error.BadRequest(ex);
  }
};
