const mongoose = require("mongoose");
Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: "email is required",
    unique: true,
  },
  creds: {
    type: [
      {
        appid: Schema.ObjectId,
        password: String,
        isFirstLogin: Boolean,
      },
    ],
    required: true,
  },

  name: {
    type: String,
    required: true,
  },
  phone: String,
  userName: {
    type: String,
  },

  roles: {
    type: [String],
    enums: ["company", "admin"],
    default: "company",
  },
  subscription: [Schema.ObjectId],
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("users", userSchema);
