const subscriptionModel = require("../models/subscription");
const appModel = require("../models/apps");
const paymentModel = require("../models/payments");
const userModel = require("../models/user");
const mongoService = require("../service/mongoService");
const { responseHandler } = require("../middlewares/response-handler");
const errorHandler = require("../middlewares/errorHandler");
const razorpay = require("../service/razorpay");
const { v4: uuidv4 } = require("uuid");

exports.newpayment = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.amount || !body.subDuration) throw new errorHandler.BadRequest("Bad Request");

    const existingPayment = await mongoService.findOne(paymentModel, { app: req.headers.appid, user: req.user._id, paymentComplete: true });
    if (existingPayment && existingPayment?.subDuration == -1) {
      throw new errorHandler.BadRequest("Payment Already Completed");
    }

    body["user"] = req.user._id;
    body["app"] = req.headers.appid;
    console.log("body ===> ", body);
    const app = await mongoService.findOne(appModel, { _id: body.app });
    if (!app) throw new errorHandler.BadRequest("Bad Request");
    let appSubInfo = await app.subscriptionDet.find((sub) => {
      if (sub.duration == req.body.subDuration) {
        return sub;
      }
    });
    if (!appSubInfo) {
      throw new errorHandler.BadRequest("Subscription Duration MisMatch");
    }
    if (+appSubInfo.price !== +body.amount) throw new errorHandler.BadRequest("Amount MisMatch");
    console.log(appSubInfo);
    const order = await razorpay.createOrder(appSubInfo.price, "INR", uuidv4(), {});
    body.razorpayOrderID = order.id;
    body.receipt = order.receipt;
    body.amount = appSubInfo.price;
    if (app.trialPeriod == -1) {
      body.subDuration = -1;
    }
    const payment = await mongoService.create(paymentModel, body);
    return responseHandler(payment, res);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const { razorpayOrderID, paymentID } = req.body;
    const razorpay_signature = req.headers["x-razorpay-signature"];

    //verify payment
    const verify = await razorpay.verifyOrder(razorpayOrderID, paymentID, razorpay_signature);
    if (!verify.success) {
      return res.status(400).json({
        error: `Your payment failed. \n err: ${verify.message}`,
      });
    }

    let filter = { user: req.user._id, razorpayOrderID: razorpayOrderID };
    let set = {};
    set["paymentID"] = paymentID;
    const payments = await mongoService.update(paymentModel, filter, set);

    if (payments.paymentComplete) throw new errorHandler.BadRequest("Subscription Already Added");

    payments["paymentComplete"] = true;
    payments.save();

    let subscription = await mongoService.findOne(subscriptionModel, { user: req.user._id, app: req.headers.appid });

    if (subscription) {
      subscription.payments.push(payments._id);
      subscription.expiry = subscription.expiry.setMonth(subscription.expiry.getMonth() + +payments.subDuration);
      if (payments.subDuration == -1) {
        subscription.noExpiry = true;
      }
      subscription = await mongoService.update(subscriptionModel, { user: req.user._id, app: req.headers.appid }, subscription);
    } else {
      let today = new Date();
      const subscriptionBody = {
        user: req.user._id,
        app: req.headers.appid,
        payments: payments._id,
        expiry: new Date(today.setMonth(today.getMonth() + +payments.subDuration)),
      };
      if (payments.subDuration == -1) {
        subscriptionBody.noExpiry = true;
      }
      subscription = await mongoService.create(subscriptionModel, subscriptionBody);
    }

    responseHandler(subscription, res);

    const user = await mongoService.findOne(userModel, { _id: req.user._id });
    user.creds = await user.creds.map((cred) => {
      if (cred.appid == req.headers.appid) return { ...cred, isFirstLogin: false };
      return cred;
    });
    console.log(user.creds);
    user.save();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
