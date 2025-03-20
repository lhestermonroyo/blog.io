import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
    }
  }
`;

export const SIGN_UP = gql`
  mutation SignUp($signUpInput: SignUpInput) {
    signUp(signUpInput: $signUpInput) {
      id
      email
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($profileInput: ProfileInput) {
    updateProfile(profileInput: $profileInput) {
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

export const FOLLOW_USER = gql`
  mutation FollowUser($email: String!) {
    followUser(email: $email) {
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
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($postInput: PostInput) {
    createPost(postInput: $postInput) {
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

export const UPDATE_POST = gql`
  mutation UpdatePost($postId: ID!, $postInput: PostInput) {
    updatePost(postId: $postId, postInput: $postInput) {
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

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      success
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
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

export const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
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

export const UPDATE_COMMENT = gql`
  mutation updateComment($postId: ID!, $commentId: ID!, $body: String!) {
    updateComment(postId: $postId, commentId: $commentId, body: $body) {
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

export const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
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
