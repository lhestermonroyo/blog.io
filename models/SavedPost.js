const { model, Schema } = require('mongoose');

const savedPostSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: String
});

module.exports = model('SavedPost', savedPostSchema);
