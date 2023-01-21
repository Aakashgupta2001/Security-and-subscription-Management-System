const mongoose = require("mongoose");
Schema = mongoose.Schema;

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.ObjectId,
      required: "user is required",
    },
    app: Schema.ObjectId,
    payments: [
      {
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
        date: Date,
      },
    ],
    expiry: {
      type: Date,
      required: "expiry date is required",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("subscriptions", subscriptionSchema);
