const { PubSub } = require('graphql-subscriptions');

const Post = require('../../models/Post');
const { checkAuth } = require('../../utils/auth.util');

const pubSub = new PubSub();

const LIKE_POST = 'LIKE_POST';

const profileBadgeProj = '_id email firstName lastName profilePhoto';

module.exports = {
  Mutation: {
    async likePost(_, { postId }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const post = await Post.findById(postId);

        if (!post) {
          throw new Error('Post not found');
        }

        const isLiked = post.likes.find(
          (like) => like.liker.toString() === user.id.toString()
        );

        if (isLiked) {
          post.likes = post.likes.filter(
            (like) => like.liker.toString() !== user.id.toString()
          );
        } else {
          post.likes.push({
            liker: user.id,
            createdAt: new Date().toISOString()
          });
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
          }
        ]);

        pubSub.publish(LIKE_POST, {
          onLikePost: {
            id: post._id,
            ...post._doc
          }
        });

        return {
          id: post._id,
          ...post._doc
        };
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  Subscription: {
    onLikePost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator([LIKE_POST])
    }
  }
};
