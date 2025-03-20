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
  pronouns: String,
  title: String,
  location: String,
  birthdate: String,
  bio: String,
  avatar: String,
  coverPhoto: String,
  socials: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    github: String
  },
  tags: [String],
  createdAt: String
});

module.exports = model('User', userSchema);
