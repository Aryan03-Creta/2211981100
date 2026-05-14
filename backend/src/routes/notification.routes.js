const express = require("express");
const router = express.Router();
const controller = require("../controllers/notification.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/", auth, controller.getMyNotifications);
router.put("/:id/read", auth, controller.markRead);
router.delete("/", auth, controller.clearAllNotifications);
router.delete("/:id", auth, controller.deleteNotification);

module.exports = router;
