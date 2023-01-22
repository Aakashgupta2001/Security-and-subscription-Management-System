const subscriptionModel = require("../models/subscription");
const appModel = require("../models/apps");
const paymentModel = require("../models/payments");
const mongoService = require("../service/mongoService");
const { responseHandler } = require("../middlewares/response-handler");
const errorHandler = require("../middlewares/errorHandler");
const razorpay = require("../service/razorpay");
const { v4: uuidv4 } = require("uuid");

exports.newpayment = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.amount || !body.subDuration) throw new errorHandler.BadRequest("Bad Request");

    body["user"] = req.user._id;
    body["app"] = req.headers.appid;
    const app = await mongoService.findOne(appModel, { _id: body.app });
    if (!app) throw new errorHandler.BadRequest("Bad Request");
    let appSubInfo = await app.subscriptionDet.find((sub) => {
      if (sub.duration == req.body.subDuration) {
        return sub;
      }
    });
    if (+appSubInfo.price !== +body.amount) throw new errorHandler.BadRequest("Amount MisMatch");
    console.log(appSubInfo);
    const order = await razorpay.createOrder(appSubInfo.price, "INR", uuidv4(), {});
    body.razorpayOrderID = order.id;
    body.receipt = order.receipt;
    body.amount = appSubInfo.price;
    const payment = await mongoService.create(paymentModel, body);
    return responseHandler(payment, res);
  } catch (err) {
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
      console.log(subscription.expiry);
      subscription = await mongoService.update(subscriptionModel, { user: req.user._id, app: req.headers.appid }, subscription);
    } else {
      let today = new Date();
      const subscriptionBody = {
        user: req.user._id,
        app: req.headers.appid,
        payments: payments._id,
        expiry: new Date(today.setMonth(today.getMonth() + +payments.subDuration)),
      };
      console.log(subscriptionBody);
      subscription = await mongoService.create(subscriptionModel, subscriptionBody);
    }

    return responseHandler(subscription, res);
  } catch (err) {
    next(err);
  }
};
