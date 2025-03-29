const userResolver = require('./users');
const postResolver = require('./posts');
const likeResolver = require('./likes');
const commentResolver = require('./comments');
const statResolver = require('./stats');
const searchResolver = require('./search');
const notification = require('./notification');

module.exports = {
  Posts: {
    currentCount: (parent) => parent.posts.length
  },
  PostDetails: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
    saveCount: (parent) => parent.saves.length
  },
  LikeResponse: {
    likeCount: (parent) => parent.likes.length
  },
  CommentResponse: {
    commentCount: (parent) => parent.comments.length
  },
  SaveResponse: {
    saveCount: (parent) => parent.saves.length
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
  SearchResults: {
    totalCount: (parent) =>
      parent.users.length + parent.tags.length + parent.posts.length
  },
  Notifications: {
    unreadCount: (parent) =>
      parent.list.filter((notification) => !notification.isRead).length
  },
  Query: {
    ...userResolver.Query,
    ...postResolver.Query,
    ...statResolver.Query,
    ...notification.Query
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postResolver.Mutation,
    ...likeResolver.Mutation,
    ...commentResolver.Mutation,
    ...statResolver.Mutation,
    ...searchResolver.Mutation,
    ...notification.Mutation
  },
  Subscription: {
    ...postResolver.Subscription,
    ...commentResolver.Subscription,
    ...likeResolver.Subscription,
    ...notification.Subscription
  }
};
