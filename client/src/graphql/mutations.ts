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

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
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

export const SAVE_POST = gql`
  mutation SavePost($postId: ID!) {
    savePost(postId: $postId) {
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

export const GET_SEARCH_RESULTS = gql`
  mutation GetSearchResults($query: String!) {
    getSearchResults(query: $query) {
      totalCount
      users {
        id
        email
        firstName
        lastName
        avatar
      }
      tags
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

export const MARK_AS_READ = gql`
  mutation MarkAsRead($notificationId: ID!) {
    markAsRead(notificationId: $notificationId) {
      unreadCount
      notification {
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
        isRead
        message
        createdAt
      }
    }
  }
`;
