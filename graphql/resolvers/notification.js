const pubSub = require('../../pubSub');
const Notification = require('../../models/Notification');
const { checkAuth } = require('../../utils/auth.util');
const { populateNotification } = require('../../utils/populate.util');

const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

module.exports = {
  Query: {
    async getNotifications(_, __, context) {
      const user = await checkAuth(context);

      if (!user) {
        throw new Error('User not authenticated');
      }

      const notifications = await Notification.find({
        user: user.id
      })
        .sort({ createdAt: -1 })
        .populate(populateNotification);

      return {
        list: notifications
      };
    }
  },
  Mutation: {
    async markAsRead(_, { notificationId }, context) {
      const user = await checkAuth(context);

      if (!user) {
        throw new Error('User not authenticated');
      }

      const notification = await Notification.findById(notificationId);

      if (!notification) {
        throw new Error('Notification not found');
      }

      if (notification.user.toString() !== user.id.toString()) {
        throw new Error('Unauthorized action');
      }

      notification.isRead = true;
      await notification.save();
      await notification.populate(populateNotification);

      const unreadCount = await Notification.countDocuments({
        user: user.id,
        isRead: false
      });

      return {
        unreadCount,
        notification
      };
    }
  },
  Subscription: {
    onNewNotification: {
      subscribe: () => pubSub.asyncIterator(NEW_NOTIFICATION)
    }
  }
};
