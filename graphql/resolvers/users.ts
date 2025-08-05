import {
  AuthenticationError,
  ApolloError,
  UserInputError
} from 'apollo-server';
import bcrypt from 'bcryptjs';
import User from '../../models/User';
import admin from '../../utils/firebaseAdmin.util';
import {
  loginInputSchema,
  signUpInputSchema,
  updateUserInputSchema
} from '../../middleware/validator.middleware';
import { ContextType, SignUpInput, UpdateUserInput } from '../../types';
import {
  checkAuth,
  clearToken,
  genAndStoreToken,
  setGoogleToken
} from '../../middleware/auth.middleware';

export default {
  Mutation: {
    async signUp(
      _: {},
      { signUpInput }: { signUpInput: SignUpInput },
      ctx: ContextType
    ) {
      try {
        await signUpInputSchema.validate(signUpInput, { abortEarly: false });

        const { firstName, lastName, email, password } = signUpInput;

        const user = await User.findOne({ email });

        if (user) {
          throw new UserInputError('Email is already taken.');
        }

        const cryptedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
          firstName,
          lastName,
          email,
          password: cryptedPassword,
          pronouns: '',
          title: '',
          location: '',
          birthdate: '',
          bio: '',
          avatar: '',
          coverPhoto: '',
          tags: [],
          socials: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
            github: ''
          }
        });

        const response = await newUser.save();
        await genAndStoreToken(
          {
            id: response._id.toString(),
            email: response.email
          },
          ctx
        );

        return {
          id: response._id,
          email: response.email
        };
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async signUpWithGoogle(
      _: {},
      {
        idToken
      }: {
        idToken: string;
      },
      ctx: ContextType
    ) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { name, email, picture } = decodedToken;

        const user = await User.findOne({ email });

        if (user) {
          throw new UserInputError('Email is already taken.');
        }

        const firstName = name.split(' ')[0];
        const lastName = name.split(' ')[1];

        const newUser = new User({
          firstName,
          lastName,
          email,
          password: '',
          pronouns: '',
          title: '',
          location: '',
          birthdate: '',
          bio: '',
          avatar: picture,
          coverPhoto: '',
          tags: [],
          socials: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
            github: ''
          },
          createdAt: new Date().toISOString()
        });
        const response = await newUser.save();

        await setGoogleToken(idToken, response._id.toString(), ctx);
        return {
          id: response._id,
          email: response.email
        };
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async login(
      _: {},
      {
        email,
        password
      }: {
        email: string;
        password: string;
      },
      ctx: ContextType
    ) {
      try {
        await loginInputSchema.validate(
          { email, password },
          { abortEarly: false }
        );

        const user = await User.findOne({ email });

        if (!user) {
          throw new UserInputError('User not found.');
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          throw new UserInputError('Wrong credentials.');
        }

        await genAndStoreToken(
          {
            id: user._id.toString(),
            email: user.email
          },
          ctx
        );

        return {
          id: user._id,
          email: user.email
        };
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async loginWithGoogle(_: {}, { idToken }, ctx: ContextType) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { name, email, picture } = decodedToken;

        const user = await User.findOne({ email });

        const firstName = name.split(' ')[0];
        const lastName = name.split(' ')[1];
        let returnId = null;
        let returnEmail = null;

        if (!user) {
          const newUser = new User({
            firstName,
            lastName,
            email,
            password: '',
            pronouns: '',
            title: '',
            location: '',
            birthdate: '',
            bio: '',
            avatar: picture,
            coverPhoto: '',
            tags: [],
            socials: {
              facebook: '',
              twitter: '',
              instagram: '',
              linkedin: '',
              github: ''
            }
          });
          const response = await newUser.save();
          returnId = response._id;
          returnEmail = response.email;
        } else {
          returnId = user._id;
          returnEmail = user.email;
        }

        await setGoogleToken(idToken, returnId, ctx);
        return {
          id: returnId,
          email: returnEmail
        };
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async logout(_: {}, __: {}, ctx: ContextType) {
      try {
        await clearToken(ctx);

        return {
          success: true
        };
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async changePassword(
      _: {},
      {
        oldPassword,
        newPassword
      }: {
        oldPassword: string;
        newPassword: string;
      },
      ctx: ContextType
    ) {
      try {
        const user = await checkAuth(ctx);

        if (!user) {
          throw new AuthenticationError('User not authenticated.');
        }

        const response = await User.findById(user.id);

        const match = await bcrypt.compare(oldPassword, response.password);

        if (!match) {
          throw new UserInputError('Current password is incorrect.');
        }

        const cryptedPassword = await bcrypt.hash(newPassword, 12);

        response.password = cryptedPassword;
        await response.save();

        await clearToken(ctx);

        return {
          success: true
        };
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async updateUser(
      _: {},
      {
        updateUserInput
      }: {
        updateUserInput: UpdateUserInput;
      },
      ctx: ContextType
    ) {
      try {
        const user = await checkAuth(ctx);

        if (!user) {
          throw new AuthenticationError('User not authenticated.');
        }

        await updateUserInputSchema.validate(updateUserInput, {
          abortEarly: false
        });

        const response = await User.findByIdAndUpdate(
          user.id,
          { $set: updateUserInput },
          { new: true }
        );
        await response.save();

        return {
          id: response._id,
          ...response.toObject()
        };
      } catch (error) {
        throw new ApolloError(error);
      }
    }
  },
  Query: {
    async getUserProfile(_: {}, __: {}, ctx: ContextType) {
      try {
        const user = await checkAuth(ctx);

        const response = await User.findOne({
          email: user.email
        });

        if (!response) {
          throw new UserInputError('User not found.');
        } else {
          return {
            id: response._id,
            ...response.toObject()
          };
        }
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async getUserProfileByEmail(_: {}, { email }, __: {}) {
      try {
        const response = await User.findOne({ email });

        if (!response) {
          throw new UserInputError('User not found.');
        } else {
          return {
            id: response._id,
            ...response.toObject()
          };
        }
      } catch (error) {
        throw new ApolloError(error);
      }
    }
  }
};
