const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const admin = require('../utils/firebaseAdmin.util');
const { SECRET_KEY } = require('../config');

const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

module.exports.checkAuth = async (ctx) => {
  const token = ctx.req.cookies.JWT_TOKEN;
  const googleIdToken = ctx.req.cookies.GOOGLE_ID_TOKEN;

  if (token) {
    try {
      const user = jwt.verify(token, SECRET_KEY);
      return {
        id: user.id,
        email: user.email
      };
    } catch (err) {
      throw new AuthenticationError('Invalid/Expired token');
    }
  }

  if (googleIdToken) {
    try {
      const user = await admin.auth().verifySessionCookie(googleIdToken, true);
      const userId = ctx.req.cookies.USER_ID;
      return {
        id: userId,
        email: user.email
      };
    } catch (err) {
      throw new AuthenticationError('Invalid/Expired ID token');
    }
  }

  throw new Error('Authorization header must be provided');
};

module.exports.checkEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

module.exports.setGoogleToken = async (idToken, userId, ctx) => {
  const sessionCookie = await admin
    .auth()
    .createSessionCookie(idToken, { expiresIn });

  await ctx.res.cookie('GOOGLE_ID_TOKEN', sessionCookie, {
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: expiresIn
  });
  await ctx.res.cookie('USER_ID', userId);
};

module.exports.genAndStoreToken = async (user, ctx) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    SECRET_KEY,
    { expiresIn }
  );

  await ctx.res.cookie('JWT_TOKEN', token, {
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: 3600000
  });
};

module.exports.clearToken = async (ctx) => {
  const token = ctx.req.cookies.JWT_TOKEN;
  const googleIdToken = ctx.req.cookies.GOOGLE_ID_TOKEN;

  if (token) {
    await ctx.res.clearCookie('JWT_TOKEN', {
      httpOnly: true,
      sameSite: 'Strict'
    });
  }

  if (googleIdToken) {
    await ctx.res.clearCookie('GOOGLE_ID_TOKEN', {
      httpOnly: true,
      sameSite: 'Strict'
    });
  }
};
