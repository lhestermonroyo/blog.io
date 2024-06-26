const { model, Schema } = require('mongoose');

const subForumSchema = new Schema({
  name: String,
  description: String,
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  subscribers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: String,
});

module.exports = model('SubForum', subForumSchema);
