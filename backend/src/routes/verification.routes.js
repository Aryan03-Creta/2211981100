const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const { requestVerification } = require("../controllers/verification.controller");

router.post("/request", auth, requestVerification);

module.exports = router;