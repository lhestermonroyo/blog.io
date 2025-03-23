const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

module.exports.checkAuth = (ctx) => {
  const token = ctx.req.cookies.JWT_TOKEN;

  if (token) {
    try {
      const user = jwt.verify(token, SECRET_KEY);
      return user;
    } catch (err) {
      throw new AuthenticationError('Invalid/Expired token');
    }
  }

  throw new Error('Authorization header must be provided');
};

module.exports.checkEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

module.exports.genAndStoreToken = async (user, ctx) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );

  await ctx.res.cookie('JWT_TOKEN', token, {
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: 3600000
  });
};

module.exports.clearToken = async (ctx) => {
  await ctx.res.clearCookie('JWT_TOKEN', {
    httpOnly: true,
    sameSite: 'Strict'
  });
};
