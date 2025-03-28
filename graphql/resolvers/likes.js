const pubSub = require('../../pubSub');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Notification = require('../../models/Notification');
const { checkAuth } = require('../../utils/auth.util');

const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

const profileBadgeProj = '_id email firstName lastName avatar';
const postBadgeProj = '_id title';

module.exports = {
  Mutation: {
    async likePost(_, { postId }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const requests = [
          Post.findById(postId),
          Notification.findOne({
            post: postId,
            type: 'like'
          }).populate('latestUser', profileBadgeProj),
          User.findById(user.id)
        ];
        let [post, notification, currUser] = await Promise.all(requests);

        if (!post) {
          throw new Error('Post not found');
        }

        const alreadyLiked = post.likes.find(
          (like) => like.liker.toString() === user.id.toString()
        );

        if (alreadyLiked) {
          post.likes = post.likes.filter(
            (like) => like.liker.toString() !== user.id.toString()
          );

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
                notification.message = `${msgUser.firstName} ${msgUser.lastName} liked your post.`;
              } else {
                notification.message = `${msgUser.firstName} ${
                  msgUser.lastName
                } and ${
                  notification.latestUser.length - 1
                } others liked your post.`;
              }

              notification.createdAt = new Date().toISOString();
              await notification.save();
            }
          }
        } else {
          post.likes.push({
            liker: user.id,
            createdAt: new Date().toISOString()
          });

          if (!notification) {
            notification = new Notification({
              user: post.creator,
              sender: user.id,
              type: 'like',
              post: postId,
              latestUser: [user.id],
              message: `${currUser.firstName} ${currUser.lastName} liked your post.`,
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
                notification.message = `${currUser.firstName} ${currUser.lastName} liked your post.`;
              } else {
                notification.message = `${currUser.firstName} ${
                  currUser.lastName
                } and ${
                  notification.latestUser.length - 1
                } others liked your post.`;
              }

              notification.isRead = false;
              notification.createdAt = new Date().toISOString();
            }
            await notification.save();
          }
        }

        await post.save();
        await post.populate([
          {
            path: 'creator',
            model: 'User',
            select: profileBadgeProj
          },
          {
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'commentor',
              model: 'User',
              select: profileBadgeProj
            }
          },
          {
            path: 'likes',
            model: 'Like',
            populate: {
              path: 'liker',
              model: 'User',
              select: profileBadgeProj
            }
          },
          {
            path: 'saves',
            model: 'Save',
            populate: {
              path: 'user',
              model: 'User',
              select: profileBadgeProj
            }
          }
        ]);

        if (notification) {
          const exists = await Notification.exists({ _id: notification._id });

          if (exists) {
            await notification.populate([
              {
                path: 'user',
                model: 'User',
                select: profileBadgeProj
              },
              {
                path: 'sender',
                model: 'User',
                select: profileBadgeProj
              },
              {
                path: 'latestUser',
                model: 'User',
                select: profileBadgeProj
              },
              {
                path: 'post',
                model: 'Post',
                select: postBadgeProj
              }
            ]);
            const unreadCount = await Notification.countDocuments({
              user: post.creator,
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

        const isLiked = post.likes.some(
          (like) => like.liker._id.toString() === user.id
        );
        const isCommented = post.comments.some(
          (comment) => comment.commentor._id.toString() === user.id
        );
        const isSaved = post.saves.some(
          (save) => save.user._id.toString() === user.id
        );

        return {
          id: post._id,
          ...post._doc,
          isLiked,
          isCommented,
          isSaved
        };
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
