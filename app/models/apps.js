const mongoose = require("mongoose");
Schema = mongoose.Schema;

const appSchema = new mongoose.Schema({
  appCode: {
    type: String,
    required: "appCode is required",
    unique: true,
  },
  maxLogins: {
    type: Number,
    required: true,
    default: 0,
  },
  appName: {
    type: String,
    required: "App name is requred",
  },
  trialPeriod: {
    Number,
  },
  subscriptionDet: {
    type: [
      {
        duration: { type: Number, required: true, enum: [-1, 1, 3, 6, 12] }, //months
        price: { type: Number, required: true },
      },
    ],
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("apps", appSchema);
