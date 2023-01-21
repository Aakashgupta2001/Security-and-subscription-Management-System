const userModel = require("../models/user");
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
    if (existingUser) {
      throw new errorHandler.BadRequest("User already exist");
    }
    let body = req.body;
    if (body.name && !body.userName) {
      body.userName = body.name;
    }
    11;
    if (!body.password || body.password.length < 5) {
      return res.status(406).send("Password required");
    }
    body.email = body.email.toLowerCase();

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(body.password, salt);
    body.password = hashPassword;

    const user = await service.create(userModel, body);
    let returnBody = {
      email: user.email,
      name: user.name,
      role: user.roles,
    };
    return responseHandler(returnBody, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      throw new errorHandler.BadRequest("error bad request");
    }
    const filter = {
      email: req.body.email.toLowerCase(),
    };
    const user = await service.findOne(userModel, filter);
    if (!user) {
      throw new errorHandler.BadRequest("User does not exist");
    }

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      throw new errorHandler.BadRequest("Incorrect Password");
    }
    const token = await jwt.sign({ name: user.name, roles: user.roles, email: user.email, _id: user._id }, process.env.SECRET_KEY);
    responseHandler(
      {
        token: token,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      res,
      "Signin Successful"
    );
  } catch (err) {
    next(err);
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
