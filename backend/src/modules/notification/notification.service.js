import Notification from "./notification.model.js";
import AppError from "../../errors/AppError.js";

// CREATE NOTIFICATION
// ========================================

export const createNotificationService = async ({
  recipient,
  sender,
  type,
  post = null,
  comment = null,
  session,
}) => {
  const [notification] =
    await Notification.create(
      [
        {
          recipient,
          sender,
          type,
          post,
          comment,
        },
      ],
      { session }
    );

  console.log(
    "Notification created:",
    notification
  );

  return notification;
};


// ========================================
// GET NOTIFICATIONS
// ========================================

export const getNotificationsService = async (
  userId
) => {
  const notifications =
    await Notification.find({
      recipient: userId,
    })
      .populate(
        "sender",
        "username displayName profileImage"
      )
      .populate(
        "post",
        "images"
      )
      .populate(
        "comment",
        "text"
      )
      .sort({
        createdAt: -1,
      });

  return notifications;
};


// ========================================
// MARK ONE AS READ
// ========================================

export const markNotificationAsReadService =
  async (
    userId,
    notificationId
  ) => {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: notificationId,
          recipient: userId,
        },
        {
          $set: {
            isRead: true,
          },
        },
        {
          new: true,
        }
      );

    if (!notification) {
      throw new AppError(
        "Notification not found",
        404
      );
    }

    return notification;
  };

  export const markAllNotificationsAsReadService = async (
  userId
) => {
  const result = await Notification.updateMany(
    {
      recipient: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );

  return {
    modifiedCount: result.modifiedCount,
  };
};