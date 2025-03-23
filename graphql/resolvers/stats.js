const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const Follow = require('../../models/Follow');
const Post = require('../../models/Post');
const { checkAuth } = require('../../utils/auth.util');

const profileBadgeProj = '_id email firstName lastName avatar';

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

        const [followers, following] = await Promise.all([
          (
            await Follow.find({ following: email })
          ).map((follow) => follow.follower),
          (
            await Follow.find({ follower: email })
          ).map((follow) => follow.following)
        ]);

        const [followerUsers, followingUsers] = await Promise.all([
          User.find({ email: { $in: followers } }, profileBadgeProj),
          User.find({ email: { $in: following } }, profileBadgeProj)
        ]);

        return {
          followers: {
            count: followers.length,
            list: followerUsers
          },
          following: {
            count: following.length,
            list: followingUsers
          }
        };
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  Query: {
    async getStatsByEmail(_, { email }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const statUser = await User.findOne({ email });

        if (!statUser) {
          throw new UserInputError('User not found.');
        }

        const [followers, following] = await Promise.all([
          (
            await Follow.find({ following: email })
          ).map((follow) => follow.follower),
          (
            await Follow.find({ follower: email })
          ).map((follow) => follow.following)
        ]);

        const requests = [
          Post.find({ creator: statUser.id })
            .sort({ createdAt: -1 })
            .populate('creator', profileBadgeProj),
          Post.find({
            saves: { $elemMatch: { user: statUser.id } }
          }).populate('creator', profileBadgeProj),
          User.find({ email: { $in: followers } }, profileBadgeProj),
          User.find({ email: { $in: following } }, profileBadgeProj)
        ];

        const [posts, savedPosts, followerUsers, followingUsers] =
          await Promise.all(requests);

        const postList = posts.map((post) => {
          const likeCount = post._doc.likes.length ?? 0;
          const commentCount = post._doc.comments.length ?? 0;
          const saveCount = post._doc.saves.length ?? 0;

          delete post._doc.likes;
          delete post._doc.comments;
          delete post._doc.saves;

          return {
            id: post._id,
            ...post._doc,
            likeCount,
            commentCount,
            saveCount
          };
        });
        const savedPostList = savedPosts.map((post) => {
          const likeCount = post._doc.likes.length ?? 0;
          const commentCount = post._doc.comments.length ?? 0;
          const saveCount = post._doc.saves.length ?? 0;

          delete post._doc.likes;
          delete post._doc.comments;
          delete post._doc.saves;

          return {
            id: post._id,
            ...post._doc,
            likeCount,
            commentCount,
            saveCount
          };
        });

        return {
          email,
          followers: {
            count: followers.length || 0,
            list: followerUsers || []
          },
          following: {
            count: following.length || 0,
            list: followingUsers || []
          },
          savedPosts: {
            count: savedPostList.length || 0,
            list: savedPostList || []
          },
          posts: {
            count: postList.length || 0,
            list: postList || []
          }
        };
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
