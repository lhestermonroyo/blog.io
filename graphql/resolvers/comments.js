const Post = require('../../models/Post');
const { checkAuth } = require('../../utils/auth.util');
const { validateCommentInput } = require('../../utils/validators.util');

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
          creator: user.id,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        await post.populate([
          'creator',
          {
            path: 'subForum',
            model: 'SubForum',
            populate: {
              path: 'creator',
              model: 'User',
            },
          },
          {
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'creator',
              model: 'User',
            },
          },
        ]);

        return {
          id: post._id,
          ...post._doc,
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
          comment => comment.id === commentId
        );

        if (post.comments[commentIndex].creator.toString() !== user.id) {
          throw new Error('User not allowed to delete comment');
        }

        post.comments.splice(commentIndex, 1);
        await post.save();
        await post.populate([
          'creator',
          {
            path: 'subForum',
            model: 'SubForum',
            populate: {
              path: 'creator',
              model: 'User',
            },
          },
          {
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'creator',
              model: 'User',
            },
          },
        ]);
        return {
          id: post._id,
          ...post._doc,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async upVoteComment(_, { postId, commentId }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const post = await Post.findById(postId);

        if (!post) {
          throw new Error('Post not found');
        }

        if (!post.comments.find(comment => comment.id === commentId)) {
          throw new Error('Comment not found');
        }

        const comment = post.comments.find(comment => comment.id === commentId);

        if (
          comment.downvotes.find(downvote => downvote.toString() === user.id)
        ) {
          comment.downvotes = comment.downvotes.filter(
            downvote => downvote.toString() !== user.id
          );
        }

        if (comment.upvotes.find(upvote => upvote.toString() === user.id)) {
          comment.upvotes = comment.upvotes.filter(
            upvote => upvote.toString() !== user.id
          );
        } else {
          comment.upvotes.push(user.id);
        }

        await post.save();
        await post.populate([
          'creator',
          {
            path: 'subForum',
            model: 'SubForum',
            populate: {
              path: 'creator',
              model: 'User',
            },
          },
          {
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'creator',
              model: 'User',
            },
          },
        ]);

        return {
          id: post._id,
          ...post._doc,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async downVoteComment(_, { postId, commentId }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const post = await Post.findById(postId);

        if (!post) {
          throw new Error('Post not found');
        }

        if (!post.comments.find(comment => comment.id === commentId)) {
          throw new Error('Comment not found');
        }

        const comment = post.comments.find(comment => comment.id === commentId);

        if (comment.upvotes.find(upvote => upvote.toString() === user.id)) {
          comment.upvotes = comment.upvotes.filter(
            upvote => upvote.toString() !== user.id
          );
        }

        if (
          comment.downvotes.find(downvote => downvote.toString() === user.id)
        ) {
          comment.downvotes = comment.downvotes.filter(
            downvote => downvote.toString() !== user.id
          );
        } else {
          comment.downvotes.push(user.id);
        }

        await post.save();
        await post.populate([
          'creator',
          {
            path: 'subForum',
            model: 'SubForum',
            populate: {
              path: 'creator',
              model: 'User',
            },
          },
          {
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'creator',
              model: 'User',
            },
          },
        ]);

        return {
          id: post._id,
          ...post._doc,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
