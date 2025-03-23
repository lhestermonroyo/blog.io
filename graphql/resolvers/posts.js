const { UserInputError } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Follow = require('../../models/Follow');
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
          posts: posts.map(async (post) => {
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
          })
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPostsByFollowing(_, { limit }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const following = await Follow.find({ follower: user.email });
        const followingEmails = following.map((follow) => follow.following);
        const followingUsers = await User.find(
          { email: { $in: followingEmails } },
          profileBadgeProj
        );
        const creatorIds = followingUsers.map((user) => user._id);

        const query = Post.find({
          creator: {
            $in: creatorIds
          }
        })
          .sort({ createdAt: -1 })
          .populate('creator', profileBadgeProj);

        if (limit) {
          query.limit(limit);
        }

        const posts = await query;
        const totalCount = await Post.countDocuments({
          creator: {
            $in: creatorIds
          }
        });

        return {
          totalCount,
          posts: posts.map(async (post) => {
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
          posts: posts.map(async (post) => {
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
          posts: posts.map(async (post) => {
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
          .populate('creator')
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
          })
          .populate({
            path: 'saves',
            model: 'Save',
            populate: {
              path: 'user',
              model: 'User',
              select: profileBadgeProj
            }
          });

        if (!post) {
          throw new Error('Post not found');
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
            model: 'User'
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

        const isLiked = newPost.likes.some(
          (like) => like.liker._id.toString() === user.id
        );
        const isCommented = newPost.comments.some(
          (comment) => comment.commentor._id.toString() === user.id
        );
        const isSaved = newPost.saves.some(
          (save) => save.user._id.toString() === user.id
        );

        const post = {
          id: newPost._id,
          ...newPost._doc,
          isLiked,
          isCommented,
          isSaved
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
            model: 'User'
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
    },
    async savePost(_, { postId }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const post = await Post.findById(postId);

        if (!post) {
          throw new UserInputError('Post not found.');
        }

        const alreadySaved = post.saves.some(
          (save) => save.user.toString() === user.id
        );

        if (alreadySaved) {
          post.saves = post.saves.filter(
            (save) => save.user.toString() !== user.id
          );
        } else {
          post.saves.push({
            user: user.id,
            createdAt: new Date().toISOString()
          });
        }
        await post.save();
        await post.populate([
          {
            path: 'creator',
            model: 'User'
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
    onNewPost: {
      subscribe: () => pubSub.asyncIterator([NEW_POST])
    }
  }
};
