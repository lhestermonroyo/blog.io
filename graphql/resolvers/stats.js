const { UserInputError } = require('apollo-server');
const pubSub = require('../../pubSub');

const User = require('../../models/User');
const Follow = require('../../models/Follow');
const Post = require('../../models/Post');
const Notification = require('../../models/Notification');
const { checkAuth } = require('../../utils/auth.util');
const {
  profileBadgeProj,
  populateNotification
} = require('../../utils/populate.util');

const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

module.exports = {
  Mutation: {
    async followUser(_, { email }, context) {
      try {
        const user = await checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        if (user.email === email) {
          throw new UserInputError('You cannot follow yourself.');
        }

        const followingUser = await User.findOne({ email });

        if (!followingUser) {
          throw new UserInputError('User not found.');
        }

        const isAlreadyFollowing = await Follow.findOne({
          follower: user.email,
          following: email
        });

        const requests = [
          Notification.findOne({
            user: followingUser._id,
            type: 'follow'
          }).populate('latestUser', profileBadgeProj),
          User.findById(user.id)
        ];
        let [notification, currUser] = await Promise.all(requests);

        if (isAlreadyFollowing) {
          await Follow.deleteOne({ follower: user.email, following: email });

          if (notification) {
            const existing = notification.latestUser.some(
              (user) => user._id.toString() === currUser._id.toString()
            );

            if (existing) {
              notification.latestUser = notification.latestUser.filter(
                (user) => user._id.toString() !== currUser._id.toString()
              );
            }

            if (notification.latestUser.length === 0) {
              await notification.deleteOne();
            } else {
              const msgUser = notification.latestUser[0];

              if (notification.latestUser.length === 1) {
                notification.message = `${msgUser.firstName} ${msgUser.lastName} followed you.`;
              } else {
                notification.message = `${msgUser.firstName} ${
                  msgUser.lastName
                } and ${
                  notification.latestUser.length - 1
                } others followed you.`;
              }

              notification.createdAt = new Date().toISOString();
              await notification.save();
            }
          }
        } else {
          const newFollow = new Follow({
            follower: user.email,
            following: email
          });
          await newFollow.save();

          if (!notification) {
            notification = new Notification({
              user: followingUser._id,
              sender: user.id,
              type: 'follow',
              latestUser: [user.id],
              message: `${currUser.firstName} ${currUser.lastName} followed you.`,
              createdAt: new Date().toISOString()
            });
            await notification.save();
          } else {
            const existing = notification.latestUser.some(
              (user) => user._id.toString() === currUser._id.toString()
            );

            if (!existing) {
              notification.latestUser.unshift(currUser._id);

              if (notification.latestUser.length === 1) {
                notification.message = `${currUser.firstName} ${currUser.lastName} followed you.`;
              } else {
                notification.message = `${currUser.firstName} ${
                  currUser.lastName
                } and ${
                  notification.latestUser.length - 1
                } others followed you.`;
              }

              notification.isRead = false;
              notification.createdAt = new Date().toISOString();
              await notification.save();
            }
          }
        }

        if (notification) {
          const exists = await Notification.exists({ _id: notification._id });

          if (exists) {
            // remove last item at populateNotification
            await notification.populate(populateNotification);
            const unreadCount = await Notification.countDocuments({
              user: followingUser._id,
              isRead: false
            });

            pubSub.publish(NEW_NOTIFICATION, {
              onNewNotification: {
                unreadCount,
                notification: {
                  id: notification._id,
                  ...notification._doc
                }
              }
            });
          }
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
        console.log('error', error);
        throw new Error(error);
      }
    }
  },
  Query: {
    async getStatsByEmail(_, { email }, __) {
      try {
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
