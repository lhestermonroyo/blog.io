const bcrypt = require('bcryptjs');

const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const admin = require('../../utils/firebaseAdmin.util');
const {
  validateSignUpInput,
  validateLoginInput,
  validateProfileInput
} = require('../../utils/validators.util');
const {
  checkAuth,
  genAndStoreToken,
  clearToken,
  setGoogleToken
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
              email: 'Email is already taken.'
            }
          });
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
          },
          createdAt: new Date().toISOString()
        });

        const response = await newUser.save();
        await genAndStoreToken(response, ctx);

        return {
          id: response._id,
          email: response._doc.email
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async signUpWithGoogle(_, { idToken }, ctx) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { name, email, picture } = decodedToken;

        const user = await User.findOne({ email });

        if (user) {
          throw new UserInputError('Email is already taken.', {
            errors: {
              email: 'Email is already taken.'
            }
          });
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

        await setGoogleToken(idToken, response._id, ctx);
        return {
          id: response._id,
          email: response._doc.email
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
          email: user._doc.email
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async loginWithGoogle(_, { idToken }, ctx) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { name, email, picture } = decodedToken;

        const user = await User.findOne({ email });

        const firstName = name.split(' ')[0];
        const lastName = name.split(' ')[1];
        let returnId;
        let returnEmail;

        if (!user) {
          // create account
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
          returnId = response._id;
          returnEmail = response._doc.email;
        } else {
          returnId = user._id;
          returnEmail = user._doc.email;
        }

        await setGoogleToken(idToken, returnId, ctx);
        return {
          id: returnId,
          email: returnEmail
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async logout(_, __, ctx) {
      try {
        await clearToken(ctx);

        return {
          success: true
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async changePassword(_, { oldPassword, newPassword }, ctx) {
      try {
        const user = await checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const response = await User.findById(user.id);

        const match = await bcrypt.compare(oldPassword, response.password);

        if (!match) {
          throw new UserInputError('Current password is incorrect.', {
            errors: {
              general: 'Current password is incorrect.'
            }
          });
        }

        const cryptedPassword = await bcrypt.hash(newPassword, 12);

        response.password = cryptedPassword;
        await response.save();

        await clearToken(ctx);

        return {
          success: true
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateProfile(_, { profileInput }, ctx) {
      try {
        const user = await checkAuth(ctx);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const {
          firstName,
          lastName,
          pronouns,
          title,
          location,
          birthdate,
          bio,
          avatar,
          coverPhoto,
          socials,
          tags
        } = profileInput;

        const { valid, errors } = validateProfileInput(
          firstName,
          lastName,
          pronouns,
          title,
          location,
          birthdate,
          bio,
          avatar,
          coverPhoto,
          socials,
          tags
        );

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        const response = await User.findByIdAndUpdate(
          user.id,
          {
            firstName,
            lastName,
            pronouns,
            title,
            location,
            birthdate,
            bio,
            socials,
            tags,
            avatar,
            coverPhoto
          },
          { new: true }
        );
        await response.save();

        return {
          id: response._id,
          ...response._doc
        };
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  Query: {
    async getProfile(_, __, ctx) {
      try {
        const user = await checkAuth(ctx);

        const response = await User.findOne({
          email: user.email
        });

        if (!response) {
          throw new Error('User not found.');
        } else {
          return {
            id: response._id,
            ...response._doc
          };
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async getProfileByEmail(_, { email }, __) {
      try {
        const response = await User.findOne({ email });

        if (!response) {
          throw new Error('User not found.');
        } else {
          return {
            id: response._id,
            ...response._doc
          };
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
