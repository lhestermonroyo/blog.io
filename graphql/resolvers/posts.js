const { UserInputError } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');

const Post = require('../../models/Post');
const { checkAuth } = require('../../utils/auth.util');
const { validatePostInput } = require('../../utils/validators.util');

const pubSub = new PubSub();

const NEW_POST = 'NEW_POST';

module.exports = {
  Query: {
    async getPosts(_, __, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const posts = await Post.find()
          .sort({ createdAt: -1 })
          .populate('creator')
          .populate({
            path: 'subForum',
            model: 'SubForum',
            populate: {
              path: 'creator',
              model: 'User',
            },
          })
          .populate({
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'creator',
              model: 'User',
            },
          });

        return posts.map(post => {
          return {
            id: post._id,
            ...post._doc,
          };
        });
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(_, { id }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const post = await Post.findById(id)
          .populate('creator')
          .populate({
            path: 'subForum',
            model: 'SubForum',
            populate: {
              path: 'creator',
              model: 'User',
            },
          })
          .populate({
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'creator',
              model: 'User',
            },
          });

        if (!post) {
          throw new Error('Post not found');
        }

        return {
          id: post._id,
          ...post._doc,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createPost(_, { postInput }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const { title, body, files, subForum } = postInput;

        const { valid, errors } = validatePostInput(title, body, subForum);

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        if (!subForum) {
          errors.general = 'Subforum not found';
          throw new UserInputError('SubForum not found', { errors });
        }

        const newPost = new Post({
          title,
          body,
          files,
          creator: user.id,
          subForum,
          comments: [],
          upvotes: [],
          downvotes: [],
          createdAt: new Date().toISOString(),
        });
        await newPost.save();
        await newPost.populate([
          'creator',
          {
            path: 'subForum',
            model: 'SubForum',
            populate: {
              path: 'creator',
              model: 'User',
            },
          },
        ]);
        const post = {
          id: newPost._id,
          ...newPost._doc,
        };

        pubSub.publish(NEW_POST, {
          onNewPost: post,
        });

        return post;
      } catch (error) {
        throw new Error(error);
      }
    },
    async upVotePost(_, { postId }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const post = await Post.findById(postId);

        if (!post) {
          throw new Error('Post not found');
        }

        if (post.downvotes.find(downvote => downvote.toString() === user.id)) {
          post.downvotes = post.downvotes.filter(
            downvote => downvote.toString() !== user.id
          );
        }

        if (post.upvotes.find(upvote => upvote.toString() === user.id)) {
          post.upvotes = post.upvotes.filter(
            upvote => upvote.toString() !== user.id
          );
        } else {
          post.upvotes.push(user.id);
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
    async downVotePost(_, { postId }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const post = await Post.findById(postId);

        if (!post) {
          throw new Error('Post not found');
        }

        if (post.upvotes.find(upvote => upvote.toString() === user.id)) {
          post.upvotes = post.upvotes.filter(
            upvote => upvote.toString() !== user.id
          );
        }

        if (post.downvotes.find(downvote => downvote.toString() === user.id)) {
          post.downvotes = post.downvotes.filter(
            downvote => downvote.toString() !== user.id
          );
        } else {
          post.downvotes.push(user.id);
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
  Subscription: {
    onNewPost: {
      subscribe: () => pubSub.asyncIterator([NEW_POST]),
    },
  },
};
