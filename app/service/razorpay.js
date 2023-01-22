const Razorpay = require("razorpay");
const error = require("../middlewares/errorHandler");
const crypto = require("crypto");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

module.exports.createOrder = async (amount, currency, receipt, notes) => {
  try {
    // const { amount, currency, receipt, notes } = req;
    const order = await razorpayInstance.orders.create({ amount: amount * 100, currency, receipt, notes });
    console.log(order);
    return order;
  } catch (err) {
    console.log(err);
    throw new error.ApplicationError(err);
  }
};

module.exports.verifyOrder = (order_id, payment_id, razorpay_signature) => {
  const key_secret = process.env.RAZORPAY_SECRET;

  let hmac = crypto.createHmac("sha256", key_secret);

  hmac.update(order_id + "|" + payment_id);

  const generated_signature = hmac.digest("hex");

  if (razorpay_signature === generated_signature) {
    return { success: true, message: "Payment has been verified" };
  } else return { success: false, message: "Payment verification failed" };
};
