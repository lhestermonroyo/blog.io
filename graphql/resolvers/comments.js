const { UserInputError } = require('apollo-server');
const pubSub = require('../../pubSub');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Notification = require('../../models/Notification');
const { checkAuth } = require('../../utils/auth.util');
const { validateCommentInput } = require('../../utils/validators.util');
const {
  profileBadgeProj,
  populateComment,
  populateNotification
} = require('../../utils/populate.util');

const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

module.exports = {
  Mutation: {
    async createComment(_, { postId, body }, context) {
      try {
        const user = await checkAuth(context);

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
        await post.populate(populateComment);

        if (notification) {
          const existing = notification.latestUser.some(
            (user) => user._id.toString() === currUser._id.toString()
          );

          if (!existing) {
            notification.latestUser.unshift(currUser);

            const msgUser = notification.latestUser[0];

            if (notification.latestUser.length === 1) {
              notification.message = `${msgUser.firstName} ${msgUser.lastName} commented your post "${post.title}".`;
            } else {
              notification.message = `${msgUser.firstName} ${
                msgUser.lastName
              } and ${
                notification.latestUser.length - 1
              } others commented your post "${post.title}".`;
            }

            notification.comment = post.comments[0];
            notification.isRead = false;
            notification.createdAt = new Date().toISOString();
            await notification.save();
          }
        } else {
          notification = new Notification({
            user: post.creator,
            sender: user.id,
            type: 'new_comment',
            post: postId,
            comment: post.comments[0],
            message: `${currUser.firstName} ${currUser.lastName} commented on your post "${post.title}".`,
            latestUser: [currUser.id],
            createdAt: new Date().toISOString()
          });
          await notification.save();
        }

        const exists = await Notification.exists({ _id: notification._id });

        if (exists) {
          await notification.populate(populateNotification);
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

        return {
          comments: post.comments
        };
      } catch (error) {
        console.log('error', error);
        throw new Error(error);
      }
    },
    async likeComment(_, { postId, commentId }, context) {
      try {
        const user = await checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const requests = [Post.findById(postId), User.findById(user.id)];

        let [post, currUser] = await Promise.all(requests);

        if (!post) {
          throw new Error('Post not found');
        }

        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentId
        );
        const comment = post.comments[commentIndex];

        if (!comment) {
          throw new Error('Comment not found');
        }

        const alreadyLiked = comment.likes.find(
          (like) => like.liker.toString() === user.id
        );

        let notification = await Notification.findOne({
          user: comment.commentor,
          post: postId,
          comment: commentId,
          type: 'like_comment'
        }).populate('latestUser', profileBadgeProj);

        if (alreadyLiked) {
          comment.likes = comment.likes.filter(
            (like) => like.liker.toString() !== user.id
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
                notification.message = `${msgUser.firstName} ${msgUser.lastName} liked your comment "${comment.body}".`;
              } else {
                notification.message = `${msgUser.firstName} ${
                  msgUser.lastName
                } and ${
                  notification.latestUser.length - 1
                } others liked your comment "${comment.body}".`;
              }

              notification.createdAt = new Date().toISOString();
              await notification.save();
            }
          }
        } else {
          comment.likes.push({
            liker: user.id,
            createdAt: new Date().toISOString()
          });

          if (!notification) {
            notification = new Notification({
              user: comment.commentor,
              sender: user.id,
              type: 'like_comment',
              post: postId,
              comment: commentId,
              latestUser: [user.id],
              message: `${currUser.firstName} ${currUser.lastName} liked your comment "${comment.body}".`,
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
                notification.message = `${currUser.firstName} ${currUser.lastName} liked your comment "${comment.body}".`;
              } else {
                notification.message = `${currUser.firstName} ${
                  currUser.lastName
                } and ${
                  notification.latestUser.length - 1
                } others liked your comment "${comment.body}".`;
              }

              notification.isRead = false;
              notification.createdAt = new Date().toISOString();
            }
            await notification.save();
          }
        }
        await post.save();
        await post.populate(populateComment);

        const exists = await Notification.exists({ _id: notification._id });

        if (exists) {
          await notification.populate(populateNotification);
          const unreadCount = await Notification.countDocuments({
            user: comment.commentor._id,
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

        return {
          comments: post.comments
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateComment(_, { postId, commentId, body }, context) {
      try {
        const user = await checkAuth(context);

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
        await post.populate(populateComment);

        return {
          comments: post.comments
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async deleteComment(_, { postId, commentId }, context) {
      try {
        const user = await checkAuth(context);

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
        await post.populate(populateComment);

        return {
          comments: post.comments
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async createReply(_, { postId, commentId, body }, context) {
      try {
        const user = await checkAuth(context);

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
            comment: commentId,
            type: 'reply_comment'
          }).populate('latestUser', profileBadgeProj),
          User.findById(user.id)
        ];

        let [post, notification, currUser] = await Promise.all(requests);

        if (!post) {
          throw new Error('Post not found');
        }

        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentId
        );
        const comment = post.comments[commentIndex];

        if (!comment) {
          throw new Error('Comment not found');
        }

        comment.replies.unshift({
          body,
          replier: user.id,
          likes: [],
          isEdited: false,
          createdAt: new Date().toISOString()
        });
        await post.save();
        await post.populate(populateComment);

        if (notification) {
          const existing = notification.latestUser.some(
            (user) => user._id.toString() === currUser._id.toString()
          );

          if (!existing) {
            notification.latestUser.unshift(currUser);

            const msgUser = notification.latestUser[0];

            if (notification.latestUser.length === 1) {
              notification.message = `${msgUser.firstName} ${msgUser.lastName} replied to your comment "${comment.body}".`;
            } else {
              notification.message = `${msgUser.firstName} ${
                msgUser.lastName
              } and ${
                notification.latestUser.length - 1
              } others replied to your comment "${comment.body}".`;
            }

            notification.comment = post.comments[0];
            notification.isRead = false;
            notification.createdAt = new Date().toISOString();
            await notification.save();
          }
        } else {
          notification = new Notification({
            user: comment.commentor,
            sender: user.id,
            type: 'reply_comment',
            post: postId,
            comment: commentId,
            message: `${currUser.firstName} ${currUser.lastName} replied to your comment "${comment.body}".`,
            latestUser: [currUser.id],
            createdAt: new Date().toISOString()
          });
          await notification.save();
        }

        const exists = await Notification.exists({ _id: notification._id });

        if (exists) {
          await notification.populate(populateNotification);
          const unreadCount = await Notification.countDocuments({
            user: comment.commentor._id,
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
        return {
          comments: post.comments
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async likeReply(_, { postId, commentId, replyId }, context) {
      try {
        const user = await checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const requests = [Post.findById(postId), User.findById(user.id)];

        let [post, currUser] = await Promise.all(requests);

        if (!post) {
          throw new Error('Post not found');
        }

        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentId
        );
        const comment = post.comments[commentIndex];

        if (!comment) {
          throw new Error('Comment not found');
        }

        const replyIndex = comment.replies.findIndex(
          (reply) => reply.id === replyId
        );
        const reply = comment.replies[replyIndex];

        if (!reply) {
          throw new Error('Reply not found');
        }

        const alreadyLiked = reply.likes.find(
          (like) => like.liker.toString() === user.id
        );

        let notification = await Notification.findOne({
          user: reply.replier,
          post: postId,
          comment: commentId,
          type: 'like_reply'
        }).populate('latestUser', profileBadgeProj);

        if (alreadyLiked) {
          reply.likes = reply.likes.filter(
            (like) => like.liker.toString() !== user.id
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
                notification.message = `${msgUser.firstName} ${msgUser.lastName} liked your reply "${reply.body}".`;
              } else {
                notification.message = `${msgUser.firstName} ${
                  msgUser.lastName
                } and ${
                  notification.latestUser.length - 1
                } others liked your reply "${reply.body}".`;
              }

              notification.createdAt = new Date().toISOString();
              await notification.save();
            }
          }
        } else {
          reply.likes.push({
            liker: user.id,
            createdAt: new Date().toISOString()
          });

          if (!notification) {
            notification = new Notification({
              user: reply.replier,
              sender: user.id,
              type: 'like_reply',
              post: postId,
              comment: commentId,
              latestUser: [user.id],
              message: `${currUser.firstName} ${currUser.lastName} liked your reply "${reply.body}".`,
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
                notification.message = `${currUser.firstName} ${currUser.lastName} liked your reply "${reply.body}".`;
              } else {
                notification.message = `${currUser.firstName} ${
                  currUser.lastName
                } and ${
                  notification.latestUser.length - 1
                } others liked your reply "${reply.body}".`;
              }

              notification.isRead = false;
              notification.createdAt = new Date().toISOString();
            }
            await notification.save();
          }
        }
        await post.save();
        await post.populate(populateComment);

        const exists = await Notification.exists({ _id: notification._id });

        if (exists) {
          await notification.populate(populateNotification);
          const unreadCount = await Notification.countDocuments({
            user: reply.replier._id,
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

        return {
          comments: post.comments
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateReply(_, { postId, commentId, replyId, body }, context) {
      try {
        const user = await checkAuth(context);

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
        const comment = post.comments[commentIndex];

        if (!comment) {
          throw new Error('Comment not found');
        }

        const replyIndex = comment.replies.findIndex(
          (reply) => reply.id === replyId
        );
        const reply = comment.replies[replyIndex];

        if (!reply) {
          throw new Error('Reply not found');
        }

        if (reply.replier.toString() !== user.id) {
          throw new Error('User not allowed to update reply');
        }

        reply.body = body;
        reply.isEdited = true;
        await post.save();
        await post.populate(populateComment);

        return {
          comments: post.comments
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async deleteReply(_, { postId, commentId, replyId }, context) {
      try {
        const user = await checkAuth(context);

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
        const comment = post.comments[commentIndex];

        if (!comment) {
          throw new Error('Comment not found');
        }

        const replyIndex = comment.replies.findIndex(
          (reply) => reply.id === replyId
        );
        const reply = comment.replies[replyIndex];

        if (!reply) {
          throw new Error('Reply not found');
        }

        if (reply.replier.toString() !== user.id) {
          throw new Error('User not allowed to delete reply');
        }

        comment.replies.splice(replyIndex, 1);
        await post.save();
        await post.populate(populateComment);

        return {
          comments: post.comments
        };
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
