const { UserInputError } = require('apollo-server');

const SubForum = require('../../models/SubForum');
const { checkAuth } = require('../../utils/auth.util');
const { validateSubForumInput } = require('../../utils/validators.util');

module.exports = {
  Query: {
    async getSubForums(_, __, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const subForums = await SubForum.find()
          .sort({ createdAt: -1 })
          .populate('creator');

        return subForums.map(subForum => ({
          id: subForum._id,
          ...subForum._doc,
        }));
      } catch (error) {
        throw new Error(error);
      }
    },
    async getSubForum(_, { id }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const subForum = await SubForum.findById(id).populate('creator');

        if (!subForum) {
          throw new Error('Subforum not found');
        }

        return {
          id: subForum._id,
          ...subForum._doc,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createSubForum(_, { subForumInput }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const { name, description } = subForumInput;

        const { valid, errors } = validateSubForumInput(name, description);

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        const subForum = await SubForum.findOne({ name });

        if (subForum) {
          errors.name = 'Subforum already exists';
          throw new UserInputError('Subforum already exists', { errors });
        }

        const newSubforum = new SubForum({
          name,
          description,
          creator: user.id,
          createdAt: new Date().toISOString(),
        });

        await newSubforum.save();
        await newSubforum.populate('creator');

        return {
          id: newSubforum._id,
          ...newSubforum._doc,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async editSubForum(_, { subForumId, subForumInput }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const { name, description } = subForumInput;

        const { valid, errors } = validateSubForumInput(name, description);

        if (!valid) {
          throw new UserInputError('Validation Error', { errors });
        }

        const subForum = await SubForum.findById(subForumId);

        if (!subForum) {
          throw new Error('Subforum not found');
        }

        if (subForum.creator.toString() !== user.id) {
          throw new Error('Unauthorized');
        }

        subForum.name = name;
        subForum.description = description;

        await subForum.save();
        await subForum.populate('creator');

        return {
          id: subForum._id,
          ...subForum._doc,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async deleteSubForum(_, { subForumId }, context) {
      try {
        const user = checkAuth(context);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const subForum = await SubForum.findById(subForumId);

        if (!subForum) {
          throw new Error('Subforum not found');
        }

        if (subForum.creator.toString() !== user.id) {
          throw new Error('Unauthorized');
        }

        await subForum.delete();

        const subForums = await SubForum.find().populate('creator');

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
