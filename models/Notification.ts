import { model, Schema } from 'mongoose';

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient, the user who will receive the notification
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }, // Who triggered the notification
    type: {
      type: String,
      enum: [
        'new_post',
        'new_comment',
        'like_comment',
        'reply_comment',
        'like_reply',
        'like',
        'save',
        'follow'
      ],
      required: true
    },
    latestUser: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: false
    },
    comment: {
      type: Schema.Types.ObjectId,
      required: false
    },
    isRead: { type: Boolean, default: false },
    message: { type: String, required: true },
    createdAt: {
      type: String,
      default: new Date().toISOString()
    }
  },
  {
    timestamps: true
  }
);

export default model('Notification', notificationSchema);
