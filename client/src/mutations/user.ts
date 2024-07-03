import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      token
      username
      email
    }
  }
`;

export const SIGN_UP = gql`
  mutation SignUp($signUpInput: SignUpInput) {
    signUp(signUpInput: $signUpInput) {
      id
      token
      username
      email
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($profileInput: ProfileInput) {
    updateProfile(profileInput: $profileInput) {
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
