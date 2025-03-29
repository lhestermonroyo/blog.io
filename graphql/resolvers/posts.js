const { UserInputError } = require('apollo-server');
const pubSub = require('../../pubSub');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Follow = require('../../models/Follow');
const Notification = require('../../models/Notification');
const { checkAuth } = require('../../utils/auth.util');
const { validatePostInput } = require('../../utils/validators.util');

const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

const profileBadgeProj = '_id email firstName lastName avatar';
const postBadgeProj = '_id title';

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

        // notify followers
        const followers = (await Follow.find({ following: user.email })).map(
          (follow) => follow.follower
        );
        const followerUsers = await User.find(
          { email: { $in: followers } },
          profileBadgeProj
        );

        followerUsers.forEach(async (follower) => {
          const authorName = `${newPost.creator?.firstName} ${newPost.creator?.lastName}`;

          const notification = new Notification({
            user: follower._id,
            sender: user.id,
            type: 'new_post',
            latestUser: [user.id],
            post: newPost._id,
            message: `${authorName} created a new post.`,
            createdAt: new Date().toISOString()
          });
          await notification.save();

          const unreadCount = await Notification.countDocuments({
            user: follower._id,
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
        });

        return {
          id: newPost._id,
          ...newPost._doc
        };
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
    },
    async savePost(_, { postId }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const requests = [
          Post.findById(postId),
          Notification.findOne({
            post: postId,
            type: 'save'
          }).populate('latestUser', profileBadgeProj),
          User.findById(user.id)
        ];
        let [post, notification, currUser] = await Promise.all(requests);

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
                notification.message = `${msgUser.firstName} ${msgUser.lastName} saved your post.`;
              } else {
                notification.message = `${msgUser.firstName} ${
                  msgUser.lastName
                } and ${
                  notification.latestUser.length - 1
                } others saved your post.`;
              }

              notification.createdAt = new Date().toISOString();
              await notification.save();
            }
          }
        } else {
          post.saves.push({
            user: user.id,
            createdAt: new Date().toISOString()
          });

          if (!notification) {
            notification = new Notification({
              user: post.creator,
              sender: user.id,
              type: 'save',
              post: postId,
              latestUser: [user.id],
              message: `${currUser.firstName} ${currUser.lastName} saved your post.`,
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
                notification.message = `${currUser.firstName} ${currUser.lastName} saved your post.`;
              } else {
                notification.message = `${currUser.firstName} ${
                  currUser.lastName
                } and ${
                  notification.latestUser.length - 1
                } others saved your post.`;
                notification.isRead = false;
                notification.createdAt = new Date().toISOString();
              }

              await notification.save();
            }
          }
        }
        await post.save();
        await post.populate([
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

        return {
          saves: post.saves
        };
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
