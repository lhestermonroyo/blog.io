import { ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { Types } from 'mongoose';

export type ContextType = ExpressContextFunctionArgument & {
  authUser: DecodedIdToken | null;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  pronouns: string | null;
  title: string | null;
  location: string | null;
  birthdate: string | null;
  bio: string | null;
  age: number | null;
  avatar: string | null;
  coverPhoto: string | null;
  socials: {
    twitter: string | null;
    instagram: string | null;
    facebook: string | null;
    linkedin: string | null;
    github: string | null;
  };
  tags: string[];
  createdAt: string;
};

export type UserBadge = Pick<
  User,
  'id' | 'email' | 'firstName' | 'lastName' | 'avatar'
>;

export type SessionUser = Pick<User, 'id' | 'email'>;

export type SignUpInput = Pick<User, 'email' | 'firstName' | 'lastName'> & {
  password: string;
  confirmPassword: string;
};

export type UpdateUserInput = Partial<User>;
