import { gql } from '@apollo/client';

export const ON_NEW_NOTIFICATION = gql`
  subscription OnNewNotification {
    onNewNotification {
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
