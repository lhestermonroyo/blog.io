import { array, object, string, ref } from 'yup';

export const signUpInputSchema = object({
  email: string().email().required(),
  firstName: string().min(2).max(100).required(),
  lastName: string().min(2).max(100).required(),
  password: string().min(6).required(),
  confirmPassword: string()
    .oneOf([ref('password')], 'Passwords must match')
    .required()
});

export const loginInputSchema = object({
  email: string().email().required(),
  password: string().min(6).required()
});

export const updateUserInputSchema = object({
  firstName: string().nullable(),
  lastName: string().nullable(),
  pronouns: string().nullable(),
  title: string().nullable(),
  location: string().nullable(),
  birthdate: string().nullable(),
  bio: string().nullable(),
  avatar: string().nullable(),
  coverPhoto: string().nullable(),
  socials: object({
    facebook: string().nullable(),
    twitter: string().nullable(),
    instagram: string().nullable(),
    linkedin: string().nullable(),
    github: string().nullable(),
    website: string().nullable()
  }).required(),
  tags: array().of(string()).nullable()
});
