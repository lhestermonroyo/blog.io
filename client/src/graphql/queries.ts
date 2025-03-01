import { gql } from '@apollo/client';

export const GET_PROFILE = gql`
  query GetProfile {
    getProfile {
      id
      email
      firstName
      lastName
      birthdate
      location
      pronouns
      bio
      coverPhoto
      profilePhoto
      age
      createdAt
    }
  }
`;

export const GET_PROFILE_BY_EMAIL = gql`
  query GetProfileByEmail($email: String!) {
    getProfileByEmail(email: $email) {
      id
      email
      firstName
      lastName
      birthdate
      location
      pronouns
      bio
      coverPhoto
      profilePhoto
      age
      createdAt
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      id
      title
      content
      tags
      creator {
        id
        email
        firstName
        lastName
        profilePhoto
      }
      likeCount
      commentCount
      isLiked
      isCommented
      createdAt
    }
  }
`;

export const GET_POSTS_BY_TAGS = gql`
  query GetPostsByTags($tags: [String!]!) {
    getPostsByTags(tags: $tags) {
      id
      title
      content
      tags
      creator {
        id
        email
        firstName
        lastName
        profilePhoto
      }
      likeCount
      commentCount
      isLiked
      isCommented
      createdAt
    }
  }
`;

export const GET_POSTS_BY_CREATOR = gql`
  query GetPostsByCreator($creator: ID!) {
    getPostsByCreator(creator: $creator) {
      id
      title
      content
      tags
      creator {
        id
        email
        firstName
        lastName
        profilePhoto
      }
      likeCount
      commentCount
      isLiked
      isCommented
      createdAt
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query GetPostById($postId: ID!) {
    getPostById(postId: $postId) {
      id
      title
      content
      tags
      creator {
        id
        email
        firstName
        lastName
        profilePhoto
      }
      comments {
        id
        body
        commentor {
          id
          email
          firstName
          lastName
          profilePhoto
        }
        isEdited
        createdAt
      }
      likes {
        id
        liker {
          id
          email
          firstName
          lastName
          profilePhoto
        }
        createdAt
      }
      commentCount
      likeCount
      createdAt
    }
  }
`;
