const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  name: String,
  birthdate: String,
  location: String,
  coverPhoto: String,
  profilePhoto: String,
  karma: Number,
  createdAt: String,
});

module.exports = model('User', userSchema);
