const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const { checkAuth } = require('../../utils/auth.util');
const Follow = require('../../models/Follow');

module.exports = {
  Mutation: {
    followUser: async (_, { following }, context) => {
      const user = checkAuth(context);

      if (user.email === following) {
        throw new UserInputError('You cannot follow yourself.');
      }

      const followingUser = await User.find({ email: following });

      if (!followingUser) {
        throw new UserInputError('User not found.');
      }

      const isAlreadyFollowing = await Follow.findOne({
        follower: user.email,
        following,
      });

      if (!isAlreadyFollowing) {
        const newFollow = new Follow({
          follower: user.email,
          following,
        });
        await newFollow.save();
      } else {
        await Follow.deleteOne({ follower: user.email, following });
      }

      return await Follow.find({ follower: user.email });
    },
  },
  Query: {
    getFollowers: async (_, __, context) => {
      const user = checkAuth(context);

      return await Follow.find({ follower: user.email });
    },
    getFollowing: async (_, __, context) => {
      const user = checkAuth(context);

      return await Follow.find({ following: user.email });
    },
  },
};
