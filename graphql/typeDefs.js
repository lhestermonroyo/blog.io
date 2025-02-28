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
    coverPhoto: String
    profilePhoto: String
    age: Int
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
  type Follow {
    id: ID!
    follower: ProfileBadge!
    following: ProfileBadge!
  }
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
  input FollowInput {
    following: String!
  }

  type Query {
    # Users
    getProfile: Profile!
    getProfileByEmail(email: String!): Profile!
    # Posts
    getPosts: [Posts]!
    getPostsByCreator(creator: ID!): [Posts]!
    getPostById(postId: ID!): Post!
    # Follows
    getFollowers: [Follow]!
    getFollowing: [Follow]!
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
    followUser(followInput: FollowInput): Follow!
  }

  type Subscription {
    onNewPost: Post!
    onNewComment: Post!
    onLikePost: Post!
  }
`;
