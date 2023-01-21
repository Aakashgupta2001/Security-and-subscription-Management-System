const router = require("express").Router();
const userController = require("../controller/user");
const resetPasswordController = require("../controller/resetpassword");
const auth = require("../middlewares/auth");
const { sendEmail } = require("../middlewares/sendEmail");

router.route("/login").post(userController.login);
router.route("/signup").post(userController.signup);

router.route("/list").get(auth.verifyToken, auth.isAdmin, userController.getUserListBasedOnRole);
router.route("/role/:id").put(auth.verifyToken, auth.isAdmin, userController.updateRole);

router.route("/password/forgot").post(resetPasswordController.resetPassword, sendEmail);
router.route("/password/reset").post(resetPasswordController.storePassword, sendEmail);

module.exports = router;
