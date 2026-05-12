const express = require("express");
const router = express.Router();
const controller = require("../controllers/job.controller");
const auth = require("../middlewares/auth.middleware");
const employerOnly = require("../middlewares/employer.middleware");
const upload = require("../middlewares/upload.middleware");

router.get("/search", controller.searchJobs);
router.get("/", controller.getJobs);
router.get("/:id", controller.getJob);

router.post("/", auth, employerOnly, upload.single("logo"), controller.createJob);
router.put("/:id", auth, employerOnly, upload.single("logo"), controller.updateJob);
router.delete("/:id", auth, employerOnly, controller.deleteJob);

module.exports = router;
