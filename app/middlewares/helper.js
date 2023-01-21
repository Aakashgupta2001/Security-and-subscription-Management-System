const userModel = require("../models/user");
const bcrypt = require("bcrypt");

exports.generateRandomString = async (prefix, model, filter = {}) => {
  let modelCount = (await model.count(filter)) + 1;
  let result = `${prefix}-${modelCount}`;
  return result;
};

exports.checkUserAndRole = async (userID, role) => {
  let user = await userModel.findOne({ _id: userID });
  if (!user) {
    return false;
  }
  if (user.roles.indexOf(role) == -1) {
    return false;
  }
  return true;
};

exports.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};
