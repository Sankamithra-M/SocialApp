import Notification from "./notification.model.js";

export const createNotificationService = async ({
  recipient,
  sender,
  type,
  post = null,
  comment = null,
}) => {
  const notification = await Notification.create({
    recipient,
    sender,
    type,
    post,
    comment,
  });
   console.log("Notification created:", notification);
  return notification;
};