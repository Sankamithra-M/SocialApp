import express from "express";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notification.controller.js";

import {protect} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getNotifications
);

router.patch(
  "/read-all",
  protect,
  markAllNotificationsAsRead
);

router.patch(
  "/:notificationId/read",
  protect,
  markNotificationAsRead
);

export default router;