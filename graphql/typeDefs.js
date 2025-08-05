const { gql } = require('graphql-tag');

export default gql`
  enum NotificationType {
    new_post
    new_comment
    like_comment
    reply_comment
    like_reply
    like
    save
    follow
  }
  # Users
  type Session {
    id: ID!
    email: String!
  }
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    pronouns: String
    title: String
    location: String
    birthdate: String
    bio: String
    age: Int
    avatar: String
    coverPhoto: String
    socials: Socials
    tags: [String]!
    createdAt: String!
  }
  type Socials {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    github: String
    website: String
  }
  type UserBadge {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    avatar: String
  }

  # Posts
  type Posts {
    totalCount: Int!
    currentCount: Int!
    posts: [PostItem]!
  }
  type PostItem {
    id: ID!
    tags: [String]!
    title: String!
    content: String!
    creator: UserBadge!
    likeCount: Int!
    commentCount: Int!
    saveCount: Int!
    createdAt: String!
  }
  type PostDetails {
    id: ID!
    tags: [String]!
    title: String!
    content: String!
    creator: UserBadge!
    likes: [Like]!
    comments: [Comment]!
    saves: [Save]!
    likeCount: Int!
    commentCount: Int!
    saveCount: Int!
    createdAt: String!
  }
  type Comment {
    id: ID!
    body: String!
    commentor: UserBadge!
    replies: [Reply]!
    likes: [Like]!
    isEdited: Boolean
    createdAt: String!
  }
  type Reply {
    id: ID!
    body: String!
    replier: UserBadge!
    likes: [Like]!
    isEdited: Boolean
    createdAt: String!
  }
  type Like {
    id: ID!
    liker: UserBadge!
    createdAt: String!
  }
  type Save {
    id: ID!
    user: UserBadge!
    createdAt: String!
  }
  type LikeResponse {
    likeCount: Int!
    likes: [Like]!
  }
  type CommentResponse {
    commentCount: Int!
    comments: [Comment]!
  }
  type SaveResponse {
    saveCount: Int!
    saves: [Save]!
  }

  # Stats
  type Stats {
    email: String!
    followers: StatUserBadge!
    following: StatUserBadge!
    posts: StatPostItem!
    savedPosts: StatPostItem!
  }
  type FollowResponse {
    followers: StatUserBadge!
    following: StatUserBadge!
  }
  type StatPostItem {
    count: Int!
    list: [PostItem]!
  }
  type StatUserBadge {
    count: Int!
    list: [UserBadge]!
  }

  # Search
  type SearchResults {
    totalCount: Int!
    users: [UserBadge]!
    tags: [String]!
    posts: [PostItem]!
  }

  # Notifications
  type Notifications {
    unreadCount: Int!
    list: [NotificationDetails]!
  }
  type NotificationDetails {
    id: ID!
    type: NotificationType!
    user: UserBadge!
    sender: UserBadge!
    latestUser: [UserBadge]!
    post: PostBadge
    comment: String
    isRead: Boolean!
    message: String!
    createdAt: String!
  }
  type NotificationResponse {
    unreadCount: Int!
    notification: NotificationDetails
  }
  type PostBadge {
    id: ID!
    title: String!
  }

  # Status
  type Status {
    success: Boolean!
  }

  # Inputs
  input SignUpInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  input UpdateUserInput {
    firstName: String
    lastName: String
    pronouns: String
    title: String
    location: String
    birthdate: String
    bio: String
    avatar: String
    coverPhoto: String
    socials: SocialsInput
    tags: [String]
  }
  input SocialsInput {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    github: String
    website: String
  }
  input PostInput {
    title: String!
    content: String!
    tags: [String]!
  }

  type Query {
    # Users
    getUserProfile: User!
    getUserProfileByEmail(email: String!): User!
    # Posts
    getPosts(limit: Int, offset: Int): Posts!
    getPostsByTags(tags: [String]!, limit: Int, offset: Int): Posts!
    getPostsByFollowing(limit: Int, offset: Int): Posts!
    getPostsByCreator(creator: ID!, limit: Int): Posts!
    getPostById(postId: ID!): PostDetails!
    getTags: [String]!
    # Follows
    getStatsByEmail(email: String!): Stats!
    # Notifications
    getNotifications: Notifications!
  }

  type Mutation {
    # Users
    signUp(signUpInput: SignUpInput): Session!
    signUpWithGoogle(idToken: String!): Session!
    login(email: String!, password: String!): Session!
    loginWithGoogle(idToken: String!): Session!
    logout: Status!
    changePassword(oldPassword: String!, newPassword: String!): Status!
    updateUser(updateUserInput: UpdateUserInput): User!
    # Posts
    createPost(postInput: PostInput): PostDetails!
    updatePost(postId: ID!, postInput: PostInput): PostDetails!
    deletePost(postId: ID!): Status!
    savePost(postId: ID!): SaveResponse!
    # Comments
    createComment(postId: ID!, body: String!): CommentResponse!
    likeComment(postId: ID!, commentId: ID!): CommentResponse!
    updateComment(postId: ID!, commentId: ID!, body: String!): CommentResponse!
    deleteComment(postId: ID!, commentId: ID!): CommentResponse!
    createReply(postId: ID!, commentId: ID!, body: String!): CommentResponse!
    likeReply(postId: ID!, commentId: ID!, replyId: ID!): CommentResponse!
    updateReply(
      postId: ID!
      commentId: ID!
      replyId: ID!
      body: String!
    ): CommentResponse!
    deleteReply(postId: ID!, commentId: ID!, replyId: ID!): CommentResponse!
    # Likes
    likePost(postId: ID!): LikeResponse!
    # Stats
    followUser(email: String): FollowResponse!
    # Search
    getSearchResults(query: String!): SearchResults
    # Notifications
    markAsRead(notificationId: ID!): NotificationResponse!
  }

  type Subscription {
    onNewPost: PostDetails!
    onNewComment: PostDetails!
    onLikePost: PostDetails!
    onNewNotification: NotificationResponse!
  }
`;
