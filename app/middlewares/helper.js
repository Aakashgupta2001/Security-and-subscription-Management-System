const userModel = require("../models/user");
const bcrypt = require("bcrypt");

exports.generateRandomString = async (prefix, model) => {
  // let result = "",
  //   seeds;
  // for (let i = 0; i <= length - 1; i++) {
  //   //Generate seeds array, that will be the bag from where randomly select generated char
  //   seeds = [Math.floor(Math.random() * 10) + 48, Math.floor(Math.random() * 25) + 65, Math.floor(Math.random() * 25) + 97];

  //   //Choise randomly from seeds, convert to char and append to result
  //   result += String.fromCharCode(seeds[Math.floor(Math.random() * 3)]);
  // }
  let modelCount = (await model.count()) + 1;
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
