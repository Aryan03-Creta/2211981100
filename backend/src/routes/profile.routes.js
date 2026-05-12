const express = require("express");
const router = express.Router();
const controller = require("../controllers/profile.controller");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.get("/", auth, controller.getProfile);
router.put("/", auth, controller.updateProfile);

// resume upload
router.post("/resume", auth, upload.single("resume"), controller.uploadResume);

// profile image upload
router.post("/avatar", auth, upload.single("avatar"), controller.uploadAvatar);

module.exports = router;
