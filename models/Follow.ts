import { model, Schema } from 'mongoose';

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

export default model('Follow', followSchema);
