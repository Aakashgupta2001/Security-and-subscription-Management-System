const jwt = require("jsonwebtoken");
const error = require("../middlewares/errorHandler");
const loginModel = require("../models/logins");
const subscriptionModel = require("../models/subscription");
const userModel = require("../models/user");
const service = require("../service/mongoService");
const { responseHandler } = require("./response-handler");

module.exports.verifyToken = async function (req, res, next) {
  //get the token from the header if present
  token = req.headers.authorization;

  //if no token found, return response (without going to the next middelware)
  try {
    if (!token) {
      throw new error.Unauthorized("Unauthorized");
    }
    if (!req.headers.appid) {
      throw new error.Unauthorized("Unauthorized");
    }

    if (token.includes("Bearer")) {
      token = token.substr(7);
    }
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const login = await service.findOne(loginModel, { app: req.headers.appid, user: decoded._id });
    if (!login) {
      throw new error.Unauthorized("Unauthorized");
    }
    let verified = false;
    login.token.forEach((element) => {
      if (element === token) verified = true;
    });
    req.user = decoded;
    if (verified) {
      next();
    } else {
      throw new error.Unauthorized("Unauthorized");
    }
  } catch (ex) {
    console.log("token validation failed");
    next(ex);
  }
};

module.exports.subscriptionCheck = async (req, res, next) => {
  try {
    const subscription = await service.findOne(subscriptionModel, { app: req.headers.appid, user: req.user._id });
    if (!subscription) {
      throw new error.BadRequest("Subscription Expired");
    }
    const user = await service.findOne(userModel, { _id: req.user._id });
    const appCred = await user.creds.find((cred) => {
      if (cred.appid == req.headers.appid) return cred;
      return cred;
    });
    const response = { expiry: subscription.expiry, noExpiry: subscription.noExpiry, user: { ...req.user } };
    if (subscription.noExpiry && !appCred.isFirstLogin) {
      return responseHandler(response, res);
    }
    console.log(subscription);
    if (!subscription) throw new error.BadRequest("Subscription Expired");
    console.log(subscription.expiry < new Date());
    if (subscription.expiry < new Date()) {
      throw new error.BadRequest("Subscription Expired");
    }
    return responseHandler(response, res);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.isAdmin = function (req, res, next) {
  try {
    if (req.user.roles.indexOf("admin") !== -1) {
      next();
    } else {
      throw new error.Unauthorized("Unauthorized");
    }
  } catch (ex) {
    throw new error.BadRequest(ex);
  }
};
