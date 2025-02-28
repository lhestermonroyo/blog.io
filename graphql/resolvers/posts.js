const { UserInputError } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');

const Post = require('../../models/Post');
const { checkAuth } = require('../../utils/auth.util');
const { validatePostInput } = require('../../utils/validators.util');

const pubSub = new PubSub();

const NEW_POST = 'NEW_POST';

const postProj = '_id title content creator tags createdAt';
const profileBadgeProj = '_id email firstName lastName profilePhoto';

module.exports = {
  Query: {
    async getPosts(_, __, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const posts = await Post.find({}, postProj)
          .sort({ createdAt: -1 })
          .populate('creator', profileBadgeProj);

        return posts.map((post) => {
          return {
            id: post._id,
            ...post._doc
          };
        });
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPostsByCreator(_, { creator }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const posts = await Post.find({ creator })
          .sort({ createdAt: -1 })
          .populate('creator', profileBadgeProj);

        return posts.map((post) => {
          return {
            id: post._id,
            ...post._doc
          };
        });
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPostById(_, { postId }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const post = await Post.findById(postId)
          .populate('creator', profileBadgeProj)
          .populate({
            path: 'likes',
            model: 'Like',
            populate: {
              path: 'liker',
              model: 'User',
              select: profileBadgeProj
            }
          })
          .populate({
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'commentor',
              model: 'User',
              select: profileBadgeProj
            }
          });

        if (!post) {
          throw new Error('Post not found');
        }

        return {
          id: post._id,
          ...post._doc
        };
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  Mutation: {
    async createPost(_, { postInput }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const { title, content, tags } = postInput;

        const { valid, errors } = validatePostInput(title, content);

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        const newPost = new Post({
          title,
          content,
          tags,
          creator: user.id,
          comments: [],
          likes: [],
          createdAt: new Date().toISOString()
        });
        await newPost.save();
        await newPost.populate([
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
          }
        ]);
        const post = {
          id: newPost._id,
          ...newPost._doc
        };

        pubSub.publish(NEW_POST, {
          onNewPost: post
        });

        return post;
      } catch (error) {
        throw new Error(error);
      }
    },
    async updatePost(_, { postId, postInput }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const { title, content, tags } = postInput;

        const { valid, errors } = validatePostInput(title, content);

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        const post = await Post.findById(postId);

        if (!post) {
          throw new Error('Post not found');
        }

        if (post.creator.toString() !== user.id) {
          throw new Error('User not authorized');
        }

        post.title = title;
        post.content = content;
        post.tags = tags;

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
              model: 'User'
            }
          },
          {
            path: 'likes',
            model: 'Like',
            populate: {
              path: 'liker',
              model: 'User'
            }
          }
        ]);

        return {
          id: post._id,
          ...post._doc
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async deletePost(_, { postId }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const post = await Post.findById(postId);

        if (!post) {
          throw new Error('Post not found');
        }

        if (post.creator.toString() !== user.id) {
          throw new Error('User not authorized');
        }

        await post.delete();
        return 'Post deleted successfully';
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  Subscription: {
    onNewPost: {
      subscribe: () => pubSub.asyncIterator([NEW_POST])
    }
  }
};
