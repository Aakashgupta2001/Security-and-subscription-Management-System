const mongoose = require("mongoose");
Schema = mongoose.Schema;

const loginSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.ObjectId,
      required: "user is required",
      ref: "users",
    },
    app: { type: Schema.ObjectId, required: true, ref: "apps" },
    token: [{ type: String, required: true }],
    currentLogins: { type: Number, default: 0, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("logins", loginSchema);
