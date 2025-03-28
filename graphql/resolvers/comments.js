const { UserInputError } = require('apollo-server');
const pubSub = require('../../pubSub');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Notification = require('../../models/Notification');
const { checkAuth } = require('../../utils/auth.util');
const { validateCommentInput } = require('../../utils/validators.util');

const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

const profileBadgeProj = '_id email firstName lastName avatar';
const postBadgeProj = '_id title';

module.exports = {
  Mutation: {
    async createComment(_, { postId, body }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const { valid, errors } = validateCommentInput(body);

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        const requests = [
          Post.findById(postId),
          Notification.findOne({
            post: postId,
            type: 'new_comment'
          }).populate('latestUser', profileBadgeProj),
          User.findById(user.id)
        ];
        let [post, notification, currUser] = await Promise.all(requests);

        if (!post) {
          throw new Error('Post not found');
        }

        post.comments.unshift({
          body,
          commentor: user.id,
          isEdited: false,
          createdAt: new Date().toISOString()
        });
        await post.save();

        if (notification) {
          const existing = notification.latestUser.some(
            (user) => user._id.toString() === currUser._id.toString()
          );

          if (!existing) {
            notification.latestUser.unshift(currUser);

            const msgUser = notification.latestUser[0];

            if (notification.latestUser.length === 1) {
              notification.message = `${msgUser.firstName} ${msgUser.lastName} commented your post.`;
            } else {
              notification.message = `${msgUser.firstName} ${
                msgUser.lastName
              } and ${
                notification.latestUser.length - 1
              } others commented your post.`;
            }

            notification.isRead = false;
            notification.createdAt = new Date().toISOString();
            await notification.save();
          }
        } else {
          notification = new Notification({
            user: post.creator,
            sender: user.id,
            post: postId,
            type: 'new_comment',
            message: `${currUser.firstName} ${currUser.lastName} commented on your post.`,
            latestUser: [currUser.id],
            createdAt: new Date().toISOString()
          });
          await notification.save();
        }

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
        console.log('error', error);
        throw new Error(error);
      }
    },
    async updateComment(_, { postId, commentId, body }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const { valid, errors } = validateCommentInput(body);

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        const post = await Post.findById(postId);

        if (!post) {
          throw new Error('Post not found');
        }

        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentId
        );

        if (post.comments[commentIndex].commentor.toString() !== user.id) {
          throw new Error('User not allowed to update comment');
        }

        post.comments[commentIndex].body = body;
        post.comments[commentIndex].isEdited = true;
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
    },
    async deleteComment(_, { postId, commentId }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const post = await Post.findById(postId);

        if (!post) {
          throw new Error('Post not found');
        }

        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentId
        );

        if (post.comments[commentIndex].commentor.toString() !== user.id) {
          throw new Error('User not allowed to delete comment');
        }

        post.comments.splice(commentIndex, 1);
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
