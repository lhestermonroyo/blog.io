const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  title: String,
  body: String,
  files: [String],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  subForum: {
    type: Schema.Types.ObjectId,
    ref: 'SubForum',
  },
  comments: [
    {
      body: String,
      creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: String,
    },
  ],
  upvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  downvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: String,
});

module.exports = model('Post', postSchema);
