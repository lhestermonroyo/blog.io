const Post = require('../../models/Post');
const User = require('../../models/User');
const { checkAuth } = require('../../utils/auth.util');

module.exports = {
  Mutation: {
    async assignTags(_, { tags }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const response = await User.findByIdAndUpdate(
          user.id,
          {
            $set: {
              tags
            }
          },
          { new: true }
        );
        await response.save();

        return {
          id: response._id,
          ...response._doc
        };
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  Query: {
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
  }
};
