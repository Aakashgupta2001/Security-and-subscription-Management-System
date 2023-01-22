const mongoose = require("mongoose");
Schema = mongoose.Schema;

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.ObjectId,
      required: "user is required",
    },
    receipt: String,
    app: { type: Schema.ObjectId, required: true },
    razorpayOrderID: {
      type: String,
    },
    paymentID: {
      type: String,
    },
    paymentComplete: {
      type: Boolean,
      default: false,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    subDuration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("payments", paymentSchema);
