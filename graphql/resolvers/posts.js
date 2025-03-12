const { UserInputError } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');

const Post = require('../../models/Post');
const { checkAuth } = require('../../utils/auth.util');
const { validatePostInput } = require('../../utils/validators.util');

const pubSub = new PubSub();

const NEW_POST = 'NEW_POST';

const profileBadgeProj = '_id email firstName lastName avatar';

module.exports = {
  Query: {
    async getPosts(_, { limit }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const query = Post.find()
          .sort({ createdAt: -1 })
          .populate('creator', profileBadgeProj);

        if (limit) {
          query.limit(limit);
        }

        const posts = await query;
        const totalCount = await Post.countDocuments();

        return {
          totalCount,
          posts: posts.map((post) => {
            const isLiked = post._doc.likes.some(
              (like) => like.liker.toString() === user.id
            );
            const isCommented = post._doc.comments.some(
              (comment) => comment.commentor.toString() === user.id
            );
            const likeCount = post._doc.likes.length ?? 0;
            const commentCount = post._doc.comments.length ?? 0;

            delete post._doc.likes;
            delete post._doc.comments;

            return {
              id: post._id,
              ...post._doc,
              likeCount,
              commentCount,
              isLiked,
              isCommented
            };
          })
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPostsByCreator(_, { creator, limit }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const query = Post.find({ creator })
          .sort({ createdAt: -1 })
          .populate('creator', profileBadgeProj);

        if (limit) {
          query.limit(limit);
        }

        const posts = await query;
        const totalCount = await Post.countDocuments({ creator });

        return {
          totalCount,
          posts: posts.map((post) => {
            const isLiked = post._doc.likes.some(
              (like) => like.liker.toString() === user.id
            );
            const isCommented = post._doc.comments.some(
              (comment) => comment.commentor.toString() === user.id
            );
            const likeCount = post._doc.likes.length ?? 0;
            const commentCount = post._doc.comments.length ?? 0;

            delete post._doc.likes;
            delete post._doc.comments;

            return {
              id: post._id,
              ...post._doc,
              likeCount,
              commentCount,
              isLiked,
              isCommented
            };
          })
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPostsByTags(_, { tags, limit }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const query = Post.find({
          tags: {
            $in: [...tags]
          }
        })
          .sort({ createdAt: -1 })
          .populate('creator', profileBadgeProj);

        if (limit) {
          query.limit(limit);
        }

        const posts = await query;
        const totalCount = await Post.countDocuments({
          tags: {
            $in: [...tags]
          }
        });

        return {
          totalCount,
          posts: posts.map((post) => {
            const isLiked = post._doc.likes.some(
              (like) => like.liker.toString() === user.id
            );
            const isCommented = post._doc.comments.some(
              (comment) => comment.commentor.toString() === user.id
            );
            const likeCount = post._doc.likes.length ?? 0;
            const commentCount = post._doc.comments.length ?? 0;

            delete post._doc.likes;
            delete post._doc.comments;

            return {
              id: post._id,
              ...post._doc,
              likeCount,
              commentCount,
              isLiked,
              isCommented
            };
          })
        };
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
    },
    async getTags(_, __, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const tags = await Post.aggregate([
          { $unwind: '$tags' },
          { $group: { _id: null, allTags: { $addToSet: '$tags' } } }
        ]);
        const uniqueTags = tags.length > 0 ? tags[0].allTags : [];
        return uniqueTags.sort((a, b) => a.localeCompare(b));
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

        await post.deleteOne();
        return {
          success: true
        };
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
