const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }, // Who triggered the notification
    type: {
      type: String,
      enum: ['new_post', 'new_comment', 'like', 'save', 'follow'],
      required: true
    },
    latestUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // for condensing notifications
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: false
    }, // If related to a post
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: false
    }, // If related to a comment
    isRead: { type: Boolean, default: false },
    message: { type: String, required: true },
    createdAt: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
