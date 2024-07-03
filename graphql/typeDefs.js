const { gql } = require('graphql-tag');

module.exports = gql`
  # Users
  type User {
    id: ID!
    token: String!
    username: String!
    email: String!
  }
  type Profile {
    id: ID!
    username: String!
    email: String!
    name: String
    birthdate: String
    location: String
    coverPhoto: String
    profilePhoto: String
    age: Int
    karma: Int
    createdAt: String!
  }
  # Subforums
  type SubForum {
    id: ID!
    name: String!
    description: String!
    coverPhoto: String!
    profilePhoto: String!
    creator: Profile!
    subscribers: [Profile]
    subsCount: Int!
    createdAt: String!
  }
  # Posts
  type Post {
    id: ID!
    title: String!
    body: String!
    files: [String]
    creator: Profile!
    subForum: SubForum!
    comments: [Comment]
    upvotes: [String]
    downvotes: [String]
    commentCount: Int!
    voteCount: Int!
    createdAt: String!
  }
  type Comment {
    id: ID!
    body: String!
    creator: Profile!
    upvotes: [String]
    downvotes: [String]
    voteCount: Int!
    createdAt: String!
  }
  # Inputs
  input SignUpInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  input ProfileInput {
    name: String
    birthdate: String
    location: String
    coverPhoto: String
    profilePhoto: String
  }
  input SubForumInput {
    name: String!
    description: String!
    location: String!
    coverPhoto: String!
    profilePhoto: String!
  }
  input PostInput {
    subForum: ID!
    title: String!
    body: String!
    files: [String]
  }

  type Query {
    getOwnProfile: Profile!
    getProfile(username: String!): Profile!
    getSubForums: [SubForum]!
    getSubForum(id: ID!): SubForum!
    getJoinedSubForums: [SubForum]!
    getPosts: [Post]!
    getPost(id: ID!): Post!
  }

  type Mutation {
    signUp(signUpInput: SignUpInput): User!
    login(username: String!, password: String!): User!
    updateProfile(profileInput: ProfileInput): Profile!
    createSubForum(subForumInput: SubForumInput): SubForum!
    editSubForum(subForumId: ID!, subForumInput: SubForumInput): SubForum!
    deleteSubForum(subForumId: ID!): String!
    joinSubForum(subForumId: ID!): SubForum!
    leaveSubForum(subForumId: ID!): SubForum!
    createPost(postInput: PostInput): Post!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    upVotePost(postId: ID!): Post!
    downVotePost(postId: ID!): Post!
    upVoteComment(postId: ID!, commentId: ID!): Post!
    downVoteComment(postId: ID!, commentId: ID!): Post!
  }

  type Subscription {
    onNewPost: Post!
  }
`;
