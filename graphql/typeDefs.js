const { gql } = require('graphql-tag');

module.exports = gql`
  # Users
  type Session {
    id: ID!
    email: String!
  }
  type Profile {
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
  type ProfileBadge {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    avatar: String
  }
  type Socials {
    facebook: String
    twitter: String
    instagram: String
    linkedin: String
    github: String
    website: String
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
    creator: ProfileBadge!
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
    creator: Profile!
    likes: [Like]!
    comments: [Comment]!
    saves: [Save]!
    likeCount: Int!
    commentCount: Int!
    saveCount: Int!
    isLiked: Boolean!
    isCommented: Boolean!
    isSaved: Boolean!
    createdAt: String!
  }
  type Comment {
    id: ID!
    body: String!
    commentor: ProfileBadge!
    isEdited: Boolean
    createdAt: String!
  }
  type Like {
    id: ID!
    liker: ProfileBadge!
    createdAt: String!
  }
  type Save {
    id: ID!
    user: ProfileBadge!
    createdAt: String!
  }
  # Stats
  type Stats {
    email: String!
    followers: StatProfileBadge!
    following: StatProfileBadge!
    posts: StatPostItem!
    savedPosts: StatPostItem!
  }
  type FollowResponse {
    followers: StatProfileBadge!
    following: StatProfileBadge!
  }
  type StatPostItem {
    count: Int!
    list: [PostItem]!
  }
  type StatProfileBadge {
    count: Int!
    list: [ProfileBadge]!
  }
  # Search
  type SearchResults {
    totalCount: Int!
    users: [ProfileBadge]!
    tags: [String]!
    posts: [PostItem]!
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
  input ProfileInput {
    firstName: String!
    lastName: String!
    pronouns: String
    title: String
    location: String
    birthdate: String
    bio: String
    avatar: String
    coverPhoto: String
    socials: SocialsInput!
    tags: [String]!
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
    getProfile: Profile!
    getProfileByEmail(email: String!): Profile!
    # Posts
    getPosts(limit: Int): Posts!
    getPostsByTags(tags: [String]!, limit: Int): Posts!
    getPostsByFollowing(limit: Int): Posts!
    getPostsByCreator(creator: ID!, limit: Int): Posts!
    getPostById(postId: ID!): PostDetails!
    getTags: [String]!
    # Follows
    getStatsByEmail(email: String!): Stats!
  }

  type Mutation {
    # Users
    signUp(signUpInput: SignUpInput): Session!
    login(email: String!, password: String!): Session!
    logout: Status!
    changePassword(oldPassword: String!, newPassword: String!): Status!
    updateProfile(profileInput: ProfileInput): Profile!
    # Posts
    createPost(postInput: PostInput): PostDetails!
    updatePost(postId: ID!, postInput: PostInput): PostDetails!
    deletePost(postId: ID!): Status!
    savePost(postId: ID!): PostDetails!
    # Comments
    createComment(postId: ID!, body: String!): PostDetails!
    updateComment(postId: ID!, commentId: ID!, body: String!): PostDetails!
    deleteComment(postId: ID!, commentId: ID!): PostDetails!
    # Likes
    likePost(postId: ID!): PostDetails!
    # Stats
    followUser(email: String): FollowResponse!
    # Search
    getSearchResults(query: String!): SearchResults
  }

  type Subscription {
    onNewPost: PostDetails!
    onNewComment: PostDetails!
    onLikePost: PostDetails!
  }
`;
