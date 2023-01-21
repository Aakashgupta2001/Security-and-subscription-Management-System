const express = require("express");
const cookieParser = require("cookie-parser");
const { useErrorHandler } = require("../middlewares/errorHandler");

const user = require("./user");
const apps = require("./app");

module.exports.default = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use("/api/v1/user", user);
  app.use("/api/v1/app", apps);

  app.use(useErrorHandler);
};
