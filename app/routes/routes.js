const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const { useErrorHandler } = require("../middlewares/errorHandler");

const user = require("./user");
const apps = require("./app");
const subscription = require("./subscription");

module.exports.default = (app) => {
  function getDir() {
    if (process.pkg) {
      return path.resolve(process.execPath + "/..");
    } else {
      return path.join(require.main ? require.main.path : process.cwd());
    }
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(express.static(getDir() + "/build"));
  app.use(express.static("public"));

  app.use("/api/v1/user", user);
  app.use("/api/v1/app", apps);
  app.use("/api/v1/subscription", subscription);
  app.get("/resetPassword", (req, res, next) => {
    res.sendFile(getDir() + "/build/index.html");
  });

  app.get("/RefundPolicy", (req, res, next) => {
    res.sendFile(getDir() + "/build/index.html");
  });
  app.get("/PrivacyPolicy", (req, res, next) => {
    res.sendFile(getDir() + "/build/index.html");
  });
  app.get("/termsOfService", (req, res, next) => {
    res.sendFile(getDir() + "/build/index.html");
  });
  app.get("/AboutUs", (req, res, next) => {
    res.sendFile(getDir() + "/build/index.html");
  });
  app.get("/ContactUs", (req, res, next) => {
    res.sendFile(getDir() + "/build/index.html");
  });

  app.get("/payment", (req, res, next) => {
    res.sendFile(getDir() + "/build/index.html");
  });

  app.use(useErrorHandler);
};
