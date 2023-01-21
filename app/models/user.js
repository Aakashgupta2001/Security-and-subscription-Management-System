const mongoose = require("mongoose");
Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: "email is required",
    unique: true,
  },
  password: {
    type: String,
    required: "password is required,",
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
