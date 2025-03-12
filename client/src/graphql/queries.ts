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
      avatar
      coverPhoto
      tags
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
      avatar
      coverPhoto
      tags
      age
      createdAt
    }
  }
`;

export const GET_FOLLOWS_BY_EMAIL = gql`
  query GetFollowsByEmail($email: String!) {
    getFollowsByEmail(email: $email) {
      email
      followers {
        id
        email
        firstName
        lastName
        avatar
      }
      following {
        id
        email
        firstName
        lastName
        avatar
      }
      followersCount
      followingCount
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts($limit: Int) {
    getPosts(limit: $limit) {
      totalCount
      currentCount
      posts {
        id
        title
        content
        tags
        creator {
          id
          email
          firstName
          lastName
          avatar
        }
        likeCount
        commentCount
        isLiked
        isCommented
        createdAt
      }
    }
  }
`;

export const GET_POSTS_BY_TAGS = gql`
  query GetPostsByTags($tags: [String!]!, $limit: Int) {
    getPostsByTags(tags: $tags, limit: $limit) {
      totalCount
      currentCount
      posts {
        id
        title
        content
        tags
        creator {
          id
          email
          firstName
          lastName
          avatar
        }
        likeCount
        commentCount
        isLiked
        isCommented
        createdAt
      }
    }
  }
`;

export const GET_POSTS_BY_CREATOR = gql`
  query GetPostsByCreator($creator: ID!, $limit: Int) {
    getPostsByCreator(creator: $creator, limit: $limit) {
      totalCount
      currentCount
      posts {
        id
        title
        content
        tags
        creator {
          id
          email
          firstName
          lastName
          avatar
        }
        likeCount
        commentCount
        isLiked
        isCommented
        createdAt
      }
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
        avatar
      }
      comments {
        id
        body
        commentor {
          id
          email
          firstName
          lastName
          avatar
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
          avatar
        }
        createdAt
      }
      commentCount
      likeCount
      createdAt
    }
  }
`;

export const GET_TAGS = gql`
  query GetTags {
    getTags
  }
`;
