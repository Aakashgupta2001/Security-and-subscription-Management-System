const userModel = require("../models/user");
const loginModel = require("../models/logins");
const appModel = require("../models/apps");
const subscriptionModel = require("../models/subscription");
const service = require("../service/mongoService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { responseHandler } = require("../middlewares/response-handler");
const errorHandler = require("../middlewares/errorHandler");

const helpers = require("../middlewares/helper");

exports.signup = async (req, res, next) => {
  try {
    const existingUser = await service.findOne(userModel, {
      email: req.body.email,
    });
    if (!req.headers.appid) return res.status(406).send("App Required");
    const appId = req.headers.appid;
    const app = await service.findOne(appModel, { _id: appId });
    if (!app) {
      throw new errorHandler.BadRequest("Invalid App");
    }
    if (
      existingUser &&
      existingUser.creds.find((cred) => {
        if (cred.appid == appId) return true;
      })
    ) {
      throw new errorHandler.BadRequest("User already exist");
    }

    let body = req.body;
    if (body.name && !body.userName) {
      body.userName = body.name;
    }

    if (!body.password || body.password.length < 5) {
      return res.status(406).send("Password required");
    }

    body.email = body.email.toLowerCase();

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(body.password, salt);
    delete body.password;
    let user;
    if (existingUser) {
      existingUser.creds.push({
        appid: appId,
        password: hashPassword,
        isFirstLogin: true,
      });
      body["creds"] = existingUser.creds;
      console.log(body);
      user = await service.update(userModel, { _id: existingUser._id }, body);
      let returnBody = {
        email: user.email,
        name: user.name,
        role: user.roles,
      };
      responseHandler(returnBody, res);
    } else {
      body["creds"] = [
        {
          appid: appId,
          password: hashPassword,
          isFirstLogin: true,
        },
      ];
      user = await service.create(userModel, body);
      let returnBody = {
        email: user.email,
        name: user.name,
        role: user.roles,
      };
      responseHandler(returnBody, res);
    }
    console.log("sadasondason");
    let today = new Date();
    if (app.trialPeriod > 0) {
      const subscriptionBody = {
        user: user._id,
        app: appId,
        expiry: today.setMonth(today.getMonth() + +app.trialPeriod),
      };
      let subscription = await service.create(subscriptionModel, subscriptionBody);
      console.log(subscription);
    }
    // else if (app.trialPeriod == -1) {
    //   const subscriptionBody = {
    //     user: user._id,
    //     app: appId,
    //     expiry: today.setMonth(today.getMonth() + +app.trialPeriod),
    //     noExpiry: true,
    //   };
    //   let subscription = await service.create(subscriptionModel, subscriptionBody);
    //   console.log(subscription);
    // }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    if (!req.body || !req.body.email || !req.body.password || !req.headers.appid) {
      throw new errorHandler.BadRequest("error bad request");
    }
    const filter = {
      email: req.body.email.toLowerCase(),
    };
    const user = await service.findOne(userModel, filter);
    if (!user) {
      throw new errorHandler.BadRequest("User does not exist");
    }
    const userCreds = await user.creds.find((cred) => cred.appid == req.headers.appid);
    if (!userCreds) throw new errorHandler.BadRequest("User does not exist");

    const result = await bcrypt.compare(req.body.password, userCreds.password);
    if (!result) {
      throw new errorHandler.BadRequest("Incorrect Password");
    }

    const logins = await service.findOne(loginModel, { user: user.id, app: req.headers.appid }, {}, "app");
    console.log(userCreds.isFirstLogin, userCreds);
    console.log(logins);

    if (!logins) {
      const app = await service.findOne(appModel, { _id: req.headers.appid });
      if (!app) throw new errorHandler.BadRequest("app not found");
      const token = await jwt.sign({ name: user.name, roles: user.roles, email: user.email, _id: user._id }, process.env.SECRET_KEY);
      const body = {
        user: user._id,
        app: req.headers.appid,
        token: [token],
        currentLogins: 1,
      };
      await service.create(loginModel, body);

      return responseHandler(
        {
          id: user._id,
          token: token,
          name: user.name,
          email: user.email,
          isFirstLogin: userCreds.isFirstLogin,
          roles: user.roles,
        },
        res,
        "Signin Successful"
      );
    } else if (logins.currentLogins >= logins.app.maxLogins) {
      logins.currentLogins = 1;

      const token = await jwt.sign({ name: user.name, roles: user.roles, email: user.email, _id: user._id }, process.env.SECRET_KEY);
      logins.token = [token];
      logins.save();
      return responseHandler(
        {
          id: user._id,
          token: token,
          name: user.name,
          email: user.email,
          isFirstLogin: userCreds.isFirstLogin,
          roles: user.roles,
        },
        res,
        "Signin Successful (Logged out of all other devices)"
      );
    } else {
      logins.currentLogins += 1;
      const token = await jwt.sign({ name: user.name, roles: user.roles, email: user.email, _id: user._id }, process.env.SECRET_KEY);
      logins.token.push(token);
      logins.save();
      return responseHandler(
        {
          id: user._id,
          token: token,
          name: user.name,
          email: user.email,
          isFirstLogin: userCreds.isFirstLogin,
          roles: user.roles,
        },
        res,
        "Signin Successful"
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.verifyPassword = async (req, res, next) => {
  try {
    if (!req.body || !req.body.password || !req.headers.appid) {
      throw new errorHandler.BadRequest("error bad request");
    }
    const filter = {
      _id: req.user._id,
    };
    const user = await service.findOne(userModel, filter);
    if (!user) {
      throw new errorHandler.BadRequest("User does not exist");
    }
    const userCreds = await user.creds.find((cred) => cred.appid == req.headers.appid);
    if (!userCreds) throw new errorHandler.BadRequest("User does not exist");

    const result = await bcrypt.compare(req.body.password, userCreds.password);
    if (!result) {
      throw new errorHandler.BadRequest("Incorrect Password");
    }
    return responseHandler(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      res,
      "Password Validated"
    );
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const user = req.body.user;
    const logins = await service.findOne(loginModel, { user: user.id, app: req.headers.appid });
    const newTokens = logins.token.filter((x) => x !== user.token);
    const newLogin = await service.update(
      loginModel,
      { user: user.id, app: req.headers.appid },
      { token: newTokens, currentLogins: logins.currentLogins - 1 }
    );
    return responseHandler(newLogin, res);
  } catch (error) {
    next(error);
  }
};

exports.getUserListBasedOnRole = async (req, res, next) => {
  try {
    let filter = {};
    let params = req.query;
    let queryFilter = req.query.filter ? JSON.parse(req.query.filter) : {};

    let role = Array.isArray(req.body.role) ? req.body.role : [req.body.role];
    if (req.body.role) {
      filter["roles"] = { $in: role };
    }

    if (params.search) {
      filter = {
        ...filter,
        $or: [
          { name: { $regex: params.search, $options: "i" } },
          { email: { $regex: params.search, $options: "i" } },
          { phone: { $regex: params.search, $options: "i" } },
        ],
      };
    }

    console.log(filter);
    let pagination = { skip: 0, limit: 30 };
    if (queryFilter.pageNo && queryFilter.pageSize) {
      pagination.skip = (queryFilter.pageNo - 1) * queryFilter.pageSize;
      pagination.limit = queryFilter.pageSize;
    }
    const users = await service.find(userModel, filter, { password: 0 }, pagination);
    responseHandler(users, res);
  } catch (err) {
    next(err);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    let set = { roles: req.body.role };
    const users = await service.findOneAndUpdate(userModel, { _id: req.params.id }, { $set: set });
    responseHandler(users, res);
  } catch (error) {
    next(error);
  }
};
