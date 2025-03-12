const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  firstName: String,
  lastName: String,
  birthdate: String,
  location: String,
  pronouns: String,
  bio: String,
  avatar: String,
  coverPhoto: String,
  tags: [String],
  createdAt: String
});

module.exports = model('User', userSchema);
