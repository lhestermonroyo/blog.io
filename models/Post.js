const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  title: String,
  content: String,
  tags: [String],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      body: String,
      commentor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: String
    }
  ],
  likes: [
    {
      liker: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: String
    }
  ],
  saves: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: String
    }
  ],
  createdAt: String
});

module.exports = model('Post', postSchema);
