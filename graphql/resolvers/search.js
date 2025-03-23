const User = require('../../models/User');
const Post = require('../../models/Post');
const { checkAuth } = require('../../utils/auth.util');

const profileBadgeProj = '_id email firstName lastName avatar';

module.exports = {
  Mutation: {
    getSearchResults: async (_, { query }, context) => {
      const user = checkAuth(context);

      if (!user) {
        throw new Error('User not authenticated');
      }

      const users = await User.find(
        {
          $or: [
            { firstName: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { title: { $regex: query, $options: 'i' } }
          ]
        },
        profileBadgeProj
      );

      const posts = await Post.find({
        $or: [
          { creator: { $in: users.map((user) => user._id) } },
          { title: { $regex: query, $options: 'i' } },
          { body: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } }
        ]
      }).populate('creator', profileBadgeProj);

      const tags = await Post.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: null, allTags: { $addToSet: '$tags' } } }
      ]);
      const tagResults = tags[0].allTags
        .filter((tag) => tag.toLowerCase().startsWith(query.toLowerCase()))
        .sort();

      return {
        users,
        tags: tagResults,
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
    }
  }
};
