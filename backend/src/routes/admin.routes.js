const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/pending", auth, controller.getPendingEmployers);
router.post("/verify/:id", auth, controller.verifyEmployer);
router.post("/reject/:id", auth, controller.rejectEmployer);

module.exports = router;

