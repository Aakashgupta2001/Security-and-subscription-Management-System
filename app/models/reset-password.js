const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetPasswordSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.ObjectId,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    resetToken: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("resetpasswords", resetPasswordSchema);
