const mongoose = require("mongoose");
Schema = mongoose.Schema;

const appSchema = new mongoose.Schema({
  appCode: {
    type: String,
    required: "email is required",
    unique: true,
  },
  appName: {
    type: String,
    required: "App name is requred",
  },
  subscriptionDet: {
    type: [
      {
        duration: { type: String, required: true, enum: ["1 Month", "3 Month", "6 Month", "1 Year"] },
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
