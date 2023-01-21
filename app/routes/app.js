const router = require("express").Router();
const appController = require("../controller/app");
const auth = require("../middlewares/auth");

router.route("/").post(auth.verifyToken, auth.isAdmin, appController.create);
router.route("/").get(auth.verifyToken, auth.isAdmin, appController.list);

router.route("/:id").put(auth.verifyToken, auth.isAdmin, appController.update);

module.exports = router;
