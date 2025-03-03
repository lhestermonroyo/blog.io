const { model, Schema } = require('mongoose');

const followSchema = new Schema({
  follower: {
    type: String,
    ref: 'User'
  }, // The user who is following
  following: {
    type: String,
    ref: 'User'
  } // The user who is being followed
});

module.exports = model('Follow', followSchema);
