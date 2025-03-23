const { PubSub } = require('graphql-subscriptions');
const { UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const { checkAuth } = require('../../utils/auth.util');
const { validateCommentInput } = require('../../utils/validators.util');

const pubSub = new PubSub();

const NEW_COMMENT = 'NEW_COMMENT';

const profileBadgeProj = '_id email firstName lastName avatar';

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

        const post = await Post.findById(postId);

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

        pubSub.publish(NEW_COMMENT, {
          onNewComment: {
            id: post._id,
            ...post._doc
          }
        });

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
  },
  Subscription: {
    onNewComment: {
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator('NEW_COMMENT')
    }
  }
};
