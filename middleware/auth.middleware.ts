import { ContextType, SessionUser } from '../types';

import { AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken';

import admin from '../utils/firebaseAdmin.util';
import { secretKey } from '../config';

const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

export const checkAuth = async (ctx: ContextType) => {
  const token = ctx.req.cookies.JWT_TOKEN;
  const googleIdToken = ctx.req.cookies.GOOGLE_ID_TOKEN;

  if (token) {
    try {
      const user = jwt.verify(token, secretKey) as SessionUser;

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

export const checkEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const setGoogleToken = async (
  idToken: string,
  userId: string,
  ctx: ContextType
) => {
  const sessionCookie = await admin
    .auth()
    .createSessionCookie(idToken, { expiresIn });

  ctx.res.cookie('GOOGLE_ID_TOKEN', sessionCookie, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: expiresIn
  });
  ctx.res.cookie('USER_ID', userId);
};

export const genAndStoreToken = async (user: SessionUser, ctx: ContextType) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    secretKey,
    { expiresIn }
  );

  ctx.res.cookie('JWT_TOKEN', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 3600000
  });
};

export const clearToken = async (ctx: ContextType) => {
  const token = ctx.req.cookies.JWT_TOKEN;
  const googleIdToken = ctx.req.cookies.GOOGLE_ID_TOKEN;

  if (token) {
    ctx.res.clearCookie('JWT_TOKEN', {
      httpOnly: true,
      sameSite: 'strict'
    });
  }

  if (googleIdToken) {
    ctx.res.clearCookie('GOOGLE_ID_TOKEN', {
      httpOnly: true,
      sameSite: 'strict'
    });
  }
};
