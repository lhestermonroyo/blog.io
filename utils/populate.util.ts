const profileBadgeProj = '_id email firstName lastName avatar';
const postBadgeProj = '_id title';

// Post Model
const populatePost = [
  {
    path: 'creator',
    model: 'User',
    select: profileBadgeProj
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
    path: 'comments',
    model: 'Comment',
    populate: [
      {
        path: 'commentor',
        model: 'User',
        select: profileBadgeProj
      },
      {
        path: 'replies',
        populate: [
          { path: 'replier', model: 'User', select: profileBadgeProj },
          {
            path: 'likes.liker',
            model: 'User',
            select: profileBadgeProj
          }
        ]
      },
      {
        path: 'likes.liker',
        model: 'User',
        select: profileBadgeProj
      }
    ]
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
];

const populateComment = [
  {
    path: 'comments',
    model: 'Comment',
    populate: [
      {
        path: 'commentor',
        model: 'User',
        select: profileBadgeProj
      },
      {
        path: 'replies',
        populate: [
          { path: 'replier', select: profileBadgeProj },
          { path: 'likes.liker', select: profileBadgeProj }
        ]
      },
      { path: 'likes.liker', select: profileBadgeProj }
    ]
  }
];

// Notification Model
const populateNotification = [
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
];

export {
  profileBadgeProj,
  postBadgeProj,
  populatePost,
  populateComment,
  populateNotification
};
