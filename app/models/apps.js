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
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("apps", appSchema);
