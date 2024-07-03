const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const {
  validateSignUpInput,
  validateLoginInput,
  validateProfileInput,
} = require('../../utils/validators.util');
const {
  generateToken,
  checkAuth,
  checkEmail,
} = require('../../utils/auth.util');

module.exports = {
  Mutation: {
    async signUp(_, { signUpInput }) {
      try {
        const { username, email, password, confirmPassword } = signUpInput;

        const { valid, errors } = validateSignUpInput(
          username,
          email,
          password,
          confirmPassword
        );

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        const user = await User.findOne({ username });

        if (user) {
          throw new UserInputError('Username is already taken.', {
            errors: {
              username: 'Username is already taken.',
            },
          });
        }

        const cryptedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
          email,
          username,
          password: cryptedPassword,
          name: '',
          birthdate: '',
          location: '',
          age: 0,
          karma: 0,
          createdAt: new Date().toISOString(),
        });

        const response = await newUser.save();
        const token = generateToken(response);

        return {
          id: response._id,
          email: response._doc.email,
          username: response._doc.username,
          token,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async login(_, { username, password }) {
      try {
        const { valid, errors } = validateLoginInput(username, password);

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        let user;

        if (checkEmail(username)) {
          user = await User.findOne({ email: username });
        } else {
          user = await User.findOne({ username });
        }

        if (!user) {
          errors.general = 'User not found.';
          throw new UserInputError('User not found.', { errors });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          errors.general = 'Wrong credentials.';
          throw new UserInputError('Wrong credentials.', { errors });
        }

        const token = generateToken(user);

        return {
          id: user._id,
          email: user._doc.email,
          username: user._doc.username,
          token,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateProfile(_, { profileInput }, context) {
      try {
        const { name, birthdate, location } = profileInput;

        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const { valid, errors } = validateProfileInput(
          name,
          birthdate,
          location
        );

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        const response = await User.findByIdAndUpdate(
          user.id,
          {
            name,
            birthdate,
            location,
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
    async getOwnProfile(_, __, context) {
      try {
        const user = checkAuth(context);

        const response = await User.findById(user.id);

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
    async getProfile(_, { username }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const response = await User.findOne({ username });

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
