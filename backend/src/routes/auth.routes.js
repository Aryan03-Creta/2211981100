const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", auth, controller.logout);

module.exports = router;
