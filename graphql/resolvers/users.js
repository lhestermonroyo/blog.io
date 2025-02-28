const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const {
  validateSignUpInput,
  validateLoginInput,
  validateProfileInput,
  validateProfilePhotoInput,
} = require('../../utils/validators.util');
const {
  checkAuth,
  genAndStoreToken,
  clearToken,
} = require('../../utils/auth.util');

module.exports = {
  Mutation: {
    async signUp(_, { signUpInput }, ctx) {
      try {
        const { firstName, lastName, email, password, confirmPassword } =
          signUpInput;

        const { valid, errors } = validateSignUpInput(
          firstName,
          lastName,
          email,
          password,
          confirmPassword
        );

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        const user = await User.findOne({ email });

        if (user) {
          throw new UserInputError('Email is already taken.', {
            errors: {
              email: 'Email is already taken.',
            },
          });
        }

        const cryptedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
          firstName,
          lastName,
          email,
          password: cryptedPassword,
          birthdate: '',
          location: '',
          age: 0,
          pronouns: '',
          bio: '',
          createdAt: new Date().toISOString(),
        });

        const response = await newUser.save();
        await genAndStoreToken(response, ctx);

        return {
          id: response._id,
          email: response._doc.email,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async login(_, { email, password }, ctx) {
      try {
        const { valid, errors } = validateLoginInput(email, password);

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        const user = await User.findOne({ email });

        if (!user) {
          errors.general = 'User not found.';
          throw new UserInputError('User not found.', { errors });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          errors.general = 'Wrong credentials.';
          throw new UserInputError('Wrong credentials.', { errors });
        }

        await genAndStoreToken(user, ctx);

        return {
          id: user._id,
          email: user._doc.email,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async logout(_, __, ctx) {
      try {
        await clearToken(ctx);

        return {
          success: true,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateProfile(_, { profileInput }, ctx) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const { firstName, lastName, birthdate, location, pronouns, bio } =
          profileInput;

        const { valid, errors } = validateProfileInput(
          firstName,
          lastName,
          birthdate,
          location
        );

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        const response = await User.findByIdAndUpdate(
          user.id,
          {
            firstName,
            lastName,
            birthdate,
            location,
            pronouns,
            bio,
          },
          { new: true }
        );
        await response.save();

        return {
          id: response._id,
          ...response._doc,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateProfilePhoto(_, { profilePhotoInput }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const { photoType, photoUri } = profilePhotoInput;

        const { valid, errors } = validateProfilePhotoInput(
          photoType,
          photoUri
        );

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        let key;

        if (photoType === 'COVER') {
          key = 'coverPhoto';
        } else {
          key = 'profilePhoto';
        }

        const response = await User.findByIdAndUpdate(
          user.id,
          {
            $set: {
              [key]: photoUri,
            },
          },
          { new: true }
        );
        await response.save();

        return {
          id: response._id,
          ...response._doc,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Query: {
    async getProfile(_, __, ctx) {
      try {
        const user = checkAuth(ctx);

        const response = await User.findOne({
          email: user.email,
        });

        if (!response) {
          throw new Error('User not found.');
        } else {
          return {
            id: response._id,
            ...response._doc,
          };
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async getProfileByEmail(_, { email }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const response = await User.findOne({ email });

        if (!response) {
          throw new Error('User not found.');
        } else {
          return {
            id: response._id,
            ...response._doc,
          };
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
