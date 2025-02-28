const userResolver = require('./users');
const postResolver = require('./posts');
const likeResolver = require('./likes');
const commentResolver = require('./comments');
const followResolver = require('./follows');

module.exports = {
  Post: {
    likeCount: parent => parent.likes.length,
    commentCount: parent => parent.comments.length,
  },
  Profile: {
    age: parent => {
      if (!parent.birthdate) {
        return 0;
      }

      const birthdate = new Date(parent.birthdate);
      const ageDiffMs = Date.now() - birthdate.getTime();
      const ageDate = new Date(ageDiffMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    },
  },
  Query: {
    ...userResolver.Query,
    ...postResolver.Query,
    ...followResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postResolver.Mutation,
    ...likeResolver.Mutation,
    ...commentResolver.Mutation,
    ...followResolver.Mutation,
  },
  Subscription: {
    ...postResolver.Subscription,
    ...commentResolver.Subscription,
    ...likeResolver.Subscription,
  },
};
