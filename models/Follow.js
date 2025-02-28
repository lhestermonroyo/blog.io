const { model, Schema } = require('mongoose');

const followSchema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }, // The user who is following
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }, // The user who is being followed
});

module.exports = model('Follow', followSchema);
