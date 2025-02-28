const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  birthdate: String,
  location: String,
  coverPhoto: String,
  profilePhoto: String,
  createdAt: String,
});

module.exports = model('User', userSchema);
