import asyncHandler from "../../middleware/asyncHandler.js";

import {
  getNotificationsService,
 markNotificationAsReadService,
   markAllNotificationsAsReadService,
} from "./notification.service.js";

export const getNotifications =
  asyncHandler(async (req, res) => {
    const notifications =
      await getNotificationsService(
        req.user._id
      );

    res.status(200).json({
      success: true,
      data: notifications,
    });
  });

  export const markNotificationAsRead =
  asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    const notification =
      await markNotificationAsReadService(
        req.user._id,
        notificationId
      );

    res.status(200).json({
      success: true,
      data: notification,
    });
  });

  export const markAllNotificationsAsRead =
  asyncHandler(async (req, res) => {
    const result =
      await markAllNotificationsAsReadService(
        req.user._id
      );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: result,
    });
  });