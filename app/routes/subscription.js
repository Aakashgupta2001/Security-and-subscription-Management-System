const router = require("express").Router();
const subscriptionController = require("../controller/subscription");
const auth = require("../middlewares/auth");

router.route("/").post(auth.verifyToken, subscriptionController.newpayment);
router.route("/verify").post(auth.verifyToken, subscriptionController.verify);

router.route("/").get(auth.verifyToken, auth.subscriptionCheck);

module.exports = router;
