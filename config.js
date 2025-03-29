require('dotenv').config({
  path: '.env'
});

const mongodbUri = process.env.MONGODB_URI;
const secretKey = process.env.SECRET_KEY;
const port = process.env.PORT || 4000;

module.exports = {
  MONGODB_URI: mongodbUri,
  SECRET_KEY: secretKey,
  PORT: port
};
