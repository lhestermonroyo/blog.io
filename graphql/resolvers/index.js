const userResolver = require('./users');
const subForumResolver = require('./subforums');
const postResolver = require('./posts');
const commentResolver = require('./comments');
const subscriptionResolver = require('./subscriptions');

module.exports = {
  Post: {
    commentCount: parent => parent.comments.length,
    voteCount: parent => parent.upvotes.length - parent.downvotes.length,
  },
  SubForum: {
    subsCount: parent => parent.subscribers.length,
  },
  Profile: {
    age: parent => {
      const birthdate = new Date(parent.birthdate);
      const ageDiffMs = Date.now() - birthdate.getTime();
      const ageDate = new Date(ageDiffMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    },
  },
  Query: {
    ...userResolver.Query,
    ...subForumResolver.Query,
    ...postResolver.Query,
    ...subscriptionResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...subForumResolver.Mutation,
    ...postResolver.Mutation,
    ...commentResolver.Mutation,
    ...subscriptionResolver.Mutation,
  },
  Subscription: {
    ...postResolver.Subscription,
  },
};
