const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashboard.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/jobseeker", auth, controller.jobSeekerDashboard);
router.get("/employer", auth, controller.employerDashboard);

module.exports = router;
