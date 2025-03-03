const { gql } = require('graphql-tag');

module.exports = gql`
  enum PhotoType {
    COVER
    PROFILE
  }
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
    birthdate: String
    location: String
    pronouns: String
    bio: String
    tags: [String]!
    coverPhoto: String
    profilePhoto: String
    age: Int
    postCount: Int
    createdAt: String!
  }
  type ProfileBadge {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    profilePhoto: String
  }
  # Posts
  type Posts {
    totalCount: Int!
    currentCount: Int!
    posts: [PostItem]!
  }
  type PostItem {
    id: ID!
    title: String!
    content: String!
    creator: ProfileBadge!
    tags: [String]!
    likeCount: Int!
    commentCount: Int!
    isLiked: Boolean!
    isCommented: Boolean!
    createdAt: String!
  }
  type Post {
    id: ID!
    title: String!
    content: String!
    tags: [String]!
    creator: Profile!
    comments: [Comment]!
    likes: [Like]!
    commentCount: Int!
    likeCount: Int!
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
  # Follows
  type Follows {
    email: String!
    followers: [ProfileBadge]!
    following: [ProfileBadge]!
    followersCount: Int!
    followingCount: Int!
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
    birthdate: String!
    location: String!
    pronouns: String
    bio: String
  }
  input ProfilePhotoInput {
    type: PhotoType!
    photoUri: String!
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
    getPostsByCreator(creator: ID!, limit: Int): Posts!
    getPostsByTags(tags: [String]!, limit: Int): Posts!
    getPostById(postId: ID!): Post!
    # Follows
    getFollowsByEmail(email: String!): Follows!
    # Tags
    getTags: [String]!
  }

  type Mutation {
    # Users
    signUp(signUpInput: SignUpInput): Session!
    login(email: String!, password: String!): Session!
    logout: Status!
    updateProfile(profileInput: ProfileInput): Profile!
    updateProfilePhoto(profilePhotoInput: ProfilePhotoInput): Profile!
    # Posts
    createPost(postInput: PostInput): Post!
    updatePost(postId: ID!, postInput: PostInput): Post!
    deletePost(postId: ID!): Status!
    # Comments
    createComment(postId: ID!, body: String!): Post!
    updateComment(postId: ID!, commentId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    # Likes
    likePost(postId: ID!): Post!
    # Follows
    followUser(email: String): Follows!
    # Tags
    assignTags(tags: [String]!): Profile
  }

  type Subscription {
    onNewPost: Post!
    onNewComment: Post!
    onLikePost: Post!
  }
`;
