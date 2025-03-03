const userResolver = require('./users');
const postResolver = require('./posts');
const likeResolver = require('./likes');
const commentResolver = require('./comments');
const followResolver = require('./follows');
const tagsResolver = require('./tags');
const tags = require('./tags');

module.exports = {
  Posts: {
    currentCount: (parent) => parent.posts.length
  },
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length
  },
  Profile: {
    age: (parent) => {
      if (!parent.birthdate) {
        return 0;
      }

      const birthdate = new Date(parent.birthdate);
      const ageDiffMs = Date.now() - birthdate.getTime();
      const ageDate = new Date(ageDiffMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
  },
  Follows: {
    followersCount: (parent) => parent.followers.length,
    followingCount: (parent) => parent.following.length
  },
  Query: {
    ...userResolver.Query,
    ...postResolver.Query,
    ...followResolver.Query,
    ...tagsResolver.Query
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postResolver.Mutation,
    ...likeResolver.Mutation,
    ...commentResolver.Mutation,
    ...followResolver.Mutation,
    ...tagsResolver.Mutation
  },
  Subscription: {
    ...postResolver.Subscription,
    ...commentResolver.Subscription,
    ...likeResolver.Subscription
  }
};
