const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const Follow = require('../../models/Follow');
const { checkAuth } = require('../../utils/auth.util');

const profileBadgeProj = '_id email firstName lastName profilePhoto';

module.exports = {
  Mutation: {
    async followUser(_, { email }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        if (user.email === email) {
          throw new UserInputError('You cannot follow yourself.');
        }

        const followingUser = await User.find({ email });

        if (!followingUser) {
          throw new UserInputError('User not found.');
        }

        const isAlreadyFollowing = await Follow.findOne({
          follower: user.email,
          following: email
        });

        if (!isAlreadyFollowing) {
          const newFollow = new Follow({
            follower: user.email,
            following: email
          });
          await newFollow.save();
        } else {
          await Follow.deleteOne({ follower: user.email, following: email });
        }

        const followers = await Follow.find({ following: email });
        const followerEmails = followers.map((follow) => follow.follower);
        const followerUsers = await User.find(
          { email: { $in: followerEmails } },
          profileBadgeProj
        );

        const following = await Follow.find({ follower: email });
        const followingEmails = following.map((follow) => follow.following);
        const followingUsers = await User.find(
          { email: { $in: followingEmails } },
          profileBadgeProj
        );

        return {
          email,
          followers: followerUsers,
          following: followingUsers
        };
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  Query: {
    async getFollowsByEmail(_, { email }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const followers = await Follow.find({ following: email });
        const followerEmails = followers.map((follow) => follow.follower);
        const followerUsers = await User.find(
          { email: { $in: followerEmails } },
          profileBadgeProj
        );

        const following = await Follow.find({ follower: email });
        const followingEmails = following.map((follow) => follow.following);
        const followingUsers = await User.find(
          { email: { $in: followingEmails } },
          profileBadgeProj
        );

        return {
          email,
          followers: followerUsers,
          following: followingUsers
        };
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
