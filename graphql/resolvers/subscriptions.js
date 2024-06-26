const SubForum = require('../../models/SubForum');
const { checkAuth } = require('../../utils/auth.util');

module.exports = {
  Mutation: {
    async joinSubForum(_, { subForumId }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const subForum = await SubForum.findById(subForumId);

        if (!subForum) {
          throw new Error('Subforum not found.');
        }

        if (subForum.subscribers.find(sub => sub.toString() === user.id)) {
          throw new Error('Already joined this subforum.');
        }

        subForum.subscribers.push(user.id);
        await subForum.save();
        await subForum.populate(['creator', 'subscribers']);

        return {
          id: subForum._id,
          ...subForum._doc,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async leaveSubForum(_, { subForumId }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const subForum = await SubForum.findById(subForumId);

        if (!subForum) {
          throw new Error('SubForum not found.');
        }

        if (!subForum.subscribers.find(sub => sub.toString() === user.id)) {
          throw new Error('Not subscribed to this subforum.');
        }

        subForum.subscribers = subForum.subscribers.filter(
          sub => sub.toString() !== user.id
        );
        await subForum.save();
        await subForum.populate(['creator', 'subscribers']);

        return {
          id: subForum._id,
          ...subForum._doc,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Query: {
    async getJoinedSubForums(_, __, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated.');
        }

        const subForums = await SubForum.find({
          subscribers: { $in: [user.id] },
        })
          .sort({ createdAt: -1 })
          .populate('creator')
          .populate('subscribers');

        return subForums.map(subForum => ({
          id: subForum._id,
          ...subForum._doc,
        }));
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
