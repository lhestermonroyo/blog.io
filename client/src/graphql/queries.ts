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

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    getNotifications {
      unreadCount
      list {
        id
        type
        user {
          id
          email
          firstName
          lastName
          avatar
        }
        sender {
          id
          email
          firstName
          lastName
          avatar
        }
        latestUser {
          id
          email
          firstName
          lastName
          avatar
        }
        post {
          id
          title
        }
        comment
        isRead
        message
        createdAt
      }
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
  query GetPosts($limit: Int, $offset: Int) {
    getPosts(limit: $limit, offset: $offset) {
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
  query GetPostsByFollowing($limit: Int, $offset: Int) {
    getPostsByFollowing(limit: $limit, offset: $offset) {
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
  query GetPostsByTags($tags: [String!]!, $limit: Int, $offset: Int) {
    getPostsByTags(tags: $tags, limit: $limit, offset: $offset) {
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
        replies {
          id
          body
          replier {
            id
            email
            firstName
            lastName
            avatar
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
      createdAt
    }
  }
`;

export const GET_TAGS = gql`
  query GetTags {
    getTags
  }
`;
