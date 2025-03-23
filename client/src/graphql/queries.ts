import { gql } from '@apollo/client';

export const GET_PROFILE = gql`
  query GetProfile {
    getProfile {
      id
      email
      firstName
      lastName
      pronouns
      title
      location
      birthdate
      bio
      age
      avatar
      coverPhoto
      socials {
        facebook
        twitter
        instagram
        linkedin
        github
        website
      }
      tags
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
      pronouns
      title
      location
      birthdate
      bio
      age
      avatar
      coverPhoto
      socials {
        facebook
        twitter
        instagram
        linkedin
        github
        website
      }
      tags
      createdAt
    }
  }
`;

export const GET_STATS_BY_EMAIL = gql`
  query GetStatsByEmail($email: String!) {
    getStatsByEmail(email: $email) {
      email
      followers {
        count
        list {
          id
          email
          firstName
          lastName
          avatar
        }
      }
      following {
        count
        list {
          id
          email
          firstName
          lastName
          avatar
        }
      }
      posts {
        count
        list {
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
          saveCount
          createdAt
        }
      }
      savedPosts {
        count
        list {
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
          saveCount
          createdAt
        }
      }
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
        saveCount
        createdAt
      }
    }
  }
`;

export const GET_POSTS_BY_FOLLOWING = gql`
  query GetPostsByFollowing($limit: Int) {
    getPostsByFollowing(limit: $limit) {
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
        saveCount
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
        saveCount
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
        saveCount
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
      saves {
        id
        user {
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
      saveCount
      isLiked
      isCommented
      isSaved
      createdAt
    }
  }
`;

export const GET_TAGS = gql`
  query GetTags {
    getTags
  }
`;
