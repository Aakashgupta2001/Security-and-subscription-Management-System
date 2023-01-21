const appModel = require("../models/apps");
const mongoService = require("../service/mongoService");
const { responseHandler } = require("../middlewares/response-handler");
const errorHandler = require("../middlewares/errorHandler");
const helper = require("../middlewares/helper");

exports.create = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.appName || !body.subscriptionDet) throw new errorHandler.BadRequest("Bad Request");
    body["appCode"] = await helper.generateRandomString("App", appModel);
    const app = await mongoService.create(appModel, body);
    return responseHandler(app, res);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    let filter = {};
    let params = req.query;
    let queryFilter = req.query.filter ? JSON.parse(req.query.filter) : {};

    if (params.search) {
      filter = {
        ...filter,
        $or: [{ appCode: { $regex: params.search, $options: "i" } }, { appName: { $regex: params.search, $options: "i" } }],
      };
    }
    let pagination = { skip: 0, limit: 30 };
    if (queryFilter.pageNo && queryFilter.pageSize) {
      pagination.skip = (queryFilter.pageNo - 1) * queryFilter.pageSize;
      pagination.limit = queryFilter.pageSize;
    }

    const users = await mongoService.find(appModel, filter, {}, pagination);
    responseHandler(users, res);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    const app = await mongoService.update(appModel, filter, req.body);
    return responseHandler(app, res);
  } catch (err) {
    next(err);
  }
};
