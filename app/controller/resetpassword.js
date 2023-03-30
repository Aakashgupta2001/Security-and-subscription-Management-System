const crypto = require("crypto");
const bcrypt = require("bcrypt");
const moment = require("moment");
const error = require("../middlewares/errorHandler");
const resetModel = require("../models/reset-password");

const userModel = require("../models/user");
const service = require("../service/mongoService");
const emailer = require("../../config/static/emailTemplates");

module.exports.resetPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const app = req.headers.appid;
    if (!app) throw new error.BadRequest("appid required");
    const user = await service.findOne(userModel, { email: email }); //checking if the email address sent by client is present in the db(valid)
    console.log(user);
    if (!user) {
      throw new error.ApplicationError("User not found");
    }
    await service.findOneAndHardDelete(resetModel, { email: user.email });
    let token = crypto.randomBytes(32).toString("hex");
    let hash = await bcrypt.hash(token, 10);
    let item = await service.create(resetModel, { email: user.email, resetToken: hash, app, expire: moment.utc().add(5146, "seconds") });
    req.email = emailer.forgotPassword(item.resetToken, user.name, [user.email], app);
    console.log(item);
    req.finals = "Forgot Password Email Sent Successfully";
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.storePassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const token = req.body.token;
    const app = req.headers.appid;
    console.log(app);
    if (!app) throw new error.BadRequest("appid required");

    let resetPassword = await service.findOne(resetModel, { email: email, app, status: 0 });
    if (!resetPassword) {
      throw new error.ApplicationError("Reset password token not found");
    }
    let tokenMatch = token == resetPassword.resetToken;
    if (!tokenMatch) {
      throw new error.ApplicationError("Incorrect token");
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    console.log(req.body.password, hash);
    let user = await service.findOne(userModel, { email: email });
    let password = user.creds.map((pass) => {
      if (pass.appid == app) return { password: hash, appid: app };
      return pass;
    });
    console.log(password);

    let updateUser = await service.update(userModel, { email: email }, { creds: password });
    if (!updateUser) {
      throw new error.ApplicationError("Error while updating user in db");
    }
    const a = await service.increase(resetModel, { _id: resetPassword._id }, { $inc: { status: 1 } });
    console.log(a);
    // req.email = emailer.passwordUpdated(updateUser.name, [email]);
    req.finals = "Password Updated Successfully";
    next();
  } catch (err) {
    next(err);
  }
};
