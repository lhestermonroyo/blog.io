import { gql } from '@apollo/client';

export const GET_OWN_PROFILE = gql`
  query GetOwnProfile {
    getOwnProfile {
      id
      username
      email
      name
      birthdate
      location
      coverPhoto
      profilePhoto
      age
      karma
      createdAt
    }
  }
`;
