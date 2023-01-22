const mongoose = require("mongoose");
Schema = mongoose.Schema;

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.ObjectId,
      required: "user is required",
    },
    app: { type: Schema.ObjectId, required: true },
    payments: [{ type: mongoose.Schema.ObjectId, ref: "payments" }],
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
